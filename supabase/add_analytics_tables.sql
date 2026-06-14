-- Site analytics: raw event stream + per-visitor rollup.
-- All timestamps are timestamptz from the start.

CREATE TABLE IF NOT EXISTS analytics_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id  uuid NOT NULL,
  user_id     uuid REFERENCES auth.users(id),
  event_type  text NOT NULL,            -- 'pageview' | 'milestone' | 'event'
  name        text,
  path        text,
  referrer    text,
  country     text,                     -- ISO-2 from edge header; no raw IP
  user_agent  text,
  session_id  uuid,
  props       jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS analytics_events_visitor_idx ON analytics_events (visitor_id);
CREATE INDEX IF NOT EXISTS analytics_events_user_idx    ON analytics_events (user_id);
CREATE INDEX IF NOT EXISTS analytics_events_created_idx ON analytics_events (created_at);
CREATE INDEX IF NOT EXISTS analytics_events_name_idx    ON analytics_events (name);

CREATE TABLE IF NOT EXISTS analytics_visitors (
  visitor_id     uuid PRIMARY KEY,
  user_id        uuid REFERENCES auth.users(id),  -- set on first authenticated event (the stitch)
  first_seen     timestamptz NOT NULL DEFAULT now(),
  last_seen      timestamptz NOT NULL DEFAULT now(),
  first_referrer text,
  first_path     text,
  country        text
);
CREATE INDEX IF NOT EXISTS analytics_visitors_user_idx ON analytics_visitors (user_id);

-- Upsert a visitor: insert on first sight (capturing attribution), otherwise
-- bump last_seen and stitch user_id once it becomes known (coalesce keeps the
-- first non-null user_id). SECURITY DEFINER so the service role can call it.
CREATE OR REPLACE FUNCTION record_visitor(
  p_visitor_id uuid,
  p_user_id    uuid,
  p_referrer   text,
  p_path       text,
  p_country    text
) RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  INSERT INTO analytics_visitors (visitor_id, user_id, first_referrer, first_path, country)
  VALUES (p_visitor_id, p_user_id, p_referrer, p_path, p_country)
  ON CONFLICT (visitor_id) DO UPDATE
    SET last_seen = now(),
        user_id   = COALESCE(analytics_visitors.user_id, EXCLUDED.user_id);
$$;

-- RLS: all writes go through the service-role client (bypasses RLS). The anon
-- key is never granted insert/select. Admins can read for the dashboard.
ALTER TABLE analytics_events   ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read analytics_events"
  ON analytics_events FOR SELECT
  USING (EXISTS (SELECT 1 FROM user_settings WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can read analytics_visitors"
  ON analytics_visitors FOR SELECT
  USING (EXISTS (SELECT 1 FROM user_settings WHERE user_id = auth.uid() AND role = 'admin'));
