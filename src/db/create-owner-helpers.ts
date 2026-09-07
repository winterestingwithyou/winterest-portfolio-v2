import { z } from 'zod'

/**
 * Zod schema for owner email validation
 */
export const ownerEmailSchema = z
  .string('Email address is required.')
  .trim()
  .min(1, 'Email address is required.')
  .email('Please enter a valid email address (e.g. you@example.com).')

/**
 * Zod schema for owner password validation (minimum 8 characters)
 */
export const ownerPasswordSchema = z
  .string('Password must be at least 8 characters long.')
  .min(8, 'Password must be at least 8 characters long.')

/**
 * Factory for password confirmation schema
 */
export const createPasswordMatchSchema = (expectedPassword: string) =>
  z
    .string('Please confirm your password.')
    .min(1, 'Please confirm your password.')
    .refine((val) => val === expectedPassword, {
      message: 'Passwords do not match. Please re-enter.',
    })

/**
 * Validates owner email format using Zod.
 * Returns an error string if invalid, or undefined if valid.
 */
export function validateOwnerEmail(value?: string): string | undefined {
  const result = ownerEmailSchema.safeParse(value)
  return result.success ? undefined : result.error.issues[0]?.message
}

/**
 * Validates owner password requirements using Zod.
 * Returns an error string if invalid, or undefined if valid.
 */
export function validateOwnerPassword(value?: string): string | undefined {
  const result = ownerPasswordSchema.safeParse(value)
  return result.success ? undefined : result.error.issues[0]?.message
}

/**
 * Validates that confirmation password matches the primary password using Zod.
 * Returns an error string if invalid, or undefined if valid.
 */
export function validatePasswordMatch(
  password: string,
  confirm?: string,
): string | undefined {
  const result = createPasswordMatchSchema(password).safeParse(confirm)
  return result.success ? undefined : result.error.issues[0]?.message
}

/**
 * Formats owner account summary for Clack note / confirmation display.
 */
export function formatOwnerSummary(data: {
  target: string
  name: string
  email: string
}): string {
  return [
    `Target DB : ${data.target}`,
    `Name      : ${data.name}`,
    `Email     : ${data.email}`,
    `Role      : owner`,
  ].join('\n')
}
