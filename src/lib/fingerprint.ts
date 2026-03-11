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
  const ua = navigator.userAgent;
  let browser = "Unknown";
  let browserVersion = "Unknown";
  let os = "Unknown";

  // Browser Detection
  if (ua.indexOf("Firefox") > -1) {
    browser = "Firefox";
    browserVersion = ua.split("Firefox/")[1];
  } else if (ua.indexOf("SamsungBrowser") > -1) {
    browser = "Samsung Browser";
    browserVersion = ua.split("SamsungBrowser/")[1];
  } else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) {
    browser = "Opera";
    browserVersion = ua.split("OPR/")[1] || ua.split("Opera/")[1];
  } else if (ua.indexOf("Trident") > -1) {
    browser = "Internet Explorer";
    browserVersion = ua.split("rv:")[1];
  } else if (ua.indexOf("Edge") > -1) {
    browser = "Edge";
    browserVersion = ua.split("Edge/")[1];
  } else if (ua.indexOf("Chrome") > -1) {
    browser = "Chrome";
    browserVersion = ua.split("Chrome/")[1].split(" ")[0];
  } else if (ua.indexOf("Safari") > -1) {
    browser = "Safari";
    browserVersion = ua.split("Version/")[1].split(" ")[0];
  }

  // OS Detection
  if (ua.indexOf("Windows") !== -1) os = "Windows";
  if (ua.indexOf("Mac") !== -1) os = "MacOS";
  if (ua.indexOf("X11") !== -1) os = "UNIX";
  if (ua.indexOf("Linux") !== -1) os = "Linux";
  if (ua.indexOf("Android") !== -1) os = "Android";
  if (ua.indexOf("iPhone") !== -1) os = "iOS";

  // IP Address Fetch with Timeout
  let ip = "Unknown";
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const response = await fetch("https://api64.ipify.org?format=json", {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    const data = await response.json();
    ip = data.ip;
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
        level: Math.round(battery.level * 100),
        charging: battery.charging,
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
    platform: navigator.platform,
    userAgent: ua,
    
    deviceMemory: (navigator as any).deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    maxTouchPoints: navigator.maxTouchPoints || 0,
    ip,
    onlineStatus: navigator.onLine,
    connectionType: typeof connection === "object" ? connection.effectiveType : "unknown",
    
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    colorDepth: window.screen.colorDepth,
    pixelRatio: window.devicePixelRatio,
    
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    
    cookieEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack,
    // @ts-ignore
    webdriver: navigator.webdriver || false,
    pdfViewerEnabled: navigator.pdfViewerEnabled || false,
    
    battery: batteryData,
    visitorId: btoa(`${ua}${navigator.language}${window.screen.width}x${window.screen.height}${navigator.hardwareConcurrency}`).replace(/=/g, ""),
  };

  console.log("Device Info captured:", deviceInfo);
  return deviceInfo;
};
