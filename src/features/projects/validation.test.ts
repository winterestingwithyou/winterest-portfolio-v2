import { describe, expect, it } from 'vitest'

import { projectInputSchema } from './validation'

describe('projectInputSchema', () => {
  const baseValidProject = {
    slug: 'my-awesome-project',
    status: 'draft' as const,
    visibility: 'public' as const,
    repoVisibility: 'public' as const,
    featured: false,
    translations: {
      en: {
        title: 'My Awesome Project',
        summary: 'A short English summary for the project.',
        category: 'Project',
      },
      id: {
        title: 'Project Keren Saya',
        summary: 'Ringkasan singkat bahasa Indonesia untuk project.',
        category: 'Project',
      },
    },
  }

  it('accepts full absolute HTTP URLs (localhost / dev)', () => {
    const localUrl =
      'http://localhost:3000/api/media/file/projects/1787766478212-3b2e374d-screenshot.jpg'
    const result = projectInputSchema.safeParse({
      ...baseValidProject,
      coverImage: localUrl,
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.coverImage).toBe(localUrl)
    }
  })

  it('accepts full absolute HTTPS URLs (production / CDN)', () => {
    const prodUrl =
      'https://winterest.tech/api/media/file/projects/1787766478212-3b2e374d-screenshot.jpg'
    const result = projectInputSchema.safeParse({
      ...baseValidProject,
      coverImage: prodUrl,
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.coverImage).toBe(prodUrl)
    }
  })

  it('accepts absolute HTTP/HTTPS URLs for coverImage', () => {
    const httpsUrl = 'https://images.unsplash.com/photo-123'
    const result = projectInputSchema.safeParse({
      ...baseValidProject,
      coverImage: httpsUrl,
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.coverImage).toBe(httpsUrl)
    }
  })

  it('converts empty string coverImage to undefined', () => {
    const result = projectInputSchema.safeParse({
      ...baseValidProject,
      coverImage: '   ',
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.coverImage).toBeUndefined()
    }
  })

  it('rejects relative path strings (strictly requires full absolute URL)', () => {
    const result = projectInputSchema.safeParse({
      ...baseValidProject,
      coverImage: '/api/media/file/projects/screenshot.jpg',
    })

    expect(result.success).toBe(false)
  })

  it('rejects invalid non-URL coverImage strings', () => {
    const result = projectInputSchema.safeParse({
      ...baseValidProject,
      coverImage: 'not-a-valid-url',
    })

    expect(result.success).toBe(false)
  })
})
