# Future Task: China Payment Integration (WeChat Pay + Alipay)

## Context
The primary IELTSBoost market is Chinese IELTS learners **in China** — they don't have international cards. WeChat Pay and Alipay are essential, not optional. Stripe supports Alipay for one-time payments, and Tenpay Global handles WeChat Pay for international merchants. No Chinese business license needed.

## Payment Model
Instead of recurring subscriptions, use **one-time payments that add days to the account**. This avoids the Alipay/WeChat recurring billing limitation entirely.

### Pricing Tiers (China — RMB)
| Plan | Price | Days Added | Savings |
|------|-------|------------|---------|
| 1 month | ¥200 | 30 days | — |
| 3 months | ¥500 | 90 days | Save ¥100 (17% off) |
| 6 months | ¥900 | 180 days | Save ¥300 (25% off) |

### International pricing stays as-is
$29/month recurring via Stripe (card, Apple Pay, Google Pay).

## Implementation Steps

### 1. Database Changes
- Add `pro_expires_at` timestamp column to `user_settings`
- Pro access is granted when `pro_expires_at > now()` OR `plan_type = 'pro'` (for Stripe subscribers)
- Each purchase adds days to the current `pro_expires_at` (stacks if they buy again before expiry)

### 2. Upgrade Page Updates
- Redesign the China payment card to show 3 bundle options (1/3/6 months)
- Each option triggers a one-time Stripe Alipay payment or WeChat Pay
- Remove "Coming Soon" label

### 3. Stripe Alipay Setup
- Enable Alipay in Stripe Dashboard > Payment Methods
- Create one-time payment intents (not subscriptions) with Alipay as payment method
- API route to create payment intent with correct amount in CNY
- Webhook handles `payment_intent.succeeded` to add days to account

### 4. WeChat Pay Setup
- Option A: Stripe also supports WeChat Pay for one-time payments — try this first
- Option B: Tenpay Global (WeChat's official cross-border solution) if Stripe doesn't work
- Option C: Aggregator like Airwallex or Pingpong that wraps both

### 5. Expiry Logic
- Middleware or API check: if `pro_expires_at` has passed, auto-downgrade `plan_type` to "free"
- Show remaining days in settings page
- Send reminder when approaching expiry (email or in-app notification)

### 6. Success Flow
- After payment, redirect to /welcome-to-pro (same page)
- Show how many days were added and when Pro expires

## Fees
- Stripe Alipay: ~2.9% + $0.30 per transaction
- Native Alipay cross-border: ~2% per transaction
- WeChat Pay cross-border: similar to Alipay

## Notes
- Most Chinese IELTS test takers are preparing for 2-4 months, so the 3-month bundle is the natural sweet spot
- Longer plans reduce churn and lock in revenue
- Consider adding a countdown/expiry indicator on the dashboard
- This model could also work for international users who prefer not to subscribe (offer both options)
