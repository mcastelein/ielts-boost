# IELTSBoost Database Schema

## users
Handled by Supabase Auth

---

## user_settings

create table user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  ui_language text default 'en',
  feedback_language text default 'en',
  plan_type text default 'free',
  role text default 'user',
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamp default now()
);

---

## writing_submissions

create table writing_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  input_type text,
  file_url text,
  extracted_text text,
  final_text text,
  task_type text,
  prompt_topic text,
  time_used_seconds int,
  created_at timestamp default now()
);

---

## writing_feedback

create table writing_feedback (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid,
  overall_band numeric,
  task_score numeric,
  coherence_score numeric,
  lexical_score numeric,
  grammar_score numeric,
  feedback_json jsonb,
  created_at timestamp default now()
);

---

## usage_tracking

create table usage_tracking (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  date date,
  writing_count int default 0,
  speaking_count int default 0
);

---

## speaking_submissions

create table speaking_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  prompt text,
  response_text text,
  status text not null default 'completed',
  created_at timestamp default now()
);

---

## speaking_feedback

create table speaking_feedback (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid,
  estimated_band numeric,
  fluency_score numeric,
  lexical_score numeric,
  grammar_score numeric,
  pronunciation_score numeric,
  feedback_json jsonb,
  created_at timestamp default now()
);

---

## api_usage_log

create table api_usage_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  call_type text not null,
  model text not null,
  input_tokens int,
  output_tokens int,
  estimated_cost_usd numeric,
  duration_ms int,
  metadata jsonb,
  created_at timestamp default now()
);