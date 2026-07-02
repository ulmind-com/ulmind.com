/* ──────────────────────────────────────────────────────────────
   HW Login — QR Code Scanner Login Page
   Ultra-premium hardware-style login with camera QR scanning
   ────────────────────────────────────────────────────────────── */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Scan, Shield, CheckCircle, AlertTriangle, Loader2, Wifi, WifiOff } from "lucide-react";
import { useCamera } from "../../../hooks/useCamera";
import { playSuccessBeep, playErrorBeep } from "../../lib/beep";
import { qrLogin } from "../../lib/hw-api";
import { useHW } from "../../context/hw-context";
import "../../admin.css";

// Dynamic import for jsQR
let jsQR: any = null;
import("jsqr").then(mod => { jsQR = mod.default || mod; });

const HWLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setSession } = useHW();

  const { videoRef, error: cameraError, isLoading: cameraLoading, isCameraOn, startCamera, stopCamera } = useCamera();
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<"success" | "error" | null>(null);
  const [scanMessage, setScanMessage] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const scanCanvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const scanLockRef = useRef(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) navigate("/admin/hardware", { replace: true });
  }, [isLoggedIn, navigate]);

  // Internet status
  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  // Start camera on mount
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  // QR Scanner loop
  const scanQR = useCallback(() => {
    if (!videoRef.current || !jsQR || scanLockRef.current || !isCameraOn) {
      animFrameRef.current = requestAnimationFrame(scanQR);
      return;
    }

    const video = videoRef.current;
    if (video.readyState < 2) {
      animFrameRef.current = requestAnimationFrame(scanQR);
      return;
    }

    if (!scanCanvasRef.current) {
      scanCanvasRef.current = document.createElement("canvas");
    }
    const canvas = scanCanvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      animFrameRef.current = requestAnimationFrame(scanQR);
      return;
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });

    if (code && code.data) {
      scanLockRef.current = true;
      handleQRDetected(code.data);
    } else {
      animFrameRef.current = requestAnimationFrame(scanQR);
    }
  }, [isCameraOn]);

  // Start scanning when camera is ready
  useEffect(() => {
    if (isCameraOn && !loginLoading && !scanResult) {
      setScanning(true);
      animFrameRef.current = requestAnimationFrame(scanQR);
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isCameraOn, scanQR, loginLoading, scanResult]);

  const handleQRDetected = async (data: string) => {
    setLoginLoading(true);
    try {
      // Try to parse as JSON (our QR format)
      let payload = data;
      try {
        JSON.parse(data); // Validate it's valid JSON
      } catch {
        throw new Error("Invalid QR code format");
      }

      playSuccessBeep();
      setScanResult("success");
      setScanMessage("QR Code detected! Logging in...");

      const result = await qrLogin(payload);

      if (result.status === "success") {
        if (result.admin_token) {
          localStorage.setItem("ulmind_admin_token", result.admin_token);
        }

        setSession({
          token: result.token,
          session_id: result.session_id,
          employee: result.employee,
          session_start: result.session_start,
          session_type: result.session_type,
          session_schedule: result.session_schedule,
        });

        setScanMessage(result.message || "Login successful!");

        setTimeout(() => {
          navigate("/admin/hardware", { replace: true });
        }, 1500);
      } else {
        throw new Error(result.message || "Login failed");
      }
    } catch (err: any) {
      playErrorBeep();
      setScanResult("error");
      setScanMessage(err.message || "Login failed. Try again.");

      setTimeout(() => {
        setScanResult(null);
        setScanMessage("");
        scanLockRef.current = false;
        setLoginLoading(false);
      }, 3000);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#030712",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Background effects */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", top: "-10%", left: "-10%",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.06, 0.12, 0.06] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{
          position: "absolute", bottom: "-5%", right: "-5%",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.5) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Grid overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
        backgroundSize: "50px 50px",
        maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 80%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 80%)",
      }} />

      {/* Internet Status */}
      <div style={{
        position: "fixed", top: 20, right: 20, zIndex: 50,
        display: "flex", alignItems: "center", gap: 8,
        padding: "8px 16px", borderRadius: 12,
        background: isOnline ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.15)",
        border: `1px solid ${isOnline ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
        color: isOnline ? "#10b981" : "#ef4444",
        fontSize: 12, fontWeight: 600,
      }}>
        {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
        {isOnline ? "Online" : "Offline"}
      </div>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 480, padding: "0 20px" }}
      >
        <div style={{
          background: "rgba(15, 23, 42, 0.5)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 28,
          padding: "36px 32px",
          boxShadow: "0 25px 60px -15px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.05)",
        }}>
          {/* Top accent */}
          <div style={{
            position: "absolute", top: 0, left: "20%", right: "20%", height: 2,
            background: "linear-gradient(90deg, transparent, #3b82f6, #10b981, transparent)",
            borderRadius: "0 0 4px 4px",
          }} />

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              style={{
                width: 60, height: 60, borderRadius: 18, margin: "0 auto 16px",
                background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)",
              }}
            >
              <Shield size={30} color="#fff" strokeWidth={1.5} />
            </motion.div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 4, letterSpacing: "-0.02em" }}>
              Hardware Access
            </h1>
            <p style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>
              Scan your QR badge to clock in
            </p>
          </div>

          {/* Camera Viewfinder */}
          <div style={{
            position: "relative",
            width: "100%",
            aspectRatio: "4/3",
            borderRadius: 20,
            overflow: "hidden",
            background: "#0a0f1a",
            border: "2px solid rgba(59, 130, 246, 0.2)",
            marginBottom: 20,
          }}>
            {/* Video element */}
            <video
              ref={videoRef as React.RefObject<HTMLVideoElement>}
              autoPlay
              playsInline
              muted
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: "scaleX(-1)",
              }}
            />

            {/* Scanning overlay with crosshairs */}
            {isCameraOn && !scanResult && (
              <>
                {/* Corner brackets */}
                <div style={{ position: "absolute", inset: "15%", pointerEvents: "none" }}>
                  {/* Top-left */}
                  <div style={{ position: "absolute", top: 0, left: 0, width: 30, height: 30, borderTop: "3px solid #3b82f6", borderLeft: "3px solid #3b82f6", borderRadius: "4px 0 0 0" }} />
                  {/* Top-right */}
                  <div style={{ position: "absolute", top: 0, right: 0, width: 30, height: 30, borderTop: "3px solid #3b82f6", borderRight: "3px solid #3b82f6", borderRadius: "0 4px 0 0" }} />
                  {/* Bottom-left */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, width: 30, height: 30, borderBottom: "3px solid #3b82f6", borderLeft: "3px solid #3b82f6", borderRadius: "0 0 0 4px" }} />
                  {/* Bottom-right */}
                  <div style={{ position: "absolute", bottom: 0, right: 0, width: 30, height: 30, borderBottom: "3px solid #3b82f6", borderRight: "3px solid #3b82f6", borderRadius: "0 0 4px 0" }} />
                </div>

                {/* Scanning line animation */}
                <motion.div
                  animate={{ top: ["15%", "80%", "15%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: "absolute",
                    left: "15%", right: "15%",
                    height: 2,
                    background: "linear-gradient(90deg, transparent, #3b82f6, rgba(59, 130, 246, 0.8), #3b82f6, transparent)",
                    boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)",
                  }}
                />
              </>
            )}

            {/* Success overlay */}
            <AnimatePresence>
              {scanResult === "success" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: "absolute", inset: 0,
                    background: "rgba(16, 185, 129, 0.15)",
                    backdropFilter: "blur(4px)",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                  >
                    <CheckCircle size={64} color="#10b981" strokeWidth={1.5} />
                  </motion.div>
                  <p style={{ color: "#10b981", fontSize: 16, fontWeight: 700, marginTop: 12 }}>
                    Access Granted
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error overlay */}
            <AnimatePresence>
              {scanResult === "error" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: "absolute", inset: 0,
                    background: "rgba(239, 68, 68, 0.15)",
                    backdropFilter: "blur(4px)",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                  >
                    <AlertTriangle size={64} color="#ef4444" strokeWidth={1.5} />
                  </motion.div>
                  <p style={{ color: "#ef4444", fontSize: 14, fontWeight: 700, marginTop: 12 }}>
                    Access Denied
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Camera loading */}
            {(cameraLoading || !isCameraOn) && !cameraError && (
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                background: "rgba(0,0,0,0.8)",
              }}>
                <Loader2 size={40} color="#3b82f6" style={{ animation: "spin 1s linear infinite" }} />
                <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 12 }}>Initializing camera...</p>
              </div>
            )}

            {/* Camera error */}
            {cameraError && (
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                background: "rgba(0,0,0,0.9)",
                padding: 20, textAlign: "center",
              }}>
                <Camera size={40} color="#ef4444" />
                <p style={{ color: "#fca5a5", fontSize: 14, fontWeight: 600, marginTop: 12 }}>
                  Turn On Your Camera
                </p>
                <p style={{ color: "#64748b", fontSize: 12, marginTop: 6 }}>
                  {cameraError}
                </p>
                <button
                  onClick={startCamera}
                  style={{
                    marginTop: 16, padding: "8px 20px", borderRadius: 10,
                    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                    color: "#fff", border: "none", fontSize: 13, fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Retry Camera
                </button>
              </div>
            )}
          </div>

          {/* Status message */}
          <AnimatePresence mode="wait">
            {scanMessage && (
              <motion.div
                key={scanMessage}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  textAlign: "center",
                  padding: "10px 16px",
                  borderRadius: 12,
                  marginBottom: 16,
                  background: scanResult === "success"
                    ? "rgba(16, 185, 129, 0.1)"
                    : scanResult === "error"
                      ? "rgba(239, 68, 68, 0.1)"
                      : "rgba(59, 130, 246, 0.1)",
                  border: `1px solid ${
                    scanResult === "success" ? "rgba(16, 185, 129, 0.3)"
                    : scanResult === "error" ? "rgba(239, 68, 68, 0.3)"
                    : "rgba(59, 130, 246, 0.3)"
                  }`,
                  color: scanResult === "success" ? "#10b981"
                    : scanResult === "error" ? "#fca5a5"
                    : "#93c5fd",
                  fontSize: 13, fontWeight: 600,
                }}
              >
                {scanMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scanning indicator */}
          {scanning && !scanResult && !loginLoading && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 10, marginBottom: 12,
            }}>
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Scan size={18} color="#3b82f6" />
              </motion.div>
              <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>
                Scanning for QR code...
              </span>
            </div>
          )}

          {/* Loading during login */}
          {loginLoading && !scanResult && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 10, marginBottom: 12,
            }}>
              <Loader2 size={18} color="#3b82f6" style={{ animation: "spin 1s linear infinite" }} />
              <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>
                Authenticating...
              </span>
            </div>
          )}

          {/* Instructions */}
          <div style={{
            background: "rgba(0,0,0,0.2)",
            borderRadius: 14,
            padding: "14px 18px",
            border: "1px solid rgba(255,255,255,0.04)",
          }}>
            <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6, margin: 0 }}>
              <strong style={{ color: "#94a3b8" }}>Instructions:</strong> Hold your QR badge in front of the camera.
              The system will automatically detect and scan your code.
              You'll hear a beep on successful authentication.
            </p>
          </div>

          {/* Footer */}
          <p style={{
            textAlign: "center", fontSize: 10, color: "#334155",
            marginTop: 20, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600,
          }}>
            ULMiND Hardware Security System
          </p>
        </div>
      </motion.div>

      {/* CSS animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default HWLoginPage;
