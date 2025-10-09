import { expect, test } from "@playwright/test";

test.describe("mobile navigation", () => {
  test.use({ viewport: { width: 360, height: 780 } });

  test("opens overlay, shows a single menu, and closes after navigation", async ({ page }) => {
    await page.goto("/");

    const toggle = page.getByRole("button", { name: /open navigation/i });
    await expect(toggle).toBeVisible();

    await toggle.click();

    const dialog = page.getByRole("dialog", { name: /main navigation menu/i });
    await expect(dialog).toBeVisible();
    await expect(page.getByRole("menu")).toHaveCount(1);

    await page.getByRole("menuitem", { name: /portfolio/i }).click();

    await expect(dialog).toBeHidden();
    await expect(page.getByRole("menu")).toHaveCount(0);
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  test("respects prefers-reduced-motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const toggle = page.getByRole("button", { name: /open navigation/i });
    await toggle.click();

    const dialog = page.getByRole("dialog", { name: /main navigation menu/i });
    await expect(dialog).toHaveAttribute("data-reduced-motion", "true");
  });
});

test.describe("desktop navigation", () => {
  test.use({ viewport: { width: 1280, height: 780 } });

  test("shows desktop links without rendering the mobile overlay", async ({ page }) => {
    await page.goto("/");

    const toggle = page.getByRole("button", { name: /open navigation/i });
    await expect(toggle).toBeHidden();

    const desktopLinks = page.getByRole("navigation", { name: /main/i }).getByRole("link");
    await expect(desktopLinks.filter({ hasText: "Portfolio" })).toHaveCount(1);
    await expect(page.getByRole("dialog", { name: /main navigation menu/i })).toHaveCount(0);
  });
});
