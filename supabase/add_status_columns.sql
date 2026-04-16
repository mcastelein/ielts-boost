-- Add status column to writing_submissions and reading_submissions
-- Matches the existing pattern on speaking_submissions

ALTER TABLE writing_submissions
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft';

ALTER TABLE reading_submissions
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft';

-- Mark all existing rows as completed (they already have feedback)
UPDATE writing_submissions SET status = 'completed' WHERE status = 'draft';
UPDATE reading_submissions SET status = 'completed' WHERE status = 'draft';
