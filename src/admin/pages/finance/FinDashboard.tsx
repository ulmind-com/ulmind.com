import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getFinanceDashboardAPI } from "../../lib/api";
import { DollarSign, CreditCard, TrendingDown, TrendingUp, Loader2, Receipt, AlertCircle, Percent } from "lucide-react";

const FinDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);
  const fetchStats = async () => {
    try { setStats(await getFinanceDashboardAPI()); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin" size={40} color="#64748b" /></div>;

  const kpis = [
    { label: "Total Revenue", value: `₹${(stats?.total_revenue || 0).toLocaleString()}`, icon: <DollarSign size={18} />, color: "#10b981" },
    { label: "Total Expenses", value: `₹${(stats?.total_expenses || 0).toLocaleString()}`, icon: <TrendingDown size={18} />, color: "#ef4444" },
    { label: "Net Profit", value: `₹${(stats?.net_profit || 0).toLocaleString()}`, icon: <TrendingUp size={18} />, color: "#38bdf8" },
    { label: "Profit Margin", value: `${stats?.profit_margin || 0}%`, icon: <Percent size={18} />, color: "#a78bfa" },
    { label: "Outstanding", value: `₹${(stats?.outstanding || 0).toLocaleString()}`, icon: <AlertCircle size={18} />, color: "#f59e0b" },
    { label: "Paid Invoices", value: stats?.paid_count || 0, icon: <Receipt size={18} />, color: "#06b6d4" },
    { label: "Overdue Invoices", value: stats?.overdue_count || 0, icon: <AlertCircle size={18} />, color: "#ef4444" },
    { label: "Total Payments", value: `₹${(stats?.total_payments || 0).toLocaleString()}`, icon: <CreditCard size={18} />, color: "#10b981" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>Finance Dashboard</h2>
          <p style={{ color: "#94a3b8", fontSize: 14 }}>Real-time financial performance overview.</p>
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
            <h3 style={{ fontSize: 26, fontWeight: 700, color: "#fff" }}>{kpi.value}</h3>
          </div>
        ))}
      </div>

      {/* Expense Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="admin-glass-panel" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 16 }}>Expense Breakdown</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {stats?.expense_breakdown && Object.entries(stats.expense_breakdown).sort((a: any, b: any) => b[1] - a[1]).map(([cat, val]: any) => (
              <div key={cat} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 100, fontSize: 13, color: "#cbd5e1", textTransform: "capitalize" }}>{cat}</div>
                <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${stats.total_expenses ? (val / stats.total_expenses) * 100 : 0}%`, height: "100%", background: "#ef4444", borderRadius: 4 }} />
                </div>
                <div style={{ width: 80, fontSize: 13, fontWeight: 600, color: "#fff", textAlign: "right" }}>₹{val.toLocaleString()}</div>
              </div>
            ))}
            {(!stats?.expense_breakdown || Object.keys(stats.expense_breakdown).length === 0) && <p style={{ color: "#64748b" }}>No expenses recorded.</p>}
          </div>
        </div>

        <div className="admin-glass-panel" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 16 }}>Financial Summary</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#94a3b8" }}>Total Invoiced</span><span style={{ color: "#fff", fontWeight: 600 }}>₹{(stats?.total_invoiced || 0).toLocaleString()}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#94a3b8" }}>Total Collected</span><span style={{ color: "#10b981", fontWeight: 600 }}>₹{(stats?.total_payments || 0).toLocaleString()}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#94a3b8" }}>Outstanding</span><span style={{ color: "#f59e0b", fontWeight: 600 }}>₹{(stats?.outstanding || 0).toLocaleString()}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16 }}><span style={{ color: "#94a3b8" }}>Net Profit</span><span style={{ color: "#38bdf8", fontWeight: 700, fontSize: 18 }}>₹{(stats?.net_profit || 0).toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FinDashboard;
