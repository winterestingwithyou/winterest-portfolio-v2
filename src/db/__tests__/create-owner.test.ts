import { describe, expect, it } from 'vitest'

import {
  createPasswordMatchSchema,
  formatOwnerSummary,
  ownerEmailSchema,
  ownerPasswordSchema,
  validateOwnerEmail,
  validateOwnerPassword,
  validatePasswordMatch,
} from '../create-owner-helpers'

describe('create-owner-helpers', () => {
  describe('Zod Schemas', () => {
    it('ownerEmailSchema parses valid email and rejects invalid email', () => {
      expect(ownerEmailSchema.safeParse('owner@winterest.dev').success).toBe(
        true,
      )
      expect(ownerEmailSchema.safeParse('invalid-email').success).toBe(false)
      expect(ownerEmailSchema.safeParse('').success).toBe(false)
    })

    it('ownerPasswordSchema parses valid password and rejects short password', () => {
      expect(ownerPasswordSchema.safeParse('12345678').success).toBe(true)
      expect(ownerPasswordSchema.safeParse('short').success).toBe(false)
    })

    it('createPasswordMatchSchema validates matching password strings', () => {
      const schema = createPasswordMatchSchema('secret123')
      expect(schema.safeParse('secret123').success).toBe(true)
      expect(schema.safeParse('wrong123').success).toBe(false)
    })
  })

  describe('validateOwnerEmail', () => {
    it('returns error when email is empty or whitespace', () => {
      expect(validateOwnerEmail('')).toBe('Email address is required.')
      expect(validateOwnerEmail('   ')).toBe('Email address is required.')
      expect(validateOwnerEmail(undefined)).toBe('Email address is required.')
    })

    it('returns error when email format is invalid', () => {
      expect(validateOwnerEmail('invalid-email')).toBe(
        'Please enter a valid email address (e.g. you@example.com).',
      )
      expect(validateOwnerEmail('user@')).toBe(
        'Please enter a valid email address (e.g. you@example.com).',
      )
      expect(validateOwnerEmail('@example.com')).toBe(
        'Please enter a valid email address (e.g. you@example.com).',
      )
      expect(validateOwnerEmail('user@example')).toBe(
        'Please enter a valid email address (e.g. you@example.com).',
      )
    })

    it('returns undefined when email format is valid', () => {
      expect(validateOwnerEmail('owner@winterest.dev')).toBeUndefined()
      expect(validateOwnerEmail('  adam@example.com  ')).toBeUndefined()
      expect(validateOwnerEmail('user.name+tag@sub.domain.org')).toBeUndefined()
    })
  })

  describe('validateOwnerPassword', () => {
    it('returns error when password is empty or undefined', () => {
      expect(validateOwnerPassword('')).toBe(
        'Password must be at least 8 characters long.',
      )
      expect(validateOwnerPassword(undefined)).toBe(
        'Password must be at least 8 characters long.',
      )
    })

    it('returns error when password is less than 8 characters', () => {
      expect(validateOwnerPassword('1234567')).toBe(
        'Password must be at least 8 characters long.',
      )
      expect(validateOwnerPassword('short')).toBe(
        'Password must be at least 8 characters long.',
      )
    })

    it('returns undefined when password is 8 characters or longer', () => {
      expect(validateOwnerPassword('12345678')).toBeUndefined()
      expect(validateOwnerPassword('SuperSecurePassword123!')).toBeUndefined()
    })
  })

  describe('validatePasswordMatch', () => {
    it('returns error when confirmation is empty or undefined', () => {
      expect(validatePasswordMatch('password123', '')).toBe(
        'Please confirm your password.',
      )
      expect(validatePasswordMatch('password123', undefined)).toBe(
        'Please confirm your password.',
      )
    })

    it('returns error when passwords do not match', () => {
      expect(validatePasswordMatch('password123', 'password456')).toBe(
        'Passwords do not match. Please re-enter.',
      )
    })

    it('returns undefined when passwords match', () => {
      expect(
        validatePasswordMatch('SecurePassword123', 'SecurePassword123'),
      ).toBeUndefined()
    })
  })

  describe('formatOwnerSummary', () => {
    it('formats summary note correctly', () => {
      const summary = formatOwnerSummary({
        target: 'Local D1',
        name: 'Winterest',
        email: 'owner@winterest.dev',
      })

      expect(summary).toContain('Target DB : Local D1')
      expect(summary).toContain('Name      : Winterest')
      expect(summary).toContain('Email     : owner@winterest.dev')
      expect(summary).toContain('Role      : owner')
    })
  })
})
