---
trigger: always_on
---

# Design System, UI Components, Animation & 3D Guidelines

## Aesthetic Direction

- **Theme**: Cloudflare + Bun Developer Persona
- **Color Direction**: Curated Cloudflare orange (#f48120), crisp pure white (#ffffff), deep technical dark gray (#0f0f10 / #161618), neutral hairline borders.
- **Tone**: Fast, technical, clean, playful, and responsive with full light and dark mode compatibility.

### Suggested Color Tokens

```txt
brand.orange       Cloudflare vibrant orange (#f48120)
brand.orangeSoft   Crisp subtle orange tint for badges and highlights
brand.orangeDeep   Deep burnt orange for accents
brand.cream        Crisp neutral light gray/white surface (#ffffff / #f4f4f5)
brand.dark         Deep technical obsidian black for dark mode background (#0f0f10 / #0a0a0c)
brand.gray         Neutral solid dark gray for panels and cards (#161618)
brand.border       Crisp neutral hairline border (rgba(0,0,0,0.09) / rgba(255,255,255,0.1))
brand.glow         (Deprecated/Restricted) Minimal subtle glow only for focused active inputs, not card decoration
```

---

## Tailwind CSS v4 Class Syntax Rule

Prefer Tailwind CSS v4 simplified variable syntax over legacy bracket syntax:

- **Use**: `text-(--brand-ink)`, `bg-(--brand-orange-soft)`, `border-(--brand-line)`, `shadow-(--brand-orange-soft)`
- **Avoid legacy**: `text-[var(--brand-ink)]`, `bg-[var(--brand-orange-soft)]`, `border-[var(--brand-line)]`, `shadow-[var(--brand-orange-soft)]`

---

## Flat Precision Architecture (Cloudflare + Bun Standard)

Following the `/impeccable` design standards (`craft-floor.md` & `quieter.md`) and the minimalist, high-speed engineering identities of **Cloudflare** and **Bun**:

### 1. Ban Excessive Glow Halos & Decorative Blur Orbs

- **No Colored Halos**: Do **NOT** use zero-offset or oversized colored glow shadows (e.g. `shadow-[0_18px_48px_var(--brand-glow)]`, `shadow-[0_10px_25px_-5px_var(--brand-orange-soft)]`, `shadow-[0_16px_44px_var(--brand-glow)]`).
- **No Decorative Blur Spheres**: Do **NOT** add floating colored blur orbs behind cards (e.g. `<div className="... size-40 rounded-full bg-(--brand-orange)/10 blur-2xl ... />`). Per `/impeccable`: _"A zero-offset colored halo is decoration."_ Depth must be structural, not fuzzy ambient lighting.

### 2. Flat Solid Surfaces over Multi-Stop Gradients

- **Solid Surfaces**: Use clean, flat solid surface panels (`bg-card`, `bg-(--surface-strong)`, `bg-surface`) with high contrast against the background grid.
- **No Card Gradient Washes**: Avoid multi-stop diagonal gradients on cards (e.g. `bg-linear-to-br from-(--surface-card) via-(--surface-card) to-(--brand-orange-soft)/30`). Gradients degrade text legibility and evoke dated template aesthetics.
- **Linear Grid Technical Backdrop**: The only allowed gradient pattern is the subtle technical network grid on `body` (`36px x 36px` hairline grid) reflecting Cloudflare's network topology.

### 3. Hairline Border-Driven Depth

- Depth and elevation must be achieved through **hairline 1px borders** (`border border-(--brand-line)`), subtle surface contrast, and minimal neutral elevation (`shadow-xs` / `shadow-sm`), rather than heavy drop shadows.
- On hover, provide crisp, immediate feedback via border color illumination (`hover:border-(--brand-orange)`) or subtle -1px translateY, not massive blurred shadow blooms.

### 4. Purposeful Single-Accent Orange (`#f48120`)

- Use Cloudflare orange strictly as a sharp, deliberate accent: active navigation pills, primary CTA buttons, focus rings (`outline-ring`), and interactive hover highlights.
- Do not smear orange into background washes, card fills, or ambient neon lighting.

---

## UI Component Guidelines

- **Primitives**: Build on `shadcn/ui`-style primitives powered by Radix UI.
- **Composition**: Use `cn()` (`clsx` + `tailwind-merge`) and `class-variance-authority` (CVA) for variant styling.
- **Separation**: Keep public marketing components (`src/components/marketing/` or `src/components/visuals/`) cleanly separated from admin dashboard components (`src/components/dashboard/`).
- **Reusable Component Set**:
  `Container`, `Section`, `SectionHeader`, `Badge`, `Button`, `Card`, `GlowCard`, `ProjectCard`, `TechBadge`, `Timeline`, `CommandCard`, `FeatureGrid`, `DashboardShell`, `DashboardSidebar`, `DashboardHeader`, `DataTable`, `EmptyState`, `FormField`, `StatusBadge`.

---

## Animation & Motion Rules

- **Tasteful & Fast**: Subtlety over heavy distraction. Soft glow, smooth fades, and light hover interactions.
- **Allowed**: Subtle hover transitions, fade/slide reveal, background glow motion, lightweight cursor-follow accent, mascot idle movements.
- **Avoid**: Excessive parallax, heavy scroll-jacking, animations that delay content display or harm readability.
- **Reduced Motion**: Always respect user `prefers-reduced-motion` preferences.

---

## React Bits / Visual Inspiration

- Adapt premium interaction inspiration from React Bits.
- Always adapt external snippets to fit the project design system and tokens rather than blindly copy-pasting.
- Prioritize performance and accessibility over excessive decorative effects.

---

## 3D & Mascot Visual Layer

- **Inspiration**: Original mascot/character inspired by Cloudflare+Bun and developer anime aesthetic (Scaramouche & Winter Aespa references), not direct copyrighted replicas.
- **Progressive Enhancement**: 3D elements (R3F, Drei, Three.js, `.glb` models) must be optional and progressively enhanced.
- **Static Fallback**: Always provide a lightweight static illustration/visual fallback for mobile and low-powered devices.
- **Lazy Loading**: Lazy-load 3D canvas components so initial page load and LCP are not blocked.
- **Asset Directory**: Place visual assets in `public/assets/characters/`, `public/assets/3d/`, or `public/assets/images/`.

---

## Media Handling

- **Early Stage**: Cover image URLs and static local images stored in `public/`.
- **Later Stage**: Upload to Cloudflare R2, storing object key and public URL in database with manual `alt` text.
- Validate file types and sizes; avoid uploading huge unoptimized raw images.

---

## Accessibility (A11y)

- Use semantic HTML tags (`<main>`, `<nav>`, `<header>`, `<article>`, `<button>`, `<a>`).
- Use buttons for actions and links for navigation.
- Visible focus rings for keyboard navigation.
- Accessible color contrast in both light and dark themes.
- Meaningful `alt` descriptions for informative imagery; mark decorative images appropriately.
- Clear form labels and accessible inline validation messages.
