import { describe, expect, it } from 'vitest'
import { z, ZodError } from 'zod'

import { handleApiError, jsonResponse } from './api-response'

type ErrorPayload = {
  error: string
  issues?: unknown[]
}

async function getJson<T>(res: Response): Promise<T> {
  return await res.json()
}

describe('api-response', () => {
  describe('jsonResponse', () => {
    it('creates a standard JSON response', async () => {
      const res = jsonResponse({ ok: true }, { status: 201 })
      expect(res.status).toBe(201)
      const data = await getJson<{ ok: boolean }>(res)
      expect(data).toEqual({ ok: true })
    })
  })

  describe('handleApiError', () => {
    it('handles ZodError with 422 status', async () => {
      const schema = z.object({ name: z.string().min(1, 'Name required') })
      let zodErr: unknown
      try {
        schema.parse({ name: '' })
      } catch (err) {
        zodErr = err
      }

      expect(zodErr).toBeInstanceOf(ZodError)
      const res = handleApiError(zodErr)
      expect(res.status).toBe(422)
      const body = await getJson<ErrorPayload>(res)
      expect(body.error).toBe('Name required')
      expect(Array.isArray(body.issues)).toBe(true)
    })

    it('handles missing table error with 503 status', async () => {
      const res = handleApiError(new Error('D1_ERROR: no such table: users'))
      expect(res.status).toBe(503)
      const body = await getJson<ErrorPayload>(res)
      expect(body.error).toContain('Apply D1 migrations first')
    })

    it('handles UNIQUE constraint on slug with 409 status', async () => {
      const res = handleApiError(new Error('UNIQUE constraint failed: projects.slug'))
      expect(res.status).toBe(409)
      const body = await getJson<ErrorPayload>(res)
      expect(body.error).toContain('slug already exists')
    })

    it('handles UNIQUE constraint on email with 400 status', async () => {
      const res = handleApiError(new Error('UNIQUE constraint failed: user.email'))
      expect(res.status).toBe(400)
      const body = await getJson<ErrorPayload>(res)
      expect(body.error).toContain('Email already registered')
    })

    it('handles not found error with 404 status', async () => {
      const res = handleApiError(new Error('User not found'))
      expect(res.status).toBe(404)
      const body = await getJson<ErrorPayload>(res)
      expect(body.error).toBe('User not found')
    })

    it('handles client constraint errors with 400 status', async () => {
      const res = handleApiError(new Error('Current password is not valid.'))
      expect(res.status).toBe(400)
      const body = await getJson<ErrorPayload>(res)
      expect(body.error).toBe('Current password is not valid.')
    })

    it('handles unknown error with 500 status and fallback message', async () => {
      const res = handleApiError(new Error('Unexpected network failure'), 'Failed to process request.')
      expect(res.status).toBe(500)
      const body = await getJson<ErrorPayload>(res)
      expect(body.error).toBe('Failed to process request.')
    })
  })
})
