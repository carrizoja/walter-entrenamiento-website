## ADDED Requirements

### Requirement: Compact size table

The `PrimaryButton` component SHALL expose exactly three sizes — `sm`, `md`, `lg` — with the following Tailwind utility classes, and no other per-size styling. Rendered button heights SHALL be approximately 28 CSS px for `sm`, 44 CSS px for `md`, and 48 CSS px for `lg`.

| Size | Classes                              |
|------|--------------------------------------|
| sm   | `px-3.5 py-1.5 text-xs gap-1.5`      |
| md   | `px-5 py-3 text-sm gap-2`            |
| lg   | `px-6 py-3 text-base gap-2.5`        |

#### Scenario: `md` is the default size and meets the 44 CSS-px touch target

- **WHEN** a consumer renders `<PrimaryButton text="..." />` with no `size` prop
- **THEN** the component SHALL apply the `md` classes `px-5 py-3 text-sm gap-2`
- **AND** the rendered element SHALL have a computed height of at least 44 CSS pixels under the default Tailwind v4 `text-sm` line-height (`1.25rem`).

#### Scenario: `lg` is visibly larger than `md` without exceeding 48 CSS px

- **WHEN** a consumer renders `<PrimaryButton size="lg" text="..." />`
- **THEN** the component SHALL apply `px-6 py-3 text-base gap-2.5`
- **AND** the rendered height SHALL be approximately 48 CSS pixels (12 + 24 + 12).

#### Scenario: `sm` is reserved for dense desktop contexts

- **WHEN** a consumer renders `<PrimaryButton size="sm" text="..." />`
- **THEN** the component SHALL apply `px-3.5 py-1.5 text-xs gap-1.5`
- **AND** the consumer SHOULD only use `sm` inside desktop-only chrome (e.g., the navbar CTA visible at the `md:` breakpoint or wider)
- **AND** `sm` SHALL NOT be used as the primary call-to-action on mobile viewports because its ~28 px height is below the 44 px touch-target recommendation.

### Requirement: Icon glyphs scale with size

Inline icon SVGs rendered inside a `PrimaryButton` SHALL use size-appropriate Tailwind width/height classes. The component SHALL pick the icon class from a per-size lookup table, not a fixed value.

| Size | `whatsapp` / `instagram` class | `arrow` class |
|------|--------------------------------|---------------|
| sm   | `w-3.5 h-3.5`                  | `w-3 h-3`     |
| md   | `w-4 h-4`                      | `w-3.5 h-3.5` |
| lg   | `w-5 h-5`                      | `w-4 h-4`     |

#### Scenario: WhatsApp/Instagram icon scales down on `md`

- **WHEN** a consumer renders `<PrimaryButton size="md" icon="whatsapp" text="..." />`
- **THEN** the rendered `<svg>` SHALL have classes `w-4 h-4 shrink-0` (not `w-5 h-5`).

#### Scenario: Arrow icon scales with button size

- **WHEN** a consumer renders `<PrimaryButton size="sm" icon="arrow" text="..." />`
- **THEN** the rendered arrow `<svg>` SHALL have classes `w-3 h-3 shrink-0` and retain the existing `transition-transform duration-300 group-hover:translate-x-1` behavior.

#### Scenario: Auto-appended arrow on `secondary` variant scales with size

- **WHEN** a consumer renders `<PrimaryButton variant="secondary" size="lg" text="..." />` with no explicit `icon`
- **THEN** the component SHALL still auto-append the arrow glyph
- **AND** the arrow SHALL render with `w-4 h-4 shrink-0` (the `lg` entry in the arrow lookup).

### Requirement: Astro and React implementations stay in lockstep

The `.tsx` and `.astro` copies of `PrimaryButton` SHALL share the exact same size-classes table and the exact same icon-classes table. Any future change to either table SHALL be applied to both files in the same commit.

#### Scenario: Size tables match byte-for-byte

- **WHEN** comparing the `sizeClasses` record in `src/components/ux/PrimaryButton.tsx` against the `sizeClasses` record in `src/components/ux/PrimaryButton.astro`
- **THEN** the three entries (`sm`, `md`, `lg`) SHALL be string-equal.

#### Scenario: Icon tables match byte-for-byte

- **WHEN** comparing the per-size icon-class lookup in `PrimaryButton.tsx` against the equivalent lookup in `PrimaryButton.astro`
- **THEN** each `(size, icon)` pair SHALL resolve to the same Tailwind class string in both files.

### Requirement: Public API is unchanged

The `PrimaryButton` component SHALL continue to accept the same props it accepts today — `href`, `text`, `icon` (`whatsapp | instagram | arrow`), `variant` (`primary | secondary | whatsapp`), `size` (`sm | md | lg`), `target`, `rel`, `className` (or `class` on the Astro side), `id`, `ariaLabel`, and `onClick` (tsx only). No prop SHALL be added, removed, renamed, or have its type changed by this change.

#### Scenario: Existing call sites render without edits

- **WHEN** any existing consumer of `PrimaryButton` (e.g., `Hero.astro`, `Contact.astro`, `Navbar.tsx`, `servicios.astro`) is left untouched
- **THEN** the page SHALL still compile and render
- **AND** the only visible difference SHALL be reduced button dimensions.

#### Scenario: Unchanged variant and hover behavior

- **WHEN** a button is rendered with `variant="primary"`, `variant="secondary"`, or `variant="whatsapp"` at any size
- **THEN** the base classes (`btn-shimmer`, focus ring, `rounded-xl`, transition), the variant-specific gradient/border/shadow, and the hover/active transforms SHALL be unchanged from the pre-change implementation.
