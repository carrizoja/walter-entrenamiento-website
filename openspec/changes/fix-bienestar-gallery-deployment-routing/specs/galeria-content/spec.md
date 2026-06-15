## MODIFIED Requirements

### Requirement: Public Galería rendering
The system SHALL make `/galeria` available in deployed environments using a deployment-safe rendering path, listing all gallery items ordered by `sort_order` ascending and `created_at` descending as a tiebreaker.

#### Scenario: Visitor views the gallery on a deployed site
- **WHEN** any visitor requests `/galeria` on a local or deployed environment
- **THEN** the system responds successfully and renders each gallery item using its `media_type`, with photos using `public_url` and videos displaying their available preview media

#### Scenario: Featured items appear prominently
- **WHEN** at least one item has `featured = true`
- **THEN** the system renders featured items with a visually distinct treatment

#### Scenario: Empty gallery
- **WHEN** there are no gallery items available for display
- **THEN** the system renders an empty-state message in Spanish and HTTP status 200

### Requirement: Video metadata in listing
The system SHALL display each video item's `duration` when present.

#### Scenario: Video has duration metadata
- **WHEN** a video item with `duration` set is rendered on `/galeria`
- **THEN** the duration string SHALL be visible to the user as part of the item card

### Requirement: Graceful degradation on content loading failure
The system SHALL NOT crash `/galeria` when content cannot be loaded during build or rendering.

#### Scenario: Content source unavailable during gallery generation
- **WHEN** the content query for `/galeria` fails because Firebase access is unavailable or misconfigured
- **THEN** the system logs the failure server-side and still produces a successful page response with an empty-state instead of a platform 500 error
