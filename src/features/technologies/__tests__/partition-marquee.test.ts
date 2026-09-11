import { describe, expect, it } from 'vitest'

import { partitionMarqueeItems } from '../partition-marquee'

describe('partitionMarqueeItems', () => {
  it('returns three empty arrays when input is empty', () => {
    const result = partitionMarqueeItems([])
    expect(result).toEqual([[], [], []])
  })

  describe('small datasets (< 6 items)', () => {
    it('handles a single item with circular repetition across all 3 rows', () => {
      const [row1, row2, row3] = partitionMarqueeItems(['A'])
      expect(row1).toEqual(['A'])
      expect(row2).toEqual(['A'])
      expect(row3).toEqual(['A'])
    })

    it('handles 2 items with circular rotation', () => {
      const [row1, row2, row3] = partitionMarqueeItems(['A', 'B'])
      expect(row1).toEqual(['A', 'B'])
      expect(row2).toEqual(['B', 'A'])
      expect(row3).toEqual(['A', 'B'])
    })

    it('handles 3 items with circular rotation ensuring varied starting items', () => {
      const [row1, row2, row3] = partitionMarqueeItems(['A', 'B', 'C'])
      expect(row1).toEqual(['A', 'B', 'C'])
      expect(row2).toEqual(['B', 'C', 'A'])
      expect(row3).toEqual(['C', 'A', 'B'])
    })

    it('handles 5 items without leaving any row empty', () => {
      const [row1, row2, row3] = partitionMarqueeItems([
        'A',
        'B',
        'C',
        'D',
        'E',
      ])
      expect(row1).toEqual(['A', 'B', 'C', 'D', 'E'])
      expect(row2).toEqual(['B', 'C', 'D', 'E', 'A'])
      expect(row3).toEqual(['C', 'D', 'E', 'A', 'B'])
      expect(row1.length).toBe(5)
      expect(row2.length).toBe(5)
      expect(row3.length).toBe(5)
    })
  })

  describe('balanced datasets (>= 6 items)', () => {
    it('splits 6 items into three equal rows of 2', () => {
      const items = ['1', '2', '3', '4', '5', '6']
      const [row1, row2, row3] = partitionMarqueeItems(items)
      expect(row1).toEqual(['1', '2'])
      expect(row2).toEqual(['3', '4'])
      expect(row3).toEqual(['5', '6'])
    })

    it('splits 7 items into balanced rows (3, 3, 1)', () => {
      const items = ['1', '2', '3', '4', '5', '6', '7']
      const [row1, row2, row3] = partitionMarqueeItems(items)
      expect(row1).toEqual(['1', '2', '3'])
      expect(row2).toEqual(['4', '5', '6'])
      expect(row3).toEqual(['7'])
      expect(row1.length + row2.length + row3.length).toBe(7)
    })

    it('splits 8 items into balanced rows (3, 3, 2)', () => {
      const items = ['1', '2', '3', '4', '5', '6', '7', '8']
      const [row1, row2, row3] = partitionMarqueeItems(items)
      expect(row1).toEqual(['1', '2', '3'])
      expect(row2).toEqual(['4', '5', '6'])
      expect(row3).toEqual(['7', '8'])
      expect(row1.length + row2.length + row3.length).toBe(8)
    })

    it('splits 9 items into three equal rows of 3', () => {
      const items = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
      const [row1, row2, row3] = partitionMarqueeItems(items)
      expect(row1).toEqual(['1', '2', '3'])
      expect(row2).toEqual(['4', '5', '6'])
      expect(row3).toEqual(['7', '8', '9'])
    })
  })
})
