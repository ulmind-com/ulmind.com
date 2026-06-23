import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getCrmDashboardAPI } from "../../lib/api";
import { Users, DollarSign, Activity, Loader2, TrendingUp } from "lucide-react";

const CRMDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getCrmDashboardAPI();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin text-slate-500" size={40} /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>CRM Overview</h2>
          <p style={{ fontSize: 14, color: "#94a3b8", marginTop: 4 }}>Enterprise performance and pipeline metrics.</p>
        </div>
        <button className="admin-btn admin-btn-primary">Generate Report</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 24 }}>
        <div className="admin-glass-panel" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ color: "#94a3b8", fontSize: 14, fontWeight: 500 }}>Total Leads</span>
            <Users size={18} color="#38bdf8" />
          </div>
          <h3 style={{ fontSize: 32, fontWeight: 700, color: "#fff" }}>{stats?.total_leads || 0}</h3>
          <p style={{ fontSize: 13, color: "#10b981", marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}><TrendingUp size={14} /> +12% this month</p>
        </div>

        <div className="admin-glass-panel" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ color: "#94a3b8", fontSize: 14, fontWeight: 500 }}>Active Clients</span>
            <Activity size={18} color="#10b981" />
          </div>
          <h3 style={{ fontSize: 32, fontWeight: 700, color: "#fff" }}>{stats?.active_clients || 0}</h3>
          <p style={{ fontSize: 13, color: "#10b981", marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}><TrendingUp size={14} /> +3% this month</p>
        </div>

        <div className="admin-glass-panel" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ color: "#94a3b8", fontSize: 14, fontWeight: 500 }}>Total Revenue</span>
            <DollarSign size={18} color="#f59e0b" />
          </div>
          <h3 style={{ fontSize: 32, fontWeight: 700, color: "#fff" }}>${stats?.revenue?.toLocaleString() || 0}</h3>
          <p style={{ fontSize: 13, color: "#10b981", marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}><TrendingUp size={14} /> +8.4% this month</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
        <div className="admin-glass-panel" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 20 }}>Pipeline Value by Stage</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {stats?.pipeline_stats?.map((stage: any) => (
              <div key={stage._id} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 120, fontSize: 13, color: "#cbd5e1" }}>{stage._id} ({stage.count})</div>
                <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${Math.min((stage.value / (stats.revenue || 1)) * 100, 100)}%`, height: "100%", background: "#38bdf8", borderRadius: 4 }} />
                </div>
                <div style={{ width: 100, fontSize: 13, fontWeight: 600, color: "#fff", textAlign: "right" }}>${stage.value?.toLocaleString() || 0}</div>
              </div>
            ))}
            {(!stats?.pipeline_stats || stats.pipeline_stats.length === 0) && (
              <p style={{ color: "#64748b", fontSize: 14 }}>No active deals in pipeline.</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CRMDashboard;
