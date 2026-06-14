## ADDED Requirements

### Requirement: Article list in admin
The system SHALL render `/admin/articulos` for authenticated admin users, listing every article (published and unpublished) with title, slug, category, published status, and last updated timestamp.

#### Scenario: Walter opens the article list
- **WHEN** Walter navigates to `/admin/articulos` while authenticated
- **THEN** the system fetches all rows from `articles` via the service-role client, ordered by `updated_at` descending, and renders them with edit and delete controls

### Requirement: Create article
The system SHALL allow an authenticated admin to create a new article via `/admin/articulos/nuevo` with the fields title, slug, excerpt, content, category, read time, accent_from, accent_to, featured, published, and an optional cover image.

#### Scenario: Successful creation
- **WHEN** Walter submits the new-article form with all required fields and a unique slug
- **THEN** the system uploads the cover (if present) to the `article-covers` Supabase Storage bucket using a uuid-prefixed path, inserts a row into `articles` with the resulting `cover_url`, and redirects to `/admin/articulos`

#### Scenario: Duplicate slug
- **WHEN** Walter submits the form with a slug that already exists
- **THEN** the system re-renders the form with a Spanish error ("El slug ya existe") and preserves the entered values; no row is inserted and no file is left orphaned in storage

#### Scenario: Missing required field
- **WHEN** Walter submits the form without title, slug, or content
- **THEN** the system re-renders the form with field-specific errors and does not insert a row

### Requirement: Edit article
The system SHALL allow an authenticated admin to edit any existing article at `/admin/articulos/[id]`.

#### Scenario: Update existing article
- **WHEN** Walter submits the edit form with valid changes for article `id`
- **THEN** the system updates the matching row, sets `updated_at = now()`, replaces the cover image in storage if a new file was provided (deleting the previous one), and redirects to `/admin/articulos`

#### Scenario: Toggle published flag
- **WHEN** Walter changes the published checkbox and submits
- **THEN** the system persists the new `published` value, immediately affecting visibility on `/bienestar`

### Requirement: Delete article
The system SHALL allow an authenticated admin to delete an article and its associated cover image.

#### Scenario: Successful delete
- **WHEN** Walter confirms deletion of article `id`
- **THEN** the system deletes the row from `articles`, deletes the cover file from storage if it exists, and redirects to `/admin/articulos` with a success message

#### Scenario: Cover deletion failure
- **WHEN** the storage delete fails after the row has been removed
- **THEN** the system logs the orphaned `storage_path` server-side and still reports success to the user; orphans can be reaped by a later sweep
