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

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Terjadi kesalahan pada server.',
): string {
  if (error instanceof FetchError) {
    const data = error.data as ApiResponse<unknown> | undefined
    return data?.error || data?.message || error.message || fallback
  }
  if (error instanceof Error) {
    return error.message
  }
  return fallback
}

export { FetchError }
