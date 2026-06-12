export const siteProfile = {
  name: 'M. Adam Yudistira',
  handle: 'winterestingwithyou',
  domain: 'winterest.tech',
  role: 'Fullstack web developer',
  location: 'Indonesia',
  intro:
    'I build practical web systems, developer tools, and experiments around modern fullstack architecture.',
  longIntro:
    'Winterest is my long-term portfolio platform: a Cloudflare-powered home for projects, writing, lab experiments, and the CMS that will eventually manage it all.',
  githubUrl: 'https://github.com/winterestingwithyou',
  repoUrl: 'https://github.com/winterestingwithyou/winterest-portfolio-v2',
  contactEmail: 'hello@winterest.tech',
}

export const portfolioStats = [
  { label: 'Core stack', value: 'TanStack + Bun' },
  { label: 'Deploy target', value: 'Cloudflare Workers' },
  { label: 'Next system', value: 'CMS + RBAC' },
]

export const principles = [
  {
    title: 'Edge-first by default',
    description:
      'Prefer small server functions, Web APIs, and Cloudflare-compatible patterns so the site can stay fast and portable.',
  },
  {
    title: 'Useful before flashy',
    description:
      'The portfolio should work as a real publishing and CMS platform before heavier 3D or animation layers arrive.',
  },
  {
    title: 'Playful, still professional',
    description:
      'Cloudflare orange, Bun energy, crisp UI, and a developer-lab feeling without turning the site into a generic template.',
  },
]

export const featuredProjects = [
  {
    slug: 'winterest-portfolio-platform',
    title: 'Winterest Portfolio Platform',
    summary:
      'A TanStack Start portfolio evolving into a CMS dashboard, writing hub, and developer lab.',
    category: 'Personal platform',
    status: 'Building',
    featured: true,
    stack: ['TanStack Start', 'React 19', 'Bun', 'Cloudflare', 'Tailwind CSS'],
    problem:
      'The starter resume template needed to become a long-term personal platform instead of a static profile page.',
    goal: 'Create a polished public portfolio foundation that can later read from D1-backed CMS content.',
    role: 'Product design, frontend architecture, Cloudflare deployment direction, and CMS planning.',
    architecture: [
      'File-based TanStack Router routes for the public shell.',
      'Local seed content for early portfolio pages before the CMS is ready.',
      'Cloudflare-compatible constraints kept in mind for future server logic.',
    ],
    highlights: [
      'Custom Cloudflare + Bun inspired visual system.',
      'Public pages for projects, writing, lab, stack, contact, and resume.',
      'Clear phase path toward dashboard, Better Auth, RBAC, and D1.',
    ],
    result:
      'The project now has a portfolio identity and public content model to build from without rushing database work.',
  },
  {
    slug: 'edge-cms-blueprint',
    title: 'Edge CMS Blueprint',
    summary:
      'A planned dashboard for managing projects, writing, lab entries, media, users, and roles.',
    category: 'CMS',
    status: 'Planned',
    featured: true,
    stack: ['Drizzle ORM', 'Cloudflare D1', 'Better Auth', 'TanStack Table'],
    problem:
      'Portfolio content should be editable from a secure dashboard instead of being hardcoded forever.',
    goal: 'Build a small, owner-first CMS with draft and published states.',
    role: 'Schema planning, dashboard UX, role model, and mutation design.',
    architecture: [
      'D1 tables for projects first, then writing, lab, skills, media, and settings.',
      'Better Auth sessions with owner/editor roles.',
      'Dashboard table and form workflows built with TanStack tools.',
    ],
    highlights: [
      'Simple role model before granular permissions.',
      'Published-only public data loaders.',
      'Server-side validation with Zod for CMS mutations.',
    ],
    result:
      'The blueprint keeps CMS work practical and avoids over-engineering before the public portfolio is stable.',
  },
  {
    slug: 'developer-lab-experiments',
    title: 'Developer Lab Experiments',
    summary:
      'A playful space for small UI demos, Cloudflare notes, AI experiments, and TanStack prototypes.',
    category: 'Lab',
    status: 'Building',
    featured: false,
    stack: ['React', 'TanStack Query', 'Workers', 'AI tooling'],
    problem:
      'Small experiments usually disappear into branches, notes, or private scratch files.',
    goal: 'Give experiments a lightweight home that can grow into polished demos over time.',
    role: 'Frontend prototypes, content model planning, and interaction design.',
    architecture: [
      'Lab entries start as local seed data.',
      'Each entry can later map to a CMS record with demo and repo links.',
      'Visual effects remain optional and reduced-motion friendly.',
    ],
    highlights: [
      'Dedicated lab route for experiments.',
      'Room for Cloudflare, TanStack, AI, and UI entries.',
      'Design language can be more playful than the dashboard.',
    ],
    result:
      'The lab gives the portfolio a living-workbench layer beyond polished case studies.',
  },
] as const

export const labEntries = [
  {
    slug: 'worker-notes',
    title: 'Worker Notes',
    summary:
      'Small Cloudflare Worker patterns for routes, caching, bindings, and edge-friendly server functions.',
    status: 'Drafting',
    tags: ['Cloudflare', 'Workers', 'Edge'],
  },
  {
    slug: 'tanstack-playground',
    title: 'TanStack Playground',
    summary:
      'Router, Query, Form, Table, Store, and DB experiments collected into focused mini demos.',
    status: 'Building',
    tags: ['TanStack', 'React', 'TypeScript'],
  },
  {
    slug: 'bun-tooling-notes',
    title: 'Bun Tooling Notes',
    summary:
      'Practical notes around Bun scripts, fast local workflows, and keeping the project Bun-first.',
    status: 'Queued',
    tags: ['Bun', 'Tooling', 'DX'],
  },
] as const

export const writingEntries = [
  {
    slug: 'edge-first-portfolio-stack',
    title: 'Choosing an edge-first portfolio stack',
    summary:
      'Why TanStack Start, Bun, Cloudflare Workers, D1, and Drizzle make sense for a personal developer platform.',
    status: 'Outline',
    tags: ['Architecture', 'Cloudflare', 'TanStack'],
  },
  {
    slug: 'solo-cms-roadmap',
    title: 'A practical solo CMS roadmap',
    summary:
      'A staged path from local seed content to projects CRUD, auth, RBAC, writing, media, and dashboard polish.',
    status: 'Outline',
    tags: ['CMS', 'Product', 'Planning'],
  },
  {
    slug: 'calm-dashboard-design',
    title: 'Designing a calm dashboard',
    summary:
      'Notes on making admin tools dense, readable, and useful without importing marketing-page energy.',
    status: 'Idea',
    tags: ['Design', 'Dashboard', 'UX'],
  },
] as const

export const stackGroups = [
  {
    title: 'Runtime and Edge',
    description:
      'Fast local iteration with a deployment target that keeps server code small.',
    items: ['Bun', 'Cloudflare Workers', 'Wrangler', 'Vite'],
  },
  {
    title: 'Fullstack UI',
    description:
      'Type-safe routes, server state, forms, tables, and local state in one ecosystem.',
    items: [
      'TanStack Start',
      'TanStack Router',
      'TanStack Query',
      'TanStack Form',
      'TanStack Table',
      'TanStack Store',
    ],
  },
  {
    title: 'Data and Auth',
    description:
      'A D1-backed CMS foundation with explicit schema and cookie-based auth.',
    items: ['Drizzle ORM', 'Cloudflare D1', 'Better Auth', 'Zod', 'T3Env'],
  },
  {
    title: 'Design System',
    description:
      'Composable primitives with a warm Cloudflare + Bun visual language.',
    items: ['Tailwind CSS v4', 'Radix UI', 'shadcn/ui style', 'lucide-react'],
  },
] as const

export const timeline = [
  {
    period: 'Now',
    title: 'Portfolio platform foundation',
    description:
      'Replacing the starter resume shell with a public portfolio, project pages, writing, lab, and stack views.',
  },
  {
    period: 'Next',
    title: 'CMS dashboard and projects model',
    description:
      'Adding Drizzle schema, D1-backed project content, dashboard list views, and create/edit flows.',
  },
  {
    period: 'Later',
    title: 'Auth, RBAC, writing, media, and character layer',
    description:
      'Better Auth owner bootstrap, editor roles, publishing workflow, media metadata, and optional lightweight visuals.',
  },
] as const

export function getProjectBySlug(slug: string) {
  return featuredProjects.find((project) => project.slug === slug)
}

export function getLabEntryBySlug(slug: string) {
  return labEntries.find((entry) => entry.slug === slug)
}

export function getWritingEntryBySlug(slug: string) {
  return writingEntries.find((entry) => entry.slug === slug)
}
