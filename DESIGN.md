---
name: Winterest
description: Cloudflare + Bun technical portfolio shaped by Flat Precision.
colors:
  winterest-orange: '#f48120'
  winterest-orange-soft: 'rgba(244, 129, 32, 0.08)'
  winterest-orange-soft-dark: 'rgba(244, 129, 32, 0.12)'
  winterest-orange-deep-light: '#ca5f0a'
  winterest-orange-deep-dark: '#ff9b44'
  paper-white: '#ffffff'
  zinc-surface-light: '#f4f4f5'
  technical-ink: '#111111'
  muted-zinc-light: '#71717a'
  line-light: 'rgba(0, 0, 0, 0.09)'
  obsidian: '#0f0f10'
  technical-dark-light: '#121214'
  technical-dark-dark: '#0a0a0c'
  header-translucent-light: 'rgba(255, 255, 255, 0.82)'
  header-translucent-dark: 'rgba(15, 15, 16, 0.82)'
  surface-translucent-light: 'rgba(255, 255, 255, 0.85)'
  surface-translucent-dark: 'rgba(22, 22, 24, 0.85)'
  grid-line-light: 'rgba(0, 0, 0, 0.045)'
  grid-line-dark: 'rgba(255, 255, 255, 0.04)'
  zinc-surface-dark: '#161618'
  zinc-surface-dark-raised: '#1a1a1c'
  technical-white: '#f4f4f5'
  muted-zinc-dark: '#a1a1aa'
  line-dark: 'rgba(255, 255, 255, 0.1)'
  chart-blue-light: '#0284c7'
  chart-green-light: '#16a34a'
  chart-yellow-light: '#eab308'
  chart-red-light: '#dc2626'
  chart-blue-dark: '#38bdf8'
  chart-green-dark: '#4ade80'
  chart-yellow-dark: '#facc15'
  chart-red-dark: '#f87171'
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontWeight: 600
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: '0.75rem'
    fontWeight: 800
    letterSpacing: '0.08em'
rounded:
  sm: '0.375rem'
  md: '0.5rem'
  lg: '0.625rem'
  xl: '0.875rem'
  xxl: '1rem'
  surface: '0.75rem'
  pill: '999px'
components:
  button-primary:
    backgroundColor: '{colors.winterest-orange}'
    textColor: '#ffffff'
    rounded: '{rounded.md}'
    padding: '0.5rem 1rem'
    height: '2.25rem'
  input:
    backgroundColor: 'transparent'
    textColor: '{colors.technical-ink}'
    rounded: '{rounded.md}'
    padding: '0.25rem 0.75rem'
    height: '2.25rem'
  card-light:
    backgroundColor: '{colors.paper-white}'
    textColor: '{colors.technical-ink}'
    rounded: '{rounded.xl}'
  card-dark:
    backgroundColor: '{colors.zinc-surface-dark}'
    textColor: '{colors.technical-white}'
    rounded: '{rounded.xl}'
  navigation-link-active:
    backgroundColor: '{colors.winterest-orange-soft}'
    textColor: '{colors.technical-ink}'
    rounded: '{rounded.pill}'
    padding: '0.45rem 0.75rem'
  navigation-link-active-dark:
    backgroundColor: '{colors.winterest-orange-soft-dark}'
    textColor: '{colors.technical-white}'
    rounded: '{rounded.pill}'
    padding: '0.45rem 0.75rem'
  badge-primary:
    backgroundColor: '{colors.winterest-orange}'
    textColor: '#ffffff'
    rounded: '{rounded.md}'
    padding: '0.125rem 0.5rem'
  hero-visual:
    backgroundColor: '{colors.paper-white}'
    textColor: '{colors.technical-white}'
    rounded: '{rounded.xxl}'
---

# Design System: Winterest

## Overview

**Creative North Star: “Cloudflare + Bun, in Flat Precision.”**

Winterest’s visual identity pairs a direct, technical personality with a playful personal edge. Cloudflare and Bun are the inspiration, not templates to copy. Flat Precision keeps ordinary surfaces solid, separated by clear contrast and crisp borders; Winterest Orange is the deliberate signal for primary actions and active states.

The 36px background grid supplies a restrained technical texture. A few existing focal treatments are intentionally localized: the sticky header and brand lockup use translucency and gradient highlights, while the hero visual uses dark overlay panels and soft motion around the original Winterest mascot. These are exceptions, not a pattern to spread across cards. The public portfolio and private CMS share the same palette and typography across light and dark themes. Dashboard views stay task-first, favoring the existing sidebar and topbar structure, legible tables and lists, clear status badges, and direct editing forms over decorative treatment.

**Key Characteristics:**

- Cloudflare + Bun technical character, without copying either product’s interface.
- Flat, solid surfaces with border-led separation and restrained elevation.
- A single orange signal against light or dark neutral foundations.
- Consistent typography and components across the public portfolio and CMS.

## Colors

Winterest Orange carries interaction emphasis; Paper White, Zinc Surfaces, Technical Ink, and Obsidian establish the light and dark neutral systems. Chart colors are functional series colors, not additional brand accents.

### Primary

- **Winterest Orange**: primary actions, active navigation, and focus treatment in both themes.
- **Soft Orange**: restrained active and hover surface for public navigation.
- **Light Orange Ink**: orange text and small highlights on light surfaces.
- **Dark Orange Ink**: orange text and highlights on dark surfaces.

### Neutral

- **Paper White**: light page, card, and popover surfaces.
- **Zinc Surface, Light**: secondary and muted light surfaces.
- **Technical Ink**: primary text in the light theme.
- **Muted Zinc, Light**: secondary text in the light theme.
- **Light Hairline**: borders and separators in the light theme.
- **Obsidian**: dark page canvas.
- **Zinc Surface, Dark**: dark cards and popovers; the raised surface uses the darker zinc token.
- **Technical White**: primary text in the dark theme.
- **Muted Zinc, Dark**: secondary text in the dark theme.
- **Dark Hairline**: borders and separators in the dark theme.
- **Technical Dark, Light and Dark**: deeper panels for code and signal previews.
- **Translucent Header, Light and Dark**: limited to the sticky site header.
- **Grid Lines, Light and Dark**: subtle global background texture.

### Tertiary

- **Chart Series**: blue, green, yellow, and red series tokens adapt between light and dark themes. Keep them scoped to data visualization.

**The Orange Signal Rule.** Use Winterest Orange for actions and interaction state, not as a broad decorative wash.

## Typography

- **Display Font:** Inter (with the system sans-serif stack)
- **Body Font:** Inter (with the system sans-serif stack)
- **Label/Mono Font:** Inter for labels; system monospace for code.

**Character:** One sans-serif family keeps headings, body copy, and controls consistent. Code uses the platform monospace stack rather than introducing a separate display face.

### Hierarchy

- **Display and headings** (semibold, tight tracking): The shared section heading is 30px, scaling to 36px at the small-screen utility breakpoint.
- **Body** (regular, comfortable line-height): Inter and the system sans-serif fallbacks.
- **Label** (heavy weight, uppercase, tracked): short eyebrow labels and grouped dashboard headings.
- **Code** (system monospace): inline and block code only.

## Layout

The public content container spans the viewport with 16px side gutters and caps at 72rem, centered. The global background uses a 36px square grid beneath a subtle vertical surface transition. The sticky public header is translucent and blurred, with the Winterest brand lockup as its gradient-highlighted anchor. Keep these treatments localized, and keep foreground sections readable and surfaces distinct from the grid.

The CMS uses a persistent sidebar hierarchy with a topbar and content area. Give tables, lists, status, and editing forms enough room to scan and operate. Reflow content at narrower widths without clipping navigation or data controls; exact breakpoints remain owned by the implementation.

## Elevation & Depth

Flat is the default. Separate content with neutral surface contrast and hairline borders; the shared card uses a restrained shadow, and popovers use a small contextual shadow. Stronger shadows and translucent overlays belong only to focal media such as the hero visual. Avoid broad ambient shadows or glow as substitutes for hierarchy.

**The Flat Surface Rule.** Prefer solid surfaces and clear boundaries. Use elevation only when a component needs to separate from surrounding content.

## Shapes

The shared radius scale covers compact controls through larger content surfaces. Buttons and inputs use the medium step; standard cards use the extra-large step, while custom surface cards use the dedicated surface step. Navigation links, status markers, and icon controls may use pill or circular shapes where their compact control role calls for them. Keep this variation purposeful rather than making every surface a pill.

## Components

### Buttons

- **Character:** compact, direct controls with clear action hierarchy.
- **Shape:** medium radius; compact default height.
- **Primary:** Winterest Orange with white text and bold weight.
- **Hover / Focus:** orange darkens slightly on hover; focus uses a visible orange ring.
- **Secondary / Ghost / Tertiary:** border, secondary surface, or transparent treatments from the existing variants.

### Chips

- **Style:** compact bordered labels with the shared medium radius; default and destructive states use semantic colors.
- **State:** use status labels for real states, not decoration.

### Cards / Containers

- **Character:** flat, structured content surfaces.
- **Corner Style:** extra-large radius for the shared card primitive; dedicated surface radius for the custom surface-card.
- **Background:** theme-specific solid card surface.
- **Shadow Strategy:** restrained shared shadow only where the component uses it; custom surface cards rely on a hairline border.
- **Internal Padding:** shared card content uses 24px horizontal padding, with 24px vertical card padding.

### Inputs / Fields

- **Style:** transparent background, thin theme-aware border, medium corners, and compact height.
- **Focus:** border color and a visible 3px ring use the theme’s orange focus token.
- **Error / Disabled:** invalid fields use destructive border/ring colors; disabled fields reduce opacity and disable pointer interaction.

### Navigation

- **Brand lockup:** rounded cloud mark with a small sparkle and Winterest name, framed by a localized orange gradient highlight.
- **Public:** the sticky header uses a translucent blurred surface; pill links use muted text at rest, orange-tinted active/hover surfaces, and a subtle 1px hover lift.
- **Dashboard:** grouped sidebar links distinguish active items with a surface shift and stronger text; orange marks selected page links.
- **Popover:** compact solid panel with a hairline border and contextual shadow. Keep blur and gradient treatments limited to the header and brand mark.

### Hero Visual

- **Shape:** extra-large rounded image frame.
- **Composition:** the original Winterest mascot is the focal image, with compact technology marks and dark translucent information panels around it.
- **Motion:** a slow image float and short staggered entrances provide life without delaying the content.
- **Boundary:** this is the portfolio's expressive focal composition, not a template for ordinary cards.

### Feature-Specific Legacy Gallery

The About page's glass-shard gallery uses angular image crops, specular gradients, and stronger shadows. It is a feature-specific legacy treatment, not a reusable surface pattern. Its current third-party game-character imagery conflicts with the no-copy guardrail; do not expand it or use those images as a reference for new work.

## Do's and Don'ts

### Do:

- **Do** keep surfaces flat and solid, using hairline borders and contrast to establish structure.
- **Do** reserve orange emphasis for real actions, focus, and active states.
- **Do** keep the existing grid as a restrained background texture.
- **Do** make light and dark themes feel like the same system with theme-appropriate neutrals.
- **Do** keep CMS motion restrained and prioritize scanability in tables, lists, and forms.
- **Do** pair original Winterest mascot art with truthful profile or project content; never use it as a substitute for showing the work.
- **Do** keep blur, transparency, and gradient highlights limited to the existing header and hero focal treatments.

### Don't:

- **Don't** add oversized glow halos, decorative blur spheres, or heavy gradient washes to cards.
- **Don't** spread the background grid across every card and panel.
- **Don't** let decorative effects compete with portfolio content or dashboard tasks.
- **Don't** treat a generic resume template as the finished visual presentation.
- **Don't** copy Cloudflare, Bun, or copyrighted character designs directly.
- **Don't** use heavy parallax, scroll-jacking, or motion that delays content or harms readability.
- **Don't** generalize the About page's third-party character gallery into new pages or components.
