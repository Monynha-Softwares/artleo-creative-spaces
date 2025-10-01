import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface RippleGridBackgroundProps {
  className?: string;
  color?: string;
}

export const RippleGridBackground = ({ className, color = "hsla(263, 70%, 65%, 0.35)" }: RippleGridBackgroundProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/40 to-background" />
      {prefersReducedMotion ? (
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
      ) : (
        <>
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{ backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`, backgroundSize: "60px 60px" }}
          />
          <div className="absolute inset-0 animate-ripple-grid bg-[radial-gradient(circle,_hsla(217,_90%,_60%,_0.25)_0,_transparent_55%)]" />
        </>
      )}
    </div>
  );
};
