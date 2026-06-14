## Context

The application already uses Firebase-backed collections for Bienestar articles and Galeria items. The requested change is content-focused: add 3 Bienestar entries and 5 Galeria entries, with those records stored in Firebase rather than hard-coded in the repository or page templates.

## Goals / Non-Goals

**Goals:**
- Prepare 3 complete article entries for the `articles` collection.
- Prepare 5 complete gallery entries for the `gallery_items` collection.
- Ensure the new records match the existing Firebase document shape so they render without code changes.
- Load the new entries through the existing Firebase content path.

**Non-Goals:**
- Redesigning Bienestar or Galeria page layouts.
- Changing the Firestore schema.
- Building a new CMS flow beyond the current content entry process.

## Decisions

- Store all new content as Firebase documents in the existing collections. Rationale: the current app already reads Bienestar and Galeria from Firestore, so content should enter through the same source of truth.
- Keep the change data-oriented rather than UI-oriented. Rationale: the request is to add entries, not to change how the site displays them.
- Use the current content model fields exactly as implemented by `src/types/database.ts` and `src/lib/queries.ts`. Rationale: this minimizes risk and avoids introducing compatibility bugs.
- Treat the gallery request as 5 total entries, preferably 4 photos and 1 video when assets are available. Rationale: this matches the requested content mix while leaving room for implementation to adapt to available source media.

## Risks / Trade-offs

- [Risk] Missing final text or media assets for the requested entries -> Mitigation: keep the change scoped to loading entries once titles, copy, and media are available or choose placeholders explicitly during implementation.
- [Risk] New entries may omit required fields and fail to render correctly -> Mitigation: validate every entry against the existing Firestore document shape before loading.
- [Risk] Gallery media may require upload plus metadata creation -> Mitigation: separate storage upload from document creation and ensure each gallery record references the final public asset URL.

## Migration Plan

1. Gather or author the 3 article entries and 5 gallery entries.
2. Prepare Firebase-compatible records using the current `articles` and `gallery_items` field sets.
3. Load the content into Firebase.
4. Verify the entries render in Bienestar and Galeria.

## Open Questions

- What are the exact titles, text, categories, and media assets for the requested entries?
- Should the new articles and gallery items be published/featured immediately or staged as drafts/non-featured items first?
