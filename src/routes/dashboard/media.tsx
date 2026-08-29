import { createFileRoute } from '@tanstack/react-router'

import { MediaPage } from '#/features/media/pages/media-page'
import { mediaQueryOptions } from '#/features/media/query-options'

export const Route = createFileRoute('/dashboard/media')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(mediaQueryOptions.list()),
  component: MediaPage,
})
