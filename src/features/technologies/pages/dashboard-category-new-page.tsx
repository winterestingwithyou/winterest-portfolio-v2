import { useSuspenseQuery } from '@tanstack/react-query'

import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { CategoryEditorForm } from '#/features/technologies/components/form/category-editor-form'
import { categoryQueryOptions } from '#/features/technologies/query-options'
import { getNextCategorySortOrder } from '#/features/technologies/utils'

export function DashboardCategoryNewPage() {
  const copy = getDashboardCopy()
  const { data: categories = [] } = useSuspenseQuery(
    categoryQueryOptions.list(),
  )
  const nextSortOrder = getNextCategorySortOrder(categories)

  return (
    <DashboardShell
      title={copy.stack.newCategory}
      description={copy.stack.newCategoryDesc}
    >
      <CategoryEditorForm mode="create" defaultSortOrder={nextSortOrder} />
    </DashboardShell>
  )
}
