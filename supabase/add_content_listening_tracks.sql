-- Content table for IELTS Listening tracks
CREATE TABLE IF NOT EXISTS listening_tracks (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                  text        UNIQUE NOT NULL,
  title                 text        NOT NULL,
  section               smallint    NOT NULL CHECK (section IN (1, 2, 3, 4)),
  difficulty            smallint    NOT NULL CHECK (difficulty IN (1, 2, 3)),
  topic_tags            text[]      NOT NULL DEFAULT '{}',
  context               text        NOT NULL,
  transcript            text        NOT NULL,
  question_groups       jsonb       NOT NULL DEFAULT '[]',
  audio_url             text,                          -- public Storage URL, null until generated
  transcript_updated_at timestamptz NOT NULL DEFAULT now(),
  audio_generated_at    timestamptz,                   -- null until generate-audio.ts runs
  is_active             boolean     NOT NULL DEFAULT true,
  display_order         int         NOT NULL DEFAULT 0,
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- Auto-update transcript_updated_at whenever the transcript column changes
CREATE OR REPLACE FUNCTION fn_listening_tracks_transcript_updated()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.transcript IS DISTINCT FROM OLD.transcript THEN
    NEW.transcript_updated_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_listening_tracks_transcript_updated
  BEFORE UPDATE ON listening_tracks
  FOR EACH ROW
  EXECUTE FUNCTION fn_listening_tracks_transcript_updated();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_listening_tracks_slug       ON listening_tracks (slug);
CREATE INDEX IF NOT EXISTS idx_listening_tracks_section    ON listening_tracks (section)      WHERE is_active;
CREATE INDEX IF NOT EXISTS idx_listening_tracks_difficulty ON listening_tracks (difficulty)   WHERE is_active;
CREATE INDEX IF NOT EXISTS idx_listening_tracks_order      ON listening_tracks (display_order) WHERE is_active;
CREATE INDEX IF NOT EXISTS idx_listening_tracks_topic_tags ON listening_tracks USING GIN (topic_tags);
-- Index to quickly find tracks needing audio (re)generation
CREATE INDEX IF NOT EXISTS idx_listening_tracks_stale_audio
  ON listening_tracks (slug)
  WHERE audio_generated_at IS NULL OR audio_generated_at < transcript_updated_at;

-- RLS
ALTER TABLE listening_tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read listening_tracks"
  ON listening_tracks FOR SELECT
  USING (true);

CREATE POLICY "Admin write listening_tracks"
  ON listening_tracks FOR ALL
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
