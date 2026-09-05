import { describe, expect, it } from 'vitest'

import {
  STATIC_PUBLIC_ROUTES,
  buildSitemapXml,
  escapeXml,
  formatLastmod,
  generateSitemapXml,
} from '../sitemap'

describe('sitemap generator', () => {
  describe('escapeXml', () => {
    it('escapes XML special characters correctly', () => {
      expect(escapeXml('https://example.com/test?a=1&b=2<tag>"quote"\'')).toBe(
        'https://example.com/test?a=1&amp;b=2&lt;tag&gt;&quot;quote&quot;&apos;',
      )
    })
  })

  describe('formatLastmod', () => {
    it('formats valid Date instances into YYYY-MM-DD', () => {
      const date = new Date('2026-09-05T12:00:00.000Z')
      expect(formatLastmod(date)).toBe('2026-09-05')
    })

    it('formats ISO string or timestamp into YYYY-MM-DD', () => {
      expect(formatLastmod('2026-01-15T00:00:00Z')).toBe('2026-01-15')
      expect(formatLastmod(1767225600000)).toBe('2026-01-01')
    })

    it('returns undefined for invalid dates or empty values', () => {
      expect(formatLastmod(null)).toBeUndefined()
      expect(formatLastmod(undefined)).toBeUndefined()
      expect(formatLastmod('invalid-date')).toBeUndefined()
    })
  })

  describe('buildSitemapXml', () => {
    it('produces valid XML structure with urlset namespace', () => {
      const xml = buildSitemapXml([
        {
          url: 'https://winterest.tech/',
          priority: 1.0,
          changeFrequency: 'weekly',
        },
      ])

      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
      expect(xml).toContain(
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      )
      expect(xml).toContain('<loc>https://winterest.tech/</loc>')
      expect(xml).toContain('<changefreq>weekly</changefreq>')
      expect(xml).toContain('<priority>1.0</priority>')
      expect(xml).toContain('</urlset>')
    })
  })

  describe('generateSitemapXml', () => {
    it('includes all 6 static public routes with appropriate priorities', () => {
      const xml = generateSitemapXml('https://winterest.tech')

      expect(STATIC_PUBLIC_ROUTES).toHaveLength(6)

      expect(xml).toContain('<loc>https://winterest.tech/</loc>')
      expect(xml).toContain('<loc>https://winterest.tech/projects</loc>')
      expect(xml).toContain('<loc>https://winterest.tech/about</loc>')
      expect(xml).toContain('<loc>https://winterest.tech/stack</loc>')
      expect(xml).toContain('<loc>https://winterest.tech/contact</loc>')
      expect(xml).toContain('<loc>https://winterest.tech/resume</loc>')

      // Ensure /login and /dashboard are not included
      expect(xml).not.toContain('/login')
      expect(xml).not.toContain('/dashboard')
      expect(xml).not.toContain('/api')
    })

    it('normalizes base URL with trailing slash', () => {
      const xmlWithTrailingSlash = generateSitemapXml('https://winterest.tech/')
      const xmlWithoutTrailingSlash = generateSitemapXml(
        'https://winterest.tech',
      )

      expect(xmlWithTrailingSlash).toBe(xmlWithoutTrailingSlash)
    })

    it('appends dynamic projects with formatted lastmod and slug', () => {
      const mockProjects = [
        {
          slug: 'portfolio-v2',
          updatedAt: new Date('2026-09-05T08:00:00Z'),
          publishedAt: new Date('2026-09-01T00:00:00Z'),
        },
        {
          slug: 'react-starter',
          updatedAt: null,
          publishedAt: new Date('2026-08-20T10:00:00Z'),
        },
      ]

      const xml = generateSitemapXml('https://winterest.tech', mockProjects)

      expect(xml).toContain(
        '<loc>https://winterest.tech/projects/portfolio-v2</loc>',
      )
      expect(xml).toContain('<lastmod>2026-09-05</lastmod>')

      expect(xml).toContain(
        '<loc>https://winterest.tech/projects/react-starter</loc>',
      )
      expect(xml).toContain('<lastmod>2026-08-20</lastmod>')
    })
  })
})
