import { Loader2 } from "lucide-react";

export const PageLoader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-24 text-muted-foreground">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
        <p className="text-sm font-medium">Loading the experience…</p>
      </div>
    </div>
  );
};

PageLoader.displayName = "PageLoader";
