## ADDED Requirements

### Requirement: Firebase Initialization
The system SHALL initialize the Firebase application using environment variables.

#### Scenario: App start
- **WHEN** the application starts
- **THEN** it successfully initializes the Firebase app instance

### Requirement: User Authentication
The system SHALL authenticate users using Firebase Authentication instead of Supabase Auth.

#### Scenario: User logs in
- **WHEN** a user provides valid credentials via the login form
- **THEN** the system logs them in using Firebase Auth and establishes a session

#### Scenario: User logs out
- **WHEN** an authenticated user clicks the logout button
- **THEN** the system signs them out from Firebase Auth and clears the session

### Requirement: Database Operations
The system SHALL read and write data using Firebase Firestore.

#### Scenario: Fetching data
- **WHEN** the application requests data (e.g., user profile, application content)
- **THEN** it retrieves the documents from the appropriate Firestore collections

#### Scenario: Saving data
- **WHEN** the application saves new data or updates existing data
- **THEN** it writes the changes to the appropriate Firestore documents