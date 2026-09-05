export interface SitemapEntry {
  url: string
  lastModified?: Date | string | number | null
  changeFrequency?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never'
  priority?: number
}

export interface SitemapStaticRoute {
  path: string
  priority: number
  changefreq: NonNullable<SitemapEntry['changeFrequency']>
}

export interface ProjectSitemapItem {
  slug: string
  updatedAt?: Date | string | number | null
  publishedAt?: Date | string | number | null
}

export const STATIC_PUBLIC_ROUTES: readonly SitemapStaticRoute[] = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/projects', priority: 0.9, changefreq: 'weekly' },
  { path: '/about', priority: 0.8, changefreq: 'monthly' },
  { path: '/stack', priority: 0.7, changefreq: 'monthly' },
  { path: '/contact', priority: 0.6, changefreq: 'monthly' },
  { path: '/resume', priority: 0.6, changefreq: 'monthly' },
]

export function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '&':
        return '&amp;'
      case "'":
        return '&apos;'
      case '"':
        return '&quot;'
      default:
        return c
    }
  })
}

export function formatLastmod(
  date: Date | string | number | null | undefined,
): string | undefined {
  if (!date) return undefined
  try {
    const d = new Date(date)
    if (Number.isNaN(d.getTime())) return undefined
    return d.toISOString().split('T')[0]
  } catch {
    return undefined
  }
}

export function buildSitemapXml(entries: readonly SitemapEntry[]): string {
  const urlNodes = entries
    .map((entry) => {
      const loc = `<loc>${escapeXml(entry.url)}</loc>`
      const lastmodDate = formatLastmod(entry.lastModified)
      const lastmod = lastmodDate
        ? `\n    <lastmod>${lastmodDate}</lastmod>`
        : ''
      const changefreq = entry.changeFrequency
        ? `\n    <changefreq>${entry.changeFrequency}</changefreq>`
        : ''
      const priority =
        entry.priority !== undefined
          ? `\n    <priority>${entry.priority.toFixed(1)}</priority>`
          : ''

      return `  <url>\n    ${loc}${lastmod}${changefreq}${priority}\n  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlNodes}\n</urlset>`
}

export function generateSitemapXml(
  baseUrl: string,
  projects: readonly ProjectSitemapItem[] = [],
): string {
  const cleanBaseUrl = baseUrl.replace(/\/+$/, '')

  const entries: SitemapEntry[] = [
    ...STATIC_PUBLIC_ROUTES.map((route) => ({
      url: `${cleanBaseUrl}${route.path === '/' ? '/' : route.path}`,
      priority: route.priority,
      changeFrequency: route.changefreq,
    })),
    ...projects.map((project) => ({
      url: `${cleanBaseUrl}/projects/${project.slug}`,
      priority: 0.8,
      changeFrequency: 'monthly' as const,
      lastModified: project.updatedAt ?? project.publishedAt ?? undefined,
    })),
  ]

  return buildSitemapXml(entries)
}
