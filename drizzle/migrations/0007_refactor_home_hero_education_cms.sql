ALTER TABLE `home_config` RENAME COLUMN "show_stats" TO "show_education";--> statement-breakpoint
ALTER TABLE `home_config` ADD `education_university` text DEFAULT 'Universitas Sriwijaya' NOT NULL;--> statement-breakpoint
ALTER TABLE `home_config` ADD `education_major_en` text DEFAULT 'Information Management' NOT NULL;--> statement-breakpoint
ALTER TABLE `home_config` ADD `education_major_id` text DEFAULT 'Manajemen Informatika' NOT NULL;--> statement-breakpoint
ALTER TABLE `home_config` ADD `education_gpa` text DEFAULT '3.98' NOT NULL;--> statement-breakpoint
ALTER TABLE `home_config` DROP COLUMN `stats_json`;