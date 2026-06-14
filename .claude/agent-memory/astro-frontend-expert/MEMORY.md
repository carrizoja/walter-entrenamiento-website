# Agent Memory — Walter Entrenamiento Frontend

## Critical: SVG Attributes in Astro vs React

**In `.astro` files**: SVG attributes MUST be kebab-case.
- `stroke-width`, `stroke-linecap`, `stroke-linejoin`, `fill-rule`, `clip-rule`, `preserve-aspect-ratio`

**In `.tsx` React files**: SVG attributes MUST be camelCase.
- `strokeWidth`, `strokeLinecap`, `strokeLinejoin`, `fillRule`, `clipRule`, `preserveAspectRatio`

Mixing these causes TS2322 errors that block the build.

## Dark Mode

- Dark mode variant: `@variant dark (.dark &)` in `global.css` — Tailwind `dark:` prefix works normally.
- Dark bg scale: `#0f0508` (deepest), `#130308`, `#1a0509`, `#3A0C13`, `#701D2A`
- HTML dark class set inline before render in `Layout.astro` to prevent FOUC.

## Brand Colors

- Primary orange: `#FF6B35`
- Dark orange: `#C83B08`
- Dark red: `#701D2A`
- Mid red: `#8C2A3B`
- Light red/pink: `#C56C7A`
- **Avoid**: `#3A86FF` (blue) — off-brand, was used in V1, being phased out in V2 overhaul.

## Button System

- `PrimaryButton.tsx` (React) and `PrimaryButton.astro` (static) — identical API.
- Variants: `primary` (orange gradient), `secondary` (outlined, fills on hover), `whatsapp` (green gradient + pulse).
- All buttons have `.btn-shimmer` class for the sweep animation defined in `global.css`.
- WhatsApp variant gets `animate-whatsapp-pulse` from `global.css` keyframes.

## Animation Classes (defined in global.css)

- `animate-float` / `animate-float-delayed` — gentle floating for stat cards
- `animate-pulse-glow` — orange glow pulse for brand accents
- `animate-whatsapp-pulse` — green ring pulse for WhatsApp CTAs
- `animate-scroll-bounce` — scroll indicator
- `animate-gradient-shift` — animated gradient backgrounds
- `animate-slow-rotate` — decorative rings, 20s rotation
- All have `prefers-reduced-motion` fallback in global.css

## CSS Custom Properties (global.css)

- `--gradient-brand`, `--gradient-dark`, `--gradient-hero-light/dark`
- `--shadow-brand-sm/md/lg/glow`, `--shadow-card`, `--shadow-card-hover`
- `--transition-smooth`, `--transition-spring`, `--transition-fast`

## Architecture Notes

- Static sections: `.astro` components (Hero, ServicesSection, Footer, Contact, ServiceCard, page sections)
- Interactive: `.tsx` React (Navbar, ThemeToggle, PrimaryButton)
- Pages: `/`, `/sobre-walter`, `/servicios`, `/bienestar`, `/galeria`, `/contacto`
- WhatsApp number: `5491168271296` | Instagram: `@walter.entrenamiento`
- Hero image: Cloudinary `v1759715478/walter_entrenamiento_b8yyai.png`
- Servicios image: Cloudinary `v1759943485/walter_yaamqr.png`

## Layout.astro — Per-Page SEO Props

`Layout.astro` accepts optional `title` and `description` props (added during V2 contact restructure).
Default values cover the home page. All other pages should pass their own.
Pattern: `<Layout title="Contacto | Walter Entrenamiento" description="...">`

## Section Design Rhythm (V2)

- Alternate bg: white → `gray-50` (light) / `#0f0508` → `#130308` (dark)
- Wave/curve dividers between major sections
- Decorative blob backgrounds using `blur-[80px]` circles, not SVG patterns
- Floating stat cards use `animate-float` + `animate-float-delayed`
- Section headers: eyebrow tag + large bold heading + body copy pattern

## ServiceCard Icon System (V2)

`ServiceCard.astro` now accepts `icon` as a typed union (not emoji string):
- Valid values: `'personal' | 'grupal' | 'terapeutico' | 'masajes' | 'rehabilitacion' | 'terapias'`
- Icons are inline SVG paths defined in the `iconPaths` record inside the component
- Do NOT pass emoji strings — use the typed values above

## Page Hero Pattern (V2)

All inner pages share this hero pattern:
1. White/dark bg with decorative blobs (blur circles), NO pattern.svg
2. Eyebrow pill tag with brand orange dot + uppercase label
3. Large black heading with gradient accent span
4. Subheading in gray
5. Wave SVG divider at bottom (fill matches next section bg)
Next section: `gray-50 / #130308` — alternates with `white / #0f0508`

## V2 Dark Background Scale

- Deepest: `#0f0508` (body, hero, alternating sections)
- Second: `#130308` (alternate sections)
- Card: `#1a0509` (card backgrounds, surfaces)
- Accent surfaces: `#3A0C13` (dark card accents inside gradient banners)

## CTA Banner Pattern (V2)

All section-bottom CTA banners use:
- `bg-gradient-to-br from-[#701D2A] via-[#8C2A3B] to-[#3A0C13]`
- Decorative orange glow blob top-right
- Subtle dot grid texture overlay (`opacity-[0.04]`)
- `rounded-3xl overflow-hidden`

## Contact Architecture (V2)

- `Contact.astro` (Home) = compact CTA strip only. Brand gradient band, headline + 2 buttons.
  - Keeps `id="contacto"` for anchor link compatibility.
  - Secondary button links to `/contacto`.
- `/contacto` page = full contact page with all cards, OpenStreetMap embed, and animated CTA banner.
- Navbar "Contacto" link now points to `/contacto` (not `/#contacto`).
- `isActive` in Navbar no longer needs the `/#` hash-link special case.

## OpenStreetMap Embed (no API key)

Almagro, Buenos Aires embed URL:
`https://www.openstreetmap.org/export/embed.html?bbox=-58.4378,-34.6205,-58.3978,-34.6005&layer=mapnik&marker=-34.6105,-58.4178`
Use: `loading="lazy"`, `style="border: none;"`, `width="100%"`, explicit `height` (e.g. 480).

## Component Paths

- `src/styles/global.css` — Tailwind + all custom CSS, keyframes, utilities
- `src/layouts/Layout.astro` — base layout; accepts `title` + `description` props
- `src/components/Hero.astro`
- `src/components/ServicesSection.astro`
- `src/components/ServiceCard.astro`
- `src/components/Contact.astro` — compact CTA strip (home only), links to /contacto
- `src/components/Footer.astro`
- `src/components/Navbar.tsx`
- `src/components/ThemeToggle.tsx`
- `src/components/ux/PrimaryButton.tsx` + `.astro`
- `src/pages/contacto.astro` — full dedicated contact page
