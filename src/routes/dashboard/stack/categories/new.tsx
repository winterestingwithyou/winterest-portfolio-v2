import { createFileRoute } from '@tanstack/react-router'

import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { CategoryEditorForm } from '#/features/technologies/category-editor-form'

export const Route = createFileRoute('/dashboard/stack/categories/new')({
  component: DashboardCategoryNew,
})

function DashboardCategoryNew() {
  return (
    <DashboardShell
      title="Tambah Kategori Baru"
      description="Tambahkan kategori baru untuk mengelompokkan teknologi."
    >
      <CategoryEditorForm mode="create" />
    </DashboardShell>
  )
}
