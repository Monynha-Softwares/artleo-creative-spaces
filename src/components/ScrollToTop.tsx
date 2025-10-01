import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReduced ? "auto" : "smooth",
    });
  }, [pathname, search]);

  return null;
}

ScrollToTop.displayName = "ScrollToTop";
