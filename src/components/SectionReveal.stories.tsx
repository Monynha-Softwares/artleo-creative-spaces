import type { Meta, StoryObj } from "@storybook/react-vite";
import { SectionReveal } from "./SectionReveal";

const meta: Meta<typeof SectionReveal> = {
  title: "Components/SectionReveal",
  component: SectionReveal,
  args: {
    delay: 0,
    className: "space-y-4",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Container utilitário que aplica animação de fade + translate quando o conteúdo entra na viewport.",
      },
    },
  },
  render: (args) => (
    <div className="mx-auto flex min-h-[320px] max-w-3xl items-center justify-center bg-muted/20 p-8">
      <SectionReveal {...args}>
        <div className="space-y-3 rounded-xl border border-border/40 bg-card/70 p-6 shadow-lg">
          <h3 className="text-xl font-semibold">Transição suave</h3>
          <p className="text-sm text-muted-foreground">
            Utilize as props <code>delay</code> e <code>className</code> para ajustar o momento e a aparência do efeito.
          </p>
          <p className="text-sm text-muted-foreground">
            Este componente é ideal para revelar seções de conteúdo ao rolar a página sem precisar repetir lógica do Framer
            Motion.
          </p>
        </div>
      </SectionReveal>
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof SectionReveal>;

export const Instant: Story = {};

export const Delayed: Story = {
  args: {
    delay: 0.3,
  },
};
