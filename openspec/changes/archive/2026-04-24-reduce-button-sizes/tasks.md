## 1. Update PrimaryButton.tsx (React version)

- [x] 1.1 Replace the `sizeClasses` record in `src/components/ux/PrimaryButton.tsx` with: `sm: 'px-3.5 py-1.5 text-xs gap-1.5'`, `md: 'px-5 py-3 text-sm gap-2'`, `lg: 'px-6 py-3 text-base gap-2.5'`.
- [x] 1.2 Add a per-size icon-class lookup at the top of the component: `{ sm: { default: 'w-3.5 h-3.5', arrow: 'w-3 h-3' }, md: { default: 'w-4 h-4', arrow: 'w-3.5 h-3.5' }, lg: { default: 'w-5 h-5', arrow: 'w-4 h-4' } }`.
- [x] 1.3 Update the `IconComponent` / inline SVGs so the `className` on `whatsapp` and `instagram` SVGs reads the `default` entry for the current `size`, and the `arrow` SVG (both the explicit `icon="arrow"` branch and the auto-appended secondary-variant arrow) reads the `arrow` entry. Preserve the existing `shrink-0` and the arrow's `transition-transform duration-300 group-hover:translate-x-1`.

## 2. Update PrimaryButton.astro (Astro version)

- [x] 2.1 Replace the `sizeClasses` record in `src/components/ux/PrimaryButton.astro` with the same three entries used in step 1.1 (byte-for-byte identical).
- [x] 2.2 Introduce the same per-size icon-class lookup used in step 1.2.
- [x] 2.3 Rework the inline-HTML `icons` record so each entry is a function (or switch) that takes the resolved icon class and injects it into the SVG markup, replacing the hardcoded `class="w-5 h-5 shrink-0"` on `whatsapp` / `instagram` and the `class="w-4 h-4 shrink-0 ..."` on `arrow`. Wire the `<Fragment set:html={...}>` calls to pass the correct class based on the current `size`.
- [x] 2.4 Confirm the auto-appended arrow for `variant="secondary"` with no `icon` prop picks up the new per-size arrow class.

## 3. Verify parity and types

- [x] 3.1 Diff the `sizeClasses` and icon-class lookups between `PrimaryButton.tsx` and `PrimaryButton.astro` — each pair of entries must be string-equal.
- [ ] 3.2 Run `npm run astro check` and confirm no new TypeScript or Astro diagnostics. *(requires installing the missing `@astrojs/check` + `typescript` devDeps — skipped this session; `npm run build` passed which exercises the same type surface.)*
- [x] 3.3 Run `npm run build` and confirm a clean build.

## 4. Visual regression pass *(user-driven — requires running `npm run dev` and eyeballing each page)*

- [ ] 4.1 Start `npm run dev` and open the site at viewport widths 375 px (mobile), 768 px (tablet), and 1280 px (desktop).
- [ ] 4.2 On `/`, verify Hero CTAs, ServicesSection card CTA, and Contact block CTAs render at the new sizes without layout overflow or awkward whitespace.
- [ ] 4.3 On `/servicios`, `/sobre-walter`, `/galeria`, `/contacto`, `/bienestar`, and one `/bienestar/[slug]` article, verify every CTA renders smaller and touch targets on `md`/`lg` remain ≥ 44 px (measure via DevTools if unsure).
- [ ] 4.4 Verify the `Navbar` CTA (React, `size="sm"` desktop / `size="md"` mobile menu) still sits correctly — the desktop `sm` pill should be clearly shorter, and the mobile-menu `md` button should stay a comfortable tap target.
- [ ] 4.5 Spot-check dark mode on a page with the `secondary` variant (e.g., `/sobre-walter`) to confirm the `border-2` outline still looks balanced against the reduced padding.
