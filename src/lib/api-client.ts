import { $fetch, FetchError } from 'ofetch'

export type ApiResponse<T = unknown> = {
  data?: T
  error?: string
  message?: string
  success?: boolean
}

export const api = $fetch.create({
  retry: 0,
  headers: {
    Accept: 'application/json',
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
