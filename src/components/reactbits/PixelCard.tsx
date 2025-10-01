import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type PixelCardProps = {
  image: string;
  title: string;
  subtitle?: string;
  footer?: ReactNode;
  className?: string;
};

export const PixelCard = ({ image, title, subtitle, footer, className }: PixelCardProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/60 bg-card",
        "transition-all duration-500 hover:border-primary/60 hover:shadow-lg",
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={image} alt={title} className="h-full w-full object-cover" loading="lazy" />
        {!prefersReducedMotion && (
          <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, rgba(99,102,241,0.35) 0%, transparent 60%), repeating-linear-gradient(90deg, rgba(17,17,17,0.15) 0px, rgba(17,17,17,0.15) 1px, transparent 1px, transparent 4px)",
                mixBlendMode: "screen",
              }}
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
      </div>

      <div className="space-y-3 p-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-primary/80">{subtitle}</p>
          <h3 className="text-fluid-xl font-semibold text-foreground">{title}</h3>
        </div>
        {footer && <div className="text-sm text-muted-foreground">{footer}</div>}
      </div>
    </div>
  );
};
