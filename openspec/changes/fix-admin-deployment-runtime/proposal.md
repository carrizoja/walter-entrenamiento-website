## Why

The deployed `/admin` route is returning a platform `500`, which blocks access to the site's content management area in production. This needs to be fixed now because the admin workflow depends on server-side auth and Firebase runtime configuration that currently behaves differently after deployment than it does locally.

## What Changes

- Fix the deployed admin runtime so `/admin` and `/admin/login` work reliably on supported hosts.
- Align the admin authentication flow and dashboard rendering with the actual Firebase-based implementation instead of the outdated spec assumptions.
- Add controlled fallback behavior for admin route failures caused by missing or invalid server configuration.
- Update deployment guidance for the server-side variables and runtime expectations required by admin routes.

## Capabilities

### New Capabilities
- `admin-dashboard`: Covers the authenticated `/admin` dashboard route, including production-safe rendering of summary metrics and failure handling.

### Modified Capabilities
- `admin-auth`: Update the admin auth requirements so deployed `/admin` and `/admin/login` routes use the current Firebase session flow and fail gracefully instead of returning platform 500 errors.

## Impact

- **Pages**: `src/pages/admin/index.astro`, `src/pages/admin/login.astro`, and possibly other `/admin/**` routes that share the same auth/runtime path
- **Auth/runtime**: `src/lib/auth.ts`, `src/lib/firebase.ts`, `src/lib/firebase-admin.ts`, and related server/client environment handling
- **Data access**: admin dashboard Firestore count queries
- **Docs**: deployment and environment setup guidance for Vercel and Netlify
