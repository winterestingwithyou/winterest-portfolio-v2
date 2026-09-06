# Feature Specification: Portfolio Shell, Resume & Dynamic Sitemap

| Field             | Value                                                                                                                                                                                                   |
| :---------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Feature ID**    | `feat-portfolio`                                                                                                                                                                                        |
| **Status**        | `Implemented`                                                                                                                                                                                           |
| **Domain Module** | [`src/features/portfolio/`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/portfolio)                                                                                                 |
| **Public Routes** | Global Shell, [`/resume`](file:///d:/winterest-project/winterest-portfolio-v2/src/routes/resume.tsx), [`/sitemap.xml`](file:///d:/winterest-project/winterest-portfolio-v2/src/routes/sitemap[.]xml.ts) |
| **RBAC Access**   | Public                                                                                                                                                                                                  |
| **Last Updated**  | 2026-09-06                                                                                                                                                                                              |

---

## 1. Overview & Capabilities

The Portfolio feature provides the overarching public chrome, navigation shell, printable resume, dynamic search engine sitemap, and base developer identity (`siteProfile`) for Winterest.

### Capabilities

- **Global Header & Navigation Shell**: Topbar navigation with route highlights, brand pill, locale switcher (`EN`/`ID`), and theme toggle.
- **Global Footer**: Responsive footer with copyright, brand narrative, direct email link, and social channels.
- **Printable Resume (`/resume`)**: Clean, minimalist, printable resume format suitable for recruiter review, listing career history, education, and technical competencies.
- **Dynamic Edge Sitemap (`/sitemap.xml`)**: Generates an XML sitemap on-demand via Cloudflare Workers, mapping static public routes and active published project slugs.
- **Custom 404 Not Found Experience**: Friendly, branded not-found page with quick recovery navigation back to `/`.

---

## 2. Dynamic Sitemap Engine ([`src/features/portfolio/sitemap.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/portfolio/sitemap.ts))

### Catalog of Static Routes (`STATIC_PUBLIC_ROUTES`)

```ts
export const STATIC_PUBLIC_ROUTES = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/projects', priority: 0.9, changefreq: 'weekly' },
  { path: '/about', priority: 0.8, changefreq: 'monthly' },
  { path: '/stack', priority: 0.7, changefreq: 'monthly' },
  { path: '/contact', priority: 0.6, changefreq: 'monthly' },
  { path: '/resume', priority: 0.6, changefreq: 'monthly' },
] as const
```

### Dynamic Endpoint: `src/routes/sitemap[.]xml.ts`

- Uses TanStack Router bracket syntax for literal dot extensions.
- Queries published projects from D1 and generates `<urlset>` with formatted `<lastmod>` timestamps and XML character escaping.
- Sets `Content-Type: application/xml; charset=utf-8` and edge cache headers.

---

## 3. UI & Layout Architecture

### Component Hierarchy

```txt
src/routes/__root.tsx (Global Root Shell)
├── Navbar / Header (Brand pill, nav links, locale switcher, theme toggle)
├── Outlet (Mounted Page Content)
├── Footer (Social icons, copyright, contact email)
└── NotFoundComponent (Rendered for unmapped route matches)
```

---

## 4. Acceptance Criteria & DoD Checklist

- [ ] Header navigation highlights active route and switches language seamlessly.
- [ ] `/resume` renders cleanly and formats properly for browser print/PDF export (`@media print`).
- [ ] Requesting `/sitemap.xml` returns valid XML schema with all static routes and published project slugs.
- [ ] Private dashboard routes (`/dashboard/*`, `/login`, `/api/*`) are strictly excluded from sitemap.
- [ ] Sitemap generation engine passes Vitest suite ([`src/features/portfolio/__tests__/sitemap.test.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/portfolio/__tests__/sitemap.test.ts)).
- [ ] TypeScript check passes: `bun run check`.
