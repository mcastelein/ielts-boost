-- Add status column to speaking_submissions for draft tracking
-- Default 'completed' so all existing rows are unaffected
alter table speaking_submissions
  add column if not exists status text not null default 'completed';

-- Index for efficient filtering
create index if not exists idx_speaking_submissions_status
  on speaking_submissions(user_id, status);
