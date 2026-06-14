## Why

The site currently has no custom 404 page, so any unknown route falls back to Vercel's generic error screen. That breaks the brand experience, strands the visitor without navigation back to the public marketing pages, and is especially likely on `/bienestar/[slug]` where stale links to unpublished or deleted articles will appear in search engines and shared messages.

## What Changes

- Add a static `src/pages/404.astro` page that renders inside the public `Layout.astro` (Navbar, Footer, AiChatbot, dark-mode init) so the experience matches the rest of the site.
- Show a clear Spanish message (heading, supporting copy, large "404") and offer obvious recovery paths: a primary CTA back to `/`, plus secondary links to the most relevant public sections (`/servicios`, `/bienestar`, `/contacto`).
- Set the page `<title>` and `<meta name="description">` appropriately ("Página no encontrada — Walter Entrenamiento") and ensure the response is treated as 404 — Astro's static adapter emits `404.html`, which Vercel serves with a 404 status for unmatched routes; verify this end-to-end on Vercel.
- Reuse the existing brand palette, typography (`font-montserrat` / `font-quicksand`), and `PrimaryButton` component; respect `prefers-reduced-motion` for any decorative animation.
- Make the page work for both unmatched public routes and unmatched dynamic article slugs (`/bienestar/[slug]`), which currently `return Astro.redirect('/404')` or similar would have nothing to land on.

## Capabilities

### New Capabilities
- `not-found-page`: Public 404 page rendered for any unmatched route, providing branded recovery navigation back into the site.

### Modified Capabilities
<!-- None: existing specs (admin-auth, bienestar-*, galeria-*, primary-button) describe unrelated capabilities and their requirements do not change. -->

## Impact

- **Code**: New file `src/pages/404.astro`. No changes to existing pages, layouts, or data layer. May reuse `src/components/ux/PrimaryButton.astro` or `.tsx`.
- **Build / hosting**: `astro build` will emit `dist/404.html`; the `@astrojs/vercel` static adapter wires this up so Vercel serves it with HTTP 404 for unmatched paths. No `vercel.json` changes expected, but verify post-deploy.
- **SEO**: A real 404 (not a soft 200) keeps search engines from indexing dead URLs. The page itself should carry `noindex` via meta robots to be safe.
- **Dependencies / env vars**: None. The page is fully static and does not touch Supabase.
- **Accessibility**: Headings in correct order (h1 for the 404 message), focusable CTAs with descriptive labels, sufficient contrast against both light and dark themes.
