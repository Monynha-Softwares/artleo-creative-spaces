import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
}

if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (cb: FrameRequestCallback) => window.setTimeout(() => cb(Date.now()), 16);
}

if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = (id: number) => clearTimeout(id);
}

// Silence Framer Motion warnings during tests where reduced motion is assumed
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<typeof import("framer-motion")>("framer-motion");
  return {
    ...actual,
    useReducedMotion: () => true,
  };
});

vi.mock("gsap", () => ({
  gsap: {
    timeline: () => ({
      set: () => ({ to: () => ({}) }),
      to: () => ({ to: () => ({}) }),
    }),
  },
}));
