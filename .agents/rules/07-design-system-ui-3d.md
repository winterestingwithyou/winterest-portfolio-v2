# Design System, UI Components, Animation & 3D Guidelines

## Aesthetic Direction

- **Theme**: Cloudflare + Bun Developer Persona
- **Color Direction**: Curated Cloudflare orange, crisp white, deep dark/black base, warm neutral borders.
- **Tone**: Fast, technical, clean, playful, and responsive with full light and dark mode compatibility.

### Suggested Color Tokens

```txt
brand.orange       Cloudflare-like vibrant orange
brand.orangeSoft   Soft orange tint for badges and highlights
brand.orangeDeep   Deep burnt orange for gradients and borders
brand.cream        Warm off-white for light mode background
brand.dark         Near-black for dark mode background
brand.gray         Neutral dark gray for panels and cards
brand.border       Subtle border color
brand.glow         Orange ambient glow effect
```

---

## Tailwind CSS v4 Class Syntax Rule

Prefer Tailwind CSS v4 simplified variable syntax over legacy bracket syntax:

- **Use**: `text-(--brand-ink)`, `bg-(--brand-orange-soft)`, `border-(--brand-line)`, `shadow-(--brand-orange-soft)`
- **Avoid legacy**: `text-[var(--brand-ink)]`, `bg-[var(--brand-orange-soft)]`, `border-[var(--brand-line)]`, `shadow-[var(--brand-orange-soft)]`

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
