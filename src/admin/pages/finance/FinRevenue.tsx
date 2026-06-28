import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getFinanceDashboardAPI } from "../../lib/api";
import { Loader2, DollarSign } from "lucide-react";

const FinRevenue: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);
  const fetchStats = async () => {
    try { setStats(await getFinanceDashboardAPI()); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin" size={40} color="#64748b" /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 24 }}>Monthly Revenue</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div className="admin-glass-panel" style={{ padding: 24 }}>
          <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 8 }}>Total Invoiced</p>
          <p style={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>₹{(stats?.total_invoiced || 0).toLocaleString()}</p>
        </div>
        <div className="admin-glass-panel" style={{ padding: 24 }}>
          <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 8 }}>Total Collected</p>
          <p style={{ fontSize: 28, fontWeight: 700, color: "#10b981" }}>₹{(stats?.total_revenue || 0).toLocaleString()}</p>
        </div>
        <div className="admin-glass-panel" style={{ padding: 24 }}>
          <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 8 }}>Collection Rate</p>
          <p style={{ fontSize: 28, fontWeight: 700, color: "#38bdf8" }}>{stats?.total_invoiced ? ((stats.total_revenue / stats.total_invoiced) * 100).toFixed(1) : 0}%</p>
        </div>
      </div>

      <div className="admin-glass-panel" style={{ padding: 24, minHeight: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#64748b", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <DollarSign size={32} opacity={0.5} />
          Revenue analytics will scale with data volume. Add invoices and record payments to see trends.
        </p>
      </div>
    </motion.div>
  );
};

export default FinRevenue;
