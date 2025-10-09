import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X, LogIn, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
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
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-x-0 top-full z-50 mt-3 md:hidden"
              >
                <FlowingMenu
                  items={links}
                  activeHref={location.pathname}
                  onItemClick={closeMenu}
                  className="shadow-[0_20px_60px_rgba(15,23,42,0.45)]"
                />
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
          />
        )}
      </AnimatePresence>
    </header>
  );
};

GooeyNav.displayName = "GooeyNav";
