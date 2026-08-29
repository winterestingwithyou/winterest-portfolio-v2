import { createFileRoute } from '@tanstack/react-router'

import { StackPage } from '#/features/technologies/pages/stack-page'
import { getPublicStackData } from '#/features/technologies/public-loaders'

export const Route = createFileRoute('/stack')({
  loader: () => getPublicStackData(),
  component: StackRouteComponent,
})

function StackRouteComponent() {
  const { categories, ultimateTechs } = Route.useLoaderData()
  return <StackPage categories={categories} ultimateTechs={ultimateTechs} />
}
