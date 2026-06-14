## 1. Layout head slot

- [x] 1.1 Add `<slot name="head" />` inside the `<head>` of `src/layouts/Layout.astro`, placed after the existing `<title>` and theme init script
- [x] 1.2 Smoke-check `src/pages/index.astro`, `servicios.astro`, `bienestar.astro`, and a published `bienestar/[slug].astro` in `npm run dev` to confirm the slot addition causes no visual or `<head>` regression

## 2. 404 page

- [x] 2.1 Create `src/pages/404.astro` that imports and wraps content in `Layout.astro` with `title="Página no encontrada — Walter Entrenamiento"` and a Spanish `description` prop
- [x] 2.2 In the `head` slot, add `<meta name="robots" content="noindex" />`
- [x] 2.3 Render the page body: a single `<h1>` "Página no encontrada", a stylized large "404" using the brand gradient (`#FF6B35` → `#C83B08` → `#701D2A`), and a Spanish supporting paragraph
- [x] 2.4 Add the primary CTA using `src/components/ux/PrimaryButton.astro` with `variant="primary"`, `size="lg"`, label "Volver al inicio", and `href="/"`
- [x] 2.5 Add secondary text links to `/bienestar` ("Bienestar") and `/contacto` ("Contacto"), styled with brand palette and accessible focus states
- [x] 2.6 Ensure layout reserves bottom spacing so the floating `AiChatbot` does not overlap the CTAs on small viewports

## 3. Styling and accessibility

- [x] 3.1 Use `font-montserrat` for headings and `font-quicksand` for body copy, matching the rest of the public site
- [ ] 3.2 Verify color contrast for both light and dark themes (heading, body copy, CTAs, secondary links)
- [x] 3.3 Gate any decorative animation behind `@media (prefers-reduced-motion: reduce)` in `src/styles/global.css` patterns or skip animation entirely
- [x] 3.4 Confirm a single `<h1>` exists and tab order is: Navbar items → primary CTA → secondary links → Footer

## 4. Build and deploy verification

- [x] 4.1 Run `npm run build` and confirm `dist/404.html` is emitted
- [x] 4.2 Run `npm run preview` and verify the 404 page renders correctly at `/404` and for an arbitrary unknown path
- [ ] 4.3 Deploy a Vercel preview and run `curl -I https://<preview>/__definitely-not-real` — assert the response status is `404`
- [ ] 4.4 In the deployed preview, manually test: home → broken URL → "Volver al inicio" round-trip; toggle dark mode; tab through with keyboard; verify Navbar and AiChatbot are present and functional
- [ ] 4.5 View page source on the deployed preview and confirm exactly one `<meta name="robots" content="noindex">` is present

## 5. Promote

- [ ] 5.1 Promote to production once preview verification passes
- [ ] 5.2 Run the same `curl -I` 404 check against the production URL
- [ ] 5.3 Update `openspec/changes/add-404-page/` status and run `/opsx:archive` once the change is live and stable
