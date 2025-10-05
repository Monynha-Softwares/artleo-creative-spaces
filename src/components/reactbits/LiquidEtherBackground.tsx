import { useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';
import LiquidEther from './LiquidEther';

const fallbackGradient =
  'radial-gradient(at 20% 20%, rgba(109, 76, 255, 0.25), transparent 55%),' +
  'radial-gradient(at 80% 10%, rgba(64, 134, 255, 0.18), transparent 60%),' +
  'radial-gradient(at 50% 80%, rgba(180, 90, 255, 0.12), transparent 55%)';

const LiquidEtherBackground = () => {
  const reduceMotion = useReducedMotion();
  const palette = useMemo(() => ['#5227FF', '#FF9FFC', '#B19EEF'], []);

  return (
    <div className="absolute inset-0" role="presentation" aria-hidden>
      {reduceMotion ? (
        <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#1a1033] via-[#0a0d1f] to-[#06121f]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: fallbackGradient,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0d1f]/60 to-[#060913]" />
        </div>
      ) : (
        <LiquidEther
          colors={palette}
          mouseForce={20}
          cursorSize={100}
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
      )}
    </div>
  );
};

export default LiquidEtherBackground;
