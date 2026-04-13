import { test, expect } from "@playwright/test";

test.describe("Writing API", () => {
  test("score endpoint accepts request", async ({ request }) => {
    const response = await request.post("/api/score", {
      data: {
        essay: "This is a test essay about the importance of education.",
        taskType: "task2",
        feedbackLanguage: "en",
      },
    });
    // Should get JSON response (may fail on AI call but not crash)
    const body = await response.json();
    expect(body).toBeDefined();
    expect(response.status()).not.toBe(400);
  });

  test("score endpoint rejects missing essay", async ({ request }) => {
    const response = await request.post("/api/score", {
      data: {
        essay: "",
        taskType: "task2",
      },
    });
    expect(response.status()).toBe(400);
  });
});
