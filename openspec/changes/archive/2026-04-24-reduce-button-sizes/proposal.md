## Why

Buttons across the Walter Entrenamiento site feel oversized on every breakpoint. Nearly every call-to-action renders the `lg` size (`px-8 py-4 text-lg`), which dominates hero sections, service cards, contact blocks, and the mobile navbar. This makes the layout feel heavy, pushes important content below the fold on mobile, and clashes with the visual hierarchy the site is trying to establish. Smaller buttons will tighten the design language without sacrificing touch-target accessibility.

## What Changes

- Reduce the padding and type scale of the three `PrimaryButton` sizes (`sm`, `md`, `lg`) so every size renders visibly smaller while still meeting the WCAG 2.2 AA 44×44 minimum target on touch.
- Shrink the icon glyphs used inside buttons (WhatsApp, Instagram, arrow) proportionally to the new sizes.
- Make both `PrimaryButton` implementations (the `.tsx` React version and the `.astro` static version) stay byte-for-byte consistent in their size tables so the site renders identically regardless of which variant a page imports.
- Do not introduce a new size prop, new variant, or new public API — this is a pure resize of existing tokens.

## Capabilities

### New Capabilities
- `primary-button`: The shared PrimaryButton component contract — sizes, variants, icon rendering, and touch-target requirements. This capability has not been formalized before; the change creates its first spec to lock in the new smaller dimensions.

### Modified Capabilities
<!-- None - no prior specs exist in openspec/specs/. -->

## Impact

- Affected components: `src/components/ux/PrimaryButton.tsx`, `src/components/ux/PrimaryButton.astro`.
- Affected pages/components (visual regression surface only — no prop changes required): `Hero.astro`, `Contact.astro`, `ServicesSection.astro`, `Navbar.tsx`, `servicios.astro`, `sobre-walter.astro`, `galeria.astro`, `bienestar.astro`, `bienestar/[slug].astro`, `contacto.astro`.
- No API, data, Supabase, or env-var changes.
- No breaking changes for consumers: existing `size="sm|md|lg"` props continue to work; only the rendered dimensions shrink.
- Accessibility: touch targets must remain ≥44×44 CSS px at the `md` and `lg` sizes on touch-coarse pointers; `sm` is limited to desktop/secondary contexts.
