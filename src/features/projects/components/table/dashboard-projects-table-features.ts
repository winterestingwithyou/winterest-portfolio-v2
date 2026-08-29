export type ProjectRow = {
  id: string
  slug: string
  title: string
  summary: string
  status: 'draft' | 'published' | 'archived'
  visibility: 'public' | 'private'
  featured: boolean
  category: string
  availableLocales: Array<'en' | 'id'>
  updatedAt?: Date | string | null
}

export function formatLocales(locales: readonly ('en' | 'id')[]) {
  return locales.length > 0
    ? locales.map((locale) => locale.toUpperCase()).join(', ')
    : '-'
}
