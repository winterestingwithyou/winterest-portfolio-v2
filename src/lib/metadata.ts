import type { AnyRouteMatch } from '@tanstack/router-core'

import type { SiteSettingsInput } from '#/features/settings/types'
import { defaultSiteSettings } from '#/features/settings/types'
import { getLocale } from '#/paraglide/runtime'

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
   * If not provided, falls back to site settings ogImageUrl.
   */
  ogImage?: string | null

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
 * Creates a standard TanStack Router head `meta` array with title, OpenGraph,
 * and Twitter Card metadata, adhering to site settings and formatting rules.
 */
export function createRouteMeta(options: CreateRouteMetaOptions): {
  meta: Array<Record<string, any>>
} {
  const { matches, title, description, ogImage, isHome = false } = options
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
  const resolvedImage = ogImage?.trim() || settings.ogImageUrl || ''

  const metaList: Array<Record<string, any>> = [
    { title: resolvedTitle },
    { property: 'og:title', content: resolvedTitle },
    { name: 'twitter:title', content: resolvedTitle },
  ]

  if (resolvedDesc) {
    metaList.push({ name: 'description', content: resolvedDesc })
  }

  if (resolvedOgDesc) {
    metaList.push({ property: 'og:description', content: resolvedOgDesc })
    metaList.push({ name: 'twitter:description', content: resolvedOgDesc })
  }

  if (resolvedImage) {
    metaList.push({ property: 'og:image', content: resolvedImage })
    metaList.push({ name: 'twitter:image', content: resolvedImage })
    metaList.push({ name: 'twitter:card', content: 'summary_large_image' })
  } else {
    metaList.push({ name: 'twitter:card', content: 'summary' })
  }

  return { meta: metaList }
}
