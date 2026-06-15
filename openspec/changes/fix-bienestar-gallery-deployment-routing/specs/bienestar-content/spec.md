## MODIFIED Requirements

### Requirement: Public Bienestar listing
The system SHALL make `/bienestar` available in deployed environments using a deployment-safe rendering path, listing all published articles ordered by `created_at` descending.

#### Scenario: Visitor views the blog index on a deployed site
- **WHEN** any visitor requests `/bienestar` on a local or deployed environment
- **THEN** the system responds successfully and renders each published article as a card with title, excerpt, category, read time, and a link to its detail page

#### Scenario: No articles published yet
- **WHEN** the visitor requests `/bienestar` and no article is available for display
- **THEN** the system renders an empty-state message in Spanish and HTTP status 200

#### Scenario: Unpublished article is hidden
- **WHEN** an article exists with `published = false`
- **THEN** that article SHALL NOT appear on `/bienestar`

### Requirement: Public Bienestar article detail
The system SHALL make `/bienestar/[slug]` available in deployed environments for published articles only.

#### Scenario: Visitor opens a published article
- **WHEN** a visitor requests `/bienestar/[slug]` where the slug matches a published article
- **THEN** the system responds successfully and renders the article's title, cover image, content, category, read time, and accent gradient

#### Scenario: Slug does not match any published article
- **WHEN** the slug does not exist or the matching article is unpublished
- **THEN** the system responds with HTTP 404

### Requirement: Graceful degradation on content loading failure
The system SHALL NOT crash public Bienestar routes when content cannot be loaded during build or rendering.

#### Scenario: Content source unavailable during list generation
- **WHEN** the content query for `/bienestar` fails because Firebase access is unavailable or misconfigured
- **THEN** the system logs the failure server-side and still produces a successful page response with an empty-state instead of a platform 500 error

#### Scenario: Content source unavailable during article generation
- **WHEN** the content query for `/bienestar/[slug]` fails because Firebase access is unavailable or misconfigured
- **THEN** the system logs the failure server-side and responds with a friendly non-500 outcome such as a controlled 404 or service-unavailable page
