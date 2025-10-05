import { Suspense, lazy, useEffect, useMemo, useState, type RefObject } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const LiquidEtherCanvas = lazy(() => import("./LiquidEther"));

const fallbackGradient =
  "radial-gradient(at 20% 20%, rgba(109, 76, 255, 0.25), transparent 55%)," +
  "radial-gradient(at 80% 10%, rgba(64, 134, 255, 0.18), transparent 60%)," +
  "radial-gradient(at 50% 80%, rgba(180, 90, 255, 0.12), transparent 55%)";

interface LiquidEtherBackgroundProps {
  containerRef?: RefObject<HTMLElement>;
  className?: string;
}

const LiquidEtherBackground = ({
  containerRef,
  className,
}: LiquidEtherBackgroundProps) => {
  const reduceMotion = useReducedMotion();
  const [supportsWebGL, setSupportsWebGL] = useState(() => typeof window !== "undefined");
  const palette = useMemo(() => ["#5227FF", "#FF9FFC", "#B19EEF"], []);

  useEffect(() => {
    if (reduceMotion) return;
    if (typeof window === "undefined") return;

    let support = true;
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      support = !!gl;
    } catch (error) {
      support = false;
    }

    setSupportsWebGL(support);
  }, [reduceMotion]);

  const shouldRenderFallback = reduceMotion || !supportsWebGL;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        "bg-gradient-to-br from-[#080c18] via-[#050712] to-[#020409]",
        className,
      )}
      role="presentation"
      aria-hidden
    >
      {shouldRenderFallback ? (
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: fallbackGradient,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0d1f]/60 to-[#060913]" />
        </div>
      ) : (
        <Suspense
          fallback={
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0d1f]/40 to-[#060913]" />
          }
        >
          <LiquidEtherCanvas
            colors={palette}
            mouseForce={20}
            cursorSize={96}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
            eventTarget={containerRef?.current ?? null}
            className="pointer-events-none"
          />
        </Suspense>
      )}
    </div>
  );
};

export default LiquidEtherBackground;
