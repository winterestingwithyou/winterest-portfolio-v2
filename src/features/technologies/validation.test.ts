import { describe, expect, it } from 'vitest'

import {
  categoryInputSchema,
  categorySchema,
  technologyInputSchema,
  technologySchema,
} from './validation'

describe('technologies validation', () => {
  describe('categorySchema & categoryInputSchema', () => {
    it('accepts valid category input', () => {
      const result = categoryInputSchema.safeParse({
        name: 'Backend Frameworks',
        slug: 'backend-frameworks',
        sortOrder: 2,
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('Backend Frameworks')
        expect(result.data.slug).toBe('backend-frameworks')
        expect(result.data.sortOrder).toBe(2)
      }
    })

    it('defaults sortOrder to 0 in input schema when omitted', () => {
      const result = categoryInputSchema.safeParse({
        name: 'DevOps',
        slug: 'devops',
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.sortOrder).toBe(0)
      }
    })

    it('validates form categorySchema with explicit number', () => {
      const result = categorySchema.safeParse({
        name: 'Databases',
        slug: 'databases',
        sortOrder: 1,
      })
      expect(result.success).toBe(true)
    })

    it('rejects empty category name', () => {
      const result = categoryInputSchema.safeParse({
        name: '   ',
        slug: 'frontend',
      })

      expect(result.success).toBe(false)
    })

    it('rejects invalid category slugs with spaces or uppercase characters', () => {
      const spaceResult = categoryInputSchema.safeParse({
        name: 'Databases',
        slug: 'data bases',
      })
      expect(spaceResult.success).toBe(false)

      const upperResult = categoryInputSchema.safeParse({
        name: 'Databases',
        slug: 'DataBases',
      })
      expect(upperResult.success).toBe(false)
    })
  })

  describe('technologySchema & technologyInputSchema', () => {
    it('accepts valid technology with full fields', () => {
      const result = technologyInputSchema.safeParse({
        name: 'Cloudflare Workers',
        slug: 'cloudflare-workers',
        icon: 'cloudflare',
        color: '#f38020',
        url: 'https://workers.cloudflare.com',
        isUltimate: true,
        categoryIds: ['cat-1', 'cat-2'],
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('Cloudflare Workers')
        expect(result.data.slug).toBe('cloudflare-workers')
        expect(result.data.isUltimate).toBe(true)
        expect(result.data.categoryIds).toEqual(['cat-1', 'cat-2'])
      }
    })

    it('validates form technologySchema with full fields', () => {
      const result = technologySchema.safeParse({
        name: 'React 19',
        slug: 'react-19',
        icon: 'react',
        color: '#61dafb',
        url: 'https://react.dev',
        isUltimate: true,
        categoryIds: ['cat-frontend'],
      })

      expect(result.success).toBe(true)
    })

    it('defaults optional fields in input schema to null / defaults', () => {
      const result = technologyInputSchema.safeParse({
        name: 'Bun',
        slug: 'bun',
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.icon).toBe(null)
        expect(result.data.color).toBe(null)
        expect(result.data.url).toBe(null)
        expect(result.data.isUltimate).toBe(false)
        expect(result.data.categoryIds).toEqual([])
      }
    })

    it('accepts explicit null for optional fields (icon, color, url)', () => {
      const result = technologyInputSchema.safeParse({
        name: 'Node.js',
        slug: 'nodejs',
        icon: null,
        color: null,
        url: null,
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.icon).toBe(null)
        expect(result.data.color).toBe(null)
        expect(result.data.url).toBe(null)
      }
    })

    it('accepts empty URL string and normalizes to null', () => {
      const result = technologyInputSchema.safeParse({
        name: 'TypeScript',
        slug: 'typescript',
        url: '',
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.url).toBe(null)
      }
    })

    it('rejects malformed URL format when provided', () => {
      const result = technologyInputSchema.safeParse({
        name: 'React',
        slug: 'react',
        url: 'not-a-valid-url',
      })

      expect(result.success).toBe(false)
    })

    it('rejects invalid technology slug with special characters', () => {
      const result = technologyInputSchema.safeParse({
        name: 'C++',
        slug: 'c++',
      })

      expect(result.success).toBe(false)
    })
  })
})
