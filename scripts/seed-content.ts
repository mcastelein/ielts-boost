/**
 * Seed script: migrates hard-coded content from lib/*.ts into Supabase.
 *
 * Run with:
 *   npx tsx scripts/seed-content.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../.env.local") });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
    );
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ---------------------------------------------------------------------------
// Speaking prompts data
// ---------------------------------------------------------------------------

const SPEAKING_PROMPTS = [
  // Part 1 - Simple questions
  { part: 1, topic: "Hometown", question: "Where is your hometown? What do you like about it?" },
  { part: 1, topic: "Work / Study", question: "Do you work or are you a student? What do you enjoy about it?" },
  { part: 1, topic: "Daily Routine", question: "What does a typical day look like for you?" },
  { part: 1, topic: "Hobbies", question: "What do you do in your free time?" },
  { part: 1, topic: "Weather", question: "What kind of weather do you like? Does it affect your mood?" },
  { part: 1, topic: "Food", question: "What is your favorite type of food? Do you enjoy cooking?" },
  { part: 1, topic: "Travel", question: "Do you like traveling? Where would you like to go next?" },
  { part: 1, topic: "Reading", question: "Do you enjoy reading? What kind of books do you like?" },

  // Part 2 - Long turn (cue card)
  {
    part: 2,
    topic: "A Place You Visited",
    question: "Describe a place you visited that you found interesting. You should say: where it was, when you went there, what you did there, and explain why you found it interesting.",
  },
  {
    part: 2,
    topic: "A Person You Admire",
    question: "Describe a person you admire. You should say: who this person is, how you know them, what they do, and explain why you admire them.",
  },
  {
    part: 2,
    topic: "A Skill You Learned",
    question: "Describe a skill you learned that you found useful. You should say: what the skill is, when you learned it, how you learned it, and explain why you found it useful.",
  },
  {
    part: 2,
    topic: "A Childhood Memory",
    question: "Describe a happy memory from your childhood. You should say: what happened, when it happened, who was with you, and explain why it is a happy memory.",
  },
  {
    part: 2,
    topic: "A Difficult Decision",
    question: "Describe a difficult decision you had to make. You should say: what the decision was, why it was difficult, what you decided, and explain how you felt about it afterwards.",
  },

  // Part 3 - Discussion
  {
    part: 3,
    topic: "Technology and Society",
    question: "How has technology changed the way people communicate? Do you think this is a positive change?",
  },
  {
    part: 3,
    topic: "Education",
    question: "Do you think the education system in your country prepares students well for the future? What changes would you suggest?",
  },
  {
    part: 3,
    topic: "Environment",
    question: "What are the biggest environmental challenges facing your country? What should individuals do to help?",
  },
  {
    part: 3,
    topic: "Work-Life Balance",
    question: "Do people in your country tend to work too much? How important is work-life balance?",
  },
  {
    part: 3,
    topic: "Globalization",
    question: "How has globalization affected local cultures? Is this something that concerns you?",
  },
] as const;

// ---------------------------------------------------------------------------
// Speaking prompts
// ---------------------------------------------------------------------------

async function seedSpeakingPrompts() {
  const supabase = getSupabase();

  const rows = SPEAKING_PROMPTS.map((p, i) => ({
    slug: `part${p.part}-${slugify(p.topic)}`,
    part: p.part,
    topic: p.topic,
    question: p.question,
    follow_up: null,
    is_active: true,
    display_order: i,
  }));

  const { error, count } = await supabase
    .from("speaking_prompts")
    .upsert(rows, { onConflict: "slug", count: "exact" });

  if (error) {
    console.error("❌ speaking_prompts seed failed:", error.message);
    process.exit(1);
  }

  console.log(`✅ speaking_prompts: upserted ${count ?? rows.length} rows`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("Seeding content tables...\n");
  await seedSpeakingPrompts();
  // Phase 2+: add seedWritingPrompts(), seedReadingPassages(), seedListeningTracks() here
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
