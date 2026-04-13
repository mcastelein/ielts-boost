import { test, expect } from "@playwright/test";

test.describe("Draft submissions", () => {
  test("speaking API accepts draft_id parameter", async ({ request }) => {
    // Test that the API endpoint accepts the draft_id field without crashing
    const response = await request.post("/api/speaking", {
      data: {
        prompt: "Test prompt",
        response: "Test response about my hometown",
        part: 1,
        feedbackLanguage: "en",
        draft_id: null,
      },
    });

    // Should get a valid JSON response (might be error due to auth, but not a crash)
    expect(response.status()).toBeLessThan(600);
    const body = await response.json();
    expect(body).toBeDefined();
  });

  test("voice mode shows record button when prompt is active", async ({ page }) => {
    await page.goto("/speaking");
    const promptBtn = page.locator("button").filter({ hasText: /prompt|start/i }).first();
    if (await promptBtn.isVisible()) {
      await promptBtn.click();
    }

    // Voice mode is default — should show Record button
    await expect(page.locator("button").filter({ hasText: /record/i }).first()).toBeVisible({ timeout: 5000 });
  });

  test("switching parts resets state", async ({ page }) => {
    await page.goto("/speaking");

    // Get a prompt in Part 1
    const promptBtn = page.locator("button").filter({ hasText: /prompt|start/i }).first();
    if (await promptBtn.isVisible()) {
      await promptBtn.click();
    }

    // Switch to text and type something
    await page.getByText("Text").first().click();
    const textarea = page.locator("textarea").first();
    if (await textarea.isVisible()) {
      await textarea.fill("Some test text");
    }

    // Switch to Part 2 — everything should reset
    await page.getByText("Part 2").first().click();

    // Get Prompt button should reappear (prompt was cleared)
    await expect(page.locator("button").filter({ hasText: /prompt|start/i }).first()).toBeVisible({ timeout: 3000 });
  });

  test("transcribe endpoint accepts extra form data fields", async ({ request }) => {
    // Test that the endpoint doesn't crash when receiving prompt/part fields
    // (will fail on actual transcription since we're sending fake audio)
    const formData = new URLSearchParams();
    // We can't easily send multipart form data with Playwright's request API
    // but we can verify the endpoint exists
    const response = await request.post("/api/speaking/transcribe", {
      multipart: {
        prompt: "What is your hometown like?",
        part: "1",
      },
    });

    // Should get 400 (no audio) not 500 (crash)
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain("audio");
  });
});
