/* ──────────────────────────────────────────────────────────────
   ULMiND Admin — Global Action FX bridge
   Lets the (non-React) API layer trigger the AdminActionProvider's
   Lottie overlay. The provider registers its trigger on mount; the
   API layer fires it after a successful mutation.
   ────────────────────────────────────────────────────────────── */

export type ActionFxType = "save" | "edit" | "delete";

type Handler = (type: ActionFxType) => void;

let handler: Handler | null = null;
let lastFiredAt = 0;

export const registerActionFx = (fn: Handler | null) => {
  handler = fn;
};

/**
 * Fire the global action animation. Rapid bursts (e.g. a bulk save that
 * issues several requests at once) are collapsed into a single overlay.
 */
export const fireActionFx = (type: ActionFxType) => {
  const now = Date.now();
  if (now - lastFiredAt < 700) return;
  lastFiredAt = now;
  handler?.(type);
};

/** Endpoints that should NOT pop the overlay (auth, uploads, telemetry). */
const EXCLUDE = ["/auth", "/login", "/logout", "/refresh", "/otp", "/forgot", "/reset", "/upload", "/track", "/page-analytics", "/visitors", "/heartbeat", "/presence"];

/** Map an HTTP method to an FX type, or null if it shouldn't fire. */
export const fxForRequest = (method: string, endpoint: string): ActionFxType | null => {
  const m = method.toUpperCase();
  if (m === "GET" || m === "HEAD" || m === "OPTIONS") return null;
  const path = endpoint.toLowerCase();
  if (EXCLUDE.some((frag) => path.includes(frag))) return null;
  if (m === "DELETE") return "delete";
  if (m === "PUT" || m === "PATCH") return "edit";
  if (m === "POST") return "save";
  return null;
};
