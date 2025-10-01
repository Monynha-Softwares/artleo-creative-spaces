import { Fragment, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface SplitTextProps {
  text: string;
  as?: keyof JSX.IntrinsicElements;
  delay?: number;
  className?: string;
  lineClassName?: string;
  characterClassName?: string;
}

export const SplitText = ({
  text,
  as: Tag = "span",
  delay = 0,
  className,
  lineClassName,
  characterClassName,
}: SplitTextProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const lines = text.split("\n");

  const renderCharacter = (character: string, index: number): ReactNode => {
    if (prefersReducedMotion) {
      return (
        <span key={`${character}-${index}`} className={characterClassName}>
          {character === " " ? "\u00A0" : character}
        </span>
      );
    }

    return (
      <motion.span
        key={`${character}-${index}`}
        className={cn("inline-block origin-bottom", characterClassName)}
        initial={{ opacity: 0, y: 12, rotateX: 45 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{
          delay: delay + index * 0.04,
          duration: 0.5,
          ease: [0.25, 0.8, 0.25, 1],
        }}
      >
        {character === " " ? "\u00A0" : character}
      </motion.span>
    );
  };

  return (
    <Tag className={cn("block", className)}>
      {lines.map((line, lineIndex) => (
        <Fragment key={`line-${lineIndex}`}>
          <span className={cn("block whitespace-nowrap", lineClassName)}>
            {line.split("").map((character, characterIndex) =>
              renderCharacter(character, lineIndex * line.length + characterIndex),
            )}
          </span>
          {lineIndex < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </Tag>
  );
};
