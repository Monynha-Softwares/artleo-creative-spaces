import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type GlassIconProps = {
  icon: ReactNode;
  title: string;
  description: string;
  href?: string;
  className?: string;
};

export const GlassIcon = ({ icon, title, description, href, className }: GlassIconProps) => {
  const content = (
    <div
      className={cn(
        "group relative flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left",
        "shadow-[0_0_1px_rgba(255,255,255,0.4)] backdrop-blur-xl transition-all duration-300",
        "hover:border-primary/40 hover:bg-primary/10",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-primary shadow-inner">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/5" />
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="no-underline" target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
        {content}
      </a>
    );
  }

  return content;
};
