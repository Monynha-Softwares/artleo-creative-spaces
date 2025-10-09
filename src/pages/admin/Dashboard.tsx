import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Calendar, Mail, Settings, ArrowRight } from "lucide-react";

const Dashboard = () => {
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const adminSections = [
    {
      title: "Artworks",
      description: "Manage your portfolio pieces",
      icon: Palette,
      href: "/admin/artworks",
      color: "text-purple-500",
    },
    {
      title: "Exhibitions",
      description: "Update your timeline and events",
      icon: Calendar,
      href: "/admin/exhibitions",
      color: "text-blue-500",
    },
    {
      title: "Contact Messages",
      description: "View and respond to inquiries",
      icon: Mail,
      href: "/admin/messages",
      color: "text-green-500",
    },
    {
      title: "Settings",
      description: "Configure site settings",
      icon: Settings,
      href: "/admin/settings",
      color: "text-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-0 to-surface-1 px-4 pt-24 pb-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your portfolio content and settings
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
          {adminSections.map((section) => (
            <Card key={section.href} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg bg-surface-2 p-3 ${section.color}`}>
                    <section.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link to={section.href}>
                  <Button variant="outline" className="w-full group-hover:border-primary">
                    Manage
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription>
              Need to edit content directly? Access the backend dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              For advanced database operations and direct table editing, open the Supabase dashboard in a new tab.
            </p>
            <Button asChild variant="outline">
              <a href="https://app.supabase.com/" target="_blank" rel="noopener noreferrer">Open Supabase Dashboard</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
