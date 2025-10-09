import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  let counter = 0;
  return {
    ...actual,
    useId: () => `test-id-${counter++}`,
  };
});

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    session: null,
    isAdmin: false,
    isLoading: false,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
  }),
}));

vi.mock("@/components/reactbits/FlowingMenu", () => ({
  FlowingMenu: () => <div data-testid="flowing-menu" />,
}));

import { Navigation } from "../Navigation";

describe("Navigation", () => {
  it("renders the custom brand SVG", () => {
    const { container } = render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText(/art leo home/i)).toBeInTheDocument();
    expect(screen.getByTitle("Art Leo mark")).toBeInTheDocument();
    expect(screen.getByTitle("Art Leo")).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });
});
