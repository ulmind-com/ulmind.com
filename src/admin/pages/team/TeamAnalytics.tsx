import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getTeamHRDashboardAPI, getTeamAttendanceAPI, getTeamPerformanceAPI } from "../../lib/api";
import { Loader2, TrendingUp, Users, BarChart2, Activity } from "lucide-react";

const TeamAnalytics: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [performance, setPerformance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTeamHRDashboardAPI(), getTeamAttendanceAPI(), getTeamPerformanceAPI()])
      .then(([s, a, p]) => { setStats(s); setAttendance(a); setPerformance(p); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin" size={40} color="#64748b" /></div>;

  // Attendance breakdown
  const attBreakdown: Record<string, number> = {};
  attendance.forEach(r => { attBreakdown[r.status] = (attBreakdown[r.status] || 0) + 1; });
  const totalAtt = attendance.length || 1;

  // Top performers
  const topPerformers = [...performance].sort((a, b) => (b.overall_score || 0) - (a.overall_score || 0)).slice(0, 5);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Team Analytics</h2>
      <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 24 }}>Enterprise workforce analytics and performance insights.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Attendance Breakdown */}
        <div className="admin-glass-panel" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}><Activity size={18} color="#10b981" /> Attendance Breakdown</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Object.entries(attBreakdown).length > 0 ? Object.entries(attBreakdown).map(([status, count]) => {
              const pct = ((count / totalAtt) * 100).toFixed(1);
              const c: any = { Present: "#10b981", Absent: "#ef4444", "Half Day": "#f59e0b", Leave: "#f59e0b", Remote: "#38bdf8" };
              return (
                <div key={status}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ color: "#cbd5e1", fontSize: 13 }}>{status}</span>
                    <span style={{ color: c[status] || "#64748b", fontWeight: 600, fontSize: 13 }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3 }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: c[status] || "#64748b", borderRadius: 3 }} />
                  </div>
                </div>
              );
            }) : <p style={{ color: "#64748b" }}>No attendance records yet.</p>}
          </div>
        </div>

        {/* Top Performers */}
        <div className="admin-glass-panel" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}><TrendingUp size={18} color="#38bdf8" /> Top Performers</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {topPerformers.length > 0 ? topPerformers.map((p, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: i === 0 ? "#f59e0b" : "#64748b", fontWeight: 700, fontSize: 14, width: 20 }}>#{i + 1}</span>
                  <span style={{ color: "#cbd5e1", fontSize: 14 }}>{p.employee_id}</span>
                </div>
                <span style={{ color: (p.overall_score || 0) >= 80 ? "#10b981" : "#f59e0b", fontWeight: 700 }}>{(p.overall_score || 0).toFixed(1)}/100</span>
              </div>
            )) : <p style={{ color: "#64748b" }}>No performance reviews yet.</p>}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[
          { label: "Total Employees", value: stats?.total_members ?? 0, color: "#38bdf8" },
          { label: "Active Rate", value: `${stats?.total_members ? ((stats.active_members / stats.total_members) * 100).toFixed(0) : 0}%`, color: "#10b981" },
          { label: "Avg Performance", value: `${stats?.avg_performance ?? 0}/100`, color: "#a78bfa" },
          { label: "Attendance Rate", value: `${stats?.attendance_rate ?? 0}%`, color: "#f59e0b" },
        ].map(s => (
          <div key={s.label} className="admin-glass-panel" style={{ padding: 20 }}>
            <p style={{ color: "#94a3b8", fontSize: 13 }}>{s.label}</p>
            <p style={{ color: s.color, fontSize: 22, fontWeight: 700 }}>{s.value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default TeamAnalytics;
