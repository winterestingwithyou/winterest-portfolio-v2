import { describe, expect, it } from 'vitest'

import { resolveActiveCv, siteSettingsSchema } from '../types'

describe('site settings & CV resolution', () => {
  describe('resolveActiveCv', () => {
    it('returns null when settings is null or undefined', () => {
      expect(resolveActiveCv('en', null)).toBeNull()
      expect(resolveActiveCv('id', undefined)).toBeNull()
    })

    it('returns null when both cvEnUrl and cvIdUrl are empty', () => {
      expect(resolveActiveCv('en', { cvEnUrl: '', cvIdUrl: '' })).toBeNull()
      expect(resolveActiveCv('id', { cvEnUrl: '  ', cvIdUrl: '' })).toBeNull()
    })

    it('resolves English CV for "en" locale when both are available', () => {
      const settings = {
        cvEnUrl: 'https://example.com/cv-en.pdf',
        cvIdUrl: 'https://example.com/cv-id.pdf',
      }
      expect(resolveActiveCv('en', settings)).toBe(
        'https://example.com/cv-en.pdf',
      )
    })

    it('resolves Indonesian CV for "id" locale when both are available', () => {
      const settings = {
        cvEnUrl: 'https://example.com/cv-en.pdf',
        cvIdUrl: 'https://example.com/cv-id.pdf',
      }
      expect(resolveActiveCv('id', settings)).toBe(
        'https://example.com/cv-id.pdf',
      )
    })

    it('gracefully falls back to English CV when user is on "id" locale but only English is uploaded', () => {
      const settings = {
        cvEnUrl: 'https://example.com/cv-en.pdf',
        cvIdUrl: '',
      }
      expect(resolveActiveCv('id', settings)).toBe(
        'https://example.com/cv-en.pdf',
      )
    })

    it('gracefully falls back to Indonesian CV when user is on "en" locale but only Indonesian is uploaded', () => {
      const settings = {
        cvEnUrl: '',
        cvIdUrl: 'https://example.com/cv-id.pdf',
      }
      expect(resolveActiveCv('en', settings)).toBe(
        'https://example.com/cv-id.pdf',
      )
    })
  })

  describe('siteSettingsSchema validation', () => {
    it('validates settings with optional cvEnUrl and cvIdUrl', () => {
      const valid = {
        siteName: 'Winterest',
        siteTagline: 'Personal Platform',
        siteDescription: 'Developer portfolio',
        defaultLocale: 'en' as const,
        publicEmail: 'test@example.com',
        metaTitleEn: 'Title EN',
        metaTitleId: 'Title ID',
        metaDescriptionEn: 'Desc EN',
        metaDescriptionId: 'Desc ID',
        ogDescriptionEn: '',
        ogDescriptionId: '',
        metaTitleTemplate: '%s | Winterest',
        faviconUrl: '',
        ogImageUrl: '',
        heroVisualUrl: '',
        cvEnUrl: 'https://example.com/cv-en.pdf',
        cvIdUrl: 'https://example.com/cv-id.pdf',
        maintenanceMode: false,
      }

      const result = siteSettingsSchema.safeParse(valid)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.cvEnUrl).toBe('https://example.com/cv-en.pdf')
        expect(result.data.cvIdUrl).toBe('https://example.com/cv-id.pdf')
      }
    })
  })
})
