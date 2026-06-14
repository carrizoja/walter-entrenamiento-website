# Walter Entrenamiento - Copilot Instructions

## Project Overview

This is an **Astro 5.14+** training/fitness application initialized from the Astro basics template. Currently a minimal starter setup ready for customization into a fitness/training platform.

## Architecture

- **Framework**: Astro with strict TypeScript (`astro/tsconfigs/strict`)
- **UI Framework**: React for interactive/dynamic components (add via `npm run astro -- add react`)
- **File-based routing**: Pages in `src/pages/` map to routes (e.g., `index.astro` → `/`)
- **Component structure**: 
  - `src/layouts/Layout.astro` - Base HTML layout with global styles
  - `src/components/` - Reusable Astro components + React components (`.tsx`)
  - `src/assets/` - Images/SVGs imported as modules (e.g., `import logo from '../assets/astro.svg'`)

## Key Patterns

### Astro Component Syntax
```astro
---
// Frontmatter: server-side TypeScript/JavaScript
import Component from '../components/Component.astro';
---

<!-- Template: HTML with JSX-like expressions -->
<div>{variable}</div>

<style>
  /* Scoped CSS by default */
</style>
```

### Asset Imports
Import images/SVGs as modules to get optimized URLs:
```astro
import logo from '../assets/logo.svg';
<img src={logo.src} alt="Logo" />
```

### React Components for Interactivity
Use React (`.tsx`) for dynamic/interactive content, Astro (`.astro`) for static structure:
```astro
---
import InteractiveTimer from '../components/InteractiveTimer.tsx';
---

<!-- Add client:load for immediate hydration, client:idle for deferred -->
<InteractiveTimer client:load initialTime={60} />
```

## Development Workflow

```bash
npm run dev      # Dev server at localhost:4321 (hot reload enabled)
npm run build    # Production build → ./dist/
npm run preview  # Preview production build locally
```

## Project Conventions

- **Styling**: Tailwind CSS (add via `npm run astro -- add tailwind`)
- **TypeScript**: Strict mode enabled, type-check with Astro's built-in support
- **Component composition**: Use `<slot />` in layouts for content injection (see `Layout.astro`)
- **Static site generation (SSG)**: Default mode, no server-side rendering configured

## Data Layer

- **Backend**: Google Sheets API integration for data storage/retrieval
- **Use cases**: Workout plans, exercise databases, client schedules, progress tracking
- **Implementation**: Store API keys in `.env` (never commit!), fetch data in Astro frontmatter

## Media Management

- **CDN**: Cloudinary for hosting photos and videos
- **Usage**: Reference Cloudinary URLs in Google Sheets data, then fetch and display in components
- **Implementation**: Store Cloudinary credentials in `.env`, use Cloudinary URLs for exercise demos, client photos, etc.
- **Optimization**: Leverage Cloudinary's transformation API for responsive images and video thumbnails

## Fitness App Features

When building training/fitness features:
- **Pages**: Add routes like `src/pages/workouts.astro`, `schedule.astro`, `exercises.astro`
- **Components**: 
  - Static/presentational: Astro components (e.g., `ExerciseCard.astro`, `WorkoutPlan.astro`)
  - Interactive/dynamic: React components (e.g., `TimerWidget.tsx`, `ProgressChart.tsx`, `WorkoutForm.tsx`)
- **Data flow**: Fetch from Google Sheets in page frontmatter → pass to components as props
- **Client directives**: Use `client:load` for critical interactivity, `client:idle` for non-essential, `client:visible` for below-the-fold
- **Assets**: 
  - Static assets (icons, logos): Store in `src/assets/` and import as modules
  - Media content (exercise photos/videos): Host on Cloudinary, reference URLs from Google Sheets
