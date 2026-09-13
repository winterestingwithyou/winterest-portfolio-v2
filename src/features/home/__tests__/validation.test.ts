import { describe, expect, it } from 'vitest'

import {
  enthusiasmItemSchema,
  getDefaultHomeConfig,
  homeConfigSchema,
  reorderEnthusiasmsSchema,
} from '../validation'

describe('home validation schemas', () => {
  describe('homeConfigSchema & getDefaultHomeConfig', () => {
    it('validates default home configuration with latest education', () => {
      const defaultConfig = getDefaultHomeConfig()
      const parsed = homeConfigSchema.parse(defaultConfig)

      expect(parsed.heroTitleEn).toBeTruthy()
      expect(parsed.heroTitleId).toBeTruthy()
      expect(parsed.ctaCommand).toBe('bun run build')
      expect(parsed.showEducation).toBe(true)
      expect(parsed.educationUniversity).toBe('Universitas Sriwijaya')
      expect(parsed.educationGpa).toBe('3.98')
      expect(parsed.educationMajorEn).toBe('Information Management')
      expect(parsed.educationMajorId).toBe('Manajemen Informatika')
    })

    it('accepts custom education values and toggles', () => {
      const custom = {
        ...getDefaultHomeConfig(),
        showEducation: false,
        educationUniversity: 'MIT',
        educationMajorEn: 'Computer Science',
        educationMajorId: 'Ilmu Komputer',
        educationGpa: '4.00',
      }
      const parsed = homeConfigSchema.parse(custom)
      expect(parsed.showEducation).toBe(false)
      expect(parsed.educationUniversity).toBe('MIT')
      expect(parsed.educationMajorEn).toBe('Computer Science')
      expect(parsed.educationMajorId).toBe('Ilmu Komputer')
      expect(parsed.educationGpa).toBe('4.00')
    })
  })

  describe('enthusiasmItemSchema', () => {
    it('validates valid enthusiasm item and sets defaults', () => {
      const item = {
        titleEn: 'Backend Development',
        titleId: 'Pengembangan Backend',
        descriptionEn: 'Building scalable microservices',
        descriptionId: 'Membangun arsitektur microservices',
      }
      const parsed = enthusiasmItemSchema.parse(item)
      expect(parsed.icon).toBe('Terminal')
      expect(parsed.isEnabled).toBe(true)
      expect(parsed.sortOrder).toBe(0)
    })

    it('rejects missing required title', () => {
      expect(() =>
        enthusiasmItemSchema.parse({
          icon: 'Terminal',
          titleEn: '',
          titleId: 'Valid',
          descriptionEn: 'Valid',
          descriptionId: 'Valid',
        }),
      ).toThrow()
    })
  })

  describe('reorderEnthusiasmsSchema', () => {
    it('validates array of reordered items', () => {
      const valid = {
        items: [
          { id: 'item-1', sortOrder: 0 },
          { id: 'item-2', sortOrder: 1 },
        ],
      }
      expect(reorderEnthusiasmsSchema.parse(valid)).toEqual(valid)
    })

    it('rejects empty id in reorder', () => {
      expect(() =>
        reorderEnthusiasmsSchema.parse({
          items: [{ id: '', sortOrder: 0 }],
        }),
      ).toThrow()
    })
  })
})
