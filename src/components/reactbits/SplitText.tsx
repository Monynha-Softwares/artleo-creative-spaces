import { motion } from "framer-motion";
import { createElement, useMemo } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type SplitTextProps = {
  text: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  stagger?: number;
  delay?: number;
};

export const SplitText = ({
  text,
  as = "span",
  className,
  stagger = 0.05,
  delay = 0,
}: SplitTextProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const letters = useMemo(() => text.split(""), [text]);
  const MotionTag = (motion as Record<string, typeof motion.span>)[as] ?? motion.span;

  if (prefersReducedMotion) {
    return createElement(as, { className }, text);
  }

  return (
    <MotionTag
      aria-label={text}
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={`${letter}-${index}`}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: "0.25em" },
            visible: {
              opacity: 1,
              y: "0em",
              transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] },
            },
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </MotionTag>
  );
};
