import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Navigation } from "./components/Navigation";
import { ScrollToTop } from "./components/ScrollToTop";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LiquidEtherGradientFallback } from "@/components/reactbits/liquidEtherFallback";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import ArtworkDetail from "./pages/ArtworkDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const LiquidEtherBackground = lazy(() => import("@/components/reactbits/LiquidEtherBackground"));

const GlobalBackground = () => {
  const [shouldRenderInteractive, setShouldRenderInteractive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!mediaQuery.matches) {
      setShouldRenderInteractive(true);
    }

    const handleChange = (event: MediaQueryListEvent) => {
      setShouldRenderInteractive(!event.matches);
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  if (!shouldRenderInteractive) {
    return <LiquidEtherGradientFallback />;
  }

  return (
    <Suspense fallback={<LiquidEtherGradientFallback />}>
      <LiquidEtherBackground />
    </Suspense>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
            <div className="pointer-events-none fixed inset-0 -z-10">
              {/*
                The Liquid Ether background lives here so every public route inherits it.
                To disable it for a specific page in the future, read `useLocation()` and
                conditionally render this block based on the current pathname.
              */}
              <GlobalBackground />
            </div>
            <Navigation />
            <main className="relative z-0 flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/art/:slug" element={<ArtworkDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
