ALTER TABLE `projects` ADD `locale` text DEFAULT 'en' NOT NULL;--> statement-breakpoint
ALTER TABLE `writing` ADD `locale` text DEFAULT 'en' NOT NULL;--> statement-breakpoint
ALTER TABLE `lab_entries` ADD `locale` text DEFAULT 'en' NOT NULL;--> statement-breakpoint
DROP INDEX `projects_slug_unique`;--> statement-breakpoint
DROP INDEX `writing_slug_unique`;--> statement-breakpoint
DROP INDEX `lab_entries_slug_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `projects_slug_locale_unique` ON `projects` (`slug`, `locale`);--> statement-breakpoint
CREATE UNIQUE INDEX `writing_slug_locale_unique` ON `writing` (`slug`, `locale`);--> statement-breakpoint
CREATE UNIQUE INDEX `lab_entries_slug_locale_unique` ON `lab_entries` (`slug`, `locale`);--> statement-breakpoint
CREATE INDEX `projects_locale_idx` ON `projects` (`locale`);--> statement-breakpoint
CREATE INDEX `writing_locale_idx` ON `writing` (`locale`);--> statement-breakpoint
CREATE INDEX `lab_entries_locale_idx` ON `lab_entries` (`locale`);
