import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type SpotlightCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
};

export const SpotlightCard = ({
  title,
  description,
  icon,
  className,
}: SpotlightCardProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [position, setPosition] = useState({ x: "50%", y: "50%" });

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card/80 backdrop-blur-xl p-8 shadow-lg",
        "transition-colors duration-300",
        className,
      )}
      onMouseMove={(event) => {
        if (prefersReducedMotion) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        setPosition({ x: `${x}%`, y: `${y}%` });
      }}
      onMouseLeave={() => setPosition({ x: "50%", y: "50%" })}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: prefersReducedMotion
            ? undefined
            : `radial-gradient(400px circle at ${position.x} ${position.y}, rgba(99,102,241,0.3), transparent 60%)`,
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 flex flex-col gap-4">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15 text-primary">
          {icon}
        </div>
        <div>
          <h3 className="text-fluid-xl font-semibold text-foreground">{title}</h3>
          <p className="text-muted-foreground text-fluid-base mt-2">{description}</p>
        </div>
      </div>
    </motion.article>
  );
};
