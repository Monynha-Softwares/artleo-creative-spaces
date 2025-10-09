import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Palette,
  FileText,
  CalendarRange,
  Mail,
  Settings,
  Users,
  Menu,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Artworks", to: "/admin/artworks", icon: Palette },
  { label: "Pages", to: "/admin/pages", icon: FileText },
  { label: "Exhibitions", to: "/admin/exhibitions", icon: CalendarRange },
  { label: "Messages", to: "/admin/messages", icon: Mail },
  { label: "Settings", to: "/admin/settings", icon: Settings },
  { label: "Users", to: "/admin/users", icon: Users },
] as const;

export const AdminLayout = () => {
  const [open, setOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  const renderNav = () => (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/admin"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )
            }
            onClick={() => setOpen(false)}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Toggle navigation">
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 border-border/60 bg-background/95">
                <div className="flex flex-col gap-6">
                  <div className="text-lg font-semibold">Art Leo · Admin</div>
                  {renderNav()}
                </div>
              </SheetContent>
            </Sheet>
            <div className="hidden text-lg font-semibold md:block">Art Leo · Admin</div>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </Button>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-6">
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="sticky top-24 flex max-h-[calc(100vh-7rem)] flex-col gap-6 rounded-2xl border border-border/60 bg-background/80 p-4 backdrop-blur">
            {renderNav()}
          </div>
        </aside>
        <main className="flex-1 pb-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
