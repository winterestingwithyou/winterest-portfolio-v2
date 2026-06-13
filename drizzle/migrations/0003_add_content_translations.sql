CREATE TABLE `project_translations` (
	`project_id` text NOT NULL,
	`locale` text NOT NULL,
	`title` text NOT NULL,
	`summary` text NOT NULL,
	`description` text,
	`content` text,
	`category` text DEFAULT 'Project' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`project_id`, `locale`),
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `project_translations_locale_idx` ON `project_translations` (`locale`);
--> statement-breakpoint
INSERT INTO `project_translations` (
	`project_id`,
	`locale`,
	`title`,
	`summary`,
	`description`,
	`content`,
	`category`,
	`created_at`,
	`updated_at`
)
SELECT
	`id`,
	'en',
	`title`,
	`summary`,
	`description`,
	`content`,
	`category`,
	`created_at`,
	`updated_at`
FROM `projects`;
--> statement-breakpoint
INSERT INTO `project_translations` (
	`project_id`,
	`locale`,
	`title`,
	`summary`,
	`description`,
	`content`,
	`category`,
	`created_at`,
	`updated_at`
)
SELECT
	`id`,
	'id',
	`title`,
	`summary`,
	`description`,
	`content`,
	`category`,
	`created_at`,
	`updated_at`
FROM `projects`;
--> statement-breakpoint
CREATE TABLE `writing_translations` (
	`writing_id` text NOT NULL,
	`locale` text NOT NULL,
	`title` text NOT NULL,
	`summary` text NOT NULL,
	`content` text,
	`tags` text DEFAULT '[]' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`writing_id`, `locale`),
	FOREIGN KEY (`writing_id`) REFERENCES `writing`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `writing_translations_locale_idx` ON `writing_translations` (`locale`);
--> statement-breakpoint
INSERT INTO `writing_translations` (
	`writing_id`,
	`locale`,
	`title`,
	`summary`,
	`content`,
	`tags`,
	`created_at`,
	`updated_at`
)
SELECT
	`id`,
	'en',
	`title`,
	`summary`,
	`content`,
	`tags`,
	`created_at`,
	`updated_at`
FROM `writing`;
--> statement-breakpoint
INSERT INTO `writing_translations` (
	`writing_id`,
	`locale`,
	`title`,
	`summary`,
	`content`,
	`tags`,
	`created_at`,
	`updated_at`
)
SELECT
	`id`,
	'id',
	`title`,
	`summary`,
	`content`,
	`tags`,
	`created_at`,
	`updated_at`
FROM `writing`;
--> statement-breakpoint
CREATE TABLE `lab_entry_translations` (
	`lab_entry_id` text NOT NULL,
	`locale` text NOT NULL,
	`title` text NOT NULL,
	`summary` text NOT NULL,
	`content` text,
	`tags` text DEFAULT '[]' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`lab_entry_id`, `locale`),
	FOREIGN KEY (`lab_entry_id`) REFERENCES `lab_entries`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `lab_entry_translations_locale_idx` ON `lab_entry_translations` (`locale`);
--> statement-breakpoint
INSERT INTO `lab_entry_translations` (
	`lab_entry_id`,
	`locale`,
	`title`,
	`summary`,
	`content`,
	`tags`,
	`created_at`,
	`updated_at`
)
SELECT
	`id`,
	'en',
	`title`,
	`summary`,
	`content`,
	`tags`,
	`created_at`,
	`updated_at`
FROM `lab_entries`;
--> statement-breakpoint
INSERT INTO `lab_entry_translations` (
	`lab_entry_id`,
	`locale`,
	`title`,
	`summary`,
	`content`,
	`tags`,
	`created_at`,
	`updated_at`
)
SELECT
	`id`,
	'id',
	`title`,
	`summary`,
	`content`,
	`tags`,
	`created_at`,
	`updated_at`
FROM `lab_entries`;
