-- Migration 002: Add admin flag and prepare for subscriptions
-- Run: wrangler d1 execute codelearner-db --file=migrations/002_add_admin_flag.sql

ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0;
