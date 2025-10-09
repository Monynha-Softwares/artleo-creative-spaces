import "@testing-library/jest-dom/vitest";

declare global {
  interface Window {
    matchMedia: (query: string) => MediaQueryList;
  }
}

if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  window.matchMedia = (query: string): MediaQueryList => {
    return {
      matches: query.includes("prefers-reduced-motion") ? false : false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    } as MediaQueryList;
  };
}
