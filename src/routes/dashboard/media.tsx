import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { getDashboardCopy } from '#/features/dashboard/copy'
import { MediaPage } from '#/features/media/pages/media-page'
import { mediaQueryOptions } from '#/features/media/query-options'
import { createRouteMeta } from '#/lib/metadata'

const mediaSearchSchema = z.object({
  q: z.string().optional(),
  type: z.enum(['all', 'image', 'document']).optional(),
  page: z.coerce.number().int().min(1).optional(),
})

export const Route = createFileRoute('/dashboard/media')({
  validateSearch: (search) => mediaSearchSchema.parse(search),
  loaderDeps: ({ search }) => ({
    search: search.q,
    type: search.type,
    page: search.page ?? 1,
  }),
  loader: ({ context: { queryClient }, deps }) =>
    queryClient.ensureQueryData(
      mediaQueryOptions.list({
        search: deps.search,
        type: deps.type,
        page: deps.page,
      }),
    ),
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
