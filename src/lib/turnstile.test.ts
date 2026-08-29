import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { verifyTurnstileToken } from './turnstile'

describe('verifyTurnstileToken', () => {
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it('rejects missing or empty token', async () => {
    const result1 = await verifyTurnstileToken({ token: '' })
    expect(result1.success).toBe(false)
    expect(result1.errorCodes).toContain('missing-input-response')

    const result2 = await verifyTurnstileToken({ token: null })
    expect(result2.success).toBe(false)
    expect(result2.errorCodes).toContain('missing-input-response')

    const result3 = await verifyTurnstileToken({ token: '   ' })
    expect(result3.success).toBe(false)
    expect(result3.errorCodes).toContain('missing-input-response')
  })

  it('rejects token exceeding maximum length', async () => {
    const longToken = 'a'.repeat(2049)
    const result = await verifyTurnstileToken({ token: longToken })
    expect(result.success).toBe(false)
    expect(result.errorCodes).toContain('invalid-input-response')
  })

  it('succeeds when Cloudflare siteverify returns success', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          action: 'contact',
          hostname: 'localhost',
          challenge_ts: '2026-08-29T16:00:00Z',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )

    const result = await verifyTurnstileToken({
      token: 'valid_token_123',
      action: 'contact',
      expectedHostnames: ['localhost'],
    })

    expect(result.success).toBe(true)
    expect(result.action).toBe('contact')
    expect(result.hostname).toBe('localhost')
  })

  it('fails when Cloudflare siteverify returns success: false', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          success: false,
          'error-codes': ['invalid-input-response'],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )

    const result = await verifyTurnstileToken({
      token: 'bad_token',
      action: 'contact',
    })

    expect(result.success).toBe(false)
    expect(result.errorCodes).toContain('invalid-input-response')
  })

  it('fails when action does not match', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          action: 'login',
          hostname: 'localhost',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )

    const result = await verifyTurnstileToken({
      token: 'valid_token',
      action: 'contact',
    })

    expect(result.success).toBe(false)
    expect(result.errorCodes).toContain('action-mismatch')
  })

  it('fails when hostname does not match allowed hostnames', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          action: 'contact',
          hostname: 'malicious-domain.com',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )

    const result = await verifyTurnstileToken({
      token: 'valid_token',
      action: 'contact',
      expectedHostnames: ['localhost', '127.0.0.1'],
    })

    expect(result.success).toBe(false)
    expect(result.errorCodes).toContain('hostname-mismatch')
  })

  it('handles upstream HTTP error responses gracefully', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response('Internal Server Error', { status: 500 }),
    )

    const result = await verifyTurnstileToken({
      token: 'valid_token',
      action: 'contact',
    })

    expect(result.success).toBe(false)
    expect(result.errorCodes).toContain('http-500')
  })

  it('handles fetch network timeout or exception', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    const result = await verifyTurnstileToken({
      token: 'valid_token',
      action: 'contact',
    })

    expect(result.success).toBe(false)
    expect(result.errorCodes).toContain('network-error')
  })
})
