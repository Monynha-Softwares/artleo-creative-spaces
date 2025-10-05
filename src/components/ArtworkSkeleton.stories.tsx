import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArtworkSkeleton } from "./ArtworkSkeleton";

const meta: Meta<typeof ArtworkSkeleton> = {
  title: "Components/ArtworkSkeleton",
  component: ArtworkSkeleton,
  render: () => (
    <div className="grid grid-cols-1 gap-6 bg-muted/20 p-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <ArtworkSkeleton key={index} />
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        component:
          "Skeleton responsivo usado para placeholder de cards de portfólio enquanto os dados carregam.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ArtworkSkeleton>;

export const GridLoading: Story = {};
