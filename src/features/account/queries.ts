import { and, count, eq } from 'drizzle-orm'

import type { Database } from '#/db'
import { account, session, user } from '#/db/schema'
import type { UserRecord } from '#/features/users/queries'
import { hashPassword, verifyPassword } from '#/lib/auth/password'

import type { ChangePasswordInput, UpdateProfileInput } from './validation'

export type AccountProfile = UserRecord & {
  sessionCount: number
}

export async function getAccountProfile(
  db: Database,
  userId: string,
): Promise<AccountProfile> {
  const userRecord = await db
    .select()
    .from(user)
    .where(eq(user.id, userId))
    .get()

  if (!userRecord) {
    throw new Error('User not found.')
  }

  const [sessionStat] = await db
    .select({ count: count() })
    .from(session)
    .where(eq(session.userId, userId))

  return {
    ...userRecord,
    sessionCount: sessionStat.count,
  }
}

export async function updateAccountProfile(
  db: Database,
  userId: string,
  input: UpdateProfileInput,
): Promise<AccountProfile> {
  const normalizedEmail = input.email.trim().toLowerCase()

  const existingUser = await db
    .select()
    .from(user)
    .where(eq(user.id, userId))
    .get()

  if (!existingUser) {
    throw new Error('User not found.')
  }

  // Check email uniqueness if email has changed
  if (existingUser.email.toLowerCase() !== normalizedEmail) {
    const duplicate = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, normalizedEmail))
      .get()

    if (duplicate && duplicate.id !== userId) {
      throw new Error('Email is already registered by another account.')
    }
  }

  const now = new Date()

  const updatedUser = await db
    .update(user)
    .set({
      name: input.name.trim(),
      email: normalizedEmail,
      updatedAt: now,
    })
    .where(eq(user.id, userId))
    .returning()
    .get()

  const [sessionStat] = await db
    .select({ count: count() })
    .from(session)
    .where(eq(session.userId, userId))

  return {
    ...updatedUser,
    sessionCount: sessionStat.count,
  }
}

export async function changeAccountPassword(
  db: Database,
  userId: string,
  input: ChangePasswordInput,
): Promise<void> {
  const credentialAccount = await db
    .select()
    .from(account)
    .where(
      and(
        eq(account.userId, userId),
        eq(account.providerId, 'credential'),
      ),
    )
    .get()

  if (!credentialAccount || !credentialAccount.password) {
    throw new Error('No credential password found for this account.')
  }

  const isValidPassword = await verifyPassword({
    hash: credentialAccount.password,
    password: input.currentPassword,
  })

  if (!isValidPassword) {
    throw new Error('Current password is incorrect.')
  }

  const hashedPassword = await hashPassword(input.newPassword)
  const now = new Date()

  await db
    .update(account)
    .set({
      password: hashedPassword,
      updatedAt: now,
    })
    .where(eq(account.id, credentialAccount.id))
}
