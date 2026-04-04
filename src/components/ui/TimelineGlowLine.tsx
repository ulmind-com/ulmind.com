import React, { useRef, useMemo } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";

interface TimelineGlowLineProps {
  colorClass?: string;
  glowClass?: string;
  colors?: string[]; // Array of hex colors for dynamic scroll interpolation
  containerClass?: string;
}

export const TimelineGlowLine: React.FC<TimelineGlowLineProps> = ({ colorClass, glowClass, colors, containerClass }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const hasColors = colors && colors.length > 0;
  
  // Create interpolation mapping: e.g. [0, 0.5, 1] mapped to [color1, color2, color3]
  const inputRange = useMemo(() => {
    if (!hasColors) return [0, 1];
    if (colors!.length === 1) return [0, 1];
    return colors!.map((_, i) => i / (colors!.length - 1));
  }, [colors, hasColors]);

  const outputRange = useMemo(() => {
    if (!hasColors) return ["#000", "#000"];
    if (colors!.length === 1) return [colors![0], colors![0]];
    return colors!;
  }, [colors, hasColors]);

  const dynamicColor = useTransform(scrollYProgress, inputRange, outputRange);
  const dynamicBoxShadow = useMotionTemplate`0 0 20px ${dynamicColor}`;

  return (
    <div
      ref={containerRef}
      className={`absolute top-0 bottom-0 w-[2px] bg-zinc-200 dark:bg-zinc-800 ${containerClass || 'left-0 md:left-1/2 -translate-x-1/2'}`}
      style={{ zIndex: 0 }}
    >
      <motion.div
        className={`absolute top-0 left-0 w-full origin-top ${!hasColors ? (colorClass + ' ' + glowClass) : ''}`}
        style={{ 
          scaleY: scrollYProgress, 
          height: "100%",
          ...(hasColors && {
            backgroundColor: dynamicColor,
            boxShadow: dynamicBoxShadow,
          })
        }}
      />
    </div>
  );
};
