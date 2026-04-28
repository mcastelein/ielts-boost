import { test, expect } from "@playwright/test";

test.describe("Landing page polish", () => {
  test("no horizontal page scroll at 375px viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    // Wait for hydration
    await expect(page.locator("#hero h1")).toBeVisible();
    // The body should not be horizontally scrollable.
    const overflowsHorizontally = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(overflowsHorizontally).toBe(false);
  });

  test("all 10 sections render at desktop viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    for (const id of [
      "hero", "personas", "guide", "how-it-works", "personal-story",
      "comparison", "pricing", "faq", "mission", "final-cta",
    ]) {
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
  });

  test("hero h1 is the only h1 on the page", async ({ page }) => {
    await page.goto("/");
    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBe(1);
  });

  test("language toggle switches hero copy via localStorage", async ({ page }) => {
    // Default locale per lib/language-context.tsx is "zh"
    await page.goto("/");
    await expect(page.locator("#hero h1")).toContainText("雅思");

    // Switch to EN via localStorage (there's no lang toggle on the unauthenticated landing page)
    await page.evaluate(() => {
      localStorage.setItem("ieltsboost_ui_lang", "en");
    });
    await page.reload();
    await expect(page.locator("#hero h1")).toContainText("IELTS");

    // Switch back to zh
    await page.evaluate(() => {
      localStorage.setItem("ieltsboost_ui_lang", "zh");
    });
    await page.reload();
    await expect(page.locator("#hero h1")).toContainText("雅思");
  });

  test("FAQ accordion is keyboard accessible", async ({ page }) => {
    await page.goto("/");
    // Find the first FAQ button
    const firstFaq = page.locator("#faq button").first();
    await firstFaq.focus();
    // Press Enter to expand
    await page.keyboard.press("Enter");
    await expect(firstFaq).toHaveAttribute("aria-expanded", "true");
    // Press Enter again to collapse
    await page.keyboard.press("Enter");
    await expect(firstFaq).toHaveAttribute("aria-expanded", "false");
  });

  test("comparison table does not cause page horizontal scroll on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.locator("#comparison").scrollIntoViewIfNeeded();
    const pageOverflows = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(pageOverflows).toBe(false);
  });

  test("all CTA links go to /signup or /upgrade or are #anchors", async ({ page }) => {
    await page.goto("/");
    const ctas = await page.locator("[data-cta]").all();
    expect(ctas.length).toBe(5);
    for (const cta of ctas) {
      const href = await cta.getAttribute("href");
      expect(href).toBeTruthy();
      expect(["/signup", "/upgrade"].includes(href!) || href!.startsWith("#")).toBe(true);
    }
  });
});
