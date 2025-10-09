import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X, LogIn, LogOut, User } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const links = [
  {
    href: "/",
    label: "Home",
    accent: "linear-gradient(135deg, rgba(168, 85, 247, 0.7), rgba(99, 102, 241, 0.7))",
  },
  {
    href: "/portfolio",
    label: "Portfolio",
    accent: "linear-gradient(135deg, rgba(14, 165, 233, 0.7), rgba(236, 72, 153, 0.7))",
  },
  {
    href: "/about",
    label: "About",
    accent: "linear-gradient(135deg, rgba(34, 197, 94, 0.7), rgba(147, 51, 234, 0.7))",
  },
  {
    href: "/contact",
    label: "Contact",
    accent: "linear-gradient(135deg, rgba(251, 191, 36, 0.7), rgba(59, 130, 246, 0.7))",
  },
];

export const GooeyNav = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const { user, isAdmin, signOut } = useAuth();
  const isMobile = useIsMobile();

  const menuContainerRef = useRef<HTMLDivElement | null>(null);
  const menuCloseButtonRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const menuId = "mobile-navigation";
  const dialogId = `${menuId}-panel`;
  const dialogTitleId = `${menuId}-title`;

  const getMenuItems = useCallback(() => {
    if (!menuContainerRef.current) {
      return [] as HTMLElement[];
    }

    return Array.from(
      menuContainerRef.current.querySelectorAll<HTMLElement>('[data-menu-item="true"]'),
    );
  }, []);

  const getFocusableElements = useCallback(() => {
    const menuItems = getMenuItems();
    if (menuCloseButtonRef.current) {
      return [...menuItems, menuCloseButtonRef.current];
    }
    return menuItems;
  }, [getMenuItems]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobile && open) {
      setOpen(false);
    }
  }, [isMobile, open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key === "Tab") {
        const focusableElements = getFocusableElements();
        if (!focusableElements.length) return;

        const activeElement = document.activeElement as HTMLElement | null;
        const currentIndex = focusableElements.indexOf(activeElement ?? focusableElements[0]);
        const direction = event.shiftKey ? -1 : 1;
        const nextIndex =
          currentIndex === -1
            ? event.shiftKey
              ? focusableElements.length - 1
              : 0
            : (currentIndex + direction + focusableElements.length) % focusableElements.length;

        event.preventDefault();
        const target = focusableElements[nextIndex];
        setTimeout(() => target?.focus({ preventScroll: true }), 0);
        return;
      }

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        const menuItems = getMenuItems();
        if (!menuItems.length) return;

        const direction = event.key === "ArrowDown" ? 1 : -1;
        const activeElement = document.activeElement as HTMLElement | null;
        const currentIndex = menuItems.findIndex((item) => item === activeElement);
        const nextIndex = currentIndex === -1 ? (direction === 1 ? 0 : menuItems.length - 1) : (currentIndex + direction + menuItems.length) % menuItems.length;

        event.preventDefault();
        menuItems[nextIndex]?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [getFocusableElements, getMenuItems, open]);

  useEffect(() => {
    if (!open) {
      const previouslyFocused = previouslyFocusedRef.current;
      previouslyFocused?.focus({ preventScroll: true });
      previouslyFocusedRef.current = null;
      return;
    }

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    const focusableElements = getFocusableElements();
    focusableElements[0]?.focus();

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollBarGap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollBarGap > 0) {
      document.body.style.paddingRight = `${scrollBarGap}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [getFocusableElements, open]);

  const isActive = (href: string) => location.pathname === href;

  const toggleMenu = () => setOpen((prev) => !prev);
  const closeMenu = () => setOpen(false);

  const authActions = useMemo(() => {
    if (user) {
      return (
        <>
          {isAdmin && (
            <li>
              <Link
                to="/admin"
                role="menuitem"
                data-menu-item="true"
                className="block w-full rounded-2xl px-4 py-3 text-left text-base font-medium text-foreground transition-colors hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                onClick={closeMenu}
              >
                Admin
              </Link>
            </li>
          )}
          <li>
            <button
              type="button"
              role="menuitem"
              data-menu-item="true"
              className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              onClick={() => {
                void signOut();
                closeMenu();
              }}
            >
              Logout
              <LogOut className="h-5 w-5" aria-hidden="true" />
            </button>
          </li>
        </>
      );
    }

    return (
      <li>
        <Link
          to="/auth"
          role="menuitem"
          data-menu-item="true"
          className="block w-full rounded-2xl px-4 py-3 text-left text-base font-medium text-foreground transition-colors hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          onClick={closeMenu}
        >
          <span className="flex items-center justify-between">
            Login
            <LogIn className="h-5 w-5" aria-hidden="true" />
          </span>
        </Link>
      </li>
    );
  }, [closeMenu, isAdmin, signOut, user]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-6">
      <div className="mx-auto w-full max-w-5xl">
        <div className="relative">
          <nav
            className={cn(
              "flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-4 py-2 backdrop-blur-xl motion-reduce:transition-none min-h-[3.5rem]",
              "shadow-[0_12px_45px_rgba(15,23,42,0.45)]",
            )}
            aria-label="Main"
          >
            <Link
              to="/"
              className="flex min-w-0 items-center gap-2 py-2"
            >
              <span className="whitespace-nowrap text-[clamp(1.1rem,4vw,1.5rem)] font-semibold text-foreground">
                Art Leo
              </span>
            </Link>
            <div className="ml-auto flex items-center gap-3">
              <div className="hidden items-center gap-3 md:flex">
                {links.map((link) => (
                  <motion.div key={link.href} className="relative">
                    <Link
                      to={link.href}
                      className={cn(
                        "relative inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors",
                        isActive(link.href)
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {link.label}
                    </Link>
                    {isActive(link.href) && (
                      <motion.span
                        layoutId="gooey-active"
                        className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-primary/30 via-secondary/20 to-primary/30 blur-xl"
                        transition={{ type: "spring", stiffness: 260, damping: 28 }}
                      />
                    )}
                  </motion.div>
                ))}

                {/* Auth Section */}
                {user ? (
                  <div className="ml-2 flex items-center gap-2 border-l border-border/50 pl-2">
                    {isAdmin && (
                      <Link to="/admin">
                        <Button variant="ghost" size="sm" className="gap-2">
                          <User className="h-4 w-4" />
                          Admin
                        </Button>
                      </Link>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => signOut()} className="gap-2">
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Link to="/auth" className="ml-2 border-l border-border/50 pl-2">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <LogIn className="h-4 w-4" />
                      Login
                    </Button>
                  </Link>
                )}
              </div>
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-card/70 p-2 text-foreground transition-colors hover:border-primary/80 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none md:hidden"
                onClick={toggleMenu}
                aria-controls={dialogId}
                aria-expanded={open}
                aria-haspopup="true"
                aria-label={open ? "Close navigation" : "Open navigation"}
                data-state={open ? "open" : "closed"}
              >
                {open ? <X /> : <Menu />}
              </button>
            </div>
          </nav>

          <AnimatePresence>
            {open && isMobile && (
              <>
                <motion.button
                  key="mobile-overlay"
                  type="button"
                  aria-hidden="true"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.24, ease: "linear" }}
                  className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
                  onClick={closeMenu}
                />
                <motion.div
                  key="mobile-menu"
                  id={dialogId}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={dialogTitleId}
                  ref={menuContainerRef}
                  data-testid="mobile-menu-panel"
                  initial={{ opacity: 0, y: -16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.96 }}
                  transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-x-0 top-full z-50 mt-3 px-4 md:hidden"
                >
                  <div className="mx-auto w-full max-w-md rounded-3xl border border-border/70 bg-surface-1/95 shadow-[0_24px_60px_rgba(15,23,42,0.45)] backdrop-blur-xl">
                    <div className="flex items-center justify-between gap-4 border-b border-border/60 px-5 py-4">
                      <p id={dialogTitleId} className="text-base font-semibold text-foreground">
                        Navigation
                      </p>
                      <button
                        ref={menuCloseButtonRef}
                        type="button"
                        data-close="true"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-foreground transition-colors hover:border-primary/70 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        onClick={closeMenu}
                        aria-label="Close menu"
                      >
                        <X aria-hidden="true" />
                      </button>
                    </div>
                    <nav
                      id={menuId}
                      role="menu"
                      aria-labelledby={dialogTitleId}
                      className="px-5 py-4"
                    >
                      <div
                        tabIndex={0}
                        className="sr-only"
                        data-focus-guard="start"
                        onFocus={() => {
                          const focusable = getFocusableElements();
                          const target = focusable[focusable.length - 1];
                          target?.focus({ preventScroll: true });
                        }}
                      />
                      <ul className="flex flex-col gap-2" data-testid="mobile-menu-items">
                        {links.map((link) => (
                          <li key={link.href}>
                            <Link
                              to={link.href}
                              role="menuitem"
                              data-menu-item="true"
                              className={cn(
                                "block w-full rounded-2xl px-4 py-3 text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors",
                                isActive(link.href)
                                  ? "bg-primary/20 text-foreground shadow-[0_0_1px_1px_rgba(129,140,248,0.25)]"
                                  : "text-muted-foreground hover:bg-foreground/10 hover:text-foreground",
                              )}
                              onClick={closeMenu}
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                        <li className="mt-1 border-t border-border/60 pt-3 text-sm uppercase tracking-widest text-muted-foreground">
                          Account
                        </li>
                        {authActions}
                      </ul>
                      <div
                        tabIndex={0}
                        className="sr-only"
                        data-focus-guard="end"
                        onFocus={() => {
                          const focusable = getFocusableElements();
                          const target = focusable[0];
                          target?.focus({ preventScroll: true });
                        }}
                      />
                    </nav>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

GooeyNav.displayName = "GooeyNav";
