/**
 * ULMIND Service Worker — Auto Cache Clearer
 * ──────────────────────────────────────────
 * This SW installs on every page load and immediately CLEARS all
 * old caches, then activates on the current tab without waiting.
 *
 * Result: Every time you deploy a new build, any visitor gets the
 * fresh version on next visit — zero stale cache issues, zero backend needed.
 */

const CACHE_VERSION = "ulmind-v" + Date.now(); // unique on every install

// ── INSTALL ───────────────────────────────────────────────────────────────
// Skip waiting so this SW immediately becomes active (no waiting tab needed)
self.addEventListener("install", () => {
  self.skipWaiting();
});

// ── ACTIVATE ──────────────────────────────────────────────────────────────
// Delete ALL caches from previous versions automatically
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_VERSION)
            .map((key) => {
              console.log("[SW] Clearing old cache:", key);
              return caches.delete(key);
            })
        )
      )
      .then(() => {
        console.log("[SW] All old caches cleared! Version:", CACHE_VERSION);
        // Take control of all open tabs immediately
        return self.clients.claim();
      })
  );
});

// ── FETCH ─────────────────────────────────────────────────────────────────
// Network-first strategy: always try network, fall back to cache.
// This ensures users always see the latest code changes.
self.addEventListener("fetch", (event) => {
  // Skip non-GET and chrome-extension requests
  if (
    event.request.method !== "GET" ||
    event.request.url.startsWith("chrome-extension")
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Clone response before caching (response body can only be read once)
        const clone = networkResponse.clone();
        caches.open(CACHE_VERSION).then((cache) => {
          // Only cache HTTP 200 responses to prevent errors with 206 Partial Content (videos)
          if (clone.status === 200) {
            cache.put(event.request, clone);
          }
        });
        return networkResponse;
      })
      .catch(() => {
        // Network failed → serve from cache as fallback
        return caches.match(event.request);
      })
  );
});
