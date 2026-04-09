/* ──────────────────────────────────────────────────────────────
   ULMiND Admin — Analytics Page
   Page view analytics with top pages, time spent, and filtering
   ────────────────────────────────────────────────────────────── */

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Eye, Clock, TrendingUp, Filter, Hash } from "lucide-react";
import KpiCard from "../components/KpiCard";
import { getAnalyticsReport, type AnalyticsReport } from "../lib/api";

/* ── Time Formatter ───────────────────────────────────────── */
const formatTime = (seconds: number): string => {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  if (mins < 60) return `${mins}m ${secs}s`;
  const hours = Math.floor(mins / 60);
  return `${hours}h ${mins % 60}m`;
};

/* ── Chart Tooltip ────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1a1f36", border: "1px solid #1e293b", borderRadius: 12, padding: "12px 16px" }}>
      <p style={{ color: "#f1f5f9", fontWeight: 600, marginBottom: 4, fontSize: 13 }}>{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color, fontSize: 12, margin: "2px 0" }}>
          {entry.name}: <strong>{entry.value?.toLocaleString()}</strong>
        </p>
      ))}
    </div>
  );
};

const CHART_COLORS = ["#7c3aed", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#7c3aed", "#6d28d9", "#5b21b6"];

const AnalyticsPage: React.FC = () => {
  const [report, setReport] = useState<AnalyticsReport | null>(null);
  const [period, setPeriod] = useState("7d");
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getAnalyticsReport(period, limit);
        setReport(data);
      } catch (err: any) {
        setError(err.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [period, limit]);

  if (loading) {
    return (
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: "var(--admin-text)" }}>Analytics</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 32 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="admin-skeleton" style={{ height: 140, borderRadius: 16 }} />
          ))}
        </div>
        <div className="admin-skeleton" style={{ height: 400, borderRadius: 16 }} />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: "var(--admin-text)" }}>Analytics</h2>
        <div className="admin-card" style={{ textAlign: "center", padding: 48 }}>
          <p style={{ color: "var(--admin-rose)", fontSize: 15 }}>⚠️ {error}</p>
          <button className="admin-btn admin-btn-primary" style={{ marginTop: 16 }} onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const visitChartData = (report?.top_pages_by_visits || []).map((p) => ({
    name: p.page.replace(/^\//, "") || "Home",
    visits: p.visits,
    sessions: p.unique_sessions,
  }));

  const timeChartData = (report?.top_pages_by_time_spent || []).map((p) => ({
    name: p.page.replace(/^\//, "") || "Home",
    total: Math.round(p.total_time_seconds),
    avg: Math.round(p.avg_time_seconds),
  }));

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--admin-text)", fontFamily: "'Inter', sans-serif" }}>
            Page Analytics
          </h2>
          <p style={{ fontSize: 13, color: "var(--admin-text-dim)", marginTop: 4 }}>
            Detailed breakdown of page performance • Period: <strong style={{ color: "var(--admin-accent)" }}>{report?.period || period}</strong>
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {/* Limit control */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Hash size={14} style={{ color: "var(--admin-text-dim)" }} />
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="admin-input"
              style={{ width: 70, padding: "8px 10px", fontSize: 13 }}
            >
              {[5, 10, 20, 30, 50].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          {/* Period tabs */}
          <div className="admin-tabs">
            {["7d", "30d", "all"].map((p) => (
              <button
                key={p}
                className={`admin-tab ${period === p ? "active" : ""}`}
                onClick={() => setPeriod(p)}
              >
                {p === "all" ? "All Time" : p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20, marginBottom: 32 }}>
        <KpiCard
          label="Total Pageviews"
          value={report?.total_pageviews || 0}
          icon={<Eye size={22} color="#fff" />}
          gradient="linear-gradient(135deg, #7c3aed, #6d28d9)"
          delay={0}
        />
        <KpiCard
          label="Top Pages Tracked"
          value={report?.top_pages_by_visits?.length || 0}
          icon={<TrendingUp size={22} color="#fff" />}
          gradient="linear-gradient(135deg, #e11d48, #be123c)"
          delay={100}
        />
        <KpiCard
          label="Avg Time (Top Page)"
          value={report?.top_pages_by_time_spent?.[0]?.avg_time_seconds ? formatTime(report.top_pages_by_time_spent[0].avg_time_seconds) : "N/A"}
          icon={<Clock size={22} color="#fff" />}
          gradient="linear-gradient(135deg, #f59e0b, #d97706)"
          delay={200}
          format="text"
        />
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 20, marginBottom: 32 }}>
        {/* Visits Bar Chart */}
        {visitChartData.length > 0 && (
          <div className="admin-card" style={{ padding: "20px 16px" }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--admin-text)", marginBottom: 16, paddingLeft: 8 }}>
              📊 Top Pages by Visits
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={visitChartData} layout="vertical" margin={{ left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,41,59,0.5)" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="visits" name="Visits" radius={[0, 6, 6, 0]} maxBarSize={24}>
                  {visitChartData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Time Spent Bar Chart */}
        {timeChartData.length > 0 && (
          <div className="admin-card" style={{ padding: "20px 16px" }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--admin-text)", marginBottom: 16, paddingLeft: 8 }}>
              ⏱️ Top Pages by Time Spent
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeChartData} layout="vertical" margin={{ left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,41,59,0.5)" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total" name="Total (s)" fill="#e11d48" radius={[0, 6, 6, 0]} maxBarSize={24} fillOpacity={0.8} />
                <Bar dataKey="avg" name="Avg (s)" fill="#10b981" radius={[0, 6, 6, 0]} maxBarSize={24} fillOpacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Data Tables */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 20 }}>
        {/* Top Pages by Visits Table */}
        <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--admin-border)" }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--admin-text)" }}>
              Top Pages by Visits
            </h4>
          </div>
          <div style={{ maxHeight: 400, overflowY: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Page</th>
                  <th>Visits</th>
                  <th>Sessions</th>
                </tr>
              </thead>
              <tbody>
                {(report?.top_pages_by_visits || []).map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 700, color: "var(--admin-accent)" }}>{i + 1}</td>
                    <td style={{ fontWeight: 500, color: "var(--admin-text)" }}>
                      {row.page || "/"}
                    </td>
                    <td>{row.visits.toLocaleString()}</td>
                    <td>{row.unique_sessions.toLocaleString()}</td>
                  </tr>
                ))}
                {(!report?.top_pages_by_visits || report.top_pages_by_visits.length === 0) && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: 32, color: "var(--admin-text-dim)" }}>
                      No data available for this period
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Pages by Time Spent Table */}
        <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--admin-border)" }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--admin-text)" }}>
              Top Pages by Time Spent
            </h4>
          </div>
          <div style={{ maxHeight: 400, overflowY: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Page</th>
                  <th>Total Time</th>
                  <th>Avg Time</th>
                </tr>
              </thead>
              <tbody>
                {(report?.top_pages_by_time_spent || []).map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 700, color: "var(--admin-accent)" }}>{i + 1}</td>
                    <td style={{ fontWeight: 500, color: "var(--admin-text)" }}>
                      {row.page || "/"}
                    </td>
                    <td>{formatTime(row.total_time_seconds)}</td>
                    <td>{formatTime(row.avg_time_seconds)}</td>
                  </tr>
                ))}
                {(!report?.top_pages_by_time_spent || report.top_pages_by_time_spent.length === 0) && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: 32, color: "var(--admin-text-dim)" }}>
                      No data available for this period
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
