ALTER TABLE `technologies` ADD `is_ultimate` integer DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX `technologies_is_ultimate_idx` ON `technologies` (`is_ultimate`);--> statement-breakpoint
ALTER TABLE `technologies` DROP COLUMN `description`;--> statement-breakpoint
ALTER TABLE `categories` DROP COLUMN `description`;