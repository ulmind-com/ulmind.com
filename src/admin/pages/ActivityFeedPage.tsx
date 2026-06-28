/* ──────────────────────────────────────────────────────────────
   ULMiND Admin — Enterprise Activity Feed
   Real-time activity stream with premium animations,
   user avatars, action badges, and timeline-style layout
   ────────────────────────────────────────────────────────────── */

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getActivityFeedAPI } from "../lib/api";
import {
  Loader2, RefreshCw, Activity, FileText, Users, Briefcase,
  DollarSign, Shield, Bell, Upload, CheckCircle2, Plus,
  Edit3, Trash2, Eye, Clock, Filter, ChevronDown
} from "lucide-react";
import { toast } from "sonner";

// ── Action Icons & Colors ───────────────────────────────────
const getEventConfig = (eventType: string) => {
  const configs: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
    project_created: { icon: <Plus size={14} />, color: "#10b981", bg: "rgba(16,185,129,0.12)", label: "Project Created" },
    project_updated: { icon: <Edit3 size={14} />, color: "#3b82f6", bg: "rgba(59,130,246,0.12)", label: "Project Updated" },
    TASK_CREATED: { icon: <Plus size={14} />, color: "#8b5cf6", bg: "rgba(139,92,246,0.12)", label: "Task Created" },
    TASK_UPDATED: { icon: <Edit3 size={14} />, color: "#06b6d4", bg: "rgba(6,182,212,0.12)", label: "Task Updated" },
    TASK_DELETED: { icon: <Trash2 size={14} />, color: "#ef4444", bg: "rgba(239,68,68,0.12)", label: "Task Deleted" },
    pm_task_created: { icon: <Plus size={14} />, color: "#8b5cf6", bg: "rgba(139,92,246,0.12)", label: "PM Task Created" },
    pm_task_updated: { icon: <Edit3 size={14} />, color: "#06b6d4", bg: "rgba(6,182,212,0.12)", label: "PM Task Updated" },
    pm_task_deleted: { icon: <Trash2 size={14} />, color: "#ef4444", bg: "rgba(239,68,68,0.12)", label: "PM Task Deleted" },
    pm_milestone_created: { icon: <CheckCircle2 size={14} />, color: "#f59e0b", bg: "rgba(245,158,11,0.12)", label: "Milestone Created" },
    pm_file_uploaded: { icon: <Upload size={14} />, color: "#ec4899", bg: "rgba(236,72,153,0.12)", label: "File Uploaded" },
    pm_feedback_created: { icon: <Eye size={14} />, color: "#14b8a6", bg: "rgba(20,184,166,0.12)", label: "Feedback Added" },
    pm_expense_logged: { icon: <DollarSign size={14} />, color: "#f97316", bg: "rgba(249,115,22,0.12)", label: "Expense Logged" },
    invoice_created: { icon: <FileText size={14} />, color: "#10b981", bg: "rgba(16,185,129,0.12)", label: "Invoice Created" },
    payment_received: { icon: <DollarSign size={14} />, color: "#22c55e", bg: "rgba(34,197,94,0.12)", label: "Payment Received" },
    client_created: { icon: <Users size={14} />, color: "#6366f1", bg: "rgba(99,102,241,0.12)", label: "Client Added" },
    admin_login: { icon: <Shield size={14} />, color: "#64748b", bg: "rgba(100,116,139,0.12)", label: "Admin Login" },
  };
  return configs[eventType] || { icon: <Activity size={14} />, color: "#8b949e", bg: "rgba(139,148,158,0.12)", label: eventType?.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "Event" };
};

const formatTimeAgo = (timestamp: string) => {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" });
};

// ══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

const ActivityFeedPage: React.FC = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [typeFilter, setTypeFilter] = useState("All");

  useEffect(() => { fetchActivities(); }, []);

  const fetchActivities = useCallback(async () => {
    try { setActivities(await getActivityFeedAPI(200)); } catch (err) { console.error(err); } finally { setLoading(false); }
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchActivities();
    setRefreshing(false);
    toast.success("Activity feed refreshed");
  };

  const filteredActivities = typeFilter === "All"
    ? activities
    : activities.filter(a => (a.event_type || "").includes(typeFilter));

  // Group by date
  const grouped = filteredActivities.reduce((acc: Record<string, any[]>, a) => {
    const date = new Date(a.timestamp).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    (acc[date] = acc[date] || []).push(a);
    return acc;
  }, {});

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: 120 }}>
      <Loader2 className="animate-spin" size={48} color="#3b82f6" />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* ── Header ────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#f0f6fc", letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 10 }}>
            <Activity size={28} style={{ color: "#3b82f6" }} />
            Activity Feed
          </h2>
          <p style={{ color: "#8b949e", fontSize: 14, marginTop: 4 }}>{activities.length} events recorded</p>
        </div>
        <button onClick={handleRefresh} disabled={refreshing}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#c9d1d9", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* ── Quick Filters ────────────────────────────────── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
        {["All", "project", "TASK", "pm_task", "invoice", "payment", "client", "pm_file", "pm_milestone"].map(f => (
          <button key={f} onClick={() => setTypeFilter(f)}
            style={{
              padding: "7px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
              background: typeFilter === f ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.03)",
              color: typeFilter === f ? "#3b82f6" : "#8b949e",
              transition: "all 0.2s"
            }}>
            {f === "All" ? "All" : f.replace(/_/g, " ").replace(/\bpm\b/i, "PM").replace(/\b\w/g, c => c.toUpperCase())}
          </button>
        ))}
      </div>

      {/* ── Activity Timeline ────────────────────────────── */}
      {Object.keys(grouped).length === 0 ? (
        <div style={{ textAlign: "center", padding: 80, color: "#6e7681" }}>
          <Activity size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
          <p style={{ fontSize: 16, fontWeight: 600, color: "#8b949e" }}>No activities yet</p>
          <p style={{ fontSize: 13 }}>Activities will appear here as you work</p>
        </div>
      ) : (
        Object.entries(grouped).map(([date, items]) => (
          <div key={date} style={{ marginBottom: 32 }}>
            {/* Date Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#8b949e", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{date}</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
              <span style={{ fontSize: 11, color: "#484f58", fontWeight: 600 }}>{items.length} events</span>
            </div>

            {/* Activity Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {items.map((a, i) => {
                const config = getEventConfig(a.event_type);
                return (
                  <motion.div key={a._id || i}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    style={{
                      display: "flex", gap: 14, padding: "14px 18px", borderRadius: 14,
                      background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)",
                      transition: "all 0.2s", cursor: "default"
                    }}
                    whileHover={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    {/* Icon */}
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, background: config.bg,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: config.color, flexShrink: 0, marginTop: 2
                    }}>
                      {config.icon}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: config.color, padding: "2px 8px", borderRadius: 4, background: config.bg }}>
                          {config.label}
                        </span>
                        <span style={{ fontSize: 11, color: "#484f58", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 4 }}>
                          <Clock size={10} /> {formatTimeAgo(a.timestamp)}
                        </span>
                      </div>
                      {a.action_description && (
                        <div style={{ fontSize: 13, color: "#c9d1d9", marginTop: 6, lineHeight: 1.4 }}>
                          {a.action_description}
                        </div>
                      )}
                      <div style={{ display: "flex", gap: 12, marginTop: 6, fontSize: 11, color: "#6e7681" }}>
                        {a.performed_by && <span>By: {a.performed_by}</span>}
                        {a.resource_type && <span>• {a.resource_type}</span>}
                        {a.resource_id && <span style={{ fontFamily: "monospace", color: "#484f58" }}>ID: {a.resource_id.slice(0, 8)}...</span>}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </motion.div>
  );
};

export default ActivityFeedPage;
