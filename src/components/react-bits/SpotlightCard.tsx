import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type { LucideIcon } from "lucide-react";

interface SpotlightCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  accent?: "primary" | "secondary";
  className?: string;
}

export const SpotlightCard = ({
  title,
  description,
  icon: Icon,
  accent = "primary",
  className,
}: SpotlightCardProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = usePrefersReducedMotion();

  const handlePointerMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const accentColor =
    accent === "primary"
      ? "from-primary/60 via-primary/30 to-transparent"
      : "from-secondary/60 via-secondary/30 to-transparent";

  return (
    <motion.div
      whileHover={prefersReducedMotion ? undefined : { y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      onPointerMove={prefersReducedMotion ? undefined : handlePointerMove}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card/80 p-8 shadow-card transition-colors",
        "before:pointer-events-none before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-300",
        !prefersReducedMotion &&
          "hover:border-primary/40 hover:shadow-[0_30px_80px_-40px_hsla(263,70%,65%,0.65)] before:opacity-100",
        className,
      )}
    >
      {!prefersReducedMotion && (
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: "radial-gradient(circle at top, hsla(0,0%,100%,0.1), transparent 55%)" }}
        />
      )}
      {!prefersReducedMotion && (
        <div
          className={cn(
            "pointer-events-none absolute -inset-1 rounded-[40px] opacity-0 blur-2xl transition-opacity duration-300",
            `bg-gradient-to-br ${accentColor}`,
            "group-hover:opacity-100",
          )}
          style={{
            transform: `translate(${position.x / 20}px, ${position.y / 20}px) scale(1.05)`,
          }}
        />
      )}
      <div className="relative flex flex-col gap-4">
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full border border-primary/20 bg-primary/10",
            accent === "secondary" && "border-secondary/20 bg-secondary/10",
          )}
        >
          <Icon className={cn("h-7 w-7", accent === "secondary" ? "text-secondary" : "text-primary")} />
        </div>
        <div>
          <h3 className="text-fluid-xl font-semibold text-foreground">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};
