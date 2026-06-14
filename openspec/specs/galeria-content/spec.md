### Requirement: Public Galería rendering
The system SHALL render `/galeria` server-side, listing all rows from `gallery_items` ordered by `sort_order` ascending and `created_at` descending as tiebreaker.

#### Scenario: Visitor views the gallery
- **WHEN** any visitor requests `/galeria`
- **THEN** the system fetches all gallery items via the anon Supabase client and renders each item using its `media_type`: photos as `<img>` from `public_url`, videos as a player using `public_url` with `thumbnail_url` as the poster

#### Scenario: Featured items appear prominently
- **WHEN** at least one item has `featured = true`
- **THEN** the system renders featured items with a visually distinct treatment (e.g., larger cell or featured row)

#### Scenario: Empty gallery
- **WHEN** there are no rows in `gallery_items`
- **THEN** the system renders an empty-state message in Spanish and HTTP status 200

### Requirement: Video metadata in listing
The system SHALL display each video item's `duration` (e.g., "1:23") when present.

#### Scenario: Video has duration metadata
- **WHEN** a video item with `duration` set is rendered on `/galeria`
- **THEN** the duration string SHALL be visible to the user as part of the item card

### Requirement: Graceful degradation on Supabase failure
The system SHALL NOT crash `/galeria` when Supabase is unreachable.

#### Scenario: Supabase outage during gallery render
- **WHEN** the anon client throws an error fetching `gallery_items`
- **THEN** the system catches the error, logs it server-side, and renders an empty-state with HTTP 200 instead of a 500 page
