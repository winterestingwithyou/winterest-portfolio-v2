/**
 * Partitions an array of marquee items into 3 rows for multi-row stacked marquees.
 *
 * Strategy:
 * - If items >= 6: Balanced 3-way distribution across rows.
 * - If items < 6 (and > 0): Circular index offset to prevent any row from being empty
 *   while giving each row a different starting item.
 * - If items === 0: Returns 3 empty arrays.
 */
export function partitionMarqueeItems<T>(items: T[]): [T[], T[], T[]] {
  if (items.length === 0) {
    return [[], [], []]
  }

  if (items.length >= 6) {
    const chunkSize = Math.ceil(items.length / 3)
    const row1 = items.slice(0, chunkSize)
    const row2 = items.slice(chunkSize, chunkSize * 2)
    const row3 = items.slice(chunkSize * 2)

    // Safeguard to ensure row3 is never empty if chunking is uneven
    if (row3.length === 0) {
      return [row1, row2, items]
    }
    return [row1, row2, row3]
  }

  // Circular rotation for small datasets (< 6) so each row has items in a different order
  const row1 = [...items]
  const row2 = [...items.slice(1), ...items.slice(0, 1)]
  const row3 = [...items.slice(2), ...items.slice(0, 2)]
  return [row1, row2, row3]
}
