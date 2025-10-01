import { type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export type RollingGalleryItem = {
  imageUrl: string;
  title: string;
  subtitle?: string;
};

type RollingGalleryProps = {
  items: RollingGalleryItem[];
  speed?: number;
  className?: string;
};

export const RollingGallery = ({ items, speed = 22, className }: RollingGalleryProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className={cn("grid grid-cols-2 gap-4 md:grid-cols-3", className)}>
        {items.slice(0, 6).map((item) => (
          <figure
            key={item.title}
            className="overflow-hidden rounded-2xl border border-border/60 bg-card/70"
          >
            <img src={item.imageUrl} alt={item.title} className="h-40 w-full object-cover" loading="lazy" />
            <figcaption className="px-4 py-3">
              <p className="text-sm font-medium text-foreground">{item.title}</p>
              {item.subtitle ? (
                <p className="text-xs text-muted-foreground">{item.subtitle}</p>
              ) : null}
            </figcaption>
          </figure>
        ))}
      </div>
    );
  }

  const duplicatedItems = [...items, ...items];
  const animationDuration = `${Math.max(12, items.length * (60 / speed))}s`;

  const animationStyle: CSSProperties = {
    "--duration": animationDuration,
  };

  return (
    <div className={cn("relative overflow-hidden rounded-3xl border border-border/80 bg-card/30 p-2", className)}>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-transparent to-background opacity-70" />
      <div className="flex gap-4 [animation:rb-roll_var(--duration)_linear_infinite]" style={animationStyle}>
        {duplicatedItems.map((item, index) => (
          <figure
            key={`${item.title}-${index}`}
            className="relative h-48 w-72 overflow-hidden rounded-2xl border border-border/60 bg-card/80"
          >
            <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/85 via-background/20 to-transparent px-4 py-3">
              <p className="text-sm font-medium text-foreground">{item.title}</p>
              {item.subtitle ? (
                <p className="text-xs text-muted-foreground">{item.subtitle}</p>
              ) : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
};
