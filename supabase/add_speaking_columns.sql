-- Add 'part' column to speaking_submissions (stores which IELTS speaking part: 1, 2, or 3)
ALTER TABLE speaking_submissions ADD COLUMN IF NOT EXISTS part smallint;

-- Add 'estimated_band' column to speaking_feedback (extracted from feedback_json for queryability)
ALTER TABLE speaking_feedback ADD COLUMN IF NOT EXISTS estimated_band numeric(3,1);

-- Backfill estimated_band from existing feedback_json
UPDATE speaking_feedback
SET estimated_band = (feedback_json->>'estimated_band')::numeric(3,1)
WHERE estimated_band IS NULL
  AND feedback_json->>'estimated_band' IS NOT NULL;
