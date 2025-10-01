import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface RippleGridProps {
  className?: string;
  color?: string;
  speed?: number;
}

export const RippleGrid = ({ className, color = "rgba(99,102,241,0.25)", speed = 6 }: RippleGridProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrame = 0;
    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resize();

    const draw = (time: number) => {
      const width = canvas.width;
      const height = canvas.height;
      context.clearRect(0, 0, width, height);

      const gridSize = 48;
      const amplitude = 12;
      const frequency = 0.002 * speed;
      const wave = Math.sin(time * 0.001 * speed);

      for (let x = 0; x < width + gridSize; x += gridSize) {
        for (let y = 0; y < height + gridSize; y += gridSize) {
          const offset = Math.sin((x + y) * frequency + wave) * amplitude;
          context.beginPath();
          context.strokeStyle = color;
          context.lineWidth = 1;
          context.rect(x - offset, y - offset, gridSize, gridSize);
          context.stroke();
        }
      }

      animationFrame = requestAnimationFrame(draw);
    };

    animationFrame = requestAnimationFrame(draw);

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, [color, prefersReducedMotion, speed]);

  if (prefersReducedMotion) {
    return <div className={className} aria-hidden style={{ backgroundImage: "linear-gradient(135deg, rgba(99,102,241,0.1), transparent)" }} />;
  }

  return <canvas ref={canvasRef} className={className} aria-hidden />;
};
