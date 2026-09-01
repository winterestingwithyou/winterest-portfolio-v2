import { createFileRoute } from '@tanstack/react-router'

import { getDashboardCopy } from '#/features/dashboard/copy'
import { SocialPage } from '#/features/social/pages/social-page'
import { socialQueryOptions } from '#/features/social/query-options'
import { sessionQueryOptions } from '#/features/users/query-options'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/dashboard/social/')({
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData(sessionQueryOptions.current()),
      queryClient.ensureQueryData(socialQueryOptions.list()),
    ])
  },
  head: ({ matches }) => {
    const copy = getDashboardCopy()
    return createRouteMeta({
      matches,
      title: `${copy.social.title} · Dashboard`,
      description: copy.social.description,
    })
  },
  component: SocialPage,
})
