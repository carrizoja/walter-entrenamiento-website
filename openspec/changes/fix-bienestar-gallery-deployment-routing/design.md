## Context

The project defaults to `output: 'static'`, but the Bienestar and Galeria public pages currently opt out of prerendering and depend on request-time execution. That works locally, but both deployed hosts reported failures when requesting `/bienestar` and `/galeria`, which indicates the current runtime path is not portable or not reliably configured across hosts.

These routes are public read-only content pages. They do not need per-request auth or form handling, so they are good candidates for build-time generation instead of host-specific SSR. The current data layer already centralizes content reads in `src/lib/queries.ts`, which gives the implementation a single place to harden content access.

## Goals / Non-Goals

**Goals:**
- Make `/bienestar` and `/galeria` render successfully on deployed static hosts as well as local development.
- Keep public content navigation working without depending on fragile request-time SSR behavior.
- Preserve public fallback behavior when content cannot be loaded.
- Keep admin editing flows on the server-only Firebase Admin path.

**Non-Goals:**
- Redesigning the Bienestar or Galeria UI.
- Changing the content schema in Firestore.
- Reworking admin authentication or admin CRUD routes.

## Decisions

- Render public Bienestar and Galeria content through build-time generation rather than request-time SSR. Rationale: these pages are read-only public pages, and static output is the most portable option across Netlify and Vercel. Alternative considered: keep SSR and fix adapter/runtime configuration per host. Rejected because it preserves the same host-coupled failure mode and increases deployment complexity.
- Prerender public Bienestar article detail pages from the same published content set when article detail links are part of the public experience. Rationale: it avoids mixing static list pages with runtime-only detail pages and keeps direct article URLs portable. Alternative considered: leave detail pages on SSR. Rejected because it would leave part of the public Bienestar flow exposed to the same deployment class of failure.
- Keep Firebase Admin reads on the server/build side only, but make the query path fail predictably when credentials are missing or invalid. Rationale: the current public pages already use server-side queries, and hardening that path is a smaller change than rebuilding public rendering around a client-side Firestore data layer.
- Document the build-time environment requirements for public content generation. Rationale: if deployed builds need Firebase credentials to materialize public content, that requirement must be explicit for both Netlify and Vercel. Alternative considered: rely on implicit existing documentation. Rejected because the current failure already shows that implicit runtime assumptions are not sufficient.

## Risks / Trade-offs

- [Risk] Build-time prerendering can make freshly published content appear only after a new deploy -> Mitigation: document that trade-off clearly and keep admin/runtime behavior unchanged so a later incremental-build approach can be added if needed.
- [Risk] Missing Firebase credentials during build could still break page generation -> Mitigation: harden the content query path so public pages fall back to empty-state output instead of causing a platform 500.
- [Risk] Prerendering article detail pages requires enumerating published slugs at build time -> Mitigation: use the existing published-article query as the single source for `getStaticPaths` and verify builds when the collection is empty.

## Migration Plan

1. Remove request-time rendering from the public Bienestar and Galeria routes that do not need SSR.
2. Add build-time path generation for public Bienestar detail pages if those routes are still runtime-only.
3. Harden shared content queries so missing Firebase admin configuration degrades to page-level fallback behavior.
4. Update deployment guidance for the required build-time Firebase variables.
5. Build locally and verify the generated output includes working `/bienestar`, `/galeria`, and public article links.

## Open Questions

- Should public content updates appear immediately after admin publishing, or is redeploy-based freshness acceptable for now?
- Are the same Firebase environment variables already configured in both Netlify and Vercel, or did the two failed deploys differ in build/runtime setup?
