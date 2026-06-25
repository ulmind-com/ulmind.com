/* ──────────────────────────────────────────────────────────────
   ULMiND Admin — Manager Tracking & Workforce Intelligence
   Enterprise-grade live workforce dashboard with 8 sections:
   1. Live Workforce Dashboard (KPIs)
   2. Employee Live Monitoring
   3. Enterprise Task Tracking
   4. Live Timeline
   5. Time Tracking
   6. Productivity Intelligence
   7. Manager Analytics
   8. Smart Alerts
   ────────────────────────────────────────────────────────────── */

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Activity, Clock, AlertTriangle, BarChart3, Target,
  CheckCircle2, XCircle, Pause, Play, Square, Timer,
  Wifi, WifiOff, Coffee, Moon, Sunrise, Zap, TrendingUp,
  TrendingDown, ChevronRight, Plus, X, Loader2, Eye,
  Calendar, Flag, MessageSquare, ListChecks, ArrowUpRight,
  RefreshCcw, Search, Filter, MoreVertical, Bell, Shield
} from "lucide-react";
import { useAuth } from "../../context/auth-context";
import {
  getWorkforceDashboardAPI, getEmployeesLiveAPI, getManagerTasksAPI,
  createManagerTaskAPI, updateManagerTaskAPI, getSmartAlertsAPI,
  getManagerAnalyticsAPI, getEmployeeTimelineAPI, getProductivityAPI,
  startTimerAPI, pauseTimerAPI, resumeTimerAPI, stopTimerAPI,
  type WorkforceDashboard, type EmployeeLiveStatus, type EnterpriseTask,
  type SmartAlert, type ManagerAnalytics, type ProductivityScore,
} from "../../lib/manager-api";
import { listTeamAPI, type AdminUser } from "../../lib/api";

// ─── Tab definitions ───
const TABS = [
  { id: "dashboard", label: "Live Dashboard", icon: Activity },
  { id: "monitoring", label: "Employee Monitoring", icon: Eye },
  { id: "tasks", label: "Task Tracking", icon: Target },
  { id: "timeline", label: "Timeline", icon: Clock },
  { id: "time", label: "Time Tracking", icon: Timer },
  { id: "productivity", label: "Productivity", icon: TrendingUp },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "alerts", label: "Smart Alerts", icon: Bell },
] as const;

type TabId = typeof TABS[number]["id"];

const STAGES = ["Pending", "Assigned", "Accepted", "In Progress", "Review", "Approved", "Completed", "Archived"];
const PRIORITIES = ["Low", "Medium", "High", "Urgent", "Critical"];

const stageColors: Record<string, string> = {
  "Pending": "#94a3b8", "Assigned": "#38bdf8", "Accepted": "#818cf8",
  "In Progress": "#f59e0b", "Review": "#a78bfa", "Approved": "#10b981",
  "Completed": "#22c55e", "Archived": "#64748b"
};

const priorityColors: Record<string, string> = {
  "Low": "#94a3b8", "Medium": "#38bdf8", "High": "#f59e0b",
  "Urgent": "#f43f5e", "Critical": "#ef4444"
};

const statusColors: Record<string, string> = {
  "Online": "#10b981", "Offline": "#64748b", "Idle": "#f59e0b",
  "On Break": "#38bdf8", "On Leave": "#a78bfa", "Overtime": "#ef4444"
};

const statusIcons: Record<string, React.ReactNode> = {
  "Online": <Wifi size={14} />, "Offline": <WifiOff size={14} />,
  "Idle": <Moon size={14} />, "On Break": <Coffee size={14} />,
  "On Leave": <Sunrise size={14} />, "Overtime": <Zap size={14} />
};

const perfLevelColors: Record<string, string> = {
  "Excellent": "#10b981", "Good": "#22c55e", "Average": "#f59e0b",
  "Needs Attention": "#f97316", "Critical": "#ef4444"
};

// ─── Animated counter component ───
const AnimatedCounter: React.FC<{ value: number; suffix?: string }> = ({ value, suffix = "" }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const duration = 600;
    const start = performance.now();
    const from = display;
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);
  return <>{display}{suffix}</>;
};

// ─── Glowing KPI Card ───
const KpiCard: React.FC<{
  label: string; value: number | string; icon: React.ReactNode;
  color: string; suffix?: string; trend?: "up" | "down" | null;
}> = ({ label, value, icon, color, suffix = "", trend }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
    style={{
      background: "rgba(15, 12, 18, 0.7)", backdropFilter: "blur(24px)",
      border: `1px solid ${color}20`, borderRadius: 20, padding: "20px 22px",
      position: "relative", overflow: "hidden", cursor: "default",
    }}
  >
    <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: color, opacity: 0.08, filter: "blur(30px)" }} />
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, position: "relative", zIndex: 1 }}>
      <div style={{ width: 38, height: 38, borderRadius: 12, background: `${color}15`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", color }}>
        {icon}
      </div>
      {trend && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: trend === "up" ? "#10b981" : "#ef4444" }}>
          {trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        </div>
      )}
    </div>
    <div style={{ position: "relative", zIndex: 1 }}>
      <p style={{ fontSize: 28, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em", lineHeight: 1 }}>
        {typeof value === "number" ? <AnimatedCounter value={value} suffix={suffix} /> : value}
      </p>
      <p style={{ fontSize: 12, color: "#64748b", fontWeight: 600, marginTop: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
    </div>
  </motion.div>
);

// ─── Status Badge ───
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const color = statusColors[status] || "#64748b";
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 10px", borderRadius: 20,
      background: `${color}15`, border: `1px solid ${color}30`,
      fontSize: 11, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.04em"
    }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}80`, animation: status === "Online" ? "pulse 2s ease-in-out infinite" : "none" }} />
      {statusIcons[status]} {status}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

const ManagerTrackingPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [loading, setLoading] = useState(true);

  // Data states
  const [dashboard, setDashboard] = useState<WorkforceDashboard | null>(null);
  const [employees, setEmployees] = useState<EmployeeLiveStatus[]>([]);
  const [tasks, setTasks] = useState<EnterpriseTask[]>([]);
  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const [analytics, setAnalytics] = useState<ManagerAnalytics | null>(null);
  const [team, setTeam] = useState<AdminUser[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [productivity, setProductivity] = useState<ProductivityScore | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [taskFilter, setTaskFilter] = useState<string>("");

  // Task create form
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: "", description: "", priority: "Medium", assigned_to: "", due_date: "" });
  const [formLoading, setFormLoading] = useState(false);

  // Fetch all data
  const fetchData = useCallback(async () => {
    try {
      const [dashData, empData, taskData, alertData, teamData] = await Promise.allSettled([
        getWorkforceDashboardAPI(),
        getEmployeesLiveAPI(),
        getManagerTasksAPI(),
        getSmartAlertsAPI(),
        listTeamAPI(),
      ]);
      if (dashData.status === "fulfilled") setDashboard(dashData.value);
      if (empData.status === "fulfilled") setEmployees(empData.value);
      if (taskData.status === "fulfilled") setTasks(taskData.value);
      if (alertData.status === "fulfilled") setAlerts(alertData.value);
      if (teamData.status === "fulfilled") setTeam(teamData.value);
    } catch (err) {
      console.error("Manager tracking fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Auto-refresh dashboard every 10 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const [d, e] = await Promise.allSettled([getWorkforceDashboardAPI(), getEmployeesLiveAPI()]);
        if (d.status === "fulfilled") setDashboard(d.value);
        if (e.status === "fulfilled") setEmployees(e.value);
      } catch (e) {
        console.error("Dashboard refresh failed:", e);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch analytics lazily
  useEffect(() => {
    if (activeTab === "analytics" && !analytics) {
      getManagerAnalyticsAPI().then(setAnalytics).catch(console.error);
    }
  }, [activeTab, analytics]);

  // Fetch timeline when employee selected
  useEffect(() => {
    if (activeTab === "timeline" && selectedEmployee) {
      getEmployeeTimelineAPI(selectedEmployee).then(setTimeline).catch(console.error);
    }
  }, [activeTab, selectedEmployee]);

  // Fetch productivity when employee selected
  useEffect(() => {
    if (activeTab === "productivity" && selectedEmployee) {
      getProductivityAPI(selectedEmployee).then(setProductivity).catch(console.error);
    }
  }, [activeTab, selectedEmployee]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await createManagerTaskAPI({
        ...taskForm,
        due_date: taskForm.due_date ? new Date(taskForm.due_date).toISOString() : null,
      });
      setShowTaskForm(false);
      setTaskForm({ title: "", description: "", priority: "Medium", assigned_to: "", due_date: "" });
      const updated = await getManagerTasksAPI();
      setTasks(updated);
    } catch (err: any) {
      alert(err.message || "Failed to create task");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateTaskStage = async (taskId: string, newStage: string) => {
    try {
      await updateManagerTaskAPI(taskId, { stage: newStage });
      const updated = await getManagerTasksAPI();
      setTasks(updated);
    } catch (err: any) {
      alert(err.message || "Failed to update task");
    }
  };

  // ─── SECTION: Live Dashboard ───
  const renderDashboard = () => {
    const d = dashboard;
    const kpis = [
      { label: "Online", value: d?.online_employees ?? 0, icon: <Wifi size={18} />, color: "#10b981" },
      { label: "Offline", value: d?.offline_employees ?? 0, icon: <WifiOff size={18} />, color: "#64748b" },
      { label: "Active", value: d?.active_employees ?? 0, icon: <Activity size={18} />, color: "#22c55e" },
      { label: "Idle", value: d?.idle_employees ?? 0, icon: <Moon size={18} />, color: "#f59e0b" },
      { label: "On Break", value: d?.on_break ?? 0, icon: <Coffee size={18} />, color: "#38bdf8" },
      { label: "Overtime", value: d?.overtime ?? 0, icon: <Zap size={18} />, color: "#ef4444" },
      { label: "On Leave", value: d?.on_leave ?? 0, icon: <Sunrise size={18} />, color: "#a78bfa" },
      { label: "Running Tasks", value: d?.running_tasks ?? 0, icon: <Play size={18} />, color: "#f59e0b" },
      { label: "Delayed Tasks", value: d?.delayed_tasks ?? 0, icon: <AlertTriangle size={18} />, color: "#ef4444" },
      { label: "Blocked", value: d?.blocked_tasks ?? 0, icon: <XCircle size={18} />, color: "#f43f5e" },
      { label: "Completed Today", value: d?.completed_today ?? 0, icon: <CheckCircle2 size={18} />, color: "#10b981" },
      { label: "Deadlines Soon", value: d?.upcoming_deadlines ?? 0, icon: <Calendar size={18} />, color: "#f97316" },
      { label: "Team Productivity", value: d?.team_productivity ?? 0, icon: <TrendingUp size={18} />, color: "#22c55e", suffix: "%" },
      { label: "Avg Completion", value: d?.avg_completion_time_hours ?? 0, icon: <Clock size={18} />, color: "#818cf8", suffix: "h" },
      { label: "Hours Today", value: d?.total_working_hours_today ?? 0, icon: <Timer size={18} />, color: "#38bdf8", suffix: "h" },
    ];

    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>Live Workforce Dashboard</h3>
            <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>Real-time monitoring — auto-refreshes every 10 seconds</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", animation: "pulse 2s ease-in-out infinite" }} />
            <span style={{ fontSize: 12, color: "#10b981", fontWeight: 600 }}>LIVE</span>
          </div>
        </div>
        <motion.div
          initial="hidden" animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}
        >
          {kpis.map(k => (
            <motion.div key={k.label} variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
              <KpiCard {...k} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  };

  // ─── SECTION: Employee Monitoring ───
  const renderMonitoring = () => {
    const filtered = employees.filter(e =>
      e.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9" }}>Employee Live Monitoring</h3>
          <div style={{ position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
            <input
              type="text" placeholder="Search employees..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 36, padding: "10px 14px 10px 36px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "#f1f5f9", fontSize: 13, width: 240, outline: "none" }}
            />
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px" }}>
            <thead>
              <tr>{["Employee", "Status", "Designation", "Current Task", "Device / Browser", "Login", "Session", "Last Activity", "Active / Idle"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 14px", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {filtered.map(emp => (
                <motion.tr
                  key={emp.employee_id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ background: "rgba(15,12,18,0.6)", backdropFilter: "blur(12px)" }}
                >
                  <td style={{ padding: "12px 14px", borderRadius: "12px 0 0 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ position: "relative" }}>
                        {emp.profile_photo ? (
                          <img src={emp.profile_photo} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: `2px solid ${statusColors[emp.status] || "#64748b"}` }} />
                        ) : (
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #be123c, #881337)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700, border: `2px solid ${statusColors[emp.status] || "#64748b"}` }}>
                            {emp.employee_name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                        )}
                        <div style={{ position: "absolute", bottom: -1, right: -1, width: 10, height: 10, borderRadius: "50%", background: statusColors[emp.status] || "#64748b", border: "2px solid #0f0c12" }} />
                      </div>
                      <div>
                        <p style={{ color: "#f1f5f9", fontWeight: 600, fontSize: 13 }}>{emp.employee_name || emp.email}</p>
                        <p style={{ color: "#64748b", fontSize: 11 }}>{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px" }}><StatusBadge status={emp.status} /></td>
                  <td style={{ padding: "12px 14px", color: "#cbd5e1", fontSize: 13 }}>{emp.designation}</td>
                  <td style={{ padding: "12px 14px", color: "#cbd5e1", fontSize: 13 }}>{emp.current_task || <span style={{ color: "#475569" }}>No active task</span>}</td>
                  <td style={{ padding: "12px 14px", color: "#94a3b8", fontSize: 12 }}>
                    {emp.device} • {emp.browser}<br /><span style={{ fontSize: 11, color: "#475569" }}>{emp.os}</span>
                  </td>
                  <td style={{ padding: "12px 14px", color: "#94a3b8", fontSize: 12 }}>
                    {emp.login_time ? new Date(emp.login_time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "—"}
                  </td>
                  <td style={{ padding: "12px 14px", color: "#94a3b8", fontSize: 12 }}>{Math.round(emp.session_duration_minutes)}m</td>
                  <td style={{ padding: "12px 14px", color: "#94a3b8", fontSize: 12 }}>
                    {emp.last_activity ? new Date(emp.last_activity).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "—"}
                  </td>
                  <td style={{ padding: "12px 14px", borderRadius: "0 12px 12px 0" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <span style={{ fontSize: 11, color: "#10b981", fontWeight: 600 }}>{Math.round(emp.active_minutes)}m</span>
                      <span style={{ color: "#334155" }}>/</span>
                      <span style={{ fontSize: 11, color: "#f59e0b", fontWeight: 600 }}>{Math.round(emp.idle_minutes)}m</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ─── SECTION: Task Tracking ───
  const renderTasks = () => {
    const filtered = tasks.filter(t => !taskFilter || t.stage === taskFilter);
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9" }}>Enterprise Task Tracking</h3>
          <div style={{ display: "flex", gap: 12 }}>
            <select
              value={taskFilter} onChange={e => setTaskFilter(e.target.value)}
              style={{ padding: "8px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "#f1f5f9", fontSize: 13, cursor: "pointer" }}
            >
              <option value="">All Stages</option>
              {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={() => setShowTaskForm(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRadius: 12, background: "linear-gradient(135deg, #e11d48, #be123c)", color: "#fff", border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
              <Plus size={16} /> New Task
            </button>
          </div>
        </div>

        {/* Stage workflow strip */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
          {STAGES.map(stage => {
            const count = tasks.filter(t => t.stage === stage).length;
            return (
              <button key={stage} onClick={() => setTaskFilter(taskFilter === stage ? "" : stage)}
                style={{
                  padding: "8px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600, border: `1px solid ${stageColors[stage]}30`,
                  background: taskFilter === stage ? `${stageColors[stage]}20` : "rgba(0,0,0,0.2)",
                  color: stageColors[stage], cursor: "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6,
                }}>
                {stage} <span style={{ background: `${stageColors[stage]}25`, padding: "2px 6px", borderRadius: 8, fontSize: 10, fontWeight: 800 }}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Task cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 16 }}>
          {filtered.map(task => (
            <motion.div key={task._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -3 }}
              style={{ background: "rgba(15,12,18,0.7)", backdropFilter: "blur(20px)", border: `1px solid ${stageColors[task.stage] || "#333"}25`, borderRadius: 20, padding: 22, position: "relative", overflow: "hidden" }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${stageColors[task.stage]}, transparent)` }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <h4 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 15, flex: 1, marginRight: 12 }}>{task.title}</h4>
                <span style={{ padding: "3px 8px", borderRadius: 8, fontSize: 10, fontWeight: 700, background: `${priorityColors[task.priority]}15`, color: priorityColors[task.priority], border: `1px solid ${priorityColors[task.priority]}30`, textTransform: "uppercase", flexShrink: 0 }}>
                  {task.priority}
                </span>
              </div>

              {task.description && <p style={{ color: "#94a3b8", fontSize: 12, marginBottom: 14, lineHeight: 1.5 }}>{task.description.slice(0, 100)}{task.description.length > 100 ? "..." : ""}</p>}

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
                {task.assigned_to_name && <span style={{ fontSize: 11, color: "#cbd5e1", display: "flex", alignItems: "center", gap: 4 }}><Users size={12} /> {task.assigned_to_name}</span>}
                {task.project_name && <span style={{ fontSize: 11, color: "#818cf8", display: "flex", alignItems: "center", gap: 4 }}><Target size={12} /> {task.project_name}</span>}
                {task.due_date && <span style={{ fontSize: 11, color: new Date(task.due_date) < new Date() && task.stage !== "Completed" ? "#ef4444" : "#94a3b8", display: "flex", alignItems: "center", gap: 4 }}><Calendar size={12} /> {new Date(task.due_date).toLocaleDateString()}</span>}
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: "#64748b" }}>Progress</span>
                  <span style={{ fontSize: 11, color: stageColors[task.stage], fontWeight: 700 }}>{task.completion_percent}%</span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${task.completion_percent}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ height: "100%", background: `linear-gradient(90deg, ${stageColors[task.stage]}, ${stageColors[task.stage]}80)`, borderRadius: 4 }} />
                </div>
              </div>

              {/* Stage selector */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <select value={task.stage} onChange={e => handleUpdateTaskStage(task._id, e.target.value)}
                  style={{ padding: "6px 10px", borderRadius: 8, border: `1px solid ${stageColors[task.stage]}30`, background: `${stageColors[task.stage]}10`, color: stageColors[task.stage], fontSize: 11, fontWeight: 600, cursor: "pointer" }}
                >
                  {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div style={{ display: "flex", gap: 8 }}>
                  {task.subtasks?.length > 0 && <span style={{ fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}><ListChecks size={12} /> {task.subtasks.filter((s: any) => s.status === "Completed").length}/{task.subtasks.length}</span>}
                  {task.comments?.length > 0 && <span style={{ fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}><MessageSquare size={12} /> {task.comments.length}</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Create task modal */}
        <AnimatePresence>
          {showTaskForm && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowTaskForm(false)}
                style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", zIndex: 100 }} />
              <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
                style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "100%", maxWidth: 480, background: "rgba(20,18,22,0.95)", backdropFilter: "blur(40px)", borderLeft: "1px solid rgba(255,255,255,0.1)", zIndex: 101, display: "flex", flexDirection: "column" }}
              >
                <div style={{ padding: "24px 32px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9" }}>Create Task</h3>
                  <button onClick={() => setShowTaskForm(false)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}><X size={20} /></button>
                </div>
                <form onSubmit={handleCreateTask} style={{ flex: 1, overflow: "auto", padding: 32, display: "flex", flexDirection: "column", gap: 20 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 8, textTransform: "uppercase" }}>Title *</label>
                    <input required value={taskForm.title} onChange={e => setTaskForm(p => ({ ...p, title: e.target.value }))}
                      style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "#f1f5f9", fontSize: 14, outline: "none" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 8, textTransform: "uppercase" }}>Description</label>
                    <textarea value={taskForm.description} onChange={e => setTaskForm(p => ({ ...p, description: e.target.value }))} rows={3}
                      style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "#f1f5f9", fontSize: 14, outline: "none", resize: "vertical" }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 8, textTransform: "uppercase" }}>Priority</label>
                      <select value={taskForm.priority} onChange={e => setTaskForm(p => ({ ...p, priority: e.target.value }))}
                        style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "#f1f5f9", fontSize: 14, cursor: "pointer" }}>
                        {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 8, textTransform: "uppercase" }}>Due Date</label>
                      <input type="date" value={taskForm.due_date} onChange={e => setTaskForm(p => ({ ...p, due_date: e.target.value }))}
                        style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "#f1f5f9", fontSize: 14 }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 8, textTransform: "uppercase" }}>Assign To</label>
                    <select value={taskForm.assigned_to} onChange={e => setTaskForm(p => ({ ...p, assigned_to: e.target.value }))}
                      style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "#f1f5f9", fontSize: 14, cursor: "pointer" }}>
                      <option value="">Unassigned</option>
                      {team.map(t => <option key={t._id} value={t._id}>{t.full_name || t.email}</option>)}
                    </select>
                  </div>
                  <div style={{ marginTop: "auto", paddingTop: 16 }}>
                    <button type="submit" disabled={formLoading}
                      style={{ width: "100%", padding: "14px", borderRadius: 12, background: "linear-gradient(135deg, #e11d48, #be123c)", color: "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>
                      {formLoading ? <Loader2 size={18} className="animate-spin" /> : "Create Task"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // ─── SECTION: Timeline ───
  const renderTimeline = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9" }}>Live Activity Timeline</h3>
        <select value={selectedEmployee} onChange={e => setSelectedEmployee(e.target.value)}
          style={{ padding: "10px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "#f1f5f9", fontSize: 13, cursor: "pointer", minWidth: 200 }}>
          <option value="">Select Employee</option>
          {team.map(t => <option key={t._id} value={t._id}>{t.full_name || t.email}</option>)}
        </select>
      </div>
      {!selectedEmployee ? (
        <div style={{ textAlign: "center", padding: 60, color: "#64748b" }}>
          <Clock size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
          <p style={{ fontSize: 15 }}>Select an employee to view their activity timeline</p>
        </div>
      ) : (
        <div style={{ position: "relative", paddingLeft: 32 }}>
          <div style={{ position: "absolute", left: 11, top: 0, bottom: 0, width: 2, background: "linear-gradient(180deg, rgba(225,29,72,0.4), transparent)" }} />
          {timeline.map((entry, i) => (
            <motion.div key={entry._id || i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              style={{ marginBottom: 20, position: "relative" }}
            >
              <div style={{ position: "absolute", left: -27, top: 4, width: 12, height: 12, borderRadius: "50%",
                background: entry.action === "login" ? "#10b981" : entry.action === "logout" ? "#ef4444" : "#818cf8",
                border: "3px solid #0f0c12", boxShadow: `0 0 10px ${entry.action === "login" ? "#10b981" : "#818cf8"}50` }} />
              <div style={{ background: "rgba(15,12,18,0.6)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: "14px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", textTransform: "capitalize" }}>{entry.action?.replace(/_/g, " ")}</span>
                  <span style={{ fontSize: 11, color: "#64748b" }}>{entry.timestamp ? new Date(entry.timestamp).toLocaleString() : ""}</span>
                </div>
                <p style={{ fontSize: 12, color: "#94a3b8" }}>{entry.description}</p>
              </div>
            </motion.div>
          ))}
          {timeline.length === 0 && <p style={{ color: "#64748b", textAlign: "center", padding: 40 }}>No activity recorded yet.</p>}
        </div>
      )}
    </div>
  );

  // ─── SECTION: Time Tracking ───
  const renderTimeTracking = () => (
    <div>
      <h3 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", marginBottom: 20 }}>Time Tracking</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {employees.filter(e => e.status === "Online" || e.status === "On Break").map(emp => (
          <motion.div key={emp.employee_id} whileHover={{ y: -3 }}
            style={{ background: "rgba(15,12,18,0.7)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 22 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
              <div style={{ position: "relative" }}>
                {emp.profile_photo ? (
                  <img src={emp.profile_photo} alt="" style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg, #be123c, #881337)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16, fontWeight: 700 }}>
                    {emp.employee_name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
              </div>
              <div>
                <p style={{ color: "#f1f5f9", fontWeight: 600, fontSize: 14 }}>{emp.employee_name}</p>
                <p style={{ color: "#64748b", fontSize: 12 }}>{emp.designation}</p>
              </div>
              <StatusBadge status={emp.status} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: "10px 14px" }}>
                <p style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", fontWeight: 600 }}>Active</p>
                <p style={{ fontSize: 18, fontWeight: 700, color: "#10b981" }}>{Math.round(emp.active_minutes)}m</p>
              </div>
              <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: "10px 14px" }}>
                <p style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", fontWeight: 600 }}>Idle</p>
                <p style={{ fontSize: 18, fontWeight: 700, color: "#f59e0b" }}>{Math.round(emp.idle_minutes)}m</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => startTimerAPI({ employee_id: emp.employee_id }).catch(e => alert(e.message))}
                style={{ flex: 1, padding: "8px", borderRadius: 10, border: "1px solid rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.1)", color: "#10b981", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                <Play size={12} /> Start
              </button>
              <button onClick={() => pauseTimerAPI({ employee_id: emp.employee_id }).catch(e => alert(e.message))}
                style={{ flex: 1, padding: "8px", borderRadius: 10, border: "1px solid rgba(56,189,248,0.3)", background: "rgba(56,189,248,0.1)", color: "#38bdf8", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                <Pause size={12} /> Pause
              </button>
              <button onClick={() => stopTimerAPI({ employee_id: emp.employee_id }).catch(e => alert(e.message))}
                style={{ flex: 1, padding: "8px", borderRadius: 10, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.1)", color: "#ef4444", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                <Square size={12} /> Stop
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      {employees.filter(e => e.status === "Online" || e.status === "On Break").length === 0 && (
        <div style={{ textAlign: "center", padding: 60, color: "#64748b" }}>
          <Timer size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
          <p>No employees currently online to track time.</p>
        </div>
      )}
    </div>
  );

  // ─── SECTION: Productivity ───
  const renderProductivity = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9" }}>Productivity Intelligence</h3>
        <select value={selectedEmployee} onChange={e => setSelectedEmployee(e.target.value)}
          style={{ padding: "10px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "#f1f5f9", fontSize: 13, cursor: "pointer", minWidth: 200 }}>
          <option value="">Select Employee</option>
          {team.map(t => <option key={t._id} value={t._id}>{t.full_name || t.email}</option>)}
        </select>
      </div>
      {!selectedEmployee || !productivity ? (
        <div style={{ textAlign: "center", padding: 60, color: "#64748b" }}>
          <TrendingUp size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
          <p>Select an employee to view productivity scores</p>
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
            <h4 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 18 }}>{productivity.employee_name}</h4>
            <span style={{
              padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700,
              background: `${perfLevelColors[productivity.performance_level] || "#64748b"}15`,
              color: perfLevelColors[productivity.performance_level] || "#64748b",
              border: `1px solid ${perfLevelColors[productivity.performance_level] || "#64748b"}30`
            }}>{productivity.performance_level}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {[
              { label: "Productivity Score", value: productivity.productivity_score, color: "#10b981" },
              { label: "Efficiency Score", value: productivity.efficiency_score, color: "#22c55e" },
              { label: "Workload", value: productivity.workload_percent, color: "#f59e0b", suffix: "%" },
              { label: "Capacity", value: productivity.capacity_percent, color: "#38bdf8", suffix: "%" },
              { label: "Completion Rate", value: productivity.task_completion_rate, color: "#818cf8", suffix: "%" },
              { label: "Deadline Accuracy", value: productivity.deadline_accuracy, color: "#a78bfa", suffix: "%" },
              { label: "Delay Frequency", value: productivity.delay_frequency, color: "#ef4444", suffix: "%" },
              { label: "Quality Score", value: productivity.quality_score, color: "#10b981" },
            ].map(m => (
              <div key={m.label} style={{ background: "rgba(15,12,18,0.7)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "18px 20px" }}>
                <p style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 10 }}>{m.label}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: m.color }}>{Math.round(m.value)}</span>
                  {m.suffix && <span style={{ fontSize: 14, color: "#64748b" }}>{m.suffix}</span>}
                </div>
                <div style={{ height: 5, background: "rgba(255,255,255,0.05)", borderRadius: 4, marginTop: 10, overflow: "hidden" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(m.value, 100)}%` }} transition={{ duration: 1 }}
                    style={{ height: "100%", background: m.color, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // ─── SECTION: Analytics ───
  const renderAnalytics = () => (
    <div>
      <h3 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", marginBottom: 20 }}>Manager Analytics</h3>
      {!analytics ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Loader2 size={32} className="animate-spin" style={{ color: "#64748b" }} /></div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Tasks by Stage */}
          <div style={{ background: "rgba(15,12,18,0.7)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 24 }}>
            <h4 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 15, marginBottom: 18 }}>Tasks by Stage</h4>
            {analytics.tasks_by_stage.map(s => (
              <div key={s.stage} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: stageColors[s.stage] || "#94a3b8", fontWeight: 600 }}>{s.stage}</span>
                  <span style={{ fontSize: 12, color: "#f1f5f9", fontWeight: 700 }}>{s.count}</span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${Math.min((s.count / Math.max(...analytics.tasks_by_stage.map(x => x.count), 1)) * 100, 100)}%`, height: "100%", background: stageColors[s.stage] || "#64748b", borderRadius: 4, transition: "width 0.8s ease" }} />
                </div>
              </div>
            ))}
          </div>

          {/* Tasks by Priority */}
          <div style={{ background: "rgba(15,12,18,0.7)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 24 }}>
            <h4 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 15, marginBottom: 18 }}>Tasks by Priority</h4>
            {analytics.tasks_by_priority.map(p => (
              <div key={p.priority} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: priorityColors[p.priority] || "#94a3b8", fontWeight: 600 }}>{p.priority}</span>
                  <span style={{ fontSize: 12, color: "#f1f5f9", fontWeight: 700 }}>{p.count}</span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${Math.min((p.count / Math.max(...analytics.tasks_by_priority.map(x => x.count), 1)) * 100, 100)}%`, height: "100%", background: priorityColors[p.priority] || "#64748b", borderRadius: 4, transition: "width 0.8s ease" }} />
                </div>
              </div>
            ))}
          </div>

          {/* Employee Workload */}
          <div style={{ background: "rgba(15,12,18,0.7)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 24 }}>
            <h4 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 15, marginBottom: 18 }}>Employee Workload</h4>
            {analytics.employee_workload.length === 0 ? (
              <p style={{ color: "#64748b", fontSize: 13 }}>No active tasks assigned yet.</p>
            ) : analytics.employee_workload.map(w => (
              <div key={w.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                <span style={{ fontSize: 13, color: "#cbd5e1" }}>{w.name}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: w.tasks > 5 ? "#ef4444" : w.tasks > 3 ? "#f59e0b" : "#10b981" }}>{w.tasks} tasks</span>
              </div>
            ))}
          </div>

          {/* Working Hours per Employee */}
          <div style={{ background: "rgba(15,12,18,0.7)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 24 }}>
            <h4 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 15, marginBottom: 18 }}>Working Hours (30 days)</h4>
            {analytics.hours_per_employee.length === 0 ? (
              <p style={{ color: "#64748b", fontSize: 13 }}>No work logs recorded yet.</p>
            ) : analytics.hours_per_employee.map(h => (
              <div key={h.name} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: "#cbd5e1" }}>{h.name}</span>
                  <span style={{ fontSize: 12, color: "#38bdf8", fontWeight: 700 }}>{h.hours}h</span>
                </div>
                <div style={{ height: 5, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${Math.min((h.hours / Math.max(...analytics.hours_per_employee.map(x => x.hours), 1)) * 100, 100)}%`, height: "100%", background: "linear-gradient(90deg, #38bdf8, #818cf8)", borderRadius: 4, transition: "width 0.8s ease" }} />
                </div>
              </div>
            ))}
          </div>

          {/* Task Completion Trend */}
          <div style={{ gridColumn: "span 2", background: "rgba(15,12,18,0.7)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 24 }}>
            <h4 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 15, marginBottom: 18 }}>Task Completion Trend (30 days)</h4>
            {analytics.task_completion_trend.length === 0 ? (
              <p style={{ color: "#64748b", fontSize: 13 }}>No completed tasks in the last 30 days.</p>
            ) : (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 120 }}>
                {analytics.task_completion_trend.map(d => {
                  const maxVal = Math.max(...analytics.task_completion_trend.map(x => x.completed), 1);
                  const h = (d.completed / maxVal) * 100;
                  return (
                    <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <span style={{ fontSize: 9, color: "#64748b" }}>{d.completed}</span>
                      <div style={{ width: "100%", height: `${h}%`, minHeight: 4, background: "linear-gradient(180deg, #10b981, #10b98150)", borderRadius: "4px 4px 0 0", transition: "height 0.5s ease" }} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // ─── SECTION: Smart Alerts ───
  const renderAlerts = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9" }}>Smart Alerts</h3>
        <button onClick={fetchData} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
          <RefreshCcw size={14} /> Refresh
        </button>
      </div>
      {alerts.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "#64748b" }}>
          <CheckCircle2 size={48} style={{ marginBottom: 16, color: "#10b981", opacity: 0.4 }} />
          <p style={{ fontSize: 15, fontWeight: 600 }}>All Clear!</p>
          <p style={{ fontSize: 13, marginTop: 4 }}>No alerts at this time. Your team is performing well.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {alerts.map(alert => (
            <motion.div key={alert._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              style={{
                background: "rgba(15,12,18,0.7)", backdropFilter: "blur(20px)", borderRadius: 16, padding: "18px 22px",
                borderLeft: `4px solid ${alert.severity === "Critical" ? "#ef4444" : alert.severity === "Warning" ? "#f59e0b" : "#38bdf8"}`,
                border: `1px solid ${alert.severity === "Critical" ? "rgba(239,68,68,0.2)" : alert.severity === "Warning" ? "rgba(245,158,11,0.2)" : "rgba(56,189,248,0.2)"}`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 14 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                    background: alert.severity === "Critical" ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)",
                    color: alert.severity === "Critical" ? "#ef4444" : "#f59e0b",
                  }}>
                    <AlertTriangle size={18} />
                  </div>
                  <div>
                    <h4 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{alert.title}</h4>
                    <p style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.5 }}>{alert.message}</p>
                    {alert.employee_name && <p style={{ color: "#64748b", fontSize: 11, marginTop: 6 }}>Employee: {alert.employee_name}</p>}
                  </div>
                </div>
                <span style={{
                  padding: "3px 10px", borderRadius: 8, fontSize: 10, fontWeight: 800, textTransform: "uppercase",
                  background: alert.severity === "Critical" ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)",
                  color: alert.severity === "Critical" ? "#ef4444" : "#f59e0b",
                  border: `1px solid ${alert.severity === "Critical" ? "rgba(239,68,68,0.3)" : "rgba(245,158,11,0.3)"}`,
                }}>{alert.severity}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  // ─── RENDER TAB CONTENT ───
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return renderDashboard();
      case "monitoring": return renderMonitoring();
      case "tasks": return renderTasks();
      case "timeline": return renderTimeline();
      case "time": return renderTimeTracking();
      case "productivity": return renderProductivity();
      case "analytics": return renderAnalytics();
      case "alerts": return renderAlerts();
      default: return renderDashboard();
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <Loader2 size={40} className="animate-spin" style={{ color: "#64748b" }} />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <div style={{ width: 40, height: 40, borderRadius: 14, background: "linear-gradient(135deg, #e11d48, #9f1239)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(225,29,72,0.3)" }}>
            <Shield size={20} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>Manager Tracking</h2>
            <p style={{ color: "#64748b", fontSize: 13 }}>Workforce Intelligence & Real-Time Monitoring</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: "flex", gap: 6, marginBottom: 28, overflowX: "auto", paddingBottom: 4 }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 14, fontSize: 13, fontWeight: 600,
              border: activeTab === tab.id ? "1px solid rgba(225,29,72,0.4)" : "1px solid rgba(255,255,255,0.06)",
              background: activeTab === tab.id ? "rgba(225,29,72,0.12)" : "rgba(255,255,255,0.03)",
              color: activeTab === tab.id ? "#fb7185" : "#94a3b8",
              cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s",
            }}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </motion.div>
  );
};

export default ManagerTrackingPage;
