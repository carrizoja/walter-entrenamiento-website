## Context

Astro 6 + Vite v6 reads env vars two distinct ways:

1. `import.meta.env.X` — a **build-time substitution**. Vite's `define` plugin scans for the literal expression and replaces it with the string value during `astro build`. Whatever isn't present at build time becomes the JS literal `undefined`.
2. `process.env.X` — a **runtime read**. In the Astro Vercel adapter's serverless output, the bundled function runs on Node.js and reads `process.env` from whatever Vercel injects at invocation time.

Vercel offers two flavours of env vars: regular and **Sensitive**. Sensitive vars are encrypted at rest and **only decrypted at runtime, not at build time** ([Vercel docs on env vars](https://vercel.com/docs/projects/environment-variables)). The screenshot of this project's Production Environment Variables shows all three Supabase keys (`PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) marked with the "Sensitive" badge.

Today, `src/lib/supabase.ts:5-7` only uses path (1). Locally, `astro dev` loads `.env` via Vite's `loadEnv` and populates `import.meta.env`, so it works. On Vercel, the build runs without the Sensitive values, inlines them as `undefined`, and the serverless function can never recover at runtime — even though the values *would* be in `process.env` if anyone read them.

Stakeholders: site owner (Walter — `/bienestar` and `/galeria` are part of the public marketing surface), end users hitting 500s, and Walter as admin (whose `/admin/*` routes also use `supabaseAdmin`). All three Supabase clients (`supabase`, `supabaseAdmin`, `createServerSupabaseClient`) flow through the same module, so the fix is centralized.

## Goals / Non-Goals

**Goals:**
- `/bienestar`, `/bienestar/[slug]`, `/galeria`, and `/admin/*` work on Vercel with all three Supabase env vars marked Sensitive.
- `npm run dev` continues to work using `.env` via `import.meta.env`.
- `SUPABASE_SERVICE_ROLE_KEY` is never inlined into a built artifact — it's only read at runtime in the SSR function.
- Missing env vars produce a clear, actionable error message in `vercel logs`, not a deep supabase-js stack trace.

**Non-Goals:**
- No migration to Astro 5+'s `astro:env` schema. That's a larger refactor; the minimal fix is enough to unblock the user. We can revisit later.
- No change to the public/anon vs service-role split, the cookie-based SSR client, or RLS policies. Those are correct.
- No removal of the existing try/catch defensive code in `bienestar.astro` / `galeria.astro` — it now serves a real role: graceful degradation if Supabase is reachable but a query fails.
- No change to the schema, RLS, or any page markup.

## Decisions

### Decision 1: Read `process.env` first, fall back to `import.meta.env`
A single helper `readEnv(name)` returns `process.env[name] ?? import.meta.env[name]`. This:
- Works on Vercel: `process.env.PUBLIC_SUPABASE_URL` is populated at runtime regardless of the Sensitive flag.
- Works in local dev: Vite's `loadEnv` populates `import.meta.env`, so the fallback catches it.
- Survives a future migration where the user might unmark Sensitive — `process.env` would still be populated, no code change needed.

**Alternatives considered:**
- *Read only `process.env`*: rejected. Would break `npm run dev` because Vite doesn't put `.env` values on `process.env` in the Astro dev server (per [Vite docs on env vars](https://vite.dev/guide/env-and-mode)).
- *Read only `import.meta.env`* (current behaviour): rejected. The bug.
- *Tell the user to unmark "Sensitive" in Vercel*: rejected. It works around the symptom but leaves SERVICE_ROLE_KEY inlined into the build, which is a security regression. Code-level fix is the right place.
- *Migrate to `astro:env`*: rejected for now. Adds typed env, but requires reworking imports across the codebase and a config schema. Not justified to fix one bug.

### Decision 2: Validate at module-load, throw descriptive error
After reading the three values, throw `new Error(...)` listing exactly which keys are missing if any are falsy. This converts a confusing supabase-js error from the first network call into a clear startup-time error visible in `vercel logs` and in the dev server console.

**Alternatives considered:**
- *Silent fallback to fake credentials*: rejected. Hides the misconfiguration and produces puzzling behaviour later.
- *Lazy validation on first request*: rejected. Same outcome but later in the request cycle, harder to attribute.

### Decision 3: Dynamic `import.meta.env[name]`
Using `import.meta.env[name]` with a runtime-string key (instead of a literal property access) means Vite won't statically replace it. That's intentional — at runtime in the Vercel function, this falls through harmlessly because `import.meta.env` is a frozen object containing only the build-time values. In dev, it returns the real value from Vite's loadEnv. Net effect: the helper works correctly in both environments without forcing literal expressions into the code.

### Decision 4: Keep the file server-only
`src/lib/supabase.ts` is already imported only by `.astro` frontmatter and admin pages — never by `.tsx` client islands. We keep it that way. `process.env` access is fine in server modules; if anyone ever imports this from a client island, the bundle will fail at build time with a `process is not defined` error, which is the desired safety rail.

## Risks / Trade-offs

- **[Risk]** A code path imports `supabase.ts` from a client component, breaking the client bundle → **Mitigation**: today none do (verified by reading the components and CLAUDE.md). The change doesn't add new imports. If someone later does this, `process.env` is undefined in the browser and the build/load will surface the issue immediately.
- **[Risk]** `process.env.X` returns the string `"undefined"` (Vercel writes literal "undefined" if a var was once set then deleted) → **Mitigation**: the validation step uses `!value` which catches empty strings; we additionally check `value === 'undefined'` to be safe.
- **[Risk]** Module-load error on misconfigured deploy crashes admin pages too → **Mitigation**: that's the intent. A misconfigured deploy should fail loudly so it gets fixed, not silently degrade. The error message lists the missing keys so the operator knows exactly what to set.
- **[Trade-off]** The two-source helper is slightly less idiomatic than `astro:env`. Accepted — minimal blast radius, doesn't preclude a future migration.

## Migration Plan

1. Edit `src/lib/supabase.ts` to use the runtime-first helper and add validation.
2. Update CLAUDE.md's "Supabase integration" section with one paragraph describing the runtime-first read and Sensitive-vars compatibility.
3. `npm run dev` smoke test: home, `/bienestar`, `/galeria` all render with data.
4. `npm run build` smoke test: build completes, `console.warn`/`console.error` not triggered.
5. Push to a branch / Vercel preview deploy.
6. Hit `https://<preview>/bienestar` and `https://<preview>/galeria` — both 200, content visible.
7. Promote to production (or merge to `main` if the project auto-deploys main → production).

**Rollback:** `git revert` the commit. The previous behaviour returns. Or, if needed urgently and the revert isn't desirable, unmark all three vars as Sensitive in Vercel — the original code path will start working again. Both options are non-destructive.

## Open Questions

- Should we add a CI step that fails the build if any required env var is missing? Useful but out of scope for this fix; the runtime validation already catches it on first invocation. **Default**: skip; revisit if misconfiguration recurs.
- Should we expose a typed `env` object instead of three top-level `const`s? Nice-to-have, not necessary for this bug. **Default**: keep three constants for minimal diff.
