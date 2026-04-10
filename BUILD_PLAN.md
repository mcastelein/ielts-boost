# IELTSBoost Build Plan

## Goal
Build a functional V1 of IELTSBoost in the fastest possible time while maintaining a clean and scalable structure.

---

## Tech Stack

Frontend:
- Next.js (App Router)
- Tailwind CSS

Backend:
- Next.js API routes

Database/Auth/Storage:
- Supabase

AI:
- OpenAI / Claude API (for scoring + OCR if needed)

---

## Project Structure

/app
  /dashboard
  /writing
  /speaking
  /history
  /settings
  /api
/components
/lib
  supabase.ts
  ai.ts
  usage.ts
/i18n
  en.json
  zh.json

---

## Pages

### 1. Landing Page
- CTA: Start Writing Practice

### 2. Dashboard
- Recent submissions
- Mistakes
- Progress

### 3. Writing Page
- Input box
- Upload (image/PDF)
- Submit

### 4. Writing Result Page
- Band score
- Feedback

### 5. Speaking Page
- Prompt
- Input
- Feedback

---

## Build Order (STRICT)

### STEP 1
- Setup Next.js
- Setup Supabase
- Setup Auth (Google)

### STEP 2
- Create writing page (TEXT ONLY first)
- Add submit button

### STEP 3
- Create scoring API
- Return dummy response
- Connect UI

### STEP 4
- Add real AI scoring

### STEP 5
- Save submissions to DB

### STEP 6
- Build results page

### STEP 7
- Add image upload

### STEP 8
- Add OCR pipeline

### STEP 9
- Add editable extracted text

### STEP 10
- Add usage limits

### STEP 11
- Add dashboard

### STEP 12
- Add speaking

---

## Rules

- Never build multiple features at once
- Always test after each step
- Keep UI simple