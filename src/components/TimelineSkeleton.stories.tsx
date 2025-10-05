import type { Meta, StoryObj } from "@storybook/react-vite";
import { TimelineSkeleton } from "./TimelineSkeleton";

const meta: Meta<typeof TimelineSkeleton> = {
  title: "Components/TimelineSkeleton",
  component: TimelineSkeleton,
  render: () => (
    <div className="bg-muted/20 p-8">
      <TimelineSkeleton />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        component:
          "Placeholder animado para estados de carregamento da linha do tempo na página About.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof TimelineSkeleton>;

export const Loading: Story = {};
