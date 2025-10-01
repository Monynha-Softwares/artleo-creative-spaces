import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { GooeyNav } from "@/components/reactbits/GooeyNav";
import { InfiniteMenu } from "@/components/reactbits/InfiniteMenu";

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const links = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/portfolio", label: "Portfolio" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
    [],
  );

  const activeIndex = Math.max(
    links.findIndex((link) => link.href === location.pathname),
    0,
  );

  const navItems = links.map((link) => ({ label: link.label, id: link.href }));

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <Link to="/" className="flex items-center space-x-2 group w-fit">
            <span className="text-fluid-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Art Leo
            </span>
          </Link>

          <div className="hidden md:block">
            <GooeyNav
              items={navItems}
              initialActiveIndex={activeIndex}
              onSelect={(item) => {
                if (item.id !== location.pathname) {
                  navigate(item.id);
                }
              }}
            />
          </div>
        </div>

        <div className="md:hidden mt-4">
          <InfiniteMenu
            items={navItems}
            activeId={links[activeIndex]?.href}
            onSelect={(item) => {
              if (item.id !== location.pathname) {
                navigate(item.id);
              }
            }}
          />
        </div>
      </div>
    </nav>
  );
};
