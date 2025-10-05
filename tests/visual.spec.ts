import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page, TestInfo } from "@playwright/test";
import { access, mkdir } from "node:fs/promises";
import path from "node:path";

const routes = [
  { path: "/", slug: "home" },
  { path: "/portfolio", slug: "portfolio" },
  { path: "/about", slug: "about" },
];

const screenshotRoot = path.join("reports", "playwright");

async function captureBreakpointScreenshot(page: Page, testInfo: TestInfo, slug: string) {
  const projectDir = path.join(testInfo.config.rootDir, screenshotRoot, testInfo.project.name);
  await mkdir(projectDir, { recursive: true });
  const filePath = path.join(projectDir, `${slug}.png`);

  await page.screenshot({
    path: filePath,
    fullPage: true,
    animations: "disabled",
    caret: "hide",
  });

  testInfo.attachments.push({
    name: `${testInfo.project.name}-${slug}`,
    path: filePath,
    contentType: "image/png",
  });

  await expect(access(filePath)).resolves.toBeUndefined();
}

test.describe("Capturas responsivas", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addStyleTag({
      content:
        "*{transition-duration:0s !important; animation-duration:0s !important; animation-delay:0s !important;}",
    });
  });

  for (const route of routes) {
    test(`gera captura da rota ${route.slug}`, async ({ page }, testInfo) => {
      await page.goto(route.path);
      await page.waitForLoadState("networkidle");
      await captureBreakpointScreenshot(page, testInfo, route.slug);
    });
  }

  test("home sem violações axe-core @axe", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
