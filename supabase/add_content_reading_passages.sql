-- Content table for IELTS Reading passages
CREATE TABLE IF NOT EXISTS reading_passages (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text        UNIQUE NOT NULL,
  title           text        NOT NULL,
  exam_type       text        NOT NULL DEFAULT 'academic',
  difficulty      smallint    NOT NULL CHECK (difficulty IN (1, 2, 3)),
  topic_tags      text[]      NOT NULL DEFAULT '{}',
  passage_text    text        NOT NULL,
  question_groups jsonb       NOT NULL DEFAULT '[]',
  is_active       boolean     NOT NULL DEFAULT true,
  display_order   int         NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reading_passages_slug        ON reading_passages (slug);
CREATE INDEX IF NOT EXISTS idx_reading_passages_difficulty  ON reading_passages (difficulty) WHERE is_active;
CREATE INDEX IF NOT EXISTS idx_reading_passages_order       ON reading_passages (display_order) WHERE is_active;
CREATE INDEX IF NOT EXISTS idx_reading_passages_topic_tags  ON reading_passages USING GIN (topic_tags);

-- RLS
ALTER TABLE reading_passages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read reading_passages"
  ON reading_passages FOR SELECT
  USING (true);

CREATE POLICY "Admin write reading_passages"
  ON reading_passages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_settings
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_settings
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
