import { useSuspenseQuery } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import * as React from 'react'

import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { getMediaCopy } from '#/features/media/copy'
import { MediaDeleteDialog } from '#/features/media/components/media-delete-dialog'
import { MediaGallerySection } from '#/features/media/components/section/media-gallery-section'
import type { AssetFilter } from '#/features/media/components/section/media-gallery-section'
import { MediaUploadDropzone } from '#/features/media/components/section/media-upload-dropzone'
import { useDeleteMedia, useUploadMedia } from '#/features/media/hooks'
import type { MediaRecord } from '#/features/media/queries'
import { mediaQueryOptions } from '#/features/media/query-options'
import { getApiErrorMessage } from '#/lib/api-client'

export function MediaPage() {
  const commonCopy = getDashboardCopy().common
  const mediaCopy = getMediaCopy()
  const searchParams = useSearch({ from: '/dashboard/media' })
  const navigate = useNavigate({ from: '/dashboard/media' })

  const search = searchParams.q ?? ''
  const activeTab: AssetFilter = searchParams.type ?? 'all'
  const page = searchParams.page ?? 1

  const [deletingMedia, setDeletingMedia] = React.useState<MediaRecord | null>(
    null,
  )
  const [uploadError, setUploadError] = React.useState<string | null>(null)

  const {
    data: mediaResponse,
    isLoading,
    error: loadError,
  } = useSuspenseQuery(
    mediaQueryOptions.list({
      search,
      type: activeTab,
      page,
      limit: 12,
    }),
  )

  const uploadMutation = useUploadMedia()
  const deleteMutation = useDeleteMedia()

  const handleSearchChange = (nextQuery: string) => {
    void navigate({
      search: (prev) => ({
        ...prev,
        q: nextQuery.trim() || undefined,
        page: undefined, // Reset to page 1 on new search
      }),
      replace: true,
      resetScroll: false,
    })
  }

  const handleTabChange = (nextTab: AssetFilter) => {
    void navigate({
      search: (prev) => ({
        ...prev,
        type: nextTab !== 'all' ? nextTab : undefined,
        page: undefined, // Reset to page 1 on tab switch
      }),
      replace: true,
      resetScroll: false,
    })
  }

  const handlePageChange = (nextPage: number) => {
    void navigate({
      search: (prev) => ({
        ...prev,
        page: nextPage > 1 ? nextPage : undefined,
      }),
      replace: true,
      resetScroll: false,
    })
  }

  const handleUpload = async (file: File) => {
    setUploadError(null)
    try {
      await uploadMutation.mutateAsync({ file })
    } catch (err) {
      const message = getApiErrorMessage(err, mediaCopy.uploadError)
      setUploadError(message)
      console.error('Media upload failed:', err)
    }
  }

  const confirmDelete = async (options?: { cascade?: boolean }) => {
    if (!deletingMedia) return
    try {
      await deleteMutation.mutateAsync({
        id: deletingMedia.id,
        cascade: options?.cascade ?? false,
      })
      setDeletingMedia(null)
    } catch (err) {
      console.error('Failed to delete media:', err)
    }
  }

  return (
    <DashboardShell title={mediaCopy.title} description={mediaCopy.description}>
      <div className="space-y-8">
        <MediaUploadDropzone
          copy={mediaCopy}
          isUploading={uploadMutation.isPending}
          isError={Boolean(uploadError) || uploadMutation.isError}
          isSuccess={uploadMutation.isSuccess && !uploadError}
          error={uploadMutation.error}
          errorMessage={
            uploadError ||
            (uploadMutation.error
              ? getApiErrorMessage(uploadMutation.error, mediaCopy.uploadError)
              : undefined)
          }
          onUpload={handleUpload}
        />

        <MediaGallerySection
          copy={mediaCopy}
          commonCopy={commonCopy}
          mediaList={mediaResponse.data}
          pagination={mediaResponse.pagination}
          isLoading={isLoading}
          loadError={loadError}
          search={search}
          onSearchChange={handleSearchChange}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onPageChange={handlePageChange}
          onDeleteSelect={setDeletingMedia}
        />
      </div>

      <MediaDeleteDialog
        copy={mediaCopy}
        commonCopy={commonCopy}
        deletingMedia={deletingMedia}
        isDeleting={deleteMutation.isPending}
        onClose={() => setDeletingMedia(null)}
        onConfirm={confirmDelete}
      />
    </DashboardShell>
  )
}
