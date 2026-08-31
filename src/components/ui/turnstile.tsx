import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

import { cn } from '#/lib/utils'

export interface TurnstileWidgetProps {
  siteKey?: string
  action?: string
  cData?: string
  theme?: 'auto' | 'light' | 'dark'
  size?: 'normal' | 'compact' | 'flexible'
  className?: string
  onSuccess?: (token: string) => void
  onError?: (error?: unknown) => void
  onExpire?: () => void
  onLoad?: () => void
}

export interface TurnstileRef {
  reset: () => void
  getResponse: () => string | undefined
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string
          action?: string
          cData?: string
          theme?: 'auto' | 'light' | 'dark'
          size?: 'normal' | 'compact' | 'flexible'
          callback?: (token: string) => void
          'error-callback'?: (error?: unknown) => void
          'expired-callback'?: () => void
        },
      ) => string
      reset: (widgetId?: string) => void
      remove: (widgetId: string) => void
      getResponse: (widgetId?: string) => string | undefined
    }
    __turnstileLoadedCallback?: () => void
  }
}

const TURNSTILE_SCRIPT_URL =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
const DEFAULT_TEST_SITE_KEY = '1x00000000000000000000AA'

let scriptLoadingPromise: Promise<void> | null = null

function loadTurnstileScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve()
  }

  if (window.turnstile) {
    return Promise.resolve()
  }

  if (scriptLoadingPromise) {
    return scriptLoadingPromise
  }

  scriptLoadingPromise = new Promise<void>((resolve, reject) => {
    // Check if script element already exists in document
    const existingScript = document.querySelector(
      `script[src*="challenges.cloudflare.com/turnstile"]`,
    )
    if (existingScript) {
      if (window.turnstile) {
        resolve()
      } else {
        existingScript.addEventListener('load', () => resolve(), { once: true })
        existingScript.addEventListener(
          'error',
          () => reject(new Error('Failed to load Turnstile script')),
          { once: true },
        )
      }
      return
    }

    const script = document.createElement('script')
    script.src = TURNSTILE_SCRIPT_URL
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () =>
      reject(new Error('Failed to load Cloudflare Turnstile script.'))
    document.head.appendChild(script)
  })

  return scriptLoadingPromise
}

export const TurnstileWidget = forwardRef<TurnstileRef, TurnstileWidgetProps>(
  function TurnstileWidget(
    {
      siteKey: propSiteKey,
      action,
      cData,
      theme = 'auto',
      size = 'flexible',
      className,
      onSuccess,
      onError,
      onExpire,
      onLoad,
    },
    ref,
  ) {
    const containerRef = useRef<HTMLDivElement>(null)
    const widgetIdRef = useRef<string | null>(null)

    const effectiveSiteKey =
      propSiteKey ||
      import.meta.env.VITE_TURNSTILE_SITE_KEY ||
      DEFAULT_TEST_SITE_KEY

    // Stable callbacks refs to avoid re-rendering turnstile needlessly
    const onSuccessRef = useRef(onSuccess)
    const onErrorRef = useRef(onError)
    const onExpireRef = useRef(onExpire)
    const onLoadRef = useRef(onLoad)

    useEffect(() => {
      onSuccessRef.current = onSuccess
      onErrorRef.current = onError
      onExpireRef.current = onExpire
      onLoadRef.current = onLoad
    })

    useImperativeHandle(
      ref,
      () => ({
        reset: () => {
          if (
            typeof window !== 'undefined' &&
            window.turnstile &&
            widgetIdRef.current
          ) {
            try {
              window.turnstile.reset(widgetIdRef.current)
            } catch (err) {
              console.error('Error resetting Turnstile widget:', err)
            }
          }
        },
        getResponse: () => {
          if (
            typeof window !== 'undefined' &&
            window.turnstile &&
            widgetIdRef.current
          ) {
            return window.turnstile.getResponse(widgetIdRef.current)
          }
          return undefined
        },
      }),
      [],
    )

    useEffect(() => {
      let isMounted = true

      loadTurnstileScript()
        .then(() => {
          if (!isMounted || !containerRef.current || !window.turnstile) return

          // Clean up old widget if existing
          if (widgetIdRef.current) {
            try {
              window.turnstile.remove(widgetIdRef.current)
            } catch {
              // ignore cleanup error
            }
            widgetIdRef.current = null
          }

          try {
            const id = window.turnstile.render(containerRef.current, {
              sitekey: effectiveSiteKey,
              action,
              cData,
              theme,
              size,
              callback: (token: string) => {
                onSuccessRef.current?.(token)
              },
              'error-callback': (error?: unknown) => {
                onErrorRef.current?.(error)
              },
              'expired-callback': () => {
                onExpireRef.current?.()
              },
            })

            widgetIdRef.current = id
            onLoadRef.current?.()
          } catch (err) {
            console.error('Failed to render Turnstile widget:', err)
            onErrorRef.current?.(err)
          }
        })
        .catch((err) => {
          console.error('Failed to load Turnstile script:', err)
          onErrorRef.current?.(err)
        })

      return () => {
        isMounted = false
        if (
          typeof window !== 'undefined' &&
          window.turnstile &&
          widgetIdRef.current
        ) {
          try {
            window.turnstile.remove(widgetIdRef.current)
          } catch {
            // ignore
          }
          widgetIdRef.current = null
        }
      }
    }, [effectiveSiteKey, action, cData, theme, size])

    return (
      <div
        className={cn(
          'flex min-h-16.25 w-full items-center justify-center overflow-hidden rounded-none',
          className,
        )}
      >
        <div
          ref={containerRef}
          className="w-full min-w-0 rounded-none [&_iframe]:w-full! [&_iframe]:min-w-full [&_iframe]:rounded-none!"
        />
      </div>
    )
  },
)
