import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface InfiniteMenuItem {
  label: string;
  value: string;
}

interface InfiniteMenuProps {
  items: InfiniteMenuItem[];
  activeValue?: string;
  onSelect?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export const InfiniteMenu = ({
  items,
  activeValue,
  onSelect,
  orientation = "horizontal",
  className,
}: InfiniteMenuProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const duplicatedItems = prefersReducedMotion ? items : [...items, ...items];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full border border-border/60 bg-card/80",
        orientation === "horizontal" ? "px-3 py-2" : "px-2 py-4",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-transparent to-background opacity-40" />
      <div
        className={cn(
          "flex items-center gap-3",
          orientation === "horizontal" ? "flex-row" : "flex-col",
          prefersReducedMotion
            ? "justify-center"
            : orientation === "horizontal"
              ? "animate-infinite-horizontal"
              : "animate-infinite-vertical",
        )}
      >
        {duplicatedItems.map((item, index) => {
          const isActive = activeValue === item.value;
          return (
            <button
              key={`${item.value}-${index}`}
              type="button"
              onClick={() => onSelect?.(item.value)}
              className={cn(
                "relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all flex-shrink-0",
                isActive
                  ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-[0_10px_25px_-20px_hsla(263,70%,65%,0.9)]"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
