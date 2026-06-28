/* ──────────────────────────────────────────────────────────────
   ULMiND Admin — Enterprise Task Assignment
   Features: Task ID system, Project auto-suggest with auto-fill,
   Multi-employee assignment, KPI cards, Priority badges,
   Due date warnings, Auto-email on assignment
   ────────────────────────────────────────────────────────────── */

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  getPmTasksAPI, deletePmTaskAPI, updatePmTaskAPI, createPmTaskAPI, notifyTaskAssigneeAPI,
  searchProjectsAPI, searchEmployeesAPI, getProjectsAPI, sendTaskSmsAPI
} from "../../lib/api";
import {
  Loader2, Plus, Search, CheckCircle2, Clock, AlertTriangle, XCircle,
  Play, Pause, Eye, Mail, X, User, Briefcase, Calendar, Timer,
  ChevronDown, Flag, ListChecks, Trash2, Edit3, Bell, Smartphone
} from "lucide-react";
import { toast } from "sonner";

// ── KPI Card ─────────────────────────────────────────────────
const TaskKpiCard: React.FC<{
  label: string; value: number; icon: React.ReactNode; color: string; bgColor: string;
}> = ({ label, value, icon, color, bgColor }) => (
  <motion.div
    whileHover={{ y: -3, scale: 1.02 }}
    style={{ background: bgColor, borderRadius: 16, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14, border: `1px solid ${color}20`, cursor: "default" }}
  >
    <div style={{ width: 40, height: 40, borderRadius: 12, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", color }}>{icon}</div>
    <div>
      <div style={{ fontSize: 24, fontWeight: 800, color: "#f0f6fc", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: "#8b949e", fontWeight: 600, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
    </div>
  </motion.div>
);

// ── Priority Badge ───────────────────────────────────────────
const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
  const config: Record<string, { bg: string; color: string; icon: string }> = {
    Urgent: { bg: "rgba(239,68,68,0.12)", color: "#ef4444", icon: "🔴" },
    High: { bg: "rgba(245,158,11,0.12)", color: "#f59e0b", icon: "🟠" },
    Medium: { bg: "rgba(59,130,246,0.12)", color: "#3b82f6", icon: "🔵" },
    Low: { bg: "rgba(107,114,128,0.12)", color: "#6b7280", icon: "⚪" },
  };
  const c = config[priority] || config.Medium;
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 6, background: c.bg, color: c.color, fontSize: 11, fontWeight: 700 }}>{c.icon} {priority}</span>;
};

// ── Status Badge ─────────────────────────────────────────────
const TaskStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const config: Record<string, { bg: string; color: string }> = {
    Pending: { bg: "rgba(107,114,128,0.12)", color: "#9ca3af" },
    "In Progress": { bg: "rgba(59,130,246,0.12)", color: "#3b82f6" },
    Review: { bg: "rgba(168,85,247,0.12)", color: "#a855f7" },
    Testing: { bg: "rgba(6,182,212,0.12)", color: "#06b6d4" },
    Completed: { bg: "rgba(10,185,129,0.12)", color: "#10b981" },
    Blocked: { bg: "rgba(239,68,68,0.12)", color: "#ef4444" },
  };
  const c = config[status] || config.Pending;
  return <span style={{ padding: "4px 10px", borderRadius: 6, background: c.bg, color: c.color, fontSize: 12, fontWeight: 600 }}>{status}</span>;
};

// ══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

const PMTasks: React.FC = () => {
  const location = useLocation();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("search") || "";
  });
  const [statusFilter, setStatusFilter] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try { setTasks(await getPmTasksAPI()); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  // ── KPI Stats ────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === "Pending").length;
    const inProgress = tasks.filter(t => t.status === "In Progress").length;
    const review = tasks.filter(t => t.status === "Review").length;
    const completed = tasks.filter(t => t.status === "Completed").length;
    const blocked = tasks.filter(t => t.status === "Blocked").length;
    const now = new Date();
    const overdue = tasks.filter(t => t.due_date && new Date(t.due_date) < now && t.status !== "Completed").length;
    return { total, pending, inProgress, review, completed, blocked, overdue };
  }, [tasks]);

  // ── Filtered Tasks ───────────────────────────────────────
  const filtered = useMemo(() => {
    return tasks.filter(t => {
      const matchSearch = !search ||
        (t.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (t.task_id || "").toLowerCase().includes(search.toLowerCase()) ||
        (t.project_name || "").toLowerCase().includes(search.toLowerCase()) ||
        (t.client_name || "").toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || t.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [tasks, search, statusFilter]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this task?")) return;
    try { await deletePmTaskAPI(id); toast.success("Task deleted"); fetchTasks(); }
    catch (err: any) { toast.error(err.message); }
  };

  const handleNotify = async (id: string) => {
    try { await notifyTaskAssigneeAPI(id); toast.success("Notification sent!"); }
    catch (err: any) { toast.error(err.message); }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    let completion = 0;
    const task = tasks.find(t => t._id === id);
    if (newStatus === "Pending") completion = 0;
    else if (newStatus === "In Progress") completion = 20;
    else if (newStatus === "Review") completion = 70;
    else if (newStatus === "Testing") completion = 90;
    else if (newStatus === "Completed") completion = 100;
    else if (newStatus === "Blocked") completion = task?.completion_percent || 0;

    try { 
      await updatePmTaskAPI(id, { status: newStatus, completion_percent: completion }); 
      toast.success(`Status updated to ${newStatus}`); 
      fetchTasks(); 
    }
    catch (err: any) { toast.error(err.message); }
  };

  const handleSendSms = async (id: string) => {
    try { await sendTaskSmsAPI(id); toast.success("SMS sent to all assignees!"); }
    catch (err: any) { toast.error(err.message); }
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: 120 }}>
      <Loader2 className="animate-spin" size={48} color="#3b82f6" />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* ── Header ────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#f0f6fc", letterSpacing: "-0.02em" }}>Tasks & Assignments</h2>
          <p style={{ color: "#8b949e", fontSize: 14, marginTop: 4 }}>Enterprise task management • {tasks.length} tasks</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 12, background: "linear-gradient(135deg, #10b981, #059669)", border: "none", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700, boxShadow: "0 4px 16px rgba(16,185,129,0.3)" }}>
          <Plus size={16} /> Create Task
        </button>
      </div>

      {/* ── KPI Cards ─────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 24 }}>
        <TaskKpiCard label="Total" value={stats.total} icon={<ListChecks size={18} />} color="#3b82f6" bgColor="rgba(59,130,246,0.04)" />
        <TaskKpiCard label="Pending" value={stats.pending} icon={<Clock size={18} />} color="#9ca3af" bgColor="rgba(156,163,175,0.04)" />
        <TaskKpiCard label="In Progress" value={stats.inProgress} icon={<Play size={18} />} color="#3b82f6" bgColor="rgba(59,130,246,0.04)" />
        <TaskKpiCard label="Review" value={stats.review} icon={<Eye size={18} />} color="#a855f7" bgColor="rgba(168,85,247,0.04)" />
        <TaskKpiCard label="Completed" value={stats.completed} icon={<CheckCircle2 size={18} />} color="#10b981" bgColor="rgba(16,185,129,0.04)" />
        <TaskKpiCard label="Blocked" value={stats.blocked} icon={<XCircle size={18} />} color="#ef4444" bgColor="rgba(239,68,68,0.04)" />
        <TaskKpiCard label="Overdue" value={stats.overdue} icon={<AlertTriangle size={18} />} color="#f59e0b" bgColor="rgba(245,158,11,0.04)" />
      </div>

      {/* ── Search & Filters ──────────────────────────────── */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 280 }}>
          <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#6e7681" }} />
          <input type="text" placeholder="Search by task, project, ID, or client..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "12px 14px 12px 42px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#f0f6fc", fontSize: 14, outline: "none" }}
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#c9d1d9", fontSize: 13, cursor: "pointer", outline: "none" }}>
          <option value="All">All Status</option>
          {["Pending", "In Progress", "Review", "Testing", "Completed", "Blocked"].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* ── Task Table ────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 80, color: "#6e7681" }}>
          <ListChecks size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
          <p style={{ fontSize: 16, fontWeight: 600, color: "#8b949e" }}>No tasks found</p>
        </div>
      ) : (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Task ID", "Task", "Project", "Priority", "Status", "Assignee", "Due Date", "Progress", "Actions"].map(h => (
                    <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#6e7681", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => {
                  const isOverdue = t.due_date && new Date(t.due_date) < new Date() && t.status !== "Completed";
                  return (
                    <motion.tr key={t._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", transition: "background 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 700, color: "#10b981", fontFamily: "monospace" }}>{t.task_id || "—"}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#f0f6fc", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</div>
                        {t.client_name && <div style={{ fontSize: 11, color: "#6e7681", marginTop: 2 }}>Client: {t.client_name}</div>}
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 13, color: "#8b949e", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.project_name || "—"}</td>
                      <td style={{ padding: "12px 14px" }}><PriorityBadge priority={t.priority || "Medium"} /></td>
                      <td style={{ padding: "12px 14px" }}>
                        <select value={t.status} onChange={e => handleStatusChange(t._id, e.target.value)}
                          style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#c9d1d9", fontSize: 12, cursor: "pointer", outline: "none" }}>
                          {["Pending", "In Progress", "Review", "Testing", "Completed", "Blocked"].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          {t.assigned_to_names && t.assigned_to_names.length > 0 ? (
                            <span style={{ fontSize: 12, color: "#c9d1d9", fontWeight: 500 }}>{t.assigned_to_names.join(", ")}</span>
                          ) : (
                            <span style={{ fontSize: 12, color: "#484f58" }}>Unassigned</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 12, color: isOverdue ? "#ef4444" : "#8b949e", fontWeight: isOverdue ? 700 : 400 }}>
                        {t.due_date ? new Date(t.due_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" }) : "—"}
                        {isOverdue && <span style={{ display: "block", fontSize: 10, color: "#ef4444" }}>⚠ Overdue</span>}
                      </td>
                      <td style={{ padding: "12px 14px", minWidth: 140 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ flex: 1, height: 6, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden", position: "relative", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.5)" }}>
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${t.completion_percent || 0}%` }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                              style={{ 
                                height: "100%", 
                                borderRadius: 4, 
                                background: (t.completion_percent || 0) >= 100 
                                  ? "linear-gradient(90deg, #10b981 0%, #34d399 100%)" 
                                  : "linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)",
                                boxShadow: (t.completion_percent || 0) >= 100 
                                  ? "0 0 10px rgba(16, 185, 129, 0.4)" 
                                  : "0 0 10px rgba(59, 130, 246, 0.4)",
                                position: "relative"
                              }}
                            >
                              {(t.completion_percent || 0) > 0 && (t.completion_percent || 0) < 100 && (
                                <motion.div
                                  animate={{ x: ["-100%", "200%"] }}
                                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                  style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }}
                                />
                              )}
                            </motion.div>
                          </div>
                          <span style={{ 
                            fontSize: 12, 
                            color: (t.completion_percent || 0) >= 100 ? "#10b981" : "#c9d1d9", 
                            fontWeight: 700,
                            minWidth: 35,
                            textAlign: "right"
                          }}>{t.completion_percent || 0}%</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button onClick={() => { setSelectedTask(t); setShowDetailModal(true); }} title="View Details" style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)", background: "transparent", color: "#8b949e", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Eye size={14} /></button>
                          <button onClick={() => handleNotify(t._id)} title="Send Email" style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(16,185,129,0.2)", background: "rgba(16,185,129,0.06)", color: "#10b981", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Mail size={14} /></button>
                          <button onClick={() => handleSendSms(t._id)} title="Send SMS" style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(168,85,247,0.2)", background: "rgba(168,85,247,0.06)", color: "#a855f7", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Smartphone size={14} /></button>
                          <button onClick={() => { setEditingTask(t); }} title="Edit" style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(59,130,246,0.2)", background: "rgba(59,130,246,0.06)", color: "#3b82f6", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Edit3 size={14} /></button>
                          <button onClick={() => handleDelete(t._id)} title="Delete" style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.06)", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Create/Edit Task Modal ─────────────────────────────── */}
      <AnimatePresence>
        {(showCreateModal || editingTask) && (
          <TaskFormModal
            task={editingTask}
            onClose={() => { setShowCreateModal(false); setEditingTask(null); }}
            onSuccess={() => { fetchTasks(); setShowCreateModal(false); setEditingTask(null); }}
          />
        )}
      </AnimatePresence>

      {/* ── Task Detail Modal ─────────────────────────────── */}
      <AnimatePresence>
        {showDetailModal && selectedTask && (
          <TaskDetailModal
            task={selectedTask}
            onClose={() => { setShowDetailModal(false); setSelectedTask(null); }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ══════════════════════════════════════════════════════════════
//  TASK FORM MODAL with Project Auto-Suggest
// ══════════════════════════════════════════════════════════════

export const TaskFormModal: React.FC<{ task?: any; onClose: () => void; onSuccess: () => void }> = ({ task, onClose, onSuccess }) => {
  const [form, setForm] = useState<any>({
    project_id: "", project_name: "", client_name: "", title: "", description: "",
    priority: "Medium", status: "Pending", start_date: "", due_date: "",
    estimated_hours: 0, assigned_to: "", assigned_to_multiple: [], assigned_to_names: [],
    checklist: [], tags: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [projectSearch, setProjectSearch] = useState("");
  const [projectSuggestions, setProjectSuggestions] = useState<any[]>([]);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [checklistInput, setChecklistInput] = useState("");
  const [sendSms, setSendSms] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchEmployees(); }, []);

  const fetchEmployees = async () => {
    try { setEmployees(await searchEmployeesAPI()); } catch { }
  };

  // Project search with debounce
  useEffect(() => {
    if (projectSearch.length < 1) { setProjectSuggestions([]); return; }
    const timer = setTimeout(async () => {
      try { setProjectSuggestions(await searchProjectsAPI(projectSearch)); setShowProjectDropdown(true); }
      catch { }
    }, 300);
    return () => clearTimeout(timer);
  }, [projectSearch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowProjectDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectProject = (proj: any) => {
    setForm((f: any) => ({
      ...f,
      project_id: proj._id,
      project_name: proj.name,
      client_name: proj.client_name || "",
      due_date: proj.end_date ? new Date(proj.end_date).toISOString().split("T")[0] : f.due_date,
      start_date: proj.start_date ? new Date(proj.start_date).toISOString().split("T")[0] : f.start_date,
    }));
    setProjectSearch(proj.project_id ? `[${proj.project_id}] ${proj.name}` : proj.name);
    setShowProjectDropdown(false);
  };

  const toggleEmployee = (emp: any) => {
    const isSelected = form.assigned_to_multiple.includes(emp._id);
    if (isSelected) {
      setForm((f: any) => ({
        ...f,
        assigned_to_multiple: f.assigned_to_multiple.filter((id: string) => id !== emp._id),
        assigned_to_names: f.assigned_to_names.filter((n: string) => n !== emp.full_name),
        assigned_to: f.assigned_to_multiple.filter((id: string) => id !== emp._id)[0] || "",
      }));
    } else {
      setForm((f: any) => ({
        ...f,
        assigned_to_multiple: [...f.assigned_to_multiple, emp._id],
        assigned_to_names: [...f.assigned_to_names, emp.full_name || emp.email],
        assigned_to: f.assigned_to || emp._id,
      }));
    }
  };

  const addChecklistItem = () => {
    if (!checklistInput.trim()) return;
    setForm((f: any) => ({
      ...f,
      checklist: [...f.checklist, { text: checklistInput.trim(), done: false }],
    }));
    setChecklistInput("");
  };

  useEffect(() => {
    if (task) {
      setForm({
        ...task,
        start_date: task.start_date ? new Date(task.start_date).toISOString().split("T")[0] : "",
        due_date: task.due_date ? new Date(task.due_date).toISOString().split("T")[0] : "",
        assigned_to_multiple: task.assigned_to_multiple || [],
        assigned_to_names: task.assigned_to_names || [],
        checklist: task.checklist || [],
        tags: task.tags || []
      });
      if (task.project_id) setProjectSearch(task.project_name ? task.project_name : "Unknown Project");
    }
  }, [task]);

  const handleSubmit = async () => {
    if (!form.title) { toast.error("Task title is required"); return; }
    if (!form.project_id) { toast.error("Please select a project"); return; }
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (payload.start_date) payload.start_date = new Date(payload.start_date).toISOString();
      if (payload.due_date) payload.due_date = new Date(payload.due_date).toISOString();
      if (!payload.start_date) delete payload.start_date;
      if (!payload.due_date) delete payload.due_date;
      payload.estimated_hours = Number(payload.estimated_hours) || 0;
      if (task) {
        await updatePmTaskAPI(task._id, payload);
        toast.success("Task updated!");
      } else {
        const created = await createPmTaskAPI(payload);
        toast.success("Task created & assignees notified!");
        // Send SMS if toggle is enabled
        if (sendSms && created?._id) {
          try {
            await sendTaskSmsAPI(created._id);
            toast.success("SMS sent to assignees!");
          } catch { toast.error("SMS failed to send"); }
        }
      }
      onSuccess();
    } catch (err: any) { toast.error(err.message); }
    finally { setSubmitting(false); }
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f0f6fc", margin: 0 }}>{task ? "Edit Task" : "Create New Task"}</h2>
            <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#8b949e", cursor: "pointer" }}><X size={20} /></button>
          </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Project Auto-Suggest */}
            <div ref={searchRef} style={{ position: "relative" }}>
              <label style={labelStyle}>🔗 Linked Project *</label>
              <div style={{ position: "relative" }}>
                <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: form.project_id ? "#3b82f6" : "#6e7681", transition: "color 0.2s ease" }} />
                <input
                  style={{ 
                    ...inputStyle, 
                    paddingLeft: 38,
                    borderColor: form.project_id ? "rgba(59, 130, 246, 0.4)" : "rgba(255,255,255,0.1)",
                    background: form.project_id ? "rgba(59, 130, 246, 0.05)" : "rgba(0,0,0,0.2)",
                    boxShadow: form.project_id ? "0 0 0 1px rgba(59,130,246,0.2)" : "none",
                    transition: "all 0.2s ease"
                  }}
                  placeholder="Search by project name, ID, or client..."
                  value={projectSearch}
                  onChange={e => { setProjectSearch(e.target.value); if (!e.target.value) setForm((f: any) => ({ ...f, project_id: "", project_name: "", client_name: "" })); }}
                  onFocus={() => projectSuggestions.length > 0 && setShowProjectDropdown(true)}
                />
              </div>
              <AnimatePresence>
                {showProjectDropdown && projectSuggestions.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, background: "rgba(22, 27, 34, 0.95)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, maxHeight: 320, overflowY: "auto", zIndex: 10, boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)" }}
                  >
                    <div style={{ padding: "10px 16px", fontSize: 11, fontWeight: 600, color: "#8b949e", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.2)" }}>
                      Suggested Projects
                    </div>
                    {projectSuggestions.map(p => (
                      <motion.div key={p._id} onClick={() => selectProject(p)}
                        whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.12)" }}
                        style={{ padding: "14px 16px", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", flexDirection: "column", gap: 8, transition: "background-color 0.15s ease" }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            {p.project_id ? (
                              <span style={{ fontSize: 11, fontWeight: 700, color: "#58a6ff", fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace", background: "rgba(88, 166, 255, 0.1)", padding: "3px 8px", borderRadius: 6, border: "1px solid rgba(88, 166, 255, 0.2)", letterSpacing: "0.5px" }}>
                                {p.project_id}
                              </span>
                            ) : null}
                            <span style={{ fontSize: 14, fontWeight: 600, color: "#f0f6fc", letterSpacing: "-0.2px" }}>{p.name}</span>
                          </div>
                          <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 12, background: "rgba(255,255,255,0.08)", color: "#c9d1d9", fontWeight: 600 }}>{p.status}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 12, color: "#8b949e", marginTop: 2 }}>
                          {p.client_name && (
                            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                              <User size={13} color="#6e7681" /> {p.client_name}
                            </span>
                          )}
                          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <Briefcase size={13} color="#6e7681" /> {p.category || "General"}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {form.project_id && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    style={{ marginTop: 12, overflow: "hidden" }}
                  >
                    <div style={{ padding: "12px 16px", borderRadius: 10, background: "linear-gradient(90deg, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.02) 100%)", borderLeft: "3px solid #10b981", fontSize: 13, color: "#34d399", display: "flex", alignItems: "center", gap: 8, fontWeight: 500 }}>
                      <CheckCircle2 size={16} color="#10b981" />
                      Successfully linked to <span style={{ color: "#fff", fontWeight: 600 }}>{form.project_name}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Task Title */}
            <div>
              <label style={labelStyle}>Task Title *</label>
              <input style={inputStyle} placeholder="Enter task title" value={form.title} onChange={e => setForm((f: any) => ({ ...f, title: e.target.value }))} />
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>Description</label>
              <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} placeholder="Task description..." value={form.description || ""} onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))} />
            </div>

            {/* Priority & Status */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Priority</label>
                <select style={{ ...inputStyle, cursor: "pointer" }} value={form.priority} onChange={e => setForm((f: any) => ({ ...f, priority: e.target.value }))}>
                  {["Low", "Medium", "High", "Urgent"].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <select style={{ ...inputStyle, cursor: "pointer" }} value={form.status} onChange={e => setForm((f: any) => ({ ...f, status: e.target.value }))}>
                  {["Pending", "In Progress", "Review", "Testing", "Completed", "Blocked"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Dates & Hours */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>Start Date</label>
                <input type="date" style={inputStyle} value={form.start_date} onChange={e => setForm((f: any) => ({ ...f, start_date: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>Due Date</label>
                <input type="date" style={inputStyle} value={form.due_date} onChange={e => setForm((f: any) => ({ ...f, due_date: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>Est. Hours</label>
                <input type="number" style={inputStyle} placeholder="0" value={form.estimated_hours} onChange={e => setForm((f: any) => ({ ...f, estimated_hours: e.target.value }))} />
              </div>
            </div>

            <div style={{ height: 1, background: "rgba(255,255,255,0.04)" }} />

            {/* Assign Employees */}
            <div>
              <label style={labelStyle}>👥 Assign To</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                {form.assigned_to_multiple.map((id: string) => {
                  const emp = employees.find(e => e._id === id);
                  return (
                    <span key={id} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981", fontSize: 12, fontWeight: 600 }}>
                      {emp?.employee_id && <span style={{ fontFamily: "monospace", fontSize: 10 }}>{emp.employee_id}</span>}
                      {emp?.full_name || emp?.email || id.slice(0, 8)}
                      <X size={12} style={{ cursor: "pointer" }} onClick={() => toggleEmployee(emp || { _id: id })} />
                    </span>
                  );
                })}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, maxHeight: 180, overflowY: "auto", padding: 4 }}>
                {employees.map(emp => (
                  <div key={emp._id} onClick={() => toggleEmployee(emp)}
                    style={{
                      padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                      border: `1px solid ${form.assigned_to_multiple.includes(emp._id) ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.06)"}`,
                      background: form.assigned_to_multiple.includes(emp._id) ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.02)",
                      transition: "all 0.2s"
                    }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#f0f6fc" }}>{emp.full_name || emp.email}</div>
                    <div style={{ fontSize: 10, color: "#6e7681", marginTop: 2 }}>
                      {emp.employee_id && <span style={{ fontFamily: "monospace", color: "#3b82f6" }}>{emp.employee_id} • </span>}
                      {emp.position || "Staff"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: "rgba(255,255,255,0.04)" }} />

            {/* Checklist */}
            <div>
              <label style={labelStyle}>✅ Checklist</label>
              {form.checklist.map((item: any, i: number) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
                  <CheckCircle2 size={14} color="#6e7681" />
                  <span style={{ fontSize: 13, color: "#c9d1d9", flex: 1 }}>{item.text}</span>
                  <X size={14} style={{ cursor: "pointer", color: "#6e7681" }} onClick={() => setForm((f: any) => ({ ...f, checklist: f.checklist.filter((_: any, idx: number) => idx !== i) }))} />
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <input style={{ ...inputStyle, flex: 1 }} placeholder="Add checklist item..." value={checklistInput} onChange={e => setChecklistInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addChecklistItem(); } }} />
                <button onClick={addChecklistItem} style={{ padding: "10px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#c9d1d9", cursor: "pointer", fontSize: 13 }}>Add</button>
              </div>
            </div>

            {/* SMS Toggle */}
            {!task && (
              <div style={{ 
                padding: "16px 20px", 
                borderRadius: 14, 
                border: sendSms ? "1px solid rgba(168,85,247,0.3)" : "1px solid rgba(255,255,255,0.06)",
                background: sendSms ? "rgba(168,85,247,0.06)" : "rgba(255,255,255,0.02)",
                transition: "all 0.3s ease",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12
              }} onClick={() => setSendSms(!sendSms)}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Smartphone size={18} color={sendSms ? "#a855f7" : "#6e7681"} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: sendSms ? "#c9d1d9" : "#8b949e" }}>Send SMS to Assignees</div>
                    <div style={{ fontSize: 11, color: "#6e7681", marginTop: 2 }}>Text message will be sent to assigned members' phone</div>
                  </div>
                </div>
                <div style={{
                  width: 44, height: 24, borderRadius: 12, padding: 2,
                  background: sendSms ? "linear-gradient(135deg, #a855f7, #7c3aed)" : "rgba(255,255,255,0.1)",
                  transition: "all 0.3s ease", cursor: "pointer",
                  boxShadow: sendSms ? "0 0 12px rgba(168,85,247,0.3)" : "none",
                  display: "flex", alignItems: "center",
                  justifyContent: sendSms ? "flex-end" : "flex-start"
                }}>
                  <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    style={{
                      width: 20, height: 20, borderRadius: 10,
                      background: "#fff",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "20px 32px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <button onClick={onClose} style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#c9d1d9", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>Cancel</button>
          <button onClick={handleSubmit} disabled={submitting}
            style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", cursor: submitting ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, opacity: submitting ? 0.6 : 1 }}>
            {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
            Create & Notify
          </button>
        </div>
      </motion.div>
    </>
  );
};

// ══════════════════════════════════════════════════════════════
//  TASK DETAIL MODAL
// ══════════════════════════════════════════════════════════════

const TaskDetailModal: React.FC<{ task: any; onClose: () => void }> = ({ task, onClose }) => (
  <>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", zIndex: 200 }} />
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
      style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "90%", maxWidth: 640, maxHeight: "80vh", background: "rgba(13,17,23,0.98)", backdropFilter: "blur(40px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, zIndex: 201, overflow: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }}
    >
      <div style={{ padding: 32 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            {task.task_id && <span style={{ fontSize: 12, fontWeight: 700, color: "#10b981", fontFamily: "monospace", letterSpacing: "0.05em" }}>{task.task_id}</span>}
            <h3 style={{ fontSize: 22, fontWeight: 700, color: "#f0f6fc", marginTop: 4 }}>{task.title}</h3>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#6e7681", cursor: "pointer", padding: 8 }}><X size={20} /></button>
        </div>

        {/* Info Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
          <div style={{ padding: "12px 16px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ fontSize: 10, color: "#6e7681", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Project</div>
            <div style={{ fontSize: 14, color: "#f0f6fc", fontWeight: 600 }}>{task.project_name || "—"}</div>
          </div>
          <div style={{ padding: "12px 16px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ fontSize: 10, color: "#6e7681", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Client</div>
            <div style={{ fontSize: 14, color: "#f0f6fc", fontWeight: 600 }}>{task.client_name || "—"}</div>
          </div>
          <div style={{ padding: "12px 16px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ fontSize: 10, color: "#6e7681", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Due Date</div>
            <div style={{ fontSize: 14, color: "#f0f6fc", fontWeight: 600 }}>{task.due_date ? new Date(task.due_date).toLocaleDateString("en-IN") : "—"}</div>
          </div>
        </div>

        {/* Status & Priority */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          <PriorityBadge priority={task.priority} />
          <TaskStatusBadge status={task.status} />
          <span style={{ fontSize: 12, color: "#8b949e", display: "flex", alignItems: "center", gap: 4 }}>
            <Timer size={14} /> Est: {task.estimated_hours || 0}h • Actual: {task.actual_hours || 0}h
          </span>
        </div>

        {/* Description */}
        {task.description && (
          <div style={{ marginBottom: 24, padding: 16, borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ fontSize: 10, color: "#6e7681", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>Description</div>
            <div style={{ fontSize: 14, color: "#c9d1d9", lineHeight: 1.6 }}>{task.description}</div>
          </div>
        )}

        {/* Assignees */}
        {task.assigned_to_names && task.assigned_to_names.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 10, color: "#6e7681", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>Assigned To</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {task.assigned_to_names.map((name: string, i: number) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)", color: "#10b981", fontSize: 13, fontWeight: 600 }}>
                  <User size={14} /> {name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Checklist */}
        {task.checklist && task.checklist.length > 0 && (
          <div>
            <div style={{ fontSize: 10, color: "#6e7681", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>Checklist</div>
            {task.checklist.map((item: any, i: number) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
                <CheckCircle2 size={16} color={item.done ? "#10b981" : "#484f58"} />
                <span style={{ fontSize: 14, color: item.done ? "#8b949e" : "#c9d1d9", textDecoration: item.done ? "line-through" : "none" }}>{item.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  </>
);

export default PMTasks;
