/* ──────────────────────────────────────────────────────────────
   HW Admin Dashboard — Manager's Monitoring Overview
   Live employee grid, alerts, leaderboard, productivity
   ────────────────────────────────────────────────────────────── */

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Activity, Clock, AlertTriangle, Trophy, BarChart3,
  Eye, Camera, CameraOff, Wifi, WifiOff, Shield, RefreshCw,
  ChevronRight, TrendingUp, ArrowLeft, Zap, Coffee, Moon,
  Smartphone, User, CheckCircle, XCircle,
} from "lucide-react";
import { getLiveStatus, getLeaderboard, getProductivityScore, getDailyReport } from "../../lib/hw-api";
import "../../admin.css";

interface LiveEmployee {
  employee_id: string;
  employee_db_id: string;
  name: string;
  email: string;
  designation: string;
  status: string;
  session_id: string | null;
  camera_state: string;
  face_detected: boolean;
  current_event: string | null;
  login_time: string | null;
  session_duration_seconds: number;
  active_seconds: number;
  idle_seconds: number;
  mobile_detected: boolean;
  sleeping_detected: boolean;
  last_heartbeat: string | null;
  productivity_score: number;
}

interface DashboardData {
  total_employees: number;
  online: number;
  offline: number;
  idle: number;
  on_lunch: number;
  alerts: number;
  avg_productivity: number;
  total_working_hours_today: number;
}

const HWAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [employees, setEmployees] = useState<LiveEmployee[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<LiveEmployee | null>(null);
  const [dailyReport, setDailyReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = async () => {
    try {
      const [liveRes, leaderRes] = await Promise.all([
        getLiveStatus(),
        getLeaderboard(),
      ]);
      if (liveRes.status === "success") {
        setDashboard(liveRes.dashboard);
        setEmployees(liveRes.employees || []);
      }
      if (leaderRes.status === "success") {
        setLeaderboard(leaderRes.leaderboard || []);
      }
      setLastRefresh(new Date());
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    pollRef.current = setInterval(fetchData, 15000); // Refresh every 15s
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const handleEmployeeClick = async (emp: LiveEmployee) => {
    setSelectedEmployee(emp);
    try {
      const report = await getDailyReport(emp.employee_db_id);
      if (report.status === "success") {
        setDailyReport(report);
      }
    } catch (e) {
      console.error("Report fetch error:", e);
    }
  };

  const formatDuration = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
    online: { color: "#10b981", bg: "rgba(16,185,129,0.1)", icon: <CheckCircle size={14} /> },
    idle: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", icon: <Clock size={14} /> },
    offline: { color: "#64748b", bg: "rgba(100,116,139,0.1)", icon: <XCircle size={14} /> },
    lunch: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", icon: <Coffee size={14} /> },
    alert: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", icon: <AlertTriangle size={14} /> },
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#030712",
      color: "#fff",
      fontFamily: "'Inter', system-ui, sans-serif",
      padding: "24px",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 24, flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <Shield size={22} color="#3b82f6" /> Monitoring Center
            </h1>
            <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>
              Live employee monitoring • Last updated: {lastRefresh.toLocaleTimeString("en-IN")}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => navigate("/admin/hardware/employees")}
            style={{
              padding: "8px 16px", borderRadius: 10,
              background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
              color: "#93c5fd", fontSize: 12, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <Users size={14} /> Manage Employees
          </button>
          <button
            onClick={fetchData}
            style={{
              padding: "8px 16px", borderRadius: 10,
              background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)",
              color: "#6ee7b7", fontSize: 12, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {dashboard && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 24 }}>
          <KpiCard icon={<Users size={18} />} label="Total" value={dashboard.total_employees} color="#3b82f6" />
          <KpiCard icon={<CheckCircle size={18} />} label="Online" value={dashboard.online} color="#10b981" />
          <KpiCard icon={<XCircle size={18} />} label="Offline" value={dashboard.offline} color="#64748b" />
          <KpiCard icon={<Clock size={18} />} label="Idle" value={dashboard.idle} color="#f59e0b" />
          <KpiCard icon={<Coffee size={18} />} label="Lunch" value={dashboard.on_lunch} color="#f59e0b" />
          <KpiCard icon={<AlertTriangle size={18} />} label="Alerts" value={dashboard.alerts} color="#ef4444" />
          <KpiCard icon={<TrendingUp size={18} />} label="Avg Score" value={`${dashboard.avg_productivity}%`} color="#8b5cf6" />
          <KpiCard icon={<Clock size={18} />} label="Hours" value={`${dashboard.total_working_hours_today.toFixed(1)}`} color="#06b6d4" />
        </div>
      )}

      {/* Employee Grid + Leaderboard */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        {/* Employee Cards Grid */}
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Eye size={18} color="#3b82f6" /> Live Employee Status
          </h2>

          {loading ? (
            <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>Loading...</div>
          ) : employees.length === 0 ? (
            <div style={{
              textAlign: "center", padding: 40,
              background: "rgba(15,23,42,0.5)", borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <Users size={40} color="#475569" style={{ margin: "0 auto 12px" }} />
              <p style={{ color: "#64748b", fontSize: 14 }}>No employees registered yet.</p>
              <button
                onClick={() => navigate("/admin/hardware/employees")}
                style={{
                  marginTop: 12, padding: "8px 20px", borderRadius: 10,
                  background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                  color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}
              >
                Add Employees
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
              {employees.map((emp) => {
                const cfg = statusConfig[emp.status] || statusConfig.offline;
                const hasAlert = emp.mobile_detected || emp.sleeping_detected || emp.camera_state === "covered";
                
                return (
                  <motion.div
                    key={emp.employee_id}
                    whileHover={{ scale: 1.02, borderColor: `${cfg.color}44` }}
                    onClick={() => handleEmployeeClick(emp)}
                    style={{
                      background: hasAlert ? "rgba(239,68,68,0.03)" : "rgba(15,23,42,0.5)",
                      border: `1px solid ${hasAlert ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.06)"}`,
                      borderRadius: 16, padding: 18, cursor: "pointer",
                      backdropFilter: "blur(10px)",
                      transition: "all 0.2s",
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: 12,
                          background: `linear-gradient(135deg, ${cfg.color}33, ${cfg.color}11)`,
                          border: `1px solid ${cfg.color}33`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 16, fontWeight: 800, color: cfg.color,
                        }}>
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{emp.name}</h4>
                          <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>{emp.designation}</p>
                        </div>
                      </div>

                      {/* Status indicator */}
                      <div style={{
                        padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700,
                        background: cfg.bg, color: cfg.color,
                        display: "flex", alignItems: "center", gap: 4,
                        textTransform: "uppercase", letterSpacing: "0.05em",
                      }}>
                        <div style={{
                          width: 6, height: 6, borderRadius: "50%",
                          background: cfg.color,
                          boxShadow: emp.status === "online" ? `0 0 6px ${cfg.color}` : "none",
                          animation: emp.status === "online" ? "pulse 2s infinite" : "none",
                        }} />
                        {emp.status}
                      </div>
                    </div>

                    {/* Metrics */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 16 }}>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {emp.session_id && emp.login_time && (
                          <div style={{
                            padding: "4px 10px", borderRadius: 8, fontSize: 10,
                            background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
                            display: "flex", alignItems: "center", gap: 6
                          }}>
                            <Clock size={12} color="#3b82f6" />
                            <span style={{ color: "#60a5fa" }}>In:</span>
                            <span style={{ color: "#93c5fd", fontWeight: 800 }}>
                              {new Date(emp.login_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        )}
                        {emp.session_id && (
                          <div style={{
                            padding: "4px 10px", borderRadius: 8, fontSize: 10,
                            background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)",
                            display: "flex", alignItems: "center", gap: 6
                          }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", animation: "pulse 2s infinite" }} />
                            <span style={{ color: "#34d399", fontWeight: 600 }}>Active Track:</span>
                            <span style={{ color: "#10b981", fontWeight: 800 }}>{formatDuration(emp.active_seconds)} / {formatDuration(emp.session_duration_seconds)}</span>
                          </div>
                        )}
                      </div>
                      
                      <ScoreBar label="AI Productivity Score" value={emp.productivity_score} />
                    </div>

                    {/* Alert indicators */}
                    {hasAlert && (
                      <div style={{ display: "flex", gap: 6 }}>
                        {emp.mobile_detected && (
                          <span style={{
                            padding: "2px 8px", borderRadius: 4, fontSize: 9, fontWeight: 700,
                            background: "rgba(239,68,68,0.1)", color: "#fca5a5",
                          }}>📱 Mobile</span>
                        )}
                        {emp.sleeping_detected && (
                          <span style={{
                            padding: "2px 8px", borderRadius: 4, fontSize: 9, fontWeight: 700,
                            background: "rgba(239,68,68,0.1)", color: "#fca5a5",
                          }}>😴 Sleeping</span>
                        )}
                        {emp.camera_state === "covered" && (
                          <span style={{
                            padding: "2px 8px", borderRadius: 4, fontSize: 9, fontWeight: 700,
                            background: "rgba(239,68,68,0.1)", color: "#fca5a5",
                          }}>📷 Covered</span>
                        )}
                      </div>
                    )}

                    {/* Camera & Face */}
                    <div style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      marginTop: 8, paddingTop: 8,
                      borderTop: "1px solid rgba(255,255,255,0.04)",
                      fontSize: 10, color: "#475569",
                    }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        {emp.camera_state === "on" ? <Camera size={10} color="#10b981" /> : <CameraOff size={10} color="#ef4444" />}
                        Camera {emp.camera_state}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        {emp.face_detected ? <Eye size={10} color="#10b981" /> : <User size={10} color="#64748b" />}
                        {emp.face_detected ? "Face ✓" : "No face"}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div style={{
          background: "rgba(15,23,42,0.5)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 20, padding: 24,
          backdropFilter: "blur(20px)",
          alignSelf: "start",
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Trophy size={16} color="#f59e0b" /> Today's Leaderboard
          </h3>

          {leaderboard.length === 0 ? (
            <p style={{ fontSize: 12, color: "#475569", textAlign: "center", padding: 20 }}>
              No data yet
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {leaderboard.map((entry, i) => (
                <div
                  key={entry.employee_id}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 12px", borderRadius: 10,
                    background: i === 0 ? "rgba(245,158,11,0.05)" : i === 1 ? "rgba(192,192,192,0.03)" : "rgba(0,0,0,0.1)",
                    border: `1px solid ${i === 0 ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.03)"}`,
                  }}
                >
                  <span style={{
                    width: 24, height: 24, borderRadius: 8, fontSize: 12, fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: i === 0 ? "rgba(245,158,11,0.2)" : i === 1 ? "rgba(192,192,192,0.1)" : i === 2 ? "rgba(205,127,50,0.1)" : "rgba(255,255,255,0.03)",
                    color: i === 0 ? "#f59e0b" : i === 1 ? "#c0c0c0" : i === 2 ? "#cd7f32" : "#64748b",
                  }}>
                    {entry.rank}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, margin: 0 }}>{entry.employee_name}</p>
                    <p style={{ fontSize: 10, color: "#64748b", margin: 0 }}>{entry.designation}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{
                      fontSize: 14, fontWeight: 800, margin: 0,
                      color: entry.productivity_score >= 80 ? "#10b981"
                        : entry.productivity_score >= 50 ? "#f59e0b"
                        : "#ef4444",
                    }}>
                      {entry.productivity_score}%
                    </p>
                    <p style={{ fontSize: 9, color: "#64748b", margin: 0 }}>{entry.active_hours.toFixed(1)}h active</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Employee Detail Modal */}
      <AnimatePresence>
        {selectedEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 100,
              background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 20,
            }}
            onClick={() => { setSelectedEmployee(null); setDailyReport(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: "rgba(15,23,42,0.95)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 24, padding: 32, maxWidth: 500, width: "100%",
                maxHeight: "80vh", overflowY: "auto",
              }}
            >
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{selectedEmployee.name}</h2>
              <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>
                {selectedEmployee.designation} • {selectedEmployee.employee_id}
              </p>

              {/* LIVE METRICS SUBSECTION */}
              <div style={{
                marginBottom: 20, padding: 16, borderRadius: 12,
                background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)"
              }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: "#10b981", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", animation: "pulse 2s infinite" }} />
                  Live AI Tracking Monitor
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <MiniStat label="Status" value={selectedEmployee.status.toUpperCase()} />
                  <MiniStat label="Camera" value={selectedEmployee.camera_state.toUpperCase()} />
                  <MiniStat label="Active AI Track" value={formatDuration(selectedEmployee.active_seconds)} />
                  <MiniStat label="Live Score" value={`${selectedEmployee.productivity_score}%`} />
                </div>
                {selectedEmployee.current_event && (
                  <div style={{ marginTop: 12, padding: "6px 12px", background: "rgba(0,0,0,0.2)", borderRadius: 6, fontSize: 11 }}>
                    <span style={{ color: "#94a3b8" }}>Current Activity: </span>
                    <span style={{ color: "#fff", fontWeight: 600 }}>{selectedEmployee.current_event.replace(/_/g, " ").toUpperCase()}</span>
                  </div>
                )}
              </div>

              {dailyReport ? (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: "#3b82f6", marginBottom: 8 }}>Today's Scores</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <ScoreBar label="Overall" value={dailyReport.scores?.overall_productivity_score ?? 0} />
                      <ScoreBar label="Attendance" value={dailyReport.scores?.attendance_score ?? 0} />
                      <ScoreBar label="Presence" value={dailyReport.scores?.presence_score ?? 0} />
                      <ScoreBar label="Focus" value={dailyReport.scores?.focus_score ?? 0} />
                    </div>
                  </div>

                  {dailyReport.ai_summary && (
                    <div style={{
                      padding: 14, borderRadius: 12,
                      background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.1)",
                      marginBottom: 16,
                    }}>
                      <h4 style={{ fontSize: 12, fontWeight: 700, color: "#93c5fd", marginBottom: 6 }}>🤖 AI Analysis</h4>
                      <p style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.5, margin: 0 }}>
                        {dailyReport.ai_summary}
                      </p>
                    </div>
                  )}

                  {dailyReport.ai_recommendations?.length > 0 && (
                    <div>
                      <h4 style={{ fontSize: 12, fontWeight: 700, color: "#a78bfa", marginBottom: 8 }}>💡 Recommendations</h4>
                      {dailyReport.ai_recommendations.map((rec: string, i: number) => (
                        <p key={i} style={{ fontSize: 11, color: "#94a3b8", margin: "4px 0", paddingLeft: 12, borderLeft: "2px solid rgba(167,139,250,0.3)" }}>
                          {rec}
                        </p>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p style={{ fontSize: 13, color: "#64748b", textAlign: "center", padding: 20 }}>
                  Loading report...
                </p>
              )}

              <button
                onClick={() => { setSelectedEmployee(null); setDailyReport(null); }}
                style={{
                  marginTop: 20, width: "100%", padding: "10px", borderRadius: 12,
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#e2e8f0", fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────

const KpiCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color: string }> = ({ icon, label, value, color }) => (
  <div style={{
    background: "rgba(15,23,42,0.5)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 14, padding: "16px 18px",
    backdropFilter: "blur(10px)",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
      <div style={{ color }}>{icon}</div>
      <span style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
    </div>
    <p style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: 0 }}>{value}</p>
  </div>
);

const MiniStat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{
    padding: "3px 8px", borderRadius: 6, fontSize: 9,
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)",
  }}>
    <span style={{ color: "#475569" }}>{label}: </span>
    <span style={{ color: "#94a3b8", fontWeight: 700 }}>{value}</span>
  </div>
);

const ScoreBar: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
      <span style={{ color: "#94a3b8" }}>{label}</span>
      <span style={{ fontWeight: 700, color: value >= 80 ? "#10b981" : value >= 50 ? "#f59e0b" : "#ef4444" }}>{value.toFixed(0)}%</span>
    </div>
    <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.05)" }}>
      <div style={{
        height: "100%", borderRadius: 2, width: `${Math.min(100, value)}%`,
        background: value >= 80 ? "#10b981" : value >= 50 ? "#f59e0b" : "#ef4444",
        transition: "width 0.5s ease",
      }} />
    </div>
  </div>
);

export default HWAdminDashboard;
