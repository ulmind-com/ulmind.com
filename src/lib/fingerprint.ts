export interface DeviceInfo {
  visitorId: string;
  // Basic Info
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  platform: string;
  userAgent: string;
  
  // Hardware & Network
  deviceMemory?: number; // RAM in GB
  hardwareConcurrency: number; // CPU Cores
  maxTouchPoints: number;
  ip?: string;
  onlineStatus: boolean;
  connectionType?: string;
  
  // Display
  screenResolution: string;
  colorDepth: number;
  pixelRatio: number;
  
  // Localization
  timezone: string;
  language: string;
  
  // Privacy & Capabilities
  cookieEnabled: boolean;
  doNotTrack: string | null;
  webdriver: boolean;
  pdfViewerEnabled: boolean;
  
  // Battery (Async)
  battery?: {
    level: number;
    charging: boolean;
  };
  
  // App context
  email?: string;
}

export const getDeviceInfo = async (): Promise<DeviceInfo> => {
  try {
    const ua = navigator.userAgent || "Unknown UA";
    let browser = "Unknown";
    let browserVersion = "Unknown";
    let os = "Unknown";

    // Browser Detection
    try {
      if (ua.indexOf("Firefox") > -1) {
        browser = "Firefox";
        browserVersion = ua.split("Firefox/")[1] || "Unknown";
      } else if (ua.indexOf("SamsungBrowser") > -1) {
        browser = "Samsung Browser";
        browserVersion = ua.split("SamsungBrowser/")[1] || "Unknown";
      } else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) {
        browser = "Opera";
        browserVersion = ua.split("OPR/")[1] || ua.split("Opera/")[1] || "Unknown";
      } else if (ua.indexOf("Trident") > -1) {
        browser = "Internet Explorer";
        browserVersion = ua.split("rv:")[1] || "Unknown";
      } else if (ua.indexOf("Edge") > -1) {
        browser = "Edge";
        browserVersion = ua.split("Edge/")[1] || "Unknown";
      } else if (ua.indexOf("Chrome") > -1) {
        browser = "Chrome";
        browserVersion = (ua.split("Chrome/")[1] || "").split(" ")[0] || "Unknown";
      } else if (ua.indexOf("Safari") > -1) {
        browser = "Safari";
        browserVersion = (ua.split("Version/")[1] || "").split(" ")[0] || "Unknown";
      }
    } catch (e) {
      console.warn("Browser detection failed:", e);
    }

    // OS Detection
    try {
      if (ua.indexOf("Windows") !== -1) os = "Windows";
      else if (ua.indexOf("Mac") !== -1) os = "MacOS";
      else if (ua.indexOf("X11") !== -1) os = "UNIX";
      else if (ua.indexOf("Linux") !== -1) os = "Linux";
      else if (ua.indexOf("Android") !== -1) os = "Android";
      else if (ua.indexOf("iPhone") !== -1) os = "iOS";
    } catch (e) {
      console.warn("OS detection failed:", e);
    }

    // IP Address Fetch (Non-blocking with fast fallback)
    let ip = "Unknown";
    try {
      const fetchWithTimeout = async () => {
        try {
          const response = await fetch("https://api64.ipify.org?format=json");
          const data = await response.json();
          return data?.ip || "Unknown";
        } catch (e) {
          return "Unknown";
        }
      };

      // Wait maximum 2 seconds for IP, otherwise continue
      ip = await Promise.race([
        fetchWithTimeout(),
        new Promise<string>((resolve) => setTimeout(() => resolve("Timed out"), 2000))
      ]);
    } catch (error) {
      console.warn("IP fetch logic error:", error);
    }

    // Battery Info (Extreme Safety for Safari/iOS)
    let batteryData;
    try {
      // @ts-ignore
      const nav = navigator as any;
      if (nav && typeof nav.getBattery === "function") {
        const battery = await nav.getBattery();
        if (battery) {
          batteryData = {
            level: Math.round((battery.level || 0) * 100),
            charging: !!battery.charging,
          };
        }
      }
    } catch (e) {
      // Common to fail on Safari/iOS
    }

    // Network Connection (Extreme Safety)
    const nav = navigator as any;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

    const deviceInfo: DeviceInfo = {
      browser,
      browserVersion,
      os,
      osVersion: "Parsed via UA",
      platform: navigator.platform || "Unknown",
      userAgent: ua,
      
      deviceMemory: nav.deviceMemory,
      hardwareConcurrency: nav.hardwareConcurrency || 0,
      maxTouchPoints: nav.maxTouchPoints || 0,
      ip,
      onlineStatus: nav.onLine !== false,
      connectionType: (connection && typeof connection === "object") ? connection.effectiveType : "unknown",
      
      screenResolution: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
      colorDepth: window.screen?.colorDepth || 0,
      pixelRatio: window.devicePixelRatio || 1,
      
      timezone: "Unknown",
      language: navigator.language || "Unknown",
      
      cookieEnabled: navigator.cookieEnabled !== false,
      doNotTrack: navigator.doNotTrack || null,
      // @ts-ignore
      webdriver: !!navigator.webdriver,
      // @ts-ignore
      pdfViewerEnabled: !!navigator.pdfViewerEnabled,
      
      battery: batteryData,
      visitorId: "Unknown",
    };

    try {
      if (typeof Intl !== "undefined" && Intl.DateTimeFormat) {
        deviceInfo.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown";
      }
    } catch (e) {}

    // Safe Visitor ID generation
    try {
      const idSource = `${ua}${deviceInfo.language}${deviceInfo.screenResolution}${deviceInfo.hardwareConcurrency}`;
      let hash = 0;
      for (let i = 0; i < idSource.length; i++) {
        const char = idSource.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash | 0; // Convert to 32bit integer
      }
      deviceInfo.visitorId = Math.abs(hash).toString(16);
    } catch (e) {
      deviceInfo.visitorId = `fallback-${Date.now()}`;
    }

    console.log("Device Info Captured (Ultra-Safe Mode):", deviceInfo);
    console.table(deviceInfo); // Easier to read in mobile console
    return deviceInfo;
  } catch (globalError) {
    console.error("CRITICAL ERROR in getDeviceInfo:", globalError);
    return {
      visitorId: `critical-fallback-${Date.now()}`,
      browser: "Unknown",
      browserVersion: "Unknown",
      os: "Unknown",
      osVersion: "Unknown",
      platform: "Unknown",
      userAgent: "Unknown",
      onlineStatus: true,
      screenResolution: "0x0",
      colorDepth: 0,
      pixelRatio: 1,
      timezone: "Unknown",
      language: "Unknown",
      cookieEnabled: true,
      doNotTrack: null,
      webdriver: false,
      pdfViewerEnabled: false,
      hardwareConcurrency: 0,
      maxTouchPoints: 0
    };
  }
};
