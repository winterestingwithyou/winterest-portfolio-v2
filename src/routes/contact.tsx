import { createFileRoute } from '@tanstack/react-router'

import { ContactPage } from '#/features/contact/pages/contact-page'
import { getContactCopy } from '#/features/contact/copy'
import { settingsQueryOptions } from '#/features/settings/query-options'
import { socialQueryOptions } from '#/features/social/query-options'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/contact')({
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData(settingsQueryOptions.get()),
      queryClient.ensureQueryData(socialQueryOptions.publicList()),
    ])
  },
  head: ({ matches }) => {
    const copy = getContactCopy()
    return createRouteMeta({
      matches,
      title: copy.meta.title,
      description: copy.meta.description,
      canonicalUrl: '/contact',
    })
  },
  component: ContactPage,
})
