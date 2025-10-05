import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { Navigation } from "./Navigation";

const meta = {
  title: "Layout/Navigation",
  component: Navigation,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <div className="h-[240px] bg-background">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Navigation>;

export default meta;

type Story = StoryObj<typeof Navigation>;

export const Default: Story = {};

export const ContactActive: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/contact"]}>
        <div className="h-[240px] bg-background">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};
