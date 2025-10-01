import { ReactNode, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

type SpotlightCardProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  className?: string;
};

export const SpotlightCard = ({ title, description, icon, className }: SpotlightCardProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [position, setPosition] = useState({ x: "50%", y: "50%" });

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    setPosition({ x: `${x}%`, y: `${y}%` });
  };

  const handlePointerLeave = () => {
    if (prefersReducedMotion) return;
    setPosition({ x: "50%", y: "50%" });
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-8 transition-all duration-300",
        "hover:border-primary/60 hover:shadow-[0_20px_60px_-40px_rgba(103,80,255,0.8)]",
        className
      )}
      style={{
        ...(prefersReducedMotion
          ? {}
          : {
              backgroundImage: `radial-gradient(circle at ${position.x} ${position.y}, rgba(99,102,241,0.25), transparent 55%)`,
            }),
      }}
    >
      <div className="relative z-10 space-y-4">
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
        )}
        <h3 className="text-fluid-xl font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
      {!prefersReducedMotion && (
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/5 mix-blend-screen" />
        </div>
      )}
    </div>
  );
};
