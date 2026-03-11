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

    // IP Address Fetch with Timeout
    let ip = "Unknown";
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // Shorter 3s timeout

      const response = await fetch("https://api64.ipify.org?format=json", {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const data = await response.json();
      ip = data?.ip || "Unknown";
    } catch (error) {
      console.warn("IP fetch failed or timed out:", error);
    }

    // Battery Info (Experimental)
    let batteryData;
    try {
      // @ts-ignore - battery API is experimental
      if (typeof navigator.getBattery === "function") {
        // @ts-ignore
        const battery = await navigator.getBattery();
        batteryData = {
          level: Math.round((battery.level || 0) * 100),
          charging: !!battery.charging,
        };
      }
    } catch (e) {
      console.warn("Battery API not supported/allowed");
    }

    // Network Connection (Experimental)
    // @ts-ignore
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    const deviceInfo: DeviceInfo = {
      browser,
      browserVersion,
      os,
      osVersion: "Parsed via UA",
      platform: navigator.platform || "Unknown",
      userAgent: ua,
      
      deviceMemory: (navigator as any).deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency || 0,
      maxTouchPoints: navigator.maxTouchPoints || 0,
      ip,
      onlineStatus: navigator.onLine !== false,
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
      deviceInfo.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown";
    } catch (e) {}

    // Safe Visitor ID generation
    try {
      const idSource = `${ua}${deviceInfo.language}${deviceInfo.screenResolution}${deviceInfo.hardwareConcurrency}`;
      // Use hex encoding for better cross-platform safety than btoa
      let hash = 0;
      for (let i = 0; i < idSource.length; i++) {
        const char = idSource.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      deviceInfo.visitorId = Math.abs(hash).toString(16);
    } catch (e) {
      deviceInfo.visitorId = `fallback-${Date.now()}`;
    }

    console.log("Device Info captured (Safe Mode):", deviceInfo);
    return deviceInfo;
  } catch (globalError) {
    console.error("Critical error in getDeviceInfo:", globalError);
    // Ultimate fallback
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
