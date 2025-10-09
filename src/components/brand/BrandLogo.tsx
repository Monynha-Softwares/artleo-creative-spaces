import { useId } from "react";
import { cn } from "@/lib/utils";
import { BrandGlyph } from "./BrandMark";

interface BrandLogoProps {
  className?: string;
  title?: string;
}

export const BrandLogo = ({ className, title = "Art Leo" }: BrandLogoProps) => {
  const gradientId = useId();
  const glowId = useId();
  const accentId = useId();
  const titleId = useId();

  return (
    <svg
      role="img"
      aria-labelledby={titleId}
      viewBox="0 0 220 48"
      className={cn("h-10 w-auto", className)}
    >
      <title id={titleId}>{title}</title>
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
        <linearGradient id={`${accentId}-underline`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--brand-accent, #a855f7)" />
          <stop offset="100%" stopColor="var(--brand-accent-alt, #6366f1)" />
        </linearGradient>
      </defs>
      <BrandGlyph gradientId={gradientId} glowId={glowId} />
      <g transform="translate(64 8)">
        <text
          x="0"
          y="23"
          fill="currentColor"
          fontFamily="var(--brand-font, 'Poppins', 'Inter', 'Segoe UI', sans-serif)"
          fontWeight="600"
          fontSize="20"
          letterSpacing="0.04em"
        >
          Art Leo
        </text>
        <text
          x="0"
          y="40"
          fill="currentColor"
          fontFamily="var(--brand-font-secondary, 'Poppins', 'Inter', 'Segoe UI', sans-serif)"
          fontWeight="400"
          fontSize="12"
          letterSpacing="0.32em"
          textLength="128"
        >
          CREATIVE SPACES
        </text>
        <rect x="0" y="30" width="120" height="2" rx="1" fill={`url(#${accentId}-underline)`} opacity="0.8" />
      </g>
    </svg>
  );
};

BrandLogo.displayName = "BrandLogo";
