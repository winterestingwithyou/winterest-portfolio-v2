import { useSuspenseQuery } from '@tanstack/react-query'

import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { getTechnologiesCopy } from '#/features/technologies/copy'
import { CategoryEditorForm } from '#/features/technologies/components/form/category-editor-form'
import { categoryQueryOptions } from '#/features/technologies/query-options'
import { getNextCategorySortOrder } from '#/features/technologies/utils'

export function DashboardCategoryNewPage() {
  const copy = getTechnologiesCopy()
  const { data: categories = [] } = useSuspenseQuery(
    categoryQueryOptions.list(),
  )
  const nextSortOrder = getNextCategorySortOrder(categories)

  return (
    <DashboardShell
      title={copy.dashboard.newCategory}
      description={copy.dashboard.newCategoryDesc}
    >
      <CategoryEditorForm mode="create" defaultSortOrder={nextSortOrder} />
    </DashboardShell>
  )
}
