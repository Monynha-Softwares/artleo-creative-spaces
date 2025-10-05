import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface SectionRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const SectionReveal = ({ children, delay = 0, className = "" }: SectionRevealProps) => {
  const prefersReducedMotion = useReducedMotion();
  const initial = prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 };
  const whileInView = { opacity: 1, y: 0 };
  const transition = prefersReducedMotion
    ? { duration: 0 }
    : {
        duration: 0.6,
        delay,
        ease: [0.4, 0, 0.2, 1],
      };

  return (
    <motion.div
      initial={initial}
      whileInView={whileInView}
      viewport={{ once: true, margin: "-100px" }}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
};
