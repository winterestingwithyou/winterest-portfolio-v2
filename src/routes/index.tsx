import { createFileRoute } from '@tanstack/react-router'

import { HomePage } from '#/features/home/pages/home-page'
import { getPublishedProjects } from '#/features/projects/public-loaders'
import { getPublicUltimateStack } from '#/features/technologies/public-loaders'
import { createRouteMeta } from '#/lib/metadata'
import { getLocale } from '#/paraglide/runtime'

export const Route = createFileRoute('/')({
  loader: async () => {
    const locale = getLocale()
    const [projects, ultimateTechs] = await Promise.all([
      getPublishedProjects({ data: { locale } }),
      getPublicUltimateStack(),
    ])

    return { projects, ultimateTechs }
  },
  head: ({ matches }) => createRouteMeta({ matches, isHome: true }),
  component: HomeRouteComponent,
})

function HomeRouteComponent() {
  const { projects, ultimateTechs } = Route.useLoaderData()
  return <HomePage projects={projects} ultimateTechs={ultimateTechs} />
}
