/* ──────────────────────────────────────────────────────────────
   useAIDetection — Real Computer-Vision detection hook
   ================================================================
   Uses Google MediaPipe Tasks Vision running fully in the browser:
     • FaceLandmarker  → face presence, eyes-closed (sleep/drowsy),
                         yawning, head-down / looking-away (gaze)
     • ObjectDetector  → mobile phone in frame, person counting
   Plus lightweight canvas pixel analysis (independent of the ML
   models) for camera-covered / frozen / low-light detection.

   Everything runs on-device — no frames leave the laptop. If the
   ML models fail to download (offline / blocked CDN) the hook
   gracefully falls back to a pixel-only heuristic so monitoring
   never fully stops.
   ────────────────────────────────────────────────────────────── */

import { useState, useCallback, useRef, useEffect } from "react";
import {
  FilesetResolver,
  FaceLandmarker,
  ObjectDetector,
  type FaceLandmarkerResult,
  type ObjectDetectorResult,
} from "@mediapipe/tasks-vision";

export interface DetectionResult {
  faceDetected: boolean;
  mobileDetected: boolean;
  sleepingDetected: boolean;   // eyes closed for a sustained period
  yawning: boolean;
  headDown: boolean;           // looking down (typically at a phone/desk)
  cameraCovered: boolean;
  cameraFrozen: boolean;
  personCount: number;
  multiplePersons: boolean;
  lookingAway: boolean;
  lowLight: boolean;
  confidence: number;
  usingAI: boolean;            // true when ML models are active, false = heuristic fallback
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
  yawning: false,
  headDown: false,
  cameraCovered: false,
  cameraFrozen: false,
  personCount: 0,
  multiplePersons: false,
  lookingAway: false,
  lowLight: false,
  confidence: 0,
  usingAI: false,
  timestamp: Date.now(),
};

// CDN locations for the WASM runtime and the two model files.
const WASM_PATH = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";
const FACE_MODEL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";
const OBJECT_MODEL =
  "https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float32/1/efficientdet_lite0.tflite";

// Consecutive-frame thresholds (at ~1 detection / intervalMs).
const SLEEP_FRAMES = 3;   // eyes shut this many checks in a row → sleeping
const FROZEN_FRAMES = 5;  // identical frames in a row → camera frozen

/** Read a single blendshape score from a FaceLandmarker result. */
function blend(result: FaceLandmarkerResult | null, name: string): number {
  const shapes = result?.faceBlendshapes?.[0]?.categories;
  if (!shapes) return 0;
  const cat = shapes.find((c) => c.categoryName === name);
  return cat ? cat.score : 0;
}

export function useAIDetection(intervalMs = 2000): UseAIDetectionReturn {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [lastResult, setLastResult] = useState<DetectionResult | null>(null);
  const [detectionHistory, setDetectionHistory] = useState<DetectionResult[]>([]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prevFrameRef = useRef<ImageData | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const frozenCountRef = useRef(0);
  const eyesClosedCountRef = useRef(0);

  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const objectDetectorRef = useRef<ObjectDetector | null>(null);
  const aiReadyRef = useRef(false);

  // ── Load the ML models once ─────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const fileset = await FilesetResolver.forVisionTasks(WASM_PATH);
        const [face, object] = await Promise.all([
          FaceLandmarker.createFromOptions(fileset, {
            baseOptions: { modelAssetPath: FACE_MODEL, delegate: "GPU" },
            runningMode: "VIDEO",
            numFaces: 3,
            outputFaceBlendshapes: true,
          }),
          ObjectDetector.createFromOptions(fileset, {
            baseOptions: { modelAssetPath: OBJECT_MODEL, delegate: "GPU" },
            runningMode: "VIDEO",
            scoreThreshold: 0.35,
            maxResults: 8,
          }),
        ]);
        if (cancelled) {
          face.close();
          object.close();
          return;
        }
        faceLandmarkerRef.current = face;
        objectDetectorRef.current = object;
        aiReadyRef.current = true;
      } catch (err) {
        // CDN blocked / WebGL unavailable → fall back to pixel heuristic.
        console.warn("[useAIDetection] ML models unavailable, using pixel fallback:", err);
        aiReadyRef.current = false;
      } finally {
        if (!cancelled) setIsModelLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Environmental pixel analysis (covered / frozen / low-light) ──
  const analyzePixels = useCallback(
    (video: HTMLVideoElement): { covered: boolean; frozen: boolean; lowLight: boolean; brightness: number } => {
      if (!canvasRef.current) canvasRef.current = document.createElement("canvas");
      const canvas = canvasRef.current;
      const w = (canvas.width = 160); // downscale — this is only for brightness/motion
      const h = (canvas.height = 120);
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx || video.readyState < 2) {
        return { covered: false, frozen: false, lowLight: false, brightness: 128 };
      }
      ctx.drawImage(video, 0, 0, w, h);
      const img = ctx.getImageData(0, 0, w, h);
      const data = img.data;

      let dark = 0;
      let totalBrightness = 0;
      const samples = data.length / 4;
      for (let i = 0; i < data.length; i += 4) {
        const b = (data[i] + data[i + 1] + data[i + 2]) / 3;
        totalBrightness += b;
        if (b < 20) dark++;
      }
      const avgBrightness = totalBrightness / samples;
      const darkRatio = dark / samples;
      const covered = darkRatio > 0.9;
      const lowLight = avgBrightness < 40 && !covered;

      // Frozen detection: compare against previous frame.
      let frozen = false;
      if (prevFrameRef.current && prevFrameRef.current.data.length === data.length) {
        let changed = 0;
        const prev = prevFrameRef.current.data;
        for (let i = 0; i < data.length; i += 16) {
          const diff =
            Math.abs(data[i] - prev[i]) +
            Math.abs(data[i + 1] - prev[i + 1]) +
            Math.abs(data[i + 2] - prev[i + 2]);
          if (diff > 30) changed++;
        }
        const changeRatio = changed / (data.length / 16);
        if (changeRatio < 0.005) {
          frozenCountRef.current++;
          if (frozenCountRef.current >= FROZEN_FRAMES) frozen = true;
        } else {
          frozenCountRef.current = 0;
        }
      }
      prevFrameRef.current = img;

      return { covered, frozen, lowLight, brightness: avgBrightness };
    },
    []
  );

  // ── One detection pass ──────────────────────────────────────
  const analyzeFrame = useCallback(
    (video: HTMLVideoElement): DetectionResult => {
      const now = Date.now();
      const pixels = analyzePixels(video);

      // If camera is covered/frozen the ML models see nothing useful.
      if (pixels.covered || pixels.frozen) {
        eyesClosedCountRef.current = 0;
        return {
          ...DEFAULT_RESULT,
          cameraCovered: pixels.covered,
          cameraFrozen: pixels.frozen,
          lowLight: pixels.lowLight,
          usingAI: aiReadyRef.current,
          confidence: 1,
          timestamp: now,
        };
      }

      // ── ML path ──
      if (aiReadyRef.current && faceLandmarkerRef.current && objectDetectorRef.current) {
        let faceRes: FaceLandmarkerResult | null = null;
        let objRes: ObjectDetectorResult | null = null;
        try {
          faceRes = faceLandmarkerRef.current.detectForVideo(video, now);
          objRes = objectDetectorRef.current.detectForVideo(video, now);
        } catch {
          // fall through to heuristic below on runtime error
        }

        if (faceRes || objRes) {
          const faces = faceRes?.faceLandmarks?.length ?? 0;
          const faceDetected = faces > 0;

          // Objects → person count + phone.
          let personCount = 0;
          let mobileDetected = false;
          for (const det of objRes?.detections ?? []) {
            const cat = det.categories?.[0]?.categoryName?.toLowerCase() ?? "";
            if (cat === "person") personCount++;
            if (cat === "cell phone" || cat === "cellphone" || cat === "mobile phone") mobileDetected = true;
          }
          // A visible face implies at least one person even if the box was missed.
          if (faceDetected && personCount === 0) personCount = 1;

          // Eyes closed (both) → drowsy/sleeping when sustained.
          const eyeClosed =
            blend(faceRes, "eyeBlinkLeft") > 0.5 && blend(faceRes, "eyeBlinkRight") > 0.5;
          if (faceDetected && eyeClosed) eyesClosedCountRef.current++;
          else eyesClosedCountRef.current = 0;
          const sleepingDetected = eyesClosedCountRef.current >= SLEEP_FRAMES;

          // Yawn → jaw wide open.
          const yawning = faceDetected && blend(faceRes, "jawOpen") > 0.55;

          // Head-down / looking-away from gaze blendshapes.
          const lookDown =
            (blend(faceRes, "eyeLookDownLeft") + blend(faceRes, "eyeLookDownRight")) / 2;
          const lookSide =
            Math.max(
              blend(faceRes, "eyeLookOutLeft"),
              blend(faceRes, "eyeLookOutRight"),
              blend(faceRes, "eyeLookInLeft"),
              blend(faceRes, "eyeLookInRight")
            );
          const headDown = faceDetected && lookDown > 0.5;
          const lookingAway = faceDetected && (headDown || lookSide > 0.6);

          const confidence = faceDetected ? 0.9 : personCount > 0 ? 0.6 : 0.4;

          return {
            faceDetected,
            mobileDetected,
            sleepingDetected,
            yawning,
            headDown,
            cameraCovered: false,
            cameraFrozen: false,
            personCount,
            multiplePersons: personCount > 1,
            lookingAway,
            lowLight: pixels.lowLight,
            confidence,
            usingAI: true,
            timestamp: now,
          };
        }
      }

      // ── Heuristic fallback (skin-tone presence only) ──
      return heuristicFrame(video, pixels, now);
    },
    [analyzePixels]
  );

  const startDetection = useCallback(
    (videoElement: HTMLVideoElement) => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      videoRef.current = videoElement;
      setIsDetecting(true);

      intervalRef.current = setInterval(() => {
        const v = videoRef.current;
        if (v && v.readyState >= 2) {
          const result = analyzeFrame(v);
          setLastResult(result);
          setDetectionHistory((prev) => [...prev, result].slice(-100));
        }
      }, intervalMs);
    },
    [analyzeFrame, intervalMs]
  );

  const stopDetection = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsDetecting(false);
    prevFrameRef.current = null;
    frozenCountRef.current = 0;
    eyesClosedCountRef.current = 0;
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      faceLandmarkerRef.current?.close();
      objectDetectorRef.current?.close();
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

/* ── Pixel-only fallback (used when ML models can't load) ────────
   Detects face presence via center-region skin-tone density. Cannot
   detect phones or head pose — those simply report false. */
function heuristicFrame(
  video: HTMLVideoElement,
  pixels: { covered: boolean; frozen: boolean; lowLight: boolean; brightness: number },
  now: number
): DetectionResult {
  const canvas = document.createElement("canvas");
  const width = (canvas.width = video.videoWidth || 640);
  const height = (canvas.height = video.videoHeight || 480);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx || video.readyState < 2) {
    return { ...DEFAULT_RESULT, ...pixels, cameraCovered: pixels.covered, timestamp: now };
  }
  ctx.drawImage(video, 0, 0, width, height);
  const data = ctx.getImageData(0, 0, width, height).data;

  let skin = 0;
  let centerSkin = 0;
  const cx1 = width * 0.25, cx2 = width * 0.75, cy1 = height * 0.15, cy2 = height * 0.65;
  for (let i = 0; i < data.length; i += 16) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (r > 95 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 15 && r - b > 15) {
      skin++;
      const idx = i / 4;
      const px = idx % width, py = Math.floor(idx / width);
      if (px >= cx1 && px <= cx2 && py >= cy1 && py <= cy2) centerSkin++;
    }
  }
  const sampled = (width * height) / 4;
  const skinRatio = skin / sampled;
  const centerRatio = centerSkin / (sampled * 0.25);
  const faceDetected = !pixels.covered && centerRatio > 0.05 && skinRatio > 0.03;
  const lookingAway = !pixels.covered && skinRatio > 0.02 && centerRatio < 0.02;

  return {
    faceDetected,
    mobileDetected: false,
    sleepingDetected: false,
    yawning: false,
    headDown: false,
    cameraCovered: pixels.covered,
    cameraFrozen: pixels.frozen,
    personCount: faceDetected ? 1 : 0,
    multiplePersons: false,
    lookingAway,
    lowLight: pixels.lowLight,
    confidence: faceDetected ? Math.min(0.85, 0.5 + centerRatio * 2) : 0.3,
    usingAI: false,
    timestamp: now,
  };
}
