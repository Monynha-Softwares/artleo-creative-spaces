import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface SilkBackgroundProps {
  className?: string;
  hueStart?: number;
  hueEnd?: number;
  intensity?: number;
}

export const SilkBackground = ({
  className,
  hueStart = 265,
  hueEnd = 210,
  intensity = 0.4,
}: SilkBackgroundProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const gradients = useMemo(
    () => [
      {
        className: "animate-silk-blob",
        style: {
          background: `radial-gradient(circle at 50% 50%, hsl(${hueStart} 80% 65% / ${intensity}), transparent 60%)`,
        },
      },
      {
        className: "animate-silk-blob delay-700",
        style: {
          background: `radial-gradient(circle at 50% 50%, hsl(${hueEnd} 80% 60% / ${intensity}), transparent 65%)`,
        },
      },
      {
        className: "animate-silk-blob delay-1000",
        style: {
          background: `radial-gradient(circle at 50% 50%, hsl(${(hueStart + hueEnd) / 2} 85% 70% / ${intensity * 0.9}), transparent 55%)`,
        },
      },
    ],
    [hueEnd, hueStart, intensity],
  );

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_hsla(263,_75%,_60%,_0.35),_transparent_55%),_radial-gradient(circle_at_bottom,_hsla(210,_85%,_55%,_0.25),_transparent_60%)]" />
      {prefersReducedMotion ? (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_hsla(263,_75%,_60%,_0.2),_transparent_65%)]" />
      ) : (
        gradients.map((gradient, index) => (
          <div
            key={index}
            className={cn(
              "absolute -inset-1 blur-3xl mix-blend-screen opacity-80",
              gradient.className,
            )}
            style={gradient.style}
          />
        ))
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/30 to-background" />
    </div>
  );
};
