import { expect, test } from "@playwright/test";

test.describe("mobile navigation", () => {
  test("opens overlay and closes after navigation", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-chromium", "Runs only on the standard mobile viewport");

    await page.goto("/");

    const toggle = page.locator("button[aria-controls='mobile-navigation']");
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();

    await expect(toggle).toHaveAttribute("aria-expanded", "true");

    const dialog = page.getByRole("dialog", { name: /art leo navigation/i });
    await expect(dialog).toBeVisible();
    await expect(page.locator("nav[role='menu']")).toHaveCount(1);

    const firstItem = page.getByRole("menuitem", { name: "Home" });
    await expect(firstItem).toBeFocused();

    await page.keyboard.press("Shift+Tab");
    await expect(page.getByRole("button", { name: /close menu/i })).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(firstItem).toBeFocused();

    await page.getByRole("menuitem", { name: "Portfolio" }).click();
    await page.waitForURL("**/portfolio");

    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("[role='dialog'][aria-labelledby]")).toHaveCount(0);
  });

  test("respects reduced motion preferences", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-reduced-motion", "Runs only on the reduced motion viewport");

    await page.goto("/");

    const toggle = page.locator("button[aria-controls='mobile-navigation']");
    await toggle.click();

    const dialog = page.getByRole("dialog", { name: /art leo navigation/i });
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toBeFocused();
  });
});

test.describe("desktop navigation", () => {
  test("renders desktop links without overlay", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium", "Runs only on the desktop viewport");

    await page.goto("/");

    await expect(page.locator("button[aria-controls='mobile-navigation']")).toBeHidden();
    await expect(page.getByRole("link", { name: "Home" }).first()).toBeVisible();
    await expect(page.locator("nav[role='menu']")).toHaveCount(0);
  });
});
