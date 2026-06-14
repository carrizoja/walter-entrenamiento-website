## Why

The site needs real content in the Bienestar and Galeria sections so visitors see finished, relevant material instead of sparse or placeholder data. Adding the requested entries now makes the public site more complete and gives the Firebase-backed CMS content to validate against.

## What Changes

- Add 3 new Bienestar blog entries with complete article fields required by the existing content model.
- Add 5 new Galeria entries, with a mix of 4 photos and 1 video if assets are available.
- Prepare the new entries in a format that can be loaded into the current Firebase content collections.
- Verify that the new entries fit the existing public and admin content flows without changing the site structure.

## Capabilities

### New Capabilities
- `content-entry-batch`: Covers preparing and loading a requested batch of Bienestar and Galeria content entries into the existing content model.

### Modified Capabilities
- None

## Impact

- **Data**: Adds new documents to the `articles` and `gallery_items` collections.
- **Content**: Bienestar receives 3 new articles; Galeria receives 5 new media items.
- **Verification**: The seeded content should render correctly in the public listing pages and remain editable in admin flows.
