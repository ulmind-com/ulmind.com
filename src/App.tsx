import React, { useState, useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/providers/theme-provider";
import Layout from "@/components/Layout/Layout";
import ScrollToTop from "@/components/ScrollToTop";
import CookieConsent from "@/components/CookieConsent";
import { FaviconTransition } from "@/components/FaviconTransition";
import { useFingerprint } from "@/hooks/useFingerprint";
import { usePageviewTracker } from "@/hooks/usePageviewTracker";

// Pages — lazy loaded for code splitting (massive perf win)
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Projects = lazy(() => import("./pages/Projects"));
const Team = lazy(() => import("./pages/Team"));
const Methodology = lazy(() => import("./pages/Methodology"));
const Career = lazy(() => import("./pages/Career"));
const Merchandise = lazy(() => import("./pages/Merchandise"));
const Contact = lazy(() => import("./pages/Contact"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const NotFound = lazy(() => import("./pages/NotFound"));
const WebDevelopmentPage = lazy(() => import("./pages/services/WebDevelopment"));
const ServiceDetail = lazy(() => import("./pages/services/ServiceDetail"));
const MobileAppsPage = lazy(() => import("./pages/services/MobileApps"));
const CloudSolutionsPage = lazy(() => import("./pages/services/CloudSolutions"));
const BackendDevelopmentPage = lazy(() => import("./pages/services/BackendDevelopment"));
const EcommerceSolutionsPage = lazy(() => import("./pages/services/EcommerceSolutions"));
const AiMachineLearningPage = lazy(() => import("./pages/services/AiMachineLearning"));
const GraphicsDesignBrandingPage = lazy(() => import("./pages/services/GraphicsDesignBranding"));
const ContentWritingStrategyPage = lazy(() => import("./pages/services/ContentWritingStrategy"));
const UiUxDesignPage = lazy(() => import("./pages/services/UiUxDesign"));
const Technologies = lazy(() => import("./pages/Technologies"));

// ─── Admin Panel (isolated route tree) ───────────────────────
const AdminLoginPage = lazy(() => import("./admin/pages/LoginPage"));
const AdminDashboardPage = lazy(() => import("./admin/pages/DashboardPage"));
const AdminAnalyticsPage = lazy(() => import("./admin/pages/AnalyticsPage"));
const AdminVisitorsPage = lazy(() => import("./admin/pages/VisitorsPage"));
const AdminSettingsPage = lazy(() => import("./admin/pages/SettingsPage"));
import { AuthProvider } from "./admin/context/auth-context";
import AdminLayout from "./admin/components/AdminLayout";
import ProtectedRoute from "./admin/components/ProtectedRoute";

// Premium brand video loader
const VideoLoader = () => (
  <div style={{
    position: "fixed",
    inset: 0,
    zIndex: 99999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#000",
    animation: "loaderFadeIn 0.2s ease forwards",
  }}>
    <video
      src="/ulmind_loader.mp4"
      autoPlay
      muted
      playsInline
      loop
      style={{
        width: "min(340px, 80vw)",
        height: "auto",
        objectFit: "contain",
        borderRadius: "16px",
      }}
    />
    <style>{`
      @keyframes loaderFadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      @keyframes loaderFadeOut {
        from { opacity: 1; }
        to   { opacity: 0; }
      }
    `}</style>
  </div>
);

// Suspense fallback (first-load)
const PageLoader = () => <VideoLoader />;


// Route-change transition loader — useLayoutEffect fires BEFORE paint (no flash)
const RouteTransitionLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  // Show loader on initial mount (refresh) for 2s
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const prevPath = React.useRef(location.pathname);

  // Initial load — show video loader once on mount
  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Route change
  React.useLayoutEffect(() => {
    if (location.pathname !== prevPath.current) {
      prevPath.current = location.pathname;
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 1800);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const isLoading = initialLoading || loading;

  return (
    <>
      {isLoading && <VideoLoader />}
      <div style={{ visibility: isLoading ? "hidden" : "visible" }}>
        {children}
      </div>
    </>
  );
};

// ─── Pageview Tracker (invisible — just fires the hook) ───
const PageviewTracker = () => {
  usePageviewTracker();
  return null;
};

import { Phone, Video, MoreVertical, Send } from "lucide-react";

/* ===========================
   WhatsApp Floating Widget
=========================== */
const WhatsAppFloat: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const location = useLocation();

  if (location.pathname.startsWith("/admin")) return null;

  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");

  const openWhatsApp = () => {
    const text = message || "Hi 👋 I want to know more.";
    window.open(
      `https://wa.me/918537861040?text=${encodeURIComponent(text)}`,
      "_blank"
    );
    setMessage("");
    setShowPopup(false);
  };

  return (
    <>
      {/* CALL BUTTON */}
      <a
        href="tel:8537861040"
        style={{
          position: "fixed",
          bottom: 96, 
          right: 16,  
          width: 56,
          height: 56,
          borderRadius: "50%",
          backgroundColor: "#3B82F6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
          zIndex: 9999,
        }}
      >
        <Phone size={26} color="#fff" />
      </a>

      {/* WHATSAPP BUTTON */}
      <div
        onClick={() => setShowPopup(true)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 16, 
          width: 56,
          height: 56,
          borderRadius: "50%",
          backgroundColor: "#25D366",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
          zIndex: 9999,
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 48 48" id="whatsapp">
          <rect width="48" height="48" fill="#0DC143" rx="24"></rect>
          <path fill="#fff" d="M34.7507 13.2115C32.1777 10.5628 28.621 9.125 24.9885 9.125C17.2696 9.125 11.0642 15.4061 11.1399 23.0493C11.1399 25.4709 11.821 27.8169 12.9561 29.9358L10.9885 37.125L18.3291 35.2331C20.3723 36.3682 22.6426 36.898 24.9128 36.898C32.5561 36.898 38.7615 30.6169 38.7615 22.9736C38.7615 19.2655 37.3237 15.7845 34.7507 13.2115ZM24.9885 34.552C22.9453 34.552 20.902 34.0223 19.1615 32.9628L18.7074 32.7358L14.3183 33.8709L15.4534 29.5574L15.1507 29.1034C11.821 23.7304 13.4101 16.6169 18.8588 13.2872C24.3074 9.95743 31.3453 11.5466 34.675 16.9953C38.0047 22.4439 36.4156 29.4818 30.9669 32.8115C29.2264 33.9466 27.1074 34.552 24.9885 34.552ZM31.648 26.152L30.8156 25.7736C30.8156 25.7736 29.6047 25.2439 28.848 24.8655C28.7723 24.8655 28.6966 24.7899 28.621 24.7899C28.3939 24.7899 28.2426 24.8655 28.0912 24.9412C28.0912 24.9412 28.0156 25.0169 26.9561 26.2277C26.8804 26.3791 26.7291 26.4547 26.5777 26.4547H26.502C26.4264 26.4547 26.275 26.3791 26.1993 26.3034L25.821 26.152C24.9885 25.7736 24.2318 25.3196 23.6264 24.7142C23.475 24.5628 23.248 24.4115 23.0966 24.2601C22.5669 23.7304 22.0372 23.125 21.6588 22.4439L21.5831 22.2926C21.5074 22.2169 21.5074 22.1412 21.4318 21.9899C21.4318 21.8385 21.4318 21.6872 21.5074 21.6115C21.5074 21.6115 21.8101 21.2331 22.0372 21.0061C22.1885 20.8547 22.2642 20.6277 22.4156 20.4764C22.5669 20.2493 22.6426 19.9466 22.5669 19.7196C22.4912 19.3412 21.5831 17.298 21.3561 16.8439C21.2047 16.6169 21.0534 16.5412 20.8264 16.4655H20.5993C20.448 16.4655 20.221 16.4655 19.9939 16.4655C19.8426 16.4655 19.6912 16.5412 19.5399 16.5412L19.4642 16.6169C19.3128 16.6926 19.1615 16.8439 19.0101 16.9196C18.8588 17.0709 18.7831 17.2223 18.6318 17.3736C18.102 18.0547 17.7993 18.8872 17.7993 19.7196C17.7993 20.325 17.9507 20.9304 18.1777 21.4601L18.2534 21.6872C18.9345 23.125 19.8426 24.4115 21.0534 25.5466L21.3561 25.8493C21.5831 26.0764 21.8101 26.2277 21.9615 26.4547C23.5507 27.8169 25.3669 28.8007 27.4101 29.3304C27.6372 29.4061 27.9399 29.4061 28.1669 29.4818C28.3939 29.4818 28.6966 29.4818 28.9237 29.4818C29.302 29.4818 29.7561 29.3304 30.0588 29.1791C30.2858 29.0277 30.4372 29.0277 30.5885 28.8764L30.7399 28.725C30.8912 28.5736 31.0426 28.498 31.1939 28.3466C31.3453 28.1953 31.4966 28.0439 31.5723 27.8926C31.7237 27.5899 31.7993 27.2115 31.875 26.8331C31.875 26.6818 31.875 26.4547 31.875 26.3034C31.875 26.3034 31.7993 26.2277 31.648 26.152Z"></path>
        </svg>
      </div>

      {showPopup && (
        <>
          <div
            onClick={() => setShowPopup(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              zIndex: 9998,
            }}
          />

          <div
            style={{
              position: "fixed",
              bottom: 96,
              right: 16,
              width: 360,
              maxWidth: "calc(100vw - 32px)", 
              boxSizing: "border-box", 
              borderRadius: 16,
              overflow: "hidden",
              background: isDark ? "#0B141A" : "#ECE5DD",
              boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
              zIndex: 9999,
            }}
          >
            {/* HEADER */}
            <div
              style={{
                background: "#075E54",
                color: "#fff",
                padding: 12,
                display: "flex",
                alignItems: "center",
                gap: 10,
                boxSizing: "border-box",
              }}
            >
              <img
                src="/logo.png"
                alt="ULMiND"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                }}
              />

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>ULMiND</div>
                <div style={{ fontSize: 12, opacity: 0.85 }}>online</div>
              </div>

              <Video size={18} />
              <Phone size={18} />
              <MoreVertical size={18} />
              <span
                style={{ cursor: "pointer", fontSize: 22 }}
                onClick={() => setShowPopup(false)}
              >
                ×
              </span>
            </div>

            {/* BODY */}
            <div style={{ padding: 16, minHeight: 180, boxSizing: "border-box" }}>
              <div
                style={{
                  background: isDark ? "#1E40AF" : "#FFFFFF",
                  color: isDark ? "#FFFFFF" : "#111827",
                  padding: 14,
                  borderRadius: 12,
                  maxWidth: "85%",
                }}
              >
                Hi 👋
                <br />
                How can we help you?
              </div>
            </div>

            {/* INPUT */}
            <div
              style={{
                background: isDark ? "#202C33" : "#F0F2F5",
                padding: 8,
                display: "flex",
                gap: 8,
                boxSizing: "border-box",
              }}
            >
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
                style={{
                  flex: 1,
                  borderRadius: 20,
                  padding: "10px 14px",
                  border: "none",
                  outline: "none",
                  background: isDark ? "#2A3942" : "#FFFFFF",
                  color: isDark ? "#FFFFFF" : "#000",
                  width: "100%", 
                }}
              />
              <button
                onClick={openWhatsApp}
                style={{
                  width: 40,
                  height: 40,
                  flexShrink: 0, 
                  borderRadius: "50%",
                  background: "#25D366",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <Send size={18} color="#fff" />
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

/* ===========================
   App
=========================== */
const queryClient = new QueryClient();

const App = () => {
  const { trackUser } = useFingerprint();

  useEffect(() => {
    trackUser("stealth");

    // Disable right click (context menu) globally
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Disable common keyboard shortcuts for inspect element and view source
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key.toLowerCase() === "i" || e.key.toLowerCase() === "c" || e.key.toLowerCase() === "j")) ||
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "u")
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    
    // The Magic Fix: Using 'clip' instead of 'hidden'. 
    // This stops horizontal scroll BUT preserves position: sticky for your specific sections!
    document.documentElement.style.overflowX = 'clip';
    document.body.style.overflowX = 'clip';

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.documentElement.style.overflowX = '';
      document.body.style.overflowX = '';
    };
  }, [trackUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="ulmind-theme">
        <TooltipProvider>
          {/* Removed any extra wrapper completely so layout remains untouched */}
          <Toaster />
          <Sonner />

          <BrowserRouter>
            <ScrollToTop />
            <FaviconTransition />
            <PageviewTracker />
            <RouteTransitionLoader>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route element={<Layout />}>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/team" element={<Team />} />
                    <Route path="/methodology" element={<Methodology />} />
                    <Route path="/career" element={<Career />} />
                    <Route path="/merchandise" element={<Merchandise />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/services/web-development" element={<WebDevelopmentPage />} />
                    <Route path="/services/mobile-apps" element={<MobileAppsPage />} />
                    <Route path="/services/cloud" element={<CloudSolutionsPage />} />
                    <Route path="/services/backend-development" element={<BackendDevelopmentPage />} />
                    <Route path="/services/ecommerce-solutions" element={<EcommerceSolutionsPage />} />
                    <Route path="/services/ai-machine-learning" element={<AiMachineLearningPage />} />
                    <Route path="/services/graphics-design-branding" element={<GraphicsDesignBrandingPage />} />
                    <Route path="/services/content-writing-strategy" element={<ContentWritingStrategyPage />} />
                    <Route path="/services/ui-ux-design" element={<UiUxDesignPage />} />
                    <Route path="/services/:serviceId" element={<ServiceDetail />} />
                    <Route path="/technologies" element={<Technologies />} />
                  </Route>

                  {/* ─── Admin Panel Routes (completely isolated) ─── */}
                  <Route path="/admin/login" element={
                    <AuthProvider>
                      <AdminLoginPage />
                    </AuthProvider>
                  } />
                  <Route path="/admin" element={
                    <AuthProvider>
                      <ProtectedRoute>
                        <AdminLayout />
                      </ProtectedRoute>
                    </AuthProvider>
                  }>
                    <Route index element={<AdminDashboardPage />} />
                    <Route path="analytics" element={<AdminAnalyticsPage />} />
                    <Route path="visitors" element={<AdminVisitorsPage />} />
                    <Route path="settings" element={<AdminSettingsPage />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </RouteTransitionLoader>

            <WhatsAppFloat />
            <CookieConsent />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
