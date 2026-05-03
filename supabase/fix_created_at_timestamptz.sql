-- Convert legacy `timestamp` (no TZ) columns to `timestamptz` so all 4 sections
-- sort consistently in the client. Reading & listening already use timestamptz;
-- writing & speaking were created earlier with the wrong type.
--
-- Existing values are interpreted as UTC (they came from now() which is UTC,
-- and the API never wrote local-time strings).

ALTER TABLE writing_submissions
  ALTER COLUMN created_at TYPE timestamptz USING created_at AT TIME ZONE 'UTC';

ALTER TABLE writing_feedback
  ALTER COLUMN created_at TYPE timestamptz USING created_at AT TIME ZONE 'UTC';

ALTER TABLE speaking_submissions
  ALTER COLUMN created_at TYPE timestamptz USING created_at AT TIME ZONE 'UTC';

ALTER TABLE speaking_feedback
  ALTER COLUMN created_at TYPE timestamptz USING created_at AT TIME ZONE 'UTC';
