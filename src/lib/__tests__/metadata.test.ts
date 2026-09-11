import { describe, expect, it } from 'vitest'

import { defaultSiteSettings } from '#/features/settings/types'
import {
  DEFAULT_OG_IMAGE_HEIGHT,
  DEFAULT_OG_IMAGE_PATH,
  DEFAULT_OG_IMAGE_WIDTH,
  createRouteMeta,
  formatMetaTitle,
  getRootSiteSettings,
  inferImageMimeType,
  toAbsoluteUrl,
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

describe('toAbsoluteUrl', () => {
  it('returns empty string for undefined, null, or whitespace-only input', () => {
    expect(toAbsoluteUrl(undefined)).toBe('')
    expect(toAbsoluteUrl(null)).toBe('')
    expect(toAbsoluteUrl('')).toBe('')
    expect(toAbsoluteUrl('   ')).toBe('')
  })

  it('preserves absolute URLs with https or http protocol', () => {
    expect(toAbsoluteUrl('https://example.com/cover.png')).toBe(
      'https://example.com/cover.png',
    )
    expect(toAbsoluteUrl('http://example.com/image.jpg')).toBe(
      'http://example.com/image.jpg',
    )
  })

  it('converts protocol-relative URLs to https', () => {
    expect(toAbsoluteUrl('//cdn.example.com/asset.png')).toBe(
      'https://cdn.example.com/asset.png',
    )
  })

  it('resolves relative paths against default base URL', () => {
    expect(toAbsoluteUrl('/og-default.png')).toBe(
      'https://winterest.tech/og-default.png',
    )
    expect(toAbsoluteUrl('projects/slug')).toBe(
      'https://winterest.tech/projects/slug',
    )
    expect(toAbsoluteUrl('/')).toBe('https://winterest.tech/')
  })
})

describe('inferImageMimeType', () => {
  it('returns image/png for undefined, null, or empty string', () => {
    expect(inferImageMimeType(undefined)).toBe('image/png')
    expect(inferImageMimeType(null)).toBe('image/png')
    expect(inferImageMimeType('')).toBe('image/png')
  })

  it('correctly detects png, jpeg, webp, svg, and gif extensions', () => {
    expect(inferImageMimeType('/og-default.png')).toBe('image/png')
    expect(inferImageMimeType('https://example.com/photo.jpg')).toBe(
      'image/jpeg',
    )
    expect(inferImageMimeType('https://example.com/photo.jpeg')).toBe(
      'image/jpeg',
    )
    expect(inferImageMimeType('/assets/banner.webp')).toBe('image/webp')
    expect(inferImageMimeType('/icons/logo.svg')).toBe('image/svg+xml')
    expect(inferImageMimeType('https://example.com/anim.gif')).toBe('image/gif')
  })

  it('ignores query parameters when inferring mime type', () => {
    expect(inferImageMimeType('https://example.com/img.png?w=1200&h=630')).toBe(
      'image/png',
    )
    expect(inferImageMimeType('https://example.com/img.webp?v=1.2')).toBe(
      'image/webp',
    )
  })

  it('falls back to image/png for unknown extensions', () => {
    expect(inferImageMimeType('https://example.com/file.bin')).toBe('image/png')
    expect(inferImageMimeType('https://example.com/file')).toBe('image/png')
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

  it('injects complete Open Graph dimension, type, and secure_url tags for default og image fallback', () => {
    const result = createRouteMeta({
      title: 'Test Page',
    })

    const ogImage = result.meta.find((m) => m.property === 'og:image')
    const ogSecureUrl = result.meta.find(
      (m) => m.property === 'og:image:secure_url',
    )
    const ogWidth = result.meta.find((m) => m.property === 'og:image:width')
    const ogHeight = result.meta.find((m) => m.property === 'og:image:height')
    const ogType = result.meta.find((m) => m.property === 'og:image:type')
    const ogAlt = result.meta.find((m) => m.property === 'og:image:alt')
    const twitterCard = result.meta.find((m) => m.name === 'twitter:card')
    const twitterImage = result.meta.find((m) => m.name === 'twitter:image')

    expect(ogImage?.content).toBe(
      `https://winterest.tech${DEFAULT_OG_IMAGE_PATH}`,
    )
    expect(ogSecureUrl?.content).toBe(
      `https://winterest.tech${DEFAULT_OG_IMAGE_PATH}`,
    )
    expect(ogWidth?.content).toBe(String(DEFAULT_OG_IMAGE_WIDTH))
    expect(ogHeight?.content).toBe(String(DEFAULT_OG_IMAGE_HEIGHT))
    expect(ogType?.content).toBe('image/png')
    expect(ogAlt?.content).toBe('Test Page | Winterest')
    expect(twitterCard?.content).toBe('summary_large_image')
    expect(twitterImage?.content).toBe(
      `https://winterest.tech${DEFAULT_OG_IMAGE_PATH}`,
    )
  })

  it('configures twitter:card as summary_large_image and normalizes ogImage', () => {
    const resultWithImage = createRouteMeta({
      title: 'My Project',
      ogImage: 'https://example.com/cover.png',
      ogImageWidth: 1600,
      ogImageHeight: 900,
      ogImageType: 'image/jpeg',
      ogImageAlt: 'Project banner',
      ogType: 'article',
    })

    const twitterCardWithImage = resultWithImage.meta.find(
      (m) => m.name === 'twitter:card',
    )
    const ogImage = resultWithImage.meta.find((m) => m.property === 'og:image')
    const ogWidth = resultWithImage.meta.find(
      (m) => m.property === 'og:image:width',
    )
    const ogHeight = resultWithImage.meta.find(
      (m) => m.property === 'og:image:height',
    )
    const ogType = resultWithImage.meta.find(
      (m) => m.property === 'og:image:type',
    )
    const ogAlt = resultWithImage.meta.find(
      (m) => m.property === 'og:image:alt',
    )
    const rootOgType = resultWithImage.meta.find(
      (m) => m.property === 'og:type',
    )

    expect(twitterCardWithImage?.content).toBe('summary_large_image')
    expect(ogImage?.content).toBe('https://example.com/cover.png')
    expect(ogWidth?.content).toBe('1600')
    expect(ogHeight?.content).toBe('900')
    expect(ogType?.content).toBe('image/jpeg')
    expect(ogAlt?.content).toBe('Project banner')
    expect(rootOgType?.content).toBe('article')
  })

  it('normalizes relative ogImage path to absolute URL', () => {
    const result = createRouteMeta({
      title: 'Custom Image Page',
      ogImage: '/api/media/file/project-cover.webp',
    })

    const ogImage = result.meta.find((m) => m.property === 'og:image')
    const ogType = result.meta.find((m) => m.property === 'og:image:type')

    expect(ogImage?.content).toBe(
      'https://winterest.tech/api/media/file/project-cover.webp',
    )
    expect(ogType?.content).toBe('image/webp')
  })

  it('handles canonicalUrl both from options and inferred from matches', () => {
    const resultWithOptions = createRouteMeta({
      title: 'Projects',
      canonicalUrl: '/projects',
    })

    const ogUrl = resultWithOptions.meta.find((m) => m.property === 'og:url')
    const canonicalLink = resultWithOptions.links?.find(
      (l) => l.rel === 'canonical',
    )

    expect(ogUrl?.content).toBe('https://winterest.tech/projects')
    expect(canonicalLink?.href).toBe('https://winterest.tech/projects')

    const mockMatches = [
      {
        pathname: '/about',
      },
    ] as any

    const resultWithMatches = createRouteMeta({
      matches: mockMatches,
      title: 'About',
    })

    const ogUrlMatches = resultWithMatches.meta.find(
      (m) => m.property === 'og:url',
    )
    const canonicalLinkMatches = resultWithMatches.links?.find(
      (l) => l.rel === 'canonical',
    )

    expect(ogUrlMatches?.content).toBe('https://winterest.tech/about')
    expect(canonicalLinkMatches?.href).toBe('https://winterest.tech/about')
  })

  it('honors noImage: true by setting twitter:card to summary and omitting og:image', () => {
    const resultWithoutImage = createRouteMeta({
      title: 'No Image Page',
      noImage: true,
    })
    const twitterCardWithoutImage = resultWithoutImage.meta.find(
      (m) => m.name === 'twitter:card',
    )
    const ogImage = resultWithoutImage.meta.find(
      (m) => m.property === 'og:image',
    )

    expect(twitterCardWithoutImage?.content).toBe('summary')
    expect(ogImage).toBeUndefined()
  })
})
