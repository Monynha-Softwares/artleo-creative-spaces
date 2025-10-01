import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type SplitTextProps = {
  text: string;
  as?: keyof HTMLElementTagNameMap;
  className?: string;
  delay?: number;
  stagger?: number;
};

export const SplitText = ({
  text,
  as: Tag = "span",
  className,
  delay = 0.1,
  stagger = 0.04,
}: SplitTextProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const lines = text.split("\n");

  if (prefersReducedMotion) {
    return <Tag className={className}>{lines.join(" ")}</Tag>;
  }

  return (
    <Tag className={cn("inline-block", className)}>
      {lines.map((line, lineIndex) => (
        <span key={`line-${lineIndex}`} className="block overflow-hidden">
          {Array.from(line).map((character, charIndex) => (
            <motion.span
              key={`${lineIndex}-${charIndex}-${character}`}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{
                delay: delay + lineIndex * 0.15 + charIndex * stagger,
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="inline-block"
            >
              {character === " " ? "\u00A0" : character}
            </motion.span>
          ))}
        </span>
      ))}
    </Tag>
  );
};
