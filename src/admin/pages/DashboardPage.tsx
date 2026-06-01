/* ──────────────────────────────────────────────────────────────
   ULMiND Admin — Dashboard Page
   KPI stats + interactive charts
   ────────────────────────────────────────────────────────────── */

import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  Eye,
  Clock,
  Globe,
  Activity,
  MousePointerClick,
  Smartphone,
  Monitor,
} from "lucide-react";
import { motion } from "framer-motion";
import KpiCard from "../components/KpiCard";
import { getKpiStats, getChartStats } from "../lib/api";

/* ── Custom Chart Tooltip ─────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="admin-chart-tooltip" style={{ background: "#1a1f36", border: "1px solid #1e293b", borderRadius: 12, padding: "12px 16px" }}>
      <p style={{ color: "#f1f5f9", fontWeight: 600, marginBottom: 4, fontSize: 13 }}>{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color, fontSize: 12, margin: "2px 0" }}>
          {entry.name}: <strong>{typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}</strong>
        </p>
      ))}
    </div>
  );
};

/* ── Gradient Definitions ─────────────────────────────────── */
const ChartGradients = () => (
  <defs>
    <linearGradient id="gradientViolet" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} />
      <stop offset="100%" stopColor="#ef4444" stopOpacity={0.02} />
    </linearGradient>
    <linearGradient id="gradientRose" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#e11d48" stopOpacity={0.3} />
      <stop offset="100%" stopColor="#e11d48" stopOpacity={0.02} />
    </linearGradient>
    <linearGradient id="gradientEmerald" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
      <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
    </linearGradient>
    <linearGradient id="gradientSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.3} />
      <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.02} />
    </linearGradient>
  </defs>
);

/* ── PIE Chart Colors ─────────────────────────────────────── */
const PIE_COLORS = ["#ef4444", "#e11d48", "#10b981", "#f59e0b", "#0ea5e9", "#f87171", "#f43f5e", "#06b6d4"];

const DashboardPage: React.FC = () => {
  const [kpiData, setKpiData] = useState<any>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [chartPeriod, setChartPeriod] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [kpi, charts] = await Promise.all([
          getKpiStats(),
          getChartStats(chartPeriod),
        ]);
        setKpiData(kpi);
        setChartData(charts);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [chartPeriod]);

  // Parse KPI data dynamically
  const kpiCards = React.useMemo(() => {
    if (!kpiData) return [];

    const iconMap: Record<string, { icon: React.ReactNode; gradient: string }> = {
      total_visitors: { icon: <Users size={22} color="#fff" />, gradient: "linear-gradient(135deg, #ef4444, #dc2626)" },
      total_pageviews: { icon: <Eye size={22} color="#fff" />, gradient: "linear-gradient(135deg, #e11d48, #be123c)" },
      unique_sessions: { icon: <MousePointerClick size={22} color="#fff" />, gradient: "linear-gradient(135deg, #0ea5e9, #0284c7)" },
      avg_time_spent: { icon: <Clock size={22} color="#fff" />, gradient: "linear-gradient(135deg, #f59e0b, #d97706)" },
      total_tracking: { icon: <Activity size={22} color="#fff" />, gradient: "linear-gradient(135deg, #10b981, #059669)" },
      countries: { icon: <Globe size={22} color="#fff" />, gradient: "linear-gradient(135deg, #f87171, #ef4444)" },
      desktop_users: { icon: <Monitor size={22} color="#fff" />, gradient: "linear-gradient(135deg, #06b6d4, #0891b2)" },
      mobile_users: { icon: <Smartphone size={22} color="#fff" />, gradient: "linear-gradient(135deg, #f43f5e, #e11d48)" },
    };

    // If data is an object with key-value pairs, render each as a card
    if (typeof kpiData === "object" && !Array.isArray(kpiData)) {
      return Object.entries(kpiData).map(([key, value]) => {
        const mapped = iconMap[key] || {
          icon: <Activity size={22} color="#fff" />,
          gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
        };
        return {
          key,
          label: key.replace(/_/g, " "),
          value: typeof value === "number" ? value : String(value),
          ...mapped,
          format: typeof value === "number" ? "number" as const : "text" as const,
        };
      });
    }

    return [];
  }, [kpiData]);

  // Parse chart data dynamically
  const chartSeries = React.useMemo(() => {
    if (!chartData) return { lineData: [], barData: [], pieData: [] };

    // Try to extract chart-compatible data
    let lineData: any[] = [];
    let barData: any[] = [];
    let pieData: any[] = [];

    if (Array.isArray(chartData)) {
      lineData = chartData;
      barData = chartData;
      if (chartData.length > 0) {
        const numKeys = Object.keys(chartData[0]).filter(k => typeof chartData[0][k] === 'number');
        if (numKeys.length > 0) {
          const mainKey = numKeys[0];
          pieData = chartData.map(d => ({ name: d.name || d.date || 'Unknown', value: d[mainKey] }));
        }
      }
    } else if (typeof chartData === "object") {
      // Check for common chart data keys
      if (chartData.line_chart || chartData.timeseries || chartData.data) {
        lineData = chartData.line_chart || chartData.timeseries || chartData.data || [];
      }
      if (chartData.bar_chart || chartData.categories) {
        barData = chartData.bar_chart || chartData.categories || [];
      }
      if (chartData.pie_chart || chartData.distribution) {
        pieData = chartData.pie_chart || chartData.distribution || [];
      }
      // If the data is a flat object, build charts from it
      if (lineData.length === 0 && barData.length === 0) {
        const entries = Object.entries(chartData).filter(
          ([, v]) => typeof v === "number"
        );
        barData = entries.map(([name, value]) => ({ name: name.replace(/_/g, " "), value }));
        pieData = entries.slice(0, 8).map(([name, value]) => ({ name: name.replace(/_/g, " "), value }));
      }
    }

    return { lineData, barData, pieData };
  }, [chartData]);

  // Loading skeleton
  if (loading) {
    return (
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: "var(--admin-text)" }}>Dashboard</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20, marginBottom: 32 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="admin-skeleton" style={{ height: 140, borderRadius: 16 }} />
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div className="admin-skeleton" style={{ height: 340, borderRadius: 16 }} />
          <div className="admin-skeleton" style={{ height: 340, borderRadius: 16 }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: "var(--admin-text)" }}>Dashboard</h2>
        <div className="admin-card" style={{ textAlign: "center", padding: 48 }}>
          <p style={{ color: "var(--admin-rose)", fontSize: 15 }}>⚠️ {error}</p>
          <button className="admin-btn admin-btn-primary" style={{ marginTop: 16 }} onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ paddingBottom: 40 }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: "#ffffff", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.02em" }}>
              Dashboard
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", padding: "4px 10px", borderRadius: 20 }}>
              <motion.div 
                animate={{ opacity: [1, 0.3, 1] }} 
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }}
              />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.05em" }}>Live</span>
            </div>
          </div>
          <p style={{ fontSize: 14, color: "#94a3b8", marginTop: 6 }}>
            Real-time overview of your website performance & analytics.
          </p>
        </div>
      </div>

      {/* KPI Cards (Staggered Grid) */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.05 } }
        }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 20,
          marginBottom: 40,
        }}
      >
        {kpiCards.map((card, i) => (
          <motion.div 
            key={card.key}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.02, translateY: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <KpiCard
              label={card.label}
              value={card.value}
              icon={card.icon}
              gradient={card.gradient}
              format={card.format}
              delay={0} // handeled by motion parent
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Chart Period Toggle (Pill style) */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h3 style={{ fontSize: 20, fontWeight: 600, color: "#ffffff", letterSpacing: "-0.01em" }}>Analytics Overview</h3>
        <div style={{ display: "flex", background: "rgba(255, 255, 255, 0.03)", padding: 4, borderRadius: 12, border: "1px solid rgba(255, 255, 255, 0.05)" }}>
          {["daily", "weekly", "monthly"].map((p) => (
            <button
              key={p}
              style={{
                background: chartPeriod === p ? "rgba(255, 255, 255, 0.1)" : "transparent",
                color: chartPeriod === p ? "#ffffff" : "#94a3b8",
                border: "none",
                padding: "6px 16px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: chartPeriod === p ? 600 : 500,
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: chartPeriod === p ? "0 2px 8px rgba(0,0,0,0.2)" : "none"
              }}
              onClick={() => setChartPeriod(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Bento Grid Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gridAutoRows: "minmax(320px, auto)",
          gap: 24,
        }}
      >
        {/* Main Area Chart (Span 8 cols) */}
        {chartSeries.lineData.length > 0 && (
          <div className="admin-card" style={{ gridColumn: "span 8", padding: "24px", background: "rgba(20, 20, 22, 0.7)", backdropFilter: "blur(20px)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: 20 }}>
            <h4 style={{ fontSize: 15, fontWeight: 600, color: "#ffffff", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
              <Activity size={16} color="#ef4444" /> Traffic Overview
            </h4>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartSeries.lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <ChartGradients />
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                {Object.keys(chartSeries.lineData[0] || {})
                  .filter((k) => k !== "name" && k !== "date" && k !== "label")
                  .slice(0, 3)
                  .map((key, i) => {
                    const colors = ["#ef4444", "#e11d48", "#10b981"];
                    const fills = ["url(#gradientViolet)", "url(#gradientRose)", "url(#gradientEmerald)"];
                    return (
                      <Area
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={colors[i]}
                        strokeWidth={3}
                        fill={fills[i]}
                        name={key.replace(/_/g, " ")}
                        activeDot={{ r: 6, strokeWidth: 0, fill: colors[i] }}
                      />
                    );
                  })}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Pie Chart (Span 4 cols) */}
        {chartSeries.pieData.length > 0 && (
          <div className="admin-card" style={{ gridColumn: "span 4", padding: "24px", background: "rgba(20, 20, 22, 0.7)", backdropFilter: "blur(20px)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: 20, display: "flex", flexDirection: "column" }}>
            <h4 style={{ fontSize: 15, fontWeight: 600, color: "#ffffff", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <Globe size={16} color="#0ea5e9" /> Distribution
            </h4>
            <div style={{ flex: 1, position: "relative" }}>
              <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                <PieChart>
                  <Pie
                    data={chartSeries.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={6}
                    dataKey="value"
                    nameKey="name"
                    stroke="none"
                    cornerRadius={8}
                  >
                    {chartSeries.pieData.map((_: any, i: number) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", pointerEvents: "none" }}>
                 <span style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>{chartSeries.pieData.length}</span>
                 <br />
                 <span style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase" }}>Data</span>
              </div>
            </div>
            {/* Legend */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 8 }}>
              {chartSeries.pieData.map((entry: any, i: number) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#94a3b8" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  {entry.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bar Chart (Span 12 cols, full width bento) */}
        {chartSeries.barData.length > 0 && (
          <div className="admin-card" style={{ gridColumn: "span 12", padding: "24px", background: "rgba(20, 20, 22, 0.7)", backdropFilter: "blur(20px)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: 20 }}>
            <h4 style={{ fontSize: 15, fontWeight: 600, color: "#ffffff", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
              <Monitor size={16} color="#10b981" /> Statistics Breakdown
            </h4>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartSeries.barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                {Object.keys(chartSeries.barData[0] || {})
                  .filter((k) => k !== "name" && k !== "date" && k !== "label")
                  .slice(0, 3)
                  .map((key, i) => (
                    <Bar key={key} dataKey={key} name={key.replace(/_/g, " ")} radius={[6, 6, 0, 0]} maxBarSize={48} fill={PIE_COLORS[i % PIE_COLORS.length]} fillOpacity={0.9} />
                  ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}



        {/* Fallback: If no chart data at all, show raw JSON card */}
        {chartSeries.lineData.length === 0 && chartSeries.barData.length === 0 && chartSeries.pieData.length === 0 && chartData && (
          <div className="admin-card" style={{ gridColumn: "1 / -1" }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--admin-text)", marginBottom: 12 }}>
              Chart Data (Raw)
            </h4>
            <pre
              style={{
                background: "#0f1629",
                borderRadius: 12,
                padding: 16,
                fontSize: 12,
                color: "#94a3b8",
                overflow: "auto",
                maxHeight: 400,
              }}
            >
              {JSON.stringify(chartData, null, 2)}
            </pre>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;
