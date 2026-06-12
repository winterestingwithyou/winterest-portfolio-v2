CREATE TABLE `lab_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`summary` text NOT NULL,
	`content` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`visibility` text DEFAULT 'public' NOT NULL,
	`demo_url` text,
	`repo_url` text,
	`cover_image` text,
	`tags` text DEFAULT '[]' NOT NULL,
	`published_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `lab_entries_slug_unique` ON `lab_entries` (`slug`);--> statement-breakpoint
CREATE INDEX `lab_entries_status_idx` ON `lab_entries` (`status`);--> statement-breakpoint
CREATE INDEX `lab_entries_visibility_idx` ON `lab_entries` (`visibility`);--> statement-breakpoint
CREATE INDEX `lab_entries_published_at_idx` ON `lab_entries` (`published_at`);--> statement-breakpoint
CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`filename` text NOT NULL,
	`url` text NOT NULL,
	`mime_type` text NOT NULL,
	`size` integer DEFAULT 0 NOT NULL,
	`width` integer,
	`height` integer,
	`alt` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `media_filename_idx` ON `media` (`filename`);--> statement-breakpoint
CREATE INDEX `media_mime_type_idx` ON `media` (`mime_type`);--> statement-breakpoint
CREATE TABLE `writing` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`summary` text NOT NULL,
	`content` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`visibility` text DEFAULT 'public' NOT NULL,
	`cover_image` text,
	`tags` text DEFAULT '[]' NOT NULL,
	`published_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `writing_slug_unique` ON `writing` (`slug`);--> statement-breakpoint
CREATE INDEX `writing_status_idx` ON `writing` (`status`);--> statement-breakpoint
CREATE INDEX `writing_visibility_idx` ON `writing` (`visibility`);--> statement-breakpoint
CREATE INDEX `writing_published_at_idx` ON `writing` (`published_at`);