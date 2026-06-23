import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getFinanceDashboardAPI } from "../../lib/api";
import { Loader2, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

const FinProfitLoss: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);
  const fetchStats = async () => {
    try { setStats(await getFinanceDashboardAPI()); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin" size={40} color="#64748b" /></div>;

  const revenue = stats?.total_revenue || 0;
  const expenses = stats?.total_expenses || 0;
  const profit = stats?.net_profit || 0;
  const margin = stats?.profit_margin || 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 24 }}>Profit & Loss Statement</h2>

      <div className="admin-glass-panel" style={{ padding: 32, marginBottom: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32, textAlign: "center" }}>
          <div>
            <DollarSign size={24} color="#10b981" style={{ margin: "0 auto 8px" }} />
            <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 8 }}>Total Revenue</p>
            <p style={{ fontSize: 32, fontWeight: 700, color: "#10b981" }}>${revenue.toLocaleString()}</p>
          </div>
          <div>
            <TrendingDown size={24} color="#ef4444" style={{ margin: "0 auto 8px" }} />
            <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 8 }}>Total Expenses</p>
            <p style={{ fontSize: 32, fontWeight: 700, color: "#ef4444" }}>${expenses.toLocaleString()}</p>
          </div>
          <div>
            <TrendingUp size={24} color="#38bdf8" style={{ margin: "0 auto 8px" }} />
            <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 8 }}>Net Profit</p>
            <p style={{ fontSize: 32, fontWeight: 700, color: profit >= 0 ? "#38bdf8" : "#ef4444" }}>${profit.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* P&L Breakdown */}
      <div className="admin-glass-panel" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 20 }}>Breakdown</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", background: "rgba(16, 185, 129, 0.08)", borderRadius: 8, borderLeft: "3px solid #10b981" }}>
            <span style={{ color: "#cbd5e1", fontWeight: 500 }}>Revenue (Paid Invoices)</span>
            <span style={{ color: "#10b981", fontWeight: 700 }}>+ ${revenue.toLocaleString()}</span>
          </div>
          {stats?.expense_breakdown && Object.entries(stats.expense_breakdown).map(([cat, val]: any) => (
            <div key={cat} style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", background: "rgba(239, 68, 68, 0.05)", borderRadius: 8, borderLeft: "3px solid #ef4444" }}>
              <span style={{ color: "#cbd5e1", textTransform: "capitalize" }}>{cat}</span>
              <span style={{ color: "#ef4444", fontWeight: 600 }}>- ${val.toLocaleString()}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "16px", background: "rgba(56, 189, 248, 0.1)", borderRadius: 8, borderLeft: "3px solid #38bdf8", marginTop: 8 }}>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Net Profit</span>
            <span style={{ color: "#38bdf8", fontWeight: 700, fontSize: 18 }}>${profit.toLocaleString()} ({margin}%)</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FinProfitLoss;
