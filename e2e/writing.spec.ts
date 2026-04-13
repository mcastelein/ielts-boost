import { test, expect } from "@playwright/test";

test.describe("Writing page", () => {
  test("task type selector shows Task 1 and Task 2", async ({ page }) => {
    await page.goto("/writing");
    await expect(page.getByText("Task 1")).toBeVisible();
    await expect(page.getByText("Task 2")).toBeVisible();
  });

  test("selecting Task 1 shows prompt options", async ({ page }) => {
    await page.goto("/writing");
    await page.getByText("Task 1").first().click();
    // Should show random prompt button or prompt list
    await expect(page.locator("button").filter({ hasText: /random/i }).first()).toBeVisible({ timeout: 3000 });
  });

  test("selecting Task 2 shows prompt options", async ({ page }) => {
    await page.goto("/writing");
    await page.getByText("Task 2").first().click();
    await expect(page.locator("button").filter({ hasText: /random/i }).first()).toBeVisible({ timeout: 3000 });
  });

  test("random prompt generates a prompt", async ({ page }) => {
    await page.goto("/writing");
    await page.getByText("Task 2").first().click();
    await page.locator("button").filter({ hasText: /random/i }).first().click();

    // A prompt text should appear
    await expect(page.getByText("Write at least 250 words")).toBeVisible({ timeout: 3000 });
  });

  test("start practice shows writing area", async ({ page }) => {
    await page.goto("/writing");
    await page.getByText("Task 2").first().click();
    await page.locator("button").filter({ hasText: /random/i }).first().click();

    // Start button should appear
    const startBtn = page.locator("button").filter({ hasText: /start/i }).first();
    await expect(startBtn).toBeVisible({ timeout: 3000 });
    await startBtn.click();

    // Textarea should appear
    await expect(page.locator("textarea")).toBeVisible({ timeout: 3000 });
  });

  test("word count updates as user types", async ({ page }) => {
    await page.goto("/writing");
    await page.getByText("Task 2").first().click();
    await page.locator("button").filter({ hasText: /random/i }).first().click();
    await page.locator("button").filter({ hasText: /start/i }).first().click();

    const textarea = page.locator("textarea").first();
    await textarea.fill("This is a test essay with several words in it for counting purposes.");

    // Word count should show
    await expect(page.getByText(/\d+ word/i)).toBeVisible({ timeout: 3000 });
  });

  test("textarea has spellCheck disabled", async ({ page }) => {
    await page.goto("/writing");
    await page.getByText("Task 2").first().click();
    await page.locator("button").filter({ hasText: /random/i }).first().click();
    await page.locator("button").filter({ hasText: /start/i }).first().click();

    const textarea = page.locator("textarea").first();
    await expect(textarea).toHaveAttribute("spellcheck", "false");
  });
});
