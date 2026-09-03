import { createFileRoute } from '@tanstack/react-router'

import { HomePage } from '#/features/home/pages/home-page'
import { getPublicSiteSettings } from '#/features/settings/server-functions'
import { getPublishedProjects } from '#/features/projects/public-loaders'
import { getPublicUltimateStack } from '#/features/technologies/public-loaders'
import { createRouteMeta } from '#/lib/metadata'
import { getLocale } from '#/paraglide/runtime'

export const Route = createFileRoute('/')({
  loader: async () => {
    const locale = getLocale()
    const [projects, ultimateTechs, settings] = await Promise.all([
      getPublishedProjects({ data: { locale } }),
      getPublicUltimateStack(),
      getPublicSiteSettings(),
    ])

    return { projects, ultimateTechs, settings }
  },
  head: ({ matches }) => createRouteMeta({ matches, isHome: true }),
  component: HomeRouteComponent,
})

function HomeRouteComponent() {
  const { projects, ultimateTechs, settings } = Route.useLoaderData()
  return (
    <HomePage
      projects={projects}
      ultimateTechs={ultimateTechs}
      settings={settings}
    />
  )
}
