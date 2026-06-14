# Walter Entrenamiento App

Astro 6 + React 19 + Tailwind CSS v4 site for Walter Entrenamiento.

## Commands

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run astro -- <command>`
- `npm run firestore:import -- <path-to-seed-json>`

There is no test runner, linter, or formatter configured in `package.json`. Use `npm run build` as the primary verification step.

## Firebase Setup

- Firebase operator guide: `docs/firebase-setup.md`
- Firestore migration guide: `docs/firestore-migration.md`
- Tracked env template: `.env.example`
- Firestore indexes: `firebase/firestore.indexes.json`
- Firestore seed template: `firebase/firestore-seed.sample.json`

## Notes

- `tailwind.config.js` is legacy and not used by Tailwind v4.
- Any page that handles auth, POST requests, or request-time data must declare `export const prerender = false;`.
# walter-entrenamiento-website
