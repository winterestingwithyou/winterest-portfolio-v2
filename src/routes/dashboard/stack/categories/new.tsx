import { createFileRoute } from '@tanstack/react-router'

import { getTechnologiesCopy } from '#/features/technologies/copy'
import { DashboardCategoryNewPage } from '#/features/technologies/pages/dashboard-category-new-page'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/dashboard/stack/categories/new')({
  head: ({ matches }) => {
    const copy = getTechnologiesCopy().dashboard
    return createRouteMeta({
      matches,
      title: `${copy.newCategory} · Dashboard`,
      description: copy.newCategoryDesc,
    })
  },
  component: DashboardCategoryNewPage,
})
