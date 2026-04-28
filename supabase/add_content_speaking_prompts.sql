-- Content table for IELTS Speaking prompts
CREATE TABLE IF NOT EXISTS speaking_prompts (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text        UNIQUE NOT NULL,
  part          smallint    NOT NULL CHECK (part IN (1, 2, 3)),
  topic         text        NOT NULL,
  question      text        NOT NULL,
  follow_up     jsonb,
  is_active     boolean     NOT NULL DEFAULT true,
  display_order int         NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_speaking_prompts_part      ON speaking_prompts (part)      WHERE is_active;
CREATE INDEX IF NOT EXISTS idx_speaking_prompts_slug      ON speaking_prompts (slug);
CREATE INDEX IF NOT EXISTS idx_speaking_prompts_order     ON speaking_prompts (display_order) WHERE is_active;

-- RLS
ALTER TABLE speaking_prompts ENABLE ROW LEVEL SECURITY;

-- Anyone can read active prompts (content is not sensitive)
CREATE POLICY "Public read speaking_prompts"
  ON speaking_prompts FOR SELECT
  USING (true);

-- Only admins can insert / update / delete
CREATE POLICY "Admin write speaking_prompts"
  ON speaking_prompts FOR ALL
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
