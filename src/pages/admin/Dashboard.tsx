import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { LayoutDashboard, Palette, FileText, CalendarRange, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchTableCount } from "@/integrations/supabase/admin";

const DASHBOARD_TABLES = [
  { name: "artworks", label: "Artworks", icon: Palette, to: "/admin/artworks" },
  { name: "pages", label: "Pages", icon: FileText, to: "/admin/pages" },
  { name: "exhibitions", label: "Exhibitions", icon: CalendarRange, to: "/admin/exhibitions" },
  { name: "contact_messages", label: "Messages", icon: Mail, to: "/admin/messages" },
] as const;

export const Dashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "dashboard", "counts"],
    queryFn: async () => {
      const results = await Promise.all(
        DASHBOARD_TABLES.map(async (table) => ({
          name: table.name,
          count: await fetchTableCount(table.name),
        })),
      );
      return results.reduce<Record<string, number>>((acc, item) => {
        acc[item.name] = item.count;
        return acc;
      }, {});
    },
  });

  const summaryCards = useMemo(() => {
    return DASHBOARD_TABLES.map((table) => {
      const Icon = table.icon;
      return (
        <Card key={table.name} className="border-border/60 bg-background/80 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">{table.label}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="text-3xl font-bold tracking-tight">
              {isLoading ? <Skeleton className="h-8 w-12" /> : data?.[table.name] ?? 0}
            </div>
            <Button asChild variant="outline" size="sm" className="justify-center">
              <Link to={table.to}>Manage {table.label.toLowerCase()}</Link>
            </Button>
          </CardContent>
        </Card>
      );
    });
  }, [data, isLoading]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-primary/80">Welcome back</p>
        <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight">
          <LayoutDashboard className="h-6 w-6" aria-hidden="true" /> Admin dashboard
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Overview of your content. Manage artworks, pages, exhibitions, contact messages, and global settings in one place.
        </p>
      </div>
      <section>
        <h2 className="mb-4 text-xl font-semibold">Content overview</h2>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">{summaryCards}</div>
      </section>
      <section>
        <Card className="border-border/60 bg-background/80 backdrop-blur">
          <CardHeader>
            <CardTitle>Quick create</CardTitle>
            <CardDescription>Jump directly into creating new content.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/admin/artworks/new">New artwork</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/admin/pages/new">New page</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin/exhibitions/new">New exhibition</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;
