import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { CategoryEditorForm } from '#/features/technologies/components/form/category-editor-form'

export function DashboardCategoryNewPage() {
  return (
    <DashboardShell
      title="Tambah Kategori Baru"
      description="Tambahkan kategori baru untuk mengelompokkan teknologi."
    >
      <CategoryEditorForm mode="create" />
    </DashboardShell>
  )
}
