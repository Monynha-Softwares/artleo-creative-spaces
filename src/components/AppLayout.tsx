import { Outlet } from "react-router-dom";
import LiquidEtherBackground from "@/components/reactbits/LiquidEtherBackground";
import { Navigation } from "@/components/Navigation";

type AppLayoutProps = {
  /**
   * Allow routes to opt out of the animated background by rendering
   * `<AppLayout showLiquidEther={false} />` in the router.
   */
  showLiquidEther?: boolean;
};

const AppLayout = ({ showLiquidEther = true }: AppLayoutProps) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#05070f] text-slate-100">
      {showLiquidEther ? (
        <>
          <LiquidEtherBackground />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-[#05070f]/40 via-[#05070f]/55 to-[#05070f]/85"
          />
        </>
      ) : (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-[#05070f] via-[#04050b] to-[#03040a]"
        />
      )}
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navigation />
        <main className="pointer-events-auto flex flex-1 flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
