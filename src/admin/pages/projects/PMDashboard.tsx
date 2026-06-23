import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getPmDashboardAPI } from "../../lib/api";
import { FolderOpen, ListTodo, Clock, DollarSign, Loader2, TrendingUp, AlertTriangle, Flag, Activity } from "lucide-react";

const PMDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try { setStats(await getPmDashboardAPI()); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin" size={40} color="#64748b" /></div>;

  const kpis = [
    { label: "Total Projects", value: stats?.total_projects || 0, icon: <FolderOpen size={18} />, color: "#38bdf8" },
    { label: "Active Projects", value: stats?.active_projects || 0, icon: <Activity size={18} />, color: "#10b981" },
    { label: "Completed", value: stats?.completed_projects || 0, icon: <TrendingUp size={18} />, color: "#a78bfa" },
    { label: "Delayed", value: stats?.delayed_projects || 0, icon: <AlertTriangle size={18} />, color: "#f59e0b" },
    { label: "Total Tasks", value: stats?.total_tasks || 0, icon: <ListTodo size={18} />, color: "#06b6d4" },
    { label: "Overdue Tasks", value: stats?.overdue_tasks || 0, icon: <AlertTriangle size={18} />, color: "#ef4444" },
    { label: "Hours Logged", value: `${stats?.total_hours?.toFixed(1) || 0}h`, icon: <Clock size={18} />, color: "#818cf8" },
    { label: "Budget Utilization", value: stats?.total_budget ? `${((stats?.total_spent / stats?.total_budget) * 100).toFixed(0)}%` : "0%", icon: <DollarSign size={18} />, color: "#f97316" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>Project Dashboard</h2>
          <p style={{ fontSize: 14, color: "#94a3b8", marginTop: 4 }}>Enterprise project metrics and performance overview.</p>
        </div>
        <button className="admin-btn admin-btn-primary">Generate Report</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
        {kpis.map(kpi => (
          <div key={kpi.label} className="admin-glass-panel" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500 }}>{kpi.label}</span>
              <span style={{ color: kpi.color }}>{kpi.icon}</span>
            </div>
            <h3 style={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>{kpi.value}</h3>
          </div>
        ))}
      </div>

      {/* Budget Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div className="admin-glass-panel" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 16 }}>Budget Overview</h3>
          <div style={{ display: "flex", gap: 32 }}>
            <div>
              <p style={{ color: "#94a3b8", fontSize: 13 }}>Total Budget</p>
              <p style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>${stats?.total_budget?.toLocaleString() || 0}</p>
            </div>
            <div>
              <p style={{ color: "#94a3b8", fontSize: 13 }}>Total Spent</p>
              <p style={{ color: "#f59e0b", fontSize: 22, fontWeight: 700 }}>${stats?.total_spent?.toLocaleString() || 0}</p>
            </div>
            <div>
              <p style={{ color: "#94a3b8", fontSize: 13 }}>Remaining</p>
              <p style={{ color: "#10b981", fontSize: 22, fontWeight: 700 }}>${((stats?.total_budget || 0) - (stats?.total_spent || 0)).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="admin-glass-panel" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 16 }}>Upcoming Milestones</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {stats?.upcoming_milestones?.length > 0 ? stats.upcoming_milestones.map((ms: any, i: number) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ color: "#cbd5e1", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}><Flag size={14} color="#f59e0b" /> {ms.title}</span>
                <span style={{ color: "#64748b", fontSize: 12 }}>{ms.due_date ? new Date(ms.due_date).toLocaleDateString() : "No date"}</span>
              </div>
            )) : <p style={{ color: "#64748b", fontSize: 14 }}>No upcoming milestones.</p>}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PMDashboard;
