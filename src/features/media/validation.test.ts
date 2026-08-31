import { describe, expect, it } from 'vitest'

import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
  mediaQuerySchema,
  mediaUploadSchema,
} from './validation'

describe('media validation', () => {
  describe('constants', () => {
    it('defines the correct max file size of 10MB', () => {
      expect(MAX_FILE_SIZE_BYTES).toBe(10 * 1024 * 1024)
    })

    it('contains expected standard image mime types', () => {
      expect(ALLOWED_MIME_TYPES).toContain('image/jpeg')
      expect(ALLOWED_MIME_TYPES).toContain('image/png')
      expect(ALLOWED_MIME_TYPES).toContain('image/webp')
      expect(ALLOWED_MIME_TYPES).toContain('image/gif')
      expect(ALLOWED_MIME_TYPES).toContain('image/svg+xml')
      expect(ALLOWED_MIME_TYPES).toContain('image/avif')
    })
  })

  describe('mediaUploadSchema', () => {
    it('accepts valid alt text', () => {
      const result = mediaUploadSchema.safeParse({
        alt: 'A screenshot of the dashboard interface',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.alt).toBe('A screenshot of the dashboard interface')
      }
    })

    it('trims whitespace on alt text', () => {
      const result = mediaUploadSchema.safeParse({
        alt: '  Trimmed Alt Text  ',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.alt).toBe('Trimmed Alt Text')
      }
    })

    it('accepts empty or undefined alt text', () => {
      const result = mediaUploadSchema.safeParse({})
      expect(result.success).toBe(true)
    })

    it('rejects alt text exceeding 200 characters', () => {
      const result = mediaUploadSchema.safeParse({
        alt: 'a'.repeat(201),
      })
      expect(result.success).toBe(false)
    })
  })

  describe('mediaQuerySchema', () => {
    it('defaults limit to 50 when not provided', () => {
      const result = mediaQuerySchema.safeParse({})
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.limit).toBe(50)
      }
    })

    it('coerces string limit into a number', () => {
      const result = mediaQuerySchema.safeParse({
        limit: '25',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.limit).toBe(25)
      }
    })

    it('trims search query', () => {
      const result = mediaQuerySchema.safeParse({
        search: '  hero image  ',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.search).toBe('hero image')
      }
    })

    it('rejects limit below 1 or above 100', () => {
      const minResult = mediaQuerySchema.safeParse({ limit: 0 })
      expect(minResult.success).toBe(false)

      const maxResult = mediaQuerySchema.safeParse({ limit: 101 })
      expect(maxResult.success).toBe(false)
    })
  })
})
