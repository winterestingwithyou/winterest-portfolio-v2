import { and, count, desc, eq } from 'drizzle-orm'

import type { Database } from '#/db'
import { account, session, user } from '#/db/schema'
import type { UserRole } from '#/db/schema'
import { hashPassword } from '#/lib/auth/password'

import type { CreateUserInput, UpdateUserInput } from './validation'

export type UserRecord = typeof user.$inferSelect

export type UserWithSessionCount = UserRecord & {
  sessionCount: number
}

const rolePriority: Record<UserRole, number> = {
  owner: 1,
  admin: 2,
  editor: 3,
}

export async function listUsers(db: Database): Promise<UserWithSessionCount[]> {
  const users = await db.select().from(user).orderBy(desc(user.createdAt)).all()

  // Fetch session counts for each user
  const sessions = await db
    .select({
      userId: session.userId,
      count: count(),
    })
    .from(session)
    .groupBy(session.userId)
    .all()

  const sessionCountMap = new Map<string, number>()
  for (const s of sessions) {
    sessionCountMap.set(s.userId, s.count)
  }

  const result: UserWithSessionCount[] = users.map((u) => ({
    ...u,
    sessionCount: sessionCountMap.get(u.id) ?? 0,
  }))

  // Sort by role priority first (owner -> admin -> editor), then by createdAt desc
  return result.sort((a, b) => {
    const pA = rolePriority[a.role]
    const pB = rolePriority[b.role]
    if (pA !== pB) {
      return pA - pB
    }
    const timeA = a.createdAt.getTime()
    const timeB = b.createdAt.getTime()
    return timeB - timeA
  })
}

export async function getUserById(
  db: Database,
  id: string,
): Promise<UserRecord | null> {
  const record = await db
    .select()
    .from(user)
    .where(eq(user.id, id))
    .get()

  return record ?? null
}

export async function createUser(
  db: Database,
  input: CreateUserInput,
): Promise<UserRecord> {
  const normalizedEmail = input.email.trim().toLowerCase()

  // Verify email uniqueness
  const existing = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, normalizedEmail))
    .get()

  if (existing) {
    throw new Error('Email is already registered.')
  }

  // Enforce 1 owner rule
  if (input.role === 'owner') {
    const ownerStat = await db
      .select({ count: count() })
      .from(user)
      .where(eq(user.role, 'owner'))
      .get()

    if ((ownerStat?.count ?? 0) >= 1) {
      throw new Error('Only 1 owner account is allowed in this portfolio.')
    }
  }

  const userId = crypto.randomUUID()
  const accountId = crypto.randomUUID()
  const now = new Date()

  const hashedPassword = await hashPassword(input.password)

  // Insert user record
  const createdUser = await db
    .insert(user)
    .values({
      id: userId,
      name: input.name.trim(),
      email: normalizedEmail,
      emailVerified: false,
      role: input.role,
      createdAt: now,
      updatedAt: now,
    })
    .returning()
    .get()

  // Insert credential account record for Better Auth
  await db.insert(account).values({
    id: accountId,
    accountId: userId,
    providerId: 'credential',
    userId: userId,
    password: hashedPassword,
    createdAt: now,
    updatedAt: now,
  })

  return createdUser
}

export async function updateUser(
  db: Database,
  _currentUserId: string,
  input: UpdateUserInput,
): Promise<UserRecord> {
  const normalizedEmail = input.email.trim().toLowerCase()

  const targetUser = await getUserById(db, input.id)
  if (!targetUser) {
    throw new Error('User not found.')
  }

  // Check email uniqueness if email has changed
  if (targetUser.email.toLowerCase() !== normalizedEmail) {
    const existing = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, normalizedEmail))
      .get()

    if (existing && existing.id !== input.id) {
      throw new Error('Email is already registered by another account.')
    }
  }

  // Enforce 1 owner rule: Cannot promote to owner if one already exists
  if (targetUser.role !== 'owner' && input.role === 'owner') {
    const ownerStat = await db
      .select({ count: count() })
      .from(user)
      .where(eq(user.role, 'owner'))
      .get()

    if ((ownerStat?.count ?? 0) >= 1) {
      throw new Error('Only 1 owner account is allowed in this portfolio.')
    }
  }

  // Enforce 1 owner rule: Cannot demote the sole owner
  if (targetUser.role === 'owner' && input.role !== 'owner') {
    throw new Error('Cannot change owner role: the portfolio must have exactly one owner.')
  }

  const updatedUser = await db
    .update(user)
    .set({
      name: input.name.trim(),
      email: normalizedEmail,
      role: input.role,
      updatedAt: new Date(),
    })
    .where(eq(user.id, input.id))
    .returning()
    .get()

  return updatedUser
}

export async function resetUserPassword(
  db: Database,
  targetUserId: string,
  newPassword: string,
): Promise<void> {
  const targetUser = await getUserById(db, targetUserId)
  if (!targetUser) {
    throw new Error('User not found.')
  }

  const hashedPassword = await hashPassword(newPassword)
  const now = new Date()

  // Find existing credential account
  const existingAccount = await db
    .select({ id: account.id })
    .from(account)
    .where(
      and(
        eq(account.userId, targetUserId),
        eq(account.providerId, 'credential'),
      ),
    )
    .get()

  if (existingAccount) {
    await db
      .update(account)
      .set({
        password: hashedPassword,
        updatedAt: now,
      })
      .where(eq(account.id, existingAccount.id))
  } else {
    await db.insert(account).values({
      id: crypto.randomUUID(),
      accountId: targetUserId,
      providerId: 'credential',
      userId: targetUserId,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    })
  }

  // Revoke all existing sessions for the target user to require fresh login
  await db.delete(session).where(eq(session.userId, targetUserId))
}

export async function deleteUser(
  db: Database,
  currentUserId: string,
  targetUserId: string,
): Promise<void> {
  if (currentUserId === targetUserId) {
    throw new Error('Cannot delete your own account.')
  }

  const targetUser = await getUserById(db, targetUserId)
  if (!targetUser) {
    throw new Error('User not found.')
  }

  // Enforce 1 owner rule: Owner cannot be deleted
  if (targetUser.role === 'owner') {
    throw new Error('Cannot delete the owner account.')
  }

  // Deleting user will cascade delete accounts and sessions thanks to foreign key onDelete: 'cascade'
  await db.delete(user).where(eq(user.id, targetUserId))
}
