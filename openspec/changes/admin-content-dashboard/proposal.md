## Why

Walter currently cannot publish or update Bienestar articles or Galería media without a developer editing code. He needs a self-service, password-protected dashboard so he can manage blog posts and gallery photos/videos directly, with content stored centrally in Supabase and surfaced on the public site.

## What Changes

- Add a password-protected admin area at `/admin` (login, logout, dashboard) using Supabase Auth + cookie-bound SSR sessions.
- Allow Walter to create, edit, publish/unpublish, and delete Bienestar articles (title, slug, excerpt, content, category, cover image, accent colors, featured flag, read time, published flag).
- Allow Walter to upload, edit, reorder, feature, and delete Galería media (photos and videos with title, description, category, thumbnail, duration, sort order, featured flag).
- Persist articles and gallery items in Supabase Postgres tables; persist media binaries in Supabase Storage buckets (`article-covers`, `gallery`).
- Enforce Row Level Security so the public anon role only reads `published = true` articles and all gallery items, while authenticated admin sessions have full read/write access.
- Switch the public Bienestar index, Bienestar article detail page, and Galería page from hard-coded data to live Supabase reads, with graceful degradation if Supabase is unreachable.

## Capabilities

### New Capabilities
- `admin-auth`: Password-based admin sign-in/sign-out, session enforcement, and route guarding for the `/admin` area.
- `bienestar-content`: Server-rendered public listing and detail pages for published Bienestar articles, sourced from Supabase.
- `bienestar-admin`: Admin CRUD UI and POST handlers for Bienestar articles, including cover image upload and publish toggle.
- `galeria-content`: Server-rendered public Galería page sourced from Supabase, ordered by `sort_order`.
- `galeria-admin`: Admin CRUD UI and POST handlers for gallery media, including binary uploads to Supabase Storage and reordering.

### Modified Capabilities
<!-- No existing capabilities have changing requirements; `primary-button` is unaffected. -->

## Impact

- **Code**: `src/pages/admin/**`, `src/pages/bienestar.astro`, `src/pages/bienestar/[slug].astro`, `src/pages/galeria.astro`, `src/layouts/AdminLayout.astro`, `src/lib/supabase.ts`, `src/lib/auth.ts`, `src/lib/queries.ts`, `src/lib/storage.ts`, `src/types/database.ts`.
- **Rendering**: All `/admin/**` pages, `bienestar.astro`, `bienestar/[slug].astro`, and `contacto.astro` opt out of static prerender (`export const prerender = false`).
- **Database**: New Supabase tables `articles` and `gallery_items` with RLS policies and timestamp triggers (see `supabase-setup.sql`).
- **Storage**: New Supabase Storage buckets `article-covers` and `gallery` with public read.
- **Dependencies**: Adds `@supabase/supabase-js` and `@supabase/ssr` to runtime; no new build-time tools.
- **Env vars**: Requires `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` in local `.env` and in Vercel project environment.
- **Operational**: Walter's admin user must be provisioned once via the Supabase Auth dashboard; service-role key must remain server-only.
