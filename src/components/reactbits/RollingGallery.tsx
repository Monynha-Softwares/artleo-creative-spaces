import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import "./RollingGallery.css";

type RollingGalleryProps = {
  images: string[];
  autoplay?: boolean;
  pauseOnHover?: boolean;
};

export const RollingGallery = ({
  images,
  autoplay = true,
  pauseOnHover = true,
}: RollingGalleryProps) => {
  const prefersReducedMotion = useReducedMotion();
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth <= 640 : false,
  );
  const validImages = images.length > 0 ? images : [];
  const faceCount = Math.max(validImages.length, 1);

  const cylinderWidth = isSmallScreen ? 1100 : 1800;
  const faceWidth = (cylinderWidth / faceCount) * 1.5;
  const dragFactor = 0.05;
  const radius = cylinderWidth / (2 * Math.PI);

  const rotation = useMotionValue(0);
  const controls = useAnimation();
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const destroyAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  };

  const handleDrag: Parameters<typeof motion.div>[0]["onDrag"] = (_, info) => {
    rotation.set(rotation.get() + info.offset.x * dragFactor);
  };

  const handleDragEnd: Parameters<typeof motion.div>[0]["onDragEnd"] = (_, info) => {
    controls.start({
      rotateY: rotation.get() + info.velocity.x * dragFactor,
      transition: { type: "spring", stiffness: 60, damping: 20, mass: 0.1, ease: "easeOut" },
    });
  };

  const transform = useTransform(rotation, (value) => `rotate3d(0, 1, 0, ${value}deg)`);

  useEffect(() => {
    if (prefersReducedMotion || !autoplay || faceCount <= 1) return;

    autoplayRef.current = setInterval(() => {
      const nextRotation = rotation.get() - 360 / faceCount;
      controls.start({ rotateY: nextRotation, transition: { duration: 2, ease: "linear" } });
      rotation.set(nextRotation);
    }, 2000);

    return destroyAutoplay;
  }, [autoplay, controls, faceCount, prefersReducedMotion, rotation]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseEnter = () => {
    if (autoplay && pauseOnHover) {
      destroyAutoplay();
      controls.stop();
    }
  };

  const handleMouseLeave = () => {
    if (autoplay && pauseOnHover && !prefersReducedMotion && faceCount > 1) {
      destroyAutoplay();
      autoplayRef.current = setInterval(() => {
        const nextRotation = rotation.get() - 360 / faceCount;
        controls.start({ rotateY: nextRotation, transition: { duration: 2, ease: "linear" } });
        rotation.set(nextRotation);
      }, 2000);
    }
  };

  if (prefersReducedMotion || faceCount <= 1) {
    return (
      <div className="gallery-container static">
        <div className="gallery-content static-grid">
          {validImages.map((url, index) => (
            <img key={index} src={url} alt="gallery" className="gallery-img" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-container">
      <div className="gallery-gradient gallery-gradient-left" />
      <div className="gallery-gradient gallery-gradient-right" />
      <div className="gallery-content">
        <motion.div
          drag="x"
          className="gallery-track"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            transform,
            rotateY: rotation,
            width: cylinderWidth,
            transformStyle: "preserve-3d",
          }}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          animate={controls}
        >
          {validImages.map((url, index) => (
            <div
              key={url + index}
              className="gallery-item"
              style={{
                width: `${faceWidth}px`,
                transform: `rotateY(${index * (360 / faceCount)}deg) translateZ(${radius}px)`,
              }}
            >
              <img src={url} alt="gallery" className="gallery-img" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default RollingGallery;
