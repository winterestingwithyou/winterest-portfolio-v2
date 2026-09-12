import { describe, expect, it } from 'vitest'

import {
  enthusiasmItemSchema,
  getDefaultHomeConfig,
  homeConfigSchema,
  reorderEnthusiasmsSchema,
  statItemSchema,
} from '../validation'

describe('home validation schemas', () => {
  describe('homeConfigSchema & getDefaultHomeConfig', () => {
    it('validates default home configuration', () => {
      const defaultConfig = getDefaultHomeConfig()
      const parsed = homeConfigSchema.parse(defaultConfig)

      expect(parsed.heroTitleEn).toBeTruthy()
      expect(parsed.heroTitleId).toBeTruthy()
      expect(parsed.ctaCommand).toBe('bun run build')
      expect(parsed.showStats).toBe(true)
      expect(parsed.stats.length).toBeLessThanOrEqual(4)
    })

    it('rejects stats array with more than 4 items', () => {
      const invalid = {
        ...getDefaultHomeConfig(),
        stats: [
          { labelEn: '1', labelId: '1', value: '1' },
          { labelEn: '2', labelId: '2', value: '2' },
          { labelEn: '3', labelId: '3', value: '3' },
          { labelEn: '4', labelId: '4', value: '4' },
          { labelEn: '5', labelId: '5', value: '5' },
        ],
      }
      expect(() => homeConfigSchema.parse(invalid)).toThrow(
        'Maximum 4 stats items permitted',
      )
    })
  })

  describe('statItemSchema', () => {
    it('accepts valid stat item', () => {
      const valid = {
        labelEn: 'Years Experience',
        labelId: 'Tahun Pengalaman',
        value: '3+',
      }
      expect(statItemSchema.parse(valid)).toEqual(valid)
    })

    it('rejects empty values', () => {
      expect(() =>
        statItemSchema.parse({
          labelEn: '',
          labelId: 'Tahun',
          value: '3+',
        }),
      ).toThrow()
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
