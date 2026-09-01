import { createFileRoute } from '@tanstack/react-router'

import { StackPage } from '#/features/technologies/pages/stack-page'
import { getTechnologiesCopy } from '#/features/technologies/copy'
import { getPublicStackData } from '#/features/technologies/public-loaders'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/stack')({
  loader: () => getPublicStackData(),
  head: ({ matches }) => {
    const copy = getTechnologiesCopy()
    return createRouteMeta({
      matches,
      title: copy.meta.title,
      description: copy.meta.description,
    })
  },
  component: StackRouteComponent,
})

function StackRouteComponent() {
  const { categories, ultimateTechs } = Route.useLoaderData()
  return <StackPage categories={categories} ultimateTechs={ultimateTechs} />
}
