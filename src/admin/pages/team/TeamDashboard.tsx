import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getTeamHRDashboardAPI } from "../../lib/api";
import { Users, UserCheck, CalendarCheck, Plane, BarChart2, Clock, Loader2, UserPlus, TrendingUp } from "lucide-react";

const TeamDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);
  const fetchStats = async () => {
    try { setStats(await getTeamHRDashboardAPI()); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin" size={40} color="#64748b" /></div>;

  const kpis = [
    { label: "Total Employees", value: stats?.total_members ?? 0, icon: <Users size={18} />, color: "#38bdf8" },
    { label: "Active Employees", value: stats?.active_members ?? 0, icon: <UserCheck size={18} />, color: "#10b981" },
    { label: "Present Today", value: stats?.present_today ?? 0, icon: <CalendarCheck size={18} />, color: "#a78bfa" },
    { label: "On Leave", value: stats?.on_leave ?? 0, icon: <Plane size={18} />, color: "#f59e0b" },
    { label: "Attendance Rate", value: `${stats?.attendance_rate ?? 0}%`, icon: <TrendingUp size={18} />, color: "#06b6d4" },
    { label: "Avg Performance", value: `${stats?.avg_performance ?? 0}/100`, icon: <BarChart2 size={18} />, color: "#818cf8" },
    { label: "Pending Leaves", value: stats?.pending_leaves ?? 0, icon: <Plane size={18} />, color: "#ef4444" },
    { label: "Hours Logged", value: `${(stats?.total_hours_logged ?? 0).toFixed(1)}h`, icon: <Clock size={18} />, color: "#f97316" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>Team Dashboard</h2>
          <p style={{ color: "#94a3b8", fontSize: 14 }}>Workforce management & HR analytics overview.</p>
        </div>
        <button className="admin-btn admin-btn-primary">Generate HR Report</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
        {kpis.map(kpi => (
          <div key={kpi.label} className="admin-glass-panel" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500 }}>{kpi.label}</span>
              <span style={{ color: kpi.color }}>{kpi.icon}</span>
            </div>
            <h3 style={{ fontSize: 26, fontWeight: 700, color: "#fff" }}>{kpi.value}</h3>
          </div>
        ))}
      </div>

      {/* New Joiners */}
      <div className="admin-glass-panel" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}><UserPlus size={18} color="#10b981" /> Recent Members</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {stats?.new_joiners?.length > 0 ? stats.new_joiners.map((member: any, i: number) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #e11d48, #9f1239)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff" }}>
                  {member.email?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{member.full_name || member.email}</p>
                  <p style={{ color: "#64748b", fontSize: 12 }}>{member.position || "Staff Member"}</p>
                </div>
              </div>
              <span className={`admin-badge ${member.status === "Active" ? "admin-badge-success" : "admin-badge-warning"}`}>{member.status}</span>
            </div>
          )) : <p style={{ color: "#64748b", fontSize: 14 }}>No employees yet. Add members to see them here.</p>}
        </div>
      </div>
    </motion.div>
  );
};

export default TeamDashboard;
