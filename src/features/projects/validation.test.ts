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

  it('accepts relative media URLs for coverImage (R2 object storage paths)', () => {
    const relativeUrl =
      '/api/media/file/projects/1787766478212-3b2e374d-screenshot-20260825-202903.jpg'
    const result = projectInputSchema.safeParse({
      ...baseValidProject,
      coverImage: relativeUrl,
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.coverImage).toBe(relativeUrl)
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

  it('rejects invalid non-path and non-URL coverImage strings', () => {
    const result = projectInputSchema.safeParse({
      ...baseValidProject,
      coverImage: 'ftp://not-supported',
    })

    expect(result.success).toBe(false)
  })
})
