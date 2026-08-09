ALTER TABLE `projects` ADD `repo_visibility` text DEFAULT 'public' NOT NULL;--> statement-breakpoint
ALTER TABLE `projects` ADD `production_url` text;--> statement-breakpoint
ALTER TABLE `projects` DROP COLUMN `content`;--> statement-breakpoint
ALTER TABLE `projects` DROP COLUMN `case_study_url`;--> statement-breakpoint
ALTER TABLE `project_translations` DROP COLUMN `content`;