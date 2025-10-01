import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { motion } from "framer-motion";

export interface StepperTimelineItem {
  title: string;
  subtitle?: string;
  year: string;
}

interface StepperTimelineProps {
  items: StepperTimelineItem[];
  className?: string;
}

export const StepperTimeline = ({ items, className }: StepperTimelineProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className={cn("relative", className)}>
      <div className="absolute left-5 top-0 h-full w-px bg-gradient-to-b from-primary/60 via-border to-border/40" />
      <div className="space-y-10">
        {items.map((item, index) => (
          <motion.div
            key={`${item.year}-${item.title}`}
            initial={prefersReducedMotion ? false : { opacity: 0, x: -20 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative pl-16"
          >
            <div className="absolute left-0 top-1.5 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-secondary/70 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30">
              {item.year}
            </div>
            <div className="rounded-2xl border border-border/80 bg-card/80 p-6 backdrop-blur">
              <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
              {item.subtitle && <p className="mt-2 text-sm text-muted-foreground">{item.subtitle}</p>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
