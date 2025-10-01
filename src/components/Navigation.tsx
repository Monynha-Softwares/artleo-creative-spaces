import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { InfiniteMenu } from "@/components/reactbits/InfiniteMenu";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();

  const links = [
    { href: "/", label: "Home" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/60">
      {!prefersReducedMotion && (
        <svg className="pointer-events-none absolute h-0 w-0" aria-hidden>
          <filter id="gooey-nav">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
            />
            <feBlend in="SourceGraphic" />
          </filter>
        </svg>
      )}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-fluid-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Art Leo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center">
            <div
              className="relative flex items-center gap-2 rounded-full bg-background/30 px-3 py-1 shadow-[0_0_0_1px_rgba(99,102,241,0.15)] backdrop-blur-lg"
              style={prefersReducedMotion ? undefined : { filter: "url(#gooey-nav)" }}
            >
              {links.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="relative overflow-hidden rounded-full px-4 py-2 text-fluid-sm font-medium text-foreground/80 transition-all"
                  >
                    {!prefersReducedMotion && active && (
                      <motion.span
                        layoutId="gooey-bubble"
                        className="absolute inset-0 -z-10 rounded-full bg-primary/30 shadow-[0_0_0_1px_rgba(99,102,241,0.35)]"
                        transition={{ type: "spring", stiffness: 260, damping: 24 }}
                      />
                    )}
                    <span className={active ? "text-primary-foreground" : "hover:text-foreground transition-colors"}>
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card/95 border-t border-border backdrop-blur-lg"
          >
            <div className="container mx-auto px-4 py-4">
              <InfiniteMenu items={links} onNavigate={() => setIsOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
