import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { CategoryEditorForm } from '#/features/technologies/components/form/category-editor-form'

export function DashboardCategoryNewPage() {
  const copy = getDashboardCopy()

  return (
    <DashboardShell
      title={copy.stack.newCategory}
      description={copy.stack.newCategoryDesc}
    >
      <CategoryEditorForm mode="create" />
    </DashboardShell>
  )
}
