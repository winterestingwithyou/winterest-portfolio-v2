PRAGMA foreign_keys = OFF;

-- Junction & Child Tables
DROP TABLE IF EXISTS `project_technologies`;
DROP TABLE IF EXISTS `project_translations`;
DROP TABLE IF EXISTS `technology_categories`;

-- Content & Master Tables
DROP TABLE IF EXISTS `projects`;
DROP TABLE IF EXISTS `technologies`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `media`;
DROP TABLE IF EXISTS `site_settings`;

-- Legacy / Future Tables (if any)
DROP TABLE IF EXISTS `lab_entry_translations`;
DROP TABLE IF EXISTS `lab_entries`;
DROP TABLE IF EXISTS `writing_translations`;
DROP TABLE IF EXISTS `writing`;

-- Auth Tables
DROP TABLE IF EXISTS `session`;
DROP TABLE IF EXISTS `account`;
DROP TABLE IF EXISTS `verification`;
DROP TABLE IF EXISTS `user`;

-- Wrangler Migration Meta Table
DROP TABLE IF EXISTS `d1_migrations`;

PRAGMA foreign_keys = ON;
