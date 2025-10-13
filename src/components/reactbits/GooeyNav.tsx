import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X, LogIn, LogOut, User } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { FlowingMenu } from "./FlowingMenu";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { BrandMark } from "@/components/brand/BrandMark";

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
  const menuLabelId = "mobile-navigation-title";
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuSectionRef = useRef<HTMLElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback((container: HTMLElement | null) => {
    if (!container) {
      return [] as HTMLElement[];
    }

    const focusableSelectors = [
      "a[href]",
      "button:not([disabled])",
      "[role='menuitem']",
      "[tabindex]:not([tabindex='-1'])",
    ];

    const nodes = Array.from(
      container.querySelectorAll<HTMLElement>(focusableSelectors.join(",")),
    );

    return nodes.filter((node) => !node.hasAttribute("data-focus-guard"));
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key === "Tab") {
        const focusable = getFocusableElements(menuSectionRef.current);
        if (focusable.length === 0) {
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        const container = menuSectionRef.current;
        const items = container
          ? Array.from(container.querySelectorAll<HTMLElement>("[data-menu-item]"))
          : [];

        if (!items.length) {
          return;
        }

        const current = document.activeElement as HTMLElement | null;
        const index = items.findIndex((item) => item === current);
        if (index === -1) {
          return;
        }

        event.preventDefault();

        if (event.key === "ArrowDown") {
          const next = items[(index + 1) % items.length];
          next.focus();
        } else {
          const prev = items[(index - 1 + items.length) % items.length];
          prev.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [getFocusableElements, open]);

  useEffect(() => {
    if (!open) {
      if (previouslyFocusedRef.current) {
        previouslyFocusedRef.current.focus({ preventScroll: true });
        previouslyFocusedRef.current = null;
      }
      return;
    }

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    const focusable = getFocusableElements(menuSectionRef.current);
    focusable[0]?.focus({ preventScroll: true });
  }, [getFocusableElements, open]);

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

  const isActive = (href: string) => location.pathname === href;

  const toggleMenu = () => setOpen((prev) => !prev);
  const closeMenu = () => setOpen(false);

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
              aria-label="Art Leo home"
            >
              <BrandMark className="h-10 w-10 text-foreground md:hidden" />
              <BrandLogo className="hidden h-8 text-foreground md:block" />
              <span className="sr-only">Art Leo</span>
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
                aria-haspopup="dialog"
                aria-label={open ? "Close navigation" : "Open navigation"}
                ref={triggerRef}
              >
                {open ? <X /> : <Menu />}
              </button>
            </div>
          </nav>

          <AnimatePresence>
            {open && (
              <motion.section
                key="mobile-menu"
                id={menuId}
                ref={menuSectionRef}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-x-0 top-full z-50 mt-3 rounded-3xl md:hidden"
                role="dialog"
                aria-modal="true"
                aria-labelledby={menuLabelId}
              >
                <div className="sr-only" id={menuLabelId}>
                  Art Leo navigation
                </div>
                <FlowingMenu
                  items={[
                    ...links,
                    ...(user
                      ? isAdmin
                        ? [{ href: "/admin", label: "Admin", accent: "linear-gradient(135deg, rgba(99, 102, 241, 0.7), rgba(168, 85, 247, 0.7))" }]
                        : []
                      : [{ href: "/auth", label: "Login", accent: "linear-gradient(135deg, rgba(99, 102, 241, 0.7), rgba(168, 85, 247, 0.7))" }]),
                  ]}
                  activeHref={location.pathname}
                  onItemClick={closeMenu}
                  className="shadow-[0_20px_60px_rgba(15,23,42,0.45)]"
                  menuLabel="Mobile navigation"
                  itemRole="menuitem"
                  authAction={user ? { label: "Logout", onClick: signOut } : undefined}
                />
                <div className="flex justify-end bg-surface-1/95 px-6 pb-4 pt-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-2 rounded-full px-4 py-2 text-sm font-medium text-foreground hover:text-primary"
                    onClick={closeMenu}
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                    Close menu
                  </Button>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-overlay"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.24, ease: "linear" }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={closeMenu}
            role="presentation"
          />
        )}
      </AnimatePresence>
    </header>
  );
};

GooeyNav.displayName = "GooeyNav";
