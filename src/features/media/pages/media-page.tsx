import * as React from 'react'

import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { MediaDeleteDialog } from '#/features/media/components/media-delete-dialog'
import { MediaGallerySection } from '#/features/media/components/section/media-gallery-section'
import { MediaUploadDropzone } from '#/features/media/components/section/media-upload-dropzone'
import { useDeleteMedia, useUploadMedia } from '#/features/media/hooks'
import type { MediaRecord } from '#/features/media/queries'
import { useSuspenseQuery } from '@tanstack/react-query'
import { mediaQueryOptions } from '../query-options'

export function MediaPage() {
  const copy = getDashboardCopy()
  const [search, setSearch] = React.useState('')
  const [deletingMedia, setDeletingMedia] = React.useState<MediaRecord | null>(null)

  const { data: mediaList = [], isLoading, error: loadError } = useSuspenseQuery(mediaQueryOptions.list(search))
  const uploadMutation = useUploadMedia()
  const deleteMutation = useDeleteMedia()

  const handleUpload = async (file: File) => {
    try {
      await uploadMutation.mutateAsync({ file })
    } catch (err) {
      console.error('Media upload failed:', err)
    }
  }

  const confirmDelete = async () => {
    if (!deletingMedia) return
    try {
      await deleteMutation.mutateAsync(deletingMedia.id)
      setDeletingMedia(null)
    } catch (err) {
      console.error('Failed to delete media:', err)
    }
  }

  return (
    <DashboardShell
      title={copy.media.title}
      description={copy.media.description}
    >
      <div className="space-y-8">
        <MediaUploadDropzone
          copy={copy.media}
          isUploading={uploadMutation.isPending}
          isError={uploadMutation.isError}
          isSuccess={uploadMutation.isSuccess}
          errorMessage={uploadMutation.error?.message}
          onUpload={handleUpload}
        />

        <MediaGallerySection
          copy={copy}
          mediaList={mediaList}
          isLoading={isLoading}
          loadError={loadError}
          search={search}
          onSearchChange={setSearch}
          onDeleteSelect={setDeletingMedia}
        />
      </div>

      <MediaDeleteDialog
        copy={copy}
        deletingMedia={deletingMedia}
        isDeleting={deleteMutation.isPending}
        onClose={() => setDeletingMedia(null)}
        onConfirm={confirmDelete}
      />
    </DashboardShell>
  )
}
