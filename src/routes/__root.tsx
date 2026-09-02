import {
  HeadContent,
  Link,
  Scripts,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
} from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Footer from '../components/footer'
import Header from '../components/header'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import { useQuery } from '@tanstack/react-query'
import type { QueryClient } from '@tanstack/react-query'
import { AlertCircle, AlertTriangle } from 'lucide-react'

import { SetupRequiredScreen } from '#/components/system/setup-required'
import { settingsQueryOptions } from '#/features/settings/query-options'
import { getPublicSiteSettings } from '#/features/settings/server-functions'
import { defaultSiteSettings } from '#/features/settings/types'
import { getSystemStatus } from '#/features/system/server-functions'
import { getLocale } from '#/paraglide/runtime'

import appCss from '../styles.css?url'

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
    const [systemStatus, siteSettings] = await Promise.all([
      getSystemStatus(),
      getPublicSiteSettings(),
    ])
    return { systemStatus, siteSettings }
  },

  head: ({ loaderData }) => {
    const isIndo = getLocale() === 'id'
    const settings = loaderData?.siteSettings

    const rawTitle = isIndo
      ? settings?.metaTitleId ||
        settings?.metaTitleEn ||
        defaultSiteSettings.metaTitleId
      : settings?.metaTitleEn || defaultSiteSettings.metaTitleEn

    const description = isIndo
      ? settings?.metaDescriptionId || settings?.metaDescriptionEn || ''
      : settings?.metaDescriptionEn || ''

    const ogDescription = isIndo
      ? settings?.ogDescriptionId || settings?.ogDescriptionEn || description
      : settings?.ogDescriptionEn || description

    const ogImage = settings?.ogImageUrl || ''
    const favicon = settings?.faviconUrl || '/favicon.ico'

    return {
      meta: [
        {
          charSet: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          title: rawTitle,
        },
        ...(description
          ? [
              {
                name: 'description',
                content: description,
              },
            ]
          : []),
        {
          property: 'og:title',
          content: rawTitle,
        },
        ...(ogDescription
          ? [
              {
                property: 'og:description',
                content: ogDescription,
              },
            ]
          : []),
        {
          property: 'og:type',
          content: 'website',
        },
        ...(ogImage
          ? [
              {
                property: 'og:image',
                content: ogImage,
              },
            ]
          : []),
        {
          name: 'twitter:card',
          content: ogImage ? 'summary_large_image' : 'summary',
        },
        {
          name: 'twitter:title',
          content: rawTitle,
        },
        ...(ogDescription
          ? [
              {
                name: 'twitter:description',
                content: ogDescription,
              },
            ]
          : []),
        ...(ogImage
          ? [
              {
                name: 'twitter:image',
                content: ogImage,
              },
            ]
          : []),
      ],
      links: [
        {
          rel: 'icon',
          href: favicon,
        },
        {
          rel: 'stylesheet',
          href: appCss,
        },
      ],
    }
  },
  shellComponent: RootDocument,
  errorComponent: RootErrorComponent,
})

function RootErrorComponent({ error, reset }: ErrorComponentProps) {
  const router = useRouter()
  const isId = getLocale() === 'id'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="surface-card max-w-md p-8 shadow-lg">
        <div className="mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
          <AlertCircle className="size-7" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-(--brand-ink)">
          {isId ? 'Terjadi Kesalahan' : 'An Unexpected Error Occurred'}
        </h1>
        <p className="mt-2 text-sm text-(--brand-muted)">
          {error.message ||
            (isId
              ? 'Aplikasi mengalami kendala saat memuat data.'
              : 'The application encountered an issue loading data.')}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              reset()
              void router.invalidate()
            }}
            className="inline-flex min-h-10 cursor-pointer items-center rounded-xl bg-(--brand-orange) px-4 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {isId ? 'Coba Lagi' : 'Try Again'}
          </button>
          <Link
            to="/"
            className="inline-flex min-h-10 items-center rounded-xl border border-(--brand-line) bg-(--surface-strong) px-4 text-sm font-semibold text-(--brand-ink) no-underline transition hover:bg-(--surface-muted)"
          >
            {isId ? 'Ke Beranda' : 'Go Home'}
          </Link>
        </div>
      </div>
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const { systemStatus, siteSettings } = Route.useLoaderData()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const { data: settings } = useQuery({
    ...settingsQueryOptions.get(),
    enabled: Boolean(systemStatus.hasOwner),
    initialData: siteSettings,
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
          {settings.maintenanceMode && usesAppChrome && (
            <div className="bg-amber-500 text-slate-950 font-bold px-4 py-2 text-center text-xs border-b border-amber-600 shadow-xs z-50 relative flex items-center justify-center gap-1.5">
              <AlertTriangle className="size-3.5 shrink-0" aria-hidden="true" />
              <span>
                Maintenance Mode Enabled — Site is currently undergoing updates.
              </span>
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
