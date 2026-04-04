import React from "react";
import { cn } from "@/lib/utils";

interface BlurBlobProps {
  position: {
    top: string;
    left: string;
  };
  size: {
    width: string;
    height: string;
  };
  colorClass?: string;
  className?: string;
  opacityClass?: string;
}

/**
 * Performance-optimised blob.
 * Uses a radial-gradient background instead of CSS filter:blur()
 * so the browser never needs to rasterise a blur on the main thread.
 * The gradient is composited entirely on the GPU as a single layer.
 */
const BlurBlob: React.FC<BlurBlobProps> = ({ position, size, colorClass, className, opacityClass }) => {
  // Map Tailwind color classes → CSS rgba for the radial gradient
  const colorMap: Record<string, string> = {
    "bg-cyan-300":     "rgba(103,232,249,",
    "bg-cyan-600":     "rgba(8,145,178,",
    "bg-indigo-300":   "rgba(165,180,252,",
    "bg-fuchsia-300":  "rgba(240,171,252,",
    "bg-fuchsia-600":  "rgba(192,38,211,",
    "bg-rose-400":     "rgba(251,113,133,",
    "bg-purple-400":   "rgba(192,132,252,",
    "bg-blue-400":     "rgba(96,165,250,",
    "bg-violet-400":   "rgba(167,139,250,",
    "bg-pink-400":     "rgba(244,114,182,",
    "bg-emerald-400":  "rgba(52,211,153,",
    "bg-amber-400":    "rgba(251,191,36,",
    "bg-primary":      "rgba(139,92,246,",
  };

  const colorKey = colorClass?.split(" ").find(c => colorMap[c]) ?? "bg-primary";
  const base = colorMap[colorKey] ?? "rgba(139,92,246,";

  // Extract opacity from class like "opacity-20" → 0.20
  const opacityMatch = opacityClass?.match(/opacity-(\d+)/);
  const opacityVal = opacityMatch ? parseInt(opacityMatch[1]) / 100 : 0.2;

  return (
    <div
      aria-hidden="true"
      className={cn("absolute -z-10 pointer-events-none", className)}
      style={{
        top: position.top,
        left: position.left,
        width: size.width,
        height: size.height,
        transform: "translate(-50%, -50%) translateZ(0)",
        // Radial-gradient blob — no filter, no rasterisation cost
        background: `radial-gradient(circle, ${base}${opacityVal}) 0%, transparent 70%)`,
        borderRadius: "9999px",
        willChange: "auto",
      }}
    />
  );
};

export default BlurBlob;
