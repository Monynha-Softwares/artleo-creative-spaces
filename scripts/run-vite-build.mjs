import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const sanitizedEnv = { ...process.env };

for (const key of [
  "npm_config_http-proxy",
  "npm_config_http_proxy",
  "npm_config_https-proxy",
  "npm_config_https_proxy",
  "npm_config_proxy",
]) {
  if (key in sanitizedEnv) {
    delete sanitizedEnv[key];
  }
}

const viteCli = fileURLToPath(new URL("../node_modules/vite/bin/vite.js", import.meta.url));

const cliArgs = [viteCli, "build", ...process.argv.slice(2)];

const child = spawn(process.execPath, cliArgs, {
  cwd: path.resolve(fileURLToPath(new URL("../", import.meta.url))),
  env: sanitizedEnv,
  stdio: "inherit",
});

child.on("close", (code) => {
  process.exit(code ?? 0);
});
