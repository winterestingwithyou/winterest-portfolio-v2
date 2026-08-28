CREATE TABLE `social_links` (
	`id` text PRIMARY KEY NOT NULL,
	`platform` text NOT NULL,
	`username` text,
	`account_name` text,
	`url` text NOT NULL,
	`is_enabled` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `social_links_platform_unique` ON `social_links` (`platform`);--> statement-breakpoint
CREATE INDEX `social_links_is_enabled_idx` ON `social_links` (`is_enabled`);--> statement-breakpoint
CREATE INDEX `social_links_sort_order_idx` ON `social_links` (`sort_order`);
