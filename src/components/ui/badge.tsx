import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "relative inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-lg shadow-primary/40 hover:bg-primary/85",
        secondary: "bg-surface-2 text-foreground hover:bg-surface-2/80",
        destructive:
          "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/40 hover:bg-destructive/90",
        outline:
          "bg-surface-0/40 text-foreground shadow-none before:absolute before:inset-x-0 before:top-0 before:h-px before:rounded-t-full before:bg-white/20 before:content-['']",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
