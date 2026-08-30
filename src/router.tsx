import {
  Link,
  createRouter as createTanStackRouter,
} from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { getContext } from './integrations/tanstack-query/root-provider'
import { getPortfolioCopy } from './features/portfolio/copy'

export function getRouter() {
  const context = getContext()

  const router = createTanStackRouter({
    routeTree,
    context,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    defaultNotFoundComponent: NotFoundPage,
  })

  setupRouterSsrQueryIntegration({ router, queryClient: context.queryClient })

  return router
}

function NotFoundPage() {
  const copy = getPortfolioCopy()

  return (
    <main className="px-4 py-20">
      <div className="page-wrap">
        <section className="surface-card max-w-2xl p-8">
          <p className="eyebrow mb-3">{copy.notFound.eyebrow}</p>
          <h1 className="text-3xl font-semibold text-(--brand-ink)">
            {copy.notFound.title}
          </h1>
          <p className="mt-3 text-sm leading-7 text-(--brand-muted)">
            {copy.notFound.description}
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex min-h-10 items-center rounded-full bg-(--brand-orange) px-4 text-sm font-bold text-white no-underline transition hover:-translate-y-0.5"
          >
            {copy.notFound.home}
          </Link>
        </section>
      </div>
    </main>
  )
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
