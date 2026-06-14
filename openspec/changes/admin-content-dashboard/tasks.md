## 1. Supabase project setup

- [ ] 1.1 Create the Supabase project (or confirm the existing one) and copy URL, anon key, and service-role key into `.env` — **Walter / dev to perform in Supabase dashboard**
- [ ] 1.2 Run `supabase-setup.sql` in the Supabase SQL editor to create the `articles` and `gallery_items` tables, RLS policies, and the `updated_at` trigger — **Walter / dev to perform in Supabase SQL editor**
- [ ] 1.3 Create the `article-covers` and `gallery` storage buckets with public read access; restrict writes to the service role — **Walter / dev to perform in Supabase dashboard**
- [ ] 1.4 Provision Walter's admin user in the Supabase Auth dashboard with a strong password — **Walter / dev to perform in Supabase Auth UI**
- [ ] 1.5 Add `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` to the Vercel project (Preview + Production envs) — **Walter / dev to perform in Vercel dashboard**

## 2. Shared library wiring

- [x] 2.1 Verify `src/lib/supabase.ts` exports `supabase`, `supabaseAdmin`, and `createServerSupabaseClient` and that `supabaseAdmin` is never imported from a `client:*` file
- [x] 2.2 Verify `src/lib/auth.ts` exposes `requireAuth(Astro)` that redirects to `/admin/login` when no session is present
- [x] 2.3 Verify `src/lib/queries.ts` provides `listPublishedArticles`, `getArticleBySlug`, `listAllArticles`, `getArticleById`, `createArticle`, `updateArticle`, `deleteArticle`, `listGalleryItems`, `getGalleryItem`, `createGalleryItem`, `updateGalleryItem`, `deleteGalleryItem`, `swapGalleryOrder`
- [x] 2.4 Verify `src/lib/storage.ts` provides `uploadMedia`, `deleteMedia`, `getPublicUrl`, `generateStoragePath` and enforces a 50 MB size cap on `uploadMedia`
- [x] 2.5 Verify `src/types/database.ts` exports `Article` and `GalleryItem` matching the SQL schema

## 3. Admin auth

- [x] 3.1 Implement `src/pages/admin/login.astro` with email/password form, POST handler that calls Supabase Auth via the SSR client, error rendering in Spanish, and redirect-when-already-authenticated
- [x] 3.2 Implement `src/pages/admin/logout.astro` that signs the user out, clears cookies, and redirects to `/admin/login`
- [x] 3.3 Implement `src/layouts/AdminLayout.astro` with sidebar nav (Dashboard, Artículos, Galería, Ver sitio), logout form, and inline styling
- [x] 3.4 Implement `src/pages/admin/index.astro` dashboard showing counts of articles (published / total) and gallery items
- [x] 3.5 Add `requireAuth` to the top of every protected admin page

## 4. Bienestar admin CRUD

- [x] 4.1 Implement `src/pages/admin/articulos/index.astro` listing all articles ordered by `updated_at desc`, with edit and delete controls
- [x] 4.2 Implement `src/pages/admin/articulos/nuevo.astro` with the article form (title, slug, excerpt, content, category, read_time, accent_from, accent_to, featured, published, cover_url upload), POST handler, slug uniqueness check, and storage upload via `uploadMedia`
- [x] 4.3 Implement `src/pages/admin/articulos/[id].astro` for edit and delete: edit form with prefilled values, file replacement deleting the previous cover, delete handler that removes the row and the cover file
- [x] 4.4 Surface DB errors (duplicate slug, missing required field) as form-level Spanish messages without losing user input

## 5. Galería admin CRUD

- [x] 5.1 Implement `src/pages/admin/galeria/index.astro` listing all items ordered by `sort_order asc` with thumbnail/preview, edit, delete, and move-up/move-down controls
- [x] 5.2 Implement `src/pages/admin/galeria/nuevo.astro` with the upload form (media_type, title, description, category, file, optional thumbnail and duration for videos, featured, sort_order), POST handler, and 50 MB size cap surfaced as a form error
- [x] 5.3 Implement `src/pages/admin/galeria/[id].astro` for edit and delete: metadata-only updates, file replacement deleting the previous file, delete handler that removes the row and both `storage_path` and `thumbnail_url` files
- [x] 5.4 Implement `swapGalleryOrder` POST handlers behind the move-up/move-down controls so adjacent rows swap `sort_order` atomically

## 6. Public Bienestar

- [x] 6.1 Add `export const prerender = false` to `src/pages/bienestar.astro` and replace any hard-coded data with `listPublishedArticles(supabase)`; render cards with title, excerpt, category, read_time, cover, and a link to `/bienestar/[slug]`
- [x] 6.2 Add an empty-state message when no articles are published; do not throw on Supabase errors — log and render the empty state
- [x] 6.3 Implement `src/pages/bienestar/[slug].astro` with `prerender = false`, fetching via `getArticleBySlug(supabase, slug)` and 404-ing when no row matches or `published = false`
- [x] 6.4 Apply the article's `accent_from` / `accent_to` to the detail page's hero gradient

## 7. Public Galería

- [x] 7.1 Replace the hard-coded gallery in `src/pages/galeria.astro` with `listGalleryItems(supabase)` ordered by `sort_order asc, created_at desc`
- [x] 7.2 Render photos as `<img>` from `public_url`; render videos with `<video>` using `public_url` and `thumbnail_url` as poster; show `duration` when present
- [x] 7.3 Highlight items where `featured = true` with a distinct visual treatment
- [x] 7.4 Catch Supabase errors and render an empty-state message with HTTP 200

## 8. Verification & deploy

- [x] 8.1 Run `npm run build` locally and confirm zero errors and zero references to `SUPABASE_SERVICE_ROLE_KEY` in `dist/_astro/*.js`
- [ ] 8.2 In a Vercel Preview deployment, log in as Walter, create a draft article, publish it, edit it, unpublish it, and delete it; confirm `/bienestar` reflects each state — **manual smoke test, after env vars are set**
- [ ] 8.3 In the same Preview, upload one photo and one video, edit them, reorder them, and delete them; confirm `/galeria` reflects each state — **manual smoke test**
- [ ] 8.4 Force a Supabase outage (revoke key in `.env` locally) and confirm `/bienestar` and `/galeria` render empty-states instead of 500 — **manual smoke test**
- [ ] 8.5 Promote to production after Walter signs off — **manual deploy step**
