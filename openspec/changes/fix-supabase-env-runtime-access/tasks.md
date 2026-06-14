## 1. Implement runtime env access

- [x] 1.1 In `src/lib/supabase.ts`, add a `readEnv(name: string): string | undefined` helper that returns `process.env[name]` if set to a non-empty string and not the literal `"undefined"`, otherwise returns `import.meta.env[name]` (using dynamic-key access so Vite does not statically substitute the dev-only fallback)
- [x] 1.2 Replace the three `import.meta.env.PUBLIC_SUPABASE_URL`, `import.meta.env.PUBLIC_SUPABASE_ANON_KEY`, `import.meta.env.SUPABASE_SERVICE_ROLE_KEY` accesses with `readEnv('...')` calls
- [x] 1.3 Add a validation block right after the three reads: if any value is falsy or equals `"undefined"`, throw `new Error(\`Missing Supabase env vars: ${missing.join(', ')}\`)`

## 2. Verify locally

- [ ] 2.1 Run `npm run dev` and load `/`, `/bienestar`, `/galeria` in a browser; confirm no console errors and that `bienestar` shows article cards (assuming `published = true` rows exist) — this proves the `import.meta.env` fallback path still works in dev
- [x] 2.2 Run `npm run build` and confirm the build completes without warnings about undefined env access
- [x] 2.3 Temporarily rename `.env` to `.env.bak` and run `npm run build`; confirm the build itself still completes (validation is now runtime, not build-time) — restore `.env` afterwards
- [x] 2.4 Restart the local static-serve preview (`npx serve .vercel/output/static -p 4322`) and verify `/` and `/contacto` still 200; SSR routes won't render here (no Node runtime), but static routes must still work

## 3. Update documentation

- [x] 3.1 In `CLAUDE.md`, under the "Supabase integration" section, add one short paragraph noting that `src/lib/supabase.ts` reads env vars at runtime (`process.env`) with `import.meta.env` as a dev fallback, and that all three Supabase keys can therefore stay marked "Sensitive" in Vercel

## 4. Deploy and verify on Vercel

- [ ] 4.1 Commit the change on a branch and push to GitHub so Vercel produces a preview deployment
- [ ] 4.2 Once the preview URL is live, hit `https://<preview>/bienestar` — assert HTTP 200 and that the page renders the hero plus at least the empty/featured states without 500
- [ ] 4.3 Hit `https://<preview>/galeria` — assert HTTP 200 and that filter buttons and gallery grid render
- [ ] 4.4 Visit `https://<preview>/admin/login`, log in, and confirm the dashboard loads (`requireAuth` + `supabaseAdmin` both still work)
- [ ] 4.5 Open Vercel project → Functions / Logs and confirm there are no `FUNCTION_INVOCATION_FAILED` errors for the bienestar or galeria invocations during the preview
- [ ] 4.6 Pull a real article slug from Supabase (or insert a test row) and verify `https://<preview>/bienestar/<slug>` returns 200

## 5. Promote to production

- [ ] 5.1 Merge the branch to `main` (or promote the preview deployment in the Vercel dashboard) so production picks up the fix
- [ ] 5.2 Verify `https://walterentrenamiento-web.vercel.app/bienestar` and `/galeria` return 200 with content
- [ ] 5.3 Run `/opsx:archive` on this change once the production deploy is stable
