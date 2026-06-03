import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Clock, LogOut, CheckCircle2, User, Loader2 } from "lucide-react";
import { getSessionsAPI } from "../lib/api";
import { useAuth } from "../context/auth-context";

interface Session {
  _id: string;
  admin_id: string;
  admin_name: string;
  admin_email: string;
  admin_role: string;
  admin_photo: string | null;
  login_time: string;
  logout_time: string | null;
  last_heartbeat: string;
  is_online: boolean;
  duration_minutes: number;
}

const ActivityTrackerPage: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getSessionsAPI();
      setSessions(data);
    } catch (err: any) {
      setError(err.message || "Failed to load activity sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    // Refresh every 30 seconds
    const interval = setInterval(fetchSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  if (user?.role?.toLowerCase() !== "super_admin") {
    return (
      <div style={{ padding: 64, textAlign: "center", color: "#f87171" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>Access Denied</h2>
        <p>You do not have permission to view the activity tracker.</p>
      </div>
    );
  }

  const onlineSessions = sessions.filter((s) => s.is_online);
  const pastSessions = sessions.filter((s) => !s.is_online);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ position: "relative", minHeight: "100%", paddingBottom: 40 }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#ffffff", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 12 }}>
            <Activity size={28} color="#10b981" /> Activity Tracker
          </h2>
          <p style={{ fontSize: 14, color: "#94a3b8", marginTop: 6 }}>
            Real-time monitoring of team sessions and access duration.
          </p>
        </div>
      </div>

      {loading && sessions.length === 0 ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 64 }}>
          <Loader2 size={32} className="animate-spin text-foreground/40" />
        </div>
      ) : error ? (
        <div style={{ padding: 24, background: "rgba(225,29,72,0.1)", border: "1px solid rgba(225,29,72,0.3)", borderRadius: 12, color: "#f87171" }}>
          {error}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          
          {/* Online Section */}
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f8fafc", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 10px #10b981" }} />
              Currently Online ({onlineSessions.length})
            </h3>
            
            {onlineSessions.length === 0 ? (
              <div style={{ padding: 24, background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 16, color: "#94a3b8", textAlign: "center" }}>
                No active sessions at the moment.
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {onlineSessions.map(session => (
                  <motion.div
                    key={session._id}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="admin-card"
                    style={{
                      padding: 20,
                      background: "rgba(16, 185, 129, 0.05)",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                      borderRadius: 20,
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                      position: "relative",
                      overflow: "hidden"
                    }}
                  >
                    <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: "#10b981", opacity: 0.1, filter: "blur(30px)" }} />
                    
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {session.admin_photo ? (
                        <img src={session.admin_photo} alt={session.admin_name} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(16, 185, 129, 0.5)" }} />
                      ) : (
                        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981", fontWeight: 700, fontSize: 18, border: "2px solid rgba(16, 185, 129, 0.5)" }}>
                          {session.admin_email.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 700, color: "#fff", fontSize: 15 }}>{session.admin_name}</div>
                        <div style={{ fontSize: 12, color: "#94a3b8" }}>{session.admin_email}</div>
                      </div>
                    </div>
                    
                    <div style={{ height: 1, background: "rgba(16, 185, 129, 0.1)" }} />
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#10b981", fontSize: 13, fontWeight: 600 }}>
                        <Clock size={14} /> {session.duration_minutes} min
                      </div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>
                        Logged in: {new Date(session.login_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          
          {/* Past Sessions Section */}
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f8fafc", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <LogOut size={16} color="#94a3b8" /> Past Sessions
            </h3>
            
            <div style={{ background: "rgba(20, 20, 22, 0.6)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(0,0,0,0.3)", textAlign: "left" }}>
                    <th style={{ padding: "16px 20px", fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase" }}>Member</th>
                    <th style={{ padding: "16px 20px", fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase" }}>Login Time</th>
                    <th style={{ padding: "16px 20px", fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase" }}>Logout Time</th>
                    <th style={{ padding: "16px 20px", fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", textAlign: "right" }}>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {pastSessions.map((session, i) => (
                    <tr key={session._id} style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                           {session.admin_photo ? (
                            <img src={session.admin_photo} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
                           ) : (
                             <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>
                                {session.admin_email.charAt(0).toUpperCase()}
                             </div>
                           )}
                           <div>
                             <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{session.admin_name}</div>
                             <div style={{ fontSize: 12, color: "#64748b" }}>{session.admin_role}</div>
                           </div>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px", fontSize: 14, color: "#cbd5e1" }}>
                        {new Date(session.login_time).toLocaleString()}
                      </td>
                      <td style={{ padding: "16px 20px", fontSize: 14, color: "#cbd5e1" }}>
                        {session.logout_time ? new Date(session.logout_time).toLocaleString() : "—"}
                      </td>
                      <td style={{ padding: "16px 20px", fontSize: 14, fontWeight: 600, color: "#f8fafc", textAlign: "right" }}>
                        {session.duration_minutes} min
                      </td>
                    </tr>
                  ))}
                  {pastSessions.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
                        No past session data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </motion.div>
  );
};

export default ActivityTrackerPage;
