import { createFileRoute } from '@tanstack/react-router'

import { MediaPage } from '#/features/media/pages/media-page'

export const Route = createFileRoute('/dashboard/media')({
  component: MediaPage,
})
