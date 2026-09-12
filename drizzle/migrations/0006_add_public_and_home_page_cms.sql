CREATE TABLE `home_config` (
	`id` text PRIMARY KEY DEFAULT 'default' NOT NULL,
	`hero_eyebrow_en` text DEFAULT '' NOT NULL,
	`hero_eyebrow_id` text DEFAULT '' NOT NULL,
	`hero_title_en` text DEFAULT '' NOT NULL,
	`hero_title_id` text DEFAULT '' NOT NULL,
	`hero_intro_en` text DEFAULT '' NOT NULL,
	`hero_intro_id` text DEFAULT '' NOT NULL,
	`hero_intro_suffix_en` text DEFAULT '' NOT NULL,
	`hero_intro_suffix_id` text DEFAULT '' NOT NULL,
	`show_stats` integer DEFAULT true NOT NULL,
	`stats_json` text DEFAULT '[]' NOT NULL,
	`featured_eyebrow_en` text DEFAULT '' NOT NULL,
	`featured_eyebrow_id` text DEFAULT '' NOT NULL,
	`featured_title_en` text DEFAULT '' NOT NULL,
	`featured_title_id` text DEFAULT '' NOT NULL,
	`featured_description_en` text DEFAULT '' NOT NULL,
	`featured_description_id` text DEFAULT '' NOT NULL,
	`show_featured_description` integer DEFAULT true NOT NULL,
	`enthusiasms_eyebrow_en` text DEFAULT '' NOT NULL,
	`enthusiasms_eyebrow_id` text DEFAULT '' NOT NULL,
	`enthusiasms_title_en` text DEFAULT '' NOT NULL,
	`enthusiasms_title_id` text DEFAULT '' NOT NULL,
	`enthusiasms_description_en` text DEFAULT '' NOT NULL,
	`enthusiasms_description_id` text DEFAULT '' NOT NULL,
	`show_enthusiasms_description` integer DEFAULT true NOT NULL,
	`marquee_eyebrow_en` text DEFAULT '' NOT NULL,
	`marquee_eyebrow_id` text DEFAULT '' NOT NULL,
	`marquee_title_en` text DEFAULT '' NOT NULL,
	`marquee_title_id` text DEFAULT '' NOT NULL,
	`marquee_description_en` text DEFAULT '' NOT NULL,
	`marquee_description_id` text DEFAULT '' NOT NULL,
	`show_marquee_description` integer DEFAULT true NOT NULL,
	`cta_command` text DEFAULT 'bun run build' NOT NULL,
	`cta_title_en` text DEFAULT '' NOT NULL,
	`cta_title_id` text DEFAULT '' NOT NULL,
	`cta_button_text_en` text DEFAULT '' NOT NULL,
	`cta_button_text_id` text DEFAULT '' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `home_enthusiasms` (
	`id` text PRIMARY KEY NOT NULL,
	`icon` text DEFAULT 'Terminal' NOT NULL,
	`title_en` text NOT NULL,
	`title_id` text NOT NULL,
	`description_en` text NOT NULL,
	`description_id` text NOT NULL,
	`is_enabled` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `home_enthusiasms_is_enabled_idx` ON `home_enthusiasms` (`is_enabled`);--> statement-breakpoint
CREATE INDEX `home_enthusiasms_sort_order_idx` ON `home_enthusiasms` (`sort_order`);--> statement-breakpoint
CREATE TABLE `page_content` (
	`page` text PRIMARY KEY NOT NULL,
	`data_json` text DEFAULT '{}' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
