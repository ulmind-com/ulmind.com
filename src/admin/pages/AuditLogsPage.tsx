/* ──────────────────────────────────────────────────────────────
   ULMiND Admin — Enhanced Audit Logs Page
   Enterprise security audit trail with advanced filtering,
   old/new value diff display, and premium table UI
   ────────────────────────────────────────────────────────────── */

import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { getAuditLogsAPI } from "../lib/api";
import {
  Shield, User, Search, RefreshCw, Loader2, Clock,
  Filter, ChevronDown, Activity, FileText, Eye
} from "lucide-react";
import { toast } from "sonner";

// ── Event Type Config ────────────────────────────────────────
const getEventColor = (eventType: string): string => {
  if (eventType?.includes("created") || eventType?.includes("CREATE")) return "#10b981";
  if (eventType?.includes("updated") || eventType?.includes("UPDATE")) return "#3b82f6";
  if (eventType?.includes("deleted") || eventType?.includes("DELETE")) return "#ef4444";
  if (eventType?.includes("login")) return "#f59e0b";
  if (eventType?.includes("payment") || eventType?.includes("invoice")) return "#8b5cf6";
  return "#6b7280";
};

const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { fetchLogs(); }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try { setLogs(await getAuditLogsAPI(300)); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleRefresh = async () => {
    await fetchLogs();
    toast.success("Audit logs refreshed");
  };

  // Unique event types for filter
  const eventTypes = useMemo(() => {
    const types = new Set(logs.map(l => l.event_type).filter(Boolean));
    return ["All", ...Array.from(types)];
  }, [logs]);

  // Filtered
  const filtered = useMemo(() => {
    return logs.filter(l => {
      const matchSearch = !search ||
        (l.user_id || "").toLowerCase().includes(search.toLowerCase()) ||
        (l.event_type || "").toLowerCase().includes(search.toLowerCase()) ||
        (l.resource_type || "").toLowerCase().includes(search.toLowerCase()) ||
        (l.description || "").toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "All" || l.event_type === typeFilter;
      return matchSearch && matchType;
    });
  }, [logs, search, typeFilter]);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: 120 }}>
      <Loader2 className="animate-spin" size={48} color="#3b82f6" />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* ── Header ────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#f0f6fc", letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 10 }}>
            <Shield size={28} style={{ color: "#f59e0b" }} />
            Audit Logs
          </h2>
          <p style={{ color: "#8b949e", fontSize: 14, marginTop: 4 }}>
            System security & activity audit trail • {logs.length} records
          </p>
        </div>
        <button onClick={handleRefresh}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#c9d1d9", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* ── KPI Stats ─────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Events", value: logs.length, color: "#3b82f6", icon: <Activity size={18} /> },
          { label: "Creates", value: logs.filter(l => (l.event_type || "").includes("created") || (l.event_type || "").includes("CREATE")).length, color: "#10b981", icon: <FileText size={18} /> },
          { label: "Updates", value: logs.filter(l => (l.event_type || "").includes("updated") || (l.event_type || "").includes("UPDATE")).length, color: "#3b82f6", icon: <FileText size={18} /> },
          { label: "Deletes", value: logs.filter(l => (l.event_type || "").includes("deleted") || (l.event_type || "").includes("DELETE")).length, color: "#ef4444", icon: <FileText size={18} /> },
        ].map((s, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}12`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#f0f6fc" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "#6e7681", fontWeight: 600 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search & Filters ──────────────────────────────── */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 280 }}>
          <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#6e7681" }} />
          <input type="text" placeholder="Search by user, event, resource, description..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "12px 14px 12px 42px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#f0f6fc", fontSize: 14, outline: "none" }}
          />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#c9d1d9", fontSize: 13, cursor: "pointer", outline: "none", maxWidth: 220 }}>
          {eventTypes.map(t => <option key={t} value={t}>{t === "All" ? "All Events" : t.replace(/_/g, " ")}</option>)}
        </select>
      </div>

      {/* ── Audit Table ───────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 80, color: "#6e7681" }}>
          <Shield size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
          <p style={{ fontSize: 16, fontWeight: 600, color: "#8b949e" }}>No audit logs found</p>
        </div>
      ) : (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Timestamp", "User", "Event", "Resource", "Description", "IP / Device", ""].map(h => (
                    <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#6e7681", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((log, i) => {
                  const color = getEventColor(log.event_type);
                  const isExpanded = expandedId === log._id;
                  return (
                    <React.Fragment key={log._id || i}>
                      <motion.tr
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.01 }}
                        onClick={() => setExpandedId(isExpanded ? null : log._id)}
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", cursor: "pointer", transition: "background 0.2s" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <td style={{ padding: "12px 16px", fontSize: 12, color: "#8b949e", whiteSpace: "nowrap" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <Clock size={12} />
                            {new Date(log.created_at).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(59,130,246,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <User size={13} color="#3b82f6" />
                            </div>
                            <span style={{ fontSize: 13, color: "#c9d1d9", fontWeight: 500 }}>
                              {(log.user_id || "system").includes("@") ? log.user_id.split("@")[0] : log.user_id}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 6, background: `${color}12`, color, fontSize: 11, fontWeight: 700, letterSpacing: "0.03em" }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
                            {(log.event_type || "").replace(/_/g, " ")}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: "#8b949e" }}>{log.resource_type || "—"}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13, color: "#c9d1d9", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {log.description || "—"}
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 11, color: "#484f58", fontFamily: "monospace" }}>
                          {log.ip_address || "—"}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <Eye size={14} color="#484f58" />
                        </td>
                      </motion.tr>

                      {/* Expanded Detail Row */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} style={{ padding: "0 16px 16px 16px" }}>
                            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: 20, marginTop: 4 }}>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                {log.old_value && (
                                  <div>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: "#ef4444", textTransform: "uppercase", marginBottom: 8 }}>Previous Value</div>
                                    <pre style={{ fontSize: 11, color: "#8b949e", background: "rgba(239,68,68,0.04)", padding: 12, borderRadius: 8, overflow: "auto", maxHeight: 200, border: "1px solid rgba(239,68,68,0.1)" }}>
                                      {JSON.stringify(log.old_value, null, 2)}
                                    </pre>
                                  </div>
                                )}
                                {log.new_value && (
                                  <div>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: "#10b981", textTransform: "uppercase", marginBottom: 8 }}>New Value</div>
                                    <pre style={{ fontSize: 11, color: "#8b949e", background: "rgba(16,185,129,0.04)", padding: 12, borderRadius: 8, overflow: "auto", maxHeight: 200, border: "1px solid rgba(16,185,129,0.1)" }}>
                                      {JSON.stringify(log.new_value, null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                              <div style={{ display: "flex", gap: 24, marginTop: 12, fontSize: 11, color: "#484f58" }}>
                                <span>Resource ID: <code style={{ color: "#6e7681" }}>{log.resource_id || "—"}</code></span>
                                <span>User Agent: {log.user_agent || "—"}</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AuditLogsPage;
