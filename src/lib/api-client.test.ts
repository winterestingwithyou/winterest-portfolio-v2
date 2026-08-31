import { FetchError } from 'ofetch'
import { describe, expect, it } from 'vitest'

import { api, getApiErrorMessage } from './api-client'

describe('api-client', () => {
  describe('api instance', () => {
    it('is defined as an ofetch client', () => {
      expect(typeof api).toBe('function')
    })
  })

  describe('getApiErrorMessage', () => {
    it('extracts error string from FetchError response data.error', () => {
      const fetchError = new FetchError('Request failed with status code 400')
      fetchError.data = { error: 'Slug already taken.' }

      const message = getApiErrorMessage(fetchError)
      expect(message).toBe('Slug already taken.')
    })

    it('extracts message string from FetchError response data.message', () => {
      const fetchError = new FetchError('Request failed with status code 400')
      fetchError.data = { message: 'Invalid credentials provided.' }

      const message = getApiErrorMessage(fetchError)
      expect(message).toBe('Invalid credentials provided.')
    })

    it('falls back to FetchError.message when data payload is empty', () => {
      const fetchError = new FetchError('Network timeout occurred')
      fetchError.data = null

      const message = getApiErrorMessage(fetchError)
      expect(message).toBe('Network timeout occurred')
    })

    it('extracts message from a standard Error instance', () => {
      const standardError = new Error('Database connection failed')
      const message = getApiErrorMessage(standardError)
      expect(message).toBe('Database connection failed')
    })

    it('returns custom fallback message when error is an unknown non-error value', () => {
      const customFallback = 'An unexpected error occurred.'
      expect(getApiErrorMessage('string error', customFallback)).toBe(
        customFallback,
      )
      expect(getApiErrorMessage(null, customFallback)).toBe(customFallback)
      expect(getApiErrorMessage(undefined, customFallback)).toBe(customFallback)
      expect(getApiErrorMessage(12345, customFallback)).toBe(customFallback)
    })

    it('returns default Indonesian fallback message when no custom fallback is provided', () => {
      expect(getApiErrorMessage(null)).toBe('Terjadi kesalahan pada server.')
    })
  })
})
