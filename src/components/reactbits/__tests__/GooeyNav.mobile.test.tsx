import { describe, expect, test, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import { GooeyNav } from "../GooeyNav";

vi.mock("@/contexts/AuthContext", () => {
  const signOut = vi.fn();
  return {
    useAuth: () => ({
      user: null,
      isAdmin: false,
      signOut,
    }),
  };
});

vi.mock("@/hooks/use-mobile", () => ({
  useIsMobile: () => true,
}));

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<typeof import("framer-motion")>("framer-motion");
  return {
    ...actual,
    useReducedMotion: () => true,
  };
});

describe("GooeyNav mobile menu", () => {
  beforeEach(() => {
    window.innerWidth = 360;
  });

  test("opens, traps focus, and closes with escape", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/"]}>
        <GooeyNav />
      </MemoryRouter>,
    );

    const trigger = screen.getByRole("button", { name: /open navigation/i });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);

    const firstItem = await screen.findByRole("menuitem", { name: "Home" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(firstItem).toHaveFocus();

    await user.keyboard("{Tab}");
    const secondItem = screen.getByRole("menuitem", { name: "Portfolio" });
    expect(secondItem).toHaveFocus();

    await user.keyboard("{Shift>}{Tab}{/Shift}");
    const panel = screen.getByTestId("mobile-menu-panel");
    await waitFor(() => {
      const active = document.activeElement as HTMLElement | null;
      expect(active && panel.contains(active)).toBe(true);
    });

    await user.keyboard("{Tab}");
    await waitFor(() => {
      const active = document.activeElement as HTMLElement | null;
      expect(active && panel.contains(active)).toBe(true);
    });

    await user.keyboard("{ArrowDown}");
    const activeAfterArrow = document.activeElement as HTMLElement | null;
    expect(activeAfterArrow?.getAttribute("role")).toBe("menuitem");

    await user.keyboard("{Escape}");
    expect(screen.queryByTestId("mobile-menu-panel")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("closes after activating a link", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/"]}>
        <GooeyNav />
      </MemoryRouter>,
    );

    const trigger = screen.getByRole("button", { name: /open navigation/i });
    await user.click(trigger);

    const portfolioLink = await screen.findByRole("menuitem", { name: "Portfolio" });
    await user.click(portfolioLink);

    expect(screen.queryByTestId("mobile-menu-panel")).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
