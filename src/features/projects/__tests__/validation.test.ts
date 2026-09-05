import { describe, expect, it } from 'vitest'

import { getProjectFormSchema, projectInputSchema } from '../validation'

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

describe('projectInputSchema', () => {
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

describe('getProjectFormSchema', () => {
  const validFormPayload = {
    slug: 'analytics-dashboard',
    status: 'published' as const,
    visibility: 'public' as const,
    repoVisibility: 'public' as const,
    featured: true,
    coverImage: 'https://example.com/cover.jpg',
    repoUrl: 'https://github.com/example/repo',
    demoUrl: 'https://example.com/demo',
    productionUrl: 'https://example.com',
    startedAt: '2024-01-01',
    completedAt: '2024-02-01',
    publishedAt: '2024-02-02',
    technologyIds: ['tech-1', 'tech-2'],
    translations: {
      en: {
        title: 'Analytics Dashboard',
        summary: 'A fast analytics dashboard built with modern tech.',
        description: 'Comprehensive markdown description.',
        category: 'Fullstack App',
      },
      id: {
        title: 'Dashboard Analitik',
        summary: 'Dashboard analitik cepat dibuat dengan teknologi modern.',
        description: 'Deskripsi lengkap dalam format markdown.',
        category: 'Aplikasi Fullstack',
      },
    },
  }

  it('validates a complete and correct form payload', () => {
    const schema = getProjectFormSchema('id')
    const result = schema.safeParse(validFormPayload)
    expect(result.success).toBe(true)
  })

  it('returns Indonesian error messages when locale is id', () => {
    const schema = getProjectFormSchema('id')
    const result = schema.safeParse({
      ...validFormPayload,
      slug: '',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      const slugError = result.error.issues.find(
        (issue) => issue.path[0] === 'slug',
      )
      expect(slugError?.message).toBe('Slug wajib diisi.')
    }
  })

  it('returns English error messages when locale is en', () => {
    const schema = getProjectFormSchema('en')
    const result = schema.safeParse({
      ...validFormPayload,
      slug: '',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      const slugError = result.error.issues.find(
        (issue) => issue.path[0] === 'slug',
      )
      expect(slugError?.message).toBe('Slug is required.')
    }
  })

  it('validates slug regex with localized message', () => {
    const idSchema = getProjectFormSchema('id')
    const idResult = idSchema.safeParse({
      ...validFormPayload,
      slug: 'Invalid Slug With Spaces!',
    })
    expect(idResult.success).toBe(false)
    if (!idResult.success) {
      const slugError = idResult.error.issues.find(
        (issue) => issue.path[0] === 'slug',
      )
      expect(slugError?.message).toBe(
        'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-).',
      )
    }

    const enSchema = getProjectFormSchema('en')
    const enResult = enSchema.safeParse({
      ...validFormPayload,
      slug: 'Invalid Slug!',
    })
    expect(enResult.success).toBe(false)
    if (!enResult.success) {
      const slugError = enResult.error.issues.find(
        (issue) => issue.path[0] === 'slug',
      )
      expect(slugError?.message).toBe(
        'Slug may only contain lowercase letters, numbers, and hyphens (-).',
      )
    }
  })

  it('accepts in_progress status in schema and form validation', () => {
    const inputResult = projectInputSchema.safeParse({
      ...baseValidProject,
      status: 'in_progress',
    })
    expect(inputResult.success).toBe(true)

    const formResult = getProjectFormSchema('en').safeParse({
      ...validFormPayload,
      status: 'in_progress',
      completedAt: '',
    })
    expect(formResult.success).toBe(true)
  })
})
