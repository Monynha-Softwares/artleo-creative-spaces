import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfiniteMenu } from "./InfiniteMenu";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const GooeyNav = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-transparent" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="relative z-10 flex items-center space-x-2">
            <span className="text-fluid-xl font-semibold tracking-tight text-foreground">
              Art Leo
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <div className="gooey-nav relative flex items-center gap-3 rounded-full border border-border/60 bg-card/80 px-4 py-2 backdrop-blur">
              <svg className="absolute h-0 w-0">
                <filter id="gooey-nav">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
                  <feColorMatrix
                    in="blur"
                    mode="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                    result="goo"
                  />
                  <feBlend in="SourceGraphic" in2="goo" />
                </filter>
              </svg>
              <div className={cn("absolute inset-0", !prefersReducedMotion && "mix-blend-screen")}></div>
              <div className="relative flex items-center gap-2" style={{ filter: "url(#gooey-nav)" }}>
                {links.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={cn(
                        "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                        isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="gooey-pill"
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary shadow-[0_10px_35px_-25px_hsla(263,70%,65%,0.9)]"
                          transition={
                            prefersReducedMotion
                              ? { duration: 0 }
                              : { type: "spring", stiffness: 420, damping: 28 }
                          }
                        />
                      )}
                      <span className="relative z-10">{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="relative z-10 md:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            {isOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden"
          >
            <div className="border-t border-border/60 bg-background/95 px-4 py-6 backdrop-blur">
              <InfiniteMenu
                items={links.map((link) => ({ label: link.label, value: link.href }))}
                activeValue={pathname}
                onSelect={(value) => {
                  navigate(value);
                  setIsOpen(false);
                }}
                orientation="vertical"
              />
              <div className="mt-6 space-y-3">
                {links.map((link) => (
                  <Link
                    key={`mobile-${link.href}`}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block rounded-2xl border border-border/60 bg-card/80 px-5 py-3 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
