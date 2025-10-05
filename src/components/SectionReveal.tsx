import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface SectionRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const SectionReveal = ({ children, delay = 0, className = "" }: SectionRevealProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 40 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={shouldReduceMotion ? undefined : { once: true, margin: "-100px" }}
      transition={
        shouldReduceMotion
          ? undefined
          : {
              duration: 0.6,
              delay,
              ease: [0.4, 0, 0.2, 1],
            }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
};
