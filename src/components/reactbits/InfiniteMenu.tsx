import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

interface InfiniteMenuProps {
  items: { label: string; href: string }[];
  speed?: number;
  onItemClick?: () => void;
}

export const InfiniteMenu = ({ items, speed = 16, onItemClick }: InfiniteMenuProps) => {
  const reduceMotion = useReducedMotion();
  const location = useLocation();
  const duplicated = [...items, ...items];

  const content = duplicated.map((item, index) => {
    const active = location.pathname === item.href;
    return (
      <Link
        key={`${item.href}-${index}`}
        to={item.href}
        onClick={onItemClick}
        className={cn(
          "inline-flex min-w-[140px] items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium transition-colors",
          active
            ? "border-transparent bg-primary text-primary-foreground shadow-lg"
            : "border-border/70 bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground",
        )}
      >
        {item.label}
      </Link>
    );
  });

  if (reduceMotion) {
    return (
      <div className="flex flex-wrap gap-3">
        {items.map((item) => {
          const active = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onItemClick}
              className={cn(
                "inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-transparent bg-primary text-primary-foreground shadow-lg"
                  : "border-border/70 bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-background/80 py-4">
      <motion.div
        className="flex gap-3"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, repeatType: "loop", duration: speed, ease: "linear" }}
      >
        {content}
      </motion.div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
};

InfiniteMenu.displayName = "InfiniteMenu";
