import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from "react";

interface MobileNavContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const MobileNavContext = createContext<MobileNavContextValue | undefined>(undefined);

export const MobileNavProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => {
    setIsOpen((previous) => !previous);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      open,
      close,
      toggle,
    }),
    [isOpen, open, close, toggle],
  );

  return <MobileNavContext.Provider value={value}>{children}</MobileNavContext.Provider>;
};

export const useMobileNav = () => {
  const context = useContext(MobileNavContext);

  if (!context) {
    throw new Error("useMobileNav must be used within a MobileNavProvider");
  }

  return context;
};
