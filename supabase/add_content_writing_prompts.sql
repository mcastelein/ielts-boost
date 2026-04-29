-- Content table for IELTS Writing prompts
CREATE TABLE IF NOT EXISTS writing_prompts (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text        UNIQUE NOT NULL,
  task_type     text        NOT NULL CHECK (task_type IN ('task1', 'task2')),
  topic         text        NOT NULL,
  prompt        text        NOT NULL,
  chart_data    jsonb,
  is_active     boolean     NOT NULL DEFAULT true,
  display_order int         NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_writing_prompts_task_type  ON writing_prompts (task_type)     WHERE is_active;
CREATE INDEX IF NOT EXISTS idx_writing_prompts_slug       ON writing_prompts (slug);
CREATE INDEX IF NOT EXISTS idx_writing_prompts_order      ON writing_prompts (display_order) WHERE is_active;

-- RLS
ALTER TABLE writing_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read writing_prompts"
  ON writing_prompts FOR SELECT
  USING (true);

CREATE POLICY "Admin write writing_prompts"
  ON writing_prompts FOR ALL
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
