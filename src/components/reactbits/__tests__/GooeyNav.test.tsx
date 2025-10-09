import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { GooeyNav } from "../GooeyNav";

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    isAdmin: false,
    signOut: vi.fn(),
  }),
}));

const renderNav = () =>
  render(
    <MemoryRouter initialEntries={["/"]}>
      <GooeyNav />
    </MemoryRouter>,
  );

describe("GooeyNav mobile navigation", () => {
  it("opens, traps focus, and toggles aria-expanded", async () => {
    renderNav();
    const user = userEvent.setup();
    const toggle = screen.getByRole("button", { name: /open navigation/i });

    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);

    const dialog = screen.getByRole("dialog", { name: /main navigation/i });
    await waitFor(() => expect(dialog).toBeVisible());
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    within(dialog).getByRole("menu", { name: /mobile/i });
    const menuItems = within(dialog).getAllByRole("menuitem");
    const firstItem = menuItems[0];
    expect(firstItem).toHaveFocus();

    // tab through items and ensure focus cycles back to the first link
    for (let index = 0; index < menuItems.length; index += 1) {
      await user.tab();
    }
    expect(firstItem).toHaveFocus();

    // close with escape and ensure focus returns to trigger
    await user.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });

  it("closes the menu when a link is activated", async () => {
    renderNav();
    const user = userEvent.setup();
    const toggle = screen.getByRole("button", { name: /open navigation/i });
    await user.click(toggle);

    const dialog = screen.getByRole("dialog", { name: /main navigation/i });
    const menuItem = within(dialog).getAllByRole("menuitem")[0];
    await user.click(menuItem);

    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});
