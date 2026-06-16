-- Onboarding survey answers captured during the new survey-first welcome flow.
-- All columns are nullable so the migration is safe to run any time and the
-- onboarding API can write them best-effort.
alter table user_settings
  add column if not exists self_level text,
  add column if not exists target_band numeric,
  add column if not exists exam_date date,
  add column if not exists focus text,
  add column if not exists referral_source text,
  add column if not exists referral_other text;
