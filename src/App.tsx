import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Artworks from "./pages/admin/Artworks";
import ArtworksForm from "./pages/admin/ArtworksForm";
import Pages from "./pages/admin/Pages";
import PageForm from "./pages/admin/PageForm";
import Exhibitions from "./pages/admin/Exhibitions";
import ExhibitionForm from "./pages/admin/ExhibitionForm";
import Messages from "./pages/admin/Messages";
import Settings from "./pages/admin/Settings";
import Users from "./pages/admin/Users";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navigation />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/art/:slug" element={<ArtworkDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<Auth />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="artworks" element={<Artworks />} />
            <Route path="artworks/new" element={<ArtworksForm />} />
            <Route path="artworks/:id" element={<ArtworksForm />} />
            <Route path="pages" element={<Pages />} />
            <Route path="pages/new" element={<PageForm />} />
            <Route path="pages/:id" element={<PageForm />} />
            <Route path="exhibitions" element={<Exhibitions />} />
            <Route path="exhibitions/new" element={<ExhibitionForm />} />
            <Route path="exhibitions/:id" element={<ExhibitionForm />} />
            <Route path="messages" element={<Messages />} />
            <Route path="settings" element={<Settings />} />
            <Route path="users" element={<Users />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
