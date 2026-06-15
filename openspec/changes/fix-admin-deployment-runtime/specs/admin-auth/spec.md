## MODIFIED Requirements

### Requirement: Password-based admin sign-in
The system SHALL provide a `/admin/login` page that authenticates a user using the configured Firebase Auth email/password flow and, on success, establishes a cookie-bound session usable by all `/admin/**` pages in deployed environments.

#### Scenario: Successful login
- **WHEN** an unauthenticated user submits valid email and password to `/admin/login`
- **THEN** the system signs the user in with Firebase Auth, creates an HTTP-only session cookie through Firebase Admin, and redirects the user to `/admin`

#### Scenario: Invalid credentials
- **WHEN** an unauthenticated user submits an email/password pair that Firebase Auth rejects
- **THEN** the system re-renders `/admin/login` with a Spanish error message and does not set a session cookie

#### Scenario: Already-authenticated visit to login
- **WHEN** an authenticated user navigates to `/admin/login`
- **THEN** the system verifies the existing session cookie and redirects them to `/admin` without rendering the login form

#### Scenario: Login runtime misconfiguration
- **WHEN** `/admin/login` is requested in an environment with missing or invalid Firebase configuration
- **THEN** the system responds with a controlled non-500 outcome such as a visible configuration error or safe redirect, and logs the underlying failure server-side

### Requirement: Admin route guard
The system SHALL protect every page under `/admin/**` except `/admin/login` so that only authenticated users can view protected content in local and deployed environments.

#### Scenario: Unauthenticated access to a protected page
- **WHEN** an unauthenticated user requests any `/admin` page other than `/admin/login`
- **THEN** the system redirects them to `/admin/login` before rendering protected content

#### Scenario: Authenticated access
- **WHEN** an authenticated user requests `/admin` or any sub-route and the Firebase server configuration is valid
- **THEN** the system renders the requested admin page server-side

#### Scenario: Protected route runtime misconfiguration
- **WHEN** an admin route is requested but Firebase session verification cannot run because server configuration is missing or invalid
- **THEN** the system returns a controlled non-500 response and logs the failure server-side instead of crashing the deployed function

### Requirement: Admin sign-out
The system SHALL provide a `/admin/logout` action that ends the current admin session and clears its cookies.

#### Scenario: Logout from the dashboard
- **WHEN** an authenticated user submits the logout form rendered in the admin layout
- **THEN** the system clears the session cookie and redirects to `/admin/login`

### Requirement: Server-side auth secret isolation
The system SHALL NOT expose Firebase Admin credentials to any browser bundle.

#### Scenario: Admin server credential referenced from client-bundled code
- **WHEN** code that imports `firebase-admin` helpers is referenced from a client-bundled component or browser-executed path
- **THEN** the build or review process MUST treat this as a defect because it would expose server-only credentials or server-only runtime assumptions to the browser
