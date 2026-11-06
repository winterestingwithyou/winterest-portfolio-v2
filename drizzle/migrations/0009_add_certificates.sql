CREATE TABLE `certificates` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`issuer` text NOT NULL,
	`credential_id` text,
	`description_en` text,
	`description_id` text,
	`cover_image_url` text,
	`pdf_url` text,
	`verification_url` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`issued_at` integer NOT NULL,
	`expires_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `certificates_status_idx` ON `certificates` (`status`);--> statement-breakpoint
CREATE INDEX `certificates_issued_at_idx` ON `certificates` (`issued_at`);