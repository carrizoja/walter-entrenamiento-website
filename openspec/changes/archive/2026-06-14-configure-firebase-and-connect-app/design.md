## Context

This repository already contains Firebase packages and some Firebase integration work, but the operational setup is incomplete and inconsistent. The requested outcome is broader than code changes alone: the Firebase project must be configured under `walterentrenamiento.web@gmail.com`, Firestore/Auth/Storage must be enabled correctly, migration assets must be prepared in a Firebase-native format, and the Astro app must be connected to the resulting credentials and services.

## Goals / Non-Goals

**Goals:**
- Provide a concrete setup guide for creating and configuring the Firebase project and its required services.
- Define a Firestore-native migration artifact that can be generated and imported without pretending Firebase executes SQL.
- Align the project runtime configuration with Firebase client and admin credentials used by Astro pages and server logic.
- Make the setup repeatable for local development and Vercel deployment.

**Non-Goals:**
- Automating Firebase Console clicks entirely.
- Defining a full ETL process for every historical Supabase table beyond the application's current data needs.
- Supporting direct SQL execution against Firebase products.

## Decisions

- Use a Firebase-native migration artifact instead of a `.sql` file for execution. Rationale: Firestore is document-based and does not accept SQL migrations; a JSON or scripted import path is the correct operational model.
- Treat account setup and app integration as one coordinated change. Rationale: the code cannot be verified correctly without matching Firebase project settings, auth providers, Firestore rules/indexes, storage bucket setup, and deployment secrets.
- Keep runtime app configuration split between public client config and private admin credentials. Rationale: the Astro app needs browser-safe Firebase config for client auth and server-only secrets for admin verification, Firestore admin access, and storage operations.
- Prefer documented manual setup plus checked-in migration/setup artifacts over hidden one-off console steps. Rationale: future sessions need a repeatable source of truth.

## Risks / Trade-offs

- [Risk] Firebase project settings diverge from the documented setup → Mitigation: define required services, auth providers, and env vars explicitly in the change artifacts.
- [Risk] Firestore document shape may not map cleanly from Supabase tables → Mitigation: scope migration assets to the collections the app actually reads and writes today.
- [Risk] Service account handling may be misconfigured in deployment → Mitigation: separate public Firebase config from admin JSON credentials and document both paths.
- [Risk] Existing Firebase integration in the repo may still contain inconsistent assumptions → Mitigation: include verification tasks for auth, database, and storage flows after connection changes.

## Migration Plan

1. Create and secure the Firebase project under `walterentrenamiento.web@gmail.com`.
2. Enable Firestore, Authentication, and Storage with the expected regional and provider settings.
3. Generate client config and admin credentials, then wire them into local `.env` and Vercel secrets.
4. Create Firestore-compatible migration assets for the collections used by the app.
5. Update the app integration to consume the configured Firebase services consistently.
6. Verify build, auth flow, Firestore reads/writes, and storage uploads.

## Open Questions

- Which Firebase region should be used for Firestore and Storage?
- Should the migration artifact be a checked-in JSON export, a Node import script, or both?
- Are there any remaining Supabase-only features, such as relational queries or policies, that still need explicit Firebase replacements?
