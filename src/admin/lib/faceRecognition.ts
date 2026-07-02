/* ──────────────────────────────────────────────────────────────
   Face Recognition — Anti-cheat biometric helper (client-side)
   ----------------------------------------------------------------
   Wraps @vladmandic/face-api. Lazily loads the model weights the
   first time it's needed so the main bundle stays light.

     • computeFaceDescriptor()  → 128-d embedding for enroll / login
     • runBlinkLiveness()       → proves a live person (not a photo)

   The 128-d descriptor is what the backend compares (server-side)
   against the enrolled reference, so a stolen QR badge alone can't
   unlock someone else's account.
   ────────────────────────────────────────────────────────────── */

// face-api is heavy (TF.js) — keep it out of the main chunk.
type FaceApi = typeof import("@vladmandic/face-api");

// Model weights are served from a CDN so nothing needs to be bundled.
const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model";

let faceapiPromise: Promise<FaceApi> | null = null;
let modelsLoaded = false;

/** Load the face-api module + weights exactly once. */
export async function loadFaceModels(): Promise<FaceApi> {
  if (!faceapiPromise) {
    faceapiPromise = import("@vladmandic/face-api");
  }
  const faceapi = await faceapiPromise;
  if (!modelsLoaded) {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);
    modelsLoaded = true;
  }
  return faceapi;
}

export function faceModelsReady(): boolean {
  return modelsLoaded;
}

const detectorOptions = (faceapi: FaceApi) =>
  new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 });

type VideoLike = HTMLVideoElement | HTMLCanvasElement | HTMLImageElement;

/**
 * Compute a 128-d face descriptor for the single most prominent face
 * in the frame. Returns null if no clear single face is detected.
 */
export async function computeFaceDescriptor(
  input: VideoLike,
): Promise<number[] | null> {
  const faceapi = await loadFaceModels();
  const detection = await faceapi
    .detectSingleFace(input as any, detectorOptions(faceapi))
    .withFaceLandmarks()
    .withFaceDescriptor();
  if (!detection) return null;
  return Array.from(detection.descriptor);
}

/** Eye Aspect Ratio for one eye given its 6 landmark points. */
function eyeAspectRatio(eye: { x: number; y: number }[]): number {
  const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    Math.hypot(a.x - b.x, a.y - b.y);
  const vertical = dist(eye[1], eye[5]) + dist(eye[2], eye[4]);
  const horizontal = 2 * dist(eye[0], eye[3]);
  return horizontal === 0 ? 0 : vertical / horizontal;
}

export interface LivenessResult {
  passed: boolean;
  blinked: boolean;
  reason: string;
  /** Descriptor captured on a good open-eye frame — reused for the match. */
  descriptor: number[] | null;
}

/**
 * Blink-based liveness check. Watches the eyes for up to `timeoutMs`
 * and passes once it sees the eyes close (EAR dips) and re-open — a
 * blink a static photo cannot fake. Also returns a descriptor grabbed
 * on an eyes-open frame so we don't have to detect twice.
 */
export async function runBlinkLiveness(
  video: HTMLVideoElement,
  opts: {
    timeoutMs?: number;
    closedThreshold?: number;
    openThreshold?: number;
    onProgress?: (state: "waiting" | "eyes_closed" | "blinked") => void;
  } = {},
): Promise<LivenessResult> {
  const timeoutMs = opts.timeoutMs ?? 6000;
  const closedThreshold = opts.closedThreshold ?? 0.20;
  const openThreshold = opts.openThreshold ?? 0.28;
  const faceapi = await loadFaceModels();

  const start = Date.now();
  let sawClosed = false;
  let bestDescriptor: number[] | null = null;

  while (Date.now() - start < timeoutMs) {
    const detection = await faceapi
      .detectSingleFace(video as any, detectorOptions(faceapi))
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detection) {
      const lm = detection.landmarks;
      const ear =
        (eyeAspectRatio(lm.getLeftEye()) + eyeAspectRatio(lm.getRightEye())) / 2;

      // Keep a descriptor from a clean, eyes-open frame.
      if (ear >= openThreshold) bestDescriptor = Array.from(detection.descriptor);

      if (!sawClosed && ear < closedThreshold) {
        sawClosed = true;
        opts.onProgress?.("eyes_closed");
      } else if (sawClosed && ear >= openThreshold) {
        opts.onProgress?.("blinked");
        return {
          passed: true,
          blinked: true,
          reason: "Blink detected",
          descriptor: bestDescriptor ?? Array.from(detection.descriptor),
        };
      } else {
        opts.onProgress?.("waiting");
      }
    }
    // Yield to the event loop; face-api detection is already async/costly.
    await new Promise((r) => setTimeout(r, 60));
  }

  return {
    passed: false,
    blinked: sawClosed,
    reason: sawClosed
      ? "Eyes never re-opened — try again"
      : "No blink detected — please blink at the camera",
    descriptor: bestDescriptor,
  };
}
