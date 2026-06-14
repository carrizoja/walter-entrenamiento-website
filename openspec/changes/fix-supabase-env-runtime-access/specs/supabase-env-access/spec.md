## ADDED Requirements

### Requirement: Runtime-first Supabase credential resolution

The `src/lib/supabase.ts` module SHALL read each required Supabase credential by checking `process.env.<NAME>` first and falling back to `import.meta.env.<NAME>` if `process.env` does not have a non-empty value. The required credential names are `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.

#### Scenario: Production runtime has the var, build did not

- **WHEN** the SSR serverless function runs on Vercel and `process.env.PUBLIC_SUPABASE_URL` is set at runtime, while build-time `import.meta.env.PUBLIC_SUPABASE_URL` was inlined as `undefined` (because the var is marked Sensitive)
- **THEN** the module SHALL use the runtime `process.env` value and `createClient` SHALL receive the correct URL string

#### Scenario: Local dev only has `import.meta.env`

- **WHEN** the developer runs `npm run dev` and Vite has loaded `.env` into `import.meta.env` but `process.env.PUBLIC_SUPABASE_URL` is not populated by Vite
- **THEN** the module SHALL fall back to `import.meta.env.PUBLIC_SUPABASE_URL` and the client SHALL be created with the correct URL

#### Scenario: Both sources present, runtime wins

- **WHEN** both `process.env.X` and `import.meta.env.X` contain a non-empty value
- **THEN** the module SHALL use the `process.env.X` value (runtime takes precedence over build-time)

### Requirement: Module-load validation of Supabase credentials

When `src/lib/supabase.ts` is loaded, the module SHALL validate that every required credential resolved to a non-empty string. If any credential is missing, the module SHALL throw an `Error` whose message names every missing key in a single list (e.g., `"Missing Supabase env vars: PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY"`).

#### Scenario: All vars present

- **WHEN** the module is imported and every required credential resolves to a non-empty string
- **THEN** no error is thrown and the exported `supabase`, `supabaseAdmin`, and `createServerSupabaseClient` are usable

#### Scenario: One var missing

- **WHEN** the module is imported and exactly one required credential is missing or empty
- **THEN** an `Error` is thrown whose message contains the name of that single missing key

#### Scenario: Multiple vars missing

- **WHEN** the module is imported and two or more required credentials are missing or empty
- **THEN** a single `Error` is thrown whose message lists all missing keys, comma-separated

#### Scenario: Treats literal "undefined" as missing

- **WHEN** an env var is set to the string `"undefined"` (e.g., a stale Vercel deployment artifact)
- **THEN** the validation SHALL treat that var as missing and include it in the error

### Requirement: Server-only credential exposure

`src/lib/supabase.ts` SHALL never be imported into a client (browser-bundled) module. The implementation MAY rely on `process.env` (which is undefined in the browser) so that an accidental client import surfaces as a build-time or load-time error rather than silently shipping `SUPABASE_SERVICE_ROLE_KEY` to the browser.

#### Scenario: Module imported only by server code

- **WHEN** the codebase is grepped for imports of `src/lib/supabase`
- **THEN** every import lives inside `.astro` frontmatter, server-only `.ts` modules (e.g., `src/lib/auth.ts`, `src/lib/queries.ts`), or other server-only contexts — never inside a `.tsx` component file rendered with a `client:*` directive

#### Scenario: Accidental client import surfaces clearly

- **WHEN** a developer mistakenly imports `src/lib/supabase` from a `.tsx` client island
- **THEN** the build or first-load SHALL produce an error referencing `process` or the missing env, rather than silently bundling `SUPABASE_SERVICE_ROLE_KEY` into client JS
