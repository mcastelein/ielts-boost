-- Simple key/value table for admin-configurable settings.
-- Currently stores daily_budget and monthly_budget for cost alerts.

CREATE TABLE IF NOT EXISTS admin_settings (
  key text PRIMARY KEY,
  value jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Only admins should read/write. Service role bypasses RLS so the
-- API route (which uses the user's session) needs an explicit policy.
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read admin_settings"
  ON admin_settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_settings
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can upsert admin_settings"
  ON admin_settings FOR ALL
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
