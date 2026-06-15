## Why

The `/bienestar` and `/galeria` public pages work locally but fail after deployment on Netlify and Vercel, which breaks core site navigation for real visitors. This needs to be fixed now because the failure is in production-facing routes and points to a mismatch between the current data-loading approach and the deployment runtime.

## What Changes

- Fix the public Bienestar and Galeria routes so they render successfully in deployed environments as well as local development.
- Align those routes' data-loading strategy with Astro's deployment/runtime model instead of relying on a hosting setup that fails on Netlify and Vercel.
- Preserve graceful fallback behavior for public visitors when content data cannot be loaded at runtime.
- Update deployment-related configuration or documentation needed to keep these routes working consistently across supported hosts.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `bienestar-content`: Change the public Bienestar requirements so `/bienestar` and related public article routes remain accessible in deployed environments with a deployment-safe runtime/data-loading path.
- `galeria-content`: Change the public Galeria requirements so `/galeria` remains accessible in deployed environments with a deployment-safe runtime/data-loading path.

## Impact

- **Pages**: `src/pages/bienestar.astro`, `src/pages/bienestar/[slug].astro`, and `src/pages/galeria.astro`
- **Data access**: shared content query/runtime code under `src/lib/`
- **Deployment config**: `astro.config.mjs` and any host-specific runtime expectations
- **Docs**: deployment or environment setup guidance if the fix depends on runtime configuration
