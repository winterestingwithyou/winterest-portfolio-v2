import { asc, eq } from 'drizzle-orm'

import type { Database } from '#/db'
import { homeConfig, homeEnthusiasms } from '#/db/schema'
import { homeCopy } from '#/features/home/copy'
import { getDefaultHomeConfig } from './validation'
import type {
  EnthusiasmItemInput,
  EnthusiasmRecord,
  HomeConfigInput,
  StatItem,
} from './validation'

export async function getHomeConfig(db: Database): Promise<HomeConfigInput> {
  const defaultData = getDefaultHomeConfig()

  try {
    const record = await db
      .select()
      .from(homeConfig)
      .where(eq(homeConfig.id, 'default'))
      .get()

    if (!record) {
      return defaultData
    }

    let stats: StatItem[] = defaultData.stats
    if (record.statsJson) {
      try {
        stats = JSON.parse(record.statsJson) as StatItem[]
      } catch {
        stats = defaultData.stats
      }
    }

    return {
      heroEyebrowEn: record.heroEyebrowEn || defaultData.heroEyebrowEn,
      heroEyebrowId: record.heroEyebrowId || defaultData.heroEyebrowId,
      heroTitleEn: record.heroTitleEn || defaultData.heroTitleEn,
      heroTitleId: record.heroTitleId || defaultData.heroTitleId,
      heroIntroEn: record.heroIntroEn || defaultData.heroIntroEn,
      heroIntroId: record.heroIntroId || defaultData.heroIntroId,
      heroIntroSuffixEn:
        record.heroIntroSuffixEn || defaultData.heroIntroSuffixEn,
      heroIntroSuffixId:
        record.heroIntroSuffixId || defaultData.heroIntroSuffixId,

      showStats: record.showStats,
      stats,

      featuredEyebrowEn:
        record.featuredEyebrowEn || defaultData.featuredEyebrowEn,
      featuredEyebrowId:
        record.featuredEyebrowId || defaultData.featuredEyebrowId,
      featuredTitleEn: record.featuredTitleEn || defaultData.featuredTitleEn,
      featuredTitleId: record.featuredTitleId || defaultData.featuredTitleId,
      featuredDescriptionEn:
        record.featuredDescriptionEn || defaultData.featuredDescriptionEn,
      featuredDescriptionId:
        record.featuredDescriptionId || defaultData.featuredDescriptionId,
      showFeaturedDescription: record.showFeaturedDescription,

      enthusiasmsEyebrowEn:
        record.enthusiasmsEyebrowEn || defaultData.enthusiasmsEyebrowEn,
      enthusiasmsEyebrowId:
        record.enthusiasmsEyebrowId || defaultData.enthusiasmsEyebrowId,
      enthusiasmsTitleEn:
        record.enthusiasmsTitleEn || defaultData.enthusiasmsTitleEn,
      enthusiasmsTitleId:
        record.enthusiasmsTitleId || defaultData.enthusiasmsTitleId,
      enthusiasmsDescriptionEn:
        record.enthusiasmsDescriptionEn || defaultData.enthusiasmsDescriptionEn,
      enthusiasmsDescriptionId:
        record.enthusiasmsDescriptionId || defaultData.enthusiasmsDescriptionId,
      showEnthusiasmsDescription: record.showEnthusiasmsDescription,

      marqueeEyebrowEn: record.marqueeEyebrowEn || defaultData.marqueeEyebrowEn,
      marqueeEyebrowId: record.marqueeEyebrowId || defaultData.marqueeEyebrowId,
      marqueeTitleEn: record.marqueeTitleEn || defaultData.marqueeTitleEn,
      marqueeTitleId: record.marqueeTitleId || defaultData.marqueeTitleId,
      marqueeDescriptionEn:
        record.marqueeDescriptionEn || defaultData.marqueeDescriptionEn,
      marqueeDescriptionId:
        record.marqueeDescriptionId || defaultData.marqueeDescriptionId,
      showMarqueeDescription: record.showMarqueeDescription,

      ctaCommand: record.ctaCommand || defaultData.ctaCommand,
      ctaTitleEn: record.ctaTitleEn || defaultData.ctaTitleEn,
      ctaTitleId: record.ctaTitleId || defaultData.ctaTitleId,
      ctaButtonTextEn: record.ctaButtonTextEn || defaultData.ctaButtonTextEn,
      ctaButtonTextId: record.ctaButtonTextId || defaultData.ctaButtonTextId,
    }
  } catch (error) {
    const isMissingTable =
      error instanceof Error &&
      error.message.toLowerCase().includes('no such table')
    if (!isMissingTable) {
      console.error('Failed to read home_config table:', error)
    }
    return defaultData
  }
}

export async function updateHomeConfig(
  db: Database,
  input: HomeConfigInput,
): Promise<HomeConfigInput> {
  const now = new Date()
  const statsJson = JSON.stringify(input.stats)

  const existing = await db
    .select({ id: homeConfig.id })
    .from(homeConfig)
    .where(eq(homeConfig.id, 'default'))
    .get()

  const values = {
    heroEyebrowEn: input.heroEyebrowEn.trim(),
    heroEyebrowId: input.heroEyebrowId.trim(),
    heroTitleEn: input.heroTitleEn.trim(),
    heroTitleId: input.heroTitleId.trim(),
    heroIntroEn: input.heroIntroEn.trim(),
    heroIntroId: input.heroIntroId.trim(),
    heroIntroSuffixEn: input.heroIntroSuffixEn.trim(),
    heroIntroSuffixId: input.heroIntroSuffixId.trim(),

    showStats: input.showStats,
    statsJson,

    featuredEyebrowEn: input.featuredEyebrowEn.trim(),
    featuredEyebrowId: input.featuredEyebrowId.trim(),
    featuredTitleEn: input.featuredTitleEn.trim(),
    featuredTitleId: input.featuredTitleId.trim(),
    featuredDescriptionEn: input.featuredDescriptionEn.trim(),
    featuredDescriptionId: input.featuredDescriptionId.trim(),
    showFeaturedDescription: input.showFeaturedDescription,

    enthusiasmsEyebrowEn: input.enthusiasmsEyebrowEn.trim(),
    enthusiasmsEyebrowId: input.enthusiasmsEyebrowId.trim(),
    enthusiasmsTitleEn: input.enthusiasmsTitleEn.trim(),
    enthusiasmsTitleId: input.enthusiasmsTitleId.trim(),
    enthusiasmsDescriptionEn: input.enthusiasmsDescriptionEn.trim(),
    enthusiasmsDescriptionId: input.enthusiasmsDescriptionId.trim(),
    showEnthusiasmsDescription: input.showEnthusiasmsDescription,

    marqueeEyebrowEn: input.marqueeEyebrowEn.trim(),
    marqueeEyebrowId: input.marqueeEyebrowId.trim(),
    marqueeTitleEn: input.marqueeTitleEn.trim(),
    marqueeTitleId: input.marqueeTitleId.trim(),
    marqueeDescriptionEn: input.marqueeDescriptionEn.trim(),
    marqueeDescriptionId: input.marqueeDescriptionId.trim(),
    showMarqueeDescription: input.showMarqueeDescription,

    ctaCommand: input.ctaCommand.trim(),
    ctaTitleEn: input.ctaTitleEn.trim(),
    ctaTitleId: input.ctaTitleId.trim(),
    ctaButtonTextEn: input.ctaButtonTextEn.trim(),
    ctaButtonTextId: input.ctaButtonTextId.trim(),
    updatedAt: now,
  }

  if (existing) {
    await db.update(homeConfig).set(values).where(eq(homeConfig.id, 'default'))
  } else {
    await db.insert(homeConfig).values({
      id: 'default',
      ...values,
      createdAt: now,
    })
  }

  return getHomeConfig(db)
}

export function getDefaultEnthusiasms(): EnthusiasmRecord[] {
  const enItems = homeCopy.en.enthusiasms.items
  const idItems = homeCopy.id.enthusiasms.items
  const now = new Date()

  return enItems.map((item, index) => ({
    id: `default-${index + 1}`,
    icon: item.iconName,
    titleEn: item.title,
    titleId: idItems[index]?.title ?? item.title,
    descriptionEn: item.description,
    descriptionId: idItems[index]?.description ?? item.description,
    isEnabled: true,
    sortOrder: index,
    createdAt: now,
    updatedAt: now,
  }))
}

export async function getHomeEnthusiasms(
  db: Database,
  options?: { onlyEnabled?: boolean },
): Promise<EnthusiasmRecord[]> {
  try {
    const query = db.select().from(homeEnthusiasms)

    const records = options?.onlyEnabled
      ? await query
          .where(eq(homeEnthusiasms.isEnabled, true))
          .orderBy(asc(homeEnthusiasms.sortOrder))
      : await query.orderBy(asc(homeEnthusiasms.sortOrder))

    if (records.length === 0) {
      return getDefaultEnthusiasms()
    }

    return records.map((r) => ({
      id: r.id,
      icon: r.icon,
      titleEn: r.titleEn,
      titleId: r.titleId,
      descriptionEn: r.descriptionEn,
      descriptionId: r.descriptionId,
      isEnabled: r.isEnabled,
      sortOrder: r.sortOrder,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }))
  } catch (error) {
    const isMissingTable =
      error instanceof Error &&
      error.message.toLowerCase().includes('no such table')
    if (!isMissingTable) {
      console.error('Failed to read home_enthusiasms table:', error)
    }
    return getDefaultEnthusiasms()
  }
}

export async function createHomeEnthusiasm(
  db: Database,
  input: EnthusiasmItemInput,
): Promise<EnthusiasmRecord> {
  const now = new Date()
  const id = crypto.randomUUID()

  await db.insert(homeEnthusiasms).values({
    id,
    icon: input.icon.trim(),
    titleEn: input.titleEn.trim(),
    titleId: input.titleId.trim(),
    descriptionEn: input.descriptionEn.trim(),
    descriptionId: input.descriptionId.trim(),
    isEnabled: input.isEnabled,
    sortOrder: input.sortOrder,
    createdAt: now,
    updatedAt: now,
  })

  const created = await db
    .select()
    .from(homeEnthusiasms)
    .where(eq(homeEnthusiasms.id, id))
    .get()

  if (!created) {
    throw new Error('Failed to retrieve created enthusiasm item.')
  }

  return created
}

export async function updateHomeEnthusiasm(
  db: Database,
  id: string,
  input: Partial<EnthusiasmItemInput>,
): Promise<EnthusiasmRecord> {
  const now = new Date()

  await db
    .update(homeEnthusiasms)
    .set({
      ...(input.icon !== undefined ? { icon: input.icon.trim() } : {}),
      ...(input.titleEn !== undefined ? { titleEn: input.titleEn.trim() } : {}),
      ...(input.titleId !== undefined ? { titleId: input.titleId.trim() } : {}),
      ...(input.descriptionEn !== undefined
        ? { descriptionEn: input.descriptionEn.trim() }
        : {}),
      ...(input.descriptionId !== undefined
        ? { descriptionId: input.descriptionId.trim() }
        : {}),
      ...(input.isEnabled !== undefined ? { isEnabled: input.isEnabled } : {}),
      ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
      updatedAt: now,
    })
    .where(eq(homeEnthusiasms.id, id))

  const updated = await db
    .select()
    .from(homeEnthusiasms)
    .where(eq(homeEnthusiasms.id, id))
    .get()

  if (!updated) {
    throw new Error('Enthusiasm item not found.')
  }

  return updated
}

export async function deleteHomeEnthusiasm(
  db: Database,
  id: string,
): Promise<void> {
  await db.delete(homeEnthusiasms).where(eq(homeEnthusiasms.id, id))
}

export async function reorderHomeEnthusiasms(
  db: Database,
  items: { id: string; sortOrder: number }[],
): Promise<void> {
  const now = new Date()
  for (const item of items) {
    await db
      .update(homeEnthusiasms)
      .set({
        sortOrder: item.sortOrder,
        updatedAt: now,
      })
      .where(eq(homeEnthusiasms.id, item.id))
  }
}
