import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
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
        before: async () => {
          // Public signup is disabled. Owner is created via CLI script, and subsequent users via dashboard.
          return false
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
