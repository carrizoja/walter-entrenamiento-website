## 1. Public Route Rendering

- [x] 1.1 Audit the current Bienestar and Galeria public routes to identify which pages still depend on `prerender = false` or request-time rendering.
- [x] 1.2 Convert `/bienestar` and `/galeria` to a deployment-safe build-time rendering path that works with the project's static-first Astro setup.
- [x] 1.3 Update `/bienestar/[slug]` to use build-time path generation for published articles if it is still runtime-only.

## 2. Content Query Hardening

- [x] 2.1 Harden the shared public content query path so missing or invalid Firebase admin configuration does not crash page generation.
- [x] 2.2 Ensure Bienestar and Galeria pages render controlled empty-state or not-found outcomes instead of platform 500 errors when content reads fail.

## 3. Deployment Guidance And Verification

- [x] 3.1 Update deployment documentation/config guidance for the Firebase variables required during public content generation.
- [x] 3.2 Run `npm run build` and verify the output includes working public Bienestar and Galeria routes.
- [x] 3.3 Validate the final behavior against the spec scenarios for deployed accessibility, article visibility, and graceful fallback behavior.
