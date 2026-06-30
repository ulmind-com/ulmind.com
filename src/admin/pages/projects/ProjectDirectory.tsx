/* ──────────────────────────────────────────────────────────────
   ULMiND Admin — Ultra-Premium Project Directory
   Enterprise SaaS UI with Liquid Glass, Animated Cards,
   Advanced Filtering, KPI Stats, and Project ID System
   ────────────────────────────────────────────────────────────── */

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getProjectsAPI, createProjectAPI, updateProjectAPI, deleteProjectAPI, searchEmployeesAPI } from "../../lib/api";
import {
  Loader2, Plus, Download, Search, Filter, LayoutGrid, List,
  TrendingUp, DollarSign, Clock, CheckCircle2, AlertCircle,
  ArrowUpRight, ChevronDown, X, Calendar, Users, Briefcase, Tag,
  Pencil, Trash2, AlertTriangle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// ── KPI Card ─────────────────────────────────────────────────
const KpiCard: React.FC<{
  title: string; value: string | number; subtitle?: string;
  icon: React.ReactNode; color: string; trend?: string;
}> = ({ title, value, subtitle, icon, color, trend }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.02 }}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
    style={{
      background: "rgba(255,255,255,0.03)",
      backdropFilter: "blur(24px)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 20, padding: "24px 28px",
      position: "relative", overflow: "hidden", cursor: "default",
    }}
  >
    <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: color, opacity: 0.08, filter: "blur(30px)" }} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
      <div style={{ width: 44, height: 44, borderRadius: 14, background: `${color}15`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", color }}>
        {icon}
      </div>
      {trend && (
        <span style={{ fontSize: 11, fontWeight: 700, color: trend.startsWith("+") ? "#10b981" : "#f43f5e", display: "flex", alignItems: "center", gap: 2 }}>
          <ArrowUpRight size={12} /> {trend}
        </span>
      )}
    </div>
    <div style={{ fontSize: 28, fontWeight: 800, color: "#f0f6fc", letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 13, color: "#8b949e", marginTop: 6, fontWeight: 500 }}>{title}</div>
    {subtitle && <div style={{ fontSize: 11, color: "#484f58", marginTop: 4 }}>{subtitle}</div>}
  </motion.div>
);

// ── Priority Badge ───────────────────────────────────────────
const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
  const config: Record<string, { bg: string; color: string; icon: string }> = {
    Urgent: { bg: "rgba(239,68,68,0.15)", color: "#ef4444", icon: "🔴" },
    High: { bg: "rgba(245,158,11,0.15)", color: "#f59e0b", icon: "🟠" },
    Medium: { bg: "rgba(59,130,246,0.15)", color: "#3b82f6", icon: "🔵" },
    Low: { bg: "rgba(107,114,128,0.15)", color: "#6b7280", icon: "⚪" },
  };
  const c = config[priority] || config.Medium;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 8, background: c.bg, color: c.color, fontSize: 11, fontWeight: 700, letterSpacing: "0.03em" }}>
      {c.icon} {priority}
    </span>
  );
};

// ── Status Badge ─────────────────────────────────────────────
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const config: Record<string, { bg: string; color: string; dot: string }> = {
    Active: { bg: "rgba(16,185,129,0.12)", color: "#10b981", dot: "#10b981" },
    Planning: { bg: "rgba(59,130,246,0.12)", color: "#3b82f6", dot: "#3b82f6" },
    "On Hold": { bg: "rgba(245,158,11,0.12)", color: "#f59e0b", dot: "#f59e0b" },
    Completed: { bg: "rgba(139,92,246,0.12)", color: "#8b5cf6", dot: "#8b5cf6" },
    Cancelled: { bg: "rgba(107,114,128,0.12)", color: "#6b7280", dot: "#6b7280" },
  };
  const c = config[status] || config.Planning;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 20, background: c.bg, color: c.color, fontSize: 12, fontWeight: 600 }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: c.dot, boxShadow: `0 0 6px ${c.dot}` }} />
      {status}
    </span>
  );
};

// ── Progress Bar ─────────────────────────────────────────────
const ProgressBar: React.FC<{ value: number }> = ({ value }) => {
  const color = value >= 80 ? "#10b981" : value >= 50 ? "#3b82f6" : value >= 25 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ height: "100%", borderRadius: 3, background: `linear-gradient(90deg, ${color}, ${color}dd)` }}
        />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 36, textAlign: "right" }}>{value}%</span>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

const ProjectDirectory: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"table" | "card">("card");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try { setProjects(await getProjectsAPI()); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleDeleteProject = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProjectAPI(deleteTarget._id);
      setProjects(prev => prev.filter(p => p._id !== deleteTarget._id));
      toast.success(`"${deleteTarget.name}" deleted`);
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete project");
    } finally {
      setDeleting(false);
    }
  };

  // ── KPI Stats ────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = projects.length;
    const active = projects.filter(p => p.status === "Active").length;
    const onHold = projects.filter(p => p.status === "On Hold").length;
    const completed = projects.filter(p => p.status === "Completed").length;
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || p.cost || 0), 0);
    const avgProgress = total > 0 ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / total) : 0;
    return { total, active, onHold, completed, totalBudget, avgProgress };
  }, [projects]);

  // ── Filtered Projects ────────────────────────────────────
  const filtered = useMemo(() => {
    return projects.filter(p => {
      const matchSearch = !search ||
        (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.project_id || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.client_name || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.category || "").toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || p.status === statusFilter;
      const matchPriority = priorityFilter === "All" || p.priority === priorityFilter;
      return matchSearch && matchStatus && matchPriority;
    });
  }, [projects, search, statusFilter, priorityFilter]);

  // ── Export CSV ────────────────────────────────────────────
  const handleExportCSV = () => {
    const headers = ["Project ID", "Project Name", "Client", "Category", "Status", "Priority", "Budget (₹)", "Progress", "Payment Status"];
    const csvContent = [
      headers.join(","),
      ...filtered.map(p => [
        `"${p.project_id || ""}"`,
        `"${p.name}"`, `"${p.client_name}"`, `"${p.category || ""}"`,
        `"${p.status}"`, `"${p.priority || "Medium"}"`,
        p.budget || p.cost || 0, `${p.progress || 0}%`, `"${p.payment_status}"`
      ].join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "ulmind_projects.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Projects exported to CSV");
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 120 }}>
      <Loader2 className="animate-spin" size={48} color="#3b82f6" />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* ── Header ──────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#f0f6fc", letterSpacing: "-0.02em" }}>
            All Projects
          </h2>
          <p style={{ color: "#8b949e", fontSize: 14, marginTop: 4 }}>
            Enterprise project directory • {projects.length} projects
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleExportCSV}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#c9d1d9", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.2s" }}
          >
            <Download size={16} /> Export
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 12, background: "linear-gradient(135deg, #3b82f6, #2563eb)", border: "none", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700, boxShadow: "0 4px 16px rgba(59,130,246,0.3)", transition: "all 0.2s" }}
          >
            <Plus size={16} /> New Project
          </button>
        </div>
      </div>

      {/* ── KPI Cards ───────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
        <KpiCard title="Total Projects" value={stats.total} icon={<Briefcase size={20} />} color="#3b82f6" />
        <KpiCard title="Active" value={stats.active} icon={<TrendingUp size={20} />} color="#10b981" trend="+2 this month" />
        <KpiCard title="On Hold" value={stats.onHold} icon={<AlertCircle size={20} />} color="#f59e0b" />
        <KpiCard title="Completed" value={stats.completed} icon={<CheckCircle2 size={20} />} color="#8b5cf6" />
        <KpiCard title="Total Budget" value={`₹${(stats.totalBudget / 100000).toFixed(1)}L`} subtitle="All projects combined" icon={<DollarSign size={20} />} color="#ec4899" />
        <KpiCard title="Avg. Progress" value={`${stats.avgProgress}%`} icon={<Clock size={20} />} color="#06b6d4" />
      </div>

      {/* ── Search & Filters ────────────────────────────────── */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 280 }}>
          <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#6e7681" }} />
          <input
            type="text" placeholder="Search by project name, ID, client, or category..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "12px 14px 12px 42px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#f0f6fc", fontSize: 14, outline: "none" }}
          />
        </div>
        <select
          value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#c9d1d9", fontSize: 13, cursor: "pointer", outline: "none" }}
        >
          <option value="All">All Status</option>
          <option value="Planning">Planning</option>
          <option value="Active">Active</option>
          <option value="On Hold">On Hold</option>
          <option value="Completed">Completed</option>
        </select>
        <select
          value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
          style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#c9d1d9", fontSize: 13, cursor: "pointer", outline: "none" }}
        >
          <option value="All">All Priority</option>
          <option value="Urgent">Urgent</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={() => setViewMode("card")} style={{ padding: "8px 12px", borderRadius: 8, border: "none", background: viewMode === "card" ? "rgba(59,130,246,0.2)" : "transparent", color: viewMode === "card" ? "#3b82f6" : "#6e7681", cursor: "pointer" }}>
            <LayoutGrid size={16} />
          </button>
          <button onClick={() => setViewMode("table")} style={{ padding: "8px 12px", borderRadius: 8, border: "none", background: viewMode === "table" ? "rgba(59,130,246,0.2)" : "transparent", color: viewMode === "table" ? "#3b82f6" : "#6e7681", cursor: "pointer" }}>
            <List size={16} />
          </button>
        </div>
      </div>

      {/* ── Projects Grid/Table ─────────────────────────────── */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 80, color: "#6e7681" }}>
          <Briefcase size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
          <p style={{ fontSize: 16, fontWeight: 600, color: "#8b949e" }}>No projects found</p>
          <p style={{ fontSize: 13 }}>Try adjusting your search or filters</p>
        </div>
      ) : viewMode === "card" ? (
        <motion.div
          initial="hidden" animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 20 }}
        >
          {filtered.map((p) => (
            <motion.div
              key={p._id}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ y: -6, borderColor: "rgba(59,130,246,0.3)" }}
              onClick={() => navigate(`/admin/projects/${p._id}`)}
              style={{
                background: "rgba(255,255,255,0.02)", backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20,
                padding: 24, cursor: "pointer", position: "relative", overflow: "hidden",
                transition: "all 0.3s ease"
              }}
            >
              {/* Glow effect */}
              <div style={{ position: "absolute", top: -40, right: -40, width: 120, height: 120, borderRadius: "50%", background: p.status === "Active" ? "#10b981" : "#3b82f6", opacity: 0.06, filter: "blur(40px)", pointerEvents: "none" }} />

              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {p.project_id && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      {p.project_id}
                    </span>
                  )}
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: "#f0f6fc", marginTop: 4, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.name}
                  </h3>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button
                    title="Edit project"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setEditingProject(p);
                      setShowEditModal(true);
                    }}
                    style={{
                      width: 32, height: 32, borderRadius: 9, border: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(255,255,255,0.03)", color: "#c9d1d9", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", zIndex: 10
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(59,130,246,0.15)"; e.currentTarget.style.color = "#3b82f6"; e.currentTarget.style.borderColor = "rgba(59,130,246,0.35)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "#c9d1d9"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    title="Delete project"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDeleteTarget(p);
                    }}
                    style={{
                      width: 32, height: 32, borderRadius: 9, border: "1px solid rgba(239,68,68,0.18)",
                      background: "rgba(239,68,68,0.08)", color: "#f87171", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", zIndex: 10
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.45)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.18)"; }}
                  >
                    <Trash2 size={14} />
                  </button>
                  <StatusBadge status={p.status} />
                </div>
              </div>

              {/* Client & Category */}
              <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#8b949e" }}>
                  <Users size={14} /> {p.client_name || "No Client"}
                </div>
                {p.category && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6e7681" }}>
                    <Tag size={14} /> {p.category}
                  </div>
                )}
              </div>

              {/* Progress */}
              <div style={{ marginBottom: 16 }}>
                <ProgressBar value={p.progress || p.completion_percent || 0} />
              </div>

              {/* Footer Stats */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <PriorityBadge priority={p.priority || "Medium"} />
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "#8b949e", fontWeight: 600 }}>
                    <DollarSign size={14} /> ₹{((p.budget || p.cost || 0) / 1000).toFixed(0)}K
                  </span>
                </div>
                {p.end_date && (
                  <span style={{ fontSize: 11, color: "#6e7681", display: "flex", alignItems: "center", gap: 4 }}>
                    <Calendar size={12} /> {new Date(p.end_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                  </span>
                )}
              </div>

              {/* Team Members */}
              {p.team_members && p.team_members.length > 0 && (
                <div style={{ display: "flex", gap: -8, marginTop: 12, paddingLeft: 4 }}>
                  {p.team_members.slice(0, 4).map((id: string, i: number) => (
                    <div key={i} style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: `hsl(${(i * 60 + 200) % 360}, 60%, 50%)`,
                      border: "2px solid #0d1117",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, fontWeight: 700, color: "#fff",
                      marginLeft: i > 0 ? -8 : 0, zIndex: 4 - i
                    }}>
                      {(id || "?").charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {p.team_members.length > 4 && (
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "2px solid #0d1117", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#8b949e", marginLeft: -8 }}>
                      +{p.team_members.length - 4}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      ) : (
        /* ── Table View ────────────────────────────────────── */
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Project ID", "Project Name", "Client", "Category", "Status", "Priority", "Budget", "Progress", "Deadline", ""].map(h => (
                    <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#6e7681", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <motion.tr
                    key={p._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    onClick={() => navigate(`/admin/projects/${p._id}`)}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", cursor: "pointer", transition: "background 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "14px 16px", fontSize: 12, fontWeight: 700, color: "#3b82f6", fontFamily: "monospace" }}>{p.project_id || "—"}</td>
                    <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "#f0f6fc", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#8b949e" }}>{p.client_name || "—"}</td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: "#6e7681" }}>{p.category || "—"}</td>
                    <td style={{ padding: "14px 16px" }}><StatusBadge status={p.status} /></td>
                    <td style={{ padding: "14px 16px" }}><PriorityBadge priority={p.priority || "Medium"} /></td>
                    <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, color: "#c9d1d9" }}>₹{((p.budget || p.cost || 0) / 1000).toFixed(0)}K</td>
                    <td style={{ padding: "14px 16px", minWidth: 140 }}><ProgressBar value={p.progress || 0} /></td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: "#6e7681" }}>{p.end_date ? new Date(p.end_date).toLocaleDateString("en-IN") : "—"}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          title="Edit project"
                          onClick={e => { e.stopPropagation(); setEditingProject(p); setShowEditModal(true); }}
                          style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#c9d1d9", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                          onMouseEnter={e => { e.currentTarget.style.background = "rgba(59,130,246,0.15)"; e.currentTarget.style.color = "#3b82f6"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#c9d1d9"; }}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          title="Delete project"
                          onClick={e => { e.stopPropagation(); setDeleteTarget(p); }}
                          style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(239,68,68,0.18)", background: "rgba(239,68,68,0.08)", color: "#f87171", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Create Project Modal ─────────────────────────────── */}
      <AnimatePresence>
        {(showCreateModal || showEditModal) && (
          <ProjectFormModal
            isOpen={true}
            onClose={() => { setShowCreateModal(false); setShowEditModal(false); setEditingProject(null); }}
            project={editingProject}
            onSuccess={() => { fetchProjects(); setShowCreateModal(false); setShowEditModal(false); setEditingProject(null); }}
          />
        )}
      </AnimatePresence>

      {/* ── Delete Confirmation Modal ─────────────────────────── */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => !deleting && setDeleteTarget(null)}
            style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", padding: 20 }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 12 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0, y: 12 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: "100%", maxWidth: 420, background: "linear-gradient(160deg, rgba(20,12,14,0.96), rgba(13,17,23,0.96))",
                border: "1px solid rgba(239,68,68,0.22)", borderRadius: 22, padding: 32, textAlign: "center",
                boxShadow: "0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(239,68,68,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
                position: "relative", overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", top: -50, left: "50%", transform: "translateX(-50%)", width: 180, height: 180, borderRadius: "50%", background: "#ef4444", opacity: 0.12, filter: "blur(50px)", pointerEvents: "none" }} />
              <div style={{ width: 64, height: 64, borderRadius: 18, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", position: "relative" }}>
                <AlertTriangle size={28} color="#f87171" />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: "#f0f6fc", marginBottom: 8, letterSpacing: "-0.01em" }}>Delete this project?</h3>
              <p style={{ fontSize: 13.5, color: "#9ba3af", lineHeight: 1.6, marginBottom: 4 }}>
                <strong style={{ color: "#f0f6fc" }}>{deleteTarget.name}</strong>
                {deleteTarget.project_id ? <span style={{ color: "#6e7681", fontFamily: "monospace" }}> ({deleteTarget.project_id})</span> : null}
              </p>
              <p style={{ fontSize: 12.5, color: "#6e7681", lineHeight: 1.6, marginBottom: 28 }}>
                Eta permanently delete hobe — tasks, files, sob kichu s3 chole jabe. Undo kora jabe na.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button
                  onClick={() => setDeleteTarget(null)} disabled={deleting}
                  style={{ flex: 1, padding: "12px 20px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "#c9d1d9", cursor: deleting ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProject} disabled={deleting}
                  style={{ flex: 1, padding: "12px 20px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #ef4444, #b91c1c)", color: "#fff", cursor: deleting ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 8px 22px rgba(239,68,68,0.35)", opacity: deleting ? 0.75 : 1 }}
                >
                  {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={15} />}
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ══════════════════════════════════════════════════════════════
//  PROJECT FORM MODAL
// ══════════════════════════════════════════════════════════════

export const ProjectFormModal: React.FC<{
  isOpen: boolean; onClose: () => void;
  project?: any; onSuccess: () => void;
}> = ({ isOpen, onClose, project, onSuccess }) => {
  const isEdit = !!project;
  const [form, setForm] = useState<any>({
    name: "", description: "", category: "Web Development", status: "Planning", priority: "Medium",
    client_name: "", client_email: "", client_phone: "", client_company: "",
    budget: 0, cost: 0, currency: "INR", payment_status: "Pending",
    start_date: "", end_date: "", tags: [], team_members: [], project_manager: "", notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (project) {
      setForm({
        ...project,
        start_date: project.start_date ? new Date(project.start_date).toISOString().split("T")[0] : "",
        end_date: project.end_date ? new Date(project.end_date).toISOString().split("T")[0] : "",
        tags: project.tags || [],
        team_members: project.team_members || [],
        budget: project.budget || project.cost || 0,
      });
    }
    fetchEmployees();
  }, [project]);

  const fetchEmployees = async () => {
    try { setEmployees(await searchEmployeesAPI()); } catch { }
  };

  const handleChange = (field: string, value: any) => setForm((f: any) => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    if (!form.name) { toast.error("Project name is required"); return; }
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (payload.start_date) payload.start_date = new Date(payload.start_date).toISOString();
      if (payload.end_date) payload.end_date = new Date(payload.end_date).toISOString();
      if (!payload.start_date) delete payload.start_date;
      if (!payload.end_date) delete payload.end_date;
      payload.budget = Number(payload.budget) || 0;
      payload.cost = Number(payload.cost) || Number(payload.budget) || 0;

      if (isEdit) {
        await updateProjectAPI(project._id, payload);
        toast.success("Project updated successfully");
      } else {
        await createProjectAPI(payload);
        toast.success("Project created successfully");
      }
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      handleChange("tags", [...form.tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "#f0f6fc", fontSize: 14, outline: "none" };
  const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: "#8b949e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, display: "block" };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", zIndex: 200 }} />
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "100%", maxWidth: 580, background: "rgba(13,17,23,0.98)", backdropFilter: "blur(40px)", borderLeft: "1px solid rgba(255,255,255,0.06)", zIndex: 201, display: "flex", flexDirection: "column", boxShadow: "-20px 0 60px rgba(0,0,0,0.5)" }}
      >
        {/* Header */}
        <div style={{ padding: "24px 32px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: "#f0f6fc" }}>
            {isEdit ? "Edit Project" : "Create New Project"}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#6e7681", cursor: "pointer", padding: 8, borderRadius: 8 }}><X size={20} /></button>
        </div>

        {/* Form Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Name */}
            <div>
              <label style={labelStyle}>Project Name *</label>
              <input style={inputStyle} placeholder="Enter project name" value={form.name} onChange={e => handleChange("name", e.target.value)} />
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>Description</label>
              <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} placeholder="Project description..." value={form.description || ""} onChange={e => handleChange("description", e.target.value)} />
            </div>

            {/* Category & Priority */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Category</label>
                <select style={{ ...inputStyle, cursor: "pointer" }} value={form.category} onChange={e => handleChange("category", e.target.value)}>
                  {["Web Development", "Mobile App", "AI/ML", "DevOps", "Design", "Marketing", "Consulting", "E-Commerce", "SaaS", "Other"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Priority</label>
                <select style={{ ...inputStyle, cursor: "pointer" }} value={form.priority} onChange={e => handleChange("priority", e.target.value)}>
                  {["Low", "Medium", "High", "Urgent"].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            {/* Status & Payment */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Status</label>
                <select style={{ ...inputStyle, cursor: "pointer" }} value={form.status} onChange={e => handleChange("status", e.target.value)}>
                  {["Planning", "Active", "On Hold", "Completed", "Cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Payment Status</label>
                <select style={{ ...inputStyle, cursor: "pointer" }} value={form.payment_status} onChange={e => handleChange("payment_status", e.target.value)}>
                  {["Pending", "Partial", "Paid"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div style={{ height: 1, background: "rgba(255,255,255,0.04)", margin: "4px 0" }} />

            {/* Client Info */}
            <h4 style={{ fontSize: 13, fontWeight: 700, color: "#c9d1d9", textTransform: "uppercase", letterSpacing: "0.06em" }}>Client Information</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Client Name</label>
                <input style={inputStyle} placeholder="Client name" value={form.client_name} onChange={e => handleChange("client_name", e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Company</label>
                <input style={inputStyle} placeholder="Company name" value={form.client_company || ""} onChange={e => handleChange("client_company", e.target.value)} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} type="email" placeholder="client@email.com" value={form.client_email || ""} onChange={e => handleChange("client_email", e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input style={inputStyle} placeholder="+91..." value={form.client_phone || ""} onChange={e => handleChange("client_phone", e.target.value)} />
              </div>
            </div>

            <div style={{ height: 1, background: "rgba(255,255,255,0.04)", margin: "4px 0" }} />

            {/* Budget & Timeline */}
            <h4 style={{ fontSize: 13, fontWeight: 700, color: "#c9d1d9", textTransform: "uppercase", letterSpacing: "0.06em" }}>Budget & Timeline</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Budget (₹)</label>
                <input style={inputStyle} type="number" placeholder="500000" value={form.budget} onChange={e => handleChange("budget", e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Cost (₹)</label>
                <input style={inputStyle} type="number" placeholder="0" value={form.cost} onChange={e => handleChange("cost", e.target.value)} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Start Date</label>
                <input style={inputStyle} type="date" value={form.start_date} onChange={e => handleChange("start_date", e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Deadline</label>
                <input style={inputStyle} type="date" value={form.end_date} onChange={e => handleChange("end_date", e.target.value)} />
              </div>
            </div>

            <div style={{ height: 1, background: "rgba(255,255,255,0.04)", margin: "4px 0" }} />

            {/* Team */}
            <h4 style={{ fontSize: 13, fontWeight: 700, color: "#c9d1d9", textTransform: "uppercase", letterSpacing: "0.06em" }}>Team</h4>
            <div>
              <label style={labelStyle}>Project Manager</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={form.project_manager || ""} onChange={e => handleChange("project_manager", e.target.value)}>
                <option value="">Select manager...</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.employee_id ? `${emp.employee_id} — ` : ""}{emp.full_name || emp.email} ({emp.position || "Staff"})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Team Members</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                {(form.team_members || []).map((id: string) => {
                  const emp = employees.find(e => e._id === id);
                  return (
                    <span key={id} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#3b82f6", fontSize: 12, fontWeight: 600 }}>
                      {emp?.full_name || emp?.email || id.slice(0, 8)}
                      <X size={12} style={{ cursor: "pointer" }} onClick={() => handleChange("team_members", form.team_members.filter((m: string) => m !== id))} />
                    </span>
                  );
                })}
              </div>
              <select
                style={{ ...inputStyle, cursor: "pointer" }}
                value=""
                onChange={e => {
                  if (e.target.value && !form.team_members.includes(e.target.value)) {
                    handleChange("team_members", [...form.team_members, e.target.value]);
                  }
                }}
              >
                <option value="">Add team member...</option>
                {employees.filter(e => !form.team_members.includes(e._id)).map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.employee_id ? `${emp.employee_id} — ` : ""}{emp.full_name || emp.email}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label style={labelStyle}>Tags</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                {(form.tags || []).map((tag: string) => (
                  <span key={tag} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 6, background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", color: "#a78bfa", fontSize: 11, fontWeight: 600 }}>
                    #{tag}
                    <X size={10} style={{ cursor: "pointer" }} onClick={() => handleChange("tags", form.tags.filter((t: string) => t !== tag))} />
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input style={{ ...inputStyle, flex: 1 }} placeholder="Add tag..." value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} />
                <button onClick={addTag} style={{ padding: "10px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#c9d1d9", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Add</button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label style={labelStyle}>Notes</label>
              <textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} placeholder="Additional notes..." value={form.notes || ""} onChange={e => handleChange("notes", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "20px 32px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <button onClick={onClose} style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#c9d1d9", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>Cancel</button>
          <button onClick={handleSubmit} disabled={submitting}
            style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "#fff", cursor: submitting ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, opacity: submitting ? 0.6 : 1 }}>
            {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
            {isEdit ? "Update Project" : "Create Project"}
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default ProjectDirectory;
