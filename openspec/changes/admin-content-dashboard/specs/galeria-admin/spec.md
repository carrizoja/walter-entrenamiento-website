## ADDED Requirements

### Requirement: Gallery list in admin
The system SHALL render `/admin/galeria` for authenticated admin users, listing every gallery item with thumbnail/preview, title, category, media_type, featured flag, and sort_order.

#### Scenario: Walter opens the gallery list
- **WHEN** Walter navigates to `/admin/galeria` while authenticated
- **THEN** the system fetches all rows from `gallery_items` via the service-role client, ordered by `sort_order` ascending, and renders edit / delete / move-up / move-down controls per row

### Requirement: Upload gallery item
The system SHALL allow an authenticated admin to upload a new photo or video at `/admin/galeria/nuevo`.

#### Scenario: Upload a photo
- **WHEN** Walter submits the form with `media_type = photo`, a title, a category, and an image file
- **THEN** the system uploads the file to the `gallery` bucket with a uuid-prefixed path, captures the resulting `public_url`, inserts a row with `media_type = 'photo'` and the next available `sort_order`, and redirects to `/admin/galeria`

#### Scenario: Upload a video with thumbnail
- **WHEN** Walter submits the form with `media_type = video`, a title, a video file, and an optional thumbnail image plus optional duration string
- **THEN** the system uploads both the video and the thumbnail to the `gallery` bucket, persists their `public_url`s as `public_url` and `thumbnail_url`, inserts a row with `media_type = 'video'`, and redirects to `/admin/galeria`

#### Scenario: File exceeds maximum size
- **WHEN** Walter submits a file larger than the configured maximum (50 MB by default)
- **THEN** the system rejects the upload with a Spanish error message, does not call Supabase Storage, and re-renders the form with field values preserved

### Requirement: Edit gallery item
The system SHALL allow an authenticated admin to edit metadata (title, description, category, featured, sort_order, duration) of any gallery item at `/admin/galeria/[id]`.

#### Scenario: Update metadata only
- **WHEN** Walter submits the edit form without attaching a new file
- **THEN** the system updates the existing row's metadata fields and leaves `storage_path`, `public_url`, and `thumbnail_url` unchanged

#### Scenario: Replace media file
- **WHEN** Walter submits the edit form with a new file attached
- **THEN** the system uploads the new file to the `gallery` bucket, deletes the previous file at the old `storage_path`, and updates `storage_path` and `public_url` on the row

### Requirement: Delete gallery item
The system SHALL allow an authenticated admin to delete a gallery item and its associated media files.

#### Scenario: Successful delete
- **WHEN** Walter confirms deletion of gallery item `id`
- **THEN** the system deletes the row from `gallery_items`, deletes the file at `storage_path` and the file at `thumbnail_url` (if present and stored in the same bucket), and redirects to `/admin/galeria` with a success message

#### Scenario: Storage deletion failure
- **WHEN** the storage delete fails after the row has been removed
- **THEN** the system logs the orphaned path server-side and still reports success to the user

### Requirement: Reorder gallery items
The system SHALL allow an authenticated admin to change the visible order of gallery items.

#### Scenario: Move item up or down
- **WHEN** Walter clicks the move-up or move-down control on a row
- **THEN** the system swaps `sort_order` with the adjacent row and the new ordering is reflected on the next render of both `/admin/galeria` and `/galeria`
