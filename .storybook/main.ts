import { mergeConfig } from "vite";
import { fileURLToPath } from "url";
import path from "path";
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@chromatic-com/storybook", "@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) => {
    return mergeConfig(config, {
      resolve: {
        alias: {
          "@": fileURLToPath(new URL("../src", import.meta.url)),
          "~": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src"),
        },
      },
    });
  },
};

export default config;
