## 1. Setup and Dependencies

- [x] 1.1 Add `firebase` and remove `@supabase/supabase-js`, `@supabase/ssr` from `package.json` dependencies
- [x] 1.2 Update environment variables in the project to use Firebase credentials instead of Supabase

## 2. Firebase Initialization

- [x] 2.1 Create `src/lib/firebase.ts` to initialize the Firebase App and export Auth and Firestore instances
- [x] 2.2 Delete the existing `src/lib/supabase.ts` file

## 3. Authentication Migration

- [x] 3.1 Update the login page/component to use Firebase Auth (`signInWithEmailAndPassword` or similar)
- [x] 3.2 Update the application layout or auth middleware to check Firebase Auth session state instead of Supabase session
- [x] 3.3 Update the logout functionality to use Firebase Auth `signOut`

## 4. Database Operations Migration

- [x] 4.1 Identify all components or endpoints using Supabase data queries
- [x] 4.2 Replace Supabase PostgreSQL queries with Firebase Firestore `getDocs`, `doc`, `collection`, `addDoc`, `updateDoc`, etc.
- [x] 4.3 Test database read and write operations to ensure data is correctly stored and retrieved from Firestore