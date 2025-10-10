import { memo } from "react";

const gradientLayers =
  "radial-gradient(at 20% 20%, rgba(109, 76, 255, 0.25), transparent 55%)," +
  "radial-gradient(at 80% 10%, rgba(64, 134, 255, 0.18), transparent 60%)," +
  "radial-gradient(at 50% 80%, rgba(180, 90, 255, 0.12), transparent 55%)";

const LiquidEtherFallback = () => (
  <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#1a1033] via-[#0a0d1f] to-[#06121f]" aria-hidden>
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: gradientLayers,
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0d1f]/60 to-[#060913]" />
  </div>
);

export default memo(LiquidEtherFallback);
