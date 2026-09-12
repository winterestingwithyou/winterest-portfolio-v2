import { describe, expect, it } from 'vitest'

import { getNextCategorySortOrder } from '../utils'

describe('getNextCategorySortOrder', () => {
  it('returns 1 when category list is empty', () => {
    expect(getNextCategorySortOrder([])).toBe(1)
  })

  it('returns 1 when category list is undefined or null', () => {
    expect(getNextCategorySortOrder(undefined)).toBe(1)
    expect(getNextCategorySortOrder(null)).toBe(1)
  })

  it('returns next sequential number for normal sequence', () => {
    const categories = [{ sortOrder: 1 }, { sortOrder: 2 }, { sortOrder: 3 }]
    expect(getNextCategorySortOrder(categories)).toBe(4)
  })

  it('handles non-contiguous / gapped sort orders by taking max + 1', () => {
    const categories = [{ sortOrder: 1 }, { sortOrder: 5 }, { sortOrder: 2 }]
    expect(getNextCategorySortOrder(categories)).toBe(6)
  })

  it('returns 1 when category only has sortOrder 0', () => {
    const categories = [{ sortOrder: 0 }]
    expect(getNextCategorySortOrder(categories)).toBe(1)
  })

  it('returns 1 when sort orders contain zero and negative values', () => {
    const categories = [{ sortOrder: -2 }, { sortOrder: 0 }]
    expect(getNextCategorySortOrder(categories)).toBe(1)
  })

  it('returns 1 when all sort orders are negative', () => {
    const categories = [{ sortOrder: -5 }, { sortOrder: -2 }]
    expect(getNextCategorySortOrder(categories)).toBe(1)
  })

  it('handles items with null or undefined sortOrder safely', () => {
    const categories = [
      { sortOrder: null },
      { sortOrder: 2 },
      { sortOrder: undefined },
    ]
    expect(getNextCategorySortOrder(categories)).toBe(3)
  })

  it('handles items where all sortOrders are null or undefined', () => {
    const categories = [{ sortOrder: null }, { sortOrder: undefined }]
    expect(getNextCategorySortOrder(categories)).toBe(1)
  })
})
