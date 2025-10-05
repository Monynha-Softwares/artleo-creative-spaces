import { Suspense, lazy } from "react";
import { useReducedMotion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Navigation } from "./components/Navigation";
import { ScrollToTop } from "./components/ScrollToTop";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import ArtworkDetail from "./pages/ArtworkDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const LazyLiquidEtherBackground = lazy(
  () => import("@/components/reactbits/LiquidEtherBackground"),
);

const BackgroundFallback = () => (
  <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#1a1033] via-[#0a0d1f] to-[#06121f]">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "radial-gradient(at 20% 20%, rgba(109, 76, 255, 0.25), transparent 55%)," +
          "radial-gradient(at 80% 10%, rgba(64, 134, 255, 0.18), transparent 60%)," +
          "radial-gradient(at 50% 80%, rgba(180, 90, 255, 0.12), transparent 55%)",
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0d1f]/60 to-[#060913]" />
  </div>
);

const BackgroundLayer = () => {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <BackgroundFallback />;
  }

  return (
    <Suspense fallback={<BackgroundFallback />}>
      <LazyLiquidEtherBackground />
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
              <BackgroundLayer />
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
