# Firestore Migration

Firestore does not execute SQL migrations. This repo uses a Firestore-native seed/import flow instead.

## Collections Used By The App

The current app expects these collections:

### `articles`

Required fields per document:

- `title`
- `excerpt`
- `content`
- `category`
- `slug`
- `featured`
- `read_time`
- `cover_url`
- `accent_from`
- `accent_to`
- `published`
- `created_at`
- `updated_at`

### `gallery_items`

Required fields per document:

- `title`
- `description`
- `category`
- `media_type`
- `storage_path`
- `public_url`
- `thumbnail_url`
- `duration`
- `featured`
- `sort_order`
- `created_at`

## Legacy Source Mapping

The app previously read the same logical entities from Supabase tables:

- Supabase `articles` -> Firestore `articles`
- Supabase `gallery_items` -> Firestore `gallery_items`

The imported Firestore document should keep the same field names so the existing TypeScript types and query helpers continue to work.

## Seed Format

Use `firebase/firestore-seed.sample.json` as the template.

Top-level keys are collection names. Each value is an array of documents.

If a document includes `id`, the import script writes to that document id. If `id` is omitted, Firestore generates one.

## Import Command

```bash
npm run firestore:import -- ./firebase/firestore-seed.sample.json
```

Requirements:

1. `FIREBASE_SERVICE_ACCOUNT_KEY` must be set.
2. The target Firebase project must already exist.
3. Firestore must already be enabled.

## Index Deployment

This app uses filtered and ordered Firestore queries. Deploy the required indexes from:

- `firebase/firestore.indexes.json`

## Notes

- This import flow is the replacement for a SQL setup file in Firebase.
- Keep production seed data out of git if it contains real customer or admin data.
