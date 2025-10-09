import { useId } from "react";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  className?: string;
  title?: string;
}

export const BrandGlyph = ({ gradientId, glowId }: { gradientId: string; glowId: string }) => (
  <g filter={`url(#${glowId}-glow)`}>
    <rect x="4" y="4" width="40" height="40" rx="14" fill={`url(#${gradientId}-grad)`} opacity="0.9" />
    <path
      d="M24 12.5l-11 23h6.1l3.6-7.6h9.1l3.7 7.6H41l-11.1-23h-5.9z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <path
      d="M24 18.2c-2.35 0-4.26 1.9-4.26 4.25 0 2.35 1.91 4.25 4.26 4.25 1.09 0 2.09-.41 2.85-1.09l2.69 5.62h-5.54l-3.73 7.83"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.8"
    />
    <circle cx="24" cy="22.4" r="3.2" fill="currentColor" fillOpacity="0.85" />
  </g>
);

export const BrandMark = ({ className, title = "Art Leo mark" }: BrandMarkProps) => {
  const gradientId = useId();
  const glowId = useId();

  return (
    <svg
      role="img"
      aria-labelledby={`${gradientId}-title`}
      viewBox="0 0 48 48"
      className={cn("h-10 w-10", className)}
    >
      <title id={`${gradientId}-title`}>{title}</title>
      <defs>
        <linearGradient id={`${gradientId}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--brand-accent, #a855f7)" />
          <stop offset="100%" stopColor="var(--brand-accent-alt, #6366f1)" />
        </linearGradient>
        <filter id={`${glowId}-glow`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <BrandGlyph gradientId={gradientId} glowId={glowId} />
    </svg>
  );
};

BrandMark.displayName = "BrandMark";
