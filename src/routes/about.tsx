import { createFileRoute } from '@tanstack/react-router'

import { AboutPage } from '#/features/about/pages/about-page'
import { getAboutCopy } from '#/features/about/copy'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/about')({
  head: ({ matches }) => {
    const copy = getAboutCopy()
    return createRouteMeta({
      matches,
      title: copy.meta.title,
      description: copy.meta.description,
    })
  },
  component: AboutPage,
})
