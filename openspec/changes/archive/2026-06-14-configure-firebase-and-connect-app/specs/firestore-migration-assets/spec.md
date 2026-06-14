## ADDED Requirements

### Requirement: Firestore-native migration artifact
The system SHALL use a Firestore-compatible migration artifact instead of an executable SQL migration.

#### Scenario: Migration artifact selection
- **WHEN** a developer prepares backend migration assets for Firebase
- **THEN** they use a Firebase-native format such as JSON seed data or an import script rather than SQL

### Requirement: Collection mapping is documented
The system SHALL define how the current application data maps from existing source records into Firestore collections and documents.

#### Scenario: Data structure review
- **WHEN** a developer reviews the migration asset
- **THEN** they can identify which collections, document fields, and identifiers are required for the app to function

### Requirement: Migration asset is runnable by developers
The system SHALL provide a repeatable way for developers to load the migration data into Firebase.

#### Scenario: Data import execution
- **WHEN** a developer follows the migration instructions
- **THEN** they can import the required Firestore data into the configured Firebase project without manual record-by-record entry
