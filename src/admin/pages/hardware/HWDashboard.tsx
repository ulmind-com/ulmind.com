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
import { getProductivityScore, getLeaderboard } from "../../lib/hw-api";
import { playAlertBeep } from "../../lib/beep";
import "../../admin.css";

// Maps the timer state → a human-facing status chip (label + colour + icon).
function getWorkStatus(timer: any) {
  if (timer.isDutyCompleted) return { label: "Shift Complete", color: "#10b981", icon: <CheckCircle size={14} /> };
  if (timer.isRunning) return { label: "Working", color: "#10b981", icon: <Activity size={14} /> };
  switch (timer.pauseReason as string | null) {
    case "sleeping": return { label: "Paused · Sleeping", color: "#8b5cf6", icon: <Moon size={14} /> };
    case "lunch": return { label: "Lunch Break", color: "#3b82f6", icon: <Coffee size={14} /> };
    case "camera": return { label: "Paused · Camera Off", color: "#ef4444", icon: <CameraOff size={14} /> };
    case "offline": return { label: "Offline", color: "#6b7280", icon: <WifiOff size={14} /> };
    case "away":
    default: return { label: "Paused · Away", color: "#f59e0b", icon: <AlertTriangle size={14} /> };
  }
}

const HWDashboard: React.FC = () => {
  const {
    employee, sessionId, isLoggedIn, sessionType, logout, isLunchBreak,
    stream, isCameraOn, isModelLoaded, isDetecting, lastResult, timer
  } = useHW();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [liveScore, setLiveScore] = useState<number | null>(null);
  const [liveRank, setLiveRank] = useState<string | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  // Attach the global stream to the local video element
  useEffect(() => {
    if (localVideoRef.current && stream) {
      localVideoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Poll the backend for today's real productivity score + leaderboard rank.
  useEffect(() => {
    if (!isLoggedIn || !employee?._id) return;
    let cancelled = false;

    const refresh = async () => {
      try {
        const prod = await getProductivityScore(employee._id);
        if (!cancelled && prod?.scores) {
          setLiveScore(Math.round(prod.scores.overall_productivity_score ?? 0));
        }
      } catch { /* ignore transient errors */ }
      try {
        const lb = await getLeaderboard();
        if (!cancelled && Array.isArray(lb?.leaderboard) && lb.leaderboard.length) {
          const total = lb.leaderboard.length;
          const me = lb.leaderboard.find((e: any) => e.employee_id === employee.employee_id);
          if (me?.rank) {
            const pct = Math.max(1, Math.round((me.rank / total) * 100));
            setLiveRank(me.rank === 1 ? "🏆 #1" : `#${me.rank} · Top ${pct}%`);
          }
        }
      } catch { /* ignore */ }
    };

    refresh();
    const id = setInterval(refresh, 30000);
    return () => { cancelled = true; clearInterval(id); };
  }, [isLoggedIn, employee?._id, employee?.employee_id]);

  if (!isLoggedIn || !employee) return null;

  const workStatus = getWorkStatus(timer);
  const displayScore = liveScore ?? employee.avg_productivity_score ?? 0;

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
                background: `${workStatus.color}0d`, border: `1px solid ${workStatus.color}33`,
                display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: workStatus.color,
                transition: "all 0.3s"
              }}>
                {workStatus.icon} <span>Status: <strong>{workStatus.label}</strong></span>
              </div>
              <div style={{
                flex: 1, padding: "8px 12px", borderRadius: 8,
                background: "rgba(59, 130, 246, 0.05)", border: "1px solid rgba(59, 130, 246, 0.2)",
                display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#3b82f6"
              }}>
                <Clock size={14} /> <span>Segment: <strong>{sessionType === "lunch" ? "Lunch Break" : sessionType === "afternoon" ? "Afternoon" : "Active"}</strong></span>
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
                <circle cx="100" cy="100" r="90" fill="none" stroke={workStatus.color} strokeWidth="6"
                  strokeDasharray="565" strokeDashoffset={565 - (565 * ((timer.progressPercent || 0) / 100))}
                  strokeLinecap="round"
                  style={{
                    transition: "stroke-dashoffset 1s linear, stroke 0.4s ease",
                    // Gently pulse the ring while the timer is paused.
                    animation: timer.isPaused ? "pulse 1.6s ease-in-out infinite" : "none",
                  }}
                />
              </svg>
              <div style={{
                position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center"
              }}>
                <div style={{
                  fontSize: 32, fontWeight: 700, fontVariantNumeric: "tabular-nums", letterSpacing: -1,
                  color: timer.isPaused ? "var(--admin-text-muted)" : "var(--admin-text)",
                  transition: "color 0.3s"
                }}>
                  {timer.isDutyCompleted ? "08:00:00" : (timer.formattedTime || "00:00:00")}
                </div>
                <div style={{ fontSize: 11, color: workStatus.color, marginTop: 6, textTransform: "uppercase", fontWeight: 700, letterSpacing: 1, display: "flex", alignItems: "center", gap: 5 }}>
                  {timer.isDutyCompleted ? <>Today Work Done 🎉</> : <>{workStatus.icon}{workStatus.label}</>}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginTop: 32, padding: "0 16px" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "var(--admin-text-muted)" }}>Remaining</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--admin-text)", fontVariantNumeric: "tabular-nums" }}>{timer.formattedRemaining || "00:00:00"}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "var(--admin-text-muted)" }}>Progress</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#10b981" }}>{Math.round(timer.progressPercent || 0)}%</div>
              </div>
            </div>
          </div>
          
          {/* AI Productivity Card */}
          <div className="hw-panel" style={{
            background: "var(--admin-card-bg)", borderRadius: 16, border: "1px solid var(--admin-border)",
            padding: 32, display: "flex", flexDirection: "column"
          }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, color: "var(--admin-text-muted)", letterSpacing: 1, textTransform: "uppercase", margin: "0 0 24px 0", display: "flex", alignItems: "center", gap: 8 }}>
              <BarChart3 size={16} color="#8b5cf6" /> Live AI Performance
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--admin-text-muted)", fontSize: 13, fontWeight: 600 }}>Face Productivity Score</span>
                <span style={{ fontSize: 24, fontWeight: 800, color: displayScore >= 80 ? "#10b981" : displayScore >= 50 ? "#f59e0b" : "#ef4444", transition: "color 0.4s" }}>
                  {displayScore}%
                </span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${Math.min(100, displayScore)}%`,
                  background: displayScore >= 80 ? "#10b981" : displayScore >= 50 ? "#f59e0b" : "#ef4444",
                  borderRadius: 3, transition: "width 1s ease"
                }} />
              </div>
              
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <div style={{ flex: 1, padding: 12, background: "rgba(255,255,255,0.02)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ fontSize: 10, color: "var(--admin-text-muted)", marginBottom: 4, textTransform: "uppercase", fontWeight: 700 }}>AI Tracker</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: timer.isRunning ? "#10b981" : "var(--admin-text-muted)", fontSize: 12, fontWeight: 600 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: timer.isRunning ? "#10b981" : "#6b7280", animation: timer.isRunning ? "pulse 2s infinite" : "none" }} />
                    {timer.isRunning ? "Tracking" : "Paused"}
                  </div>
                </div>
                <div style={{ flex: 1, padding: 12, background: "rgba(255,255,255,0.02)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.04)" }}>
                   <div style={{ fontSize: 10, color: "var(--admin-text-muted)", marginBottom: 4, textTransform: "uppercase", fontWeight: 700 }}>Current Rank</div>
                   <div style={{ color: "#f59e0b", fontSize: 13, fontWeight: 700 }}>{liveRank ?? "—"}</div>
                </div>
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
                  onClick={() => logout(false)}
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
