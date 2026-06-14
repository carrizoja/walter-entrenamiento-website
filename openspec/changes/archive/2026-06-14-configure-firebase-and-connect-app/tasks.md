## 1. Firebase Project Setup

- [x] 1.1 Document the Firebase project creation steps for `walterentrenamiento.web@gmail.com`, including project naming and required console access
- [x] 1.2 Document and verify required Firebase services and settings: Firestore, Authentication, Storage, auth providers, and target region
- [x] 1.3 Document the full environment variable set needed locally and in Vercel, separating public client config from admin-only credentials

## 2. Firestore Migration Assets

- [x] 2.1 Identify the app data currently sourced from Supabase that must exist in Firestore collections
- [x] 2.2 Create a Firestore-native migration artifact such as a JSON seed file, import script, or both
- [x] 2.3 Document how developers load the migration artifact into the configured Firebase project

## 3. Project Integration

- [x] 3.1 Audit the current repository for incomplete or inconsistent Firebase configuration and integration points
- [x] 3.2 Update project code and config so Firebase client, admin auth, Firestore, and Storage use the documented environment variables consistently
- [x] 3.3 Remove or replace any remaining Supabase-specific assumptions that block Firebase-only operation

## 4. Verification

- [x] 4.1 Verify the project builds successfully with the Firebase configuration in place
- [x] 4.2 Verify admin auth, Firestore data access, and storage-backed flows against the configured Firebase project
- [x] 4.3 Document the final operator checklist for setting up Firebase and validating the connection end to end
