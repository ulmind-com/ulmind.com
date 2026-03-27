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

const BlurBlob: React.FC<BlurBlobProps> = ({ position, size, colorClass, className, opacityClass }) => {
  return (
    <div
      className={cn("absolute -z-10 pointer-events-none", className)}
      style={{
        top: position.top,
        left: position.left,
        width: size.width,
        height: size.height,
        transform: "translate(-50%, -50%) translateZ(0)",
        willChange: "transform",
      }}
    >
      <div
        className={cn(
          "w-full h-full rounded-full blur-3xl",
          colorClass || "bg-primary",
          opacityClass || "opacity-20"
        )}
        style={{
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      />
    </div>
  );
};

export default BlurBlob;
