import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
}

export const SpotlightCard = ({
  children,
  className,
  spotlightColor = "rgba(123, 97, 255, 0.65)",
}: SpotlightCardProps) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const maskImage = useMotionTemplate`
    radial-gradient(240px at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.65), transparent 65%)
  `;

  const spotlight = useMotionTemplate`
    radial-gradient(220px at ${mouseX}px ${mouseY}px, ${spotlightColor}, transparent 70%)
  `;

  return (
    <motion.div
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        mouseX.set(event.clientX - bounds.left);
        mouseY.set(event.clientY - bounds.top);
      }}
      onPointerLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-surface-1 p-8 shadow-sm backdrop-blur-xl transition-all duration-300",
        "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:rounded-t-2xl",
        "before:bg-gradient-to-b before:from-white/20 before:via-white/10 before:to-transparent before:opacity-40 before:transition-opacity before:duration-300 before:content-[''] before:mix-blend-screen",
        "group-hover:before:opacity-80",
        "hover:shadow-lg",
        className,
      )}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ backgroundImage: spotlight }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent"
        />
      </motion.div>
      <div className="relative z-10 flex h-full flex-col gap-4 text-left text-foreground">
        {children}
      </div>
    </motion.div>
  );
};

SpotlightCard.displayName = "SpotlightCard";
