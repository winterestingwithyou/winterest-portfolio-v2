CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
CREATE INDEX `categories_sort_order_idx` ON `categories` (`sort_order`);--> statement-breakpoint
CREATE TABLE `technology_categories` (
	`technology_id` text NOT NULL,
	`category_id` text NOT NULL,
	PRIMARY KEY(`technology_id`, `category_id`),
	FOREIGN KEY (`technology_id`) REFERENCES `technologies`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `technology_categories_technology_id_idx` ON `technology_categories` (`technology_id`);--> statement-breakpoint
CREATE INDEX `technology_categories_category_id_idx` ON `technology_categories` (`category_id`);--> statement-breakpoint
DROP INDEX `technologies_category_idx`;--> statement-breakpoint
ALTER TABLE `technologies` DROP COLUMN `category`;