import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { InfiniteMenu, type InfiniteMenuItem } from "@/components/reactbits/InfiniteMenu";

export interface MobileNavItem extends InfiniteMenuItem {}

const DEFAULT_NAV_ITEMS: MobileNavItem[] = [
  {
    image: "/images/nav-home.svg",
    link: "/",
    title: "Home",
    description: "Return to the landing page",
  },
  {
    image: "/images/nav-portfolio.svg",
    link: "/portfolio",
    title: "Portfolio",
    description: "See selected client work",
  },
  {
    image: "/images/nav-about.svg",
    link: "/about",
    title: "About",
    description: "Learn more about Leonardo",
  },
  {
    image: "/images/nav-contact.svg",
    link: "/contact",
    title: "Contact",
    description: "Collaborate or request a quote",
  },
];

interface MobileInfiniteMenuProps {
  items?: MobileNavItem[];
  onItemSelected?: () => void;
}

export const MobileInfiniteMenu = ({ items, onItemSelected }: MobileInfiniteMenuProps) => {
  const navigate = useNavigate();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const menuItems = useMemo(() => items ?? DEFAULT_NAV_ITEMS, [items]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(query.matches);

    update();
    query.addEventListener("change", update);

    return () => {
      query.removeEventListener("change", update);
    };
  }, []);

  const handleSelect = useCallback(
    (item: InfiniteMenuItem) => {
      navigate(item.link);
      onItemSelected?.();
    },
    [navigate, onItemSelected],
  );

  if (prefersReducedMotion) {
    return (
      <nav aria-label="Mobile navigation" data-testid="mobile-infinite-menu-fallback">
        <ul className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-background/90 p-4 shadow-xl backdrop-blur">
          {menuItems.map((item) => (
            <li key={item.link}>
              <button
                type="button"
                onClick={() => handleSelect(item)}
                className="flex w-full items-center gap-4 rounded-xl border border-border/60 bg-card/80 px-4 py-3 text-left text-sm font-medium text-foreground transition hover:border-primary/70 hover:text-primary"
              >
                <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-primary/20">
                  <img src={item.image} alt="" className="h-full w-full object-cover" />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-base font-semibold leading-tight">{item.title}</span>
                  {item.description ? (
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  ) : null}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <div className="relative h-[24rem] w-full max-w-sm" data-testid="mobile-infinite-menu">
      <InfiniteMenu items={menuItems} onItemClick={handleSelect} />
    </div>
  );
};

MobileInfiniteMenu.displayName = "MobileInfiniteMenu";

export const mobileNavigationItems = DEFAULT_NAV_ITEMS;
