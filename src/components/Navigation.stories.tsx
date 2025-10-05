import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Navigation } from "./Navigation";

const meta: Meta<typeof Navigation> = {
  title: "Components/Navigation",
  component: Navigation,
  decorators: [
    (Story, context) => {
      const initialEntries = context.args.initialPath ? [context.args.initialPath] : ["/"];
      return (
        <MemoryRouter initialEntries={initialEntries}>
          <div className="min-h-[320px] bg-background text-foreground">
            <Navigation />
            <main className="pt-24">
              <Routes>
                <Route path="*" element={<Story />} />
              </Routes>
            </main>
          </div>
        </MemoryRouter>
      );
    },
  ],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    initialPath: "/",
  },
  argTypes: {
    initialPath: {
      control: "select",
      options: ["/", "/portfolio", "/about", "/contact"],
      description: "Define a rota inicial para testar o estado ativo do menu.",
    },
  },
  render: () => (
    <section className="mx-auto max-w-4xl space-y-4 px-6">
      <p className="text-base text-muted-foreground">
        Use o seletor de controles para alternar entre as rotas e validar o realce ativo do menu Gooey.
      </p>
      <div className="rounded-lg border border-border/40 bg-card/50 p-6">
        <h2 className="text-lg font-semibold">Conteúdo da página</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Esta área simula o conteúdo da página atual enquanto a navegação fixa permanece visível no topo.
        </p>
      </div>
    </section>
  ),
};

export default meta;

type Story = StoryObj<typeof Navigation>;

export const Default: Story = {};

export const PortfolioActive: Story = {
  args: {
    initialPath: "/portfolio",
  },
};
