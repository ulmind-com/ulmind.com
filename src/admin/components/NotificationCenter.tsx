import React, { useState } from "react";
import { Bell, X, CheckCircle2, AlertTriangle, Info, Zap, ShieldAlert, ArrowUpRight, Trash2, Wifi, WifiOff, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWebSocket } from "../context/WebSocketContext";
import { useNavigate } from "react-router-dom";

/** Legacy rows say "Warning"/"Info"; map both vocabularies onto one scale. */
const normalisePriority = (raw?: string) => {
  switch ((raw || "").toLowerCase()) {
    case "critical": return "Critical";
    case "high":
    case "warning": return "High";
    case "low":
    case "info": return "Low";
    default: return "Medium";
  }
};

const STYLES: Record<string, { color: string; icon: React.ReactNode }> = {
  Critical: { color: "#f43f5e", icon: <ShieldAlert size={15} /> },
  High: { color: "#f59e0b", icon: <AlertTriangle size={15} /> },
  Medium: { color: "#0ea5e9", icon: <Zap size={15} /> },
  Low: { color: "#10b981", icon: <Info size={15} /> },
};

const timeAgo = (iso: string) => {
  const then = new Date(iso).getTime();
  if (isNaN(then)) return "";
  const mins = Math.round((Date.now() - then) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
};

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, connected, markAllRead, markAsRead, removeNotification } = useWebSocket();
  const navigate = useNavigate();

  // The panel shows the most recent slice; the dashboard has the full list.
  const recent = notifications.slice(0, 25);

  return (
    <>
      <button
        className="admin-btn-ghost"
        style={{ padding: 8, borderRadius: 8, position: "relative" }}
        onClick={() => setIsOpen(true)}
        title={`${unreadCount} unread notifications`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={{
            position: "absolute", top: -2, right: -2, minWidth: 17, height: 17, padding: "0 4px",
            background: "var(--admin-rose)", borderRadius: 999, color: "#fff",
            fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 10px var(--admin-rose-glow)",
          }}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", zIndex: 100 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              style={{
                position: "fixed", top: 16, right: 16, bottom: 16, width: 420, maxWidth: "calc(100vw - 32px)",
                background: "rgba(14, 18, 30, 0.82)", zIndex: 101,
                borderRadius: 24, border: "1px solid rgba(255,255,255,0.10)",
                backdropFilter: "blur(24px)",
                display: "flex", flexDirection: "column",
                boxShadow: "0 24px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.10)",
              }}
            >
              <div style={{
                padding: "22px 22px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                    background: "linear-gradient(140deg, rgba(244,63,94,0.20), rgba(14,165,233,0.16))",
                    border: "1px solid rgba(255,255,255,0.09)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Bell size={17} color="#fb7185" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 650, margin: 0 }}>Notifications</h3>
                    <span style={{ fontSize: 11.5, color: "var(--admin-text-dim)", display: "flex", alignItems: "center", gap: 5 }}>
                      {connected ? <Wifi size={10} color="#34d399" /> : <WifiOff size={10} />}
                      {unreadCount} unread
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                  <button
                    onClick={markAllRead}
                    disabled={unreadCount === 0}
                    style={{
                      background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)",
                      color: "var(--admin-text)", fontSize: 12, padding: "6px 12px", borderRadius: 10,
                      cursor: unreadCount === 0 ? "not-allowed" : "pointer", opacity: unreadCount === 0 ? 0.4 : 1,
                    }}
                  >
                    Mark all read
                  </button>
                  <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "var(--admin-text-muted)", cursor: "pointer", display: "flex" }}>
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div style={{ padding: 14, overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                {recent.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "56px 20px", color: "var(--admin-text-dim)" }}>
                    <CheckCircle2 size={44} style={{ opacity: 0.25, margin: "0 auto 14px" }} />
                    <p style={{ margin: 0 }}>You're all caught up!</p>
                  </div>
                ) : recent.map((n) => {
                  const level = normalisePriority(n.priority);
                  const { color, icon } = STYLES[level];
                  const unread = !n.is_read;
                  return (
                    <motion.div
                      layout
                      key={n._id}
                      style={{
                        background: unread ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.02)",
                        border: `1px solid ${unread ? `${color}2b` : "rgba(255,255,255,0.05)"}`,
                        borderRadius: 14, padding: 14,
                        position: "relative", overflow: "hidden", transition: "all 0.2s",
                      }}
                    >
                      {unread && (
                        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: color }} />
                      )}
                      <div style={{ display: "flex", gap: 11 }}>
                        <div style={{ color, marginTop: 1, flexShrink: 0 }}>{icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 4 }}>
                            <span style={{ fontWeight: 620, fontSize: 13.5, color: unread ? "#fff" : "var(--admin-text-muted)" }}>
                              {n.title}
                            </span>
                            <span style={{ fontSize: 11, color: "var(--admin-text-dim)", whiteSpace: "nowrap" }}>
                              {timeAgo(n.created_at)}
                            </span>
                          </div>
                          <p style={{ fontSize: 12.5, color: "var(--admin-text-muted)", margin: 0, lineHeight: 1.45 }}>
                            {n.message}
                          </p>
                          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            {n.ai_generated && (
                              <span style={{
                                fontSize: 10.5, padding: "3px 7px", borderRadius: 6,
                                background: "rgba(167,139,250,0.12)", color: "#a78bfa",
                                display: "inline-flex", alignItems: "center", gap: 4,
                              }}>
                                <Sparkles size={9} /> AI insight
                              </span>
                            )}
                            {n.link && (
                              <button
                                onClick={() => {
                                  if (unread) markAsRead(n._id);
                                  navigate(n.link!);
                                  setIsOpen(false);
                                }}
                                style={{
                                  display: "inline-flex", alignItems: "center", gap: 4,
                                  background: "rgba(56,189,248,0.10)", border: "1px solid rgba(56,189,248,0.20)",
                                  color: "#38bdf8", fontSize: 11.5, fontWeight: 600,
                                  padding: "4px 9px", borderRadius: 7, cursor: "pointer",
                                }}
                              >
                                {n.recommended_action || "Open"} <ArrowUpRight size={11} />
                              </button>
                            )}
                            <button
                              onClick={() => removeNotification(n._id)}
                              title="Dismiss"
                              style={{
                                marginLeft: "auto", background: "none", border: "none",
                                color: "var(--admin-text-dim)", cursor: "pointer", display: "flex", padding: 2,
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {notifications.length > recent.length && (
                <button
                  onClick={() => { navigate("/admin/notifications"); setIsOpen(false); }}
                  style={{
                    margin: 14, marginTop: 0, padding: "11px", borderRadius: 12,
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                    color: "var(--admin-text)", fontSize: 13, fontWeight: 600, cursor: "pointer",
                  }}
                >
                  View all {notifications.length} notifications
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NotificationCenter;
