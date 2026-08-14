import type { ContentLocale } from './schema'

export type CategorySeed = {
  id: string
  name: string
  slug: string
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
  isUltimate?: boolean
}

export const categorySeeds = [
  {
    id: 'cat-runtime-edge',
    name: 'Runtime & Edge Platform',
    slug: 'runtime-edge',
    sortOrder: 1,
  },
  {
    id: 'cat-fullstack-ui',
    name: 'Fullstack & UI',
    slug: 'fullstack-ui',
    sortOrder: 2,
  },
  {
    id: 'cat-data-auth',
    name: 'Data & Security',
    slug: 'data-security',
    sortOrder: 3,
  },
  {
    id: 'cat-design-styling',
    name: 'Design System & Styling',
    slug: 'design-styling',
    sortOrder: 4,
  },
  {
    id: 'cat-languages-tools',
    name: 'Languages & Core Tools',
    slug: 'languages-tools',
    sortOrder: 5,
  },
] satisfies CategorySeed[]

export const technologySeeds = [
  {
    id: 'tech-bun',
    name: 'Bun',
    slug: 'bun',
    categoryIds: ['cat-runtime-edge', 'cat-languages-tools'],
    icon: 'https://cdn.simpleicons.org/bun',
    color: '#fbf0df',
    url: 'https://bun.sh',
    isUltimate: true,
  },
  {
    id: 'tech-react',
    name: 'React 19',
    slug: 'react',
    categoryIds: ['cat-fullstack-ui'],
    icon: 'https://cdn.simpleicons.org/react',
    color: '#61dafb',
    url: 'https://react.dev',
    isUltimate: true,
  },
  {
    id: 'tech-tanstack-start',
    name: 'TanStack Start',
    slug: 'tanstack-start',
    categoryIds: ['cat-fullstack-ui'],
    icon: 'https://cdn.simpleicons.org/reactrouter',
    color: '#ff4154',
    url: 'https://tanstack.com/start',
    isUltimate: true,
  },
  {
    id: 'tech-cloudflare-workers',
    name: 'Cloudflare Workers',
    slug: 'cloudflare-workers',
    categoryIds: ['cat-runtime-edge'],
    icon: 'https://cdn.simpleicons.org/cloudflare',
    color: '#f38020',
    url: 'https://workers.cloudflare.com',
    isUltimate: true,
  },
  {
    id: 'tech-cloudflare-d1',
    name: 'Cloudflare D1',
    slug: 'cloudflare-d1',
    categoryIds: ['cat-data-auth', 'cat-runtime-edge'],
    icon: 'https://cdn.simpleicons.org/cloudflare',
    color: '#f38020',
    url: 'https://developers.cloudflare.com/d1',
    isUltimate: true,
  },
  {
    id: 'tech-drizzle',
    name: 'Drizzle ORM',
    slug: 'drizzle-orm',
    categoryIds: ['cat-data-auth'],
    icon: 'https://cdn.simpleicons.org/drizzle',
    color: '#c5f74f',
    url: 'https://orm.drizzle.team',
    isUltimate: true,
  },
  {
    id: 'tech-tailwind',
    name: 'Tailwind CSS v4',
    slug: 'tailwind-css',
    categoryIds: ['cat-design-styling'],
    icon: 'https://cdn.simpleicons.org/tailwindcss',
    color: '#38bdf8',
    url: 'https://tailwindcss.com',
    isUltimate: true,
  },
  {
    id: 'tech-better-auth',
    name: 'Better Auth',
    slug: 'better-auth',
    categoryIds: ['cat-data-auth'],
    icon: 'https://cdn.simpleicons.org/auth0',
    color: '#ffc107',
    url: 'https://www.better-auth.com',
  },
  {
    id: 'tech-typescript',
    name: 'TypeScript',
    slug: 'typescript',
    categoryIds: ['cat-languages-tools'],
    icon: 'https://cdn.simpleicons.org/typescript',
    color: '#3178c6',
    url: 'https://www.typescriptlang.org',
    isUltimate: true,
  },
  {
    id: 'tech-zod',
    name: 'Zod',
    slug: 'zod',
    categoryIds: ['cat-data-auth'],
    icon: 'https://cdn.simpleicons.org/zod',
    color: '#3068b7',
    url: 'https://zod.dev',
  },
  {
    id: 'tech-vite',
    name: 'Vite',
    slug: 'vite',
    categoryIds: ['cat-runtime-edge'],
    icon: 'https://cdn.simpleicons.org/vite',
    color: '#646cff',
    url: 'https://vitejs.dev',
  },
  {
    id: 'tech-wrangler',
    name: 'Wrangler',
    slug: 'wrangler',
    categoryIds: ['cat-runtime-edge'],
    icon: 'https://cdn.simpleicons.org/cloudflare',
    color: '#f38020',
    url: 'https://developers.cloudflare.com/workers/wrangler',
  },
] satisfies TechnologySeed[]

export const projectSeeds = [
  {
    id: 'proj-winterest-portfolio',
    slug: 'winterest-portfolio-v2',
    featured: true,
    repoUrl: 'https://github.com/winterestingwithyou/winterest-portfolio-v2',
    repoVisibility: 'public',
    demoUrl: 'https://winterest.tech',
    productionUrl: 'https://winterest.tech',
    publishedAt: new Date('2026-03-01T00:00:00.000Z'),
    technologies: [
      'Bun',
      'React 19',
      'TanStack Start',
      'Cloudflare Workers',
      'Cloudflare D1',
      'Drizzle ORM',
      'Tailwind CSS v4',
      'Better Auth',
      'TypeScript',
      'Zod',
    ],
    translations: {
      en: {
        title: 'Winterest Primary Portfolio & Platform',
        summary:
          'Flagship personal portfolio platform and CMS built with TanStack Start and deployed on Cloudflare Workers.',
        description:
          'Comprehensive personal developer platform featuring dynamic CMS management for projects and tech stack, custom dashboard RBAC, Cloudflare D1 integration, and modern UI aesthetic inspired by Cloudflare and Bun.',
        category: 'Fullstack Platform',
      },
      id: {
        title: 'Winterest Primary Portfolio & Platform',
        summary:
          'Platform portofolio utama dan CMS yang dibuat dengan TanStack Start dan dideploy ke Cloudflare Workers.',
        description:
          'Platform pengembang personal komprehensif dengan manajemen CMS dinamis untuk proyek dan tech stack, RBAC dashboard kustom, integrasi Cloudflare D1, serta estetika UI modern berinspirasi Cloudflare dan Bun.',
        category: 'Platform Fullstack',
      },
    },
  },
] satisfies PortfolioProjectSeed[]
