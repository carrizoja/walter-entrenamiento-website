# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at localhost:4321
npm run build     # Build production site to ./dist/
npm run preview   # Preview production build locally
npm run astro     # Pass through to the Astro CLI (e.g. `npm run astro check`)
```

There is no test runner, linter, or formatter wired up in `package.json`.

## Stack

**Astro 6 + React 19 + Tailwind CSS v4 + Firebase**, deployed to Vercel. Public marketing site for "Walter Entrenamiento", a personal trainer in Buenos Aires. The site is in Spanish.

- `astro.config.mjs` — `output: 'static'` with the `@astrojs/vercel` adapter and `@tailwindcss/vite`. Hybrid rendering is opt-in per page via `export const prerender = false`.
- `tsconfig.json` — extends `astro/tsconfigs/strict`, JSX configured for React.
- A legacy `tailwind.config.js` exists at the root but is **not used** — Tailwind v4 reads its config from CSS (`src/styles/global.css`) via `@import "tailwindcss"` and `@variant dark (.dark &)`. Do not rely on values from `tailwind.config.js`.

## Rendering model

- Default: static prerendering (the Vercel adapter outputs static assets).
- Any page that needs request-time data, form submission, or auth must declare `export const prerender = false;` at the top of its frontmatter. All `src/pages/admin/**` pages and the public `bienestar.astro`/`bienestar/[slug].astro`/`contacto.astro` pages use this.
- `Astro.request.method === 'POST'` handlers live inline in the page frontmatter (no separate API routes). See `src/pages/admin/articulos/[id].astro` and `src/pages/admin/login.astro`.

## Firebase integration

Firebase is split across two modules:

| Module | Use for |
|---|---|
| `src/lib/firebase.ts` | Firebase web app config for client-compatible auth and Firestore initialization |
| `src/lib/firebase-admin.ts` | Server-only Firebase Admin access for session verification, Firestore admin reads/writes, and Storage |

Required env vars:

- `PUBLIC_FIREBASE_API_KEY`
- `PUBLIC_FIREBASE_AUTH_DOMAIN`
- `PUBLIC_FIREBASE_PROJECT_ID`
- `PUBLIC_FIREBASE_STORAGE_BUCKET`
- `PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `PUBLIC_FIREBASE_APP_ID`
- `FIREBASE_SERVICE_ACCOUNT_KEY` (server-only)

`src/lib/firebase-env.ts` reads env vars at runtime via `process.env` first, with `import.meta.env` fallback for local dev.

Supporting Firebase assets:

- `docs/firebase-setup.md` — console setup, env vars, and verification
- `docs/firestore-migration.md` — Firestore-native import flow
- `firebase/firestore.indexes.json` — composite indexes for the current query patterns
- `firebase/firestore-seed.sample.json` — seed template for `articles` and `gallery_items`
- `scripts/import-firestore-seed.mjs` — import script run with `npm run firestore:import -- <file>`

The data layer is split:

- `src/lib/queries.ts` — article + gallery CRUD against Firestore collections
- `src/lib/storage.ts` — Firebase Storage upload/delete/public URL helpers
- `src/lib/auth.ts` — verifies Firebase session cookies for admin pages
- `src/types/database.ts` — `Article` and `GalleryItem` interfaces matching the document shape used by the app

## Page structure

Public pages (`src/pages/`):
- `index.astro` — Hero, ServicesSection, Contact
- `sobre-walter.astro`, `servicios.astro`, `galeria.astro`, `contacto.astro`
- `bienestar.astro` — blog index, fetches published articles (SSR)
- `bienestar/[slug].astro` — dynamic article detail (SSR)

Admin panel (`src/pages/admin/`, all SSR, all gated by `requireAuth`):
- `login.astro`, `logout.astro`
- `index.astro` — dashboard with counts
- `articulos/index.astro`, `articulos/nuevo.astro`, `articulos/[id].astro`
- `galeria/index.astro`, `galeria/nuevo.astro`, `galeria/[id].astro`

Admin POST handlers do CRUD against Firebase-backed helpers and redirect on success.

## Layouts

- `src/layouts/Layout.astro` — public layout. Includes `<Navbar client:load />`, `<Footer />`, `<AiChatbot />`, dark-mode init `<script is:inline>` (reads `localStorage.theme` before render to prevent FOUC), Tailwind classes for body theme.
- `src/layouts/AdminLayout.astro` — admin shell with sidebar, logout form, "Ver sitio" link. **Inline-styled** (CSS in `style` attributes and a `<style>` block) — does not use the public Layout, Tailwind utility classes, or the global stylesheet. Don't try to make admin pages share styling with the public site.

## Component patterns

- `.astro` files for static/server-rendered markup (sections, cards, layouts, AiChatbot).
- `.tsx` files only when interactivity is required: `Navbar.tsx` (mobile menu), `ThemeToggle.tsx` (dark mode toggle), `PrimaryButton.tsx`. React components used in Astro need a `client:*` directive — `Navbar` uses `client:load`.
- `src/components/ux/PrimaryButton.{astro,tsx}` — both versions exist; prefer the `.tsx` version when used inside a React tree or when click behavior matters. Props: `variant` (`primary | secondary | whatsapp`), `size` (`sm | md | lg`), `icon` (`whatsapp | instagram | arrow`).
- `AiChatbot.astro` is a self-contained floating widget with a pure-JS rule-based responder (Spanish keyword matching, no API calls). Quick-question presets live in `src/data/questions.js`.

## Styling

- Brand palette (used directly as hex throughout): `#FF6B35` (primary orange), `#C83B08` (dark orange), `#701D2A` (dark red), `#8C2A3B` (mid red), `#C56C7A` (light red). Defined as CSS custom properties in `src/styles/global.css` under `:root`.
- Fonts: `font-montserrat` for headings/buttons, `font-quicksand` for body. Loaded from Google Fonts at the top of `global.css`.
- Dark mode: class-based (`.dark` on `<html>`), persisted to `localStorage`, initialized inline in `Layout.astro` before paint. Tailwind v4 dark variant declared as `@variant dark (.dark &)`.
- `global.css` also defines reusable utilities: `.btn-shimmer`, `.gradient-border`, `.glass`, `.glass-dark`, `.section-clip-bottom/top`, animation keyframes (`float`, `pulse-glow`, `whatsapp-pulse`, `scroll-bounce`, `fade-up`, `gradient-shift`, `slow-rotate`) and matching `.animate-*` classes, all gated by `prefers-reduced-motion`.
