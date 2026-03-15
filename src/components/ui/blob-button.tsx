import React from "react";
import "./blob-button.css";
import { cn } from "@/lib/utils";

interface BlobButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function BlobButton({ children, className, ...props }: BlobButtonProps) {
  return (
    <>
      <svg
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7"
              result="goo"
            />
            <feBlend in2="goo" in="SourceGraphic" result="mix" />
          </filter>
        </defs>
      </svg>
      <button className={cn("blob-btn", className)} {...props}>
        {children}
        <span className="blob-btn__inner">
          <span className="blob-btn__blobs">
            <span className="blob-btn__blob" />
            <span className="blob-btn__blob" />
            <span className="blob-btn__blob" />
            <span className="blob-btn__blob" />
          </span>
        </span>
      </button>
    </>
  );
}
