import { describe, expect, it } from 'vitest'

import { changePasswordSchema, updateProfileSchema } from './validation'

describe('account validation', () => {
  describe('updateProfileSchema', () => {
    it('validates a valid profile update payload', () => {
      const valid = {
        name: 'Winterest Dev',
        email: 'winterest@example.com',
      }

      const parsed = updateProfileSchema.parse(valid)
      expect(parsed.name).toBe('Winterest Dev')
      expect(parsed.email).toBe('winterest@example.com')
    })

    it('rejects short name or invalid email', () => {
      expect(() =>
        updateProfileSchema.parse({
          name: 'A',
          email: 'valid@example.com',
        }),
      ).toThrow()

      expect(() =>
        updateProfileSchema.parse({
          name: 'Valid Name',
          email: 'not-an-email',
        }),
      ).toThrow()
    })
  })

  describe('changePasswordSchema', () => {
    it('validates matching new passwords', () => {
      const valid = {
        currentPassword: 'oldPassword123',
        newPassword: 'newSecretPassword123',
        confirmPassword: 'newSecretPassword123',
      }

      const parsed = changePasswordSchema.parse(valid)
      expect(parsed.currentPassword).toBe('oldPassword123')
      expect(parsed.newPassword).toBe('newSecretPassword123')
    })

    it('rejects mismatched new and confirm passwords', () => {
      expect(() =>
        changePasswordSchema.parse({
          currentPassword: 'oldPassword123',
          newPassword: 'newSecretPassword123',
          confirmPassword: 'differentPassword123',
        }),
      ).toThrow('Passwords do not match.')
    })

    it('rejects passwords shorter than 8 characters', () => {
      expect(() =>
        changePasswordSchema.parse({
          currentPassword: 'oldPassword123',
          newPassword: 'short',
          confirmPassword: 'short',
        }),
      ).toThrow()
    })
  })
})
