/* ──────────────────────────────────────────────────────────────
   ULMiND Admin — Global Action FX bridge
   Lets the (non-React) API layer trigger the AdminActionProvider's
   Lottie overlay. The provider registers its trigger on mount and
   installs a global fetch interceptor so that EVERY successful
   mutation anywhere in the admin panel — no matter which API client
   or raw fetch made it — pops the premium overlay.
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

/** Endpoints that should NOT pop the overlay (auth, uploads, telemetry, chat).
 *  "/hw/monitor" covers ALL hardware-monitoring writes — detection events,
 *  heartbeats, camera/internet status. These fire automatically every few
 *  seconds from the camera loop, so they must autosave silently instead of
 *  flashing the "Saved Successfully" overlay each time. */
const EXCLUDE = ["/auth", "/login", "/logout", "/refresh", "/otp", "/forgot", "/reset", "/upload", "/track", "/page-analytics", "/visitors", "/hw/monitor", "/heartbeat", "/presence", "/chat", "/stream"];

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

/* ──────────────────────────────────────────────────────────────
   Global fetch interceptor
   Patches window.fetch while the admin panel is mounted so that any
   mutating request to the backend fires the overlay — this catches
   pages that use raw fetch() (e.g. the spreadsheet grid) or any API
   client, not just the central authFetch wrapper.
   ────────────────────────────────────────────────────────────── */

let originalFetch: typeof window.fetch | null = null;

/** True for requests that hit the ULMiND backend API. */
const isApiUrl = (url: string) =>
  url.includes("/api/v1") || url.includes("ulmind-backend.onrender.com");

export const installFetchFx = () => {
  if (typeof window === "undefined" || originalFetch) return;
  originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const res = await originalFetch!(input as RequestInfo, init);
    try {
      const url =
        typeof input === "string" ? input :
        input instanceof URL ? input.toString() :
        (input as Request).url;
      const method =
        (init?.method as string) ||
        (typeof input !== "string" && !(input instanceof URL) ? (input as Request).method : undefined) ||
        "GET";
      if (res.ok && isApiUrl(url)) {
        const fx = fxForRequest(method, url);
        if (fx) fireActionFx(fx);
      }
    } catch {
      /* never let FX detection break a real request */
    }
    return res;
  };
};

export const uninstallFetchFx = () => {
  if (originalFetch) {
    window.fetch = originalFetch;
    originalFetch = null;
  }
};
