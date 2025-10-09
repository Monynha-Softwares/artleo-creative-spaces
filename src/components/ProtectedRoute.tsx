import { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface ProtectedRouteProps {
  children?: ReactNode;
  redirectTo?: string;
  loaderClassName?: string;
}

export const ProtectedRoute = ({
  children,
  redirectTo = "/auth",
  loaderClassName,
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center" role="status" aria-live="polite">
        <Loader2 className={cn("h-8 w-8 animate-spin text-muted-foreground", loaderClassName)} />
        <span className="sr-only">Loading authentication status</span>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <>{children ?? <Outlet />}</>;
};

export default ProtectedRoute;
