import { describe, expect, it } from 'vitest'

import {
  contactPageConfigSchema,
  getDefaultContactPageConfig,
  getDefaultProjectsPageConfig,
  getDefaultStackPageConfig,
  projectsPageConfigSchema,
  publicPageKeys,
  stackPageConfigSchema,
} from '../page-content-schemas'

describe('page-content-schemas', () => {
  it('defines valid publicPageKeys', () => {
    expect(publicPageKeys).toEqual(['projects', 'stack', 'contact'])
  })

  describe('projectsPageConfigSchema', () => {
    it('validates default projects page config', () => {
      const defaultConfig = getDefaultProjectsPageConfig()
      const parsed = projectsPageConfigSchema.parse(defaultConfig)

      expect(parsed.titleEn).toBeTruthy()
      expect(parsed.titleId).toBeTruthy()
      expect(parsed.showDescription).toBe(true)
    })

    it('fails when required title is empty', () => {
      const invalid = {
        titleEn: '',
        titleId: 'Proyek',
      }
      expect(() => projectsPageConfigSchema.parse(invalid)).toThrow()
    })
  })

  describe('stackPageConfigSchema', () => {
    it('validates default stack page config', () => {
      const defaultConfig = getDefaultStackPageConfig()
      const parsed = stackPageConfigSchema.parse(defaultConfig)

      expect(parsed.titleEn).toBeTruthy()
      expect(parsed.titleId).toBeTruthy()
      expect(parsed.ultimateTitleEn).toBeTruthy()
      expect(parsed.ultimateTitleId).toBeTruthy()
      expect(parsed.showDescription).toBe(true)
      expect(parsed.showUltimateDescription).toBe(true)
    })

    it('fails when ultimate title is missing', () => {
      const invalid = {
        titleEn: 'Tech Stack',
        titleId: 'Tech Stack',
        ultimateTitleEn: '',
        ultimateTitleId: 'Utama',
      }
      expect(() => stackPageConfigSchema.parse(invalid)).toThrow()
    })
  })

  describe('contactPageConfigSchema', () => {
    it('validates default contact page config', () => {
      const defaultConfig = getDefaultContactPageConfig()
      const parsed = contactPageConfigSchema.parse(defaultConfig)

      expect(parsed.titleEn).toBeTruthy()
      expect(parsed.titleId).toBeTruthy()
      expect(parsed.directTitleEn).toBeTruthy()
      expect(parsed.formTitleEn).toBeTruthy()
      expect(parsed.showDescription).toBe(true)
    })

    it('fails when title is empty', () => {
      const invalid = {
        titleEn: '',
        titleId: 'Kontak',
      }
      expect(() => contactPageConfigSchema.parse(invalid)).toThrow()
    })
  })
})
