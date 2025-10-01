import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { MobileInfiniteMenu, mobileNavigationItems } from "@/components/MobileInfiniteMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const Navigation = () => {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const navItems = useMemo(() => mobileNavigationItems, []);

  useEffect(() => {
    if (!isMobile) {
      setOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => setOpen((prev) => !prev);

  return (
    <header className="fixed inset-x-0 top-0 z-50 mx-auto flex max-w-5xl justify-center px-4 pt-6">
      <nav className="relative w-full rounded-full border border-border/70 bg-background/70 p-2 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-2 px-4 py-2" aria-label="Go to home">
            <span className="text-fluid-lg font-semibold text-foreground">Art Leo</span>
          </Link>

          <div className="hidden md:flex items-center gap-4" data-testid="desktop-nav">
            {navItems.map((item) => {
              const isActive = location.pathname === item.link;
              return (
                <div key={item.link} className="relative">
                  <Link
                    to={item.link}
                    className={cn(
                      "relative inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item.title}
                  </Link>
                  <AnimatePresence>
                    {isActive ? (
                      <motion.span
                        layoutId="desktop-nav-indicator"
                        className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-primary/30 via-secondary/20 to-primary/30 blur-xl"
                        transition={{ type: "spring", stiffness: 260, damping: 28 }}
                      />
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-card/70 text-foreground"
            onClick={toggleMenu}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label="Toggle navigation"
            data-testid="mobile-nav-toggle"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobile && open ? (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation"
              data-testid="mobile-nav-overlay"
              className="fixed inset-0 z-[60] bg-background/70 backdrop-blur"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.3 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              id="mobile-navigation"
              data-testid="mobile-nav-container"
              className="fixed inset-x-0 top-[92px] z-[70] flex justify-center px-4"
              initial={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
              transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.21, 1, 0.29, 1] }}
            >
              <MobileInfiniteMenu onItemSelected={() => setOpen(false)} />
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
};

Navigation.displayName = "Navigation";
