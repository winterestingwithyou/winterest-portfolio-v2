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

    it('falls back to FetchError.message when data payload is empty and message is clean', () => {
      const fetchError = new FetchError('Network timeout occurred')
      fetchError.data = null

      const message = getApiErrorMessage(fetchError)
      expect(message).toBe('Network timeout occurred')
    })

    it('suppresses raw ofetch HTTP debug lines and returns fallback', () => {
      const fetchError = new FetchError(
        '[POST] "/api/auth/sign-in/email": 500 Internal Server Error',
      )
      fetchError.status = 500
      fetchError.data = null

      const message = getApiErrorMessage(fetchError, 'Gagal masuk akun.')
      expect(message).toBe('Gagal masuk akun.')
    })

    it('extracts nested error.message object from response data', () => {
      const fetchError = new FetchError('Request failed with status code 400')
      fetchError.data = { error: { message: 'Kata sandi tidak sesuai.' } }

      const message = getApiErrorMessage(fetchError)
      expect(message).toBe('Kata sandi tidak sesuai.')
    })

    it('suppresses server-side crash traces like # SERVER_ERROR and returns fallback', () => {
      const fetchError = new FetchError(
        '[POST] "/api/auth/sign-in/email": 500 Internal Server Error',
      )
      fetchError.status = 500
      fetchError.data = {
        message:
          '# SERVER_ERROR: NotSupportedError: Pbkdf2 failed: iteration counts above 100000 are not supported (requested 120000).',
      }

      const message = getApiErrorMessage(fetchError, 'Gagal masuk akun.')
      expect(message).toBe('Gagal masuk akun.')
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
