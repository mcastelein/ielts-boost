-- Add Stripe columns to user_settings for subscription tracking
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS stripe_customer_id text;
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS stripe_subscription_id text;
