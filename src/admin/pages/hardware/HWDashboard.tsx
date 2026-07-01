/* ──────────────────────────────────────────────────────────────
   HW Dashboard — Employee Monitoring Dashboard
   Real-time work timer, AI camera monitoring, session management
   ────────────────────────────────────────────────────────────── */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, CameraOff, Clock, User, Shield, LogOut, Wifi, WifiOff,
  Eye, EyeOff, Smartphone, Moon, AlertTriangle, CheckCircle,
  Activity, Timer, Coffee, Scan, ChevronRight, BarChart3,
} from "lucide-react";
import { useHW } from "../../context/hw-context";
import { useCamera } from "../../../hooks/useCamera";
import { useAIDetection } from "../../../hooks/useAIDetection";
import { useWorkTimer } from "../../../hooks/useWorkTimer";
import { sendHeartbeat, logMonitoringEvent, updateCameraStatus, updateInternetStatus } from "../../lib/hw-api";
import { playAlertBeep } from "../../lib/beep";
import "../../admin.css";

const HWDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { employee, sessionId, isLoggedIn, sessionStart, logout, triggerLunchBreak } = useHW();
  const { videoRef, isCameraOn, startCamera, stopCamera, error: camError } = useCamera();
  const { isModelLoaded, lastResult, startDetection, stopDetection, isDetecting } = useAIDetection(3000);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [alerts, setAlerts] = useState<{ type: string; msg: string; time: string }[]>([]);

  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevEventRef = useRef<string>("");
  const lastEventTimeRef = useRef<number>(0);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) navigate("/admin/hw/login", { replace: true });
  }, [isLoggedIn, navigate]);

  // Work timer
  const timer = useWorkTimer(
    undefined,
    sessionStart,
    () => {
      // Lunch break triggered
      triggerLunchBreak();
      stopCamera();
      stopDetection();
      addAlert("info", "Lunch break started! Camera paused.");
    },
    () => {
      // Day ended
      handleLogout();
    }
  );

  // Internet monitoring
  useEffect(() => {
    const onOnline = () => {
      setIsOnline(true);
      if (sessionId && employee) {
        updateInternetStatus({ session_id: sessionId, employee_id: employee.employee_id, is_online: true }).catch(() => {});
      }
    };
    const onOffline = () => {
      setIsOnline(false);
      addAlert("warning", "Internet disconnected!");
      if (sessionId && employee) {
        updateInternetStatus({ session_id: sessionId, employee_id: employee.employee_id, is_online: false }).catch(() => {});
      }
    };
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [sessionId, employee]);

  // Start camera and detection
  useEffect(() => {
    if (isLoggedIn && !timer.isLunchBreak && !timer.isAfterHours) {
      startCamera();
    }
    return () => {
      stopCamera();
      stopDetection();
    };
  }, [isLoggedIn, timer.isLunchBreak, timer.isAfterHours]);

  // Start AI detection when camera is ready
  useEffect(() => {
    if (isCameraOn && videoRef.current && isModelLoaded && !isDetecting) {
      startDetection(videoRef.current);
    }
  }, [isCameraOn, isModelLoaded]);

  // Handle detection results → log events
  useEffect(() => {
    if (!lastResult || !sessionId || !employee) return;
    const now = Date.now();
    const minInterval = 10000; // Don't spam same event within 10s

    let eventType = "";
    let severity = "info";

    if (lastResult.cameraCovered) {
      eventType = "camera_covered";
      severity = "critical";
    } else if (lastResult.cameraFrozen) {
      eventType = "camera_frozen";
      severity = "warning";
    } else if (lastResult.lowLight) {
      eventType = "camera_low_light";
      severity = "warning";
    } else if (!lastResult.faceDetected) {
      eventType = "face_absent";
      severity = "warning";
    } else if (lastResult.lookingAway) {
      eventType = "looking_away";
      severity = "info";
    } else {
      eventType = "active_working";
    }

    // Only log state changes or periodic check-ins
    if (eventType !== prevEventRef.current || now - lastEventTimeRef.current > 30000) {
      prevEventRef.current = eventType;
      lastEventTimeRef.current = now;

      if (eventType !== "active_working") {
        logMonitoringEvent({
          session_id: sessionId,
          employee_id: employee.employee_id,
          employee_db_id: employee._id,
          event_type: eventType,
          confidence: lastResult.confidence,
          details: {
            face_detected: lastResult.faceDetected,
            person_count: lastResult.personCount,
          },
        }).catch(() => {});

        // Add local alert for concerning events
        if (severity !== "info") {
          const alertMessages: Record<string, string> = {
            camera_covered: "⚠️ Camera is covered!",
            camera_frozen: "⚠️ Camera appears frozen",
            face_absent: "👤 Face not detected",
            looking_away: "👁 Looking away from screen",
            camera_low_light: "🔆 Low light detected",
          };
          addAlert(severity, alertMessages[eventType] || eventType);
          if (severity === "critical") playAlertBeep();
        }
      }
    }
  }, [lastResult, sessionId, employee]);

  // Heartbeat every 10 seconds
  useEffect(() => {
    if (!sessionId || !employee) return;

    heartbeatRef.current = setInterval(() => {
      sendHeartbeat({
        session_id: sessionId,
        employee_id: employee.employee_id,
        camera_state: isCameraOn ? "on" : "off",
        face_detected: lastResult?.faceDetected ?? false,
        is_active: lastResult?.faceDetected ?? false,
        detection_summary: {
          face_present_seconds: lastResult?.faceDetected ? 10 : 0,
          active_seconds: lastResult?.faceDetected ? 10 : 0,
          idle_seconds: !lastResult?.faceDetected ? 10 : 0,
          absent_seconds: !lastResult?.faceDetected ? 10 : 0,
          current_event: prevEventRef.current,
          mobile_detected: lastResult?.mobileDetected ?? false,
          sleeping_detected: lastResult?.sleepingDetected ?? false,
        },
      }).catch(() => {});
    }, 10000);

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, [sessionId, employee, isCameraOn, lastResult]);

  const addAlert = (type: string, msg: string) => {
    const time = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    setAlerts(prev => [{ type, msg, time }, ...prev].slice(0, 10));
  };

  const handleLogout = async () => {
    stopCamera();
    stopDetection();
    await logout();
    navigate("/admin/hw/login", { replace: true });
  };

  if (!employee || !sessionId) return null;

  const statusColor = lastResult?.faceDetected
    ? "#10b981"
    : lastResult?.cameraCovered
      ? "#ef4444"
      : "#f59e0b";
  const statusText = lastResult?.faceDetected
    ? "Working"
    : lastResult?.cameraCovered
      ? "Camera Covered"
      : "Away";

  return (
    <div style={{
      minHeight: "100vh",
      background: "#030712",
      color: "#fff",
      fontFamily: "'Inter', system-ui, sans-serif",
      padding: "20px",
    }}>
      {/* Top Bar */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 24, flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 14,
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Shield size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>ULMiND Monitor</h1>
            <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>Hardware Security System</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Internet status */}
          <div style={{
            padding: "6px 12px", borderRadius: 8,
            background: isOnline ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.15)",
            border: `1px solid ${isOnline ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.3)"}`,
            color: isOnline ? "#10b981" : "#ef4444",
            fontSize: 11, fontWeight: 600,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
            {isOnline ? "Online" : "Offline"}
          </div>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            style={{
              padding: "8px 16px", borderRadius: 10,
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
              color: "#fca5a5", fontSize: 12, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 20,
        maxWidth: 1200,
        margin: "0 auto",
      }}>
        {/* Employee Info Card */}
        <div style={{
          background: "rgba(15,23,42,0.5)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 20, padding: 24,
          backdropFilter: "blur(20px)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 800, color: "#fff",
            }}>
              {employee.name.charAt(0)}
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{employee.name}</h2>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>{employee.designation}</p>
              <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>{employee.employee_id} • {employee.email}</p>
            </div>
          </div>

          {/* Status badges */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <StatusBadge icon={<Activity size={12} />} label="Status" value={statusText} color={statusColor} />
            <StatusBadge icon={<Clock size={12} />} label="Segment" value={timer.currentSegment.charAt(0).toUpperCase() + timer.currentSegment.slice(1)} color="#3b82f6" />
            <StatusBadge icon={<Camera size={12} />} label="Camera" value={isCameraOn ? "Active" : "Off"} color={isCameraOn ? "#10b981" : "#ef4444"} />
          </div>
        </div>

        {/* Timer Card */}
        <div style={{
          background: "rgba(15,23,42,0.5)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 20, padding: 24,
          backdropFilter: "blur(20px)",
          display: "flex", flexDirection: "column", alignItems: "center",
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
            Work Timer
          </div>

          {/* Circular Timer */}
          <div style={{ position: "relative", width: 160, height: 160, marginBottom: 16 }}>
            <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)" }}>
              {/* Background circle */}
              <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              {/* Progress circle */}
              <circle
                cx="80" cy="80" r="70" fill="none"
                stroke={timer.isLunchBreak ? "#f59e0b" : timer.isRunning ? "#10b981" : "#64748b"}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${2 * Math.PI * 70 * (1 - timer.progressPercent / 100)}`}
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
            </svg>
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
            }}>
              <span style={{
                fontSize: 28, fontWeight: 800,
                fontFamily: "'JetBrains Mono', monospace",
                color: timer.isLunchBreak ? "#f59e0b" : "#fff",
              }}>
                {timer.formattedTime}
              </span>
              <span style={{ fontSize: 10, color: "#64748b", fontWeight: 600 }}>
                {timer.isLunchBreak ? "LUNCH BREAK" : timer.isRunning ? "WORKING" : "PAUSED"}
              </span>
            </div>
          </div>

          {/* Timer details */}
          <div style={{ display: "flex", gap: 16, fontSize: 11, color: "#94a3b8" }}>
            <span>Remaining: <strong style={{ color: "#fff" }}>{timer.formattedRemaining}</strong></span>
            <span>Progress: <strong style={{ color: "#10b981" }}>{timer.progressPercent.toFixed(0)}%</strong></span>
          </div>

          {/* Schedule */}
          <div style={{
            marginTop: 16, padding: "10px 16px", borderRadius: 10,
            background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.04)",
            fontSize: 10, color: "#64748b", width: "100%",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span>10:00 - 13:00</span>
              <span style={{ color: timer.currentSegment === "morning" ? "#10b981" : "#64748b" }}>Morning</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span>13:00 - 14:00</span>
              <span style={{ color: timer.isLunchBreak ? "#f59e0b" : "#64748b" }}>Lunch</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>14:00 - 19:00</span>
              <span style={{ color: timer.currentSegment === "afternoon" ? "#10b981" : "#64748b" }}>Afternoon</span>
            </div>
          </div>
        </div>

        {/* Camera Feed */}
        <div style={{
          background: "rgba(15,23,42,0.5)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 20, padding: 24,
          backdropFilter: "blur(20px)",
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16,
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <Camera size={16} color="#3b82f6" /> Camera Monitor
            </h3>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: isCameraOn ? "#10b981" : "#ef4444",
              boxShadow: isCameraOn ? "0 0 8px #10b981" : "0 0 8px #ef4444",
            }} />
          </div>

          {/* Video feed */}
          <div style={{
            position: "relative", width: "100%", aspectRatio: "4/3",
            borderRadius: 14, overflow: "hidden", background: "#0a0f1a",
            border: `1px solid ${lastResult?.cameraCovered ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.06)"}`,
          }}>
            <video
              ref={videoRef as React.RefObject<HTMLVideoElement>}
              autoPlay playsInline muted
              style={{
                width: "100%", height: "100%", objectFit: "cover",
                transform: "scaleX(-1)", opacity: isCameraOn ? 1 : 0.3,
              }}
            />

            {/* Detection overlay */}
            {lastResult && isCameraOn && (
              <div style={{
                position: "absolute", bottom: 8, left: 8, right: 8,
                display: "flex", gap: 6, flexWrap: "wrap",
              }}>
                <DetectionPill active={lastResult.faceDetected} label="Face" icon="👤" />
                <DetectionPill active={!lastResult.cameraCovered} label="Camera" icon="📷" />
                <DetectionPill active={!lastResult.lookingAway} label="Focus" icon="👁" />
                <DetectionPill active={!lastResult.mobileDetected} label="No Phone" icon="📱" />
              </div>
            )}

            {/* Camera off overlay */}
            {!isCameraOn && (
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                background: "rgba(0,0,0,0.8)",
              }}>
                <CameraOff size={40} color="#ef4444" />
                <p style={{ color: "#fca5a5", fontSize: 14, fontWeight: 600, marginTop: 12 }}>
                  Turn On Your Camera
                </p>
                <p style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>
                  Camera is required for monitoring
                </p>
                <button
                  onClick={startCamera}
                  style={{
                    marginTop: 12, padding: "8px 20px", borderRadius: 10,
                    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                    color: "#fff", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer",
                  }}
                >
                  Enable Camera
                </button>
              </div>
            )}

            {/* Lunch break overlay */}
            {timer.isLunchBreak && (
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                background: "rgba(0,0,0,0.85)",
                backdropFilter: "blur(8px)",
              }}>
                <Coffee size={48} color="#f59e0b" />
                <h3 style={{ color: "#f59e0b", fontSize: 20, fontWeight: 800, marginTop: 16 }}>
                  Lunch Break
                </h3>
                <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 8 }}>
                  13:00 - 14:00 • Camera paused
                </p>
                <p style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>
                  Scan your QR badge at 2:00 PM to resume
                </p>
              </div>
            )}
          </div>

          {/* AI Detection Status */}
          {lastResult && (
            <div style={{
              marginTop: 12, padding: "10px 14px", borderRadius: 10,
              background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.04)",
              fontSize: 11, color: "#94a3b8",
              display: "flex", justifyContent: "space-between",
            }}>
              <span>AI Confidence: <strong style={{ color: "#10b981" }}>{(lastResult.confidence * 100).toFixed(0)}%</strong></span>
              <span>Persons: <strong style={{ color: "#fff" }}>{lastResult.personCount}</strong></span>
              <span>{isDetecting ? "🟢 Detecting" : "🔴 Stopped"}</span>
            </div>
          )}
        </div>

        {/* Alerts & Activity */}
        <div style={{
          background: "rgba(15,23,42,0.5)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 20, padding: 24,
          backdropFilter: "blur(20px)",
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={16} color="#f59e0b" /> Activity & Alerts
          </h3>

          <div style={{ maxHeight: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
            {alerts.length === 0 && (
              <p style={{ fontSize: 12, color: "#475569", textAlign: "center", padding: 20 }}>
                No alerts yet. Monitoring is active.
              </p>
            )}
            {alerts.map((alert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  padding: "10px 14px", borderRadius: 10,
                  background: alert.type === "critical" ? "rgba(239,68,68,0.08)"
                    : alert.type === "warning" ? "rgba(245,158,11,0.08)"
                    : "rgba(59,130,246,0.08)",
                  border: `1px solid ${
                    alert.type === "critical" ? "rgba(239,68,68,0.2)"
                    : alert.type === "warning" ? "rgba(245,158,11,0.2)"
                    : "rgba(59,130,246,0.15)"
                  }`,
                  fontSize: 12,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}
              >
                <span style={{ color: "#e2e8f0" }}>{alert.msg}</span>
                <span style={{ color: "#475569", fontSize: 10, whiteSpace: "nowrap", marginLeft: 8 }}>{alert.time}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 100,
              background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: "rgba(15,23,42,0.95)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 20, padding: 32, maxWidth: 380, width: "90%", textAlign: "center",
              }}
            >
              <LogOut size={40} color="#ef4444" style={{ margin: "0 auto 16px" }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>End Session?</h3>
              <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>
                This will log you out and stop all monitoring. You'll need to scan your QR badge again.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  style={{
                    padding: "10px 24px", borderRadius: 12,
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "#e2e8f0", fontSize: 14, fontWeight: 600, cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: "10px 24px", borderRadius: 12,
                    background: "linear-gradient(135deg, #ef4444, #dc2626)",
                    border: "none", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer",
                  }}
                >
                  End Session
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────

const StatusBadge: React.FC<{ icon: React.ReactNode; label: string; value: string; color: string }> = ({ icon, label, value, color }) => (
  <div style={{
    padding: "6px 12px", borderRadius: 8,
    background: `${color}11`, border: `1px solid ${color}33`,
    fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 6,
    color,
  }}>
    {icon}
    <span style={{ color: "#94a3b8" }}>{label}:</span>
    {value}
  </div>
);

const DetectionPill: React.FC<{ active: boolean; label: string; icon: string }> = ({ active, label, icon }) => (
  <div style={{
    padding: "4px 10px", borderRadius: 6,
    background: active ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
    border: `1px solid ${active ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
    fontSize: 10, fontWeight: 600,
    color: active ? "#10b981" : "#ef4444",
    display: "flex", alignItems: "center", gap: 4,
  }}>
    {icon} {label} {active ? "✓" : "✗"}
  </div>
);

export default HWDashboard;
