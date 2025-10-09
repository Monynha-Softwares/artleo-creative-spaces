import { GooeyNav } from "@/components/reactbits/GooeyNav";
import { MobileNavProvider } from "@/contexts/MobileNavContext";

export const Navigation = () => {
  return (
    <MobileNavProvider>
      <GooeyNav />
    </MobileNavProvider>
  );
};

Navigation.displayName = "Navigation";
