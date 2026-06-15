## ADDED Requirements

### Requirement: Authenticated admin dashboard rendering
The system SHALL render `/admin` as an authenticated dashboard page in local and deployed environments.

#### Scenario: Authenticated admin opens dashboard
- **WHEN** an authenticated admin requests `/admin`
- **THEN** the system renders the dashboard page server-side with its summary cards and quick action links

### Requirement: Dashboard summary metrics
The system SHALL load dashboard summary metrics from the server-side content data source used by the admin area.

#### Scenario: Metrics load successfully
- **WHEN** the dashboard is rendered with valid Firebase Admin access
- **THEN** the system shows counts for total articles, published articles, draft articles, and gallery items

### Requirement: Graceful degradation on dashboard runtime failure
The system SHALL NOT return a platform 500 page for `/admin` when dashboard data loading fails after authentication succeeds.

#### Scenario: Metrics source unavailable during dashboard render
- **WHEN** the dashboard metric queries fail because Firebase Admin access is unavailable or misconfigured
- **THEN** the system logs the failure server-side and responds with a controlled admin experience such as fallback counts or a friendly configuration error instead of a platform 500
