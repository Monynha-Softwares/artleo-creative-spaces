import { Outlet } from "react-router-dom";
import LiquidEtherBackground from "@/components/reactbits/LiquidEtherBackground";
import { Navigation } from "@/components/Navigation";

type AppLayoutProps = {
  /**
   * Para desativar o efeito Liquid Ether em uma rota específica no futuro,
   * basta renderizar <AppLayout enableLiquidEther={false}> no registro da rota desejada.
   */
  enableLiquidEther?: boolean;
};

const AppLayout = ({ enableLiquidEther = true }: AppLayoutProps) => {
  return (
    <div className="relative min-h-screen bg-[#04060c] text-foreground">
      {enableLiquidEther && (
        <div className="pointer-events-none fixed inset-0 -z-20">
          <LiquidEtherBackground />
        </div>
      )}

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navigation />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
