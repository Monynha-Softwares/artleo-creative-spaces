import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface GlassIconProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
  className?: string;
}

export const GlassIcon = ({ icon: Icon, title, description, href, className }: GlassIconProps) => {
  const isExternal = href ? href.startsWith("http") : false;
  const content = (
    <div
      className={cn(
        "group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br",
        "from-primary/8 via-background/40 to-background/60 p-5 backdrop-blur-xl transition-all duration-300",
        "hover:border-primary/40 hover:shadow-[0_25px_60px_-35px_hsla(263,70%,65%,0.8)]",
        className,
      )}
    >
      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
        <div className="absolute inset-0 rounded-2xl border border-primary/40" />
        <Icon className="h-7 w-7" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{title}</p>
        <p className="text-fluid-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
        className="block"
      >
        {content}
      </a>
    );
  }

  return content;
};
