import { createFileRoute } from '@tanstack/react-router'

import { HomePage } from '#/features/home/pages/home-page'
import { getPublicHomeContent } from '#/features/home/public-loaders'
import { getPublishedProjects } from '#/features/projects/public-loaders'
import { getPublicSiteSettings } from '#/features/settings/server-functions'
import { getPublicUltimateStack } from '#/features/technologies/public-loaders'
import { createRouteMeta } from '#/lib/metadata'
import { getLocale } from '#/paraglide/runtime'

export const Route = createFileRoute('/')({
  loader: async () => {
    const locale = getLocale()
    const [projects, ultimateTechs, settings, homeData] = await Promise.all([
      getPublishedProjects({ data: { locale } }),
      getPublicUltimateStack(),
      getPublicSiteSettings(),
      getPublicHomeContent(),
    ])

    return { projects, ultimateTechs, settings, homeData }
  },
  head: ({ matches }) =>
    createRouteMeta({ matches, isHome: true, canonicalUrl: '/' }),
  component: HomeRouteComponent,
})

function HomeRouteComponent() {
  const { projects, ultimateTechs, settings, homeData } = Route.useLoaderData()
  return (
    <HomePage
      projects={projects}
      ultimateTechs={ultimateTechs}
      settings={settings}
      homeConfig={homeData.config}
      enthusiasms={homeData.enthusiasms}
    />
  )
}
