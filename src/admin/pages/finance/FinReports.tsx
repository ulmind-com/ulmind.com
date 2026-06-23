import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getFinanceDashboardAPI } from "../../lib/api";
import { Loader2, Download, FileText } from "lucide-react";

const FinReports: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);
  const fetchStats = async () => {
    try { setStats(await getFinanceDashboardAPI()); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin" size={40} color="#64748b" /></div>;

  const reports = [
    { title: "Revenue Report", desc: "Total revenue from paid invoices.", value: `₹${(stats?.total_revenue || 0).toLocaleString()}`, color: "#10b981" },
    { title: "Expense Report", desc: "Total expenses across all categories.", value: `₹${(stats?.total_expenses || 0).toLocaleString()}`, color: "#ef4444" },
    { title: "Profit Report", desc: "Net profit after all deductions.", value: `₹${(stats?.net_profit || 0).toLocaleString()}`, color: "#38bdf8" },
    { title: "Cash Flow Report", desc: "Total payments received.", value: `₹${(stats?.total_payments || 0).toLocaleString()}`, color: "#a78bfa" },
    { title: "Outstanding Report", desc: "Pending and overdue receivables.", value: `₹${(stats?.outstanding || 0).toLocaleString()}`, color: "#f59e0b" },
    { title: "Invoice Summary", desc: `${stats?.invoice_count || 0} invoices, ${stats?.paid_count || 0} paid.`, value: `${stats?.invoice_count || 0} total`, color: "#06b6d4" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <div><h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>Financial Reports</h2><p style={{ color: "#94a3b8", fontSize: 14 }}>Enterprise reporting center.</p></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {reports.map(r => (
          <div key={r.title} className="admin-glass-panel" style={{ padding: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}><FileText size={16} color={r.color} /> {r.title}</h3>
              <p style={{ color: "#94a3b8", fontSize: 13 }}>{r.desc}</p>
              <p style={{ color: r.color, fontSize: 22, fontWeight: 700, marginTop: 12 }}>{r.value}</p>
            </div>
            <button className="admin-btn admin-btn-ghost" style={{ flexShrink: 0 }}><Download size={16} /> Export</button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default FinReports;
