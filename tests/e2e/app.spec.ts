import { test, expect } from "@playwright/test";

test.describe("Habit Tracker app", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  test("shows the splash screen and redirects unauthenticated users to /login", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("splash-screen")).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });

  test("redirects authenticated users from / to /dashboard", async ({ page }) => {
    await page.goto("/signup");

    const email = `user_${Date.now()}@test.com`;
    await page.getByTestId("auth-signup-email").fill(email);
    await page.getByTestId("auth-signup-password").fill("password123");
    await page.getByTestId("auth-signup-submit").click();

    await page.goto("/");
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test("prevents unauthenticated access to /dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("signs up a new user and lands on the dashboard", async ({ page }) => {
    await page.goto("/signup");

    const email = `user_${Date.now()}@test.com`;
    await page.getByTestId("auth-signup-email").fill(email);
    await page.getByTestId("auth-signup-password").fill("password123");
    await page.getByTestId("auth-signup-submit").click();

    await expect(page.getByTestId("dashboard-page")).toBeVisible();
  });

  test("logs in an existing user and loads only that user's habits", async ({ page }) => {
    const email = "existing@test.com";

    // Seed user
    await page.goto("/signup");
    await page.getByTestId("auth-signup-email").fill(email);
    await page.getByTestId("auth-signup-password").fill("password123");
    await page.getByTestId("auth-signup-submit").click();
    await page.getByTestId("auth-logout-button").click();

    // Login
    await page.getByTestId("auth-login-email").fill(email);
    await page.getByTestId("auth-login-password").fill("password123");
    await page.getByTestId("auth-login-submit").click();

    await expect(page.getByTestId("dashboard-page")).toBeVisible();
  });

  test("creates a habit from the dashboard", async ({ page }) => {
    await page.goto("/signup");

    const email = `user_${Date.now()}@test.com`;
    await page.getByTestId("auth-signup-email").fill(email);
    await page.getByTestId("auth-signup-password").fill("password123");
    await page.getByTestId("auth-signup-submit").click();

    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Drink Water");
    await page.getByTestId("habit-save-button").click();

    await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();
  });

  test("completes a habit for today and updates the streak", async ({ page }) => {
    await page.goto("/signup");

    const email = `user_${Date.now()}@test.com`;
    await page.getByTestId("auth-signup-email").fill(email);
    await page.getByTestId("auth-signup-password").fill("password123");
    await page.getByTestId("auth-signup-submit").click();

    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Drink Water");
    await page.getByTestId("habit-save-button").click();

    await page.getByTestId("habit-complete-drink-water").click();
    await expect(page.getByTestId("habit-streak-drink-water")).toContainText("1");
  });

  test("persists session and habits after page reload", async ({ page }) => {
    await page.goto("/signup");

    const email = `user_${Date.now()}@test.com`;
    await page.getByTestId("auth-signup-email").fill(email);
    await page.getByTestId("auth-signup-password").fill("password123");
    await page.getByTestId("auth-signup-submit").click();

    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Drink Water");
    await page.getByTestId("habit-save-button").click();

    await page.reload();

    await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();
  });

  test("logs out and redirects to /login", async ({ page }) => {
    await page.goto("/signup");

    const email = `user_${Date.now()}@test.com`;
    await page.getByTestId("auth-signup-email").fill(email);
    await page.getByTestId("auth-signup-password").fill("password123");
    await page.getByTestId("auth-signup-submit").click();

    await page.getByTestId("auth-logout-button").click();
    await expect(page).toHaveURL(/\/login$/);
  });

  test("loads the cached app shell when offline after the app has been loaded once", async ({ page, context }) => {
    await page.goto("/");

    await context.setOffline(true);
    await page.reload();

    await expect(page.getByTestId("splash-screen")).toBeVisible();

    await context.setOffline(false);
  });
});