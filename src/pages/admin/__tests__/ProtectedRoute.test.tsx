import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

type MockAuthValue = {
  user: null;
  session: null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
};

const mockedUseAuth = vi.mocked(useAuth);

const buildAuthValue = (overrides?: Partial<MockAuthValue>): MockAuthValue => ({
  user: null,
  session: null,
  isAdmin: false,
  isLoading: false,
  signIn: vi.fn(async () => ({ error: null })),
  signUp: vi.fn(async () => ({ error: null })),
  signOut: vi.fn(async () => {}),
  ...overrides,
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("ProtectedRoute", () => {
  it("renders a loader while authentication is loading", () => {
    mockedUseAuth.mockReturnValue(buildAuthValue({ isLoading: true }));

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<div>Admin content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders children when user is an admin", () => {
    mockedUseAuth.mockReturnValue(buildAuthValue({ isAdmin: true }));

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<div>Admin content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Admin content")).toBeInTheDocument();
  });

  it("redirects non-admin users to the auth screen", () => {
    mockedUseAuth.mockReturnValue(buildAuthValue({ isAdmin: false }));

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route path="/auth" element={<div>Auth screen</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<div>Admin content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Auth screen")).toBeInTheDocument();
  });
});
