import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pagesToAudit = ["/", "/portfolio", "/about", "/contact"];

test.describe("axe accessibility", () => {
  for (const path of pagesToAudit) {
    test(`reports no critical violations on ${path}`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();

      const criticalViolations = results.violations.filter((violation) => violation.impact === "critical");
      expect(criticalViolations).toHaveLength(0);
    });
  }
});
