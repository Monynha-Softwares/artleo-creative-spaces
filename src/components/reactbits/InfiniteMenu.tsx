import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

type InfiniteMenuProps = {
  items: { href: string; label: string }[];
  onNavigate?: () => void;
};

export const InfiniteMenu = ({ items, onNavigate }: InfiniteMenuProps) => {
  const location = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const menuItems = useMemo(
    () => (prefersReducedMotion ? items : [...items, ...items]),
    [items, prefersReducedMotion]
  );

  return (
    <div className="relative overflow-hidden">
      <div
        className={cn(
          "flex flex-col gap-2 py-2",
          prefersReducedMotion ? "" : "animate-scroll-vertical",
        )}
      >
        {menuItems.map((item, index) => {
          const active = location.pathname === item.href;
          return (
            <Link
              key={`${item.href}-${index}`}
              to={item.href}
              onClick={onNavigate}
              className={cn(
                "block rounded-xl px-4 py-3 text-sm font-medium transition-all",
                active
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-card/60 text-muted-foreground hover:bg-muted/80 hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
