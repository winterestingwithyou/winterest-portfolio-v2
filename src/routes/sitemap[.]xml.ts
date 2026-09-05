import { createFileRoute } from '@tanstack/react-router'
import { env as cfEnv } from 'cloudflare:workers'

import { getDb } from '#/db'
import { env as appEnv } from '#/env'
import { generateSitemapXml } from '#/features/portfolio/sitemap'
import { listPublishedProjects } from '#/features/projects/queries'

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const cfEnvDict = (
            typeof cfEnv !== 'undefined' ? cfEnv : {}
          ) as Record<string, string | undefined>

          const baseUrl =
            cfEnvDict.PUBLIC_APP_URL ||
            appEnv.PUBLIC_APP_URL ||
            process.env.PUBLIC_APP_URL

          if (!baseUrl) {
            return new Response(
              'Server configuration error: PUBLIC_APP_URL is not configured.',
              {
                status: 500,
                headers: { 'Content-Type': 'text/plain; charset=utf-8' },
              },
            )
          }

          const db = getDb(cfEnv.DB)
          const publishedProjects = await listPublishedProjects(db)

          const sitemap = generateSitemapXml(baseUrl, publishedProjects)

          return new Response(sitemap, {
            status: 200,
            headers: {
              'Content-Type': 'application/xml; charset=utf-8',
              'Cache-Control':
                'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
            },
          })
        } catch (error) {
          console.error('Failed to generate sitemap.xml:', error)
          return new Response('Failed to generate sitemap.', {
            status: 500,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          })
        }
      },
    },
  },
})
