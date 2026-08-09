import type { ContentLocale, TechnologyCategory } from './schema'

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
