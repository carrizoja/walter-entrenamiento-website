## Context

The site exposes a single reusable button (`PrimaryButton`) in two twin implementations:

- `src/components/ux/PrimaryButton.tsx` — React (used inside `client:*` trees, e.g. `Navbar.tsx`).
- `src/components/ux/PrimaryButton.astro` — Astro (used in every static page and section).

Both files ship three size buckets (`sm`, `md`, `lg`) that set Tailwind `px-*`, `py-*`, `text-*`, and `gap-*` utilities on the root element.

Current dimensions (Tailwind v4 defaults):

| Size | Classes | Approx. height |
|------|--------------------------------------------|----------------|
| sm   | `px-5 py-2.5 text-sm gap-2`                | ~40px          |
| md   | `px-6 py-3.5 text-base gap-2.5`            | ~52px          |
| lg   | `px-8 py-4 text-lg gap-3` (tsx)            | ~60px          |
| lg   | `px-8 py-3.5 text-lg gap-3` (astro)        | ~56px          |

Usage distribution across the codebase is heavily skewed: **19 `size="lg"`**, **1 `size="md"`**, **1 `size="sm"`**. The `lg` and `md` variants also drift between the `.tsx` and `.astro` copies (different `py`), which is a silent bug. Everything on the home page, service cards, contact blocks, and blog CTAs renders `lg`, which is the root cause of the "too big" feeling the user reported.

Brand system lives in `src/styles/global.css` (Tailwind v4 CSS config, class-based dark mode, Montserrat/Quicksand fonts). There are no design tokens for button heights — sizes are spelled out as utility classes per call site.

## Goals / Non-Goals

**Goals:**
- Make every button visibly smaller on every breakpoint (mobile, tablet, desktop) without touching a single consumer call site.
- Keep the `md` and `lg` sizes at or above a 44×44 CSS-px touch target so the site keeps passing mobile tap-target audits.
- Bring the `.tsx` and `.astro` variants into byte-for-byte agreement on the size table.
- Preserve the public API (`size`, `variant`, `icon`, everything else) unchanged.

**Non-Goals:**
- No new sizes, variants, icons, or props.
- No per-breakpoint responsive size swap (e.g., `sm:size-md lg:size-lg`) — a single set of utilities per size is enough for this pass.
- No changes to animation, hover, focus-ring, shadow, or shimmer behavior.
- No token extraction into CSS custom properties or a Tailwind plugin — resizing is a one-line-per-size change.
- No edits to one-off buttons (e.g., Footer links, admin pages) that don't go through `PrimaryButton`.

## Decisions

### Decision 1: Shrink via the existing Tailwind utility classes in the size table

Both `PrimaryButton` files already have a `sizeClasses` lookup. We edit those two tables and nothing else. Alternative considered: introduce CSS custom properties for button height and gap. Rejected — it would touch `global.css`, the component, and invalidate the existing utility-first pattern without a proportional benefit for a one-off resize.

### Decision 2: Target heights — 28 / 44 / 48 CSS px

| Size | New classes                        | Height | Old height | Δ    |
|------|------------------------------------|--------|------------|------|
| sm   | `px-3.5 py-1.5 text-xs gap-1.5`    | ~28px  | ~40px      | −30% |
| md   | `px-5 py-3 text-sm gap-2`          | ~44px  | ~52px      | −15% |
| lg   | `px-6 py-3 text-base gap-2.5`      | ~48px  | ~60px      | −20% |

`md = 44px` is chosen so the default size still meets the WCAG 2.2 AA / Apple HIG / Material recommendation of a 44-CSS-px touch target. `lg` stays a step above `md` (48px via `text-base` line-height 24 + py-3 × 2 = 48), keeping a visible hierarchy. `sm` is intentionally sub-44px because it is only used in dense desktop chrome (e.g., collapsed navbar CTA) — documented in the spec.

Alternative considered: leave `lg` at 52px (same as today's `md`) to give hero CTAs more weight. Rejected — it defeats the user's stated goal of "smaller on every view," and 48px is still a generous hero button.

### Decision 3: Scale the icon glyphs with the button size

Icons (`whatsapp`, `instagram`) are hardcoded to `w-5 h-5` inside both files. That's disproportionately large against the new `py-3` buttons. The `arrow` glyph similarly uses `w-4 h-4` (astro) / `w-4.5 h-4.5` (tsx — another silent drift).

New mapping:

| Size | `whatsapp` / `instagram` | `arrow` |
|------|--------------------------|---------|
| sm   | `w-3.5 h-3.5`            | `w-3`   |
| md   | `w-4 h-4`                | `w-3.5` |
| lg   | `w-5 h-5`                | `w-4`   |

Implementation: a per-size icon-class lookup inside each `PrimaryButton` file, passed into the inline SVG markup. The existing `group-hover:translate-x-1` on the arrow stays intact.

Alternative considered: keep icons fixed at `w-4 h-4` across all sizes. Rejected — on `sm` it still looks too heavy, and on `lg` the text would dominate the icon awkwardly.

### Decision 4: Unify `.tsx` and `.astro` byte-for-byte

The two files must ship identical size and icon tables. Today they drift (tsx has `py-4 lg` + `w-4.5` arrow; astro has `py-3.5 lg` + `w-4` arrow). The change writes the same table to both files and adds an OpenSpec scenario that calls this out, so future edits don't re-introduce the drift.

Alternative considered: deduplicate the table into a shared TS module imported by both. Rejected for this change — Astro and React use different className plumbing (`class:` vs `className`, `Fragment set:html` vs JSX) and extracting the table alone provides marginal value while adding a new file. Revisit only if a third implementation appears.

## Risks / Trade-offs

- **Risk: `sm` drops below the 44px touch recommendation (28px).**
  - Mitigation: spec-level rule restricts `sm` to dense desktop contexts (navbar, admin chrome). Document in the spec; call-site audit already confirms the one current `sm` usage is the navbar CTA shown only at `md:` breakpoint up, so mobile traffic never sees it.
- **Risk: Visual regression on hero sections — the page balance was tuned for the larger buttons, so smaller CTAs might leave awkward whitespace.**
  - Mitigation: ship the change as a single commit and eyeball each affected page (`Hero`, `ServicesSection`, `Contact`, `servicios`, `sobre-walter`, `galeria`, `bienestar`, `bienestar/[slug]`, `contacto`) in dev (`npm run dev`) at three viewport widths (375, 768, 1280). No consumer markup changes expected; if one page truly needs more vertical air, that is a follow-up, not part of this change.
- **Risk: Dark-mode contrast on the `secondary` variant relies on a `border-2` that, combined with smaller padding, could look pinched.**
  - Mitigation: `px-5 py-3` on `md` still leaves ~16px horizontal text-to-border margin. Verify visually on `/sobre-walter` and `/servicios` where secondary buttons appear.
- **Risk: Hover `scale-[1.03]` on the tsx version plus the smaller base size makes the hover-up feel more jumpy.**
  - Mitigation: scale factor is a ratio, so the absolute jump shrinks proportionally — no change needed. Note: the astro variant already has these scales commented out; the change does not touch that line.
- **Trade-off: Breaks pixel-perfect parity with prior screenshots / mocks.**
  - Accepted — the user explicitly asked for smaller buttons.

## Migration Plan

1. Edit `src/components/ux/PrimaryButton.tsx` — replace `sizeClasses` table and per-icon `className` strings with the new values.
2. Edit `src/components/ux/PrimaryButton.astro` — apply the same `sizeClasses` table and update the inline SVG `class="w-5 h-5"` strings to pull from a new per-size icon-class map.
3. Run `npm run astro check` and `npm run build` to confirm no TS or Astro compile errors.
4. `npm run dev` and verify the ten affected pages/components render at the new size on mobile (375px), tablet (768px), and desktop (1280px) widths. Specifically check: hero CTA stack on `/`, contact block, service cards, navbar CTA, and each blog CTA.
5. No rollback needed beyond `git revert` — the change is confined to two files.

## Open Questions

- None. Values, classes, and affected files are all determined above. Consumer call sites do not need edits because only the size lookup table is changing.
