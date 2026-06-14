### Requirement: Public Bienestar listing
The system SHALL render `/bienestar` server-side, listing all articles where `published = true`, ordered by `created_at` descending.

#### Scenario: Visitor views the blog index
- **WHEN** any visitor (authenticated or not) requests `/bienestar`
- **THEN** the system fetches published articles via the anon Supabase client and renders each as a card with title, excerpt, category, read time, cover image, and a link to its detail page

#### Scenario: No articles published yet
- **WHEN** the visitor requests `/bienestar` and no row in `articles` has `published = true`
- **THEN** the system renders an empty-state message in Spanish (e.g., "Pronto publicaremos novedades") and HTTP status 200

#### Scenario: Unpublished article is hidden
- **WHEN** an article exists with `published = false`
- **THEN** that article SHALL NOT appear on `/bienestar`

### Requirement: Public Bienestar article detail
The system SHALL render `/bienestar/[slug]` server-side, returning the article matching the slug only if it is published.

#### Scenario: Visitor opens a published article
- **WHEN** a visitor requests `/bienestar/[slug]` where the slug matches a row with `published = true`
- **THEN** the system renders the article's title, cover image, content, category, read time, and accent gradient using `accent_from` / `accent_to`

#### Scenario: Slug does not match any published article
- **WHEN** the slug does not exist or the matching row has `published = false`
- **THEN** the system responds with HTTP 404

### Requirement: Graceful degradation on Supabase failure
The system SHALL NOT crash public Bienestar pages when Supabase is unreachable.

#### Scenario: Supabase outage during list render
- **WHEN** the anon client throws an error fetching articles for `/bienestar`
- **THEN** the system catches the error, logs it server-side, and renders an empty-state with HTTP 200 instead of a 500 page

#### Scenario: Supabase outage during detail render
- **WHEN** the anon client throws an error fetching an article for `/bienestar/[slug]`
- **THEN** the system catches the error and responds with HTTP 503 or a friendly error page in Spanish, never leaking the underlying error
