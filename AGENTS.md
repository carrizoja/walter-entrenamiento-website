# OpenCode Agent Instructions

This file contains crucial, high-signal context for AI agents working in this repository.

## Stack & Architecture
- **Astro 6 + React 19 + Tailwind CSS v4 + Firebase**. Deployed to Vercel (`@astrojs/vercel` adapter).
- **Rendering Model:** `output: 'static'` by default (prerendered). You MUST add `export const prerender = false;` to the frontmatter of any page that needs request-time data, form submissions (POST), or auth (e.g., all `/admin` routes, dynamic blog posts).
- **API Routes:** There are no standalone API routes. `Astro.request.method === 'POST'` handlers live inline within the page frontmatter (see `src/pages/admin/login.astro`).

## Crucial Framework Quirks & Gotchas
- **Tailwind v4 Config:** The `tailwind.config.js` file at the root is **NOT USED**. Tailwind v4 is configured entirely via CSS in `src/styles/global.css`. Do not modify or rely on `tailwind.config.js`.
- **Admin Styling:** `src/layouts/AdminLayout.astro` and admin pages use **inline styles and `<style>` blocks**. DO NOT use Tailwind utility classes or the global stylesheet for admin pages.
- **Component Patterns:** Use `.tsx` exclusively when interactivity is required (needs `client:*` directive, e.g., `client:load`). Use `.astro` for static/server-rendered markup. Prefer `PrimaryButton.tsx` over the `.astro` version in interactive contexts.

## Firebase & Security Rules
- Use `src/lib/firebase.ts` for public Firebase web app initialization.
- Use `src/lib/firebase-admin.ts` only in server code. Never import it into client-bundled code.
- Admin auth is based on Firebase Auth session cookies verified by `src/lib/auth.ts`.
- Firestore and Storage setup details live in `docs/firebase-setup.md` and `docs/firestore-migration.md`.

**Environment Variables:** Public Firebase web config uses `PUBLIC_FIREBASE_*`. Server-only access uses `FIREBASE_SERVICE_ACCOUNT_KEY`. `src/lib/firebase-env.ts` reads env vars from `process.env` first, with `import.meta.env` fallback for local dev.

## Commands & Tooling
- Start dev server: `npm run dev`
- Build for production: `npm run build`
- Run Astro CLI directly: `npm run astro -- <command>`
- Import Firestore seed data: `npm run firestore:import -- <path-to-seed-json>`
- **Note:** There is currently no test runner, linter, or formatter configured in `package.json`. Rely on standard build verification (`npm run build`) to catch TS/Astro errors.
