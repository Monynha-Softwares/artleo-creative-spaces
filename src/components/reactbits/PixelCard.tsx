import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type PixelCardProps = {
  imageUrl: string;
  title: string;
  category: string;
  meta?: string;
  className?: string;
};

export const PixelCard = ({
  imageUrl,
  title,
  category,
  meta,
  className,
}: PixelCardProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [offset, setOffset] = useState({ x: "50%", y: "50%" });

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-border/80 bg-card/80 backdrop-blur-xl",
        "shadow-lg transition-transform duration-500 hover:-translate-y-1",
        className,
      )}
      onMouseMove={(event) => {
        if (prefersReducedMotion) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        setOffset({ x: `${x}%`, y: `${y}%` });
      }}
      onMouseLeave={() => setOffset({ x: "50%", y: "50%" })}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div
          className="absolute inset-0 mix-blend-screen"
          style={{
            background: prefersReducedMotion
              ? "linear-gradient(135deg, rgba(79,70,229,0.25), rgba(56,189,248,0.25))"
              : `radial-gradient(circle at ${offset.x} ${offset.y}, rgba(99,102,241,0.35), transparent 60%)`,
          }}
        />
        {!prefersReducedMotion && (
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(15,23,42,0.35) 0, rgba(15,23,42,0.35) 1px, transparent 1px, transparent 6px)",
              backgroundSize: "12px 12px",
              mixBlendMode: "multiply",
            }}
          />
        )}
      </div>
      <div className="relative space-y-3 p-6">
        <span className="inline-flex items-center rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          {category}
        </span>
        <h3 className="text-fluid-xl font-semibold text-foreground">{title}</h3>
        {meta ? <p className="text-sm text-muted-foreground">{meta}</p> : null}
      </div>
    </motion.article>
  );
};
