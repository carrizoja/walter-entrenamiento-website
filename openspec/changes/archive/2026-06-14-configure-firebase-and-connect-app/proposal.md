## Why

The project has already started moving away from Supabase, but it still lacks a complete, operator-friendly Firebase setup path and a clear migration artifact for moving data into Firestore. This change documents how to configure the Firebase account for `walterentrenamiento.web@gmail.com`, prepare Firebase-native migration assets, and connect the project to the new backend safely.

## What Changes

- Add a documented Firebase setup flow covering project creation, Firestore, Authentication, Storage, and service account configuration for `walterentrenamiento.web@gmail.com`.
- Add a Firebase-native migration artifact instead of a SQL execution path, since Firestore does not run SQL.
- Add or update project integration points so Firebase environment variables, admin credentials, auth, database, and storage are wired consistently.
- **BREAKING**: Remove any remaining assumptions that the backend can be initialized from Supabase credentials or SQL-driven setup.

## Capabilities

### New Capabilities
- `firebase-project-setup`: Covers Firebase account/project configuration, required services, credentials, and deployment environment setup.
- `firestore-migration-assets`: Covers creation of Firestore-compatible seed/import artifacts derived from existing data instead of SQL execution.
- `firebase-app-connection`: Covers connecting the Astro application to Firebase Auth, Firestore, and Storage with the required runtime configuration.

### Modified Capabilities
- None

## Impact

- **Code**: Firebase config modules, auth helpers, data access, storage utilities, and admin pages may need updates for consistency.
- **Infrastructure**: Firebase console configuration, service account handling, and Vercel environment variables will be required.
- **Data**: Supabase-origin data must be transformed into Firestore-compatible structures.
- **Operations**: The team will need a repeatable onboarding/setup guide for the Firebase account owner and deployment environment.
