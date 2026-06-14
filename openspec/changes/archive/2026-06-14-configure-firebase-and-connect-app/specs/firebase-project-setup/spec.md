## ADDED Requirements

### Requirement: Firebase project setup guide
The system SHALL provide a concrete setup guide for creating and configuring the Firebase project owned by `walterentrenamiento.web@gmail.com`.

#### Scenario: New Firebase project setup
- **WHEN** an operator follows the setup guide
- **THEN** they can create the Firebase project, enable required services, and collect the credentials needed by the app

### Requirement: Required Firebase services are defined
The system SHALL define which Firebase services and settings are mandatory for this project, including Firestore, Authentication, and Storage.

#### Scenario: Service checklist review
- **WHEN** an operator reviews the documented requirements
- **THEN** they can verify that all required Firebase services and core settings are enabled before deploying the app

### Requirement: Deployment secrets are identified
The system SHALL define the public and server-only environment variables needed for local development and deployment.

#### Scenario: Environment configuration
- **WHEN** a developer configures the project locally or in Vercel
- **THEN** they can map each required Firebase credential to the correct environment variable without exposing server-only secrets to the client
