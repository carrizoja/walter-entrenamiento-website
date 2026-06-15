# Firebase Setup

This project uses Firebase for Auth, Firestore, and Storage.

## Account And Project

1. Sign in to https://console.firebase.google.com with `walterentrenamiento.web@gmail.com`.
2. Create a project named `walter-entrenamiento`.
3. Keep the project owner as `walterentrenamiento.web@gmail.com`.
4. Add any additional collaborators with the minimum access they need.

## Required Services

Configure these services before connecting the app:

1. Firestore Database
2. Authentication
3. Storage

### Target Region

- Firestore: `southamerica-east1`
- Storage bucket: same region as Firestore when possible

`southamerica-east1` is the closest regional option for Buenos Aires and keeps data and media in the same region.

## Firestore

1. Create the database in `Production mode`.
2. Choose region `southamerica-east1`.
3. Create these collections:
   - `articles`
   - `gallery_items`
4. Deploy the composite indexes from `firebase/firestore.indexes.json`.

## Authentication

1. Open `Build -> Authentication -> Sign-in method`.
2. Enable `Email/Password`.
3. Create the admin user for Walter from the Authentication users screen.

The admin login page in this repo expects email/password auth.

## Storage

1. Open `Build -> Storage`.
2. Create the default bucket in the same project.
3. Use the generated bucket value as `PUBLIC_FIREBASE_STORAGE_BUCKET`.

This app stores media under these logical folders inside the default bucket:

- `article-covers/`
- `gallery/`

## Web App Credentials

Add a Firebase Web App in `Project settings -> General` and copy these values:

- `PUBLIC_FIREBASE_API_KEY`
- `PUBLIC_FIREBASE_AUTH_DOMAIN`
- `PUBLIC_FIREBASE_PROJECT_ID`
- `PUBLIC_FIREBASE_STORAGE_BUCKET`
- `PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `PUBLIC_FIREBASE_APP_ID`

## Admin Credentials

Create a service account key in `Project settings -> Service accounts`.

Store the full JSON in one server-only environment variable:

- `FIREBASE_SERVICE_ACCOUNT_KEY`

Recommended format in local `.env`:

```env
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}
```

Do not prefix this variable with `PUBLIC_`.

## Environment Variables

Local development and Vercel both need:

### Public client config

- `PUBLIC_FIREBASE_API_KEY`
- `PUBLIC_FIREBASE_AUTH_DOMAIN`
- `PUBLIC_FIREBASE_PROJECT_ID`
- `PUBLIC_FIREBASE_STORAGE_BUCKET`
- `PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `PUBLIC_FIREBASE_APP_ID`

### Server-only config

- `FIREBASE_SERVICE_ACCOUNT_KEY`

Use `.env.example` as the tracked template.

## Public Content Build Requirement

The public `/bienestar`, `/bienestar/[slug]`, and `/galeria` pages are generated from Firebase content during the build.

That means these environments must have the Firebase variables available at build time, not only at request time:

- `PUBLIC_FIREBASE_API_KEY`
- `PUBLIC_FIREBASE_AUTH_DOMAIN`
- `PUBLIC_FIREBASE_PROJECT_ID`
- `PUBLIC_FIREBASE_STORAGE_BUCKET`
- `PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `PUBLIC_FIREBASE_APP_ID`
- `FIREBASE_SERVICE_ACCOUNT_KEY`

If `FIREBASE_SERVICE_ACCOUNT_KEY` is missing or invalid, the public content pages will fall back to empty-state output instead of crashing, but published Bienestar article detail pages will not be generated.

## Vercel Setup

1. Open the Vercel project settings.
2. Add every variable from `.env.example` to Preview and Production.
3. Mark `FIREBASE_SERVICE_ACCOUNT_KEY` as sensitive.
4. Redeploy after saving the variables.

## Netlify Setup

1. Open `Site configuration -> Environment variables`.
2. Add every variable from `.env.example` for the deploy contexts you use.
3. Mark `FIREBASE_SERVICE_ACCOUNT_KEY` as sensitive if your Netlify plan supports it.
4. Trigger a new deploy after saving the variables.

## Admin Route Runtime Requirement

The `/admin/**` routes are request-time rendered and need Firebase variables to be available in the deployed server runtime, not only during build.

Required for `/admin/login` and protected admin routes:

- `PUBLIC_FIREBASE_API_KEY`
- `PUBLIC_FIREBASE_AUTH_DOMAIN`
- `PUBLIC_FIREBASE_PROJECT_ID`
- `PUBLIC_FIREBASE_STORAGE_BUCKET`
- `PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `PUBLIC_FIREBASE_APP_ID`
- `FIREBASE_SERVICE_ACCOUNT_KEY`

If the public Firebase variables are missing, the login page will show a controlled configuration error instead of crashing.

If `FIREBASE_SERVICE_ACCOUNT_KEY` is missing or invalid, protected admin routes cannot verify sessions and the dashboard will fall back to a controlled non-500 response.

## Verification Checklist

1. `npm run build`
2. Open `/admin/login`
3. Sign in with the Firebase admin user
4. Confirm `/admin` loads
5. Confirm article and gallery data load
6. Confirm media uploads work from the admin panel
