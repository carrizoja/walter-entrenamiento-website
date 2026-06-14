## Context

The site is an Astro 6 + React 19 + Tailwind v4 marketing site deployed to Vercel via the `@astrojs/vercel` static adapter (`output: 'static'`). Public pages live in `src/pages/*.astro` and are wrapped by `src/layouts/Layout.astro`, which provides the `Navbar`, `Footer`, `AiChatbot`, dark-mode init, and base typography. Today, no `src/pages/404.astro` exists, so any unmatched URL is served by Vercel's default error page — visually disconnected from the brand and devoid of a path back into the site.

The static adapter, when given `src/pages/404.astro`, emits `dist/404.html`; Vercel serves that file with HTTP 404 for any unmatched route automatically (per Astro + `@astrojs/vercel` static adapter behavior). No custom routing or middleware is required, and the change is fully compatible with the existing prerender model.

Stakeholders: Walter (site owner, wants visitors to stay engaged on the site), end users (currently stranded on Vercel's generic page), and SEO (correct status code so dead URLs aren't indexed as live).

## Goals / Non-Goals

**Goals:**
- Provide a branded 404 page rendered through the public `Layout.astro` so it looks and behaves like every other public page (Navbar, Footer, AiChatbot, dark mode, brand palette and typography).
- Always offer at least three obvious recovery paths: home, blog (`/bienestar`), and contact (`/contacto`), with the home action as the primary CTA.
- Return an HTTP 404 status (not a soft 200) for unmatched routes.
- Prevent the page from being indexed by adding `<meta name="robots" content="noindex" />`.
- Maintain accessibility: single `<h1>`, focusable links, contrast that passes in light and dark themes, and no motion that violates `prefers-reduced-motion`.

**Non-Goals:**
- No custom 404 styling for the admin panel — `AdminLayout.astro` is intentionally inline-styled and out of scope. If an admin user hits an unknown admin URL, they'll receive the same public 404, which is acceptable for V1 (most admin URLs are linked from the dashboard).
- No analytics instrumentation, A/B testing, or "did you mean…" search suggestions in this iteration.
- No internationalization — Spanish only, matching the rest of the site.
- No changes to `vercel.json`, `astro.config.mjs`, or any data layer (Supabase, queries, storage).

## Decisions

### Decision 1: Use a static `src/pages/404.astro` (not SSR / `prerender = false`)
A static 404 page is the idiomatic Astro pattern with `output: 'static'`, and the page has no request-time data needs. The Vercel static adapter emits `dist/404.html` and Vercel serves it with 404 for unmatched paths.

**Alternatives considered:**
- `prerender = false` SSR 404: rejected — adds a serverless invocation per unknown URL with no benefit, and the page is fully static content.
- `vercel.json` `routes`/`rewrites` to a custom error path: rejected — unnecessary; the static adapter handles this convention out of the box.

### Decision 2: Render through `Layout.astro`
Reuses the Navbar, Footer, AiChatbot, dark-mode init script, fonts, and global styles, so the 404 feels like part of the site rather than a dead-end.

**Alternative considered:** A bespoke minimal layout for the 404. Rejected — more code to maintain, breaks brand consistency, and removes the Navbar (the most direct recovery affordance).

### Decision 3: Reuse `PrimaryButton` for the main CTA
Keeps visual language consistent with `Hero.astro`, `ServicesSection.astro`, etc. The home CTA uses `variant="primary"`; secondary actions render as plain text links styled with the existing brand palette.

**Alternative considered:** Inline custom button markup. Rejected — duplicates styling already encapsulated in `PrimaryButton`.

### Decision 4: `noindex` via `<meta>` injected into `Layout.astro`'s `<head>` from the page
`Layout.astro` does not currently expose a slot in `<head>` for per-page meta. The simplest path is to add the `<meta name="robots" content="noindex">` inline within the 404 page's frontmatter via Astro's `set:html` is not needed — instead, we'll add a small `head` slot to `Layout.astro` (a `<slot name="head" />` inside `<head>`), and the 404 page provides robots meta through it. This is a tiny, backwards-compatible addition usable by future pages.

**Alternatives considered:**
- Add `noindex` globally: rejected — would deindex the entire site.
- Use a separate layout just for the 404: rejected — defeats Decision 2.
- Set robots header via `vercel.json`: rejected — error pages don't go through the same headers config in static mode, and the meta tag is the canonical Astro pattern.

### Decision 5: Visual treatment
Centered hero-style block: large stylized "404" using the brand gradient (`#FF6B35` → `#C83B08` → `#701D2A`), Spanish heading "Página no encontrada", supporting paragraph, primary CTA "Volver al inicio", and a row of secondary links. Background uses the same surface tokens as the other public pages (white in light mode, `#0f0508` in dark mode). Any decorative animation must be gated by `prefers-reduced-motion`, matching the patterns already in `global.css`.

## Risks / Trade-offs

- **[Risk]** Vercel might serve the static `404.html` with a 200 status for some asset-style requests (e.g., a missing image) → **Mitigation**: scope is unmatched HTML routes; verify with a deliberate bad URL after deploy and confirm `curl -I` returns `HTTP/2 404`.
- **[Risk]** Adding a `<slot name="head" />` to `Layout.astro` could subtly affect existing pages → **Mitigation**: the slot is empty by default (no markup unless a page provides content), and we'll smoke-test the home, services, blog index, and a published article to confirm no visual or meta regressions.
- **[Risk]** AiChatbot floats over the CTAs on small screens → **Mitigation**: AiChatbot already uses `position="bottom-right"` with site-wide spacing; verify the 404 layout leaves bottom padding sufficient for the chatbot's footprint, matching what `contacto.astro` does.
- **[Trade-off]** Reusing `Layout.astro` ships the React `Navbar` (`client:load`) and `AiChatbot` JS on the 404 page. This is a minor JS cost on an error page, but it's the same cost as every other public page and preserves consistency. We accept it.
- **[Risk]** Hardcoded Spanish copy ages poorly if i18n is added later → **Mitigation**: out of scope; if i18n lands, the 404 page will be migrated alongside the rest of the site.

## Migration Plan

1. Add `src/pages/404.astro` and (if required for `noindex`) the `<slot name="head" />` to `src/layouts/Layout.astro`.
2. `npm run build` locally; confirm `dist/404.html` exists and renders correctly on `npm run preview`.
3. Deploy a Vercel preview; visit `/__definitely-not-a-real-url` and confirm the page renders with status 404 (`curl -I`).
4. Smoke-test existing public pages on the preview to confirm no regression from the head slot addition.
5. Promote to production.

**Rollback:** Delete `src/pages/404.astro` (and revert the `Layout.astro` slot) and redeploy. Vercel falls back to its default 404. No data, env, or schema implications.

## Open Questions

- Should the 404 page also surface a small "Quizá te interesa" block linking to the latest published article in `/bienestar`? This would require turning the page into SSR (`prerender = false`) and a Supabase read, which contradicts Decision 1. **Default**: ship V1 static; revisit if engagement metrics suggest value.
