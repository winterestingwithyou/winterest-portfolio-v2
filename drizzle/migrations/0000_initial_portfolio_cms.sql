CREATE TABLE `project_technologies` (
	`project_id` text NOT NULL,
	`technology_id` text NOT NULL,
	PRIMARY KEY(`project_id`, `technology_id`),
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`technology_id`) REFERENCES `technologies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `project_technologies_project_id_idx` ON `project_technologies` (`project_id`);--> statement-breakpoint
CREATE INDEX `project_technologies_technology_id_idx` ON `project_technologies` (`technology_id`);--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`summary` text NOT NULL,
	`description` text,
	`content` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`visibility` text DEFAULT 'public' NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`category` text DEFAULT 'Project' NOT NULL,
	`cover_image` text,
	`repo_url` text,
	`demo_url` text,
	`case_study_url` text,
	`started_at` integer,
	`completed_at` integer,
	`published_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `projects_slug_unique` ON `projects` (`slug`);--> statement-breakpoint
CREATE INDEX `projects_status_idx` ON `projects` (`status`);--> statement-breakpoint
CREATE INDEX `projects_visibility_idx` ON `projects` (`visibility`);--> statement-breakpoint
CREATE INDEX `projects_featured_idx` ON `projects` (`featured`);--> statement-breakpoint
CREATE INDEX `projects_published_at_idx` ON `projects` (`published_at`);--> statement-breakpoint
CREATE TABLE `technologies` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`category` text DEFAULT 'tooling' NOT NULL,
	`icon` text,
	`color` text,
	`url` text,
	`description` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `technologies_slug_unique` ON `technologies` (`slug`);--> statement-breakpoint
CREATE INDEX `technologies_category_idx` ON `technologies` (`category`);