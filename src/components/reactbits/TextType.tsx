import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type TextTypeProps = {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
};

export const TextType = ({ text, speed = 40, delay = 400, className }: TextTypeProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [displayed, setDisplayed] = useState(prefersReducedMotion ? text : "");

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayed(text);
      return;
    }

    let mounted = true;
    const characters = Array.from(text);
    let index = 0;

    let interval: ReturnType<typeof setInterval> | null = null;

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        if (!mounted) return;
        index += 1;
        setDisplayed(characters.slice(0, index).join(""));
        if (index >= characters.length) {
          if (interval) {
            clearInterval(interval);
          }
        }
      }, speed);
    }, delay);

    return () => {
      mounted = false;
      clearTimeout(timeout);
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [delay, prefersReducedMotion, speed, text]);

  return (
    <p className={className} aria-live="polite">
      {displayed}
      {!prefersReducedMotion && displayed.length < text.length && (
        <span className="ml-0.5 inline-block w-2 animate-pulse bg-primary/80" aria-hidden />
      )}
    </p>
  );
};
