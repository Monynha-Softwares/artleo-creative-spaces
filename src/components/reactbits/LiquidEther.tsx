import { useEffect, useMemo, useRef } from "react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

import "./LiquidEther.css";

type LiquidEtherProps = {
  colors?: string[];
  className?: string;
  style?: CSSProperties;
  autoDemo?: boolean;
  autoSpeed?: number;
  autoIntensity?: number;
  autoResumeDelay?: number;
};

const DEFAULT_COLORS = ["#5227FF", "#FF9FFC", "#B19EEF"] as const;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const hexToRgba = (hexColor: string, alpha: number) => {
  const sanitized = hexColor.replace("#", "");
  const normalized = sanitized.length === 3
    ? sanitized
        .split("")
        .map(char => char + char)
        .join("")
    : sanitized;

  const value = Number.parseInt(normalized, 16);

  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function LiquidEther({
  colors,
  className,
  style,
  autoDemo = true,
  autoSpeed = 0.4,
  autoIntensity = 2,
  autoResumeDelay = 3000,
}: LiquidEtherProps) {
  const palette = useMemo(() => {
    if (!colors || colors.length === 0) {
      return [...DEFAULT_COLORS];
    }

    return colors.slice(0, 5);
  }, [colors]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>();
  const devicePixelRatioRef = useRef(1);
  const phaseRef = useRef(0);
  const pointerRef = useRef({
    x: 0.5,
    y: 0.5,
    targetX: 0.5,
    targetY: 0.5,
    lastUserMove: performance.now(),
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let isMounted = true;

    const updateCanvasSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      devicePixelRatioRef.current = dpr;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current.targetX = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      pointerRef.current.targetY = clamp((event.clientY - rect.top) / rect.height, 0, 1);
      pointerRef.current.lastUserMove = performance.now();
    };

    const handleTouch = (event: TouchEvent) => {
      if (event.touches.length === 0) return;
      const touch = event.touches[0];
      handlePointerMove({
        clientX: touch.clientX,
        clientY: touch.clientY,
      } as PointerEvent);
    };

    updateCanvasSize();

    const resizeObserver = new ResizeObserver(updateCanvasSize);
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    window.addEventListener("resize", updateCanvasSize);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerdown", handlePointerMove);
    canvas.addEventListener("touchstart", handleTouch, { passive: true });
    canvas.addEventListener("touchmove", handleTouch, { passive: true });

    let lastFrame = performance.now();

    const renderFrame = () => {
      if (!isMounted) {
        return;
      }

      const now = performance.now();
      const delta = (now - lastFrame) / 1000;
      lastFrame = now;

      const dpr = devicePixelRatioRef.current;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      if (width === 0 || height === 0) {
        animationRef.current = requestAnimationFrame(renderFrame);
        return;
      }

      const pointer = pointerRef.current;

      if (autoDemo && now - pointer.lastUserMove > autoResumeDelay) {
        phaseRef.current += delta * autoSpeed;
        const amplitude = clamp(0.12 + autoIntensity * 0.04, 0.12, 0.35);
        pointer.targetX = clamp(0.5 + Math.cos(phaseRef.current) * amplitude, 0.08, 0.92);
        pointer.targetY = clamp(0.5 + Math.sin(phaseRef.current * 0.8) * amplitude, 0.1, 0.9);
      }

      const smoothing = 1 - Math.pow(0.001, delta * 60);
      pointer.x += (pointer.targetX - pointer.x) * smoothing;
      pointer.y += (pointer.targetY - pointer.y) * smoothing;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);

      const maxRadius = Math.max(width, height) * 0.8;
      const time = phaseRef.current;

      palette.forEach((color, index) => {
        const offsetAngle = time * (0.6 + index * 0.2) + index * Math.PI * 0.5;
        const offsetStrength = (index + 1) / palette.length;
        const centerX = pointer.x * width + Math.cos(offsetAngle) * width * 0.2 * offsetStrength;
        const centerY = pointer.y * height + Math.sin(offsetAngle) * height * 0.25 * offsetStrength;
        const radius = maxRadius * (0.6 + index * 0.25);

        const gradient = context.createRadialGradient(centerX, centerY, radius * 0.1, centerX, centerY, radius);
        gradient.addColorStop(0, hexToRgba(color, 0.65 - index * 0.12));
        gradient.addColorStop(1, "rgba(5, 8, 20, 0)");

        context.globalCompositeOperation = "lighter";
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
      });

      context.globalCompositeOperation = "source-over";
      context.fillStyle = "rgba(6, 10, 19, 0.45)";
      context.fillRect(0, 0, width, height);

      animationRef.current = requestAnimationFrame(renderFrame);
    };

    animationRef.current = requestAnimationFrame(renderFrame);

    return () => {
      isMounted = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateCanvasSize);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerdown", handlePointerMove);
      canvas.removeEventListener("touchstart", handleTouch);
      canvas.removeEventListener("touchmove", handleTouch);
    };
  }, [autoDemo, autoIntensity, autoResumeDelay, autoSpeed, palette]);

  return (
    <div className={cn("liquid-ether-container", className)} style={style}>
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(109,76,255,0.18),transparent_60%),radial-gradient(circle_at_80%_10%,rgba(64,134,255,0.15),transparent_65%),radial-gradient(circle_at_50%_80%,rgba(180,90,255,0.12),transparent_60%)]"
      />
    </div>
  );
}
