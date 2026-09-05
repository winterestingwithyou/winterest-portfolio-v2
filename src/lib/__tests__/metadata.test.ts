import { describe, expect, it } from 'vitest'

import { defaultSiteSettings } from '#/features/settings/types'
import {
  createRouteMeta,
  formatMetaTitle,
  getRootSiteSettings,
} from '../metadata'

describe('formatMetaTitle', () => {
  it('formats title using default template (%s | Winterest)', () => {
    expect(formatMetaTitle('About', '%s | Winterest')).toBe('About | Winterest')
    expect(formatMetaTitle('Projects', '%s | Winterest')).toBe(
      'Projects | Winterest',
    )
  })

  it('formats title using custom template', () => {
    expect(formatMetaTitle('About', '%s — Winterest Portfolio')).toBe(
      'About — Winterest Portfolio',
    )
    expect(formatMetaTitle('Contact', 'Winterest » %s')).toBe(
      'Winterest » Contact',
    )
  })

  it('handles templates without %s gracefully', () => {
    expect(formatMetaTitle('About', 'Winterest Platform')).toBe(
      'About | Winterest Platform',
    )
  })

  it('falls back to default fallback when title is missing or empty', () => {
    expect(formatMetaTitle('', '%s | Winterest')).toBe('Winterest')
    expect(formatMetaTitle(null, '%s | Winterest')).toBe('Winterest')
    expect(
      formatMetaTitle(undefined, '%s | Winterest', 'Custom Fallback'),
    ).toBe('Custom Fallback')
  })

  it('avoids double-branding if pageTitle already ends with template branding suffix', () => {
    expect(formatMetaTitle('About | Winterest', '%s | Winterest')).toBe(
      'About | Winterest',
    )
    expect(
      formatMetaTitle(
        'Projects — Winterest Portfolio',
        '%s — Winterest Portfolio',
      ),
    ).toBe('Projects — Winterest Portfolio')
  })

  it('avoids double-branding if pageTitle is identical to fallback', () => {
    expect(formatMetaTitle('Winterest', '%s | Winterest', 'Winterest')).toBe(
      'Winterest',
    )
  })
})

describe('getRootSiteSettings', () => {
  it('returns defaultSiteSettings when matches is undefined or empty', () => {
    expect(getRootSiteSettings(undefined)).toEqual(defaultSiteSettings)
    expect(getRootSiteSettings([])).toEqual(defaultSiteSettings)
  })

  it('extracts siteSettings from root match loaderData with routeId __root__', () => {
    const mockMatches = [
      {
        routeId: '__root__',
        id: '__root__',
        loaderData: {
          siteSettings: {
            ...defaultSiteSettings,
            siteName: 'Custom Site',
            metaTitleTemplate: '%s — Custom Site',
          },
        },
      },
    ] as any

    const settings = getRootSiteSettings(mockMatches)
    expect(settings.siteName).toBe('Custom Site')
    expect(settings.metaTitleTemplate).toBe('%s — Custom Site')
  })

  it('extracts siteSettings when falling back to matches[0]', () => {
    const mockMatches = [
      {
        loaderData: {
          siteSettings: {
            ...defaultSiteSettings,
            siteName: 'First Match Site',
            metaTitleTemplate: '%s | First Match',
          },
        },
      },
    ] as any

    const settings = getRootSiteSettings(mockMatches)
    expect(settings.siteName).toBe('First Match Site')
    expect(settings.metaTitleTemplate).toBe('%s | First Match')
  })
})

describe('createRouteMeta', () => {
  it('renders homepage title directly without template formatting when isHome is true', () => {
    const mockMatches = [
      {
        routeId: '__root__',
        loaderData: {
          siteSettings: {
            ...defaultSiteSettings,
            metaTitleEn: 'Winterest Portfolio',
            metaTitleTemplate: '%s | Winterest',
          },
        },
      },
    ] as any

    const result = createRouteMeta({
      matches: mockMatches,
      isHome: true,
      locale: 'en',
    })

    const titleMeta = result.meta.find((m) => 'title' in m)
    const ogTitle = result.meta.find((m) => m.property === 'og:title')
    const twitterTitle = result.meta.find((m) => m.name === 'twitter:title')

    expect(titleMeta?.title).toBe('Winterest Portfolio')
    expect(ogTitle?.content).toBe('Winterest Portfolio')
    expect(twitterTitle?.content).toBe('Winterest Portfolio')
  })

  it('formats child page title using metaTitleTemplate when isHome is false', () => {
    const mockMatches = [
      {
        routeId: '__root__',
        loaderData: {
          siteSettings: {
            ...defaultSiteSettings,
            metaTitleTemplate: '%s — Winterest Tech',
          },
        },
      },
    ] as any

    const result = createRouteMeta({
      matches: mockMatches,
      title: 'About Me',
      description: 'Personal journey and background.',
      locale: 'en',
    })

    const titleMeta = result.meta.find((m) => 'title' in m)
    const descMeta = result.meta.find((m) => m.name === 'description')
    const ogTitle = result.meta.find((m) => m.property === 'og:title')

    expect(titleMeta?.title).toBe('About Me — Winterest Tech')
    expect(ogTitle?.content).toBe('About Me — Winterest Tech')
    expect(descMeta?.content).toBe('Personal journey and background.')
  })

  it('configures twitter:card as summary_large_image when ogImage is present', () => {
    const resultWithImage = createRouteMeta({
      title: 'My Project',
      ogImage: 'https://example.com/cover.png',
    })

    const twitterCardWithImage = resultWithImage.meta.find(
      (m) => m.name === 'twitter:card',
    )
    const ogImage = resultWithImage.meta.find((m) => m.property === 'og:image')

    expect(twitterCardWithImage?.content).toBe('summary_large_image')
    expect(ogImage?.content).toBe('https://example.com/cover.png')

    const resultWithoutImage = createRouteMeta({
      title: 'No Image Page',
    })
    const twitterCardWithoutImage = resultWithoutImage.meta.find(
      (m) => m.name === 'twitter:card',
    )
    expect(twitterCardWithoutImage?.content).toBe('summary')
  })
})
