import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import LiquidEther from './LiquidEther';

const fallbackGradient =
  'radial-gradient(at 20% 20%, rgba(109, 76, 255, 0.25), transparent 55%),' +
  'radial-gradient(at 80% 10%, rgba(64, 134, 255, 0.18), transparent 60%),' +
  'radial-gradient(at 50% 80%, rgba(180, 90, 255, 0.12), transparent 55%)';

interface LiquidEtherBackgroundProps {
  className?: string;
  children?: ReactNode;
}

const LiquidEtherBackground = ({
  className,
  children,
}: LiquidEtherBackgroundProps) => {
  const reduceMotion = useReducedMotion();
  const [supportsWebGL, setSupportsWebGL] = useState(true);

  useEffect(() => {
    const checkWebGLSupport = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl =
          canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        if (!gl) {
          setSupportsWebGL(false);
        } else {
          const loseContext = gl.getExtension('WEBGL_lose_context');
          loseContext?.loseContext();
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('LiquidEther background WebGL check failed', error);
        }
        setSupportsWebGL(false);
      }
    };

    if (typeof window !== 'undefined') {
      checkWebGLSupport();
    }
  }, []);

  const palette = useMemo(() => ['#5227FF', '#FF9FFC', '#B19EEF'], []);
  const showInteractiveLayer = !reduceMotion && supportsWebGL;

  return (
    <div className={cn('relative isolate', className)} role="presentation" aria-hidden>
      <div className="absolute inset-0 -z-10 h-full w-full">
        {showInteractiveLayer ? (
          <LiquidEther
            className="h-full w-full"
            colors={palette}
            mouseForce={18}
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
          />
        ) : (
          <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#1a1033] via-[#0a0d1f] to-[#06121f]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: fallbackGradient,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0d1f]/60 to-[#060913]" />
          </div>
        )}
      </div>

      {children ? <div className="relative z-10">{children}</div> : null}
    </div>
  );
};

export default LiquidEtherBackground;
