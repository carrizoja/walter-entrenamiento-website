## Why

Production at `walterentrenamiento-web.vercel.app/bienestar` returns HTTP 500 `FUNCTION_INVOCATION_FAILED`. The same SSR pages (`/bienestar`, `/bienestar/[slug]`, `/galeria`, all `/admin/*`) work locally but crash on Vercel. Static prerendering also produces empty content because the build runs without credentials.

Root cause: `src/lib/supabase.ts:5-7` reads credentials with `import.meta.env.PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`. Vite/Astro replaces these expressions at **build time**. The Vercel project has these variables marked as "Sensitive" (visible in the Production Environment Variables panel), and Vercel's Sensitive variables are deliberately **not exposed at build time** — only at runtime. The build therefore inlines `undefined`, the SSR module then runs `createClient(undefined, undefined)` at request time, supabase-js throws "supabaseUrl is required", and the serverless function crashes before any try/catch in `bienestar.astro` / `galeria.astro` can run.

Fixing this in code (rather than asking the user to unmark "Sensitive") is the right move because (a) the SERVICE_ROLE_KEY *should* stay sensitive — inlining it into build artifacts is a real security regression, and (b) any future env var change on Vercel won't require a code-side audit.

## What Changes

- Switch `src/lib/supabase.ts` to read env vars at **runtime** via `process.env.*` first, with `import.meta.env.*` as a fallback for local `npm run dev` (where Astro/Vite only populates `import.meta.env`, not `process.env`).
- Validate the three required vars at module load and throw a descriptive `Error` listing the missing keys, so the next deploy fails fast with a clear message in `vercel logs` instead of a generic supabase-js error deep in a request.
- Update CLAUDE.md's "Supabase integration" section to state that env vars are read at runtime and that the "Sensitive" flag in Vercel is supported.
- No schema, RLS, page markup, or component changes. The fix is one file (`src/lib/supabase.ts`) plus a docs note.

## Capabilities

### New Capabilities
- `supabase-env-access`: How the app reads Supabase credentials so SSR pages and admin handlers work in any deployment environment (Vercel runtime-only Sensitive vars, plain Vercel vars, local `.env` dev), and how missing credentials surface.

### Modified Capabilities
<!-- None. `bienestar-content` and `galeria-content` describe content-delivery requirements that are unchanged; only the implementation that satisfies them is fixed. `admin-auth` is similarly unaffected at the spec level. -->

## Impact

- **Code**: One file — `src/lib/supabase.ts` — switches three lines of env access. No exported API changes; `supabase`, `supabaseAdmin`, and `createServerSupabaseClient` keep their existing signatures.
- **Build**: No breaking change. Vite still treats `import.meta.env.X` as a build-time expression (used as fallback for dev). Production builds on Vercel will read the runtime values via `process.env` and stop relying on build-time inlining.
- **Security**: `SUPABASE_SERVICE_ROLE_KEY` no longer needs to be available at build time, so it can stay marked Sensitive in Vercel and is never inlined into a build artifact. This is a security improvement over the current behaviour-when-it-worked path.
- **Docs**: Small update to CLAUDE.md. No `.env`, `vercel.json`, or `astro.config.mjs` change.
- **Verification**: Requires a Vercel preview deploy to confirm `/bienestar` returns 200 and the article list is non-empty (assuming the `articles` table has `published = true` rows).
