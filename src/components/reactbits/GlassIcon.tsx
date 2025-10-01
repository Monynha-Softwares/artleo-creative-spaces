import { cn } from "@/lib/utils";

type GlassIconProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  className?: string;
};

export const GlassIcon = ({ icon, label, value, href, className }: GlassIconProps) => {
  const content = (
    <div
      className={cn(
        "flex items-center gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0",
        "px-5 py-4 shadow-[0_12px_40px_rgba(15,23,42,0.2)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1",
        "hover:shadow-[0_20px_45px_rgba(99,102,241,0.25)]",
        className,
      )}
    >
      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-primary">
        <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/40 to-secondary/40 opacity-40" aria-hidden="true" />
        <span className="relative text-2xl">{icon}</span>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{label}</p>
        <p className="text-fluid-base font-medium text-foreground">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="block">
        {content}
      </a>
    );
  }

  return content;
};
