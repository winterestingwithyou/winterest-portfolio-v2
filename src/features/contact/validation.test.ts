import { describe, expect, it } from 'vitest'

import { contactSchema } from './validation'

describe('contact validation', () => {
  it('validates a valid contact form submission', () => {
    const valid = {
      name: 'Adam Yudistira',
      email: 'adam@example.com',
      subject: 'Collaboration Inquiry',
      message: 'Halo, saya tertarik untuk berkolaborasi dalam proyek ini.',
      turnstileToken: 'test_token',
    }

    const parsed = contactSchema.parse(valid)
    expect(parsed.name).toBe('Adam Yudistira')
    expect(parsed.email).toBe('adam@example.com')
    expect(parsed.subject).toBe('Collaboration Inquiry')
    expect(parsed.message).toBe(
      'Halo, saya tertarik untuk berkolaborasi dalam proyek ini.',
    )
    expect(parsed.turnstileToken).toBe('test_token')
  })

  it('rejects empty name', () => {
    expect(() =>
      contactSchema.parse({
        name: '   ',
        email: 'adam@example.com',
        subject: '',
        message: 'Halo, saya tertarik untuk berkolaborasi.',
        turnstileToken: '',
      }),
    ).toThrow('Nama wajib diisi.')
  })

  it('rejects invalid email formats', () => {
    expect(() =>
      contactSchema.parse({
        name: 'Adam',
        email: 'invalid-email',
        subject: '',
        message: 'Halo, saya tertarik untuk berkolaborasi.',
        turnstileToken: '',
      }),
    ).toThrow('Format email tidak valid.')
  })

  it('rejects message shorter than 10 characters', () => {
    expect(() =>
      contactSchema.parse({
        name: 'Adam',
        email: 'adam@example.com',
        subject: '',
        message: 'Hi',
        turnstileToken: '',
      }),
    ).toThrow('Pesan minimal 10 karakter.')
  })
})
