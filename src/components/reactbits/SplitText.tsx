import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

type SplitTextTargets = ReturnType<typeof GSAPSplitText>;

type SplitTextProps = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: "chars" | "words" | "lines" | string;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: React.CSSProperties["textAlign"];
  tag?: keyof JSX.IntrinsicElements;
  onLetterAnimationComplete?: () => void;
};

type SplitTextElement = HTMLElement & {
  _rbsplitInstance?: SplitTextTargets;
};

const tagList = new Set(["p", "h1", "h2", "h3", "h4", "h5", "h6"]);

export const SplitText = ({
  text,
  className = "",
  delay = 100,
  duration = 0.6,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  tag = "p",
  onLetterAnimationComplete,
}: SplitTextProps) => {
  const ref = useRef<SplitTextElement | null>(null);
  const animationCompletedRef = useRef(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const handleFontsReady = () => setFontsLoaded(true);
    if (document.fonts.status === "loaded") {
      handleFontsReady();
      return;
    }
    void document.fonts.ready.then(handleFontsReady);
  }, []);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element || !text || !fontsLoaded) return;

      if (element._rbsplitInstance) {
        try {
          element._rbsplitInstance.revert();
        } catch (error) {
          console.warn("Failed to revert split text", error);
        }
        element._rbsplitInstance = undefined;
      }

      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || "px" : "px";
      const sign =
        marginValue === 0
          ? ""
          : marginValue < 0
            ? `-=${Math.abs(marginValue)}${marginUnit}`
            : `+=${marginValue}${marginUnit}`;
      const start = `top ${startPct}%${sign}`;

      let targets: gsap.TweenTarget | undefined;
      const assignTargets = (self: SplitTextTargets) => {
        if (splitType.includes("chars") && self.chars.length) targets = self.chars;
        if (!targets && splitType.includes("words") && self.words.length)
          targets = self.words;
        if (!targets && splitType.includes("lines") && self.lines.length)
          targets = self.lines;
        if (!targets) targets = self.chars || self.words || self.lines;
      };

      const splitInstance = new GSAPSplitText(element, {
        type: splitType,
        smartWrap: true,
        autoSplit: splitType === "lines",
        linesClass: "split-line",
        wordsClass: "split-word",
        charsClass: "split-char",
        reduceWhiteSpace: false,
        onSplit: (self) => {
          assignTargets(self);
          const tween = gsap.fromTo(
            targets!,
            { ...from },
            {
              ...to,
              duration,
              ease,
              stagger: delay / 1000,
              scrollTrigger: {
                trigger: element,
                start,
                once: true,
                fastScrollEnd: true,
                anticipatePin: 0.4,
              },
              onComplete: () => {
                animationCompletedRef.current = true;
                onLetterAnimationComplete?.();
              },
              willChange: "transform, opacity",
              force3D: true,
            },
          );
          return tween;
        },
      });

      element._rbsplitInstance = splitInstance;

      return () => {
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger === element) st.kill();
        });
        try {
          splitInstance.revert();
        } catch (error) {
          console.warn("Failed to revert split text", error);
        }
        element._rbsplitInstance = undefined;
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        fontsLoaded,
        onLetterAnimationComplete,
      ],
      scope: ref,
    },
  );

  const renderTag = () => {
    const style: React.CSSProperties = {
      textAlign,
      overflow: "hidden",
      display: "inline-block",
      whiteSpace: "normal",
      wordWrap: "break-word",
      willChange: "transform, opacity",
    };
    const classes = `split-parent ${className}`.trim();
    const Tag = tagList.has(tag) ? (tag as keyof JSX.IntrinsicElements) : "p";
    return (
      <Tag ref={ref} style={style} className={classes}>
        {text}
      </Tag>
    );
  };

  return renderTag();
};

export default SplitText;
