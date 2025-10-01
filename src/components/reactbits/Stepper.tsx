import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useMemo } from "react";
import { motion } from "framer-motion";

type StepItem = {
  id: string;
  title: string;
  description?: string;
};

type StepperProps = {
  steps: StepItem[];
  className?: string;
};

export const Stepper = ({ steps, className }: StepperProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const progress = useMemo(() => (steps.length > 1 ? 100 / (steps.length - 1) : 100), [steps.length]);

  return (
    <ol className={cn("relative space-y-8", className)}>
      <div className="absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-primary/60 via-primary/20 to-transparent md:block" />
      {steps.map((step, index) => (
        <li key={step.id} className="relative flex gap-4">
          <div className="flex-shrink-0">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border border-primary/40 text-sm font-semibold",
                "bg-primary/10 text-primary",
              )}
            >
              {index + 1}
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-fluid-lg font-semibold text-foreground">{step.title}</h3>
              <span className="hidden text-xs uppercase tracking-wide text-muted-foreground md:block">
                {Math.round(progress * index)}%
              </span>
            </div>
            {step.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            )}
            {!prefersReducedMotion && index < steps.length - 1 && (
              <div className="relative hidden h-px w-full overflow-hidden md:block">
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-primary/60 via-primary/40 to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                  style={{ transformOrigin: "left" }}
                />
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
};
