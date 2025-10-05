import type { Meta, StoryObj } from "@storybook/react";
import { Button, type ButtonProps } from "./button";

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    children: {
      control: "text",
      description: "Conteúdo exibido dentro do botão",
    },
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline", "ghost", "link", "hero", "glass"],
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg", "icon"],
    },
  },
  args: {
    children: "Call to action",
    variant: "default",
    size: "default",
  },
} satisfies Meta<ButtonProps>;

export default meta;

type Story = StoryObj<ButtonProps>;

export const Default: Story = {};

export const Glass: Story = {
  args: {
    variant: "glass",
    children: "Glass CTA",
  },
};

export const Hero: Story = {
  args: {
    variant: "hero",
    size: "lg",
    children: "Hero button",
  },
};

export const IconButton: Story = {
  args: {
    size: "icon",
    children: "⚡️",
    "aria-label": "Spark button",
  },
};
