import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/providers/theme-provider";
import Index from "./pages/Index";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Team from "./pages/Team";
import Methodology from "./pages/Methodology";
import Career from "./pages/Career";
import NotFound from "./pages/NotFound";

// WhatsApp Floating Widget
const WhatsAppFloat: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const openWhatsApp = () => {
    const messageWithLink = message 
      ? `${message}\n\nhttps://www.ulmind.com`
      : "Hi there 👋\nHow can I help you?\n\nwww.ulmind.com";
    const encodedMessage = encodeURIComponent(messageWithLink || "Hi there 👋\nHow can I help you?");
    window.open(`https://wa.me/918537861040?text=${encodedMessage}`, "_blank");
    setShowPopup(false);
    setMessage("");
  };

  return (
    <>
      {/* Floating WhatsApp Button */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 999999,
          cursor: "pointer",
          width: "60px",
          height: "60px",
          borderRadius: "30px",
          backgroundColor: "#25D366",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
        onClick={() => setShowPopup(true)}
        title="Chat with ULmind on WhatsApp"
      >
        <svg
          viewBox="0 0 32 32"
          width="36"
          height="36"
          fill="white"
        >
          <path d="M16 0C7.164 0 0 7.164 0 16c0 2.828.736 5.484 2.024 7.792L0 32l8.416-2.208A15.928 15.928 0 0016 32c8.836 0 16-7.164 16-16S24.836 0 16 0zm0 29.6a13.6 13.6 0 01-6.944-1.904l-.496-.296-5.152 1.352 1.376-5.024-.324-.516A13.544 13.544 0 012.4 16c0-7.512 6.088-13.6 13.6-13.6S29.6 8.488 29.6 16 23.512 29.6 16 29.6zm7.456-10.176c-.408-.204-2.416-1.192-2.792-1.328-.376-.136-.648-.204-.92.204-.272.408-1.056 1.328-1.296 1.6-.24.272-.48.308-.888.104-.408-.204-1.72-.632-3.276-2.02-1.212-1.08-2.032-2.416-2.272-2.824-.24-.408-.024-.628.18-.832.184-.184.408-.48.612-.72.204-.24.272-.408.408-.68.136-.272.068-.508-.032-.712-.104-.204-.92-2.216-1.26-3.036-.332-.8-.668-.692-.92-.704-.236-.012-.508-.016-.78-.016-.272 0-.716.104-1.092.508-.376.408-1.44 1.408-1.44 3.432 0 2.024 1.476 3.98 1.68 4.252.204.272 2.888 4.408 6.996 6.184.976.424 1.74.676 2.336.864.98.312 1.872.268 2.576.164.788-.116 2.416-.988 2.756-1.94.34-.952.34-1.768.24-1.94-.104-.172-.376-.272-.784-.476z"/>
        </svg>
      </div>

      {/* Popup Dialog */}
      {showPopup && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 999998,
              background: "rgba(0,0,0,0.4)",
            }}
            onClick={() => setShowPopup(false)}
          />
          <div
            style={{
              position: "fixed",
              bottom: "100px",
              right: "24px",
              background: "#fff",
              borderRadius: "20px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              zIndex: 999999,
              width: "360px",
              overflow: "hidden",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Teal Green */}
            <div
              style={{
                background: "#00897B",
                color: "#fff",
                padding: "18px 20px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                position: "relative",
              }}
            >
              {/* Profile Image with Online Indicator */}
              <div style={{ position: "relative" }}>
                <img
                  src="/ULmindlogo1.png"
                  alt="ULmind"
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    backgroundColor: "#fff",
                  }}
                />
                {/* Green online dot */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "2px",
                    right: "2px",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#4CAF50",
                    border: "2px solid #00897B",
                  }}
                />
              </div>
              
              {/* Name and Number */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "600", fontSize: "16px", marginBottom: "2px" }}>
                  ULmind
                </div>
                <div style={{ fontSize: "13px", opacity: 0.9 }}>
                  +91 85378 61040
                </div>
              </div>
              
              {/* QR Code Icon */}
              <div style={{ marginRight: "8px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
              </div>
              
              {/* Close Button */}
              <div
                style={{ cursor: "pointer", fontSize: "28px", lineHeight: "20px", fontWeight: "300" }}
                onClick={() => setShowPopup(false)}
              >
                ×
              </div>
            </div>

            {/* Chat Body - WhatsApp Pattern Background */}
            <div
              style={{
                padding: "20px",
                background: "#E5DDD5",
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d9d9d9' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                minHeight: "200px",
              }}
            >
              {/* Time stamp */}
              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <span
                  style={{
                    fontSize: "12px",
                    color: "#667781",
                    backgroundColor: "rgba(255,255,255,0.8)",
                    padding: "4px 12px",
                    borderRadius: "12px",
                  }}
                >
                  11:18
                </span>
              </div>

              {/* Chat Bubbles */}
              <div style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    background: "#FFFFFF",
                    color: "#111B21",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    marginBottom: "6px",
                    maxWidth: "85%",
                    display: "inline-block",
                    boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
                    fontSize: "14.2px",
                    lineHeight: "1.5",
                  }}
                >
                  Hi there 👋
                </div>
                <br />
                <div
                  style={{
                    background: "#FFFFFF",
                    color: "#111B21",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    maxWidth: "85%",
                    display: "inline-block",
                    boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
                    fontSize: "14.2px",
                    lineHeight: "1.5",
                  }}
                >
                  How can I help you?
                </div>
              </div>
            </div>

            {/* Input Area - White */}
            <div
              style={{
                background: "#F0F2F5",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && openWhatsApp()}
                placeholder="Enter Your Message..."
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  border: "none",
                  borderRadius: "24px",
                  fontSize: "14px",
                  backgroundColor: "#FFFFFF",
                  color: "#111B21",
                  outline: "none",
                }}
                autoFocus
              />
              {/* Three dots menu */}
              <div style={{ color: "#54656F", cursor: "pointer", fontSize: "20px" }}>⋮</div>
              {/* Send Button */}
              <div
                onClick={openWhatsApp}
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "#25D366",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(37,211,102,0.4)",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

// Main App
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/team" element={<Team />} />
            <Route path="/methodology" element={<Methodology />} />
            <Route path="/career" element={<Career />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <WhatsAppFloat />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;