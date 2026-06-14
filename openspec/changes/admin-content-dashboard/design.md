## Context

The Walter Entrenamiento site is an Astro 6 + React 19 + Tailwind v4 marketing site deployed to Vercel as static output. Bienestar (blog) and Galería (gallery) content was originally hard-coded in source. Walter needs to update both without engineering involvement, in Spanish, from any browser.

The repo already has a working Supabase integration (`src/lib/supabase.ts`, `src/lib/auth.ts`, `src/lib/queries.ts`, `src/lib/storage.ts`) and untracked admin pages under `src/pages/admin/**`, plus a `supabase-setup.sql` defining the `articles` and `gallery_items` tables. This change formalizes that work as a versioned spec and pins the contracts the public site and the admin dashboard rely on.

Stakeholders: Walter (sole admin user), the developer (this change's author), and any future contributor reading this spec.

## Goals / Non-Goals

**Goals:**
- One password-protected admin dashboard at `/admin` for full CRUD of Bienestar articles and Galería media.
- Single source of truth for content in Supabase (Postgres + Storage), reachable from both server-rendered public pages and admin pages.
- Hard separation between the anon-key client (public reads) and the service-role client (admin writes); the service-role key never reaches the browser.
- Public pages stay fast: Bienestar list, Bienestar detail, and Galería render server-side with cached Supabase reads and degrade gracefully if Supabase is unavailable.
- Spanish-only UI; works on mobile so Walter can post from his phone.

**Non-Goals:**
- Multi-user roles, comment systems, or article scheduling.
- Rich-text WYSIWYG editor (article `content` is plain Markdown/HTML pasted into a textarea).
- Image transformations or CDN beyond Supabase Storage's public URLs.
- Analytics, draft autosave, version history, or i18n beyond Spanish.
- Public sign-up: only Walter's account exists, provisioned manually in the Supabase dashboard.

## Decisions

### Auth: Supabase Auth (email + password) with `@supabase/ssr` cookie sessions

- **Why**: Supabase Auth ships email/password, JWT, and HTTP-only cookies via `@supabase/ssr`, integrating cleanly with Astro's `Astro.request` + `Astro.cookies`. No third-party auth provider is needed for one user.
- **How**: `createServerSupabaseClient(request, cookies)` from `src/lib/supabase.ts` produces a per-request client. `requireAuth(Astro)` in `src/lib/auth.ts` calls `getUser()` and redirects to `/admin/login` on failure.
- **Alternatives**: Clerk / Auth0 (overkill for one user, extra cost, extra hosted dependency). Custom HMAC cookie + bcrypt'ed env password (foot-gun, no rotation, no audit trail). Rejected.

### Three Supabase clients, picked per request

| Client | Source | Use |
|---|---|---|
| `supabase` | anon key | Public reads from server during prerender / SSR. RLS-enforced. |
| `supabaseAdmin` | service-role key | Admin writes / reads in `/admin/**`. Bypasses RLS. **Server-only.** |
| `createServerSupabaseClient` | `@supabase/ssr` cookie binding | Reading the current session in admin pages. |

- **Why**: Tier-1 isolation. The anon client cannot mutate; the service-role client cannot leak to the browser; the SSR client never touches data, only sessions.
- **Risk**: A developer accidentally importing `supabaseAdmin` into a `client:*` component would ship the service key to browsers. Mitigation: top-of-file comment in `src/lib/supabase.ts`, plus this design doc, plus `astro check` will surface the import in the bundle.

### Rendering: opt-in SSR per page

- **Decision**: Keep `output: 'static'` and the Vercel adapter; add `export const prerender = false` only to admin pages, the bienestar list, the bienestar detail, and contacto. Public pages that don't read DB stay static.
- **Why**: Fastest TTFB for the marketing pages that don't change; SSR cost paid only where dynamic data is needed.
- **Alternative**: Flip the whole site to `output: 'server'`. Rejected — adds latency and cold-start cost to home/servicios/sobre-walter for no gain.

### Data model

Two tables (defined in `supabase-setup.sql`):

- `articles(id uuid pk, title, excerpt, content, category, slug unique, featured, read_time, cover_url, accent_from, accent_to, published bool, created_at, updated_at)`.
- `gallery_items(id uuid pk, title, description, category, media_type check in ('photo','video'), storage_path, public_url, thumbnail_url, duration, featured, sort_order int, created_at)`.

TypeScript types live in `src/types/database.ts` and are exported as `Article` and `GalleryItem`.

- **Why both `storage_path` and `public_url` on gallery_items**: `storage_path` is the canonical location for deletes/moves; `public_url` is what the renderer needs and is denormalized to avoid an extra round-trip on every list render.
- **Why `slug unique` on articles**: required for `/bienestar/[slug]` lookup; must be unique to avoid 500s.

### RLS

- `articles`: anon SELECT allowed when `published = true`; authenticated role has full access. Admin writes go through the service-role client and bypass RLS deliberately, so the policy stays restrictive even if the anon key were misused.
- `gallery_items`: anon SELECT allowed for all rows (gallery is fully public once added); writes only via service role.
- Storage buckets `gallery` and `article-covers` are public-read; writes only via service role.

### Storage layout

- Bucket `article-covers`: `<uuid>-<slugified-name>.<ext>`.
- Bucket `gallery`: `<uuid>-<slugified-name>.<ext>` for both photo and video files.
- `generateStoragePath(file)` in `src/lib/storage.ts` enforces the uuid prefix to prevent name collisions and to keep deletes idempotent.

### POST handling pattern

- All admin mutations use Astro's `Astro.request.method === 'POST'` inline in the page frontmatter (e.g., `admin/articulos/[id].astro`, `admin/login.astro`). No separate `/api/**` routes.
- **Why**: Keeps page state, form, and handler colocated; there is no JSON API consumer beyond the admin's own forms; no duplication of auth checks across files.
- **Trade-off**: Cannot reuse handlers from a SPA. Acceptable: there is no SPA.

### Admin layout is intentionally not Tailwind

- `src/layouts/AdminLayout.astro` uses inline styles + a `<style>` block, not the public site's Layout or `global.css`.
- **Why**: Keeps the admin shell visually distinct (signal: "you are inside the dashboard"), avoids dragging marketing CSS into admin bundles, and decouples admin updates from public-site refactors.
- **Trade-off**: Two design systems to maintain. Acceptable given the admin has ~6 pages and a single user.

### Public-page graceful degradation

- Bienestar list, Bienestar detail, and Galería wrap their Supabase reads in try/catch and render an empty-state ("Pronto publicaremos novedades") instead of throwing on Supabase outages.
- **Why**: The marketing site's availability must not depend on the admin/CMS path. A Supabase incident shouldn't 500 the homepage's "Bienestar" link.

## Risks / Trade-offs

- **Service-role key leak** → Mitigated by isolating it to `supabaseAdmin` (server-only), never importing that symbol from any `client:*` component, never logging it, and storing it as an unprefixed env var (so Astro never inlines it into client bundles).
- **Single admin user / no MFA** → Acceptable for a one-person business. Mitigated by Supabase Auth's brute-force rate limits and a strong password requirement at provisioning.
- **No draft autosave** → Walter could lose a long article if his session times out. Mitigated by setting Supabase JWT expiry generously (default 1h is fine) and by adding a "Guardar como borrador" (`published = false`) button so he can persist often.
- **Storage costs as gallery grows** → Supabase free tier covers ≥1 GB; videos can blow this up. Mitigated by adding a soft size cap (e.g., 50 MB per upload) in the upload form and by recommending Walter compress videos before upload. Hard cap enforced server-side in `uploadMedia`.
- **Slug collisions** → DB constraint will reject the duplicate; admin form must surface the error clearly instead of crashing the page.
- **Supabase outage during prerender** → Static pages are unaffected (no DB calls); only Bienestar/Galería degrade to empty state and recover automatically when Supabase is back.

## Migration Plan

1. Provision Supabase project; run `supabase-setup.sql` in the SQL editor; create the two storage buckets with public-read policies.
2. Create Walter's admin user in the Supabase Auth dashboard with a strong password; share via password manager.
3. Set `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` in `.env` (local) and in Vercel project envs (Preview + Production).
4. Deploy. Walter logs in at `/admin/login`, creates one test article, uploads one test gallery item, verifies they appear on the public pages.
5. Migrate any pre-existing hard-coded articles/gallery items by inserting them through the admin UI.
6. Remove hard-coded fallback data from `bienestar.astro` and `galeria.astro` once Supabase is the source of truth.

**Rollback**: Static pages keep working; admin failure means Walter can't post. Roll back by reverting the deployment in Vercel — public Bienestar/Galería data persists in Supabase regardless.

## Open Questions

- Should we add a "preview as published" mode so Walter can review an article in the public layout before flipping `published = true`? Out of scope for v1; revisit if he asks.
- Do we want signed URLs for gallery videos to discourage hotlinking? Not for v1; public-read is fine for marketing.
