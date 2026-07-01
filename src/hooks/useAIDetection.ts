/* ──────────────────────────────────────────────────────────────
   useAIDetection — Client-side AI detection hook
   Uses canvas pixel analysis for face/object detection
   without external ML libraries (lightweight approach)
   ────────────────────────────────────────────────────────────── */

import { useState, useCallback, useRef, useEffect } from "react";

export interface DetectionResult {
  faceDetected: boolean;
  mobileDetected: boolean;
  sleepingDetected: boolean;
  cameraCovered: boolean;
  cameraFrozen: boolean;
  personCount: number;
  lookingAway: boolean;
  lowLight: boolean;
  confidence: number;
  timestamp: number;
}

interface UseAIDetectionReturn {
  isModelLoaded: boolean;
  isDetecting: boolean;
  lastResult: DetectionResult | null;
  startDetection: (videoElement: HTMLVideoElement) => void;
  stopDetection: () => void;
  detectionHistory: DetectionResult[];
}

const DEFAULT_RESULT: DetectionResult = {
  faceDetected: false,
  mobileDetected: false,
  sleepingDetected: false,
  cameraCovered: false,
  cameraFrozen: false,
  personCount: 0,
  lookingAway: false,
  lowLight: false,
  confidence: 0,
  timestamp: Date.now(),
};

/**
 * Lightweight face detection using canvas pixel analysis.
 * Uses skin-tone detection and motion analysis instead of heavy ML models.
 * For production, replace with TensorFlow.js COCO-SSD / BlazeFace.
 */
export function useAIDetection(intervalMs = 3000): UseAIDetectionReturn {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [lastResult, setLastResult] = useState<DetectionResult | null>(null);
  const [detectionHistory, setDetectionHistory] = useState<DetectionResult[]>([]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prevFrameRef = useRef<ImageData | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const frozenCountRef = useRef(0);

  // Initialize "model" (our lightweight detector)
  useEffect(() => {
    // Simulating model load time
    const timer = setTimeout(() => setIsModelLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const analyzeFrame = useCallback((video: HTMLVideoElement): DetectionResult => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }
    const canvas = canvasRef.current;
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx || video.readyState < 2) return { ...DEFAULT_RESULT, timestamp: Date.now() };

    ctx.drawImage(video, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    let skinPixels = 0;
    let darkPixels = 0;
    let totalBrightness = 0;
    let centerSkinPixels = 0;
    const totalPixels = width * height;
    const centerX1 = width * 0.25, centerX2 = width * 0.75;
    const centerY1 = height * 0.15, centerY2 = height * 0.65;

    // Analyze pixels
    for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel for performance
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r + g + b) / 3;
      totalBrightness += brightness;

      // Count dark pixels (camera covered detection)
      if (brightness < 20) darkPixels++;

      // Skin-tone detection (simplified)
      if (r > 95 && g > 40 && b > 20 && r > g && r > b && 
          Math.abs(r - g) > 15 && r - b > 15) {
        skinPixels++;
        
        // Check if skin is in center region (face area)
        const pixelIdx = (i / 4);
        const px = pixelIdx % width;
        const py = Math.floor(pixelIdx / width);
        if (px >= centerX1 && px <= centerX2 && py >= centerY1 && py <= centerY2) {
          centerSkinPixels++;
        }
      }
    }

    const sampledPixels = totalPixels / 4;
    const skinRatio = skinPixels / sampledPixels;
    const darkRatio = darkPixels / sampledPixels;
    const avgBrightness = totalBrightness / sampledPixels;
    const centerSkinRatio = centerSkinPixels / (sampledPixels * 0.25); // Center is ~25% of frame

    // Camera covered: mostly dark
    const cameraCovered = darkRatio > 0.85;

    // Low light
    const lowLight = avgBrightness < 40 && !cameraCovered;

    // Face detected: significant skin-tone in center region
    const faceDetected = !cameraCovered && centerSkinRatio > 0.05 && skinRatio > 0.03;

    // Person count estimation (rough: based on total skin area)
    let personCount = 0;
    if (faceDetected) {
      personCount = skinRatio > 0.15 ? 2 : 1; // Very rough estimate
    }

    // Camera frozen detection (compare with previous frame)
    let cameraFrozen = false;
    if (prevFrameRef.current && prevFrameRef.current.data.length === imageData.data.length) {
      let diffPixels = 0;
      const prevData = prevFrameRef.current.data;
      for (let i = 0; i < data.length; i += 64) { // Sample fewer pixels
        const diff = Math.abs(data[i] - prevData[i]) + 
                     Math.abs(data[i + 1] - prevData[i + 1]) + 
                     Math.abs(data[i + 2] - prevData[i + 2]);
        if (diff > 30) diffPixels++;
      }
      const changeRatio = diffPixels / (data.length / 64);
      if (changeRatio < 0.01) {
        frozenCountRef.current++;
        if (frozenCountRef.current >= 5) cameraFrozen = true; // Frozen for 5 consecutive checks
      } else {
        frozenCountRef.current = 0;
      }
    }
    prevFrameRef.current = imageData;

    // Looking away: skin detected but not in center
    const lookingAway = !cameraCovered && skinRatio > 0.02 && centerSkinRatio < 0.02;

    // Mobile detection: not directly possible with pixel analysis alone
    // In production, use COCO-SSD model for this
    const mobileDetected = false;

    // Sleeping detection: face in lower portion of frame
    const sleepingDetected = false; // Would need head pose estimation

    const confidence = faceDetected ? Math.min(0.95, 0.5 + centerSkinRatio * 2) : 0.3;

    return {
      faceDetected,
      mobileDetected,
      sleepingDetected,
      cameraCovered,
      cameraFrozen,
      personCount,
      lookingAway,
      lowLight,
      confidence,
      timestamp: Date.now(),
    };
  }, []);

  const startDetection = useCallback((videoElement: HTMLVideoElement) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    videoRef.current = videoElement;
    setIsDetecting(true);

    intervalRef.current = setInterval(() => {
      if (videoRef.current && videoRef.current.readyState >= 2) {
        const result = analyzeFrame(videoRef.current);
        setLastResult(result);
        setDetectionHistory(prev => {
          const updated = [...prev, result];
          return updated.slice(-100); // Keep last 100 results
        });
      }
    }, intervalMs);
  }, [analyzeFrame, intervalMs]);

  const stopDetection = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsDetecting(false);
    prevFrameRef.current = null;
    frozenCountRef.current = 0;
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    isModelLoaded,
    isDetecting,
    lastResult,
    startDetection,
    stopDetection,
    detectionHistory,
  };
}
