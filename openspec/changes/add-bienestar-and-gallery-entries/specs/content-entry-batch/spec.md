## ADDED Requirements

### Requirement: Bienestar entries are stored in Firebase
The system SHALL store the 3 requested Bienestar entries as Firebase documents in the `articles` collection using the existing article content model.

#### Scenario: Article batch creation
- **WHEN** the requested Bienestar entries are added
- **THEN** exactly 3 new article documents are created in Firebase with the required article fields

### Requirement: Gallery entries are stored in Firebase
The system SHALL store the requested Galeria entries as Firebase documents in the `gallery_items` collection using the existing gallery content model.

#### Scenario: Gallery batch creation
- **WHEN** the requested Galeria entries are added
- **THEN** exactly 5 new gallery documents are created in Firebase, with a target mix of 4 photo items and 1 video item when matching assets are available

### Requirement: New entries fit existing public content flows
The system SHALL keep the new Bienestar and Galeria entries compatible with the existing public site rendering and admin content flows.

#### Scenario: Public content rendering
- **WHEN** the new Firebase documents are loaded by the current content queries
- **THEN** the Bienestar and Galeria pages can render the new entries without requiring schema or page structure changes
