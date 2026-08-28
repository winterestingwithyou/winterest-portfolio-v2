import { describe, expect, it } from 'vitest'

import { isMissingTableError } from './db-utils'
import { formatBytes, formatDate, slugify } from './utils'

describe('utility functions', () => {
  describe('slugify', () => {
    it('converts strings into clean URL slugs', () => {
      expect(slugify('Next.js & Cloudflare Workers')).toBe('nextjs-cloudflare-workers')
      expect(slugify('  Hello World!  ')).toBe('hello-world')
      expect(slugify('React 19 & TypeScript')).toBe('react-19-typescript')
      expect(slugify('---leading-trailing---')).toBe('leading-trailing')
    })
  })

  describe('formatDate', () => {
    it('formats valid dates correctly', () => {
      const date = new Date('2026-08-28T00:00:00.000Z')
      const formatted = formatDate(date)
      expect(formatted).toContain('2026')
    })

    it('returns fallback for null or undefined', () => {
      expect(formatDate(null)).toBe('-')
      expect(formatDate(undefined)).toBe('-')
    })

    it('returns fallback for invalid dates', () => {
      expect(formatDate('invalid-date')).toBe('-')
    })
  })

  describe('formatBytes', () => {
    it('formats byte sizes to human-readable strings', () => {
      expect(formatBytes(0)).toBe('0 B')
      expect(formatBytes(1024)).toBe('1 KB')
      expect(formatBytes(1024 * 1024)).toBe('1 MB')
      expect(formatBytes(1536 * 1024)).toBe('1.5 MB')
    })
  })

  describe('isMissingTableError', () => {
    it('returns true when error message contains no such table', () => {
      expect(isMissingTableError(new Error('D1_ERROR: no such table: projects'))).toBe(true)
    })

    it('returns false for other errors', () => {
      expect(isMissingTableError(new Error('Connection timeout'))).toBe(false)
      expect(isMissingTableError('string error')).toBe(false)
      expect(isMissingTableError(null)).toBe(false)
    })
  })
})
