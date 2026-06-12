import { describe, expect, it } from 'vitest'

import { parseTags, serializeTags } from './queries'
import { labEntryInputSchema, writingInputSchema } from './validation'

describe('content validation', () => {
  it('normalizes comma-separated tags for writing input', () => {
    const input = writingInputSchema.parse({
      slug: 'edge-notes',
      title: 'Edge notes',
      summary: 'Notes about an edge-first portfolio.',
      tags: 'Cloudflare, Workers, Cloudflare',
    })

    expect(input.tags).toEqual(['Cloudflare', 'Workers', 'Cloudflare'])
    expect(parseTags(serializeTags(input.tags))).toEqual([
      'Cloudflare',
      'Workers',
    ])
  })

  it('accepts lab-specific links', () => {
    const input = labEntryInputSchema.parse({
      slug: 'tiny-demo',
      title: 'Tiny demo',
      summary: 'A small lab demo with useful links.',
      demoUrl: 'https://winterest.tech/lab/tiny-demo',
      repoUrl: 'https://github.com/winterest/winterest-portfolio-v2',
    })

    expect(input.demoUrl).toBe('https://winterest.tech/lab/tiny-demo')
    expect(input.repoUrl).toContain('github.com')
  })
})
