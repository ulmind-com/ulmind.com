import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/providers/theme-provider";
import Layout from "@/components/Layout/Layout";
import ScrollToTop from "@/components/ScrollToTop";
import { NotFound } from "./components/ui/ghost-404-page-1"

// Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Team from "./pages/Team";
import Methodology from "./pages/Methodology";
import Career from "./pages/Career";
import Contact from "./pages/Contact";
// import NotFound from "./pages/NotFound";

// Effects
import Snowfall from "react-snowfall";

// Icons
import { Phone, Video, MoreVertical } from "lucide-react";

/* ===========================
   WhatsApp Floating Widget
=========================== */
const WhatsAppFloat: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const openWhatsApp = () => {
    const text = message || "Hi there 👋 How can I help you?";
    window.open(
      `https://wa.me/918537861040?text=${encodeURIComponent(text)}`,
      "_blank"
    );
    setMessage("");
    setShowPopup(false);
  };

  return (
    <>
      {/* CALL BUTTON (same size as WhatsApp) */}
      <a
        href="tel:8537861040"
        title="Call Now"
        style={{
          position: "fixed",
          bottom: 100,
          right: 24,
          width: 60,
          height: 60,
          borderRadius: "50%",
          backgroundColor: "#3B82F6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
          zIndex: 9999,
        }}
      >
        <Phone size={28} color="white" />
      </a>

      {/* WHATSAPP FLOATING BUTTON */}
      <div
        onClick={() => setShowPopup(true)}
        title="Chat on WhatsApp"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 60,
          height: 60,
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
        {/* Official WhatsApp SVG */}
       <svg
  width="34"
  height="34"
  viewBox="0 0 24 24"
  fill="white"
  xmlns="http://www.w3.org/2000/svg"
>
  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.93.5 3.82 1.45 5.49L2 22l4.77-1.25a9.9 9.9 0 0 0 5.27 1.5h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.05h-.01a8.17 8.17 0 0 1-4.16-1.15l-.3-.18-2.83.74.76-2.76-.2-.29a8.13 8.13 0 1 1 6.74 3.64zm4.49-6.1c-.25-.12-1.47-.72-1.7-.8-.23-.08-.4-.12-.57.12-.17.25-.66.8-.8.97-.15.17-.29.18-.54.06-.25-.12-1.06-.39-2.01-1.25-.74-.66-1.24-1.47-1.39-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.38-.44.12-.15.17-.25.25-.42.08-.17.04-.32-.02-.44-.06-.12-.57-1.37-.78-1.88-.2-.48-.41-.42-.57-.43h-.48c-.17 0-.44.06-.67.32-.23.25-.88.86-.88 2.1 0 1.23.9 2.42 1.02 2.59.12.17 1.77 2.7 4.29 3.78.6.26 1.07.42 1.44.54.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29z"/>
</svg>
      </div>

      {/* CHAT POPUP */}
      {showPopup && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setShowPopup(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 9998,
            }}
          />

          {/* Chat Box */}
          <div
            style={{
              position: "fixed",
              bottom: 100,
              right: 24,
              width: 360,
              borderRadius: 18,
              overflow: "hidden",
              background: "#fff",
              zIndex: 9999,
              boxShadow: "0 10px 32px rgba(0,0,0,0.35)",
            }}
          >
            {/* HEADER */}
            <div
              style={{
                background: "#00897B",
                color: "#fff",
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              {/* Logo + online dot */}
              <div style={{ position: "relative" }}>
                <img
                  src="/logo.png"
                  alt="ULMiND"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    bottom: 2,
                    right: 2,
                    width: 10,
                    height: 10,
                    background: "#25D366",
                    borderRadius: "50%",
                    border: "2px solid #00897B",
                  }}
                />
              </div>

              {/* Name + status */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>ULMiND</div>
                <div style={{ fontSize: 12, opacity: 0.9 }}>online</div>
              </div>

              <Video size={20} />
              <Phone size={20} />
              <MoreVertical size={20} />
              <span
                onClick={() => setShowPopup(false)}
                style={{ fontSize: 22, cursor: "pointer" }}
              >
                ×
              </span>
            </div>

            {/* BODY */}
            <div
              style={{
                padding: "20px 16px",
                background: "#ECE5DD",
                minHeight: 220,
              }}
            >
              <div
                style={{
                  background: "#fff",
                  padding: "10px 14px",
                  borderRadius: "12px 12px 12px 4px",
                  marginBottom: 8,
                  display: "inline-block",
                }}
              >
                Hi there 👋
              </div>
              <br />
              <div
                style={{
                  background: "#fff",
                  padding: "10px 14px",
                  borderRadius: "12px 12px 12px 4px",
                  display: "inline-block",
                }}
              >
                How can I help you?
              </div>
            </div>

            {/* INPUT */}
            <div
              style={{
                padding: 10,
                display: "flex",
                gap: 8,
                background: "#F0F2F5",
              }}
            >
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message..."
                style={{
                  flex: 1,
                  borderRadius: 20,
                  padding: "10px 14px",
                  border: "none",
                  outline: "none",
                }}
              />
              <button
                onClick={openWhatsApp}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "#25D366",
                  border: "none",
                  cursor: "pointer",
                  color: "#fff",
                }}
              >
                ➤
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <Snowfall
          style={{ position: "fixed", inset: 0, pointerEvents: "none" }}
          snowflakeCount={80}
        />

        <BrowserRouter>
        <ScrollToTop /> 
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/team" element={<Team />} />
              <Route path="/methodology" element={<Methodology />} />
              <Route path="/career" element={<Career />} />
              <Route path="/contact" element={<Contact />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

        <WhatsAppFloat />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
