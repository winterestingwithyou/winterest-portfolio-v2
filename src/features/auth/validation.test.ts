import { describe, expect, it } from 'vitest'

import { authCopy } from './copy'
import { createLoginSchema, loginSchema } from './validation'

describe('auth validation', () => {
  describe('loginSchema (default)', () => {
    it('accepts valid credentials', () => {
      const result = loginSchema.safeParse({
        email: 'admin@example.com',
        password: 'supersecretpassword',
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('admin@example.com')
        expect(result.data.password).toBe('supersecretpassword')
      }
    })

    it('rejects empty email', () => {
      const result = loginSchema.safeParse({
        email: '',
        password: 'password123',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const issues = result.error.flatten().fieldErrors
        expect(issues.email).toBeDefined()
        expect(issues.email?.[0]).toBe('Email is required.')
      }
    })

    it('rejects invalid email format', () => {
      const result = loginSchema.safeParse({
        email: 'invalid-email-format',
        password: 'password123',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const issues = result.error.flatten().fieldErrors
        expect(issues.email).toBeDefined()
        expect(issues.email?.[0]).toBe('Please enter a valid email address.')
      }
    })

    it('rejects empty password', () => {
      const result = loginSchema.safeParse({
        email: 'admin@example.com',
        password: '',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const issues = result.error.flatten().fieldErrors
        expect(issues.password).toBeDefined()
        expect(issues.password?.[0]).toBe('Password is required.')
      }
    })
  })

  describe('createLoginSchema (localized)', () => {
    it('produces Indonesian localized error messages', () => {
      const idSchema = createLoginSchema(authCopy.id.validation)

      const emptyResult = idSchema.safeParse({
        email: '',
        password: '',
      })

      expect(emptyResult.success).toBe(false)
      if (!emptyResult.success) {
        const issues = emptyResult.error.flatten().fieldErrors
        expect(issues.email?.[0]).toBe(authCopy.id.validation.emailRequired)
        expect(issues.password?.[0]).toBe(authCopy.id.validation.passwordRequired)
      }

      const invalidEmailResult = idSchema.safeParse({
        email: 'bukan-email',
        password: 'password123',
      })

      expect(invalidEmailResult.success).toBe(false)
      if (!invalidEmailResult.success) {
        const issues = invalidEmailResult.error.flatten().fieldErrors
        expect(issues.email?.[0]).toBe(authCopy.id.validation.emailInvalid)
      }
    })
  })
})
