import { describe, expect, it } from 'vitest'

import {
  ALL_SEED_COLLECTIONS,
  formatSeedSummary,
  resolveSeedDependencies,
  SEED_COLLECTION_OPTIONS,
} from '../seed-helpers'

describe('seed CLI helpers', () => {
  describe('SEED_COLLECTION_OPTIONS & ALL_SEED_COLLECTIONS', () => {
    it('contains all 5 supported seed collections', () => {
      expect(ALL_SEED_COLLECTIONS).toEqual([
        'categories',
        'technologies',
        'projects',
        'socialLinks',
        'homeEnthusiasms',
      ])
      expect(SEED_COLLECTION_OPTIONS).toHaveLength(5)
    })
  })

  describe('resolveSeedDependencies', () => {
    it('returns same collections when all are selected without additions', () => {
      const { resolved, autoAdded } = resolveSeedDependencies([
        'categories',
        'technologies',
        'projects',
        'socialLinks',
        'homeEnthusiasms',
      ])

      expect(resolved).toEqual(ALL_SEED_COLLECTIONS)
      expect(autoAdded).toEqual([])
    })

    it('auto-adds technologies and categories when only projects is selected', () => {
      const { resolved, autoAdded } = resolveSeedDependencies(['projects'])

      expect(autoAdded).toContain('technologies')
      expect(autoAdded).toContain('categories')
      expect(resolved).toEqual(['categories', 'technologies', 'projects'])
    })

    it('auto-adds categories when only technologies is selected', () => {
      const { resolved, autoAdded } = resolveSeedDependencies(['technologies'])

      expect(autoAdded).toEqual(['categories'])
      expect(resolved).toEqual(['categories', 'technologies'])
    })

    it('does not add dependencies for independent collections like socialLinks and homeEnthusiasms', () => {
      const { resolved, autoAdded } = resolveSeedDependencies([
        'socialLinks',
        'homeEnthusiasms',
      ])

      expect(autoAdded).toEqual([])
      expect(resolved).toEqual(['socialLinks', 'homeEnthusiasms'])
    })

    it('preserves topological order regardless of input order', () => {
      const { resolved } = resolveSeedDependencies([
        'homeEnthusiasms',
        'categories',
        'socialLinks',
      ])

      expect(resolved).toEqual(['categories', 'socialLinks', 'homeEnthusiasms'])
    })
  })

  describe('formatSeedSummary', () => {
    it('formats summary for local target with all collections', () => {
      const summary = formatSeedSummary('local', ALL_SEED_COLLECTIONS, [])

      expect(summary).toContain('Target: Local D1')
      expect(summary).toContain('Total Entitas: 5 dari 5')
      expect(summary).toContain('Kategori Teknologi')
      expect(summary).toContain('Tech Stack & Tools')
      expect(summary).toContain('Proyek Portofolio')
      expect(summary).toContain('Tautan Sosial')
      expect(summary).toContain('Bidang Minat Beranda')
    })

    it('formats summary for remote target with auto-added indicator', () => {
      const summary = formatSeedSummary(
        'remote',
        ['categories', 'technologies', 'projects'],
        ['categories', 'technologies'],
      )

      expect(summary).toContain('Target: Remote D1')
      expect(summary).toContain('Total Entitas: 3 dari 5')
      expect(summary).toContain('[Otomatis disertakan]')
    })
  })
})
