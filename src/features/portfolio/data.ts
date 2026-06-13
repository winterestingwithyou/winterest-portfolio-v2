import { getLocale } from '#/paraglide/runtime'

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

const idPortfolioStats = [
  { label: 'Fokus', value: 'Web fullstack' },
  { label: 'Gaya', value: 'Praktis + rapi' },
  { label: 'Basis', value: 'Indonesia' },
] as const

const idPrinciples = [
  {
    title: 'Bangun sistem yang berguna',
    description:
      'Aku suka pekerjaan web yang menyelesaikan masalah nyata dulu: alur yang jelas, kode yang mudah dibaca, dan fitur yang tetap enak dirawat setelah rilis pertama.',
  },
  {
    title: 'Jaga interface tetap tenang',
    description:
      'Interface yang baik harus terasa fokus dan cepat. Visual polish tetap penting, tapi tugasnya mendukung konten, bukan mengambil semua perhatian.',
  },
  {
    title: 'Tetap penasaran secara terbuka',
    description:
      'Situs ini juga menjadi tempat untuk mencatat eksperimen, keputusan, dan pelajaran selama aku terus belajar di stack web modern.',
  },
] as const

const idFeaturedProjects = [
  {
    ...featuredProjects[0],
    summary:
      'Portfolio pribadiku yang dibangun ulang sebagai rumah jangka panjang untuk project, tulisan, eksperimen, dan CMS privat.',
    category: 'Portfolio',
    status: 'Dibangun',
    phase: 'Situs publik + CMS',
    scope: 'Portfolio publik, model konten, fondasi dashboard',
    problem:
      'Halaman resume biasa belum cukup untuk menunjukkan cara Winterest berpikir, membangun, menulis, dan bereksperimen sebagai developer.',
    goal: 'Membuat portfolio yang terasa personal di sisi publik dan bisa tumbuh menjadi workflow publishing yang rapi di belakang layar.',
    role: 'Arah produk, desain interface, arsitektur frontend, rencana deploy Cloudflare, dan implementasi CMS.',
    architecture: [
      'Route TanStack Start dipisah untuk halaman publik, dashboard, dan API kecil.',
      'Seed content lokal menjaga situs tetap terbaca saat konten D1 dibuat lebih matang.',
      'Kode server dijaga kompatibel dengan Cloudflare agar target deploy tetap edge-friendly.',
    ],
    highlights: [
      'Arah visual yang terinspirasi Cloudflare + Bun.',
      'Halaman publik untuk projects, about, writing, lab, stack, contact, dan resume.',
      'Fondasi dashboard privat untuk content management, auth, dan D1.',
    ],
    decisions: [
      'Jaga konten publik tetap bisa dibaca dari seed lokal sambil workflow database distabilkan.',
      'Gunakan feature folder untuk data domain dan komponen dashboard.',
      'Gunakan Cloudflare D1 lewat binding, bukan akses database yang hanya cocok di Node.',
    ],
    metrics: [
      { label: 'Route publik', value: '10+' },
      { label: 'Area CMS', value: '3' },
      { label: 'Target runtime', value: 'Workers' },
    ],
    nextSteps: [
      'Ganti lebih banyak seed copy dengan case study project yang benar-benar selesai.',
      'Perkuat rendering konten untuk writing dan lab notes.',
      'Tambah media, screenshot, dan outcome project yang lebih kaya.',
    ],
    result:
      'Winterest sekarang punya identitas yang lebih jelas: situs developer personal dulu, dengan ruang untuk tumbuh menjadi sistem publishing yang serius.',
  },
  {
    ...featuredProjects[1],
    title: 'Dashboard CMS Edge',
    summary:
      'Dashboard privat untuk mengelola project portfolio, catatan writing, lab entries, metadata media, dan status publish.',
    category: 'CMS',
    status: 'Dibangun',
    phase: 'Dashboard',
    scope: 'CRUD project, daftar konten, schema D1, workflow dashboard',
    problem:
      'Mengubah portfolio hanya lewat kode membuat edit kecil terasa lebih berat dari seharusnya.',
    goal: 'Membangun CMS kecil yang owner-first, tempat project dan catatan bisa bergerak dari draft ke published tanpa membocorkan konten privat.',
    role: 'Perencanaan schema, UX dashboard, model role, dan desain mutation.',
    architecture: [
      'Tabel D1 untuk projects, writing, lab entries, metadata media, users, dan sessions.',
      'Session Better Auth dengan role owner/editor.',
      'Workflow list dan form dashboard dirancang untuk editing konten berulang.',
    ],
    highlights: [
      'Model owner/editor sederhana sebelum permission granular.',
      'Public loader hanya membaca konten published.',
      'Validasi server-side dengan Zod untuk mutation CMS.',
    ],
    decisions: [
      'Mulai dari projects, lalu perluas pola yang sama ke writing, lab, dan media.',
      'Buat status dan visibility eksplisit agar draft/private content tidak bocor.',
      'Gunakan API handler kecil di sekitar D1 sambil auth dan server functions dimatangkan.',
    ],
    metrics: [
      { label: 'Model awal', value: 'Projects' },
      { label: 'Relasi', value: 'Tech stack' },
      { label: 'Guard', value: 'Owner' },
    ],
    nextSteps: [
      'Poles empty state, konfirmasi delete, dan panduan form.',
      'Tambah media picker untuk cover image.',
      'Perbaiki preview dan markdown rendering sebelum tulisan panjang dipublish.',
    ],
    result:
      'Dashboard memberi portfolio ini workflow editing yang lebih mudah dirawat tanpa berubah menjadi admin product yang berlebihan.',
  },
  {
    ...featuredProjects[2],
    title: 'Developer Lab',
    summary:
      'Ruang ringan untuk UI demo kecil, catatan Cloudflare, eksperimen AI, dan prototype TanStack.',
    category: 'Lab',
    status: 'Dibangun',
    phase: 'Eksperimen',
    scope: 'Index eksperimen, halaman detail lab, embed demo di masa depan',
    problem:
      'Eksperimen kecil sering hilang di branch, catatan, atau file scratch privat sebelum bisa memberi pelajaran yang berguna.',
    goal: 'Memberi eksperimen rumah yang ringan dan bisa tumbuh menjadi demo yang lebih rapi seiring waktu.',
    role: 'Prototype frontend, perencanaan model konten, dan desain interaksi.',
    architecture: [
      'Lab entries dimulai dari seed data lokal.',
      'Setiap entry nantinya bisa dipetakan ke record CMS dengan link demo dan repo.',
      'Efek visual tetap opsional dan ramah reduced-motion.',
    ],
    highlights: [
      'Route lab khusus untuk eksperimen.',
      'Ruang untuk eksperimen Cloudflare, TanStack, AI, dan interface.',
      'Bahasa visual bisa lebih playful daripada dashboard.',
    ],
    decisions: [
      'Jaga lab entries lebih ringan daripada project case study.',
      'Buat demo masa depan bisa dilink tanpa memuat kode berat di semua halaman.',
      'Gunakan visual polish yang ramah reduced-motion sebelum layer 3D apa pun.',
    ],
    metrics: [
      { label: 'Tipe entry', value: 'Notes + demo' },
      { label: 'Bobot visual', value: 'Ringan' },
      { label: 'Fase CMS', value: 'Nanti' },
    ],
    nextSteps: [
      'Tambah demo kecil untuk eksperimen TanStack dan Cloudflare.',
      'Pindahkan lab entries ke D1 setelah pengalaman editing terasa enak.',
      'Tambah screenshot atau visual statis untuk tiap eksperimen.',
    ],
    result:
      'Lab memberi portfolio Winterest lapisan workbench yang hidup di luar case study yang sudah dipoles.',
  },
] as const

const idLabEntries = [
  {
    ...labEntries[0],
    title: 'Catatan Worker',
    summary:
      'Catatan kecil tentang route Worker, binding, caching, dan kode server yang tetap ramah untuk edge runtime.',
    status: 'Draft',
  },
  {
    ...labEntries[1],
    title: 'TanStack Playground',
    summary:
      'Eksperimen fokus dengan pola Router, Query, Form, Table, Store, dan DB yang ingin kupakai ulang dengan baik.',
    status: 'Dibangun',
  },
  {
    ...labEntries[2],
    title: 'Catatan Tooling Bun',
    summary:
      'Catatan praktis tentang script Bun, workflow lokal yang cepat, dan menjaga workspace ini tetap nyaman dirawat.',
    status: 'Antri',
  },
] as const

const idWritingEntries = [
  {
    ...writingEntries[0],
    title: 'Memilih stack edge-first untuk portfolio Winterest',
    summary:
      'Kenapa TanStack Start, Bun, Cloudflare Workers, D1, dan Drizzle cocok untuk portfolio yang ingin kurawat jangka panjang.',
    status: 'Outline',
  },
  {
    ...writingEntries[1],
    title: 'Workflow konten praktis untuk satu developer',
    summary:
      'Jalur bertahap dari seed content lokal ke CRUD dashboard, auth, writing, media, dan content polish.',
    status: 'Outline',
  },
  {
    ...writingEntries[2],
    title: 'Mendesain dashboard yang tenang',
    summary:
      'Catatan tentang membuat layar admin padat, mudah dibaca, dan berguna tanpa membawa energi marketing page ke workspace.',
    status: 'Ide',
  },
] as const

const idStackGroups = [
  {
    ...stackGroups[0],
    title: 'Runtime dan Edge',
    description:
      'Tools yang kupakai untuk menjaga iterasi lokal tetap cepat sambil menjaga deployment dekat dengan edge.',
  },
  {
    ...stackGroups[1],
    title: 'UI Fullstack',
    description:
      'Stack React praktis untuk routing, server state, forms, tables, dan shared UI state.',
  },
  {
    ...stackGroups[2],
    title: 'Data dan Auth',
    description:
      'Layer yang tidak selalu glamor tapi penting untuk konten, session, validasi, dan kerja dashboard yang aman.',
  },
  {
    ...stackGroups[3],
    title: 'Design System',
    description:
      'Primitive UI yang dibentuk menjadi bahasa visual Winterest yang hangat, orange, dan ramah dark mode.',
  },
] as const

const idTimeline = [
  {
    period: 'Sekarang',
    title: 'Fondasi portfolio personal',
    description:
      'Membentuk situs di sekitar siapa Winterest, apa yang dibangun, dan bagaimana orang bisa menjelajahi project, catatan, dan eksperimen.',
  },
  {
    period: 'Berikutnya',
    title: 'Workflow konten dan dashboard',
    description:
      'Mengubah konten project, writing, dan lab menjadi workflow owner-managed dengan draft, published entry, dan layar editing yang lebih bersih.',
  },
  {
    period: 'Nanti',
    title: 'Writing, media, dan visual identity yang lebih kaya',
    description:
      'Memperbaiki konten panjang, media handling, dukungan bahasa, dan visual karakter ringan tanpa membuat situs terasa berat.',
  },
] as const

export const publicCopy = {
  en: {
    nav: {
      about: 'About',
      projects: 'Projects',
      lab: 'Lab',
      writing: 'Writing',
      stack: 'Stack',
      contact: 'Contact',
    },
    meta: {
      title: 'Winterest | Fullstack Web Developer',
      description:
        'Personal portfolio, writing space, and developer lab for Winterest.',
      ogDescription:
        'Projects, notes, experiments, and practical fullstack web work from Indonesia.',
    },
    home: {
      eyebrow: 'Winterest / fullstack web developer',
      title:
        'Fullstack web work, project notes, and experiments from Indonesia.',
      intro:
        'I build practical fullstack web systems, thoughtful interfaces, and small experiments around modern developer workflows. This is my personal space for showing what I build, what I am learning, and how I think through web systems.',
      introSuffix:
        'This is my personal space for showing what I build, what I am learning, and how I think through web systems.',
      viewProjects: 'View projects',
      featuredEyebrow: 'Featured projects',
      featuredTitle: 'Selected work, written as small case studies.',
      featuredDescription:
        'Projects here focus on the problem, the decisions, the stack, and what I want to improve next.',
      readCaseStudy: 'Read case study',
      labEyebrow: 'Developer lab',
      labTitle: 'A place for experiments that are too useful to hide.',
      labDescription:
        'The lab collects prototypes, technical notes, and small ideas while they are still being shaped.',
      principlesEyebrow: 'Principles',
      principlesTitle: 'How I like to approach web work.',
      stackTitle:
        'Tools I reach for when the project needs to stay fast and maintainable.',
      stackDescription:
        'The stack leans modern, typed, and edge-friendly, but the goal is still practical delivery over tool collecting.',
      ctaTitle:
        'Open to practical web systems, thoughtful interfaces, and useful experiments.',
      contact: 'Contact',
    },
    about: {
      eyebrow: 'About',
      title: 'A closer look at Winterest, the developer behind this space.',
      intro:
        'I build online as Winterest. I enjoy turning ideas into practical web systems: interfaces that feel calm, backend flows that stay understandable, and tools that make future work easier.',
      body: 'Winterest is my public home for that process. It gathers project case studies, technical notes, experiments, and a little visual personality so the site can show both the finished work and the thinking behind it.',
      journeyEyebrow: 'Journey',
      journeyTitle: 'What this space is becoming.',
      principlesTitle: 'The values I want this work to carry.',
    },
    projects: {
      eyebrow: 'Projects',
      title: 'Projects with context, not just screenshots.',
      description:
        'This page collects the work I want people to understand: the problem, the decisions, the stack, and the tradeoffs behind each build.',
      open: 'Open',
      remote: 'git remote',
      sourceTitle:
        'Follow the source behind Winterest and the experiments around it.',
      repository: 'Repository',
    },
    lab: {
      eyebrow: 'Lab',
      title: 'Small experiments, rough notes, and useful sparks.',
      description:
        'The lab is where I keep prototypes and learning notes before they are polished enough to become full projects or articles.',
      experiment: 'Experiment',
      back: 'Back to lab',
      notFound: 'Lab entry not found',
      notFoundTitle: 'This experiment is not published yet.',
    },
    writing: {
      eyebrow: 'Writing',
      title: 'Notes on what I build, learn, and decide.',
      description:
        'Writing is the slower side of Winterest: architecture notes, devlogs, retrospectives, and practical lessons from the work.',
      devlog: 'Devlog',
      back: 'Back to writing',
      notFound: 'Writing not found',
      notFoundTitle: 'This article is not published yet.',
    },
    stack: {
      eyebrow: 'Stack',
      title: 'The tools I use to build Winterest and related work.',
      description:
        'This page is not a trophy shelf. It is a map of the tools I trust for fast iteration, maintainable interfaces, content workflows, and edge-friendly deployment.',
      stackNode: 'Stack node',
    },
    contact: {
      eyebrow: 'Contact',
      title: 'Want to talk about web systems, projects, or experiments?',
      description:
        'GitHub is the best public channel for now. Email is available for direct messages, project conversations, or anything that needs a little more context.',
      signalTitle:
        'Best fit: fullstack web projects, Cloudflare workflows, portfolio systems, and useful developer experiments.',
      async: 'Async friendly',
      channels: 'Direct channels',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      draft: 'Draft email',
    },
    resume: {
      eyebrow: 'Resume',
      description:
        'Fullstack web developer focused on practical web systems, calm interfaces, and maintainable fullstack workflows.',
      longIntro:
        'I work around modern web architecture, edge-friendly apps, and developer tooling. Winterest is my public home for case studies, notes, experiments, and the systems I keep improving over time.',
      selectedWork: 'Selected Work',
      direction: 'Current Direction',
      stack: 'Stack',
    },
    footer: {
      eyebrow: 'Winterest Portfolio v2',
      description:
        'Personal portfolio, writing space, and developer lab for Winterest. Built with a warm Cloudflare + Bun inspired visual language.',
      rights: 'All rights reserved.',
      email: 'Email Winterest',
    },
    notFound: {
      eyebrow: 'Not found',
      title: 'This Winterest page does not exist yet.',
      description:
        'The link may be old, mistyped, or still waiting to become a real route.',
      home: 'Back home',
    },
    projectDetail: {
      notFound: 'Project not found',
      notFoundTitle: 'This case study does not exist yet.',
      back: 'Back to projects',
      projects: 'Projects',
      status: 'Status',
      phase: 'Phase',
      year: 'Year',
      scope: 'Scope',
      problem: 'Problem',
      goal: 'Goal',
      role: 'Role',
      architecture: 'Architecture',
      highlights: 'Highlights',
      decisions: 'Key Decisions',
      nextSteps: 'Next Steps',
      result: 'Result',
    },
    character: {
      eyebrow: 'Character layer',
      title: 'A mascot accent, not a performance tax.',
      description:
        'The visual layer gives Winterest a recognizable presence while keeping the portfolio readable, fast, and useful. It starts as a static illustration and can later grow into a small progressive 3D scene.',
      notes: [
        {
          title: 'Static first',
          description:
            'The mascot is a lightweight visual accent that does not block core portfolio content.',
        },
        {
          title: 'Progressive motion',
          description:
            'Subtle CSS motion is allowed, with reduced-motion users getting a still experience.',
        },
        {
          title: '3D later',
          description:
            'A small GLB scene can arrive after the CMS, auth, and publishing flows are stable.',
        },
      ],
    },
  },
  id: {
    nav: {
      about: 'Tentang',
      projects: 'Project',
      lab: 'Lab',
      writing: 'Tulisan',
      stack: 'Stack',
      contact: 'Kontak',
    },
    meta: {
      title: 'Winterest | Fullstack Web Developer',
      description:
        'Portfolio personal, ruang tulisan, dan developer lab milik Winterest.',
      ogDescription:
        'Project, catatan, eksperimen, dan karya web fullstack praktis dari Indonesia.',
    },
    home: {
      eyebrow: 'Winterest / fullstack web developer',
      title:
        'Karya web fullstack, catatan project, dan eksperimen dari Indonesia.',
      intro:
        'Aku membangun sistem web fullstack yang praktis, interface yang thoughtful, dan eksperimen kecil di sekitar workflow developer modern. Ini ruang personalku untuk menunjukkan apa yang kubangun, apa yang sedang kupelajari, dan bagaimana aku memikirkan sistem web.',
      introSuffix:
        'Ini ruang personalku untuk menunjukkan apa yang kubangun, apa yang sedang kupelajari, dan bagaimana aku memikirkan sistem web.',
      viewProjects: 'Lihat project',
      featuredEyebrow: 'Project pilihan',
      featuredTitle: 'Karya terpilih yang ditulis seperti case study kecil.',
      featuredDescription:
        'Project di sini fokus pada masalah, keputusan, stack, dan hal yang ingin kuperbaiki berikutnya.',
      readCaseStudy: 'Baca case study',
      labEyebrow: 'Developer lab',
      labTitle:
        'Tempat untuk eksperimen yang terlalu berguna untuk disembunyikan.',
      labDescription:
        'Lab mengumpulkan prototype, catatan teknis, dan ide kecil saat bentuknya masih berkembang.',
      principlesEyebrow: 'Prinsip',
      principlesTitle: 'Cara Winterest mendekati pekerjaan web.',
      stackTitle:
        'Tools yang kupakai saat project perlu tetap cepat dan mudah dirawat.',
      stackDescription:
        'Stack ini modern, typed, dan edge-friendly, tapi tujuannya tetap delivery yang praktis, bukan sekadar mengoleksi tools.',
      ctaTitle:
        'Terbuka untuk sistem web praktis, interface yang thoughtful, dan eksperimen yang berguna.',
      contact: 'Kontak',
    },
    about: {
      eyebrow: 'Tentang',
      title: 'Mengenal Winterest, developer di balik ruang ini.',
      intro:
        'Aku membangun online sebagai Winterest. Aku suka mengubah ide menjadi sistem web praktis: interface yang terasa tenang, alur backend yang tetap mudah dipahami, dan tools yang membuat pekerjaan berikutnya lebih mudah.',
      body: 'Winterest adalah rumah publik untuk proses itu. Isinya case study project, catatan teknis, eksperimen, dan sedikit visual personality agar situs ini bisa menunjukkan hasil akhir sekaligus cara berpikir di baliknya.',
      journeyEyebrow: 'Perjalanan',
      journeyTitle: 'Arah berkembangnya ruang ini.',
      principlesTitle: 'Nilai yang ingin kubawa ke pekerjaan ini.',
    },
    projects: {
      eyebrow: 'Project',
      title: 'Project dengan konteks, bukan cuma screenshot.',
      description:
        'Halaman ini mengumpulkan karya yang ingin kupahami bersama orang lain: masalah, keputusan, stack, dan tradeoff di balik tiap build.',
      open: 'Buka',
      remote: 'git remote',
      sourceTitle:
        'Ikuti source di balik Winterest dan eksperimen di sekitarnya.',
      repository: 'Repository',
    },
    lab: {
      eyebrow: 'Lab',
      title: 'Eksperimen kecil, catatan kasar, dan percikan ide berguna.',
      description:
        'Lab adalah tempatku menyimpan prototype dan catatan belajar sebelum cukup rapi untuk menjadi project penuh atau artikel.',
      experiment: 'Eksperimen',
      back: 'Kembali ke lab',
      notFound: 'Lab entry tidak ditemukan',
      notFoundTitle: 'Eksperimen ini belum dipublish.',
    },
    writing: {
      eyebrow: 'Tulisan',
      title: 'Catatan tentang apa yang kubangun, kupelajari, dan kuputuskan.',
      description:
        'Writing adalah sisi Winterest yang lebih pelan: catatan arsitektur, devlog, retrospektif, dan pelajaran praktis dari pekerjaan.',
      devlog: 'Devlog',
      back: 'Kembali ke tulisan',
      notFound: 'Tulisan tidak ditemukan',
      notFoundTitle: 'Artikel ini belum dipublish.',
    },
    stack: {
      eyebrow: 'Stack',
      title: 'Tools yang kupakai untuk membangun Winterest dan karya terkait.',
      description:
        'Halaman ini bukan rak piala. Ini peta tools yang kupercaya untuk iterasi cepat, interface yang mudah dirawat, workflow konten, dan deployment edge-friendly.',
      stackNode: 'Node stack',
    },
    contact: {
      eyebrow: 'Kontak',
      title: 'Mau ngobrol tentang sistem web, project, atau eksperimen?',
      description:
        'GitHub adalah channel publik terbaik untuk sekarang. Email tersedia untuk pesan langsung, obrolan project, atau hal yang butuh konteks lebih panjang.',
      signalTitle:
        'Paling cocok: project web fullstack, workflow Cloudflare, sistem portfolio, dan eksperimen developer yang berguna.',
      async: 'Ramah async',
      channels: 'Channel langsung',
      name: 'Nama',
      email: 'Email',
      message: 'Pesan',
      draft: 'Buat draft email',
    },
    resume: {
      eyebrow: 'Resume',
      description:
        'Fullstack web developer yang fokus pada sistem web praktis, interface yang tenang, dan workflow fullstack yang mudah dirawat.',
      longIntro:
        'Aku bekerja di sekitar arsitektur web modern, aplikasi edge-friendly, dan developer tooling. Winterest adalah rumah publikku untuk case study, catatan, eksperimen, dan sistem yang terus kuperbaiki dari waktu ke waktu.',
      selectedWork: 'Karya Pilihan',
      direction: 'Arah Saat Ini',
      stack: 'Stack',
    },
    footer: {
      eyebrow: 'Winterest Portfolio v2',
      description:
        'Portfolio personal, ruang tulisan, dan developer lab milik Winterest. Dibangun dengan bahasa visual hangat yang terinspirasi Cloudflare + Bun.',
      rights: 'Semua hak dilindungi.',
      email: 'Email Winterest',
    },
    notFound: {
      eyebrow: 'Tidak ditemukan',
      title: 'Halaman Winterest ini belum ada.',
      description:
        'Link ini mungkin lama, salah ketik, atau masih menunggu menjadi route sungguhan.',
      home: 'Kembali ke beranda',
    },
    projectDetail: {
      notFound: 'Project tidak ditemukan',
      notFoundTitle: 'Case study ini belum ada.',
      back: 'Kembali ke project',
      projects: 'Project',
      status: 'Status',
      phase: 'Fase',
      year: 'Tahun',
      scope: 'Scope',
      problem: 'Masalah',
      goal: 'Tujuan',
      role: 'Peran',
      architecture: 'Arsitektur',
      highlights: 'Highlight',
      decisions: 'Keputusan Kunci',
      nextSteps: 'Langkah Berikutnya',
      result: 'Hasil',
    },
    character: {
      eyebrow: 'Layer karakter',
      title: 'Aksen maskot, bukan beban performa.',
      description:
        'Layer visual memberi Winterest identitas yang mudah dikenali sambil menjaga portfolio tetap terbaca, cepat, dan berguna. Dimulai sebagai ilustrasi statis, lalu bisa tumbuh menjadi scene 3D kecil secara progresif.',
      notes: [
        {
          title: 'Statis dulu',
          description:
            'Maskot adalah aksen visual ringan yang tidak menghalangi konten utama portfolio.',
        },
        {
          title: 'Motion progresif',
          description:
            'Motion CSS yang halus boleh dipakai, dengan pengalaman statis untuk pengguna reduced-motion.',
        },
        {
          title: '3D nanti',
          description:
            'Scene GLB kecil bisa hadir setelah CMS, auth, dan publishing flow stabil.',
        },
      ],
    },
  },
} as const

function isIndonesianLocale() {
  return getLocale() === 'id'
}

export function getPublicCopy() {
  return publicCopy[isIndonesianLocale() ? 'id' : 'en']
}

export function getPortfolioContent() {
  if (isIndonesianLocale()) {
    return {
      portfolioStats: idPortfolioStats,
      principles: idPrinciples,
      featuredProjects: idFeaturedProjects,
      labEntries: idLabEntries,
      writingEntries: idWritingEntries,
      stackGroups: idStackGroups,
      timeline: idTimeline,
    }
  }

  return {
    portfolioStats,
    principles,
    featuredProjects,
    labEntries,
    writingEntries,
    stackGroups,
    timeline,
  }
}

export function getProjectBySlug(slug: string) {
  return getPortfolioContent().featuredProjects.find(
    (project) => project.slug === slug,
  )
}

export function getLabEntryBySlug(slug: string) {
  return getPortfolioContent().labEntries.find((entry) => entry.slug === slug)
}

export function getWritingEntryBySlug(slug: string) {
  return getPortfolioContent().writingEntries.find(
    (entry) => entry.slug === slug,
  )
}
