-- Add 'prompt_text' column to writing_submissions (stores the full IELTS question/prompt text)
ALTER TABLE writing_submissions ADD COLUMN IF NOT EXISTS prompt_text text;
