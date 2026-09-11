import { createFileRoute } from '@tanstack/react-router'

import { getDashboardCopy } from '#/features/dashboard/copy'
import { DashboardCategoryNewPage } from '#/features/technologies/pages/dashboard-category-new-page'
import { categoryQueryOptions } from '#/features/technologies/query-options'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/dashboard/stack/categories/new')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(categoryQueryOptions.list()),
  head: ({ matches }) => {
    const copy = getDashboardCopy()
    return createRouteMeta({
      matches,
      title: `${copy.stack.newCategory} · Dashboard`,
      description: copy.stack.newCategoryDesc,
    })
  },
  component: DashboardCategoryNewPage,
})
