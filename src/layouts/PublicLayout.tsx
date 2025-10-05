import { Outlet } from "react-router-dom";
import LiquidEtherBackground from "@/components/reactbits/LiquidEtherBackground";
import { Navigation } from "@/components/Navigation";

export const PublicLayout = () => {
  return (
    <div className="relative min-h-screen bg-surface-0 text-foreground">
      <LiquidEtherBackground className="fixed inset-0 -z-10" />
      <div className="relative flex min-h-screen flex-col">
        <Navigation />
        <main id="main-content" tabIndex={-1} className="relative z-10 flex-1 focus:outline-none">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PublicLayout;
