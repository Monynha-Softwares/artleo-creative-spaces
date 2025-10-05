import type { Preview } from "@storybook/react";
import "../src/index.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "Surface",
      values: [
        { name: "Surface", value: "hsl(var(--background))" },
        { name: "Canvas", value: "#0f172a" },
      ],
    },
  },
};

export default preview;
