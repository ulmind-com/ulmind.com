/* ──────────────────────────────────────────────────────────────
   ULMiND Admin — Premium Analytics Dashboard
   Intelligent dynamic telemetry & Pageview Performance
   ────────────────────────────────────────────────────────────── */

import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from "recharts";
import { Users, TrendingUp, Clock, RefreshCcw, Mail, Eye, Hash, AlertCircle } from "lucide-react";
import KpiCard from "../components/KpiCard";
import { getTrackingData, getAnalyticsReport, type AnalyticsReport } from "../lib/api";

const CHART_COLORS = ["#7c3aed", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#7c3aed", "#6d28d9", "#5b21b6"];

const formatTime = (seconds: number): string => {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  if (mins < 60) return `${mins}m ${secs}s`;
  const hours = Math.floor(mins / 60);
  return `${hours}h ${mins % 60}m`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 16px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
      <p style={{ color: "#f8fafc", fontWeight: 600, marginBottom: 8, fontSize: 13, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 6 }}>{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.payload?.color || entry.color || "#fff", fontSize: 13, margin: "4px 0", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: entry.payload?.color || entry.color || "#fff", display: entry.name === 'Visits' || entry.name === 'Total (s)' || entry.name === 'Avg (s)' ? 'none' : 'block' }}></span>
          {entry.name}: <strong style={{ marginLeft: "auto", pl: 8 }}>{entry.value?.toLocaleString()}</strong>
        </p>
      ))}
    </div>
  );
};

const KpiCardMini = ({ value, label, icon, delay }: any) => (
  <div className="admin-card" style={{ padding: "20px 24px", animationDelay: `${delay}ms`, display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 120 }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", padding: 8, borderRadius: 12 }}>
        {icon}
      </div>
    </div>
    <div>
      <h3 style={{ fontSize: 28, fontWeight: 800, color: "var(--admin-text)", margin: 0, lineHeight: 1.1, fontFamily: "'Inter', sans-serif", letterSpacing: "-0.5px" }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </h3>
      <p style={{ fontSize: 13, color: "var(--admin-text-dim)", marginTop: 6, fontWeight: 500 }}>{label}</p>
    </div>
  </div>
);

const AnalyticsPage: React.FC = () => {
  const [report, setReport] = useState<any[]>([]);
  const [pageReport, setPageReport] = useState<AnalyticsReport | null>(null);
  
  const [period, setPeriod] = useState("7d");
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch both the new Tracking Data and the old Pageview Analytics
        const [trackRes, pageRes] = await Promise.all([
          getTrackingData(1000, 0).catch(() => []), 
          getAnalyticsReport(period, limit).catch(() => null)
        ]);
        
        setReport(Array.isArray(trackRes) ? trackRes : []);
        setPageReport(pageRes);
      } catch (err: any) {
        setError(err.message || "Failed to load telemetry");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period, limit]);

  const stats = useMemo(() => {
    if (!report) return null;
    
    const now = new Date();
    const todayStr = now.toDateString();
    
    const dailyVisitors = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return { dateStr: d.toDateString(), label: d.toLocaleDateString("en-US", { weekday: "short" }), Visitors: 0 };
    });
    
    let today = 0, last7Days = 0, contacts = 0, returning = 0;
    let desktop = 0, mobile = 0;
    let pending = 0, accepted = 0, rejected = 0;
    const ipSet = new Set();
    
    report.forEach(row => {
      let d = new Date();
      if (row.timestamp) {
        d = new Date(row.timestamp.endsWith("Z") || row.timestamp.includes("+") ? row.timestamp : row.timestamp + "Z");
      }
      
      if (d.toDateString() === todayStr) today++;
      
      const diffDays = (now.getTime() - d.getTime()) / (1000 * 3600 * 24);
      if (diffDays <= 7) last7Days++;
      
      const matchDay = dailyVisitors.find(x => x.dateStr === d.toDateString());
      if (matchDay) matchDay.Visitors++;
      
      if (row.ip && ipSet.has(row.ip)) returning++;
      if (row.ip) ipSet.add(row.ip);
      
      if (row.email && row.email !== "Unknown") contacts++;
      
      if (row.maxTouchPoints > 0 || (row.os && /Android|iOS/i.test(row.os))) mobile++;
      else desktop++;
      
      if (row.consent_status === "stealth") pending++;
      else if (row.consent_status === "accepted") accepted++;
      else if (row.consent_status === "declined" || row.consent_status === "rejected") rejected++;
    });
    
    return {
      total: report.length,
      today,
      last7Days,
      returning,
      contacts,
      dailyVisitors,
      devices: [
        { name: "Desktop", value: desktop, color: "#3b82f6" },
        { name: "Mobile", value: mobile, color: "#f59e0b" }
      ],
      consent: [
        { name: "Pending", value: pending, color: "#10b981" },
        { name: "Rejected", value: rejected, color: "#e11d48" },
        { name: "Accepted", value: accepted, color: "#64748b" }
      ]
    };
  }, [report]);

  const visitChartData = (pageReport?.top_pages_by_visits || []).map((p) => ({
    name: p.page.replace(/^\//, "") || "Home",
    visits: p.visits,
    sessions: p.unique_sessions,
  }));

  const timeChartData = (pageReport?.top_pages_by_time_spent || []).map((p) => ({
    name: p.page.replace(/^\//, "") || "Home",
    total: Math.round(p.total_time_seconds),
    avg: Math.round(p.avg_time_seconds),
  }));

  if (loading) {
    return (
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: "var(--admin-text)" }}>Analytics Dashboard</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 24 }}>
          {[1, 2, 3, 4, 5].map((i) => <div key={i} className="admin-skeleton" style={{ height: 120, borderRadius: 16 }} />)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
          {[1, 2, 3].map((i) => <div key={i} className="admin-skeleton" style={{ height: 350, borderRadius: 16 }} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-card" style={{ textAlign: "center", padding: 64 }}>
        <AlertCircle size={48} color="var(--admin-rose)" style={{ margin: "0 auto", marginBottom: 16, opacity: 0.8 }} />
        <p style={{ color: "var(--admin-text)", fontSize: 18, fontWeight: 600 }}>Failed to sync telemetry</p>
        <p style={{ color: "var(--admin-text-dim)", fontSize: 14, marginTop: 8 }}>{error}</p>
        <button className="admin-btn admin-btn-primary" style={{ marginTop: 24 }} onClick={() => window.location.reload()}>Retry Sync</button>
      </div>
    );
  }

  return (
    <div>
      {/* ─── NEW OP VISITOR INTELLIGENCE SECTION ─── */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "var(--admin-text)", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", gap: 10 }}>
          <BarChart size={28} color="#3b82f6" /> Visitor Intelligence
        </h2>
        <p style={{ fontSize: 14, color: "var(--admin-text-dim)", marginTop: 6 }}>
          Complete visitor intelligence — real-time data dynamically aggregated from core tracking endpoints.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
        <KpiCardMini label="Total Tracked" value={stats?.total || 0} icon={<Users size={20} color="#3b82f6" />} delay={0} />
        <KpiCardMini label="Today" value={stats?.today || 0} icon={<TrendingUp size={20} color="#10b981" />} delay={50} />
        <KpiCardMini label="Last 7 Days" value={stats?.last7Days || 0} icon={<Clock size={20} color="#f59e0b" />} delay={100} />
        <KpiCardMini label="Returning IPs" value={stats?.returning || 0} icon={<RefreshCcw size={20} color="#8b5cf6" />} delay={150} />
        <KpiCardMini label="Contacts Linked" value={stats?.contacts || 0} icon={<Mail size={20} color="#0ea5e9" />} delay={200} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, marginBottom: 48 }}>
        <div className="admin-card" style={{ padding: "24px", minHeight: 320 }}>
          <h4 style={{ fontSize: 15, fontWeight: 700, color: "var(--admin-text)", marginBottom: 20 }}>Daily Visitors (7 Days)</h4>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats?.dailyVisitors} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="label" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <Tooltip cursor={{ fill: "rgba(255,255,255,0.05)" }} content={<CustomTooltip />} />
              <Bar dataKey="Visitors" radius={[6, 6, 6, 6]} barSize={28}>
                {(stats?.dailyVisitors || []).map((_, i) => <Cell key={i} fill="#3b82f6" />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="admin-card" style={{ padding: "24px", minHeight: 320 }}>
          <h4 style={{ fontSize: 15, fontWeight: 700, color: "var(--admin-text)", marginBottom: 20 }}>Devices Ratio</h4>
          <div style={{ display: "flex", alignItems: "center", height: 240 }}>
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Pie data={stats?.devices} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value" stroke="none">
                  {(stats?.devices || []).map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ width: "40%", display: "flex", flexDirection: "column", gap: 12, justifyContent: "center" }}>
              {(stats?.devices || []).map(entry => (
                <div key={entry.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: entry.color }} />
                  <span style={{ color: "var(--admin-text)", fontSize: 13, fontWeight: 600 }}>{entry.name}</span>
                  <span style={{ color: "var(--admin-text-dim)", fontSize: 13, marginLeft: "auto" }}>{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ padding: "24px", minHeight: 320 }}>
          <h4 style={{ fontSize: 15, fontWeight: 700, color: "var(--admin-text)", marginBottom: 20 }}>Cookie Consent</h4>
          <div style={{ display: "flex", alignItems: "center", height: 240 }}>
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Pie data={stats?.consent} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value" stroke="none">
                  {(stats?.consent || []).map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ width: "40%", display: "flex", flexDirection: "column", gap: 12, justifyContent: "center" }}>
              {(stats?.consent || []).map(entry => (
                <div key={entry.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: entry.color }} />
                  <span style={{ color: "var(--admin-text)", fontSize: 13, fontWeight: 600 }}>{entry.name}</span>
                  <span style={{ color: "var(--admin-text-dim)", fontSize: 13, marginLeft: "auto" }}>{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <hr style={{ border: 0, borderBottom: "1px solid rgba(255,255,255,0.05)", margin: "0 0 40px 0" }} />

      {/* ─── OLD PAGEVIEW PERFORMANCE SECTION ─── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--admin-text)", fontFamily: "'Inter', sans-serif" }}>
            Page Performance
          </h2>
          <p style={{ fontSize: 13, color: "var(--admin-text-dim)", marginTop: 4 }}>
            Detailed breakdown of page views & time spent • Period: <strong style={{ color: "var(--admin-accent)" }}>{pageReport?.period || period}</strong>
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Hash size={14} style={{ color: "var(--admin-text-dim)" }} />
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="admin-input"
              style={{ width: 70, padding: "8px 10px", fontSize: 13 }}
            >
              {[5, 10, 20, 30, 50].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="admin-tabs">
            {["7d", "30d", "all"].map((p) => (
              <button key={p} className={`admin-tab ${period === p ? "active" : ""}`} onClick={() => setPeriod(p)}>
                {p === "all" ? "All Time" : p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20, marginBottom: 32 }}>
        <KpiCard label="Total Pageviews" value={pageReport?.total_pageviews || 0} icon={<Eye size={22} color="#fff" />} gradient="linear-gradient(135deg, #7c3aed, #6d28d9)" delay={0} />
        <KpiCard label="Top Pages Tracked" value={pageReport?.top_pages_by_visits?.length || 0} icon={<TrendingUp size={22} color="#fff" />} gradient="linear-gradient(135deg, #e11d48, #be123c)" delay={100} />
        <KpiCard label="Avg Time (Top Page)" value={pageReport?.top_pages_by_time_spent?.[0]?.avg_time_seconds ? formatTime(pageReport.top_pages_by_time_spent[0].avg_time_seconds) : "N/A"} icon={<Clock size={22} color="#fff" />} gradient="linear-gradient(135deg, #f59e0b, #d97706)" delay={200} format="text" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 20, marginBottom: 32 }}>
        {visitChartData.length > 0 && (
          <div className="admin-card" style={{ padding: "20px 16px" }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--admin-text)", marginBottom: 16, paddingLeft: 8 }}>📊 Top Pages by Visits</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={visitChartData} layout="vertical" margin={{ left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,41,59,0.5)" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="visits" name="Visits" radius={[0, 6, 6, 0]} maxBarSize={24}>
                  {visitChartData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} fillOpacity={0.85} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {timeChartData.length > 0 && (
          <div className="admin-card" style={{ padding: "20px 16px" }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--admin-text)", marginBottom: 16, paddingLeft: 8 }}>⏱️ Top Pages by Time Spent</h4>
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 20 }}>
        <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--admin-border)" }}><h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--admin-text)" }}>Top Pages by Visits</h4></div>
          <div style={{ maxHeight: 400, overflowY: "auto" }}>
            <table className="admin-table">
              <thead><tr><th>#</th><th>Page</th><th>Visits</th><th>Sessions</th></tr></thead>
              <tbody>
                {(pageReport?.top_pages_by_visits || []).map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 700, color: "var(--admin-accent)" }}>{i + 1}</td>
                    <td style={{ fontWeight: 500, color: "var(--admin-text)" }}>{row.page || "/"}</td>
                    <td>{row.visits.toLocaleString()}</td>
                    <td>{row.unique_sessions.toLocaleString()}</td>
                  </tr>
                ))}
                {(!pageReport?.top_pages_by_visits || pageReport.top_pages_by_visits.length === 0) && (
                  <tr><td colSpan={4} style={{ textAlign: "center", padding: 32, color: "var(--admin-text-dim)" }}>No data available for this period</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--admin-border)" }}><h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--admin-text)" }}>Top Pages by Time Spent</h4></div>
          <div style={{ maxHeight: 400, overflowY: "auto" }}>
            <table className="admin-table">
              <thead><tr><th>#</th><th>Page</th><th>Total Time</th><th>Avg Time</th></tr></thead>
              <tbody>
                {(pageReport?.top_pages_by_time_spent || []).map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 700, color: "var(--admin-accent)" }}>{i + 1}</td>
                    <td style={{ fontWeight: 500, color: "var(--admin-text)" }}>{row.page || "/"}</td>
                    <td>{formatTime(row.total_time_seconds)}</td>
                    <td>{formatTime(row.avg_time_seconds)}</td>
                  </tr>
                ))}
                {(!pageReport?.top_pages_by_time_spent || pageReport.top_pages_by_time_spent.length === 0) && (
                  <tr><td colSpan={4} style={{ textAlign: "center", padding: 32, color: "var(--admin-text-dim)" }}>No data available for this period</td></tr>
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

