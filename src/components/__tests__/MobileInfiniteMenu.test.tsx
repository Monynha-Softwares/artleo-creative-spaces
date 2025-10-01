import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { vi, describe, it, expect, beforeEach } from "vitest";
import type { ReactNode } from "react";

import { MobileInfiniteMenu, mobileNavigationItems } from "../MobileInfiniteMenu";

const renderWithRouter = (ui: ReactNode) => {
  const history = createMemoryHistory({ initialEntries: ["/"] });
  const view = render(<Router location={history.location} navigator={history}>{ui}</Router>);
  return { history, ...view };
};

describe("MobileInfiniteMenu", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the correct number of menu items", () => {
    renderWithRouter(<MobileInfiniteMenu items={mobileNavigationItems} />);
    const buttons = screen.getAllByRole("button", { name: /home|portfolio|about|contact/i });
    expect(buttons).toHaveLength(mobileNavigationItems.length);
  });

  it("navigates and notifies when an item is selected", async () => {
    const onItemSelected = vi.fn();
    const { history } = renderWithRouter(
      <MobileInfiniteMenu items={mobileNavigationItems} onItemSelected={onItemSelected} />,
    );

    await userEvent.click(screen.getByRole("button", { name: /portfolio/i }));

    expect(history.location.pathname).toBe("/portfolio");
    expect(onItemSelected).toHaveBeenCalledTimes(1);
  });

  it("falls back to the static list when prefers-reduced-motion is enabled", async () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi
      .fn()
      .mockImplementation((query: string) => ({
        media: query,
        matches: true,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

    renderWithRouter(<MobileInfiniteMenu items={mobileNavigationItems} />);

    await waitFor(() => expect(screen.getByTestId("mobile-infinite-menu-fallback")).toBeInTheDocument());

    window.matchMedia = originalMatchMedia;
  });
});
