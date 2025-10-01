import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { href: "/", label: "Home" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <filter id="gooey-nav">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            result="gooey"
          />
          <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
        </filter>
      </svg>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-fluid-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Art Leo
          </span>
        </Link>

        <div className="hidden md:flex items-center">
          <div
            className="relative flex items-center gap-1 rounded-full bg-white/5 px-1 py-1 text-sm shadow-[0_15px_35px_rgba(79,70,229,0.35)]"
            style={{ filter: "url(#gooey-nav)" }}
          >
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="relative isolate overflow-hidden rounded-full px-5 py-2 font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                {isActive(link.href) && (
                  <motion.span
                    layoutId="gooey-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-primary/70 via-secondary/60 to-primary/70 shadow-[0_10px_30px_rgba(99,102,241,0.35)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className={isActive(link.href) ? "text-primary-foreground" : undefined}>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X /> : <Menu />}
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden border-t border-border/30 bg-card/95 backdrop-blur-xl"
          >
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-background" aria-hidden="true" />
              <div className="relative flex h-64 flex-col items-stretch justify-center gap-3 px-6 py-8">
                <div className="relative flex flex-col items-stretch gap-3 [animation:rb-infinite-menu_16s_linear_infinite]">
                  {[...links, ...links].map((link, index) => (
                    <Link
                      key={`${link.href}-${index}`}
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between rounded-2xl border border-border/60 bg-card/80 px-5 py-4 text-lg font-semibold ${
                        isActive(link.href) ? "text-primary" : "text-foreground"
                      }`}
                    >
                      <span>{link.label}</span>
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary/70">Explore</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
