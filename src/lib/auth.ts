import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { count } from 'drizzle-orm'
import { env } from 'cloudflare:workers'

import { getDb } from '#/db'
import * as schema from '#/db/schema'
import { hashPassword, verifyPassword } from '#/lib/auth/password'

const db = getDb(env.DB)

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema,
    transaction: false,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: true,
        input: false,
        defaultValue: 'editor',
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (newUser) => {
          const [{ value }] = await db
            .select({ value: count() })
            .from(schema.user)

          if (value > 0) {
            return false
          }

          return {
            data: {
              ...newUser,
              role: 'owner',
            },
          }
        },
      },
    },
  },
  advanced: {
    ipAddress: {
      ipAddressHeaders: ['cf-connecting-ip', 'x-forwarded-for'],
    },
  },
  plugins: [tanstackStartCookies()],
})
