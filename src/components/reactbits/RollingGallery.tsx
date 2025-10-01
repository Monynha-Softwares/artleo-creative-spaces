import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

type RollingGalleryItem = {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
};

type RollingGalleryProps = {
  items: RollingGalleryItem[];
  className?: string;
  speed?: number;
};

export const RollingGallery = ({ items, className, speed = 30 }: RollingGalleryProps) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !trackRef.current) return;

    const track = trackRef.current;
    const animation = track.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-50%)" },
      ],
      {
        duration: speed * 1000,
        iterations: Infinity,
        easing: "linear",
      }
    );

    return () => animation.cancel();
  }, [prefersReducedMotion, speed]);

  const galleryItems = prefersReducedMotion ? items : [...items, ...items];

  return (
    <div className={cn("relative overflow-hidden rounded-3xl border border-border/60 bg-card/80", className)}>
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background via-background/40 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none" />

      <div
        ref={trackRef}
        className={cn(
          "flex w-max gap-8 py-8",
          prefersReducedMotion ? "mx-auto flex-wrap justify-center" : "",
        )}
        style={prefersReducedMotion ? undefined : { willChange: "transform" }}
      >
        {galleryItems.map((item, index) => (
          <figure
            key={`${item.id}-${index}`}
            className="relative h-56 w-64 overflow-hidden rounded-2xl border border-border/60 bg-muted/20"
          >
            <img
              src={item.image}
              alt={item.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/80 to-transparent p-4 text-sm">
              <p className="font-medium text-foreground">{item.title}</p>
              {item.subtitle && <p className="text-xs text-muted-foreground">{item.subtitle}</p>}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
};
