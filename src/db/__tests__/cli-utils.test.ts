import { describe, expect, it, vi } from 'vitest'

import {
  createRemoteD1Database,
  findLocalD1Database,
  readEnv,
} from '../cli-utils'

vi.mock('ofetch', () => ({
  ofetch: vi.fn(),
}))

describe('cli-utils', () => {
  describe('readEnv', () => {
    it('returns the environment variable value when defined', () => {
      process.env.TEST_VAR = 'hello-world'
      expect(readEnv('TEST_VAR')).toBe('hello-world')
      delete process.env.TEST_VAR
    })

    it('throws a descriptive error when required environment variable is missing', () => {
      delete process.env.NON_EXISTENT_VAR
      expect(() => readEnv('NON_EXISTENT_VAR', 'testing')).toThrow(
        'NON_EXISTENT_VAR is required for remote D1 testing.',
      )
    })
  })

  describe('findLocalD1Database', () => {
    it('returns string or null safely without throwing', () => {
      const result = findLocalD1Database()
      expect(result === null || typeof result === 'string').toBe(true)
    })
  })

  describe('createRemoteD1Database', () => {
    it('correctly handles .get() queries by unwrapping the first row or returning undefined', async () => {
      const { ofetch } = await import('ofetch')
      const mockOfetch = vi.mocked(ofetch)

      // Test 1: Empty results (no match found)
      mockOfetch.mockResolvedValueOnce({
        success: true,
        result: [{ results: [] }],
      })

      const db = createRemoteD1Database('test-account', 'test-db', 'test-token')

      const nonExistent = await db.query.user.findFirst({
        where: (users, { eq }) => eq(users.email, 'notfound@example.com'),
      })

      // Must be undefined, NOT an empty object
      expect(nonExistent).toBeUndefined()
    })
  })
})
