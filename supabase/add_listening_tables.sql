-- Listening submissions table
CREATE TABLE IF NOT EXISTS listening_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  track_slug text NOT NULL,
  track_title text NOT NULL,
  section integer NOT NULL,
  answers_json jsonb NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Listening feedback table
CREATE TABLE IF NOT EXISTS listening_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid REFERENCES listening_submissions(id) ON DELETE CASCADE NOT NULL,
  raw_score integer NOT NULL DEFAULT 0,
  total_questions integer NOT NULL DEFAULT 0,
  band_score numeric(3,1) NOT NULL DEFAULT 0,
  question_results jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Row-level security
ALTER TABLE listening_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE listening_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own listening submissions"
  ON listening_submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own listening submissions"
  ON listening_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own listening submissions"
  ON listening_submissions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own listening feedback"
  ON listening_feedback FOR SELECT
  USING (
    submission_id IN (
      SELECT id FROM listening_submissions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can insert listening feedback"
  ON listening_feedback FOR INSERT
  WITH CHECK (true);

-- Add listening_count to usage_tracking (if not already present)
ALTER TABLE usage_tracking
  ADD COLUMN IF NOT EXISTS listening_count integer NOT NULL DEFAULT 0;

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_listening_submissions_user_id ON listening_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_listening_feedback_submission_id ON listening_feedback(submission_id);
