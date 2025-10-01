import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type TextTypeProps = {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
};

export const TextType = ({ text, speed = 28, delay = 0, className }: TextTypeProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [displayedText, setDisplayedText] = useState(prefersReducedMotion ? text : "");
  const indexRef = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayedText(text);
    }
  }, [prefersReducedMotion, text]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (typeof window === "undefined") return;

    indexRef.current = 0;
    setDisplayedText("");

    let intervalId: number | undefined;
    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        indexRef.current += 1;
        setDisplayedText(text.slice(0, indexRef.current));
        if (indexRef.current >= text.length) {
          if (intervalId) {
            window.clearInterval(intervalId);
          }
        }
      }, 1000 / speed);
    }, delay * 1000);

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [delay, prefersReducedMotion, speed, text]);

  return (
    <p className={cn("whitespace-pre-line", className)} aria-live="polite">
      {displayedText}
      {!prefersReducedMotion && indexRef.current < text.length ? (
        <span className="ml-1 inline-block h-5 w-2 animate-pulse rounded bg-primary/60 align-middle" aria-hidden="true" />
      ) : null}
    </p>
  );
};
