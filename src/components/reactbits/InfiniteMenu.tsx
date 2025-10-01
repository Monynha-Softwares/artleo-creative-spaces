import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import "./InfiniteMenu.css";

type InfiniteMenuItem = {
  label: string;
  id: string;
};

type InfiniteMenuProps = {
  items: InfiniteMenuItem[];
  speed?: number;
  activeId?: string;
  onSelect?: (item: InfiniteMenuItem, index: number) => void;
};

export const InfiniteMenu = ({ items, speed = 40, activeId, onSelect }: InfiniteMenuProps) => {
  const prefersReducedMotion = useReducedMotion();
  const loopItems = useMemo(() => [...items, ...items], [items]);

  const renderButton = (item: InfiniteMenuItem, index: number, key: string) => (
    <button
      key={key}
      type="button"
      className={`infinite-menu__item ${item.id === activeId ? "is-active" : ""}`.trim()}
      onClick={() => onSelect?.(item, index)}
    >
      {item.label}
    </button>
  );

  if (prefersReducedMotion) {
    return <div className="infinite-menu static">{items.map((item, index) => renderButton(item, index, item.id))}</div>;
  }

  const duration = loopItems.length * (120 / speed);

  return (
    <div className="infinite-menu">
      <motion.div
        className="infinite-menu__track"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        {loopItems.map((item, index) =>
          renderButton(item, index % items.length, `${item.id}-${index}`),
        )}
      </motion.div>
    </div>
  );
};

export default InfiniteMenu;
