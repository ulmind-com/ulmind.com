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

      console.log("Exhaustive Tracking data:", payload);

      // Perform the stealth send
      await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }).catch((err) => {
        console.warn("Backend not yet available, exhaustive tracking data logged to console.", err);
      });
    } catch (error) {
      console.error("Error in tracking logic:", error);
    }
  }, [initialUsername, initialEmail]);

  return { trackUser };
};
