import { $fetch, FetchError } from 'ofetch'
import { createIsomorphicFn } from '@tanstack/react-start'

export type ApiResponse<T = unknown> = {
  data?: T
  error?: string
  message?: string
  success?: boolean
}

/**
 * Resolves the application base URL without a trailing slash.
 *
 * Isomorphic behavior:
 * - Server (SSR): Resolves `PUBLIC_APP_URL` strictly from Cloudflare Workers runtime (`cloudflare:workers`).
 *   Throws an explicit error if missing.
 * - Client (Browser): Resolves `VITE_PUBLIC_APP_URL` with fallback to `window.location.origin`.
 *
 * Usage:
 * - On Server (SSR / Server Functions): `const baseUrl = await getBaseUrl()`
 * - On Client (React Components / Hooks): `const baseUrl = getBaseUrl() as string`
 */
export const getBaseUrl = createIsomorphicFn()
  .server(async () => {
    let appUrl: string | undefined

    try {
      const { env } = await import('cloudflare:workers')
      if (env.PUBLIC_APP_URL) {
        appUrl = env.PUBLIC_APP_URL
      }
    } catch {
      // Outside Cloudflare Workers runtime
    }

    if (!appUrl) {
      throw new Error(
        '[api-client] Missing PUBLIC_APP_URL environment variable on server. Please configure PUBLIC_APP_URL in your Cloudflare Workers environment.',
      )
    }

    return appUrl.replace(/\/+$/, '')
  })
  .client(() => {
    const url =
      import.meta.env.VITE_PUBLIC_APP_URL ||
      (typeof window !== 'undefined' ? window.location.origin : '')
    return url.replace(/\/+$/, '')
  })

const getServerCookie = createIsomorphicFn()
  .server(async () => {
    try {
      const { getRequest } = await import('@tanstack/react-start/server')
      const req = getRequest()
      return req.headers.get('cookie') || null
    } catch {
      return null
    }
  })
  .client(() => null)

export const api = $fetch.create({
  retry: 0,
  headers: {
    Accept: 'application/json',
  },
  async onRequest({ request, options }) {
    if (typeof window === 'undefined') {
      if (
        typeof request === 'string' &&
        request.startsWith('/') &&
        !options.baseURL
      ) {
        options.baseURL = await getBaseUrl()
      }

      const cookie = await getServerCookie()
      if (cookie) {
        const headers = new Headers(options.headers)
        if (!headers.has('cookie')) {
          headers.set('cookie', cookie)
        }
        options.headers = headers
      }
    }
  },
})

function isRawFetchErrorMessage(msg: string): boolean {
  if (!msg) return false
  if (/^\[(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\]/i.test(msg)) {
    return true
  }
  if (/^request failed with status code/i.test(msg)) {
    return true
  }
  if (
    msg.startsWith('# SERVER_ERROR') ||
    msg.toLowerCase().includes('internal server error')
  ) {
    return true
  }
  if (msg.includes('<!DOCTYPE') || msg.includes('<html')) {
    return true
  }
  // Detect raw Zod or runtime validation debug errors
  if (
    /^Invalid input: expected/i.test(msg) ||
    /expected .+, received .+/i.test(msg) ||
    /received undefined/i.test(msg)
  ) {
    return true
  }
  return false
}

function extractMessageFromData(data: unknown): string | null {
  if (!data || typeof data !== 'object') {
    return null
  }
  const obj = data as Record<string, unknown>

  if (typeof obj.error === 'string' && obj.error.trim()) {
    const candidate = obj.error.trim()
    if (!isRawFetchErrorMessage(candidate)) return candidate
  } else if (
    obj.error &&
    typeof obj.error === 'object' &&
    typeof (obj.error as Record<string, unknown>).message === 'string'
  ) {
    const candidate = (
      (obj.error as Record<string, unknown>).message as string
    ).trim()
    if (!isRawFetchErrorMessage(candidate)) return candidate
  }

  if (typeof obj.message === 'string' && obj.message.trim()) {
    const candidate = obj.message.trim()
    if (!isRawFetchErrorMessage(candidate)) return candidate
  }

  return null
}

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Terjadi kesalahan pada server.',
): string {
  if (error instanceof FetchError) {
    if (error.data && typeof error.data === 'object') {
      const dataMessage = extractMessageFromData(error.data)
      if (dataMessage && !isRawFetchErrorMessage(dataMessage)) {
        return dataMessage
      }
      return fallback
    }

    // On 500 server errors without safe explicit user message, always use fallback
    if (error.status && error.status >= 500) {
      return fallback
    }

    // Suppress raw ofetch status lines (e.g. "[POST] /url: 500 Internal Server Error")
    if (error.message && !isRawFetchErrorMessage(error.message)) {
      return error.message
    }

    return fallback
  }

  if (error instanceof Error) {
    if (isRawFetchErrorMessage(error.message)) {
      return fallback
    }
    return error.message || fallback
  }

  return fallback
}

export { FetchError }
