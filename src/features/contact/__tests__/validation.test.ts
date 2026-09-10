import { describe, expect, it } from 'vitest'

import { contactCopy } from '../copy'
import { contactSchema, createContactSchema } from '../validation'

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

  describe('bilingual createContactSchema', () => {
    it('produces English validation error messages', () => {
      const enSchema = createContactSchema(contactCopy.en.form.validation)

      expect(() =>
        enSchema.parse({
          name: '   ',
          email: 'adam@example.com',
          subject: '',
          message: 'Valid message content goes here',
          turnstileToken: 'token',
        }),
      ).toThrow('Name is required.')

      expect(() =>
        enSchema.parse({
          name: 'Adam',
          email: 'invalid-email',
          subject: '',
          message: 'Valid message content goes here',
          turnstileToken: 'token',
        }),
      ).toThrow('Please enter a valid email address.')

      expect(() =>
        enSchema.parse({
          name: 'Adam',
          email: 'adam@example.com',
          subject: '',
          message: 'Short',
          turnstileToken: 'token',
        }),
      ).toThrow('Message must be at least 10 characters.')

      expect(() =>
        enSchema.parse({
          name: 'Adam',
          email: 'adam@example.com',
          subject: '',
          message: 'Valid message content goes here',
          turnstileToken: '',
        }),
      ).toThrow('Please complete the security check.')
    })

    it('produces Indonesian validation error messages', () => {
      const idSchema = createContactSchema(contactCopy.id.form.validation)

      expect(() =>
        idSchema.parse({
          name: '   ',
          email: 'adam@example.com',
          subject: '',
          message: 'Valid message content goes here',
          turnstileToken: 'token',
        }),
      ).toThrow('Nama wajib diisi.')

      expect(() =>
        idSchema.parse({
          name: 'Adam',
          email: 'invalid-email',
          subject: '',
          message: 'Valid message content goes here',
          turnstileToken: 'token',
        }),
      ).toThrow('Format email tidak valid.')

      expect(() =>
        idSchema.parse({
          name: 'Adam',
          email: 'adam@example.com',
          subject: '',
          message: 'Pendek',
          turnstileToken: 'token',
        }),
      ).toThrow('Pesan minimal 10 karakter.')

      expect(() =>
        idSchema.parse({
          name: 'Adam',
          email: 'adam@example.com',
          subject: '',
          message: 'Valid message content goes here',
          turnstileToken: '',
        }),
      ).toThrow('Verifikasi keamanan wajib diselesaikan.')
    })
  })
})
