import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

type RippleGridBackgroundProps = {
  className?: string;
};

export const RippleGridBackground = ({ className }: RippleGridBackgroundProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
      <div
        className={cn(
          "absolute left-1/2 top-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10",
          prefersReducedMotion ? "opacity-40" : "opacity-80 [animation:rb-ripple_6s_ease-in-out_infinite_alternate]",
        )}
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(99,102,241,0.25) 0, transparent 60%), repeating-linear-gradient(90deg, rgba(99,102,241,0.1) 0, rgba(99,102,241,0.1) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(0deg, rgba(79,70,229,0.1) 0, rgba(79,70,229,0.1) 1px, transparent 1px, transparent 40px)",
        }}
      />
    </div>
  );
};
