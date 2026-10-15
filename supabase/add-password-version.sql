-- Migration: add password_version to users
-- Run once in the Supabase SQL editor.
-- Existing rows get version 1; the column increments on every password change.

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS password_version INT NOT NULL DEFAULT 1;
