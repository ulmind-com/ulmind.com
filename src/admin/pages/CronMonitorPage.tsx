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
  Layers
} from "lucide-react";
import { fetchMonitorsAPI, Monitor } from "../lib/api";

const CronMonitorPage: React.FC = () => {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

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
          color: "rgba(156, 163, 175, 0.15)",
          text: "#9CA3AF",
          border: "rgba(156, 163, 175, 0.3)",
          icon: <PauseCircle size={14} className="text-gray-400" />,
          hasPulse: false
        };
      case 1:
        return {
          label: "Not Checked",
          color: "rgba(56, 189, 248, 0.15)",
          text: "#38BDF8",
          border: "rgba(56, 189, 248, 0.3)",
          icon: <HelpCircle size={14} className="text-sky-400" />,
          hasPulse: false
        };
      case 2:
        return {
          label: "Active / Up",
          color: "rgba(16, 185, 129, 0.15)",
          text: "#10B981",
          border: "rgba(16, 185, 129, 0.3)",
          icon: <CheckCircle2 size={14} className="text-emerald-400" />,
          hasPulse: true
        };
      case 8:
        return {
          label: "Seems Down",
          color: "rgba(245, 158, 11, 0.15)",
          text: "#F59E0B",
          border: "rgba(245, 158, 11, 0.3)",
          icon: <AlertTriangle size={14} className="text-amber-400" />,
          hasPulse: true
        };
      case 9:
        return {
          label: "Down",
          color: "rgba(239, 68, 68, 0.15)",
          text: "#EF4444",
          border: "rgba(239, 68, 68, 0.3)",
          icon: <XCircle size={14} className="text-rose-400" />,
          hasPulse: true
        };
      default:
        return {
          label: "Unknown",
          color: "rgba(156, 163, 175, 0.15)",
          text: "#9CA3AF",
          border: "rgba(156, 163, 175, 0.3)",
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

  const filteredMonitors = monitors.filter(m =>
    m.friendly_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: monitors.length,
    up: monitors.filter(m => m.status === 2).length,
    down: monitors.filter(m => m.status === 9).length,
    paused: monitors.filter(m => m.status === 0).length,
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px", color: "var(--admin-text)" }}>
      {/* Header section with gradient background highlight */}
      <div style={{
        position: "relative",
        background: "linear-gradient(135deg, rgba(30, 30, 40, 0.7) 0%, rgba(15, 15, 20, 0.9) 100%)",
        borderRadius: 24,
        padding: "32px 24px",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        marginBottom: 32,
        overflow: "hidden",
      }}>
        {/* Abstract glowing lights behind content */}
        <div style={{
          position: "absolute",
          top: "-50%",
          right: "-10%",
          width: 300,
          height: 300,
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute",
          bottom: "-50%",
          left: "-50px",
          width: 250,
          height: 250,
          background: "radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, transparent 70%)",
          filter: "blur(30px)",
          pointerEvents: "none"
        }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{
                background: "rgba(16, 185, 129, 0.15)",
                color: "#10B981",
                padding: "4px 10px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                border: "1px solid rgba(16, 185, 129, 0.3)",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", animation: "pulse 2s infinite" }} />
                System Status: Live
              </span>
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 8px 0", letterSpacing: "-0.5px" }}>CRON Job Monitor</h1>
            <p style={{ color: "var(--admin-text-muted)", margin: 0, fontSize: 15 }}>Real-time background tasks and system health surveillance.</p>
          </div>
          <button 
            className="admin-btn-primary" 
            onClick={handleRefresh}
            disabled={loading || isRefreshing}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 8, 
              padding: "10px 18px", 
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

        {/* Stats strip */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginTop: 32,
          position: "relative",
          zIndex: 1
        }}>
          {[
            { label: "Total Monitors", value: stats.total, color: "var(--admin-text)", icon: <Layers size={18} /> },
            { label: "Healthy / Up", value: stats.up, color: "#10B981", icon: <CheckCircle2 size={18} color="#10B981" /> },
            { label: "Incidents / Down", value: stats.down, color: "#EF4444", icon: <XCircle size={18} color="#EF4444" /> },
            { label: "Paused Services", value: stats.paused, color: "#9CA3AF", icon: <PauseCircle size={18} color="#9CA3AF" /> },
          ].map((stat, idx) => (
            <div key={idx} style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.03)",
              borderRadius: 16,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div>
                <span style={{ fontSize: 13, color: "var(--admin-text-dim)", display: "block", marginBottom: 4 }}>{stat.label}</span>
                <span style={{ fontSize: 24, fontWeight: 700, color: stat.color }}>{loading ? "..." : stat.value}</span>
              </div>
              <div style={{
                background: "rgba(255, 255, 255, 0.04)",
                padding: 10,
                borderRadius: 12,
              }}>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar / Search */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
        gap: 16,
        flexWrap: "wrap"
      }}>
        <div style={{
          position: "relative",
          flex: "1",
          maxWidth: 400,
        }}>
          <Search size={18} style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--admin-text-dim)"
          }} />
          <input 
            type="text"
            placeholder="Search monitors by name or url..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px 12px 42px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(30, 30, 35, 0.4)",
              color: "var(--admin-text)",
              fontSize: 14,
              outline: "none",
              transition: "all 0.2s"
            }}
          />
        </div>
        <div style={{ fontSize: 13, color: "var(--admin-text-dim)" }}>
          Showing {filteredMonitors.length} of {monitors.length} targets
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        /* Skeleton Grid */
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: 20
        }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} style={{
              background: "rgba(30,30,35,0.4)",
              borderRadius: 20,
              padding: 24,
              border: "1px solid rgba(255,255,255,0.04)",
              minHeight: 180,
              display: "flex",
              flexDirection: "column",
              gap: 14
            }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ width: "60%", height: 20, background: "rgba(255,255,255,0.05)", borderRadius: 4 }} className="animate-pulse" />
                <div style={{ width: "25%", height: 20, background: "rgba(255,255,255,0.05)", borderRadius: 10 }} className="animate-pulse" />
              </div>
              <div style={{ width: "90%", height: 14, background: "rgba(255,255,255,0.03)", borderRadius: 4 }} className="animate-pulse" />
              <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between" }}>
                <div style={{ width: "35%", height: 16, background: "rgba(255,255,255,0.03)", borderRadius: 4 }} className="animate-pulse" />
                <div style={{ width: "30%", height: 16, background: "rgba(255,255,255,0.03)", borderRadius: 4 }} className="animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        /* Error State */
        <div style={{
          background: "rgba(239, 68, 68, 0.05)",
          border: "1px solid rgba(239, 68, 68, 0.2)",
          borderRadius: 20,
          padding: "48px 24px",
          textAlign: "center",
          maxWidth: 600,
          margin: "40px auto"
        }}>
          <AlertTriangle size={48} color="#EF4444" style={{ margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px 0" }}>Failed to retrieve status monitors</h3>
          <p style={{ color: "var(--admin-text-muted)", fontSize: 14, margin: "0 0 24px 0" }}>{error}</p>
          <button 
            className="admin-btn-primary" 
            onClick={() => fetchMonitors()}
            style={{ padding: "10px 24px", borderRadius: 12 }}
          >
            Retry Connection
          </button>
        </div>
      ) : filteredMonitors.length === 0 ? (
        /* Empty State */
        <div style={{
          background: "rgba(30, 30, 35, 0.4)",
          borderRadius: 20,
          padding: "64px 24px",
          textAlign: "center",
          border: "1px solid rgba(255,255,255,0.05)"
        }}>
          <Activity size={48} style={{ margin: "0 auto 16px", opacity: 0.2 }} />
          <h3 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 6px 0" }}>No monitors found</h3>
          <p style={{ color: "var(--admin-text-dim)", fontSize: 14, margin: 0 }}>Try adjusting your search query to find your targeted monitors.</p>
        </div>
      ) : (
        /* Cards Grid */
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: 20
        }}>
          {filteredMonitors.map((monitor) => {
            const config = getStatusConfig(monitor.status);
            return (
              <div 
                key={monitor.id}
                style={{
                  background: "rgba(30, 30, 35, 0.55)",
                  backdropFilter: "blur(12px)",
                  borderRadius: 20,
                  padding: 24,
                  border: "1px solid rgba(255, 255, 255, 0.04)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden"
                }}
                className="hover-card-premium"
              >
                {/* Status indicator pulse line on top border */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: 3,
                  background: config.text,
                  opacity: 0.8
                }} />

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: "#fff", flex: 1, paddingRight: 8 }}>
                      {monitor.friendly_name}
                    </h3>
                    <span style={{
                      background: config.color,
                      color: config.text,
                      border: `1px solid ${config.border}`,
                      padding: "4px 8px",
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      whiteSpace: "nowrap"
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

                  {/* Target URL */}
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 6, 
                    color: "var(--admin-text-muted)", 
                    fontSize: 13,
                    wordBreak: "break-all",
                    marginBottom: 20
                  }}>
                    <Globe size={13} style={{ flexShrink: 0 }} />
                    <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                      {monitor.url}
                    </span>
                    <a 
                      href={monitor.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ color: "var(--admin-text-dim)", hover: { color: "#fff" }, display: "inline-flex", flexShrink: 0 }}
                    >
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>

                {/* Footer Metrics */}
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  borderTop: "1px solid rgba(255,255,255,0.04)",
                  paddingTop: 16,
                  marginTop: 8
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      padding: "4px 8px",
                      borderRadius: 6,
                      fontSize: 11,
                      color: "var(--admin-text-dim)",
                      display: "flex",
                      alignItems: "center",
                      gap: 4
                    }}>
                      <Clock size={11} />
                      {getMonitorTypeLabel(monitor.type)}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: "var(--admin-text-dim)" }}>Uptime: </span>
                    <span style={{ 
                      fontSize: 14, 
                      fontWeight: 700, 
                      color: parseFloat(monitor.all_time_uptime_ratio) >= 99 ? "#10B981" : "#F59E0B" 
                    }}>
                      {parseFloat(monitor.all_time_uptime_ratio).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Embedded Pulse Animations inside a style tag */}
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
        .hover-card-premium:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
          border-color: rgba(255, 255, 255, 0.1) !important;
          background: rgba(35, 35, 42, 0.7) !important;
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
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
