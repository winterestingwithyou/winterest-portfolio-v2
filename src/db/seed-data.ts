import type { ContentLocale, TechnologyCategory } from './schema'

export type PortfolioProjectSeed = {
  id: string
  locale: ContentLocale
  slug: string
  title: string
  summary: string
  description: string
  content: string
  category: string
  featured: boolean
  repoUrl?: string
  demoUrl?: string
  caseStudyUrl?: string
  publishedAt: Date
  technologies: string[]
}

export type PortfolioContentSeed = {
  id: string
  locale: ContentLocale
  slug: string
  title: string
  summary: string
  content: string
  tags: string[]
  publishedAt: Date
}

export type TechnologySeed = {
  id: string
  name: string
  slug: string
  category: TechnologyCategory
  url?: string
  description?: string
}

export const technologySeeds = [
  {
    id: 'tech-bun',
    name: 'Bun',
    slug: 'bun',
    category: 'runtime',
    url: 'https://bun.sh',
    description: 'Fast JavaScript runtime and project tooling.',
  },
  {
    id: 'tech-react',
    name: 'React',
    slug: 'react',
    category: 'framework',
    url: 'https://react.dev',
    description: 'UI library for building interactive interfaces.',
  },
  {
    id: 'tech-tanstack-start',
    name: 'TanStack Start',
    slug: 'tanstack-start',
    category: 'framework',
    url: 'https://tanstack.com/start',
    description: 'Fullstack React framework powered by TanStack Router.',
  },
  {
    id: 'tech-cloudflare-workers',
    name: 'Cloudflare Workers',
    slug: 'cloudflare-workers',
    category: 'service',
    url: 'https://workers.cloudflare.com',
    description: 'Edge runtime for fast web applications.',
  },
  {
    id: 'tech-cloudflare-d1',
    name: 'Cloudflare D1',
    slug: 'cloudflare-d1',
    category: 'database',
    url: 'https://developers.cloudflare.com/d1',
    description: 'Serverless SQLite database on Cloudflare.',
  },
  {
    id: 'tech-drizzle',
    name: 'Drizzle ORM',
    slug: 'drizzle-orm',
    category: 'database',
    url: 'https://orm.drizzle.team',
    description: 'TypeScript ORM used for content and dashboard data.',
  },
  {
    id: 'tech-tailwind',
    name: 'Tailwind CSS',
    slug: 'tailwind-css',
    category: 'styling',
    url: 'https://tailwindcss.com',
    description: 'Utility-first CSS for the portfolio design system.',
  },
  {
    id: 'tech-better-auth',
    name: 'Better Auth',
    slug: 'better-auth',
    category: 'service',
    url: 'https://www.better-auth.com',
    description: 'Authentication foundation for the private dashboard.',
  },
] satisfies TechnologySeed[]

export const projectSeeds = [
  {
    id: 'project-winterest-portfolio-platform',
    locale: 'en',
    slug: 'winterest-portfolio-platform',
    title: 'Winterest Portfolio v2',
    summary:
      'My personal portfolio rebuilt as a long-term home for projects, writing, experiments, and a private CMS.',
    description:
      'A personal developer platform for Winterest: public portfolio outside, practical content workflow inside.',
    content:
      'This project turns the portfolio into a place that can keep growing. The public side focuses on work, notes, experiments, and contact paths. The private side keeps content editable through a small CMS so updates do not have to start from code every time.\n\nThe current goal is simple: make the site feel personal, keep the content honest, and let each section be powered by published records from the database.',
    category: 'Portfolio',
    featured: true,
    repoUrl: 'https://github.com/winterest/winterest-portfolio-v2',
    publishedAt: new Date('2026-02-01T00:00:00.000Z'),
    technologies: [
      'tanstack-start',
      'react',
      'bun',
      'cloudflare-workers',
      'cloudflare-d1',
      'drizzle-orm',
      'tailwind-css',
    ],
  },
  {
    id: 'project-edge-cms-dashboard',
    locale: 'en',
    slug: 'edge-cms-dashboard',
    title: 'Edge CMS Dashboard',
    summary:
      'A private dashboard for managing portfolio projects, writing notes, lab entries, media metadata, and publishing status.',
    description:
      'An owner-first dashboard that keeps portfolio publishing small, focused, and maintainable.',
    content:
      'The dashboard exists so project stories, writing drafts, and lab notes can move from rough idea to public page without exposing private work. It favors clear forms, predictable lists, and simple publishing states over decorative admin screens.\n\nThe first version focuses on projects, writing, lab entries, and media metadata. User and role management can grow after the core editing workflow feels solid.',
    category: 'CMS',
    featured: true,
    publishedAt: new Date('2026-02-08T00:00:00.000Z'),
    technologies: [
      'cloudflare-d1',
      'drizzle-orm',
      'better-auth',
      'tanstack-start',
      'tailwind-css',
    ],
  },
  {
    id: 'project-developer-lab',
    locale: 'en',
    slug: 'developer-lab',
    title: 'Developer Lab',
    summary:
      'A lightweight space for small UI demos, Cloudflare notes, AI experiments, and TanStack prototypes.',
    description:
      'A public workbench for experiments that are useful to revisit even before they become full case studies.',
    content:
      'Small experiments often disappear into scratch files. The lab keeps those fragments linkable: tiny demos, notes, prototypes, and ideas that may later become real projects.\n\nEntries stay lighter than case studies, but they still need enough context to explain what was tested, what worked, and what should happen next.',
    category: 'Lab',
    featured: false,
    publishedAt: new Date('2026-02-15T00:00:00.000Z'),
    technologies: ['react', 'tanstack-start', 'cloudflare-workers', 'bun'],
  },
  {
    id: 'project-winterest-portfolio-platform-id',
    locale: 'id',
    slug: 'winterest-portfolio-platform',
    title: 'Winterest Portfolio v2',
    summary:
      'Portfolio pribadi Winterest yang dibangun sebagai rumah jangka panjang untuk project, tulisan, eksperimen, dan CMS privat.',
    description:
      'Platform developer personal untuk Winterest: portfolio publik di depan, workflow konten praktis di belakang.',
    content:
      'Project ini mengubah portfolio menjadi ruang yang bisa terus tumbuh. Sisi publik berfokus pada karya, catatan, eksperimen, dan jalur kontak. Sisi privat menjaga konten tetap mudah diedit lewat CMS kecil sehingga update tidak selalu harus dimulai dari kode.\n\nTujuan saat ini sederhana: membuat situs terasa personal, menjaga kontennya jujur, dan memastikan setiap bagian ditenagai oleh record published dari database.',
    category: 'Portfolio',
    featured: true,
    repoUrl: 'https://github.com/winterest/winterest-portfolio-v2',
    publishedAt: new Date('2026-02-01T00:00:00.000Z'),
    technologies: [
      'tanstack-start',
      'react',
      'bun',
      'cloudflare-workers',
      'cloudflare-d1',
      'drizzle-orm',
      'tailwind-css',
    ],
  },
  {
    id: 'project-edge-cms-dashboard-id',
    locale: 'id',
    slug: 'edge-cms-dashboard',
    title: 'Dashboard CMS Edge',
    summary:
      'Dashboard privat untuk mengelola project portfolio, catatan writing, entry lab, metadata media, dan status publish.',
    description:
      'Dashboard owner-first yang menjaga publishing portfolio tetap kecil, fokus, dan mudah dirawat.',
    content:
      'Dashboard ini ada supaya cerita project, draft tulisan, dan catatan lab bisa bergerak dari ide kasar ke halaman publik tanpa membocorkan pekerjaan privat. Fokusnya adalah form yang jelas, list yang mudah dipindai, dan status publishing yang sederhana.\n\nVersi pertama berfokus pada project, writing, lab entries, dan metadata media. Manajemen user dan role bisa tumbuh setelah workflow editing utama terasa solid.',
    category: 'CMS',
    featured: true,
    publishedAt: new Date('2026-02-08T00:00:00.000Z'),
    technologies: [
      'cloudflare-d1',
      'drizzle-orm',
      'better-auth',
      'tanstack-start',
      'tailwind-css',
    ],
  },
  {
    id: 'project-developer-lab-id',
    locale: 'id',
    slug: 'developer-lab',
    title: 'Developer Lab',
    summary:
      'Ruang ringan untuk demo UI kecil, catatan Cloudflare, eksperimen AI, dan prototype TanStack.',
    description:
      'Workbench publik untuk eksperimen yang tetap berguna dikunjungi ulang sebelum menjadi case study penuh.',
    content:
      'Eksperimen kecil sering hilang di scratch file. Lab menjaga potongan itu tetap bisa dibuka lagi: demo kecil, catatan, prototype, dan ide yang mungkin tumbuh menjadi project nyata.\n\nEntry lab tetap lebih ringan dari case study, tapi tetap perlu konteks yang cukup untuk menjelaskan apa yang dites, apa yang berhasil, dan apa langkah berikutnya.',
    category: 'Lab',
    featured: false,
    publishedAt: new Date('2026-02-15T00:00:00.000Z'),
    technologies: ['react', 'tanstack-start', 'cloudflare-workers', 'bun'],
  },
] satisfies PortfolioProjectSeed[]

export const writingSeeds = [
  {
    id: 'writing-edge-first-portfolio-stack',
    locale: 'en',
    slug: 'edge-first-portfolio-stack',
    title: 'Choosing my edge-first portfolio stack',
    summary:
      'Why this portfolio leans on fast local tooling, a fullstack React framework, and an edge-friendly deployment target.',
    content:
      'A portfolio is small enough to be simple, but important enough to deserve a real foundation. I want Winterest to be easy to update, fast to open, and flexible enough for projects, writing, experiments, and CMS work.\n\nThe stack is chosen around that shape: productive local iteration, typed content flows, public pages that can be cached well, and a private dashboard that stays practical.',
    tags: ['Architecture', 'Portfolio', 'Edge'],
    publishedAt: new Date('2026-02-20T00:00:00.000Z'),
  },
  {
    id: 'writing-solo-cms-roadmap',
    locale: 'en',
    slug: 'solo-cms-roadmap',
    title: 'A practical content workflow for one developer',
    summary:
      'A staged path from seed content to CMS-managed project stories, writing, lab entries, media, and publishing polish.',
    content:
      'For a solo portfolio, the CMS should remove friction instead of becoming another product to maintain. The useful path starts with a few clear models, a protected dashboard, and a published/draft workflow that never leaks unfinished content.\n\nAfter that, media, richer editing, localization, and user management can be added in layers.',
    tags: ['CMS', 'Workflow', 'Planning'],
    publishedAt: new Date('2026-02-22T00:00:00.000Z'),
  },
  {
    id: 'writing-edge-first-portfolio-stack-id',
    locale: 'id',
    slug: 'edge-first-portfolio-stack',
    title: 'Memilih stack edge-first untuk portfolio Winterest',
    summary:
      'Kenapa portfolio ini memakai tooling lokal yang cepat, framework React fullstack, dan target deploy yang ramah edge.',
    content:
      'Portfolio cukup kecil untuk dibuat sederhana, tapi cukup penting untuk punya fondasi yang serius. Aku ingin Winterest mudah diperbarui, cepat dibuka, dan fleksibel untuk project, tulisan, eksperimen, dan CMS.\n\nStack-nya dipilih mengikuti bentuk itu: iterasi lokal yang produktif, alur konten yang typed, halaman publik yang mudah di-cache, dan dashboard privat yang tetap praktis.',
    tags: ['Arsitektur', 'Portfolio', 'Edge'],
    publishedAt: new Date('2026-02-20T00:00:00.000Z'),
  },
  {
    id: 'writing-solo-cms-roadmap-id',
    locale: 'id',
    slug: 'solo-cms-roadmap',
    title: 'Workflow konten praktis untuk satu developer',
    summary:
      'Jalur bertahap dari seed content ke cerita project, tulisan, entry lab, media, dan publishing polish yang dikelola CMS.',
    content:
      'Untuk portfolio solo, CMS seharusnya mengurangi friksi, bukan menjadi produk tambahan yang harus dirawat. Jalur yang berguna dimulai dari beberapa model yang jelas, dashboard yang terlindungi, dan workflow draft/published yang tidak membocorkan konten belum selesai.\n\nSetelah itu, media, editing yang lebih kaya, lokalisasi, dan manajemen user bisa ditambahkan bertahap.',
    tags: ['CMS', 'Workflow', 'Planning'],
    publishedAt: new Date('2026-02-22T00:00:00.000Z'),
  },
] satisfies PortfolioContentSeed[]

export const labSeeds = [
  {
    id: 'lab-worker-notes',
    locale: 'en',
    slug: 'worker-notes',
    title: 'Worker Notes',
    summary:
      'Small notes on Worker routes, bindings, caching, and server code that stays friendly to the edge runtime.',
    content:
      'A running notebook for Cloudflare Worker details that are easy to forget: where bindings are available, which code should stay server-only, and how to keep request handlers small.',
    tags: ['Cloudflare', 'Workers', 'Edge'],
    publishedAt: new Date('2026-02-25T00:00:00.000Z'),
  },
  {
    id: 'lab-tanstack-playground',
    locale: 'en',
    slug: 'tanstack-playground',
    title: 'TanStack Playground',
    summary:
      'Focused experiments with Router, Query, Form, Table, Store, and DB patterns I want to reuse well.',
    content:
      'A place to test TanStack patterns before they become part of the main portfolio workflow. The goal is to keep route data, forms, tables, and shared state boring in the best way.',
    tags: ['TanStack', 'React', 'TypeScript'],
    publishedAt: new Date('2026-02-26T00:00:00.000Z'),
  },
  {
    id: 'lab-bun-tooling-notes',
    locale: 'en',
    slug: 'bun-tooling-notes',
    title: 'Bun Tooling Notes',
    summary:
      'Practical notes around Bun scripts, fast local workflows, and keeping this workspace pleasant to maintain.',
    content:
      'A small collection of workflow notes for keeping the project comfortable to work on: scripts, checks, formatting, and the everyday edges of a Bun-first repository.',
    tags: ['Bun', 'Tooling', 'DX'],
    publishedAt: new Date('2026-02-27T00:00:00.000Z'),
  },
  {
    id: 'lab-worker-notes-id',
    locale: 'id',
    slug: 'worker-notes',
    title: 'Catatan Worker',
    summary:
      'Catatan kecil tentang route Worker, binding, caching, dan kode server yang tetap ramah untuk edge runtime.',
    content:
      'Notebook berjalan untuk detail Cloudflare Worker yang mudah terlupa: di mana binding tersedia, kode mana yang harus tetap server-only, dan bagaimana menjaga handler request tetap kecil.',
    tags: ['Cloudflare', 'Workers', 'Edge'],
    publishedAt: new Date('2026-02-25T00:00:00.000Z'),
  },
  {
    id: 'lab-tanstack-playground-id',
    locale: 'id',
    slug: 'tanstack-playground',
    title: 'TanStack Playground',
    summary:
      'Eksperimen fokus dengan pola Router, Query, Form, Table, Store, dan DB yang ingin kupakai ulang dengan baik.',
    content:
      'Tempat untuk menguji pola TanStack sebelum menjadi bagian dari workflow utama portfolio. Tujuannya menjaga route data, form, table, dan shared state tetap membosankan dalam arti terbaik.',
    tags: ['TanStack', 'React', 'TypeScript'],
    publishedAt: new Date('2026-02-26T00:00:00.000Z'),
  },
  {
    id: 'lab-bun-tooling-notes-id',
    locale: 'id',
    slug: 'bun-tooling-notes',
    title: 'Catatan Tooling Bun',
    summary:
      'Catatan praktis tentang script Bun, workflow lokal yang cepat, dan menjaga workspace ini tetap nyaman dirawat.',
    content:
      'Kumpulan catatan workflow kecil untuk menjaga project tetap nyaman dikerjakan: script, check, formatting, dan sisi sehari-hari dari repository Bun-first.',
    tags: ['Bun', 'Tooling', 'DX'],
    publishedAt: new Date('2026-02-27T00:00:00.000Z'),
  },
] satisfies PortfolioContentSeed[]
