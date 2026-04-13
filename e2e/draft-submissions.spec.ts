import { test, expect } from "@playwright/test";

test.describe("Draft submission API", () => {
  test("transcribe endpoint accepts prompt and part fields", async ({ request }) => {
    // Endpoint should accept the extra fields without crashing
    // Will return 400 because no audio file, but the extra fields don't cause errors
    const response = await request.post("/api/speaking/transcribe", {
      multipart: {
        prompt: "Describe your daily routine",
        part: "2",
      },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain("audio");
  });

  test("speaking endpoint accepts draft_id as null", async ({ request }) => {
    const response = await request.post("/api/speaking", {
      data: {
        prompt: "What do you do for fun?",
        response: "I enjoy playing table tennis and going for runs in the park.",
        part: 1,
        feedbackLanguage: "en",
        draft_id: null,
      },
    });
    const body = await response.json();
    expect(body).toBeDefined();
    expect(response.status()).not.toBe(400);
  });

  test("speaking endpoint accepts draft_id as a UUID string", async ({ request }) => {
    const response = await request.post("/api/speaking", {
      data: {
        prompt: "Tell me about a book you read",
        response: "I recently read a fascinating book about history.",
        part: 1,
        feedbackLanguage: "en",
        draft_id: "00000000-0000-0000-0000-000000000000",
      },
    });
    const body = await response.json();
    expect(body).toBeDefined();
    // Should not crash with an invalid draft_id — just falls back to creating new
    expect(response.status()).not.toBe(400);
  });
});
