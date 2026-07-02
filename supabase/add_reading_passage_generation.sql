-- Editorial lifecycle + AI generation metadata for reading passages.
-- status  = draft (admin-only, under review) | published (publicly readable)
-- is_active stays the listing-visibility toggle for published passages, so
-- deactivated passages remain readable on old submission review pages.
ALTER TABLE reading_passages
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published'
    CHECK (status IN ('draft', 'published')),
  ADD COLUMN IF NOT EXISTS generation_metadata jsonb;

-- Drafts must not be publicly readable
DROP POLICY IF EXISTS "Public read reading_passages" ON reading_passages;

CREATE POLICY "Public read reading_passages"
  ON reading_passages FOR SELECT
  USING (
    status = 'published'
    OR EXISTS (
      SELECT 1 FROM user_settings
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
