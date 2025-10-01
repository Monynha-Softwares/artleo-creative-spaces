import { useEffect, useMemo, useRef } from "react";
import "./PixelCard.css";

type PixelCardVariant = "default" | "blue" | "yellow" | "pink";

type PixelCardProps = {
  variant?: PixelCardVariant;
  gap?: number;
  speed?: number;
  colors?: string;
  noFocus?: boolean;
  className?: string;
  children?: React.ReactNode;
};

type PixelAnimation = "appear" | "disappear";

type PixelInitConfig = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  x: number;
  y: number;
  color: string;
  speed: number;
  delay: number;
};

class Pixel {
  private width: number;
  private height: number;
  private ctx: CanvasRenderingContext2D;
  private x: number;
  private y: number;
  private color: string;
  private speed: number;
  private size = 0;
  private sizeStep = Math.random() * 0.4;
  private readonly minSize = 0.5;
  private readonly maxSizeInteger = 2;
  private maxSize: number;
  private delay: number;
  private counter = 0;
  private counterStep: number;
  private isIdle = false;
  private isReverse = false;
  private isShimmer = false;

  constructor({ canvas, context, x, y, color, speed, delay }: PixelInitConfig) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = context;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = this.getRandomValue(0.1, 0.9) * speed;
    this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger);
    this.delay = delay;
    this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01;
  }

  private getRandomValue(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  private draw() {
    const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x + centerOffset, this.y + centerOffset, this.size, this.size);
  }

  private shimmer() {
    if (this.size >= this.maxSize) {
      this.isReverse = true;
    } else if (this.size <= this.minSize) {
      this.isReverse = false;
    }
    this.size += this.isReverse ? -this.speed : this.speed;
  }

  appear() {
    this.isIdle = false;
    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }
    if (this.size >= this.maxSize) {
      this.isShimmer = true;
    }
    if (this.isShimmer) {
      this.shimmer();
    } else {
      this.size += this.sizeStep;
    }
    this.draw();
  }

  disappear() {
    this.isShimmer = false;
    this.counter = 0;
    if (this.size <= 0) {
      this.isIdle = true;
      return;
    }
    this.size = Math.max(0, this.size - 0.1);
    this.draw();
  }

  step(animation: PixelAnimation) {
    if (animation === "appear") {
      this.appear();
    } else {
      this.disappear();
    }
  }

  get idle() {
    return this.isIdle;
  }
}

const VARIANTS: Record<PixelCardVariant, { gap: number; speed: number; colors: string; noFocus: boolean }> = {
  default: { gap: 5, speed: 35, colors: "#f8fafc,#f1f5f9,#cbd5e1", noFocus: false },
  blue: { gap: 10, speed: 25, colors: "#e0f2fe,#7dd3fc,#0ea5e9", noFocus: false },
  yellow: { gap: 3, speed: 20, colors: "#fef08a,#fde047,#eab308", noFocus: false },
  pink: { gap: 6, speed: 80, colors: "#fecdd3,#fda4af,#e11d48", noFocus: true },
};

const getEffectiveSpeed = (value: number, reducedMotion: boolean) => {
  const min = 0;
  const max = 100;
  const throttle = 0.001;

  if (value <= min || reducedMotion) {
    return min;
  }
  if (value >= max) {
    return max * throttle;
  }
  return value * throttle;
};

export const PixelCard = ({
  variant = "default",
  gap,
  speed,
  colors,
  noFocus,
  className = "",
  children,
}: PixelCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const animationRef = useRef<number | null>(null);
  const timePreviousRef = useRef(typeof performance !== "undefined" ? performance.now() : 0);
  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false,
    [],
  );

  const variantCfg = VARIANTS[variant] ?? VARIANTS.default;
  const finalGap = gap ?? variantCfg.gap;
  const finalSpeed = speed ?? variantCfg.speed;
  const finalColors = colors ?? variantCfg.colors;
  const finalNoFocus = noFocus ?? variantCfg.noFocus;

  const initPixels = () => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const colorsArray = finalColors.split(",");
    const pxs: Pixel[] = [];
    for (let x = 0; x < width; x += Number(finalGap)) {
      for (let y = 0; y < height; y += Number(finalGap)) {
        const color = colorsArray[Math.floor(Math.random() * colorsArray.length)] ?? colorsArray[0];

        const dx = x - width / 2;
        const dy = y - height / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const delay = reducedMotion ? 0 : distance;

        pxs.push(
          new Pixel({
            canvas,
            context: ctx,
            x,
            y,
            color,
            speed: getEffectiveSpeed(finalSpeed, reducedMotion),
            delay,
          }),
        );
      }
    }
    pixelsRef.current = pxs;
  };

  const doAnimate = (fnName: PixelAnimation) => {
    animationRef.current = requestAnimationFrame(() => doAnimate(fnName));
    const timeNow = performance.now();
    const timePassed = timeNow - timePreviousRef.current;
    const timeInterval = 1000 / 60;

    if (timePassed < timeInterval) return;
    timePreviousRef.current = timeNow - (timePassed % timeInterval);

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !canvasRef.current) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    let allIdle = true;
    for (const pixel of pixelsRef.current) {
      pixel.step(fnName);
      if (!pixel.idle) {
        allIdle = false;
      }
    }
    if (allIdle && animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const handleAnimation = (name: PixelAnimation) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    animationRef.current = requestAnimationFrame(() => doAnimate(name));
  };

  const onMouseEnter = () => handleAnimation("appear");
  const onMouseLeave = () => handleAnimation("disappear");
  const onFocus: React.FocusEventHandler<HTMLDivElement> = (event) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    handleAnimation("appear");
  };
  const onBlur: React.FocusEventHandler<HTMLDivElement> = (event) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    handleAnimation("disappear");
  };

  useEffect(() => {
    initPixels();
    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(() => {
        initPixels();
      });
      const current = containerRef.current;
      if (current) {
        observer.observe(current);
      }
      return () => {
        observer.disconnect();
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalGap, finalSpeed, finalColors, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`pixel-card ${className}`.trim()}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={finalNoFocus ? undefined : onFocus}
      onBlur={finalNoFocus ? undefined : onBlur}
      tabIndex={finalNoFocus ? -1 : 0}
    >
      <canvas className="pixel-canvas" ref={canvasRef} />
      {children}
    </div>
  );
};

export default PixelCard;
