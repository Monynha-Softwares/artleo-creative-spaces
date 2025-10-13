import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
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
    const { container, getByLabelText, getByTitle } = render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>,
    );

    expect(getByLabelText(/art leo home/i)).toBeInTheDocument();
    expect(getByTitle("Art Leo mark")).toBeInTheDocument();
    expect(getByTitle("Art Leo")).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });
});
