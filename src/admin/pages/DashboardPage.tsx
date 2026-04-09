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
      <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.4} />
      <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.02} />
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
const PIE_COLORS = ["#7c3aed", "#e11d48", "#10b981", "#f59e0b", "#0ea5e9", "#8b5cf6", "#f43f5e", "#06b6d4"];

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
      total_visitors: { icon: <Users size={22} color="#fff" />, gradient: "linear-gradient(135deg, #7c3aed, #6d28d9)" },
      total_pageviews: { icon: <Eye size={22} color="#fff" />, gradient: "linear-gradient(135deg, #e11d48, #be123c)" },
      unique_sessions: { icon: <MousePointerClick size={22} color="#fff" />, gradient: "linear-gradient(135deg, #0ea5e9, #0284c7)" },
      avg_time_spent: { icon: <Clock size={22} color="#fff" />, gradient: "linear-gradient(135deg, #f59e0b, #d97706)" },
      total_tracking: { icon: <Activity size={22} color="#fff" />, gradient: "linear-gradient(135deg, #10b981, #059669)" },
      countries: { icon: <Globe size={22} color="#fff" />, gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)" },
      desktop_users: { icon: <Monitor size={22} color="#fff" />, gradient: "linear-gradient(135deg, #06b6d4, #0891b2)" },
      mobile_users: { icon: <Smartphone size={22} color="#fff" />, gradient: "linear-gradient(135deg, #f43f5e, #e11d48)" },
    };

    // If data is an object with key-value pairs, render each as a card
    if (typeof kpiData === "object" && !Array.isArray(kpiData)) {
      return Object.entries(kpiData).map(([key, value]) => {
        const mapped = iconMap[key] || {
          icon: <Activity size={22} color="#fff" />,
          gradient: "linear-gradient(135deg, #7c3aed, #6d28d9)",
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
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--admin-text)", fontFamily: "'Inter', sans-serif" }}>
            Dashboard
          </h2>
          <p style={{ fontSize: 13, color: "var(--admin-text-dim)", marginTop: 4 }}>
            Real-time overview of your website performance
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 20,
          marginBottom: 32,
        }}
      >
        {kpiCards.map((card, i) => (
          <KpiCard
            key={card.key}
            label={card.label}
            value={card.value}
            icon={card.icon}
            gradient={card.gradient}
            format={card.format}
            delay={i * 100}
          />
        ))}
      </div>

      {/* Chart Period Toggle */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--admin-text)" }}>Analytics Charts</h3>
        <div className="admin-tabs">
          {["monthly", "weekly", "daily"].map((p) => (
            <button
              key={p}
              className={`admin-tab ${chartPeriod === p ? "active" : ""}`}
              onClick={() => setChartPeriod(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: 20,
          marginBottom: 24,
        }}
      >
        {/* Area Chart */}
        {chartSeries.lineData.length > 0 && (
          <div className="admin-card" style={{ padding: "20px 16px" }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--admin-text)", marginBottom: 16, paddingLeft: 8 }}>
              Traffic Overview
            </h4>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartSeries.lineData}>
                <ChartGradients />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,41,59,0.5)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                {Object.keys(chartSeries.lineData[0] || {})
                  .filter((k) => k !== "name" && k !== "date" && k !== "label")
                  .slice(0, 3)
                  .map((key, i) => {
                    const colors = ["#7c3aed", "#e11d48", "#10b981"];
                    const fills = ["url(#gradientViolet)", "url(#gradientRose)", "url(#gradientEmerald)"];
                    return (
                      <Area
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={colors[i]}
                        strokeWidth={2}
                        fill={fills[i]}
                        name={key.replace(/_/g, " ")}
                      />
                    );
                  })}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Bar Chart */}
        {chartSeries.barData.length > 0 && (
          <div className="admin-card" style={{ padding: "20px 16px" }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--admin-text)", marginBottom: 16, paddingLeft: 8 }}>
              Statistics Breakdown
            </h4>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartSeries.barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,41,59,0.5)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} angle={-20} textAnchor="end" height={50} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Value" radius={[6, 6, 0, 0]} maxBarSize={40}>
                  {chartSeries.barData.map((_: any, i: number) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Pie Chart */}
        {chartSeries.pieData.length > 0 && (
          <div className="admin-card" style={{ padding: "20px 16px" }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--admin-text)", marginBottom: 16, paddingLeft: 8 }}>
              Distribution
            </h4>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={chartSeries.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="name"
                  stroke="none"
                >
                  {chartSeries.pieData.map((_: any, i: number) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
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
      </div>
    </div>
  );
};

export default DashboardPage;
