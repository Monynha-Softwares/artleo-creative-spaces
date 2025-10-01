import { test, expect } from "@playwright/test";

test.describe("mobile navigation", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("shows the infinite menu when opened on mobile", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByTestId("desktop-nav")).toBeHidden();

    const toggle = page.getByTestId("mobile-nav-toggle");
    await toggle.click();

    const container = page.getByTestId("mobile-nav-container");
    await expect(container).toBeVisible();
    await expect(page.getByTestId("mobile-infinite-menu")).toBeVisible();
  });
});

test.describe("desktop navigation", () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test("keeps the desktop links visible and hides the infinite menu", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByTestId("desktop-nav")).toBeVisible();
    await expect(page.getByTestId("mobile-nav-toggle")).toBeHidden();
    await expect(page.locator('[data-testid="mobile-nav-container"]')).toHaveCount(0);
  });
});
