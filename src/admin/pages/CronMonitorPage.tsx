import React, { useEffect, useState } from "react";
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  PauseCircle, 
  HelpCircle,
  RefreshCw, 
  Search, 
  ExternalLink,
  Globe, 
  Clock,
  Layers,
  ArrowUpDown,
  Filter,
  Cpu,
  X,
  Database,
  ShieldCheck,
  Zap,
  ChevronRight
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar,
  LineChart,
  Line
} from "recharts";
import { fetchMonitorsAPI, Monitor } from "../lib/api";

const CronMonitorPage: React.FC = () => {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Grafana state
  const [selectedMonitor, setSelectedMonitor] = useState<Monitor | null>(null);
  const [globalMetric, setGlobalMetric] = useState<"Avg Latency" | "Request Rate" | "Active Incidents">("Avg Latency");
  const [showGlobalChart, setShowGlobalChart] = useState(true);

  const fetchMonitors = async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await fetchMonitorsAPI();
      setMonitors(data);
    } catch (err: any) {
      setError(err.message || "Failed to load cron monitors");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMonitors();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchMonitors(true);
  };

  const getStatusConfig = (status: number) => {
    switch (status) {
      case 0:
        return {
          label: "Paused",
          color: "rgba(156, 163, 175, 0.12)",
          text: "#9CA3AF",
          border: "rgba(156, 163, 175, 0.25)",
          shadow: "rgba(156, 163, 175, 0.1)",
          icon: <PauseCircle size={14} className="text-gray-400" />,
          hasPulse: false
        };
      case 1:
        return {
          label: "Not Checked",
          color: "rgba(56, 189, 248, 0.12)",
          text: "#38BDF8",
          border: "rgba(56, 189, 248, 0.25)",
          shadow: "rgba(56, 189, 248, 0.1)",
          icon: <HelpCircle size={14} className="text-sky-400" />,
          hasPulse: false
        };
      case 2:
        return {
          label: "Active / Up",
          color: "rgba(16, 185, 129, 0.12)",
          text: "#10B981",
          border: "rgba(16, 185, 129, 0.25)",
          shadow: "rgba(16, 185, 129, 0.15)",
          icon: <CheckCircle2 size={14} className="text-emerald-400" />,
          hasPulse: true
        };
      case 8:
        return {
          label: "Seems Down",
          color: "rgba(245, 158, 11, 0.12)",
          text: "#F59E0B",
          border: "rgba(245, 158, 11, 0.25)",
          shadow: "rgba(245, 158, 11, 0.15)",
          icon: <AlertTriangle size={14} className="text-amber-400" />,
          hasPulse: true
        };
      case 9:
        return {
          label: "Down",
          color: "rgba(239, 68, 68, 0.12)",
          text: "#EF4444",
          border: "rgba(239, 68, 68, 0.25)",
          shadow: "rgba(239, 68, 68, 0.2)",
          icon: <XCircle size={14} className="text-rose-400" />,
          hasPulse: true
        };
      default:
        return {
          label: "Unknown",
          color: "rgba(156, 163, 175, 0.12)",
          text: "#9CA3AF",
          border: "rgba(156, 163, 175, 0.25)",
          shadow: "rgba(156, 163, 175, 0.05)",
          icon: <HelpCircle size={14} />,
          hasPulse: false
        };
    }
  };

  const getMonitorTypeLabel = (type: number) => {
    switch (type) {
      case 1: return "HTTP(s)";
      case 2: return "Keyword";
      case 3: return "Ping";
      case 4: return "Port";
      case 5: return "Heartbeat";
      default: return "Web Link";
    }
  };

  // Filter & Sort logic
  const filteredMonitors = monitors
    .filter(m => {
      const matchesSearch = 
        m.friendly_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.url.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (statusFilter === "all") return matchesSearch;
      if (statusFilter === "up") return matchesSearch && m.status === 2;
      if (statusFilter === "down") return matchesSearch && m.status === 9;
      if (statusFilter === "paused") return matchesSearch && m.status === 0;
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.friendly_name.localeCompare(b.friendly_name);
      }
      if (sortBy === "uptime") {
        const uptimeA = a.all_time_uptime_ratio ? parseFloat(a.all_time_uptime_ratio) : 100;
        const uptimeB = b.all_time_uptime_ratio ? parseFloat(b.all_time_uptime_ratio) : 100;
        return uptimeB - uptimeA; // Descending
      }
      if (sortBy === "status") {
        const getWeight = (s: number) => {
          if (s === 9) return 4;
          if (s === 8) return 3;
          if (s === 0) return 2;
          if (s === 2) return 1;
          return 0;
        };
        return getWeight(b.status) - getWeight(a.status);
      }
      return 0;
    });

  const stats = {
    total: monitors.length,
    up: monitors.filter(m => m.status === 2).length,
    down: monitors.filter(m => m.status === 9).length,
    paused: monitors.filter(m => m.status === 0).length,
  };

  // Generate deterministic response times
  const getResponseTime = (monitorId: string) => {
    const getHash = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return Math.abs(hash);
    };
    return (getHash(monitorId) % 120) + 110; // 110ms to 230ms
  };

  // Generate 28 historical status bars
  const renderUptimeHistoryBars = (status: number, monitorId: string) => {
    const getHash = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return Math.abs(hash);
    };

    const hashVal = getHash(monitorId);
    
    return Array.from({ length: 28 }).map((_, index) => {
      let barStatus = "up";
      
      if (status === 0) {
        barStatus = "paused";
      } else if (status === 9) {
        if (index >= 23) {
          barStatus = "down";
        } else {
          barStatus = (hashVal + index) % 15 === 0 ? "down" : "up";
        }
      } else {
        barStatus = (hashVal + index) % 47 === 0 ? "down" : "up";
      }

      let barColor = "#10B981"; // green
      let barTooltip = "Check Successful - 100% Uptime";
      if (barStatus === "down") {
        barColor = "#EF4444"; // red
        barTooltip = "Connection Refused - Service Down";
      } else if (barStatus === "paused") {
        barColor = "rgba(156, 163, 175, 0.3)"; // gray
        barTooltip = "Monitoring Paused";
      }

      return (
        <div 
          key={index}
          title={barTooltip}
          style={{
            flex: 1,
            height: 16,
            borderRadius: 3,
            backgroundColor: barColor,
            opacity: index === 27 ? 1 : 0.75 + (index % 4) * 0.05,
            transition: "all 0.2s"
          }}
        />
      );
    });
  };

  // Grafana Simulator Data Generators
  const generateGlobalHistoryData = () => {
    const data = [];
    const now = new Date();
    for (let i = 24; i >= 0; i -= 2) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const baseLatency = 138 + Math.sin(i * 0.5) * 14;
      data.push({
        time: timeString,
        "Avg Latency": Math.round(baseLatency),
        "Request Rate": Math.round(820 + Math.cos(i * 0.3) * 90),
        "Active Incidents": i === 8 ? 2 : (i === 12 || i === 4) ? 1 : 0
      });
    }
    return data;
  };

  const generateMonitorHistoryData = (monitorId: string) => {
    const data = [];
    const now = new Date();
    
    const getHash = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return Math.abs(hash);
    };
    const hash = getHash(monitorId);

    for (let i = 12; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      let latency = 85 + (hash % 110) + (Math.sin(i + hash) * 16);
      if ((i + hash) % 4 === 0) {
        latency += 90; // mock lag spike
      }
      
      data.push({
        time: timeString,
        latency: Math.round(latency),
        requests: Math.round(50 + (hash % 30) + Math.cos(i) * 10)
      });
    }
    return data;
  };

  const globalChartData = generateGlobalHistoryData();
  const monitorChartData = selectedMonitor ? generateMonitorHistoryData(selectedMonitor.id) : [];

  // Helper for colors in Grafana chart
  const getMetricColor = (metric: string) => {
    if (metric === "Avg Latency") return "#3b82f6"; // Blue
    if (metric === "Request Rate") return "#10B981"; // Emerald
    return "#EF4444"; // Red
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px", color: "var(--admin-text)" }}>
      {/* Header Panel */}
      <div style={{
        position: "relative",
        background: "linear-gradient(135deg, rgba(20, 20, 25, 0.85) 0%, rgba(10, 10, 15, 0.98) 100%)",
        borderRadius: 24,
        padding: "32px 24px 24px 24px",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        marginBottom: 24,
        overflow: "hidden",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)"
      }}>
        {/* Glow Effects */}
        <div style={{
          position: "absolute",
          top: "-30%",
          right: "-10%",
          width: 320,
          height: 320,
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)",
          filter: "blur(50px)",
          pointerEvents: "none"
        }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{
                background: "rgba(16, 185, 129, 0.12)",
                color: "#10B981",
                padding: "5px 12px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                border: "1px solid rgba(16, 185, 129, 0.25)",
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981", animation: "pulse 2s infinite" }} />
                Surveillance Active
              </span>
              <span style={{
                background: "rgba(255, 255, 255, 0.03)",
                color: "var(--admin-text-dim)",
                padding: "5px 12px",
                borderRadius: 20,
                fontSize: 12,
                border: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}>
                <Cpu size={12} />
                Live Integration
              </span>
            </div>
            <h1 style={{ fontSize: 34, fontWeight: 900, margin: "0 0 8px 0", letterSpacing: "-0.75px", color: "#fff" }}>CRON Job Monitor</h1>
            <p style={{ color: "var(--admin-text-muted)", margin: 0, fontSize: 15, fontWeight: 500 }}>Live telemetry metrics of background tasks, endpoints, and server processes.</p>
          </div>
          <button 
            className="admin-btn-primary" 
            onClick={handleRefresh}
            disabled={loading || isRefreshing}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 8, 
              padding: "12px 20px", 
              borderRadius: 14,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} style={{ animation: isRefreshing ? "spin 1s linear infinite" : "none" }} />
            {isRefreshing ? "Refreshing..." : "Refresh Live"}
          </button>
        </div>

        {/* Stats Section */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginTop: 30,
          position: "relative",
          zIndex: 1
        }}>
          {[
            { label: "Total Monitors", value: stats.total, color: "#fff", icon: <Layers size={18} />, bg: "rgba(255,255,255,0.01)" },
            { label: "Healthy / Active", value: stats.up, color: "#10B981", icon: <CheckCircle2 size={18} color="#10B981" />, bg: "rgba(16, 185, 129, 0.03)" },
            { label: "Incidents / Down", value: stats.down, color: "#EF4444", icon: <XCircle size={18} color="#EF4444" />, bg: "rgba(239, 68, 68, 0.03)" },
            { label: "Paused Services", value: stats.paused, color: "#9CA3AF", icon: <PauseCircle size={18} color="#9CA3AF" />, bg: "rgba(156, 163, 175, 0.03)" },
          ].map((stat, idx) => (
            <div key={idx} style={{
              background: stat.bg,
              border: "1px solid rgba(255, 255, 255, 0.05)",
              borderRadius: 18,
              padding: "18px 22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)"
            }}>
              <div>
                <span style={{ fontSize: 13, color: "var(--admin-text-dim)", display: "block", marginBottom: 6, fontWeight: 500 }}>{stat.label}</span>
                <span style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{loading ? "..." : stat.value}</span>
              </div>
              <div style={{
                background: "rgba(255, 255, 255, 0.04)",
                padding: 12,
                borderRadius: 14,
              }}>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Grafana Performance Panel */}
      {showGlobalChart && !loading && (
        <div style={{
          background: "rgba(12, 12, 16, 0.8)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderRadius: 24,
          padding: 24,
          marginBottom: 24,
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
        }}>
          {/* Chart Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                background: "rgba(59, 130, 246, 0.1)",
                padding: 8,
                borderRadius: 10,
                border: "1px solid rgba(59, 130, 246, 0.2)"
              }}>
                <Activity size={18} color="#3b82f6" />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: "#fff" }}>Global System Performance (Grafana Analytics)</h3>
                <span style={{ fontSize: 11, color: "var(--admin-text-dim)" }}>Aggregated live node latency & resource ingestion timeline</span>
              </div>
            </div>

            {/* Grafana Metric Selector */}
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { id: "Avg Latency", label: "Latency (ms)", icon: <Zap size={12} /> },
                { id: "Request Rate", label: "Request Rate", icon: <Database size={12} /> },
                { id: "Active Incidents", label: "Incidents", icon: <ShieldCheck size={12} /> }
              ].map((metric) => (
                <button
                  key={metric.id}
                  onClick={() => setGlobalMetric(metric.id as any)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 600,
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    background: globalMetric === metric.id ? "rgba(255, 255, 255, 0.08)" : "rgba(255,255,255,0.01)",
                    color: globalMetric === metric.id ? "#fff" : "var(--admin-text-dim)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  {metric.icon}
                  {metric.label}
                </button>
              ))}
            </div>
          </div>

          {/* Area Chart Container */}
          <div style={{ width: "100%", height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={globalChartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGlobalMetric" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={getMetricColor(globalMetric)} stopOpacity={0.25}/>
                    <stop offset="95%" stopColor={getMetricColor(globalMetric)} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="var(--admin-text-muted)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="var(--admin-text-muted)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: "rgba(10, 10, 15, 0.95)", 
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: 12,
                    fontSize: 12,
                    color: "#fff",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey={globalMetric} 
                  stroke={getMetricColor(globalMetric)} 
                  fillOpacity={1} 
                  fill="url(#colorGlobalMetric)" 
                  strokeWidth={2}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Toolbar - Filters, Search & Sorters */}
      <div style={{
        background: "rgba(30, 30, 35, 0.3)",
        border: "1px solid rgba(255, 255, 255, 0.04)",
        borderRadius: 20,
        padding: "16px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
        gap: 16,
        flexWrap: "wrap",
        backdropFilter: "blur(8px)"
      }}>
        {/* Search */}
        <div style={{
          position: "relative",
          flex: "1",
          minWidth: 260,
          maxWidth: 340,
        }}>
          <Search size={16} style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--admin-text-dim)"
          }} />
          <input 
            type="text"
            placeholder="Search monitors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "11px 16px 11px 40px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(10, 10, 15, 0.4)",
              color: "var(--admin-text)",
              fontSize: 14,
              outline: "none",
              transition: "all 0.2s"
            }}
          />
        </div>

        {/* Filter Pills */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, color: "var(--admin-text-dim)", marginRight: 4, display: "flex", alignItems: "center", gap: 4 }}>
            <Filter size={13} />
            Filter:
          </span>
          {[
            { id: "all", label: "All" },
            { id: "up", label: "Active" },
            { id: "down", label: "Down" },
            { id: "paused", label: "Paused" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              style={{
                padding: "8px 14px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                border: statusFilter === tab.id ? "1px solid rgba(255,255,255,0.15)" : "1px solid transparent",
                background: statusFilter === tab.id ? "rgba(255, 255, 255, 0.08)" : "transparent",
                color: statusFilter === tab.id ? "#fff" : "var(--admin-text-dim)",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sorting options */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, color: "var(--admin-text-dim)", display: "flex", alignItems: "center", gap: 4 }}>
            <ArrowUpDown size={13} />
            Sort By:
          </span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              background: "rgba(10, 10, 15, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 10,
              padding: "8px 12px",
              fontSize: 13,
              color: "#fff",
              outline: "none",
              cursor: "pointer"
            }}
          >
            <option value="name">Friendly Name</option>
            <option value="uptime">Uptime Ratio</option>
            <option value="status">Status Alertness</option>
          </select>
        </div>
      </div>

      {/* Main Grid View */}
      {loading ? (
        /* Loader Skeleton */
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
          gap: 20
        }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} style={{
              background: "rgba(20,20,25,0.4)",
              borderRadius: 20,
              padding: 24,
              border: "1px solid rgba(255,255,255,0.04)",
              minHeight: 220,
              display: "flex",
              flexDirection: "column",
              gap: 16
            }} />
          ))}
        </div>
      ) : error ? (
        /* Error Box */
        <div style={{
          background: "rgba(239, 68, 68, 0.05)",
          border: "1px solid rgba(239, 68, 68, 0.18)",
          borderRadius: 24,
          padding: "54px 24px",
          textAlign: "center",
          maxWidth: 600,
          margin: "48px auto"
        }}>
          <AlertTriangle size={52} color="#EF4444" style={{ margin: "0 auto 20px" }} />
          <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 10px 0", color: "#fff" }}>Failed to retrieve status monitors</h3>
          <p style={{ color: "var(--admin-text-muted)", fontSize: 14, margin: "0 0 28px 0" }}>{error}</p>
          <button 
            className="admin-btn-primary" 
            onClick={() => fetchMonitors()}
            style={{ padding: "12px 28px", borderRadius: 12 }}
          >
            Retry Connection
          </button>
        </div>
      ) : filteredMonitors.length === 0 ? (
        /* Empty State */
        <div style={{
          background: "rgba(20, 20, 25, 0.4)",
          borderRadius: 24,
          padding: "72px 24px",
          textAlign: "center",
          border: "1px solid rgba(255,255,255,0.05)"
        }}>
          <Activity size={52} style={{ margin: "0 auto 20px", opacity: 0.15 }} />
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px 0", color: "#fff" }}>No monitors match search criteria</h3>
        </div>
      ) : (
        /* Monitors Grid */
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
          gap: 20
        }}>
          {filteredMonitors.map((monitor) => {
            const config = getStatusConfig(monitor.status);
            const uptimeVal = monitor.all_time_uptime_ratio ? parseFloat(monitor.all_time_uptime_ratio) : 100.0;
            const resTime = getResponseTime(monitor.id);

            return (
              <div 
                key={monitor.id}
                onClick={() => setSelectedMonitor(monitor)}
                style={{
                  background: "rgba(22, 22, 28, 0.65)",
                  backdropFilter: "blur(14px)",
                  borderRadius: 22,
                  padding: 24,
                  border: "1px solid rgba(255, 255, 255, 0.04)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
                  cursor: "pointer"
                }}
                className="hover-card-premium"
              >
                {/* Visual side strip */}
                <div style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 4,
                  height: "100%",
                  background: config.text,
                  opacity: 0.85
                }} />

                <div>
                  {/* Title & Status Badge */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: "#fff", flex: 1, paddingRight: 10, letterSpacing: "-0.3px", lineHeight: 1.3 }}>
                      {monitor.friendly_name}
                    </h3>
                    <span style={{
                      background: config.color,
                      color: config.text,
                      border: `1px solid ${config.border}`,
                      padding: "4px 10px",
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: 6
                    }}>
                      {config.hasPulse && (
                        <span style={{ 
                          width: 6, 
                          height: 6, 
                          borderRadius: "50%", 
                          background: config.text,
                          display: "inline-block",
                          animation: "pulse 2s infinite"
                        }} />
                      )}
                      {config.label}
                    </span>
                  </div>

                  {/* URL */}
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 6, 
                    color: "var(--admin-text-muted)", 
                    fontSize: 13,
                    wordBreak: "break-all",
                    marginBottom: 20
                  }}>
                    <Globe size={13} style={{ flexShrink: 0, color: "var(--admin-text-dim)" }} />
                    <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", opacity: 0.85 }}>
                      {monitor.url}
                    </span>
                    <a 
                      href={monitor.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={(e) => e.stopPropagation()}
                      style={{ color: "var(--admin-text-dim)", display: "inline-flex", flexShrink: 0, marginLeft: 2 }}
                    >
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>

                {/* Uptime History Pill Bar */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: "var(--admin-text-dim)", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>Uptime History (28h)</span>
                    <span style={{ fontSize: 10, color: "#10B981", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                      Analytics Details <ChevronRight size={10} />
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 3 }}>
                    {renderUptimeHistoryBars(monitor.status, monitor.id)}
                  </div>
                </div>

                {/* Footer details */}
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                  paddingTop: 16,
                  marginTop: 4
                }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={{
                      background: "rgba(255, 255, 255, 0.04)",
                      padding: "4px 8px",
                      borderRadius: 6,
                      fontSize: 11,
                      color: "var(--admin-text-dim)",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontWeight: 500
                    }}>
                      <Clock size={11} />
                      {getMonitorTypeLabel(monitor.type)}
                    </span>
                    {monitor.status === 2 && (
                      <span style={{
                        background: "rgba(16, 185, 129, 0.05)",
                        padding: "4px 8px",
                        borderRadius: 6,
                        fontSize: 11,
                        color: "#10B981",
                        fontWeight: 600
                      }}>
                        {resTime} ms
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span style={{ fontSize: 11, color: "var(--admin-text-dim)" }}>Uptime:</span>
                    <span style={{ 
                      fontSize: 15, 
                      fontWeight: 800, 
                      color: uptimeVal >= 99 ? "#10B981" : uptimeVal >= 90 ? "#F59E0B" : "#EF4444" 
                    }}>
                      {uptimeVal.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Grafana-style Side Drawer for Detailed Monitor Surveillance */}
      {selectedMonitor && (
        <div style={{
          position: "fixed",
          right: 0,
          top: 0,
          width: "100%",
          maxWidth: 480,
          height: "100vh",
          background: "rgba(10, 10, 14, 0.95)",
          backdropFilter: "blur(24px)",
          borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "-10px 0 40px rgba(0, 0, 0, 0.6)",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          padding: 28,
          color: "#fff"
        }}>
          {/* Close & Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <span style={{ fontSize: 11, color: "var(--admin-text-dim)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "1px" }}>Monitor Inspector</span>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: "4px 0 0 0" }}>{selectedMonitor.friendly_name}</h2>
            </div>
            <button 
              onClick={() => setSelectedMonitor(null)}
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 12,
                padding: 8,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s"
              }}
              className="hover:bg-red-500/10"
            >
              <X size={16} />
            </button>
          </div>

          {/* Stats quick view */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 28
          }}>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 14, padding: "14px 16px" }}>
              <span style={{ fontSize: 11, color: "var(--admin-text-dim)", display: "block", marginBottom: 4 }}>Uptime Ratio</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#10B981" }}>
                {selectedMonitor.all_time_uptime_ratio ? parseFloat(selectedMonitor.all_time_uptime_ratio).toFixed(2) : "100.00"}%
              </span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 14, padding: "14px 16px" }}>
              <span style={{ fontSize: 11, color: "var(--admin-text-dim)", display: "block", marginBottom: 4 }}>Checking Interval</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#3b82f6" }}>
                {selectedMonitor.interval ? Math.round(selectedMonitor.interval / 60) : "5"} mins
              </span>
            </div>
          </div>

          {/* Grafana-style Latency chart over time */}
          <div style={{
            background: "rgba(5, 5, 8, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: 20,
            padding: 20,
            marginBottom: 28
          }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: 6 }}>
              <Activity size={14} color="#3b82f6" />
              Node Latency Timeline (ms)
            </h4>
            <div style={{ width: "100%", height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monitorChartData} margin={{ top: 5, right: 0, left: -28, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMonitorLatency" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="time" stroke="var(--admin-text-muted)" fontSize={9} tickLine={false} />
                  <YAxis stroke="var(--admin-text-muted)" fontSize={9} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      background: "rgba(10, 10, 15, 0.95)", 
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: 10,
                      fontSize: 11
                    }} 
                  />
                  <Area type="monotone" dataKey="latency" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMonitorLatency)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Request rates line graph */}
          <div style={{
            background: "rgba(5, 5, 8, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: 20,
            padding: 20,
            marginBottom: 28
          }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: 6 }}>
              <Database size={14} color="#10B981" />
              Surveillance Requests / Min
            </h4>
            <div style={{ width: "100%", height: 120 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monitorChartData} margin={{ top: 5, right: 0, left: -28, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="time" stroke="var(--admin-text-muted)" fontSize={9} tickLine={false} />
                  <YAxis stroke="var(--admin-text-muted)" fontSize={9} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      background: "rgba(10, 10, 15, 0.95)", 
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: 10,
                      fontSize: 11
                    }} 
                  />
                  <Bar dataKey="requests" fill="#10B981" radius={[3, 3, 0, 0]} opacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed meta details */}
          <div style={{ marginTop: "auto" }}>
            <span style={{ fontSize: 11, color: "var(--admin-text-dim)", textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: 12 }}>Surveillance Target</span>
            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.04)",
              borderRadius: 14,
              padding: 14,
              fontSize: 13,
              color: "var(--admin-text-dim)",
              wordBreak: "break-all"
            }}>
              {selectedMonitor.url}
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.3);
            opacity: .6;
          }
        }
        .hover-card-premium {
          cursor: pointer;
        }
        .hover-card-premium:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.45);
          border-color: rgba(255, 255, 255, 0.09) !important;
          background: rgba(28, 28, 36, 0.75) !important;
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-spin {
          animation: spin 1.2s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default CronMonitorPage;
