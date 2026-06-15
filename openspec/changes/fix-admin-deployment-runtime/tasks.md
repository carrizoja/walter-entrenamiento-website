## 1. Admin Runtime Audit

- [x] 1.1 Reproduce or inspect the deployed `/admin` failure path across `/admin` and `/admin/login` to identify which Firebase initialization or auth checks are throwing in production.
- [x] 1.2 Audit shared admin runtime code in `src/lib/auth.ts`, `src/lib/firebase.ts`, and `src/lib/firebase-admin.ts` for deployment-only failure points.

## 2. Auth And Dashboard Hardening

- [x] 2.1 Harden the Firebase-backed admin login path so missing or invalid configuration returns a controlled non-500 outcome.
- [x] 2.2 Harden protected admin route guards so deployment-time auth verification failures do not crash `/admin/**` routes.
- [x] 2.3 Stabilize `/admin` dashboard metric queries so authenticated requests render fallback dashboard behavior instead of a platform 500 when Firestore access fails.

## 3. Deployment Guidance And Verification

- [x] 3.1 Update deployment documentation for the public and server-side Firebase variables required by admin routes.
- [x] 3.2 Run `npm run build` and verify the admin routes still compile correctly with the request-time setup.
- [x] 3.3 Validate the implemented behavior against the admin auth and admin dashboard spec scenarios, including deployed graceful-failure behavior.
