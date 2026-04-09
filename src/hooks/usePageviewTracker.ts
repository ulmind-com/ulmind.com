/* ──────────────────────────────────────────────────────────────
   ULMiND — Page View Tracking Hook
   Fires on every page navigation to record visits + time spent.
   
   Calls POST /api/v1/analytics/pageview TWICE per page:
     1. On page LOAD  → time_spent = 0
     2. On page UNLOAD → time_spent = actual seconds (upserts)
   ────────────────────────────────────────────────────────────── */

import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";

const ANALYTICS_URL = "https://ulmind-backend.onrender.com/api/v1/analytics/pageview";

// Generate a session ID that persists for this browser tab
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem("ulmind_session_id");
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    sessionStorage.setItem("ulmind_session_id", sessionId);
  }
  return sessionId;
};

interface PageviewPayload {
  page: string;
  session_id: string;
  time_spent: number;
  referrer: string;
  username: string;
  timestamp: string;
}

const sendPageview = async (payload: PageviewPayload): Promise<void> => {
  try {
    await fetch(ANALYTICS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      mode: "cors",
      credentials: "omit",
      // Use keepalive for unload events so the browser doesn't cancel the request
      keepalive: true,
    });
  } catch {
    // Silently fail — analytics should never break the user experience
  }
};

export const usePageviewTracker = () => {
  const location = useLocation();
  const pageLoadTime = useRef<number>(Date.now());
  const currentPage = useRef<string>(location.pathname);

  // Send unload event for the current page (records actual time spent)
  const sendUnload = useCallback(() => {
    const timeSpent = Math.round((Date.now() - pageLoadTime.current) / 1000);
    const payload: PageviewPayload = {
      page: currentPage.current,
      session_id: getSessionId(),
      time_spent: timeSpent,
      referrer: document.referrer || "",
      username: "Guest",
      timestamp: new Date().toISOString(),
    };
    sendPageview(payload);
  }, []);

  useEffect(() => {
    // Skip admin pages — we don't want admin visits in our analytics
    if (location.pathname.startsWith("/admin")) return;

    // If the page changed, send unload for the PREVIOUS page first
    if (currentPage.current !== location.pathname && currentPage.current !== location.pathname) {
      sendUnload();
    }

    // Record the new page
    currentPage.current = location.pathname;
    pageLoadTime.current = Date.now();

    // Send page LOAD event (time_spent = 0)
    const loadPayload: PageviewPayload = {
      page: location.pathname,
      session_id: getSessionId(),
      time_spent: 0,
      referrer: document.referrer || "",
      username: "Guest",
      timestamp: new Date().toISOString(),
    };
    sendPageview(loadPayload);

    // On page unload (tab close / browser close), send actual time spent
    const handleBeforeUnload = () => {
      sendUnload();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [location.pathname, sendUnload]);
};
