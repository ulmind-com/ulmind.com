import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getTeamHRDashboardAPI } from "../../lib/api";
import { Loader2, Crown, Users, CalendarCheck, Clock } from "lucide-react";

const TeamLeaderDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);
  const fetchStats = async () => {
    try { setStats(await getTeamHRDashboardAPI()); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin" size={40} color="#64748b" /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Team Leader Dashboard</h2>
      <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 24 }}>Command center for team leaders and managers.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Team Size", value: stats?.total_members ?? 0, icon: <Users size={20} color="#38bdf8" /> },
          { label: "Present Today", value: stats?.present_today ?? 0, icon: <CalendarCheck size={20} color="#10b981" /> },
          { label: "Pending Leaves", value: stats?.pending_leaves ?? 0, icon: <Crown size={20} color="#f59e0b" /> },
          { label: "Hours Logged", value: `${(stats?.total_hours_logged ?? 0).toFixed(0)}h`, icon: <Clock size={20} color="#a78bfa" /> },
        ].map(s => (
          <div key={s.label} className="admin-glass-panel" style={{ padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
            {s.icon}
            <div>
              <p style={{ color: "#94a3b8", fontSize: 13 }}>{s.label}</p>
              <p style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="admin-glass-panel" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 16 }}>Quick Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {["Assign Task", "Approve Leave", "Review Work Log", "Schedule Meeting", "Generate Report"].map(action => (
              <button key={action} className="admin-btn admin-btn-ghost" style={{ justifyContent: "flex-start", padding: "10px 14px" }}>{action}</button>
            ))}
          </div>
        </div>
        <div className="admin-glass-panel" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 16 }}>Team Health</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "#94a3b8", fontSize: 13 }}>Attendance Rate</span>
                <span style={{ color: "#10b981", fontWeight: 600 }}>{stats?.attendance_rate ?? 0}%</span>
              </div>
              <div style={{ height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${stats?.attendance_rate ?? 0}%`, height: "100%", background: "#10b981", borderRadius: 4 }} />
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "#94a3b8", fontSize: 13 }}>Avg Performance</span>
                <span style={{ color: "#38bdf8", fontWeight: 600 }}>{stats?.avg_performance ?? 0}/100</span>
              </div>
              <div style={{ height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${stats?.avg_performance ?? 0}%`, height: "100%", background: "#38bdf8", borderRadius: 4 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamLeaderDashboard;
