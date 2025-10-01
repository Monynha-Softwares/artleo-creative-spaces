import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

if (typeof window !== "undefined" && !("matchMedia" in window)) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => {
      const listeners = new Set<(event: MediaQueryListEvent) => void>();
      return {
        media: query,
        matches: false,
        onchange: null,
        addEventListener: (_: string, listener: (event: MediaQueryListEvent) => void) => listeners.add(listener),
        removeEventListener: (_: string, listener: (event: MediaQueryListEvent) => void) => listeners.delete(listener),
        addListener: (listener: (event: MediaQueryListEvent) => void) => listeners.add(listener),
        removeListener: (listener: (event: MediaQueryListEvent) => void) => listeners.delete(listener),
        dispatchEvent: (event: MediaQueryListEvent) => {
          listeners.forEach((listener) => listener(event));
          return true;
        },
      } as MediaQueryList;
    },
  });
}

vi.mock("@/lib/supabase-client", () => ({
  supabase: {},
}));
