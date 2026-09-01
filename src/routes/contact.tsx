import { createFileRoute } from '@tanstack/react-router'

import { ContactPage } from '#/features/contact/pages/contact-page'
import { getContactCopy } from '#/features/contact/copy'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/contact')({
  head: ({ matches }) => {
    const copy = getContactCopy()
    return createRouteMeta({
      matches,
      title: copy.meta.title,
      description: copy.meta.description,
    })
  },
  component: ContactPage,
})
