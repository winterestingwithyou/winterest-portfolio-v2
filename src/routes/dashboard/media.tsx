import { createFileRoute } from '@tanstack/react-router'

import { getDashboardCopy } from '#/features/dashboard/copy'
import { MediaPage } from '#/features/media/pages/media-page'
import { mediaQueryOptions } from '#/features/media/query-options'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/dashboard/media')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(mediaQueryOptions.list()),
  head: ({ matches }) => {
    const copy = getDashboardCopy()
    return createRouteMeta({
      matches,
      title: `${copy.media.title} · Dashboard`,
      description: copy.media.description,
    })
  },
  component: MediaPage,
})
