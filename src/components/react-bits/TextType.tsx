import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface TextTypeProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
}

export const TextType = ({ text, speed = 45, delay = 300, className }: TextTypeProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [visibleChars, setVisibleChars] = useState(prefersReducedMotion ? text.length : 0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setVisibleChars(text.length);
      return;
    }

    let cleanup: (() => void) | undefined;
    const timeout = window.setTimeout(() => {
      const interval = window.setInterval(() => {
        setVisibleChars((current) => {
          if (current >= text.length) {
            window.clearInterval(interval);
            return current;
          }
          return current + 1;
        });
      }, speed);
      cleanup = () => window.clearInterval(interval);
    }, delay);

    return () => {
      window.clearTimeout(timeout);
      cleanup?.();
    };
  }, [delay, prefersReducedMotion, speed, text]);

  return <p className={cn("font-light leading-relaxed text-muted-foreground", className)}>{text.slice(0, visibleChars)}</p>;
};
