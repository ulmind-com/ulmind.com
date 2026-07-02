/* ──────────────────────────────────────────────────────────────
   HW Dashboard — Employee Monitoring Dashboard
   Real-time work timer, AI camera monitoring, session management
   ────────────────────────────────────────────────────────────── */

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, CameraOff, Clock, User, Shield, LogOut, Wifi, WifiOff,
  Eye, EyeOff, Smartphone, Moon, AlertTriangle, CheckCircle,
  Activity, Timer, Coffee, Scan, ChevronRight, BarChart3,
} from "lucide-react";
import { useHW } from "../../context/hw-context";
import { playAlertBeep } from "../../lib/beep";
import "../../admin.css";

const HWDashboard: React.FC = () => {
  const { 
    employee, sessionId, isLoggedIn, sessionType, logout, 
    stream, isCameraOn, isModelLoaded, isDetecting, lastResult, timer
  } = useHW();
  
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  // Attach the global stream to the local video element
  useEffect(() => {
    if (localVideoRef.current && stream) {
      localVideoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!isLoggedIn || !employee) return null;

  return (
    <div className="admin-page hw-dashboard-page" style={{ padding: "24px", maxWidth: 1400, margin: "0 auto" }}>
      {/* ── Header ── */}
      <header className="hw-header" style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 24, padding: "16px 24px",
        background: "var(--admin-card-bg)", borderRadius: 16, border: "1px solid var(--admin-border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: "rgba(59, 130, 246, 0.1)",
            display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6"
          }}>
            <Shield size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 600, color: "var(--admin-text)", margin: 0 }}>ULMiND Monitor</h1>
            <div style={{ fontSize: 12, color: "var(--admin-text-dim)" }}>Hardware Security System</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 12px", borderRadius: 20,
            background: "rgba(16, 185, 129, 0.1)", color: "#10b981", fontSize: 12, fontWeight: 600
          }}>
            <Wifi size={14} /> Online
          </div>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="admin-btn-ghost"
            style={{ color: "var(--admin-rose)" }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* ── Grid Layout ── */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
        gap: 24, alignItems: "start"
      }}>

        {/* ── Column 1: Profile & Camera ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          {/* Profile Card */}
          <div className="hw-panel" style={{
            background: "var(--admin-card-bg)", borderRadius: 16, border: "1px solid var(--admin-border)",
            padding: 24
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, fontWeight: "bold", color: "#fff"
              }}>
                {employee.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: "var(--admin-text)", margin: "0 0 4px 0" }}>
                  {employee.name}
                </h2>
                <div style={{ fontSize: 13, color: "var(--admin-text-dim)" }}>{employee.designation}</div>
                <div style={{ fontSize: 12, color: "var(--admin-text-muted)", marginTop: 2 }}>
                  {employee.employee_id} • {employee.email}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div style={{
                flex: 1, padding: "8px 12px", borderRadius: 8,
                background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.2)",
                display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#10b981"
              }}>
                <Activity size={14} /> <span>Status: <strong>Working</strong></span>
              </div>
              <div style={{
                flex: 1, padding: "8px 12px", borderRadius: 8,
                background: "rgba(59, 130, 246, 0.05)", border: "1px solid rgba(59, 130, 246, 0.2)",
                display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#3b82f6"
              }}>
                <Clock size={14} /> <span>Segment: <strong>{sessionType === "lunch" ? "Lunch Break" : "Active"}</strong></span>
              </div>
            </div>
          </div>

          {/* Camera Feed */}
          <div className="hw-panel" style={{
            background: "var(--admin-card-bg)", borderRadius: 16, border: "1px solid var(--admin-border)",
            padding: 24, display: "flex", flexDirection: "column"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--admin-text)", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <Camera size={16} /> Camera Monitor
              </h3>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: isCameraOn ? "#10b981" : "#ef4444",
                boxShadow: `0 0 8px ${isCameraOn ? "#10b981" : "#ef4444"}`
              }} />
            </div>

            <div style={{
              position: "relative", width: "100%", aspectRatio: "4/3",
              background: "#000", borderRadius: 12, overflow: "hidden",
              border: `2px solid ${isCameraOn && lastResult?.faceDetected ? "#10b981" : (isCameraOn ? "#ef4444" : "#333")}`
            }}>
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: "100%", height: "100%", objectFit: "cover",
                  transform: "scaleX(-1)", // Mirror
                  opacity: isCameraOn ? 1 : 0
                }}
              />
              
              {!isCameraOn && (
                <div style={{
                  position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", color: "var(--admin-text-muted)"
                }}>
                  <CameraOff size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
                  <div style={{ fontSize: 13 }}>Camera Offline</div>
                </div>
              )}

              {/* Status Overlay */}
              {isCameraOn && (
                <div style={{
                  position: "absolute", bottom: 12, left: 12, right: 12,
                  display: "flex", justifyContent: "space-between", alignItems: "flex-end"
                }}>
                  <div style={{
                    padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                    background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
                    color: lastResult?.faceDetected ? "#10b981" : "#ef4444",
                    display: "flex", alignItems: "center", gap: 4
                  }}>
                    {lastResult?.faceDetected ? <><Eye size={12}/> Face Detected</> : <><EyeOff size={12}/> No Face</>}
                  </div>
                  
                  {isDetecting && (
                    <div style={{ display: "flex", gap: 4 }}>
                      <div className="scanning-dot" style={{ background: "#3b82f6", width: 6, height: 6, borderRadius: "50%" }} />
                      <div className="scanning-dot" style={{ background: "#3b82f6", width: 6, height: 6, borderRadius: "50%", animationDelay: "0.2s" }} />
                      <div className="scanning-dot" style={{ background: "#3b82f6", width: 6, height: 6, borderRadius: "50%", animationDelay: "0.4s" }} />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* AI Analysis Badges */}
            <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
              <Badge active={!!lastResult?.mobileDetected} icon={<Smartphone size={12}/>} label="Phone" color="#f59e0b" />
              <Badge active={!!lastResult?.sleepingDetected} icon={<Moon size={12}/>} label="Sleeping" color="#8b5cf6" />
              <Badge active={!!lastResult?.lookingAway} icon={<AlertTriangle size={12}/>} label="Distracted" color="#f59e0b" />
              <Badge active={lastResult?.personCount > 1} icon={<User size={12}/>} label="Multiple People" color="#ef4444" />
            </div>
          </div>
        </div>

        {/* ── Column 2: Timer & Events ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          {/* Work Timer */}
          <div className="hw-panel" style={{
            background: "var(--admin-card-bg)", borderRadius: 16, border: "1px solid var(--admin-border)",
            padding: 32, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
          }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, color: "var(--admin-text-muted)", letterSpacing: 1, textTransform: "uppercase", margin: "0 0 24px 0" }}>
              Work Timer
            </h3>
            
            <div style={{ position: "relative", width: 200, height: 200 }}>
              <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="100" cy="100" r="90" fill="none" stroke="var(--admin-border)" strokeWidth="6" />
                <circle cx="100" cy="100" r="90" fill="none" stroke="#3b82f6" strokeWidth="6"
                  strokeDasharray="565" strokeDashoffset={565 - (565 * (timer.progress / 100))}
                  strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s linear" }}
                />
              </svg>
              <div style={{
                position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center"
              }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: "var(--admin-text)", fontVariantNumeric: "tabular-nums", letterSpacing: -1 }}>
                  {timer.elapsedFormatted}
                </div>
                <div style={{ fontSize: 12, color: "var(--admin-text-muted)", marginTop: 4, textTransform: "uppercase", fontWeight: 600, letterSpacing: 1 }}>
                  {timer.isLunchBreak ? "Lunch Break" : "Active"}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginTop: 32, padding: "0 16px" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "var(--admin-text-muted)" }}>Remaining</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--admin-text)", fontVariantNumeric: "tabular-nums" }}>{timer.remainingFormatted}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "var(--admin-text-muted)" }}>Progress</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#10b981" }}>{Math.round(timer.progress)}%</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Logout Confirm Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)",
              display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: "var(--admin-card-bg)", borderRadius: 16, border: "1px solid var(--admin-border)",
                padding: 32, maxWidth: 400, width: "100%", textAlign: "center"
              }}
            >
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <LogOut size={32} />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--admin-text)", margin: "0 0 12px 0" }}>End Shift & Logout?</h2>
              <p style={{ fontSize: 14, color: "var(--admin-text-dim)", margin: "0 0 32px 0", lineHeight: 1.5 }}>
                Are you sure you want to end your shift? Your session data and work timer will be finalized.
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="admin-btn-secondary" style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  onClick={logout}
                  className="admin-btn-primary" style={{ flex: 1, background: "var(--admin-rose)" }}
                >
                  End Shift
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

const Badge: React.FC<{ active: boolean; icon: React.ReactNode; label: string; color: string }> = ({ active, icon, label, color }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 6,
    padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600,
    background: active ? `${color}20` : "var(--admin-border)",
    color: active ? color : "var(--admin-text-muted)",
    border: `1px solid ${active ? color : "transparent"}`,
    transition: "all 0.2s"
  }}>
    {icon} {label}
  </div>
);

export default HWDashboard;
