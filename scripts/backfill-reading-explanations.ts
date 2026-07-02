/**
 * Backfill answer-location explanations for reading passages that predate the
 * generation pipeline (the seeded passages have no per-question `explanation`).
 *
 * Run with:
 *   npx tsx scripts/backfill-reading-explanations.ts [--dry-run] [--slug=<slug>]
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY
 */

import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import { config } from "dotenv";
import { resolve } from "path";
import type { QuestionGroup, ReadingPassage } from "../lib/reading-passages";
import {
  generateExplanationsForExisting,
  mergeExplanations,
} from "../lib/reading-generation";

config({ path: resolve(__dirname, "../.env.local") });

const dryRun = process.argv.includes("--dry-run");
const slugArg = process.argv.find((a) => a.startsWith("--slug="))?.slice("--slug=".length);

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

async function main() {
  const supabase = getSupabase();
  const anthropic = new Anthropic();

  let query = supabase
    .from("reading_passages")
    .select("id, slug, title, exam_type, difficulty, topic_tags, passage_text, question_groups");
  if (slugArg) query = query.eq("slug", slugArg);

  const { data: rows, error } = await query;
  if (error) {
    console.error("❌ Failed to fetch passages:", error.message);
    process.exit(1);
  }

  const candidates = (rows ?? []).filter((row) => {
    const groups = row.question_groups as QuestionGroup[];
    return groups.some((g) => g.questions.some((q) => !q.explanation));
  });

  if (candidates.length === 0) {
    console.log("✅ Nothing to backfill — every question already has an explanation.");
    return;
  }

  console.log(
    `${dryRun ? "[dry-run] " : ""}Backfilling explanations for ${candidates.length} passage(s)...\n`
  );

  for (const row of candidates) {
    const passage: ReadingPassage = {
      id: row.slug,
      title: row.title,
      examType: row.exam_type as "academic",
      difficulty: row.difficulty,
      topicTags: row.topic_tags,
      passageText: row.passage_text,
      questionGroups: row.question_groups as QuestionGroup[],
    };
    const totalQuestions = passage.questionGroups.reduce(
      (s, g) => s + g.questions.length,
      0
    );

    process.stdout.write(`→ ${row.slug} (${totalQuestions} questions)... `);

    try {
      const { explanations, errors, usage } = await generateExplanationsForExisting(
        anthropic,
        passage
      );
      const covered = Object.keys(explanations).length;
      console.log(
        `${covered}/${totalQuestions} explanations (${usage.input_tokens} in / ${usage.output_tokens} out tokens)`
      );
      for (const e of errors) {
        console.log(`   ⚠ skipped: ${e}`);
      }

      if (covered === 0) {
        console.log("   ❌ nothing usable returned, skipping row");
        continue;
      }

      const merged = mergeExplanations(passage.questionGroups, explanations);

      if (dryRun) {
        for (const [id, ex] of Object.entries(explanations)) {
          console.log(`   [dry-run] ${id} → ¶${ex.paragraph}: "${ex.quote.slice(0, 60)}..."`);
        }
        continue;
      }

      const { error: updateError } = await supabase
        .from("reading_passages")
        .update({ question_groups: merged })
        .eq("id", row.id);

      if (updateError) {
        console.log(`   ❌ update failed: ${updateError.message}`);
      } else {
        console.log(`   ✅ saved`);
      }
    } catch (e) {
      console.log(`❌ failed: ${e instanceof Error ? e.message : e}`);
    }
  }

  console.log("\nDone.");
}

main();
