## ADDED Requirements

### Requirement: Branded 404 page for unmatched routes

The system SHALL serve a branded "Página no encontrada" page at `src/pages/404.astro` for any unmatched public route, rendered through the public `Layout.astro` so it visually matches the rest of the site (Navbar, Footer, AiChatbot, dark-mode init, brand fonts and palette).

#### Scenario: User visits an unknown public URL

- **WHEN** a visitor navigates to a path that does not match any page in `src/pages/` (e.g., `/no-existe`)
- **THEN** the site renders the 404 page wrapped by the public layout, including the Navbar at the top and the Footer at the bottom

#### Scenario: User visits an unknown article slug

- **WHEN** a visitor navigates to `/bienestar/<slug>` where `<slug>` does not correspond to a published article
- **THEN** the site renders the same 404 page (no separate error UI for the blog detail route)

#### Scenario: Dark mode is active

- **WHEN** the visitor has `theme=dark` in `localStorage` or prefers a dark color scheme
- **THEN** the 404 page renders in dark mode without a flash of unstyled content, using the same `#0f0508` body background as the rest of the public site

### Requirement: Recovery navigation

The 404 page SHALL provide at least three explicit recovery paths visible without scrolling on a typical desktop viewport: a primary CTA back to home (`/`), and secondary links to the blog (`/bienestar`) and contact (`/contacto`).

#### Scenario: Primary CTA is rendered

- **WHEN** the 404 page loads
- **THEN** a button with the visual treatment of the existing `PrimaryButton` component (`variant="primary"`) is rendered with text "Volver al inicio" and `href="/"`

#### Scenario: Secondary links are rendered

- **WHEN** the 404 page loads
- **THEN** secondary navigation links to `/bienestar` (labelled "Bienestar") and `/contacto` (labelled "Contacto") are rendered, styled with the brand palette and reachable via keyboard tab order after the primary CTA

### Requirement: Correct HTTP 404 status

When deployed to Vercel, the page SHALL be served with HTTP status code 404 for any unmatched route, not a soft 200.

#### Scenario: HEAD request to unknown path returns 404

- **WHEN** a HEAD or GET request is made to an unmatched path on the deployed Vercel site
- **THEN** the response status line is `404` and the body is the rendered 404 page

### Requirement: Search engine indexing prevention

The 404 page SHALL include a `<meta name="robots" content="noindex">` tag in its `<head>` so that crawlers do not index it as a real page.

#### Scenario: Page source contains noindex meta

- **WHEN** the 404 page HTML is inspected
- **THEN** the `<head>` contains exactly one `<meta name="robots" content="noindex">` element

### Requirement: Page metadata

The 404 page SHALL set a descriptive `<title>` and `<meta name="description">` tailored to the error state.

#### Scenario: Title and description are localized to the error state

- **WHEN** the 404 page renders
- **THEN** the document `<title>` is "Página no encontrada — Walter Entrenamiento" and the meta description explains in Spanish that the requested page does not exist and invites the visitor back to the homepage

### Requirement: Accessibility

The 404 page SHALL meet baseline accessibility requirements consistent with the rest of the public site.

#### Scenario: Heading structure is correct

- **WHEN** the 404 page renders
- **THEN** there is exactly one `<h1>` element on the page that names the error (e.g., "Página no encontrada"), and any further headings are properly nested

#### Scenario: Recovery actions are keyboard-reachable

- **WHEN** a keyboard user tabs through the page after the Navbar
- **THEN** focus visits the primary CTA followed by each secondary link in document order, each with a visible focus indicator

#### Scenario: Reduced-motion preference is respected

- **WHEN** the visitor's OS reports `prefers-reduced-motion: reduce`
- **THEN** any decorative animation on the 404 page is disabled, matching the `@media (prefers-reduced-motion: reduce)` rules already defined in `src/styles/global.css`
