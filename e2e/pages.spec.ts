import { test, expect } from "@playwright/test";

test.describe("Public pages load correctly", () => {
  test("landing page renders all sections", async ({ page }) => {
    await page.goto("/");
    for (const id of [
      "hero", "personas", "guide", "how-it-works", "personal-story",
      "comparison", "bilingual", "pricing", "faq", "mission", "final-cta",
    ]) {
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
  });

  test("landing hero shows headline, subhead, and CTAs to /signup", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("#hero");
    await expect(hero.locator("h1")).toBeVisible();
    const primary = hero.locator('[data-cta="hero-primary"]');
    await expect(primary).toBeVisible();
    await expect(primary).toHaveAttribute("href", "/signup");
    const secondary = hero.locator('[data-cta="hero-secondary"]');
    await expect(secondary).toBeVisible();
    await expect(secondary).toHaveAttribute("href", "#bilingual");
  });

  test("login page has email/password form and Google auth", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h1")).toContainText("Boost");
    await expect(page.getByText("Email")).toBeVisible();
    await expect(page.getByText("Password", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
    await expect(page.getByText("Continue with Google")).toBeVisible();
    await expect(page.getByText("Forgot password?")).toBeVisible();
    await expect(page.getByText("Sign up")).toBeVisible();
  });

  test("signup page has link back to login", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.getByText("Already have an account?")).toBeVisible();
  });

  test("guide page loads with heading", async ({ page }) => {
    await page.goto("/guide");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("upgrade page shows Pro plan", async ({ page }) => {
    await page.goto("/upgrade");
    await expect(page.getByRole("heading", { name: "Upgrade to Pro" })).toBeVisible();
  });

  test("privacy policy page loads", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("terms page loads", async ({ page }) => {
    await page.goto("/terms");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("writing page requires auth — shows login", async ({ page }) => {
    await page.goto("/writing");
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible({ timeout: 10000 });
  });

  test("speaking page requires auth — shows login", async ({ page }) => {
    await page.goto("/speaking");
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible({ timeout: 10000 });
  });

});
