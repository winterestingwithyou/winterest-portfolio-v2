import { z } from 'zod'

import { userRoles } from '#/db/schema'
import type { UserRole } from '#/db/schema'

export const createUserSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.'),
  email: z.string().trim().email('Invalid email address.').toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  role: z.enum(userRoles, {
    message: 'Invalid user role.',
  }),
})

export type CreateUserInput = z.infer<typeof createUserSchema>

export const updateUserSchema = z.object({
  id: z.string().min(1, 'User ID is required.'),
  name: z.string().trim().min(2, 'Name must be at least 2 characters.'),
  email: z.string().trim().email('Invalid email address.').toLowerCase(),
  role: z.enum(userRoles, {
    message: 'Invalid user role.',
  }),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>

export const resetPasswordSchema = z.object({
  id: z.string().min(1, 'User ID is required.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
})

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>

export { userRoles }
export type { UserRole }
