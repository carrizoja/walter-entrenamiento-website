## Context

The admin area is intentionally request-time rendered because it depends on session cookies, protected routes, and server-only Firebase Admin access. Unlike the public Bienestar and Galeria pages, `/admin` cannot simply be converted to static output. The deployed failure therefore points to runtime configuration or runtime error handling inside the admin auth/dashboard path rather than to prerendering itself.

The current OpenSpec `admin-auth` capability still describes the old Supabase flow, while the code now uses Firebase Auth plus Firebase Admin session cookies. The `/admin` dashboard also performs Firestore count queries during server rendering, but that behavior is not captured in any current spec.

## Goals / Non-Goals

**Goals:**
- Make `/admin` and `/admin/login` accessible in deployed environments when required Firebase config is present.
- Prevent admin routes from surfacing opaque platform 500s when auth or Firebase server configuration is missing or invalid.
- Bring the admin auth spec in line with the actual Firebase-based implementation.
- Define and stabilize the `/admin` dashboard behavior for authenticated and misconfigured deployments.

**Non-Goals:**
- Replacing Firebase auth with another provider.
- Redesigning the admin UI.
- Changing article or gallery CRUD workflows beyond what is needed to keep admin routing operational.

## Decisions

- Keep admin routes on request-time rendering with `prerender = false`. Rationale: admin pages require cookies, protected access, and request-specific auth checks. Alternative considered: prerender admin chrome and defer data client-side. Rejected because auth gating still requires a server-side path and would add unnecessary complexity.
- Harden admin auth/runtime initialization so missing Firebase config results in controlled redirects or explicit admin error states instead of uncaught runtime failures. Rationale: this directly addresses the deployed `500` symptom without weakening route protection. Alternative considered: assume deployment variables are always present and only update docs. Rejected because the current production failure shows runtime safeguards are needed.
- Define the admin dashboard as its own capability. Rationale: `/admin` has concrete behavior beyond route guarding, including Firestore-backed counts and authenticated rendering, and that behavior needs its own spec coverage. Alternative considered: fold dashboard rules into `admin-auth`. Rejected because it mixes access control with page-specific data behavior.
- Update deployment documentation for both server-only and public Firebase variables required by admin login/runtime code. Rationale: `/admin/login` touches both Firebase web config and Firebase Admin session verification paths, so deploys must set both classes of variables correctly.

## Risks / Trade-offs

- [Risk] Hardening admin runtime may mask configuration defects behind generic login redirects -> Mitigation: log server-side failures clearly while returning a controlled user-facing response.
- [Risk] The admin login page may still fail if client Firebase config is absent because it imports the Firebase web SDK -> Mitigation: document those variables explicitly and consider guarding initialization during implementation.
- [Risk] Dashboard metrics queries may fail independently of auth due to Firestore permissions or Admin SDK initialization -> Mitigation: isolate metric loading from auth checks and provide safe fallback counts or a controlled error state.

## Migration Plan

1. Audit admin auth and dashboard entry points for runtime assumptions that can throw in deployed functions.
2. Harden Firebase initialization and admin route guards so configuration problems return controlled responses.
3. Stabilize `/admin` dashboard metric loading for authenticated requests.
4. Update deployment documentation for the required Firebase variables on Vercel and Netlify.
5. Verify `/admin/login` and `/admin` behavior locally and in a production-style build/deploy flow.

## Open Questions

- Does the deployed `500` occur only on `/admin`, or also on `/admin/login` and other protected admin routes?
- Are all Firebase public and server-side environment variables already configured in Netlify for both build and runtime contexts?
