import { test, expect } from "@playwright/test";

test.describe("Page loads", () => {
  test("landing page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Boost");
    await expect(page.getByText("Start Writing Practice")).toBeVisible();
  });

  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h1")).toContainText("Boost");
  });

  test("signup page loads", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.locator("h1")).toContainText("account");
  });

  test("writing page loads with task selectors", async ({ page }) => {
    await page.goto("/writing");
    await expect(page.getByText("Task 1")).toBeVisible();
    await expect(page.getByText("Task 2")).toBeVisible();
  });

  test("speaking page loads with all 3 parts", async ({ page }) => {
    await page.goto("/speaking");
    await expect(page.getByText("Part 1")).toBeVisible();
    await expect(page.getByText("Part 2")).toBeVisible();
    await expect(page.getByText("Part 3")).toBeVisible();
  });

  test("guide page loads", async ({ page }) => {
    await page.goto("/guide");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("upgrade page loads", async ({ page }) => {
    await page.goto("/upgrade");
    await expect(page.getByText("Pro")).toBeVisible();
  });

  test("privacy page loads", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("terms page loads", async ({ page }) => {
    await page.goto("/terms");
    await expect(page.locator("h1")).toBeVisible();
  });
});

test.describe("Navigation", () => {
  test("can navigate from landing to writing", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Start Writing Practice").click();
    await expect(page).toHaveURL(/\/writing/);
  });

  test("navbar is present", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("nav")).toBeVisible();
  });
});
