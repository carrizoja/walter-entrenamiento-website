## Why

The goal is to migrate the project's database and authentication backend from Supabase to Google Firebase. This transition will involve replacing the current PostgreSQL-based Supabase infrastructure with Firebase Firestore for the database and Firebase Authentication for user management, ensuring better alignment with Firebase's ecosystem and real-time capabilities.

## What Changes

- **BREAKING**: Replace Supabase client configuration with Firebase initialization.
- **BREAKING**: Migrate all database queries and mutations from Supabase SDK to Firebase Firestore SDK.
- **BREAKING**: Migrate the authentication flows from Supabase Auth to Firebase Auth.
- Remove `@supabase/supabase-js` and `@supabase/ssr` dependencies.
- Add `firebase` and potentially `firebase-admin` dependencies.
- Update environment variables to use Firebase configuration instead of Supabase credentials.

## Capabilities

### New Capabilities

- `firebase-integration`: Covers the initialization, authentication, and database interaction using the Google Firebase SDK.

### Modified Capabilities

- None

## Impact

- **Code**: All files importing or using the Supabase client (`src/lib/supabase.ts` and consumers) will need to be updated.
- **Dependencies**: Replacement of `@supabase/*` packages with `firebase`.
- **Infrastructure**: Vercel environment variables will need to be updated to Firebase project credentials.
- **Data**: Existing data in Supabase will need to be migrated to Firestore (data migration strategy should be planned, though implementation may be separate).