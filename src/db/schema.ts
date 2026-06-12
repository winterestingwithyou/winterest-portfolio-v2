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

export const projects = sqliteTable(
  'projects',
  {
    id: text('id').primaryKey(),
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
    uniqueIndex('projects_slug_unique').on(table.slug),
    index('projects_status_idx').on(table.status),
    index('projects_visibility_idx').on(table.visibility),
    index('projects_featured_idx').on(table.featured),
    index('projects_published_at_idx').on(table.publishedAt),
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
