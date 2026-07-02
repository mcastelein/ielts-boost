import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";
import { logAdminAction } from "@/lib/admin-audit";
import { logApiCall } from "@/lib/api-logger";
import {
  GENERATION_MODEL,
  PROMPT_VERSION,
  QUESTION_TYPES,
  GenerationValidationError,
  generatePassage,
  runSelfCheck,
  toQuestionGroups,
  type GenerationOptions,
  type GenerationQuestionType,
} from "@/lib/reading-generation";
import type { QuestionGroup } from "@/lib/reading-passages";

// Generation + self-check are two long Claude calls; allow up to 5 minutes
export const maxDuration = 300;

const anthropic = new Anthropic();

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function countQuestions(groups: QuestionGroup[]): number {
  return groups.reduce((sum, g) => sum + g.questions.length, 0);
}

export async function GET() {
  const supabase = await createClient();
  const { authorized } = await requireAdmin(supabase);
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("reading_passages")
    .select(
      "id, slug, title, difficulty, topic_tags, status, is_active, display_order, created_at, question_groups, generation_metadata"
    )
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const passages = (data ?? []).map((row) => {
    const groups = (row.question_groups ?? []) as QuestionGroup[];
    const allQuestions = groups.flatMap((g) => g.questions);
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      difficulty: row.difficulty,
      topic_tags: row.topic_tags,
      status: row.status,
      is_active: row.is_active,
      display_order: row.display_order,
      created_at: row.created_at,
      question_count: allQuestions.length,
      has_explanations:
        allQuestions.length > 0 && allQuestions.every((q) => !!q.explanation),
      self_check_agreement:
        (row.generation_metadata as { selfCheck?: { agreementRate?: number } } | null)
          ?.selfCheck?.agreementRate ?? null,
    };
  });

  return NextResponse.json({ passages });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { authorized, user: adminUser } = await requireAdmin(supabase);
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const topic = typeof body.topic === "string" ? body.topic.trim() : "";
  const difficulty = body.difficulty as 1 | 2 | 3;
  const questionTypes = (Array.isArray(body.questionTypes) ? body.questionTypes : []).filter(
    (t: string): t is GenerationQuestionType =>
      (QUESTION_TYPES as readonly string[]).includes(t)
  );
  const questionCount =
    typeof body.questionCount === "number"
      ? Math.min(Math.max(Math.round(body.questionCount), 6), 20)
      : undefined;

  if (!topic || ![1, 2, 3].includes(difficulty) || questionTypes.length === 0) {
    return NextResponse.json(
      { error: "Missing or invalid topic, difficulty (1-3), or questionTypes" },
      { status: 400 }
    );
  }

  const opts: GenerationOptions = { topic, difficulty, questionTypes, questionCount };
  const startTime = Date.now();

  try {
    const { passage, usage, durationMs } = await generatePassage(anthropic, opts);

    // Self-check: model answers its own questions; disagreements surface as admin warnings
    let selfCheck = null;
    let selfCheckUsage = { input_tokens: 0, output_tokens: 0 };
    try {
      const result = await runSelfCheck(anthropic, passage);
      selfCheck = result.report;
      selfCheckUsage = result.usage;
    } catch (e) {
      console.error("Self-check failed (non-fatal):", e);
    }

    const slug = `${slugify(passage.title)}-${Math.random().toString(36).slice(2, 6)}`;
    const questionGroups = toQuestionGroups(passage);

    const { data: row, error: insertError } = await supabase
      .from("reading_passages")
      .insert({
        slug,
        title: passage.title,
        exam_type: "academic",
        difficulty,
        topic_tags: passage.topicTags,
        passage_text: passage.passageText,
        question_groups: questionGroups,
        status: "draft",
        is_active: false,
        display_order: 999,
        generation_metadata: {
          model: GENERATION_MODEL,
          promptVersion: PROMPT_VERSION,
          input: opts,
          selfCheck,
          generatedAt: new Date().toISOString(),
        },
      })
      .select("*")
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    await logApiCall({
      supabase,
      userId: adminUser!.id,
      callType: "reading_generate",
      model: GENERATION_MODEL,
      inputTokens: usage.input_tokens + selfCheckUsage.input_tokens,
      outputTokens: usage.output_tokens + selfCheckUsage.output_tokens,
      durationMs: Date.now() - startTime,
      metadata: {
        slug,
        topic,
        difficulty,
        questionTypes,
        questionCount: countQuestions(questionGroups),
        selfCheckAgreement: selfCheck?.agreementRate ?? null,
        generationMs: durationMs,
      },
    });

    await logAdminAction({
      supabase,
      adminUserId: adminUser!.id,
      action: "generate_reading_passage",
      details: { slug, topic, difficulty, questionTypes },
    });

    return NextResponse.json({ passage: row });
  } catch (error) {
    console.error("Reading passage generation error:", error);

    await logApiCall({
      supabase,
      userId: adminUser!.id,
      callType: "reading_generate",
      model: GENERATION_MODEL,
      durationMs: Date.now() - startTime,
      success: false,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      metadata: { topic, difficulty, questionTypes },
    });

    if (error instanceof GenerationValidationError) {
      return NextResponse.json(
        { error: "Generated content failed validation", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to generate passage. Please try again." },
      { status: 500 }
    );
  }
}
