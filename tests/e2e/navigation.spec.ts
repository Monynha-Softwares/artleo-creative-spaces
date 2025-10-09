import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("mobile navigation", () => {
  test("toggles the menu and closes after navigation", async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.includes("mobile"), "Mobile viewport only");
    await page.goto("/");

    const toggle = page.locator("button[aria-controls='mobile-navigation']");
    await expect(toggle).toBeVisible();
    await toggle.click();

    const dialog = page.getByRole("dialog", { name: /navigation menu/i });
    await expect(dialog).toBeVisible();
    const menuList = page.locator("[data-test-mobile-menu]");
    await expect(menuList).toHaveCount(1);

    await menuList.getByRole("link", { name: /^portfolio$/i }).click();
    await page.waitForURL("**/portfolio");

    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(dialog).toBeHidden();
    await expect(menuList).toHaveCount(0);
  });

  test("passes axe-core checks", async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.includes("mobile"), "Mobile viewport only");

    await page.goto("/");
    const toggle = page.locator("button[aria-controls='mobile-navigation']");
    await toggle.click();
    const dialog = page.getByRole("dialog", { name: /navigation menu/i });
    await expect(dialog).toBeVisible();

    const results = await new AxeBuilder({ page })
      .disableRules(["region"])
      .include("[data-testid='mobile-menu-dialog']")
      .analyze();

    const criticalViolations = results.violations.filter((violation) => violation.impact === "critical");
    expect(criticalViolations).toHaveLength(0);
  });
});

test.describe("desktop navigation", () => {
  test("shows desktop links and hides burger", async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.includes("desktop"), "Desktop viewport only");
    await page.goto("/");

    const toggle = page.locator("button[aria-controls='mobile-navigation']");
    await expect(toggle).toBeHidden();
    await expect(page.getByRole("link", { name: /home/i })).toBeVisible();
    await expect(page.locator("[data-test-mobile-menu]")).toHaveCount(0);
  });
});

test.describe("reduced motion", () => {
  test("opens the menu without animations", async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.includes("reduced-motion"), "Reduced motion project only");
    await page.goto("/");
    const toggle = page.locator("button[aria-controls='mobile-navigation']");
    await toggle.click();
    const dialog = page.getByRole("dialog", { name: /navigation menu/i });
    await expect(dialog).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
  });
});
