export const siteProfile = {
  name: 'Winterest',
  handle: 'winterest',
  domain: 'winterest.tech',
  role: 'Fullstack web developer',
  location: 'Indonesia',
  intro:
    'I build practical fullstack web systems, thoughtful interfaces, and small experiments around modern developer workflows.',
  longIntro:
    'I work around modern web architecture, edge-friendly apps, and developer tooling. Winterest is my public home for case studies, notes, experiments, and the systems I keep improving over time.',
  githubUrl: 'https://github.com/winterest',
  repoUrl: 'https://github.com/winterest/winterest-portfolio-v2',
  contactEmail: 'hello@winterest.tech',
}

export const portfolioStats = [
  { label: 'Focus', value: 'Fullstack web' },
  { label: 'Style', value: 'Practical + polished' },
  { label: 'Base', value: 'Indonesia' },
]

export const principles = [
  {
    title: 'Build useful systems',
    description:
      'I like web work that solves real problems first: clear flows, readable code, and features that are easy to maintain after the first release.',
  },
  {
    title: 'Keep the interface calm',
    description:
      'A good interface should feel focused and fast. Visual polish matters, but it should support the content instead of stealing the room.',
  },
  {
    title: 'Stay curious in public',
    description:
      'This site is also a place to document experiments, decisions, and lessons while I keep learning across the modern web stack.',
  },
]

export const featuredProjects = [
  {
    slug: 'winterest-portfolio-platform',
    title: 'Winterest Portfolio v2',
    summary:
      'My personal portfolio rebuilt as a long-term home for projects, writing, experiments, and a private CMS.',
    category: 'Portfolio',
    status: 'Building',
    phase: 'Public site + CMS',
    year: '2026',
    scope: 'Public portfolio, content model, dashboard foundation',
    featured: true,
    stack: ['TanStack Start', 'React 19', 'Bun', 'Cloudflare', 'Tailwind CSS'],
    problem:
      'A plain resume page was not enough to show how I think, build, write, and experiment as a developer.',
    goal: 'Create a portfolio that feels personal on the outside and can grow into a reliable publishing workflow behind the scenes.',
    role: 'Product direction, interface design, frontend architecture, Cloudflare deployment planning, and CMS implementation.',
    architecture: [
      'TanStack Start routes split between public pages, dashboard routes, and small API endpoints.',
      'Local seed content keeps the public site readable while D1-backed content becomes mature.',
      'Cloudflare-compatible server code keeps the deployment target edge-friendly.',
    ],
    highlights: [
      'Custom Cloudflare + Bun inspired visual direction.',
      'Public pages for projects, about, writing, lab, stack, contact, and resume.',
      'Private dashboard foundation with content management, auth, and D1 in mind.',
    ],
    decisions: [
      'Keep public content readable from local seed data while database publishing stabilizes.',
      'Use feature folders for domain data and dashboard components.',
      'Use Cloudflare D1 through bindings instead of relying on Node-only database access.',
    ],
    metrics: [
      { label: 'Public routes', value: '10+' },
      { label: 'CMS areas', value: '3' },
      { label: 'Runtime target', value: 'Workers' },
    ],
    nextSteps: [
      'Replace more seed copy with real finished case studies.',
      'Add stronger content rendering for writing and lab notes.',
      'Add richer media, screenshots, and project outcomes.',
    ],
    result:
      'Winterest now has a clearer identity: a personal developer site first, with room to grow into a serious publishing system.',
  },
  {
    slug: 'edge-cms-blueprint',
    title: 'Edge CMS Dashboard',
    summary:
      'A private dashboard for managing portfolio projects, writing notes, lab entries, media metadata, and publishing status.',
    category: 'CMS',
    status: 'Building',
    phase: 'Dashboard',
    year: '2026',
    scope: 'Projects CRUD, content lists, D1 schema, dashboard workflows',
    featured: true,
    stack: ['Drizzle ORM', 'Cloudflare D1', 'Better Auth', 'TanStack Table'],
    problem:
      'Updating a portfolio only through code makes small edits feel heavier than they should be.',
    goal: 'Build a small owner-first CMS where projects and notes can move from draft to published without exposing private content.',
    role: 'Schema planning, dashboard UX, role model, and mutation design.',
    architecture: [
      'D1 tables for projects, writing, lab entries, media metadata, users, and sessions.',
      'Better Auth sessions with owner/editor roles.',
      'Dashboard list and form workflows designed for repeated content editing.',
    ],
    highlights: [
      'Simple owner/editor model before granular permissions.',
      'Published-only public data loaders.',
      'Server-side validation with Zod for CMS mutations.',
    ],
    decisions: [
      'Start with projects, then expand the same pattern to writing, lab, and media.',
      'Keep status and visibility explicit so draft/private content cannot leak.',
      'Use small API handlers around D1 until auth and server functions settle.',
    ],
    metrics: [
      { label: 'First model', value: 'Projects' },
      { label: 'Relations', value: 'Tech stack' },
      { label: 'Guard status', value: 'Owner' },
    ],
    nextSteps: [
      'Polish empty states, delete confirmations, and form guidance.',
      'Add media picker support for cover images.',
      'Improve preview and markdown rendering before publishing longer writing.',
    ],
    result:
      'The dashboard gives this portfolio a maintainable editing flow without turning it into a bloated admin product.',
  },
  {
    slug: 'developer-lab-experiments',
    title: 'Developer Lab',
    summary:
      'A lightweight space for small UI demos, Cloudflare notes, AI experiments, and TanStack prototypes.',
    category: 'Lab',
    status: 'Building',
    phase: 'Experiments',
    year: '2026',
    scope: 'Experiment index, lab detail pages, future demo embeds',
    featured: false,
    stack: ['React', 'TanStack Query', 'Workers', 'AI tooling'],
    problem:
      'Small experiments often disappear into branches, notes, or private scratch files before they can teach anything useful.',
    goal: 'Give experiments a lightweight home that can grow into polished demos over time.',
    role: 'Frontend prototypes, content model planning, and interaction design.',
    architecture: [
      'Lab entries start as local seed data.',
      'Each entry can later map to a CMS record with demo and repo links.',
      'Visual effects remain optional and reduced-motion friendly.',
    ],
    highlights: [
      'Dedicated lab route for experiments.',
      'Room for Cloudflare, TanStack, AI, and interface experiments.',
      'Design language can be more playful than the dashboard.',
    ],
    decisions: [
      'Keep lab entries lighter than project case studies.',
      'Make future demos linkable without loading heavy code on every page.',
      'Use reduced-motion friendly visual polish before any 3D layer.',
    ],
    metrics: [
      { label: 'Entry types', value: 'Notes + demos' },
      { label: 'Visual weight', value: 'Light' },
      { label: 'CMS phase', value: 'Later' },
    ],
    nextSteps: [
      'Add small embedded demos for TanStack and Cloudflare experiments.',
      'Move lab entries into D1 once the editing experience feels good.',
      'Add screenshots or generated static visuals for each experiment.',
    ],
    result:
      'The lab gives my portfolio a living-workbench layer beyond polished case studies.',
  },
] as const

export const labEntries = [
  {
    slug: 'worker-notes',
    title: 'Worker Notes',
    summary:
      'Small notes on Worker routes, bindings, caching, and server code that stays friendly to the edge runtime.',
    status: 'Drafting',
    tags: ['Cloudflare', 'Workers', 'Edge'],
  },
  {
    slug: 'tanstack-playground',
    title: 'TanStack Playground',
    summary:
      'Focused experiments with Router, Query, Form, Table, Store, and DB patterns I want to reuse well.',
    status: 'Building',
    tags: ['TanStack', 'React', 'TypeScript'],
  },
  {
    slug: 'bun-tooling-notes',
    title: 'Bun Tooling Notes',
    summary:
      'Practical notes around Bun scripts, fast local workflows, and keeping this workspace pleasant to maintain.',
    status: 'Queued',
    tags: ['Bun', 'Tooling', 'DX'],
  },
] as const

export const writingEntries = [
  {
    slug: 'edge-first-portfolio-stack',
    title: 'Choosing my edge-first portfolio stack',
    summary:
      'Why TanStack Start, Bun, Cloudflare Workers, D1, and Drizzle fit the kind of portfolio I want to maintain.',
    status: 'Outline',
    tags: ['Architecture', 'Cloudflare', 'TanStack'],
  },
  {
    slug: 'solo-cms-roadmap',
    title: 'A practical content workflow for one developer',
    summary:
      'A staged path from local seed content to dashboard CRUD, auth, writing, media, and content polish.',
    status: 'Outline',
    tags: ['CMS', 'Product', 'Planning'],
  },
  {
    slug: 'calm-dashboard-design',
    title: 'Designing a calm dashboard',
    summary:
      'Notes on making admin screens dense, readable, and useful without bringing marketing-page energy into the workspace.',
    status: 'Idea',
    tags: ['Design', 'Dashboard', 'UX'],
  },
] as const

export const stackGroups = [
  {
    title: 'Runtime and Edge',
    description:
      'Tools I use to keep local iteration fast while keeping deployment close to the edge.',
    items: ['Bun', 'Cloudflare Workers', 'Wrangler', 'Vite'],
  },
  {
    title: 'Fullstack UI',
    description:
      'A practical React stack for routing, server state, forms, tables, and shared UI state.',
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
      'The boring-but-important layer for content, sessions, validation, and secure dashboard work.',
    items: ['Drizzle ORM', 'Cloudflare D1', 'Better Auth', 'Zod', 'T3Env'],
  },
  {
    title: 'Design System',
    description:
      'Composable UI primitives shaped into a warm orange, dark-mode-friendly Winterest visual language.',
    items: ['Tailwind CSS v4', 'Radix UI', 'shadcn/ui style', 'lucide-react'],
  },
] as const

export const timeline = [
  {
    period: 'Now',
    title: 'Personal portfolio foundation',
    description:
      'Shaping the site around who I am, what I build, and how people can explore my projects, notes, and experiments.',
  },
  {
    period: 'Next',
    title: 'Content workflow and dashboard',
    description:
      'Turning project, writing, and lab content into an owner-managed workflow with drafts, published entries, and cleaner editing screens.',
  },
  {
    period: 'Later',
    title: 'Richer writing, media, and visual identity',
    description:
      'Improving long-form content, media handling, language support, and lightweight character visuals without making the site feel heavy.',
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
