import { describe, expect, it } from 'vitest'

import { parseTags, serializeTags } from './queries'
import { labEntryInputSchema, writingInputSchema } from './validation'

describe('content validation', () => {
  it('normalizes comma-separated tags for writing input', () => {
    const input = writingInputSchema.parse({
      slug: 'edge-notes',
      translations: {
        en: {
          title: 'Edge notes',
          summary: 'Notes about an edge-first portfolio.',
          tags: 'Cloudflare, Workers, Cloudflare',
        },
        id: {
          title: 'Catatan edge',
          summary: 'Catatan tentang portfolio yang ramah edge.',
          tags: 'Cloudflare, Workers, Edge',
        },
      },
    })

    expect(input.translations.en.tags).toEqual([
      'Cloudflare',
      'Workers',
      'Cloudflare',
    ])
    expect(parseTags(serializeTags(input.translations.en.tags))).toEqual([
      'Cloudflare',
      'Workers',
    ])
  })

  it('accepts lab-specific links', () => {
    const input = labEntryInputSchema.parse({
      slug: 'tiny-demo',
      translations: {
        en: {
          title: 'Tiny demo',
          summary: 'A small lab demo with useful links.',
          tags: 'Demo, UI',
        },
        id: {
          title: 'Demo kecil',
          summary: 'Demo lab kecil dengan link yang berguna.',
          tags: 'Demo, UI',
        },
      },
      demoUrl: 'https://winterest.tech/lab/tiny-demo',
      repoUrl: 'https://github.com/winterest/winterest-portfolio-v2',
    })

    expect(input.demoUrl).toBe('https://winterest.tech/lab/tiny-demo')
    expect(input.repoUrl).toContain('github.com')
  })
})
