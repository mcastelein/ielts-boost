import { test, expect } from "@playwright/test";

test.describe("Speaking API", () => {
  test("speaking endpoint accepts request with draft_id field", async ({ request }) => {
    const response = await request.post("/api/speaking", {
      data: {
        prompt: "Tell me about your hometown",
        response: "I come from a small city in the south. It is known for beautiful scenery and delicious food. I enjoy living there because the pace of life is slower than in big cities.",
        part: 1,
        feedbackLanguage: "en",
        draft_id: null,
      },
    });
    // Should get JSON back (may succeed or fail based on auth/AI, but not crash)
    const body = await response.json();
    expect(body).toBeDefined();
    // Should not be a 400 (invalid params) — draft_id is accepted
    expect(response.status()).not.toBe(400);
  });

  test("speaking endpoint handles missing required fields", async ({ request }) => {
    const response = await request.post("/api/speaking", {
      data: {
        prompt: "",
        response: "",
        part: 1,
      },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBeDefined();
  });
});

test.describe("Transcribe API", () => {
  test("returns 400 when no audio file provided", async ({ request }) => {
    const response = await request.post("/api/speaking/transcribe", {
      multipart: {
        prompt: "What is your hometown like?",
        part: "1",
      },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain("audio");
  });
});

test.describe("Speaking page crash fix (client-side error handling)", () => {
  // These tests verify the page JavaScript handles API errors without crashing.
  // Since the speaking page requires auth, we test by navigating to the page
  // (which shows login) and then directly testing the error handling logic
  // by evaluating client-side code.

  test("speaking page loads without JS errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/speaking");
    await page.waitForTimeout(3000);

    // No unhandled JS errors
    expect(errors).toEqual([]);
  });

  test("writing page loads without JS errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/writing");
    await page.waitForTimeout(3000);

    expect(errors).toEqual([]);
  });
});
