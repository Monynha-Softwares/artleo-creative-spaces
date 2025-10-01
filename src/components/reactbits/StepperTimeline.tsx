import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type StepperItem = {
  label: string;
  description: string;
};

type StepperTimelineProps = {
  items: StepperItem[];
  className?: string;
};

export const StepperTimeline = ({ items, className }: StepperTimelineProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className={cn("relative", className)}>
      <div className="absolute left-5 top-0 bottom-0 hidden w-px bg-gradient-to-b from-primary/20 via-primary/40 to-primary/10 md:block" />
      <ul className="space-y-6">
        {items.map((item, index) => {
          const delay = index * 0.15;
          const content = (
            <div className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-card/70 p-6 shadow-card">
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{item.label}</span>
              <p className="text-fluid-lg text-foreground">{item.description}</p>
            </div>
          );

          return (
            <li key={`${item.label}-${item.description}`} className="relative flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex items-center gap-3 md:flex-col md:items-start">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-secondary/70 text-primary-foreground shadow-lg">
                  <span className="text-sm font-semibold">{index + 1}</span>
                  <span className="absolute -inset-1 rounded-full bg-gradient-primary opacity-20 blur-xl" aria-hidden="true" />
                </div>
                <div className="hidden h-full w-px bg-gradient-to-b from-primary/20 to-transparent md:block" />
              </div>
              {prefersReducedMotion ? (
                content
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
                  className="flex-1"
                >
                  {content}
                </motion.div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
