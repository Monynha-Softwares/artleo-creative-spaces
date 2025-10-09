import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X, LogIn, LogOut, User } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

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

  const menuId = "mobile-navigation";
  const menuTitleId = useId();
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  const getFocusableElements = () => {
    if (!menuRef.current) return [] as HTMLElement[];
    const selectors = [
      "a[href]",
      "button:not([disabled])",
      "[tabindex]:not([tabindex='-1'])",
    ].join(",");
    return Array.from(
      menuRef.current.querySelectorAll<HTMLElement>(selectors),
    ).filter((element) => !element.hasAttribute("data-focus-guard"));
  };

  const focusFirstElement = () => {
    const focusable = getFocusableElements();
    if (focusable.length) {
      focusable[0].focus();
    }
  };

  const moveFocus = (direction: 1 | -1) => {
    const focusable = getFocusableElements().filter((element) =>
      element.dataset.menuItem === "true",
    );
    if (!focusable.length) return;
    const index = focusable.indexOf(document.activeElement as HTMLElement);
    const nextIndex = index === -1 ? 0 : (index + direction + focusable.length) % focusable.length;
    focusable[nextIndex].focus();
  };

  useEffect(() => {
    if (!open) {
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
      return;
    }

    previousFocusRef.current = document.activeElement as HTMLElement;
    const focusTimer = window.setTimeout(() => {
      focusFirstElement();
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      if (event.key === "Tab") {
        const focusable = getFocusableElements();
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const current = document.activeElement as HTMLElement | null;

        if (!event.shiftKey && current === last) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && current === first) {
          event.preventDefault();
          last.focus();
        }
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveFocus(1);
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        moveFocus(-1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const isActive = (href: string) => location.pathname === href;

  const toggleMenu = () => setOpen((prev) => !prev);
  const closeMenu = useCallback(() => setOpen(false), []);

  const authActions = useMemo(() => {
    if (user) {
      return (
        <div className="flex flex-col gap-2 border-t border-border/60 pt-3" data-testid="mobile-auth-actions">
          {isAdmin && (
            <Link
              to="/admin"
              onClick={closeMenu}
              className="flex items-center justify-between rounded-xl border border-border/50 bg-card/60 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              data-menu-item="true"
              role="menuitem"
            >
              <span>Admin</span>
              <User className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
          <button
            type="button"
            onClick={() => {
              closeMenu();
              void signOut();
            }}
            className="flex items-center justify-between rounded-xl border border-border/50 bg-card/60 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            data-menu-item="true"
            role="menuitem"
          >
            <span>Logout</span>
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      );
    }

    return (
      <Link
        to="/auth"
        onClick={closeMenu}
        className="flex items-center justify-between rounded-xl border border-border/50 bg-card/60 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        data-menu-item="true"
        role="menuitem"
      >
        <span>Login</span>
        <LogIn className="h-4 w-4" aria-hidden="true" />
      </Link>
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
                aria-controls={menuId}
                aria-expanded={open}
                aria-haspopup="true"
                aria-label={open ? "Close navigation" : "Open navigation"}
                ref={triggerRef}
              >
                {open ? <X /> : <Menu />}
              </button>
            </div>
          </nav>

          <AnimatePresence>
            {open && (
              <motion.div
                key="mobile-menu"
                id={menuId}
                role="dialog"
                aria-modal="true"
                aria-labelledby={menuTitleId}
                initial={{ opacity: 0, y: -16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.98 }}
                transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-x-0 top-full z-50 mt-3 origin-top md:hidden"
                ref={menuRef}
                data-testid="mobile-nav-panel"
              >
                <div className="rounded-3xl border border-border/70 bg-background/95 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.65)] backdrop-blur-xl">
                  <div className="sr-only" id={menuTitleId}>
                    Main navigation
                  </div>
                  <nav aria-label="Mobile" role="menu" className="flex flex-col gap-2">
                    {links.map((link) => {
                      const active = isActive(link.href);
                      return (
                        <Link
                          key={link.href}
                          to={link.href}
                          onClick={closeMenu}
                          className={cn(
                            "flex items-center justify-between rounded-xl border px-4 py-3 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                            active
                              ? "border-primary/70 bg-primary/20 text-primary"
                              : "border-border/60 bg-card/60 text-muted-foreground hover:border-primary/60 hover:text-primary",
                          )}
                          data-menu-item="true"
                          role="menuitem"
                        >
                          <span>{link.label}</span>
                          <span
                            aria-hidden="true"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/70 via-secondary/60 to-primary/70 text-sm font-semibold text-foreground/80"
                          >
                            {link.label.charAt(0)}
                          </span>
                        </Link>
                      );
                    })}
                  </nav>
                  <div className="mt-4" role="menu" aria-label="Account">
                    {authActions}
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground/80">
                    Press <span className="font-medium">Esc</span> to close or use the arrow keys to move between links.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.button
            key="mobile-overlay"
            type="button"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.24, ease: "linear" }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={closeMenu}
            data-focus-guard="true"
          />
        )}
      </AnimatePresence>
    </header>
  );
};

GooeyNav.displayName = "GooeyNav";
