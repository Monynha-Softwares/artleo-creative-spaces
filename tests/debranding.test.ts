import { beforeAll, describe, expect, it } from "vitest";
import { execSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist");
const srcDir = path.join(projectRoot, "src");
const publicDir = path.join(projectRoot, "public");
const indexFile = path.join(projectRoot, "index.html");

const skipDirs = new Set(["node_modules", ".git", "playwright", "tests"]);
const textExtensions = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".html",
  ".css",
  ".svg",
  ".txt",
  ".map",
]);

const collectFiles = (target: string): string[] => {
  const stats = statSync(target, { throwIfNoEntry: false });
  if (!stats) {
    return [];
  }

  if (stats.isFile()) {
    return [target];
  }

  if (!stats.isDirectory()) {
    return [];
  }

  const entries = readdirSync(target);
  const files: string[] = [];

  for (const entry of entries) {
    if (skipDirs.has(entry)) {
      continue;
    }

    const fullPath = path.join(target, entry);
    files.push(...collectFiles(fullPath));
  }

  return files;
};

const shouldCheck = (filePath: string) => {
  if (filePath === indexFile) {
    return true;
  }

  const ext = path.extname(filePath).toLowerCase();
  return textExtensions.has(ext);
};

const bannedToken = ["lov", "able"].join("");

describe("Branding hygiene", () => {
  beforeAll(() => {
    execSync("npm run build -- --emptyOutDir", { stdio: "inherit" });
  }, 180_000);

  it("removes banned builder references from build and source", () => {
    const targets = [distDir, srcDir, publicDir, indexFile];
    const files = targets.flatMap((target) => {
      try {
        return collectFiles(target);
      } catch (error) {
        return [];
      }
    });

    const offending: string[] = [];
    for (const file of files) {
      if (!shouldCheck(file)) {
        continue;
      }

      const content = readFileSync(file, "utf8").toLowerCase();
      if (content.includes(bannedToken)) {
        offending.push(file);
      }
    }

    expect(offending, `Unexpected references in: ${offending.join(", ")}`).toHaveLength(0);
  });
});
