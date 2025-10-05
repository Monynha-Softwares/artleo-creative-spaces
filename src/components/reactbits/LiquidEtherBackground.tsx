import { useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';

import { LiquidEtherGradientFallback } from './liquidEtherFallback';
import LiquidEther from './LiquidEther';

const LiquidEtherBackground = () => {
  const reduceMotion = useReducedMotion();
  const palette = useMemo(() => ['#5227FF', '#FF9FFC', '#B19EEF'], []);

  return (
    <div className="absolute inset-0" role="presentation" aria-hidden>
      {reduceMotion ? (
        <LiquidEtherGradientFallback />
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
