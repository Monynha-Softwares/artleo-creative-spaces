import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";

const meta = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof Card>;

export const ProjectHighlight: Story = {
  render: (args) => (
    <Card className="w-[360px]" {...args}>
      <CardHeader>
        <CardTitle>Immersive Sculpture</CardTitle>
        <CardDescription>Interactive 3D experience for exhibition kiosks.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Built with React Three Fiber and motion cues inspired by neon studio lighting to guide visitors through each artifact.
        </p>
      </CardContent>
      <CardFooter className="justify-between">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">Motion · 2024</span>
        <Button size="sm" variant="secondary">
          View case study
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const Skeleton: Story = {
  render: (args) => (
    <Card className="w-[360px] animate-pulse bg-muted/30" {...args}>
      <div className="space-y-3 p-6">
        <div className="h-4 w-24 rounded bg-muted" />
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="h-24 rounded bg-muted/70" />
      </div>
    </Card>
  ),
};
