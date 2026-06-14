### Requirement: Password-based admin sign-in
The system SHALL provide a `/admin/login` page that authenticates a user against Supabase Auth using email and password and, on success, establishes a cookie-bound session usable by all `/admin/**` pages.

#### Scenario: Successful login
- **WHEN** an unauthenticated user submits valid email and password to `/admin/login`
- **THEN** the system creates a Supabase Auth session via `@supabase/ssr`, stores its tokens in HTTP-only cookies, and redirects the user to `/admin`

#### Scenario: Invalid credentials
- **WHEN** an unauthenticated user submits an email/password pair Supabase Auth rejects
- **THEN** the system re-renders `/admin/login` with a Spanish error message ("Credenciales inválidas") and does not set any session cookie

#### Scenario: Already-authenticated visit to login
- **WHEN** an authenticated user navigates to `/admin/login`
- **THEN** the system redirects them to `/admin` without rendering the login form

### Requirement: Admin route guard
The system SHALL protect every page under `/admin/**` (except `/admin/login`) so that only authenticated users can view it.

#### Scenario: Unauthenticated access to a protected page
- **WHEN** an unauthenticated user requests any `/admin` page other than `/admin/login`
- **THEN** the system redirects them to `/admin/login` before rendering protected content

#### Scenario: Authenticated access
- **WHEN** an authenticated user requests `/admin` or any sub-route
- **THEN** the system renders the requested admin page server-side

### Requirement: Admin sign-out
The system SHALL provide a `/admin/logout` action that ends the current Supabase Auth session and clears its cookies.

#### Scenario: Logout from the dashboard
- **WHEN** an authenticated user submits the logout form rendered in `AdminLayout.astro`
- **THEN** the system invalidates the Supabase session, clears the `sb-*` auth cookies, and redirects to `/admin/login`

### Requirement: Service-role key isolation
The system SHALL NOT expose the Supabase service-role key to any browser bundle.

#### Scenario: Service-role client used in client component
- **WHEN** code that imports `supabaseAdmin` is referenced from a component rendered with a `client:*` directive
- **THEN** the build SHALL treat this as a defect; reviewers MUST reject such imports because they would inline `SUPABASE_SERVICE_ROLE_KEY` into the browser bundle

#### Scenario: Anon-key used for public reads
- **WHEN** a public page fetches data from Supabase during prerender or SSR without an authenticated user
- **THEN** the system uses the anon-key `supabase` client and is subject to the row-level security policies defined for that table
