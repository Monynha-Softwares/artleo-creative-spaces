import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface RollingGalleryItem {
  id: string | number;
  title: string;
  imageUrl: string;
  category?: string;
}

interface RollingGalleryProps {
  items: RollingGalleryItem[];
  speed?: number;
  className?: string;
}

export const RollingGallery = ({ items, speed = 30, className }: RollingGalleryProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const galleryItems = useMemo(() => items.concat(items), [items]);

  return (
    <div className={cn("relative overflow-hidden rounded-3xl border border-border/70 bg-card/60 p-6", className)}>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-transparent to-background opacity-40" />
      <div
        className={cn(
          "flex gap-6",
          prefersReducedMotion ? "flex-wrap justify-center" : "animate-rolling-gallery",
        )}
        style={prefersReducedMotion ? undefined : ({ "--gallery-speed": `${speed}s` } as React.CSSProperties)}
      >
        {galleryItems.map((item, index) => (
          <figure
            key={`${item.id}-${index}`}
            className="relative h-40 w-64 flex-shrink-0 overflow-hidden rounded-2xl border border-border/70 bg-background/60"
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent p-4 text-xs uppercase tracking-[0.35em] text-muted-foreground">
              {item.category && <span className="mr-2 text-primary">{item.category}</span>}
              {item.title}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
};
