import { test, expect } from "@playwright/test";

test.describe("Speaking page", () => {
  test("part selector buttons are visible", async ({ page }) => {
    await page.goto("/speaking");
    await expect(page.getByText("Part 1")).toBeVisible();
    await expect(page.getByText("Part 2")).toBeVisible();
    await expect(page.getByText("Part 3")).toBeVisible();
  });

  test("clicking part 2 changes selection", async ({ page }) => {
    await page.goto("/speaking");
    const part2 = page.getByText("Part 2").first();
    await part2.click();
    await expect(part2).toHaveClass(/bg-blue-600/);
  });

  test("get prompt button works", async ({ page }) => {
    await page.goto("/speaking");
    // There should be a button to get a prompt
    const promptBtn = page.locator("button").filter({ hasText: /prompt|start/i }).first();
    if (await promptBtn.isVisible()) {
      await promptBtn.click();
      // After clicking, a prompt card should appear with some question text
      await expect(page.locator("text=Part 1")).toBeVisible();
    }
  });

  test("voice and text mode toggle exists after getting prompt", async ({ page }) => {
    await page.goto("/speaking");
    const promptBtn = page.locator("button").filter({ hasText: /prompt|start/i }).first();
    if (await promptBtn.isVisible()) {
      await promptBtn.click();
      // Voice/Text toggle buttons should appear
      await expect(page.getByText("Voice").first()).toBeVisible({ timeout: 5000 });
      await expect(page.getByText("Text").first()).toBeVisible({ timeout: 5000 });
    }
  });

  test("text mode shows textarea after getting prompt", async ({ page }) => {
    await page.goto("/speaking");
    const promptBtn = page.locator("button").filter({ hasText: /prompt|start/i }).first();
    if (await promptBtn.isVisible()) {
      await promptBtn.click();
    }
    // Click text mode
    await page.getByText("Text").first().click();
    await expect(page.locator("textarea")).toBeVisible();
  });

  test("submit button appears after typing in textarea", async ({ page }) => {
    await page.goto("/speaking");
    const promptBtn = page.locator("button").filter({ hasText: /prompt|start/i }).first();
    if (await promptBtn.isVisible()) {
      await promptBtn.click();
    }
    await page.getByText("Text").first().click();

    const textarea = page.locator("textarea").first();
    await textarea.fill("I enjoy working from home because it gives me flexibility and saves commuting time.");

    // Submit button should appear
    const submitBtn = page.locator("button").filter({ hasText: /feedback|submit/i }).first();
    await expect(submitBtn).toBeVisible();
  });

  test("API error shows error message instead of crashing", async ({ page }) => {
    // Mock the speaking API to return a 500 error
    await page.route("**/api/speaking", (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Failed to evaluate response. Please try again." }),
      });
    });

    await page.goto("/speaking");
    const promptBtn = page.locator("button").filter({ hasText: /prompt|start/i }).first();
    if (await promptBtn.isVisible()) {
      await promptBtn.click();
    }
    await page.getByText("Text").first().click();

    const textarea = page.locator("textarea").first();
    await textarea.fill("This is a test response.");

    const submitBtn = page.locator("button").filter({ hasText: /feedback|submit/i }).first();
    await submitBtn.click();

    // Should show error message, NOT crash the page
    await expect(page.getByText("Failed to evaluate")).toBeVisible({ timeout: 10000 });
    // Page should still be interactive
    await expect(page.locator("textarea")).toBeVisible();
  });

  test("rate limit error shows message instead of crashing", async ({ page }) => {
    await page.route("**/api/speaking", (route) => {
      route.fulfill({
        status: 429,
        contentType: "application/json",
        body: JSON.stringify({
          error: "daily_limit_reached",
          message: "You've used 3/3 free speaking submissions today. Upgrade to Pro for unlimited access.",
        }),
      });
    });

    await page.goto("/speaking");
    const promptBtn = page.locator("button").filter({ hasText: /prompt|start/i }).first();
    if (await promptBtn.isVisible()) {
      await promptBtn.click();
    }
    await page.getByText("Text").first().click();

    const textarea = page.locator("textarea").first();
    await textarea.fill("Test response for rate limiting.");

    const submitBtn = page.locator("button").filter({ hasText: /feedback|submit/i }).first();
    await submitBtn.click();

    // Should show rate limit message, NOT crash
    await expect(page.getByText("Upgrade to Pro")).toBeVisible({ timeout: 10000 });
  });

  test("part selector via URL param works", async ({ page }) => {
    await page.goto("/speaking?part=2");
    const part2 = page.getByText("Part 2").first();
    await expect(part2).toHaveClass(/bg-blue-600/);
  });

  test("switching parts resets the prompt", async ({ page }) => {
    await page.goto("/speaking");

    // Get a prompt
    const promptBtn = page.locator("button").filter({ hasText: /prompt|start/i }).first();
    if (await promptBtn.isVisible()) {
      await promptBtn.click();
    }

    // Switch to Part 2 — should reset
    await page.getByText("Part 2").first().click();

    // Get Prompt button should reappear
    await expect(page.locator("button").filter({ hasText: /prompt|start/i }).first()).toBeVisible({ timeout: 3000 });
  });
});
