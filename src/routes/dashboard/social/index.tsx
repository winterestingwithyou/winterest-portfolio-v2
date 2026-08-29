import { createFileRoute } from '@tanstack/react-router'

import { SocialPage } from '#/features/social/pages/social-page'
import { socialQueryOptions } from '#/features/social/query-options'
import { sessionQueryOptions } from '#/features/users/query-options'

export const Route = createFileRoute('/dashboard/social/')({
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData(sessionQueryOptions.current()),
      queryClient.ensureQueryData(socialQueryOptions.list()),
    ])
  },
  component: SocialPage,
})
