import { useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface FlowingMenuItem {
  href: string;
  label: string;
  accent?: string;
}

interface FlowingMenuProps {
  items: FlowingMenuItem[];
  activeHref?: string;
  onItemClick?: () => void;
  className?: string;
  initialFocusIndex?: number;
}

const animationDefaults: gsap.TweenVars = { duration: 0.6, ease: "expo" };

const findClosestEdge = (
  mouseX: number,
  mouseY: number,
  width: number,
  height: number,
): "top" | "bottom" => {
  const topEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY, 2);
  const bottomEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY - height, 2);
  return topEdgeDist < bottomEdgeDist ? "top" : "bottom";
};

interface MenuItemProps extends FlowingMenuItem {
  isActive: boolean;
  reduceMotion: boolean;
  onItemClick?: () => void;
  autoFocus?: boolean;
}

const defaultAccent = "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)";

const MenuItem: React.FC<MenuItemProps> = ({ href, label, accent, isActive, reduceMotion, onItemClick, autoFocus }) => {
  const itemRef = React.useRef<HTMLDivElement>(null);
  const marqueeRef = React.useRef<HTMLDivElement>(null);
  const marqueeInnerRef = React.useRef<HTMLDivElement>(null);

  const handleEnter = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduceMotion) return;
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

    const tl = gsap.timeline({ defaults: animationDefaults });
    tl.set(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" })
      .set(marqueeInnerRef.current, { y: edge === "top" ? "101%" : "-101%" })
      .to([marqueeRef.current, marqueeInnerRef.current], { y: "0%" });
  };

  const handleLeave = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduceMotion) return;
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

    const tl = gsap.timeline({ defaults: animationDefaults });
    tl.to(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" })
      .to(marqueeInnerRef.current, { y: edge === "top" ? "101%" : "-101%" });
  };

  const accentStyle = React.useMemo(() => {
    if (!accent) {
      return { background: defaultAccent };
    }

    if (accent.startsWith("url(")) {
      return { backgroundImage: accent };
    }

    if (accent.startsWith("linear") || accent.startsWith("radial") || accent.startsWith("conic")) {
      return { background: accent };
    }

    return { background: accent };
  }, [accent]);

  const repeatedMarqueeContent = React.useMemo(
    () =>
      Array.from({ length: 4 }).map((_, idx) => (
        <React.Fragment key={`${label}-${idx}`}>
          <span className="text-[color:var(--flowing-menu-text)] uppercase font-medium text-[4vh] leading-[1.2] px-[1vw]">{label}</span>
          <div
            className="min-w-[120px] h-[6vh] my-[1.5vh] mx-[1vw] rounded-[999px] bg-cover bg-center"
            style={accentStyle}
          />
        </React.Fragment>
      )),
    [accentStyle, label],
  );

  return (
    <div
      ref={itemRef}
      className={cn(
        "group relative flex-1 overflow-hidden bg-surface-0 text-center shadow-inset transition-colors",
        isActive
          ? "bg-surface-2 shadow-[0_-8px_24px_rgba(99,102,241,0.35)] before:pointer-events-none before:absolute before:inset-x-6 before:top-0 before:h-1 before:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.45),transparent)] before:content-['']"
          : undefined,
      )}
    >
      <Link
        to={href}
        className={cn(
          "flex h-full min-h-[64px] w-full items-center justify-center px-6 py-4 text-lg font-semibold uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          isActive ? "text-foreground" : "text-foreground",
          !isActive && "opacity-90 hover:opacity-100",
        )}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onClick={onItemClick}
        aria-current={isActive ? "page" : undefined}
        data-autofocus={autoFocus ? true : undefined}
        data-menu-item
      >
        {label}
      </Link>
      <div
        ref={marqueeRef}
        className="pointer-events-none absolute inset-0 translate-y-[101%] bg-white text-foreground transition-transform duration-500 ease-out motion-reduce:hidden"
      >
        <div ref={marqueeInnerRef} className="flex h-full w-[200%]">
          <div className="flex h-full w-[200%] items-center animate-marquee">
            {repeatedMarqueeContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export const FlowingMenu: React.FC<FlowingMenuProps> = ({
  items,
  activeHref,
  onItemClick,
  className,
  initialFocusIndex = 0,
}) => {
  const reduceMotion = useReducedMotion();

  return (
    <div className={cn("w-full overflow-hidden", className)}>
      <nav
        className="flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-surface-1/90 backdrop-blur-xl"
        aria-label="Mobile"
        data-test-mobile-menu
      >
        {items.map((item, index) => (
          <MenuItem
            key={item.href}
            {...item}
            isActive={activeHref === item.href}
            reduceMotion={reduceMotion}
            onItemClick={onItemClick}
            autoFocus={index === initialFocusIndex}
          />
        ))}
      </nav>
    </div>
  );
};

FlowingMenu.displayName = "FlowingMenu";
