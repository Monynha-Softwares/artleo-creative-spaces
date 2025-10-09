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

describe("GooeyNav", () => {
  const setup = () =>
    render(
      <MemoryRouter initialEntries={["/"]}>
        <GooeyNav />
      </MemoryRouter>,
    );

  it("opens the mobile menu and focuses the first link", async () => {
    setup();
    const toggle = screen.getByRole("button", { name: /open navigation/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    const user = userEvent.setup();
    await user.click(toggle);

    const dialog = await screen.findByRole("dialog", { name: /navigation menu/i });
    expect(dialog).toBeVisible();

    const dialogScope = within(dialog);

    await waitFor(() => expect(toggle).toHaveAttribute("aria-expanded", "true"));
    await waitFor(() => expect(dialogScope.getByRole("link", { name: /home/i })).toHaveFocus());
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("cycles focus within the menu when tabbing", async () => {
    setup();
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /open navigation/i }));
    const dialog = await screen.findByTestId("mobile-menu-dialog");
    const dialogScope = within(dialog);

    const order = [
      dialogScope.getByRole("link", { name: /home/i }),
      dialogScope.getByRole("link", { name: /portfolio/i }),
      dialogScope.getByRole("link", { name: /about/i }),
      dialogScope.getByRole("link", { name: /contact/i }),
      dialogScope.getByRole("link", { name: /login/i }),
      dialogScope.getByRole("button", { name: /close menu/i }),
    ];

    await waitFor(() => expect(order[0]).toHaveFocus());

    for (let index = 1; index < order.length; index += 1) {
      await user.tab();
      expect(order[index]).toHaveFocus();
    }

    await user.tab();
    expect(order[0]).toHaveFocus();
  });

  it("closes the menu with escape and restores focus", async () => {
    setup();
    const user = userEvent.setup();
    const toggle = screen.getByRole("button", { name: /open navigation/i });

    await user.click(toggle);
    await screen.findByRole("dialog", { name: /navigation menu/i });

    await user.keyboard("{Escape}");
    await waitFor(() => expect(toggle).toHaveAttribute("aria-expanded", "false"));
    expect(toggle).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
  });
});
