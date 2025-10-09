import { test, expect } from "@playwright/test";

test.describe("mobile navigation", () => {
  test("opens overlay with a single menu panel", async ({ page }, testInfo) => {
    if (!testInfo.project.name.startsWith("mobile")) {
      test.skip();
    }

    await page.goto("/");
    const trigger = page.getByRole("button", { name: /open navigation/i });
    await expect(trigger).toBeVisible();

    await trigger.click();

    const panel = page.getByTestId("mobile-menu-panel");
    await expect(panel).toBeVisible();
    await expect(page.locator("[data-testid='mobile-menu-panel']")).toHaveCount(1);
    await expect(page.getByRole("menuitem", { name: "Home" })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("respects reduced motion preference", async ({ page }, testInfo) => {
    if (testInfo.project.name !== "mobile-reduced-motion") {
      test.skip();
    }

    await page.goto("/");
    const trigger = page.getByRole("button", { name: /open navigation/i });
    await trigger.click();

    const panel = page.getByTestId("mobile-menu-panel");
    await expect(panel).toBeVisible();

    const transitionDuration = await panel.evaluate((element) => {
      const styles = window.getComputedStyle(element);
      return styles.transitionDuration;
    });

    expect(transitionDuration === "0s" || transitionDuration === "0ms").toBeTruthy();
  });
});

test.describe("desktop navigation", () => {
  test("shows desktop links without hamburger", async ({ page }, testInfo) => {
    if (testInfo.project.name !== "desktop") {
      test.skip();
    }

    await page.goto("/");
    const trigger = page.getByRole("button", { name: /open navigation/i });
    await expect(trigger).toBeHidden();

    const nav = page.locator("nav[aria-label='Main']");
    await expect(nav.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Portfolio" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "About" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Contact" })).toBeVisible();
  });
});

test.describe("mobile interaction", () => {
  test("closes after navigation", async ({ page }, testInfo) => {
    if (!testInfo.project.name.startsWith("mobile")) {
      test.skip();
    }

    await page.goto("/");
    const trigger = page.getByRole("button", { name: /open navigation/i });
    await trigger.click();

    await page.getByRole("menuitem", { name: "Portfolio" }).click();
    await expect(page.locator("[data-testid='mobile-menu-panel']")).toHaveCount(0);
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
