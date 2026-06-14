## Context

The current project uses Supabase for its backend, relying on its PostgreSQL database and authentication service. The goal is to migrate to Google Firebase, utilizing Firestore for the database and Firebase Auth for user management. This change requires replacing the underlying data access layers and authentication mechanisms while ideally keeping the frontend components and business logic largely intact.

## Goals / Non-Goals

**Goals:**
- Successfully initialize Firebase app in the application.
- Replace Supabase Auth flows (login, logout, session management) with Firebase Auth.
- Replace Supabase data queries with Firestore queries.
- Update data models to match Firestore's document-based NoSQL structure if necessary (compared to Postgres's relational structure).

**Non-Goals:**
- Changing the overall UI design or user experience flows.
- Modifying business logic that is unrelated to data fetching/saving or authentication.
- Implementing the actual data migration script from Supabase to Firebase (this design covers the application code changes, data migration will be handled separately).

## Decisions

- **Decision 1: Firebase SDK**: We will use the standard `firebase` npm package for client-side operations. If server-side rendering (SSR) data fetching requires privileged access, we may need `firebase-admin`, but initially, we will try to handle auth state and data fetching on the client-side or use Firebase's session cookies for SSR if needed.
- **Decision 2: Data Model Adaptation**: Since Firestore is NoSQL, we will need to denormalize some data or use subcollections where we previously used relational joins in Supabase. The specific data model mapping will be done during implementation.
- **Decision 3: Authentication**: We will replace Supabase's `@supabase/ssr` cookie-based auth with Firebase Auth. For SSR in Astro, we will need to carefully manage the user session, potentially using Firebase Admin SDK to verify ID tokens on the server.

## Risks / Trade-offs

- **[Risk] Data Model Mismatch** → **Mitigation**: Carefully review the current relational data model and design a robust NoSQL mapping for Firestore before writing data access code.
- **[Risk] SSR Authentication Complexity** → **Mitigation**: Firebase Auth with SSR in Astro can be tricky compared to Supabase's SSR helpers. We will thoroughly test the session management and token verification flow.
- **[Risk] Vendor Lock-in** → **Mitigation**: Abstract the database and auth calls into separate service files or hooks to minimize direct SDK usage in UI components, making future migrations easier if needed.