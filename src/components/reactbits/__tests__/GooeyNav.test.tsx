import { MemoryRouter } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { GooeyNav } from "../GooeyNav";
import { MobileNavProvider } from "@/contexts/MobileNavContext";

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    isAdmin: false,
    signOut: vi.fn(),
  }),
}));

const renderNavigation = () =>
  render(
    <MemoryRouter>
      <MobileNavProvider>
        <GooeyNav />
      </MobileNavProvider>
    </MemoryRouter>,
  );

describe("GooeyNav", () => {
  it("opens the mobile menu and focuses the first item", async () => {
    const user = userEvent.setup();
    renderNavigation();

    const toggle = screen.getByRole("button", { name: /open navigation/i });
    await user.click(toggle);

    const menu = await screen.findByRole("menu");
    expect(menu).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    const firstItem = screen.getByRole("menuitem", { name: /home/i });
    await waitFor(() => expect(firstItem).toHaveFocus());

    await user.tab();
    const secondItem = screen.getByRole("menuitem", { name: /portfolio/i });
    await waitFor(() => expect(secondItem).toHaveFocus());

    await user.tab({ shift: true });
    await waitFor(() => expect(firstItem).toHaveFocus());
  });

  it("traps focus and restores the trigger when closed with Escape", async () => {
    const user = userEvent.setup();
    renderNavigation();

    const toggle = screen.getByRole("button", { name: /open navigation/i });
    await user.click(toggle);

    await screen.findByRole("menu");

    await user.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });
});
