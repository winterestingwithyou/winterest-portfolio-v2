import { z } from 'zod'

import type { AuthCopy } from './copy'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required.')
    .email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
})

export type LoginInput = z.infer<typeof loginSchema>

export function createLoginSchema(validationCopy: AuthCopy['validation']) {
  return z.object({
    email: z
      .string()
      .min(1, validationCopy.emailRequired)
      .email(validationCopy.emailInvalid),
    password: z.string().min(1, validationCopy.passwordRequired),
  })
}
