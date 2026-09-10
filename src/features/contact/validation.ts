import { z } from 'zod'

import type { ContactValidationCopy } from './copy'
import { contactCopy } from './copy'

export function createContactSchema(copy: ContactValidationCopy) {
  return z.object({
    name: z.string().trim().min(1, copy.nameRequired),
    email: z.string().trim().email(copy.emailInvalid),
    subject: z.string().trim(),
    message: z.string().trim().min(10, copy.messageMinLength),
    turnstileToken: z.string().min(1, copy.turnstileRequired),
  })
}

export const contactSchema = z.object({
  name: z.string().trim().min(1, contactCopy.id.form.validation.nameRequired),
  email: z.string().trim().email(contactCopy.id.form.validation.emailInvalid),
  subject: z.string().trim(),
  message: z
    .string()
    .trim()
    .min(10, contactCopy.id.form.validation.messageMinLength),
  turnstileToken: z.string(),
})

export type ContactInput = z.infer<typeof contactSchema>
