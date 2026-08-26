import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Footer from '../components/footer'
import Header from '../components/header'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import { SetupRequiredScreen } from '#/components/system/setup-required'
import { getPublicCopy } from '#/features/portfolio/data'
import { useSiteSettings } from '#/features/settings/hooks'
import { getSystemStatus } from '#/features/system/server-functions'
import { getLocale } from '#/paraglide/runtime'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { TooltipProvider } from '#/components/ui/tooltip'

interface MyRouterContext {
  queryClient: QueryClient
}

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    // Other redirect strategies are possible; see
    // https://github.com/TanStack/router/tree/main/examples/react/i18n-paraglide#offline-redirect
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', getLocale())
    }
  },

  loader: async () => {
    const systemStatus = await getSystemStatus()
    return { systemStatus }
  },

  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: getPublicCopy().meta.title,
      },
      {
        name: 'description',
        content: getPublicCopy().meta.description,
      },
      {
        property: 'og:title',
        content: getPublicCopy().meta.title,
      },
      {
        property: 'og:description',
        content: getPublicCopy().meta.ogDescription,
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { systemStatus } = Route.useLoaderData()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const { data: settings } = useSiteSettings({
    enabled: Boolean(systemStatus.hasOwner),
  })
  const isDashboard = pathname.startsWith('/dashboard')
  const isAuth = pathname.startsWith('/login')
  const usesAppChrome = !isDashboard && !isAuth

  // If no owner exists, lock the entire web app and render Setup Required screen
  if (!systemStatus.hasOwner) {
    return (
      <html lang={getLocale()} suppressHydrationWarning>
        <head>
          <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
          <HeadContent />
        </head>
        <body className="font-sans antialiased wrap-anywhere selection:bg-[rgba(244,129,32,0.22)]">
          <TooltipProvider>
            <SetupRequiredScreen status={systemStatus} />
          </TooltipProvider>
          <Scripts />
        </body>
      </html>
    )
  }

  return (
    <html lang={getLocale()} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased wrap-anywhere selection:bg-[rgba(244,129,32,0.22)]">
        <TooltipProvider>
          {settings?.maintenanceMode && usesAppChrome && (
            <div className="bg-amber-500 text-slate-950 font-bold px-4 py-2 text-center text-xs border-b border-amber-600 shadow-xs z-50 relative">
              ⚠️ Maintenance Mode Enabled — Site is currently undergoing updates.
            </div>
          )}
          {usesAppChrome ? <Header /> : null}
          {children}
          {usesAppChrome ? <Footer /> : null}
        </TooltipProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
