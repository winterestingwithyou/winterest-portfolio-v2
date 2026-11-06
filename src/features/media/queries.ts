import type { BatchItem } from 'drizzle-orm/batch'
import {
  and,
  count,
  desc,
  eq,
  inArray,
  isNotNull,
  like,
  notLike,
  or,
} from 'drizzle-orm'

import type { Database } from '#/db'
import {
  media,
  projectGalleryImages,
  projectTranslations,
  projects,
  siteSettings,
  technologies,
} from '#/db/schema'
import type {
  MediaReferenceItem,
  MediaUsageSummary,
} from '#/features/media/validation'

export type MediaRecord = typeof media.$inferSelect

export type CreateMediaInput = {
  id?: string
  filename: string
  url: string
  mimeType: string
  size: number
  width?: number | null
  height?: number | null
  alt?: string | null
}

export type MediaPaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type PaginatedMediaResult = {
  data: MediaRecord[]
  pagination: MediaPaginationMeta
}

export async function listMediaRecords(
  db: Database,
  options: {
    search?: string
    type?: 'all' | 'image' | 'document'
    page?: number
    limit?: number
  } = {},
): Promise<PaginatedMediaResult> {
  const { search, type = 'all', page = 1, limit = 12 } = options

  const conditions = []

  if (search && search.trim() !== '') {
    const pattern = `%${search.trim()}%`
    conditions.push(or(like(media.filename, pattern), like(media.alt, pattern)))
  }

  if (type === 'image') {
    conditions.push(like(media.mimeType, 'image/%'))
  } else if (type === 'document') {
    conditions.push(notLike(media.mimeType, 'image/%'))
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  const [countResult] = await db
    .select({ total: count() })
    .from(media)
    .where(whereClause)

  const total = countResult.total
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const offset = Math.max(0, (page - 1) * limit)

  const data = await db
    .select()
    .from(media)
    .where(whereClause)
    .orderBy(desc(media.createdAt))
    .limit(limit)
    .offset(offset)
    .all()

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  }
}

export async function getMediaRecordById(
  db: Database,
  id: string,
): Promise<MediaRecord | null> {
  const result = await db.select().from(media).where(eq(media.id, id)).get()
  return result ?? null
}

export async function createMediaRecord(
  db: Database,
  input: CreateMediaInput,
): Promise<MediaRecord> {
  const id = input.id ?? crypto.randomUUID()
  const now = new Date()

  const [record] = await db
    .insert(media)
    .values({
      id,
      filename: input.filename,
      url: input.url,
      mimeType: input.mimeType,
      size: input.size,
      width: input.width ?? null,
      height: input.height ?? null,
      alt: input.alt ?? null,
      createdAt: now,
      updatedAt: now,
    })
    .returning()

  return record
}

export async function deleteMediaRecord(
  db: Database,
  id: string,
): Promise<boolean> {
  const existing = await getMediaRecordById(db, id)
  if (!existing) return false

  await db.delete(media).where(eq(media.id, id)).run()
  return true
}

export type MediaRecordWithUsage = MediaRecord & {
  usage: MediaUsageSummary
}

const R2_URL_MARKER = '/api/media/file/'

export function extractR2Key(url: string): string | null {
  if (!url || !url.includes(R2_URL_MARKER)) return null
  const rawKey = url.slice(url.indexOf(R2_URL_MARKER) + R2_URL_MARKER.length)
  return decodeURIComponent(rawKey).trim() || null
}

export function matchesMediaUrl(
  value: string | null | undefined,
  mediaUrl: string,
  r2Key: string | null,
): boolean {
  if (!value || typeof value !== 'string') return false
  const trimmed = value.trim()
  if (trimmed === mediaUrl) return true
  if (r2Key) {
    const r2Path = `/api/media/file/${r2Key}`
    if (
      trimmed === r2Path ||
      trimmed.endsWith(r2Path) ||
      trimmed.includes(r2Path)
    ) {
      return true
    }
  }
  return false
}

function removeMarkdownMediaReference(
  description: string,
  mediaUrl: string,
  r2Key: string | null,
) {
  let changed = false
  const referenceLabels = new Set<string>()
  const cleanedDescription = description
    .replace(
      /^\s*\[([^\]]+)\]:\s*(<[^>]+>|[^\s]+).*$/gm,
      (match, label: string, destination: string) => {
        const url = destination.startsWith('<')
          ? destination.slice(1, -1)
          : destination
        if (!matchesMediaUrl(url, mediaUrl, r2Key)) return match

        changed = true
        referenceLabels.add(label.trim().toLowerCase())
        return ''
      },
    )
    .replace(
      /!\[([^\]]*)\]\[([^\]]*)\]/g,
      (match, alt: string, reference: string) => {
        const label = (reference || alt).trim().toLowerCase()
        if (!referenceLabels.has(label)) return match

        changed = true
        return ''
      },
    )
    .replace(/!\[([^\]]+)\](?!\()/g, (match, alt: string) => {
      if (!referenceLabels.has(alt.trim().toLowerCase())) return match

      changed = true
      return ''
    })
    .replace(
      /\[([^\]]+)\]\[([^\]]*)\]/g,
      (match, label: string, reference: string) => {
        if (!referenceLabels.has((reference || label).trim().toLowerCase())) {
          return match
        }

        changed = true
        return label
      },
    )
    .replace(/\[([^\]]+)\](?!\()/g, (match, label: string) => {
      if (!referenceLabels.has(label.trim().toLowerCase())) return match

      changed = true
      return label
    })
    .replace(
      /(!?)\[([^\]]*)\]\(\s*(<[^>]+>|[^)\s]+)(?:\s+[^)]*)?\)/g,
      (match, imageMarker: string, label: string, destination: string) => {
        const url = destination.startsWith('<')
          ? destination.slice(1, -1)
          : destination
        if (!matchesMediaUrl(url, mediaUrl, r2Key)) return match

        changed = true
        return imageMarker ? '' : label
      },
    )
    .replace(/<(img|source)\b[^>]*>/gi, (imageTag) => {
      const source = imageTag.match(
        /\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i,
      )
      const url = source?.[1] ?? source?.[2] ?? source?.[3]
      if (matchesMediaUrl(url, mediaUrl, r2Key)) {
        changed = true
        return ''
      }

      const srcset = imageTag.match(
        /\bsrcset\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i,
      )
      const value = srcset?.[1] ?? srcset?.[2] ?? srcset?.[3]
      if (!value) return imageTag

      const remainingSources = value
        .split(',')
        .map((candidate) => candidate.trim())
        .filter((candidate) => {
          const sourceUrl = candidate.split(/\s+/, 1)[0]
          if (!matchesMediaUrl(sourceUrl, mediaUrl, r2Key)) return true
          changed = true
          return false
        })

      if (remainingSources.length === value.split(',').filter(Boolean).length) {
        return imageTag
      }
      if (remainingSources.length === 0) return ''

      return imageTag.replace(
        /\bsrcset\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/i,
        `srcset="${remainingSources.join(', ')}"`,
      )
    })

  return { description: cleanedDescription, changed }
}

export const MONITORED_SETTINGS_KEYS = [
  'faviconUrl',
  'ogImageUrl',
  'heroVisualUrl',
  'cvEnUrl',
  'cvIdUrl',
] as const

const SETTINGS_KEY_METADATA: Record<
  (typeof MONITORED_SETTINGS_KEYS)[number],
  { label: string; details: string }
> = {
  faviconUrl: {
    label: 'Site Settings (Favicon)',
    details: 'Ikon tab browser situs',
  },
  ogImageUrl: {
    label: 'Site Settings (OpenGraph Image)',
    details: 'Gambar pratinjau media sosial',
  },
  heroVisualUrl: {
    label: 'Site Settings (Hero Visual)',
    details: 'Visual utama pada halaman beranda',
  },
  cvEnUrl: {
    label: 'Site Settings (CV English)',
    details: 'Dokumen CV versi Bahasa Inggris',
  },
  cvIdUrl: {
    label: 'Site Settings (CV Indonesia)',
    details: 'Dokumen CV versi Bahasa Indonesia',
  },
}

export async function getMediaUsage(
  db: Database,
  mediaRecord: MediaRecord,
): Promise<MediaUsageSummary> {
  const references: MediaReferenceItem[] = []
  const r2Key = extractR2Key(mediaRecord.url)

  // 1. Site Settings Check
  const allMonitoredSettings = await db
    .select({
      key: siteSettings.key,
      value: siteSettings.value,
    })
    .from(siteSettings)
    .where(
      inArray(siteSettings.key, MONITORED_SETTINGS_KEYS as unknown as string[]),
    )
    .all()

  for (const setting of allMonitoredSettings) {
    if (matchesMediaUrl(setting.value, mediaRecord.url, r2Key)) {
      const meta =
        SETTINGS_KEY_METADATA[
          setting.key as (typeof MONITORED_SETTINGS_KEYS)[number]
        ]
      references.push({
        entityType: 'site_settings',
        field: setting.key,
        id: setting.key,
        label: meta.label,
        details: meta.details,
      })
    }
  }

  // 2. Projects Cover Image Check
  const projectsWithCover = await db
    .select({
      id: projects.id,
      title: projects.title,
      coverImage: projects.coverImage,
    })
    .from(projects)
    .where(isNotNull(projects.coverImage))
    .all()

  for (const proj of projectsWithCover) {
    if (matchesMediaUrl(proj.coverImage, mediaRecord.url, r2Key)) {
      references.push({
        entityType: 'project_cover',
        field: 'coverImage',
        id: proj.id,
        label: `Project: ${proj.title}`,
        details: 'Cover image proyek',
      })
    }
  }

  // Project Gallery Image Check
  const galleryImages = await db
    .select({
      id: projectGalleryImages.id,
      title: projects.title,
      url: projectGalleryImages.url,
    })
    .from(projectGalleryImages)
    .innerJoin(projects, eq(projectGalleryImages.projectId, projects.id))
    .all()

  for (const image of galleryImages) {
    if (matchesMediaUrl(image.url, mediaRecord.url, r2Key)) {
      references.push({
        entityType: 'project_gallery_image',
        field: 'galleryImages',
        id: image.id,
        label: `Project: ${image.title}`,
        details: 'Gambar galeri detail proyek',
      })
    }
  }

  // Technologies Custom Icon Check
  const techsWithIcon = await db
    .select({
      id: technologies.id,
      name: technologies.name,
      icon: technologies.icon,
    })
    .from(technologies)
    .where(isNotNull(technologies.icon))
    .all()

  for (const tech of techsWithIcon) {
    if (matchesMediaUrl(tech.icon, mediaRecord.url, r2Key)) {
      references.push({
        entityType: 'technology_icon',
        field: 'icon',
        id: tech.id,
        label: `Technology: ${tech.name}`,
        details: 'Icon teknologi kustom',
      })
    }
  }

  // 4. Project Content / Markdown Translations Check
  const translationsWithDesc = await db
    .select({
      projectId: projectTranslations.projectId,
      locale: projectTranslations.locale,
      title: projectTranslations.title,
      description: projectTranslations.description,
    })
    .from(projectTranslations)
    .where(isNotNull(projectTranslations.description))
    .all()

  for (const t of translationsWithDesc) {
    if (t.description) {
      const containsExact = t.description.includes(mediaRecord.url)
      const containsR2Path = r2Key
        ? t.description.includes(`/api/media/file/${r2Key}`)
        : false

      if (containsExact || containsR2Path) {
        references.push({
          entityType: 'project_content',
          field: 'description',
          id: `${t.projectId}:${t.locale}`,
          label: `Project Content: ${t.title} (${t.locale.toUpperCase()})`,
          details: 'Disematkan di dalam konten Markdown proyek',
        })
      }
    }
  }

  return {
    inUse: references.length > 0,
    totalReferences: references.length,
    references,
  }
}

export async function cascadeNullifyMediaReferences(
  db: Database,
  mediaRecord: MediaRecord,
): Promise<number> {
  const writes: BatchItem<'sqlite'>[] = []
  const now = new Date()
  const r2Key = extractR2Key(mediaRecord.url)

  // 1. Clear Site Settings
  const allMonitoredSettings = await db
    .select({
      key: siteSettings.key,
      value: siteSettings.value,
    })
    .from(siteSettings)
    .where(
      inArray(siteSettings.key, MONITORED_SETTINGS_KEYS as unknown as string[]),
    )
    .all()

  for (const setting of allMonitoredSettings) {
    if (matchesMediaUrl(setting.value, mediaRecord.url, r2Key)) {
      writes.push(
        db
          .update(siteSettings)
          .set({ value: '', updatedAt: now })
          .where(eq(siteSettings.key, setting.key)),
      )
    }
  }

  // 2. Clear Projects Cover Image
  const projectsWithCover = await db
    .select({
      id: projects.id,
      coverImage: projects.coverImage,
    })
    .from(projects)
    .where(isNotNull(projects.coverImage))
    .all()

  for (const proj of projectsWithCover) {
    if (matchesMediaUrl(proj.coverImage, mediaRecord.url, r2Key)) {
      writes.push(
        db
          .update(projects)
          .set({ coverImage: null, updatedAt: now })
          .where(eq(projects.id, proj.id)),
      )
    }
  }

  // Clear Project Gallery Images
  const galleryImages = await db
    .select({ id: projectGalleryImages.id, url: projectGalleryImages.url })
    .from(projectGalleryImages)
    .all()

  for (const image of galleryImages) {
    if (matchesMediaUrl(image.url, mediaRecord.url, r2Key)) {
      writes.push(
        db
          .delete(projectGalleryImages)
          .where(eq(projectGalleryImages.id, image.id)),
      )
    }
  }

  const translationsWithDesc = await db
    .select({
      projectId: projectTranslations.projectId,
      locale: projectTranslations.locale,
      description: projectTranslations.description,
    })
    .from(projectTranslations)
    .where(isNotNull(projectTranslations.description))
    .all()

  for (const translation of translationsWithDesc) {
    if (!translation.description) continue

    const cleaned = removeMarkdownMediaReference(
      translation.description,
      mediaRecord.url,
      r2Key,
    )
    if (!cleaned.changed) continue

    writes.push(
      db
        .update(projectTranslations)
        .set({ description: cleaned.description, updatedAt: now })
        .where(
          and(
            eq(projectTranslations.projectId, translation.projectId),
            eq(projectTranslations.locale, translation.locale),
          ),
        ),
    )
  }

  // Clear Technologies Custom Icon
  const techsWithIcon = await db
    .select({
      id: technologies.id,
      icon: technologies.icon,
    })
    .from(technologies)
    .where(isNotNull(technologies.icon))
    .all()

  for (const tech of techsWithIcon) {
    if (matchesMediaUrl(tech.icon, mediaRecord.url, r2Key)) {
      writes.push(
        db
          .update(technologies)
          .set({ icon: null, updatedAt: now })
          .where(eq(technologies.id, tech.id)),
      )
    }
  }

  if (writes.length > 0) {
    await db.batch(writes as [BatchItem<'sqlite'>, ...BatchItem<'sqlite'>[]])
  }

  return writes.length
}
