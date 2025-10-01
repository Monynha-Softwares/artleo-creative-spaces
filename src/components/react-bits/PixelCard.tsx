import { ReactNode, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface PixelCardProps {
  imageUrl: string;
  title: string;
  meta?: string;
  children?: ReactNode;
  className?: string;
}

export const PixelCard = ({ imageUrl, title, meta, children, className }: PixelCardProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const gridPattern = useMemo(
    () =>
      `linear-gradient(90deg, hsla(263, 70%, 65%, 0.12) 1px, transparent 1px), linear-gradient(180deg, hsla(217, 91%, 60%, 0.12) 1px, transparent 1px)`,
    [],
  );

  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/80 bg-card/90 backdrop-blur",
        "transition-shadow duration-500",
        className,
      )}
      whileHover={prefersReducedMotion ? undefined : { y: -8 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
    >
      <div className="relative">
        <img
          src={imageUrl}
          alt={title}
          className={cn(
            "h-full w-full object-cover transition-transform duration-700",
            prefersReducedMotion ? "" : "group-hover:scale-110",
          )}
          loading="lazy"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            backgroundImage: gridPattern,
            backgroundSize: "24px 24px, 18px 18px",
            mixBlendMode: "screen",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent" />
      </div>
      <div className="relative space-y-3 p-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {meta && <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{meta}</p>}
        </div>
        {children}
      </div>
    </motion.div>
  );
};
