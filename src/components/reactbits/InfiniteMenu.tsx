import { useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";
import { useLocation } from "react-router-dom";

import { cn } from "@/lib/utils";

import "./InfiniteMenu.css";

export interface InfiniteMenuItem {
  image: string;
  link: string;
  title: string;
  description?: string;
}

interface InfiniteMenuProps {
  items: InfiniteMenuItem[];
  speed?: number;
  onItemClick?: (item: InfiniteMenuItem) => void;
}

export const InfiniteMenu = ({ items, speed = 18, onItemClick }: InfiniteMenuProps) => {
  const reduceMotion = useReducedMotion();
  const location = useLocation();

  if (!items.length) {
    return null;
  }

  if (reduceMotion) {
    return (
      <ul className="rb-infinite-menu__fallback" data-testid="reactbits-infinite-menu-fallback">
        {items.map((item) => {
          const isActive = location.pathname === item.link;
          return (
            <li key={item.link}>
              <button
                type="button"
                onClick={() => onItemClick?.(item)}
                className={cn(
                  "rb-infinite-menu__fallback-item",
                  isActive && "rb-infinite-menu__fallback-item--active",
                )}
                aria-label={`Navigate to ${item.title}`}
              >
                <span className="rb-infinite-menu__media" aria-hidden="true">
                  <img src={item.image} alt="" />
                </span>
                <span className="rb-infinite-menu__caption">
                  <span className="rb-infinite-menu__title">{item.title}</span>
                  {item.description ? (
                    <span className="rb-infinite-menu__description">{item.description}</span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    );
  }

  const styles = {
    "--rb-angle-step": `${360 / items.length}deg`,
    "--rb-rotation-duration": `${speed}s`,
  } as CSSProperties;

  return (
    <div className="rb-infinite-menu" style={styles} data-testid="reactbits-infinite-menu">
      <div className="rb-infinite-menu__ring">
        {items.map((item, index) => {
          const isActive = location.pathname === item.link;
          return (
            <button
              key={item.link}
              type="button"
              className={cn("rb-infinite-menu__item", isActive && "rb-infinite-menu__item--active")}
              style={{ "--rb-item-index": index } as CSSProperties}
              onClick={() => onItemClick?.(item)}
              aria-label={`Navigate to ${item.title}`}
            >
              <span className="rb-infinite-menu__media" aria-hidden="true">
                <img src={item.image} alt="" />
              </span>
              <span className="rb-infinite-menu__caption">
                <span className="rb-infinite-menu__title">{item.title}</span>
                {item.description ? (
                  <span className="rb-infinite-menu__description">{item.description}</span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
      <div className="rb-infinite-menu__halo" aria-hidden="true" />
    </div>
  );
};

InfiniteMenu.displayName = "InfiniteMenu";
