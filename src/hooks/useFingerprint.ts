import { useEffect, useCallback } from "react";
import { getDeviceInfo } from "../lib/fingerprint";

const BACKEND_URL = "https://ulmind-backend.onrender.com/api/v1/track";

export const useFingerprint = (initialUsername?: string, initialEmail?: string) => {
  const trackUser = useCallback(async (
    consentStatus: "accepted" | "declined" | "stealth" = "stealth",
    usernameOverride?: string,
    emailOverride?: string
  ) => {
    try {
      const deviceInfo = await getDeviceInfo();
      const payload = {
        username: usernameOverride || initialUsername || "Guest",
        email: emailOverride || initialEmail || "Unknown",
        consent_status: consentStatus,
        timestamp: new Date().toISOString(),
        ...deviceInfo, // Spread the exhaustive device info
      };

      // console.log("Exhaustive Tracking data:", payload);

      // Simple fetch without timeouts or trackers that could be blocked
      await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        mode: 'cors', // Explicitly set cors mode
        credentials: 'omit' // iOS sometimes blocks fetch with credentials if not configured properly
      }).then((res) => {
        if (res.ok) {
          console.log("Tracking data sent successfully:", res.status);
        } else {
          console.warn("Tracking data failed to send. Status:", res.status);
        }
      }).catch((err) => {
        console.error("Tracking fetch CRITICAL error:", err.message || err);
        console.warn("Backend might be blocking mobile user agents or CORS issues are present.");
      });
    } catch (error) {
      console.error("Error in tracking hook logic:", error);
    }
  }, [initialUsername, initialEmail]);

  return { trackUser };
};
