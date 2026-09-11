import type { AnyRouteMatch } from '@tanstack/router-core'

import type { SiteSettingsInput } from '#/features/settings/types'
import { defaultSiteSettings } from '#/features/settings/types'
import { getAppBaseUrl } from '#/lib/api-client'
import { getLocale } from '#/paraglide/runtime'

export const DEFAULT_OG_IMAGE_PATH = '/og-default.png'
export const DEFAULT_OG_IMAGE_WIDTH = 1200
export const DEFAULT_OG_IMAGE_HEIGHT = 630

export interface CreateRouteMetaOptions {
  /**
   * Matches array from TanStack Router's head({ matches }) context.
   */
  matches?: Array<AnyRouteMatch>

  /**
   * Specific page title (e.g. "About", "Projects", "Project Name").
   * Ignored if isHome is true and title is not explicitly provided.
   */
  title?: string | null

  /**
   * Page description for SEO and social preview.
   * If not provided, falls back to site settings description for current locale.
   */
  description?: string | null

  /**
   * OpenGraph / Twitter share image URL.
   * If not provided, falls back to site settings ogImageUrl or DEFAULT_OG_IMAGE_PATH.
   */
  ogImage?: string | null

  /**
   * OpenGraph image width in pixels. Defaults to 1200.
   */
  ogImageWidth?: number

  /**
   * OpenGraph image height in pixels. Defaults to 630.
   */
  ogImageHeight?: number

  /**
   * OpenGraph image MIME type (e.g. 'image/png', 'image/jpeg', 'image/webp').
   * Inferred automatically from extension if not specified.
   */
  ogImageType?: string

  /**
   * OpenGraph image alt text. Defaults to resolved page title or 'Winterest'.
   */
  ogImageAlt?: string

  /**
   * Canonical URL or relative path (e.g. '/about', 'https://winterest.tech/about').
   * Inferred from matches if not explicitly specified.
   */
  canonicalUrl?: string | null

  /**
   * OpenGraph type. Defaults to 'website' (or 'article' for project details / blogs).
   */
  ogType?: 'website' | 'article' | 'profile'

  /**
   * Explicitly suppress image meta tags.
   */
  noImage?: boolean

  /**
   * Indicates whether this is the homepage.
   * When true, uses the site settings homepage title directly without template formatting.
   */
  isHome?: boolean

  /**
   * Explicit locale override (defaults to getLocale()).
   */
  locale?: 'en' | 'id'
}

export interface CreateRouteMetaResult {
  meta: Array<Record<string, any>>
  links?: Array<Record<string, any>>
}

/**
 * Normalizes a relative or absolute path into a fully-qualified absolute URL.
 * Resolves base URL dynamically via getAppBaseUrl() from api-client without any hardcoded domain fallback.
 */
export function toAbsoluteUrl(pathOrUrl?: string | null): string {
  if (!pathOrUrl || !pathOrUrl.trim()) return ''
  const trimmed = pathOrUrl.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (trimmed.startsWith('//')) return `https:${trimmed}`

  const baseUrl = getAppBaseUrl()
  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return baseUrl ? `${baseUrl}${cleanPath}` : cleanPath
}

/**
 * Infers image MIME type from URL extension. Defaults to 'image/png'.
 */
export function inferImageMimeType(urlOrPath?: string | null): string {
  if (!urlOrPath) return 'image/png'
  const clean = urlOrPath.split('?')[0].toLowerCase()
  if (clean.endsWith('.jpg') || clean.endsWith('.jpeg')) return 'image/jpeg'
  if (clean.endsWith('.webp')) return 'image/webp'
  if (clean.endsWith('.gif')) return 'image/gif'
  if (clean.endsWith('.svg')) return 'image/svg+xml'
  return 'image/png'
}

/**
 * Extracts SiteSettingsInput from root match loaderData, or returns defaultSiteSettings.
 */
export function getRootSiteSettings(
  matches?: Array<AnyRouteMatch>,
): SiteSettingsInput {
  if (!matches || matches.length === 0) {
    return defaultSiteSettings
  }

  const rootMatch =
    matches.find(
      (m) =>
        m.routeId === '__root__' ||
        m.routeId === '__root' ||
        m.id === '__root__' ||
        m.id === '__root',
    ) ?? matches[0]

  const data = rootMatch.loaderData as
    | { siteSettings?: SiteSettingsInput }
    | undefined
  return data?.siteSettings ?? defaultSiteSettings
}

/**
 * Formats a page title using the metaTitleTemplate string.
 * Default template is '%s | Winterest'.
 *
 * Example:
 * formatMetaTitle('About', '%s | Winterest') => 'About | Winterest'
 * formatMetaTitle('Winterest Portfolio', '%s | Winterest') => 'Winterest Portfolio'
 */
export function formatMetaTitle(
  pageTitle?: string | null,
  template?: string | null,
  fallback = 'Winterest',
): string {
  const cleanTitle = pageTitle?.trim()
  if (!cleanTitle) {
    return fallback
  }

  const tmpl = template?.trim() || '%s | Winterest'

  // Extract suffix/brand from template if possible, e.g. " | Winterest" from "%s | Winterest"
  const suffix = tmpl.replace('%s', '').trim()

  // Avoid double-branding if pageTitle already ends with or equals the template branding suffix
  if (
    cleanTitle === fallback ||
    (suffix && cleanTitle.toLowerCase().endsWith(suffix.toLowerCase()))
  ) {
    return cleanTitle
  }

  if (tmpl.includes('%s')) {
    return tmpl.replace('%s', cleanTitle)
  }

  return `${cleanTitle} | ${tmpl}`
}

/**
 * Creates a standard TanStack Router head `meta` and `links` object with title,
 * OpenGraph, Twitter Card metadata, and canonical link, adhering to site settings
 * and social crawler standards (Facebook Sharing Debugger 1200x630 dimensions).
 */
export function createRouteMeta(
  options: CreateRouteMetaOptions,
): CreateRouteMetaResult {
  const {
    matches,
    title,
    description,
    ogImage,
    isHome = false,
    noImage = false,
  } = options
  const locale = options.locale ?? (getLocale() === 'id' ? 'id' : 'en')
  const isIndo = locale === 'id'

  const settings = getRootSiteSettings(matches)

  // Homepage title from settings
  const homeTitle = isIndo
    ? settings.metaTitleId ||
      settings.metaTitleEn ||
      defaultSiteSettings.metaTitleId
    : settings.metaTitleEn || defaultSiteSettings.metaTitleEn

  // Resolved title
  const resolvedTitle = isHome
    ? title?.trim() || homeTitle
    : formatMetaTitle(title, settings.metaTitleTemplate, homeTitle)

  // Fallback description from settings if not specified
  const defaultDesc = isIndo
    ? settings.metaDescriptionId || settings.metaDescriptionEn || ''
    : settings.metaDescriptionEn || ''

  const defaultOgDesc = isIndo
    ? settings.ogDescriptionId || settings.ogDescriptionEn || defaultDesc
    : settings.ogDescriptionEn || defaultDesc

  const resolvedDesc = description?.trim() || defaultDesc
  const resolvedOgDesc = description?.trim() || defaultOgDesc

  // Canonical URL resolution
  const rawCanonical =
    options.canonicalUrl?.trim() ||
    (matches && matches.length > 0
      ? (matches[matches.length - 1]?.pathname ?? null)
      : null)
  const resolvedCanonical = rawCanonical ? toAbsoluteUrl(rawCanonical) : null

  // Resolved image
  const rawImage = noImage
    ? ''
    : ogImage?.trim() || settings.ogImageUrl.trim() || DEFAULT_OG_IMAGE_PATH
  const resolvedImage = rawImage ? toAbsoluteUrl(rawImage) : ''
  const resolvedSecureImage = resolvedImage.replace(/^http:\/\//i, 'https://')
  const resolvedImageWidth = options.ogImageWidth ?? DEFAULT_OG_IMAGE_WIDTH
  const resolvedImageHeight = options.ogImageHeight ?? DEFAULT_OG_IMAGE_HEIGHT
  const resolvedImageType =
    options.ogImageType?.trim() || inferImageMimeType(resolvedImage)
  const resolvedImageAlt =
    options.ogImageAlt?.trim() || resolvedTitle || 'Winterest'
  const resolvedOgType = options.ogType ?? 'website'

  const metaList: Array<Record<string, any>> = [
    { title: resolvedTitle },
    { property: 'og:title', content: resolvedTitle },
    { property: 'og:type', content: resolvedOgType },
    { name: 'twitter:title', content: resolvedTitle },
  ]

  if (resolvedCanonical) {
    metaList.push({ property: 'og:url', content: resolvedCanonical })
  }

  if (resolvedDesc) {
    metaList.push({ name: 'description', content: resolvedDesc })
  }

  if (resolvedOgDesc) {
    metaList.push({ property: 'og:description', content: resolvedOgDesc })
    metaList.push({ name: 'twitter:description', content: resolvedOgDesc })
  }

  if (resolvedImage) {
    metaList.push(
      { property: 'og:image', content: resolvedImage },
      { property: 'og:image:secure_url', content: resolvedSecureImage },
      { property: 'og:image:width', content: String(resolvedImageWidth) },
      { property: 'og:image:height', content: String(resolvedImageHeight) },
      { property: 'og:image:type', content: resolvedImageType },
      { property: 'og:image:alt', content: resolvedImageAlt },
      { name: 'twitter:image', content: resolvedImage },
      { name: 'twitter:card', content: 'summary_large_image' },
    )
  } else {
    metaList.push({ name: 'twitter:card', content: 'summary' })
  }

  const linkList: Array<Record<string, any>> = []
  if (resolvedCanonical) {
    linkList.push({ rel: 'canonical', href: resolvedCanonical })
  }

  return {
    meta: metaList,
    ...(linkList.length > 0 ? { links: linkList } : {}),
  }
}
