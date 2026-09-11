/**
 * Pure utility functions for the technologies feature.
 */

/**
 * Calculates the next sequential sort order for a new category.
 * Finds the highest sortOrder among existing categories and increments by 1.
 * If no categories exist or the highest order is negative, returns 1.
 */
export function getNextCategorySortOrder(
  categories?: readonly { sortOrder?: number | null }[] | null,
): number {
  if (!categories || categories.length === 0) {
    return 1
  }

  const maxOrder = Math.max(...categories.map((c) => c.sortOrder ?? 0))
  return maxOrder >= 0 ? maxOrder + 1 : 1
}
