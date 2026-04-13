import { test, expect } from "@playwright/test";

test.describe("Public pages load correctly", () => {
  test("landing page has brand name and CTAs", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Boost");
    await expect(page.getByText("Start Writing Practice")).toBeVisible();
    await expect(page.getByText("Sign In")).toBeVisible();
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

  test("landing page Start Writing links to /writing", async ({ page }) => {
    await page.goto("/");
    const link = page.getByText("Start Writing Practice");
    await expect(link).toHaveAttribute("href", "/writing");
  });
});
