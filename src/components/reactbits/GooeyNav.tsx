import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X, LogIn, LogOut, User } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { FlowingMenu } from "./FlowingMenu";
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
  const dialogTitleId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const focusableSelector = [
      "a[href]",
      "button:not([disabled])",
      "[tabindex]:not([tabindex='-1'])",
      "[role='button']",
    ].join(",");

    const dialog = dialogRef.current;
    if (!dialog) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const getFocusableElements = () =>
      Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector));

    const focusMenuItems = () =>
      Array.from(dialog.querySelectorAll<HTMLElement>("[data-menu-item]"));

    const focusTarget =
      dialog.querySelector<HTMLElement>("[data-autofocus]") ??
      getFocusableElements()[0] ??
      dialog;

    const raf = requestAnimationFrame(() => {
      focusTarget?.focus({ preventScroll: true });
    });

    const cycleFocus = (elements: HTMLElement[], direction: 1 | -1) => {
      if (!elements.length) return;
      const current = document.activeElement as HTMLElement | null;
      const index = current ? elements.indexOf(current) : -1;
      const nextIndex =
        index === -1
          ? direction === 1
            ? 0
            : elements.length - 1
          : (index + direction + elements.length) % elements.length;
      elements[nextIndex]?.focus({ preventScroll: true });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        const focusableElements = getFocusableElements();
        if (!focusableElements.length) {
          event.preventDefault();
          dialog.focus({ preventScroll: true });
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const activeElement = document.activeElement as HTMLElement | null;

        if (!event.shiftKey && activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus({ preventScroll: true });
        }

        if (event.shiftKey && activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus({ preventScroll: true });
        }
      }

      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        cycleFocus(focusMenuItems(), 1);
      }

      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        cycleFocus(focusMenuItems(), -1);
      }
    };

    dialog.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      dialog.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocusedRef.current) {
        previouslyFocusedRef.current.focus({ preventScroll: true });
        previouslyFocusedRef.current = null;
      }
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.2, ease: "linear" }}
                className="fixed inset-0 z-[60] flex items-start justify-center px-4 pb-8 pt-24 md:hidden"
                role="presentation"
                onClick={closeMenu}
              >
                <motion.div
                  ref={dialogRef}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={dialogTitleId}
                  tabIndex={-1}
                  initial={{ opacity: 0, y: -16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.98 }}
                  transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full max-w-md rounded-3xl border border-border/70 bg-background/95 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.55)] backdrop-blur-xl"
                  onClick={(event) => event.stopPropagation()}
                  data-testid="mobile-menu-dialog"
                >
                  <h2 id={dialogTitleId} className="sr-only">
                    Navigation menu
                  </h2>
                  <FlowingMenu
                    items={links}
                    activeHref={location.pathname}
                    onItemClick={closeMenu}
                    className="shadow-none"
                    initialFocusIndex={0}
                  />
                  <div className="mt-6 flex flex-col gap-3">
                    {user ? (
                      <div className="flex flex-col gap-3" data-testid="mobile-auth-actions">
                        {isAdmin && (
                          <Button
                            asChild
                            variant="secondary"
                            className="w-full justify-center gap-2"
                            data-menu-item
                          >
                            <Link to="/admin" onClick={closeMenu}>
                              <User className="h-4 w-4" />
                              Admin
                            </Link>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          className="w-full justify-center gap-2"
                          onClick={() => {
                            closeMenu();
                            void signOut();
                          }}
                          data-menu-item
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <Button
                        asChild
                        variant="secondary"
                        className="w-full justify-center gap-2"
                        data-menu-item
                      >
                        <Link to="/auth" onClick={closeMenu}>
                          <LogIn className="h-4 w-4" />
                          Login
                        </Link>
                      </Button>
                    )}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full"
                      onClick={closeMenu}
                      aria-label="Close menu"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

GooeyNav.displayName = "GooeyNav";
