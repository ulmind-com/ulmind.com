"use client";
import { useEffect, useRef, useCallback } from "react";
import createGlobe from "cobe";

export function CobeGlobe({ className }: { className?: string }) {
  let phi = 0;
  let width = 0;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
    }
  };

  const onRender = useCallback((state: Record<string, any>) => {
    if (!pointerInteracting.current) phi += 0.005;
    state.phi = phi + pointerInteractionMovement.current / 200;
    state.width = width * 2;
    state.height = width * 2;
  }, []);

  const onResize = () => {
    if (canvasRef.current) {
      width = canvasRef.current.offsetWidth;
    }
  };

  useEffect(() => {
    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 0.4,
      mapSamples: 16000,
      mapBrightness: 1.2,
      baseColor: [1, 1, 1],
      markerColor: [251 / 255, 100 / 255, 21 / 255],
      glowColor: [1.2, 1.2, 1.2],
      markers: [
        { location: [40.7128, -74.006], size: 0.08 },
        { location: [51.5074, -0.1278], size: 0.08 },
        { location: [35.6762, 139.6503], size: 0.06 },
        { location: [-33.8688, 151.2093], size: 0.06 },
        { location: [48.8566, 2.3522], size: 0.06 },
        { location: [28.6139, 77.209], size: 0.1 },
        { location: [22.5726, 88.3639], size: 0.08 },
        { location: [55.7558, 37.6173], size: 0.06 },
        { location: [-22.9068, -43.1729], size: 0.06 },
        { location: [31.2304, 121.4737], size: 0.06 },
        { location: [25.2048, 55.2708], size: 0.06 },
        { location: [1.3521, 103.8198], size: 0.05 },
        { location: [19.076, 72.8777], size: 0.1 },
      ],
      onRender,
    });

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1";
      }
    }, 0);

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className={className} style={{ width: "100%", aspectRatio: "1" }}>
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => updatePointerInteraction(e.clientX)}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          contain: "layout paint size",
          opacity: 0,
          transition: "opacity 1s ease",
        }}
      />
    </div>
  );
}
