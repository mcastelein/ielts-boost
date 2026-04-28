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

import { SPEAKING_PROMPTS } from "../lib/speaking-prompts";

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
// Speaking prompts
// ---------------------------------------------------------------------------

async function seedSpeakingPrompts() {
  const supabase = getSupabase();

  const rows = SPEAKING_PROMPTS.map((p, i) => ({
    slug: `part${p.part}-${slugify(p.topic)}`,
    part: p.part,
    topic: p.topic,
    question: p.question,
    follow_up: p.followUp ?? null,
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
