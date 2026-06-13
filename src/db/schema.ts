import { relations, sql } from 'drizzle-orm'
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core'

export const contentStatuses = ['draft', 'published', 'archived'] as const
export type ContentStatus = (typeof contentStatuses)[number]

export const contentVisibilities = ['public', 'private'] as const
export type ContentVisibility = (typeof contentVisibilities)[number]

export const contentLocales = ['en', 'id'] as const
export type ContentLocale = (typeof contentLocales)[number]

export const userRoles = ['owner', 'admin', 'editor', 'viewer'] as const
export type UserRole = (typeof userRoles)[number]

export const technologyCategories = [
  'runtime',
  'framework',
  'database',
  'styling',
  'tooling',
  'service',
  'language',
] as const
export type TechnologyCategory = (typeof technologyCategories)[number]

const timestamps = {
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
}

export const user = sqliteTable(
  'user',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    emailVerified: integer('email_verified', { mode: 'boolean' })
      .notNull()
      .default(false),
    image: text('image'),
    role: text('role', { enum: userRoles }).notNull().default('editor'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [
    uniqueIndex('user_email_unique').on(table.email),
    index('user_role_idx').on(table.role),
  ],
)

export const session = sqliteTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
    token: text('token').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [
    uniqueIndex('session_token_unique').on(table.token),
    index('session_user_id_idx').on(table.userId),
  ],
)

export const account = sqliteTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: integer('access_token_expires_at', {
      mode: 'timestamp',
    }),
    refreshTokenExpiresAt: integer('refresh_token_expires_at', {
      mode: 'timestamp',
    }),
    scope: text('scope'),
    password: text('password'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [
    index('account_user_id_idx').on(table.userId),
    index('account_provider_account_idx').on(table.providerId, table.accountId),
  ],
)

export const verification = sqliteTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)],
)

export const projects = sqliteTable(
  'projects',
  {
    id: text('id').primaryKey(),
    locale: text('locale', { enum: contentLocales }).notNull().default('en'),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    summary: text('summary').notNull(),
    description: text('description'),
    content: text('content'),
    status: text('status', { enum: contentStatuses })
      .notNull()
      .default('draft'),
    visibility: text('visibility', { enum: contentVisibilities })
      .notNull()
      .default('public'),
    featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
    category: text('category').notNull().default('Project'),
    coverImage: text('cover_image'),
    repoUrl: text('repo_url'),
    demoUrl: text('demo_url'),
    caseStudyUrl: text('case_study_url'),
    startedAt: integer('started_at', { mode: 'timestamp' }),
    completedAt: integer('completed_at', { mode: 'timestamp' }),
    publishedAt: integer('published_at', { mode: 'timestamp' }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex('projects_slug_locale_unique').on(table.slug, table.locale),
    index('projects_locale_idx').on(table.locale),
    index('projects_status_idx').on(table.status),
    index('projects_visibility_idx').on(table.visibility),
    index('projects_featured_idx').on(table.featured),
    index('projects_published_at_idx').on(table.publishedAt),
  ],
)

export const writing = sqliteTable(
  'writing',
  {
    id: text('id').primaryKey(),
    locale: text('locale', { enum: contentLocales }).notNull().default('en'),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    summary: text('summary').notNull(),
    content: text('content'),
    status: text('status', { enum: contentStatuses })
      .notNull()
      .default('draft'),
    visibility: text('visibility', { enum: contentVisibilities })
      .notNull()
      .default('public'),
    coverImage: text('cover_image'),
    tags: text('tags').notNull().default('[]'),
    publishedAt: integer('published_at', { mode: 'timestamp' }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex('writing_slug_locale_unique').on(table.slug, table.locale),
    index('writing_locale_idx').on(table.locale),
    index('writing_status_idx').on(table.status),
    index('writing_visibility_idx').on(table.visibility),
    index('writing_published_at_idx').on(table.publishedAt),
  ],
)

export const labEntries = sqliteTable(
  'lab_entries',
  {
    id: text('id').primaryKey(),
    locale: text('locale', { enum: contentLocales }).notNull().default('en'),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    summary: text('summary').notNull(),
    content: text('content'),
    status: text('status', { enum: contentStatuses })
      .notNull()
      .default('draft'),
    visibility: text('visibility', { enum: contentVisibilities })
      .notNull()
      .default('public'),
    demoUrl: text('demo_url'),
    repoUrl: text('repo_url'),
    coverImage: text('cover_image'),
    tags: text('tags').notNull().default('[]'),
    publishedAt: integer('published_at', { mode: 'timestamp' }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex('lab_entries_slug_locale_unique').on(table.slug, table.locale),
    index('lab_entries_locale_idx').on(table.locale),
    index('lab_entries_status_idx').on(table.status),
    index('lab_entries_visibility_idx').on(table.visibility),
    index('lab_entries_published_at_idx').on(table.publishedAt),
  ],
)

export const media = sqliteTable(
  'media',
  {
    id: text('id').primaryKey(),
    filename: text('filename').notNull(),
    url: text('url').notNull(),
    mimeType: text('mime_type').notNull(),
    size: integer('size').notNull().default(0),
    width: integer('width'),
    height: integer('height'),
    alt: text('alt'),
    ...timestamps,
  },
  (table) => [
    index('media_filename_idx').on(table.filename),
    index('media_mime_type_idx').on(table.mimeType),
  ],
)

export const technologies = sqliteTable(
  'technologies',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    category: text('category', { enum: technologyCategories })
      .notNull()
      .default('tooling'),
    icon: text('icon'),
    color: text('color'),
    url: text('url'),
    description: text('description'),
    ...timestamps,
  },
  (table) => [
    uniqueIndex('technologies_slug_unique').on(table.slug),
    index('technologies_category_idx').on(table.category),
  ],
)

export const projectTechnologies = sqliteTable(
  'project_technologies',
  {
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    technologyId: text('technology_id')
      .notNull()
      .references(() => technologies.id, { onDelete: 'cascade' }),
  },
  (table) => [
    primaryKey({
      columns: [table.projectId, table.technologyId],
      name: 'project_technologies_pk',
    }),
    index('project_technologies_project_id_idx').on(table.projectId),
    index('project_technologies_technology_id_idx').on(table.technologyId),
  ],
)

export const projectsRelations = relations(projects, ({ many }) => ({
  projectTechnologies: many(projectTechnologies),
}))

export const technologiesRelations = relations(technologies, ({ many }) => ({
  projectTechnologies: many(projectTechnologies),
}))

export const projectTechnologiesRelations = relations(
  projectTechnologies,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectTechnologies.projectId],
      references: [projects.id],
    }),
    technology: one(technologies, {
      fields: [projectTechnologies.technologyId],
      references: [technologies.id],
    }),
  }),
)

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))
