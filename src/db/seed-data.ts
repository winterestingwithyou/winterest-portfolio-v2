import type { ContentLocale } from './schema'

export type CategorySeed = {
  id: string
  name: string
  slug: string
  description?: string
  sortOrder: number
}

export type PortfolioProjectSeed = {
  id: string
  slug: string
  featured: boolean
  repoUrl?: string
  repoVisibility?: 'public' | 'private'
  demoUrl?: string
  productionUrl?: string
  publishedAt: Date
  technologies: string[]
  translations: Record<
    ContentLocale,
    {
      title: string
      summary: string
      description: string
      category: string
    }
  >
}

export type TechnologySeed = {
  id: string
  name: string
  slug: string
  categoryIds: string[]
  icon?: string
  color?: string
  url?: string
  description?: string
}

export const categorySeeds = [
  {
    id: 'cat-runtime-edge',
    name: 'Runtime & Edge Platform',
    slug: 'runtime-edge',
    description:
      'Tools and runtimes used to keep local iteration fast and serverless edge deployment smooth.',
    sortOrder: 1,
  },
  {
    id: 'cat-fullstack-ui',
    name: 'Fullstack & UI',
    slug: 'fullstack-ui',
    description:
      'React frameworks, routing, server state, forms, animations, and component libraries.',
    sortOrder: 2,
  },
  {
    id: 'cat-data-auth',
    name: 'Data & Security',
    slug: 'data-security',
    description:
      'Databases, ORMs, authentication, type validation, and environment management.',
    sortOrder: 3,
  },
  {
    id: 'cat-design-styling',
    name: 'Design System & Styling',
    slug: 'design-styling',
    description:
      'Utility-first CSS, Radix UI primitives, animations, and responsive visual design tokens.',
    sortOrder: 4,
  },
  {
    id: 'cat-languages-tools',
    name: 'Languages & Core Tools',
    slug: 'languages-tools',
    description:
      'Primary programming languages, version control, and developer environment tools.',
    sortOrder: 5,
  },
] satisfies CategorySeed[]

export const technologySeeds = [
  {
    id: 'tech-bun',
    name: 'Bun',
    slug: 'bun',
    categoryIds: ['cat-runtime-edge', 'cat-languages-tools'],
    icon: 'bun',
    color: '#fbf0df',
    url: 'https://bun.sh',
    description:
      'Fast JavaScript runtime, package manager, and project tooling.',
  },
  {
    id: 'tech-react',
    name: 'React 19',
    slug: 'react',
    categoryIds: ['cat-fullstack-ui'],
    icon: 'react',
    color: '#61dafb',
    url: 'https://react.dev',
    description: 'UI library for building interactive component interfaces.',
  },
  {
    id: 'tech-tanstack-start',
    name: 'TanStack Start',
    slug: 'tanstack-start',
    categoryIds: ['cat-fullstack-ui'],
    icon: 'layers',
    color: '#ff4154',
    url: 'https://tanstack.com/start',
    description:
      'Fullstack React framework powered by TanStack Router and Vite.',
  },
  {
    id: 'tech-cloudflare-workers',
    name: 'Cloudflare Workers',
    slug: 'cloudflare-workers',
    categoryIds: ['cat-runtime-edge'],
    icon: 'cloudflare',
    color: '#f38020',
    url: 'https://workers.cloudflare.com',
    description: 'Serverless edge runtime for fast global web applications.',
  },
  {
    id: 'tech-cloudflare-d1',
    name: 'Cloudflare D1',
    slug: 'cloudflare-d1',
    categoryIds: ['cat-data-auth', 'cat-runtime-edge'],
    icon: 'database',
    color: '#f38020',
    url: 'https://developers.cloudflare.com/d1',
    description:
      'Serverless SQLite database natively integrated with Cloudflare.',
  },
  {
    id: 'tech-drizzle',
    name: 'Drizzle ORM',
    slug: 'drizzle-orm',
    categoryIds: ['cat-data-auth'],
    icon: 'database',
    color: '#c5f74f',
    url: 'https://orm.drizzle.team',
    description: 'TypeScript ORM used for type-safe database queries.',
  },
  {
    id: 'tech-tailwind',
    name: 'Tailwind CSS v4',
    slug: 'tailwind-css',
    categoryIds: ['cat-design-styling'],
    icon: 'tailwind',
    color: '#38bdf8',
    url: 'https://tailwindcss.com',
    description: 'Utility-first CSS engine for the portfolio design system.',
  },
  {
    id: 'tech-better-auth',
    name: 'Better Auth',
    slug: 'better-auth',
    categoryIds: ['cat-data-auth'],
    icon: 'shield-check',
    color: '#ffc107',
    url: 'https://www.better-auth.com',
    description: 'Authentication foundation for the private CMS dashboard.',
  },
  {
    id: 'tech-typescript',
    name: 'TypeScript',
    slug: 'typescript',
    categoryIds: ['cat-languages-tools'],
    icon: 'typescript',
    color: '#3178c6',
    url: 'https://www.typescriptlang.org',
    description:
      'Strongly typed programming language for end-to-end type safety.',
  },
  {
    id: 'tech-zod',
    name: 'Zod',
    slug: 'zod',
    categoryIds: ['cat-data-auth'],
    icon: 'check-circle-2',
    color: '#3068b7',
    url: 'https://zod.dev',
    description: 'TypeScript-first schema validation for API inputs and forms.',
  },
  {
    id: 'tech-vite',
    name: 'Vite',
    slug: 'vite',
    categoryIds: ['cat-runtime-edge'],
    icon: 'vite',
    color: '#646cff',
    url: 'https://vitejs.dev',
    description: 'Next generation frontend tooling and development server.',
  },
  {
    id: 'tech-wrangler',
    name: 'Wrangler',
    slug: 'wrangler',
    categoryIds: ['cat-runtime-edge'],
    icon: 'terminal',
    color: '#f38020',
    url: 'https://developers.cloudflare.com/workers/wrangler',
    description:
      'Command line tool for developing and deploying Cloudflare Workers.',
  },
] satisfies TechnologySeed[]

export const projectSeeds = [
  {
    id: 'project-winterest-portfolio-platform',
    slug: 'winterest-portfolio-platform',
    featured: true,
    repoUrl: 'https://github.com/winterest/winterest-portfolio-v2',
    repoVisibility: 'public',
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
    translations: {
      en: {
        title: 'Winterest Portfolio Platform',
        summary:
          'My personal portfolio built as a long-term home for projects, case studies, and a private CMS.',
        description:
          'A personal developer platform for Winterest: public portfolio outside, practical content workflow inside. This project turns the portfolio into a place that can keep growing. The public side focuses on work and contact paths. The private side keeps content editable through a small CMS so updates do not have to start from code every time.\n\nThe current goal is simple: make the site feel personal, keep the content honest, and let each section be powered by published records from the database.',
        category: 'Portfolio',
      },
      id: {
        title: 'Winterest Portfolio Platform',
        summary:
          'Portfolio pribadi Winterest yang dibangun sebagai rumah jangka panjang untuk project, case study, dan CMS privat.',
        description:
          'Platform developer personal untuk Winterest: portfolio publik di depan, workflow konten praktis di belakang. Project ini mengubah portfolio menjadi ruang yang bisa terus tumbuh. Sisi publik berfokus pada karya dan jalur kontak. Sisi privat menjaga konten tetap mudah diedit lewat CMS kecil sehingga update tidak selalu harus dimulai dari kode.\n\nTujuan saat ini sederhana: membuat situs terasa personal, menjaga kontennya jujur, dan memastikan setiap bagian ditenagai oleh record published dari database.',
        category: 'Portfolio',
      },
    },
  },
  {
    id: 'project-edge-cms-dashboard',
    slug: 'edge-cms-dashboard',
    featured: true,
    repoVisibility: 'private',
    publishedAt: new Date('2026-02-08T00:00:00.000Z'),
    technologies: [
      'cloudflare-d1',
      'drizzle-orm',
      'better-auth',
      'tanstack-start',
      'tailwind-css',
    ],
    translations: {
      en: {
        title: 'Edge CMS Dashboard',
        summary:
          'A private dashboard for managing portfolio projects, media metadata, and publishing status.',
        description:
          'An owner-first dashboard that keeps portfolio publishing small, focused, and maintainable. The dashboard exists so project stories can move from rough idea to public page without exposing private work. It favors clear forms, predictable lists, and simple publishing states over decorative admin screens.\n\nThe first version focuses on projects and media metadata. User and role management can grow after the core editing workflow feels solid.',
        category: 'CMS',
      },
      id: {
        title: 'Dashboard CMS Edge',
        summary:
          'Dashboard privat untuk mengelola project portfolio, metadata media, dan status publish.',
        description:
          'Dashboard owner-first yang menjaga publishing portfolio tetap kecil, fokus, dan mudah dirawat. Dashboard ini ada supaya cerita project bisa bergerak dari ide kasar ke halaman publik tanpa membocorkan pekerjaan privat. Fokusnya adalah form yang jelas, list yang mudah dipindai, dan status publishing yang sederhana.\n\nVersi pertama berfokus pada project dan metadata media. Manajemen user dan role bisa tumbuh setelah workflow editing utama terasa solid.',
        category: 'CMS',
      },
    },
  },
] satisfies PortfolioProjectSeed[]
