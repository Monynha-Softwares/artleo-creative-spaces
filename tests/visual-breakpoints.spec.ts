import { test } from "@playwright/test";

const pagesToCapture = ["/", "/portfolio", "/about", "/contact"];

test.describe("breakpoint visual captures", () => {
  for (const path of pagesToCapture) {
    test(`captures ${path} view`, async ({ page }, testInfo) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      const screenshotPath = testInfo.outputPath(`capture-${testInfo.project.name}${path.replace(/\//g, "-") || "-home"}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      testInfo.attachments.push({
        name: `${testInfo.project.name}-${path}-screenshot`,
        contentType: "image/png",
        path: screenshotPath,
      });
    });
  }
});
