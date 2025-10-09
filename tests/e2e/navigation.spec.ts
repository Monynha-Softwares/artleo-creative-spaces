import { test, expect } from "@playwright/test";

test.describe("mobile navigation", () => {
  test("opens overlay, traps to single instance, and closes on navigation", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "Mobile Chrome", "Runs only in the mobile project");
    await page.goto("/");

    const trigger = page.locator('button[aria-controls="mobile-navigation"]');
    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.click();

    const panel = page.getByTestId("mobile-nav-panel");
    await expect(panel).toBeVisible();
    await expect(page.locator('[data-testid="mobile-nav-panel"]')).toHaveCount(1);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();

    await trigger.click();
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(panel).toBeVisible();

    await page.getByRole("menuitem", { name: "Portfolio" }).click();
    await expect(panel).toBeHidden();
    await expect(page).toHaveURL(/\/portfolio$/);
  });
});

test.describe("desktop navigation", () => {
  test("hides burger menu and keeps desktop links visible", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "Desktop Chrome", "Runs only in the desktop project");
    await page.goto("/");

    const trigger = page.locator('button[aria-controls="mobile-navigation"]');
    await expect(trigger).toBeHidden();

    const desktopNav = page.getByRole("navigation", { name: "Main" });
    await expect(desktopNav).toBeVisible();
    await expect(desktopNav.getByRole("link", { name: "Portfolio" })).toBeVisible();
    await expect(page.locator('[data-testid="mobile-nav-panel"]')).toHaveCount(0);
  });
});
