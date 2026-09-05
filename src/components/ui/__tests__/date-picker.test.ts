import { describe, expect, it } from 'vitest'

import {
  formatDateToIso,
  formatToDateMask,
  parseDisplayDate,
  parseValueToDate,
  toDisplayString,
} from '../date-picker'

describe('DatePicker date utilities', () => {
  describe('formatToDateMask', () => {
    it('returns empty string when input is empty', () => {
      expect(formatToDateMask('')).toBe('')
    })

    it('returns digits as-is when length <= 2', () => {
      expect(formatToDateMask('1')).toBe('1')
      expect(formatToDateMask('15')).toBe('15')
    })

    it('inserts first slash after 2 digits when entering 3 or 4 digits', () => {
      expect(formatToDateMask('150')).toBe('15/0')
      expect(formatToDateMask('1508')).toBe('15/08')
    })

    it('inserts second slash after 4 digits when entering 5 or more digits', () => {
      expect(formatToDateMask('15082')).toBe('15/08/2')
      expect(formatToDateMask('150820')).toBe('15/08/20')
      expect(formatToDateMask('15082024')).toBe('15/08/2024')
    })

    it('strips non-digit characters and formats properly', () => {
      expect(formatToDateMask('15/08/2024')).toBe('15/08/2024')
      expect(formatToDateMask('15-08-2024')).toBe('15/08/2024')
      expect(formatToDateMask('15.08.2024')).toBe('15/08/2024')
      expect(formatToDateMask('abc 15 def 08 ghi 2024')).toBe('15/08/2024')
    })

    it('caps at 8 digits maximum (10 characters with slashes)', () => {
      expect(formatToDateMask('150820249999')).toBe('15/08/2024')
    })
  })

  describe('parseDisplayDate', () => {
    it('parses valid DD/MM/YYYY into a Date object', () => {
      const parsed = parseDisplayDate('15/08/2024')
      expect(parsed).toBeInstanceOf(Date)
      expect(parsed?.getFullYear()).toBe(2024)
      expect(parsed?.getMonth()).toBe(7) // August is 0-indexed 7
      expect(parsed?.getDate()).toBe(15)
    })

    it('validates leap years correctly', () => {
      const leapValid = parseDisplayDate('29/02/2024')
      expect(leapValid).toBeInstanceOf(Date)
      expect(leapValid?.getFullYear()).toBe(2024)
      expect(leapValid?.getMonth()).toBe(1)
      expect(leapValid?.getDate()).toBe(29)

      const leapInvalid = parseDisplayDate('29/02/2023')
      expect(leapInvalid).toBeUndefined()
    })

    it('rejects dates with days exceeding the month capacity', () => {
      expect(parseDisplayDate('31/04/2024')).toBeUndefined() // April has 30 days
      expect(parseDisplayDate('31/06/2024')).toBeUndefined() // June has 30 days
      expect(parseDisplayDate('31/09/2024')).toBeUndefined() // September has 30 days
      expect(parseDisplayDate('31/11/2024')).toBeUndefined() // November has 30 days
      expect(parseDisplayDate('32/01/2024')).toBeUndefined()
      expect(parseDisplayDate('00/01/2024')).toBeUndefined()
    })

    it('rejects invalid months', () => {
      expect(parseDisplayDate('15/00/2024')).toBeUndefined()
      expect(parseDisplayDate('15/13/2024')).toBeUndefined()
    })

    it('rejects out of range years (< 1900 or > 2100)', () => {
      expect(parseDisplayDate('15/08/1899')).toBeUndefined()
      expect(parseDisplayDate('15/08/2101')).toBeUndefined()
    })

    it('rejects malformed or incomplete strings', () => {
      expect(parseDisplayDate('15/08')).toBeUndefined()
      expect(parseDisplayDate('invalid')).toBeUndefined()
      expect(parseDisplayDate('')).toBeUndefined()
      expect(parseDisplayDate('2024-08-15')).toBeUndefined() // Not DD/MM/YYYY
    })
  })

  describe('toDisplayString', () => {
    it('formats a Date object to DD/MM/YYYY', () => {
      const date = new Date(2024, 7, 15)
      expect(toDisplayString(date)).toBe('15/08/2024')
    })

    it('converts an ISO YYYY-MM-DD string to DD/MM/YYYY', () => {
      expect(toDisplayString('2024-08-15')).toBe('15/08/2024')
      expect(toDisplayString('2026-01-05')).toBe('05/01/2026')
    })

    it('returns an existing DD/MM/YYYY string as-is', () => {
      expect(toDisplayString('15/08/2024')).toBe('15/08/2024')
    })

    it('returns empty string for null, undefined, or empty values', () => {
      expect(toDisplayString(null)).toBe('')
      expect(toDisplayString(undefined)).toBe('')
      expect(toDisplayString('')).toBe('')
    })

    it('handles ISO timestamp strings', () => {
      const iso = new Date(2024, 7, 15).toISOString()
      expect(toDisplayString(iso)).toBe('15/08/2024')
    })
  })

  describe('parseValueToDate', () => {
    it('returns valid Date instances directly', () => {
      const date = new Date(2024, 7, 15)
      expect(parseValueToDate(date)).toBe(date)
    })

    it('parses ISO YYYY-MM-DD strings', () => {
      const parsed = parseValueToDate('2024-08-15')
      expect(parsed).toBeInstanceOf(Date)
      expect(parsed?.getFullYear()).toBe(2024)
      expect(parsed?.getMonth()).toBe(7)
      expect(parsed?.getDate()).toBe(15)
    })

    it('parses DD/MM/YYYY display strings', () => {
      const parsed = parseValueToDate('15/08/2024')
      expect(parsed).toBeInstanceOf(Date)
      expect(parsed?.getFullYear()).toBe(2024)
      expect(parsed?.getMonth()).toBe(7)
      expect(parsed?.getDate()).toBe(15)
    })

    it('returns undefined for empty, null, or invalid input', () => {
      expect(parseValueToDate(null)).toBeUndefined()
      expect(parseValueToDate(undefined)).toBeUndefined()
      expect(parseValueToDate('')).toBeUndefined()
      expect(parseValueToDate('invalid-date')).toBeUndefined()
    })
  })

  describe('formatDateToIso', () => {
    it('formats local Date objects to YYYY-MM-DD without timezone drift', () => {
      // Midnight in local time
      const localDate = new Date(2024, 7, 15, 0, 0, 0, 0)
      expect(formatDateToIso(localDate)).toBe('2024-08-15')
    })

    it('converts DD/MM/YYYY display string to YYYY-MM-DD', () => {
      expect(formatDateToIso('15/08/2024')).toBe('2024-08-15')
    })

    it('preserves existing YYYY-MM-DD string', () => {
      expect(formatDateToIso('2024-08-15')).toBe('2024-08-15')
    })

    it('extracts date from ISO timestamp strings', () => {
      expect(formatDateToIso('2024-08-15T00:00:00.000Z')).toBe('2024-08-15')
      expect(formatDateToIso('2024-08-15T14:30:00+07:00')).toBe('2024-08-15')
    })

    it('returns empty string for null, undefined, or empty values', () => {
      expect(formatDateToIso(null)).toBe('')
      expect(formatDateToIso(undefined)).toBe('')
      expect(formatDateToIso('')).toBe('')
    })
  })

  describe('Timezone & Blur Stability (No off-by-one / minus-1-day bug)', () => {
    it('typing 8 digits full date produces exact same day on roundtrip', () => {
      const typedDigits = '15082024'
      const masked = formatToDateMask(typedDigits)
      expect(masked).toBe('15/08/2024')

      const parsed = parseDisplayDate(masked)
      expect(parsed).toBeDefined()

      const iso = formatDateToIso(parsed)
      expect(iso).toBe('2024-08-15')

      const backToDisplay = toDisplayString(iso)
      expect(backToDisplay).toBe('15/08/2024')
    })

    it('blurring after typing keeps the exact date without losing 1 day', () => {
      // Simulating user typing 29/02/2024 and blurring field
      const inputValue = '29/02/2024'
      const parsed = parseDisplayDate(inputValue)
      expect(parsed).toBeDefined()

      const iso = formatDateToIso(parsed)
      expect(iso).toBe('2024-02-29')

      const display = toDisplayString(iso)
      expect(display).toBe('29/02/2024')
    })

    it('repeating roundtrips is idempotent and never decrements days', () => {
      let currentDisplay = '15/08/2024'
      for (let i = 0; i < 5; i++) {
        const parsed = parseDisplayDate(currentDisplay)
        const iso = formatDateToIso(parsed)
        currentDisplay = toDisplayString(iso)
        expect(currentDisplay).toBe('15/08/2024')
        expect(iso).toBe('2024-08-15')
      }
    })
  })
})
