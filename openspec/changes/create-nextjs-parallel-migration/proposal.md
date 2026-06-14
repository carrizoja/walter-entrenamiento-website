## Why

The current Astro deployment is still failing on Vercel, and the project now depends on request-time Firebase-backed routes that need predictable server deployment behavior. Building a parallel Next.js version in a separate directory reduces deployment risk, lets us validate the Firebase flows in a framework with a more standard Vercel SSR path, and avoids overwriting the working local Astro codebase.

## What Changes

- Create a new Next.js application in a separate directory within the repository so the Astro app remains intact during migration.
- Rebuild the public site pages and Firebase-backed Bienestar and Galeria flows in the new Next.js app.
- Reuse the current Firebase configuration, data model, and content collections instead of creating a new backend.
- Add a migration path for shared assets, styles, and components where reuse is practical.
- Define a side-by-side verification process so the Next.js app can be compared against the existing site before any cutover.
- **BREAKING**: If adopted as the production app later, the deployment target and primary framework for the site will change from Astro to Next.js.

## Capabilities

### New Capabilities
- `nextjs-parallel-app`: Covers creating and wiring a separate Next.js application alongside the Astro app.
- `firebase-nextjs-integration`: Covers using the existing Firebase Auth, Firestore, and Storage setup from the new Next.js app.
- `astro-to-nextjs-parity`: Covers rebuilding the current public pages and content-driven behavior so the new app can match the existing site before cutover.

### Modified Capabilities
- None

## Impact

- **Code**: Adds a second app directory, likely with its own `package.json`, Next.js config, app/router structure, and shared Firebase utilities.
- **Dependencies**: Adds Next.js and its React/Vercel runtime dependencies.
- **Deployment**: Introduces a second deployable app path and may require separate Vercel project settings or a subdirectory build target.
- **Architecture**: The repository will temporarily contain both Astro and Next.js implementations of the site.
