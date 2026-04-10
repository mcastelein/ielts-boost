import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { logApiCall } from "@/lib/api-logger";

const anthropic = new Anthropic();

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    let mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif";
    if (file.type === "image/png") {
      mediaType = "image/png";
    } else if (file.type === "image/webp") {
      mediaType = "image/webp";
    } else {
      mediaType = "image/jpeg";
    }

    // For PDFs, we'd need a different approach (pdf-to-image conversion)
    // For now, handle images directly with Claude vision
    if (file.type === "application/pdf") {
      return NextResponse.json(
        { error: "PDF OCR not yet supported. Please upload an image instead." },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const startTime = Date.now();

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64,
              },
            },
            {
              type: "text",
              text: "Extract all the handwritten or printed text from this image. This is an IELTS essay. Return ONLY the extracted text, preserving paragraph breaks. Do not add any commentary, corrections, or analysis — just the raw text as written.",
            },
          ],
        },
      ],
    });

    const durationMs = Date.now() - startTime;

    await logApiCall({
      supabase,
      userId: user?.id ?? null,
      callType: "ocr",
      model: "claude-sonnet-4-20250514",
      inputTokens: message.usage?.input_tokens,
      outputTokens: message.usage?.output_tokens,
      durationMs,
      metadata: { fileType: file.type },
    });

    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(
        { error: "Could not extract text" },
        { status: 500 }
      );
    }

    return NextResponse.json({ text: textBlock.text });
  } catch (error) {
    console.error("OCR error:", error);
    return NextResponse.json(
      { error: "Text extraction failed. Please try again." },
      { status: 500 }
    );
  }
}
