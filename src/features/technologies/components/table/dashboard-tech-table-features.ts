import type {
  CategoryRecord,
  TechnologyWithCategories,
} from '#/features/technologies/queries'

export type { CategoryRecord, TechnologyWithCategories }

export function getCategoryMap(categories: CategoryRecord[]) {
  return new Map<string, string>(categories.map((c) => [c.id, c.name]))
}
