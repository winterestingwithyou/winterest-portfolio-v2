import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { getTechnologiesCopy } from '#/features/technologies/copy'
import { CategoryEditorForm } from '#/features/technologies/components/form/category-editor-form'

export function DashboardCategoryNewPage() {
  const copy = getTechnologiesCopy().dashboard

  return (
    <DashboardShell title={copy.newCategory} description={copy.newCategoryDesc}>
      <CategoryEditorForm mode="create" />
    </DashboardShell>
  )
}
