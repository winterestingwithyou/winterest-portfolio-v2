CREATE TABLE `project_gallery_images` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`url` text NOT NULL,
	`alt_en` text DEFAULT '' NOT NULL,
	`alt_id` text DEFAULT '' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `project_gallery_images_project_url_unique` ON `project_gallery_images` (`project_id`,`url`);--> statement-breakpoint
CREATE INDEX `project_gallery_images_project_order_idx` ON `project_gallery_images` (`project_id`,`sort_order`);--> statement-breakpoint
ALTER TABLE `project_translations` ADD `cover_image_alt` text DEFAULT '' NOT NULL;