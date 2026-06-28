/* ──────────────────────────────────────────────────────────────
   ULMiND Admin — Enhanced Project Profile
   Tabs: Overview, Tasks (with live stats), Finance (budget/expense),
   Team (assigned members), Milestones, .env Vault, plus existing tabs
   ────────────────────────────────────────────────────────────── */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getProjectAPI, getProjectTaskStatsAPI, getProjectFinanceAPI, searchEmployeesAPI } from "../../lib/api";
import {
  ArrowLeft, Building, Mail, Phone, DollarSign, Calendar, Loader2, FolderOpen,
  LayoutGrid, ListTodo, Clock, Flag, FileText, MessageCircle, Activity, Lock,
  Users, CheckCircle2, AlertTriangle, XCircle, Play, TrendingUp, Eye, Timer, Edit3
} from "lucide-react";
import PMEnvVault from "./PMEnvVault";
import { ProjectFormModal } from "./ProjectDirectory";
import { AnimatePresence } from "framer-motion";

const tabs = [
  { id: "overview", label: "Overview", icon: <LayoutGrid size={16} /> },
  { id: "tasks", label: "Tasks", icon: <ListTodo size={16} /> },
  { id: "finance", label: "Finance", icon: <DollarSign size={16} /> },
  { id: "team", label: "Team", icon: <Users size={16} /> },
  { id: "milestones", label: "Milestones", icon: <Flag size={16} /> },
  { id: "env", label: ".env Vault", icon: <Lock size={16} /> },
  { id: "files", label: "Files", icon: <FileText size={16} /> },
  { id: "feedback", label: "Feedback", icon: <MessageCircle size={16} /> },
  { id: "activity", label: "Activity Logs", icon: <Activity size={16} /> },
];

// ── Progress Bar ─────────────────────────────────────────────
const ProgressBar: React.FC<{ value: number; label?: string }> = ({ value, label }) => {
  const color = value >= 80 ? "#10b981" : value >= 50 ? "#3b82f6" : value >= 25 ? "#f59e0b" : "#ef4444";
  return (
    <div>
      {label && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 12, color: "#8b949e" }}>{label}</span><span style={{ fontSize: 12, fontWeight: 700, color }}>{value}%</span></div>}
      <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1 }} style={{ height: "100%", borderRadius: 3, background: `linear-gradient(90deg, ${color}, ${color}dd)` }} />
      </div>
    </div>
  );
};

// ── Stat Card ────────────────────────────────────────────────
const StatCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode; color: string }> = ({ label, value, icon, color }) => (
  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: "16px 18px", display: "flex", alignItems: "center", gap: 12 }}>
    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}12`, display: "flex", alignItems: "center", justifyContent: "center", color }}>{icon}</div>
    <div>
      <div style={{ fontSize: 20, fontWeight: 800, color: "#f0f6fc", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: "#6e7681", fontWeight: 600, marginTop: 2 }}>{label}</div>
    </div>
  </div>
);

const ProjectProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [taskStats, setTaskStats] = useState<any>(null);
  const [finance, setFinance] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loadingTab, setLoadingTab] = useState(false);

  useEffect(() => { if (id) fetchProject(id); }, [id]);

  const fetchProject = async (pid: string) => {
    try { setProject(await getProjectAPI(pid)); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  // Load tab data on demand
  useEffect(() => {
    if (!id) return;
    if (activeTab === "tasks" && !taskStats) {
      setLoadingTab(true);
      getProjectTaskStatsAPI(id).then(setTaskStats).catch(console.error).finally(() => setLoadingTab(false));
    }
    if (activeTab === "finance" && !finance) {
      setLoadingTab(true);
      getProjectFinanceAPI(id).then(setFinance).catch(console.error).finally(() => setLoadingTab(false));
    }
    if (activeTab === "team" && employees.length === 0) {
      searchEmployeesAPI().then(setEmployees).catch(console.error);
    }
  }, [activeTab, id]);

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin" size={40} color="#3b82f6" /></div>;
  if (!project) return <div style={{ color: "#fff", padding: 40 }}>Project not found.</div>;

  const teamMembers = (project.team_members || []).map((memberId: string) => employees.find(e => e._id === memberId)).filter(Boolean);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <button onClick={() => navigate("/admin/projects/all")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "#8b949e", cursor: "pointer", marginBottom: 24, fontSize: 14, fontWeight: 500 }}>
        <ArrowLeft size={16} /> Back to Projects
      </button>

      {/* ── Header Card ─────────────────────────────────────── */}
      <div style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: project.status === "Active" ? "#10b981" : "#3b82f6", opacity: 0.04, filter: "blur(60px)" }} />
        <div style={{ display: "flex", gap: 24 }}>
          <div style={{ width: 72, height: 72, borderRadius: 18, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 28, fontWeight: 800 }}>
            {project.name?.charAt(0)}
          </div>
          <div>
            {project.project_id && (
              <span style={{ fontSize: 12, fontWeight: 700, color: "#3b82f6", fontFamily: "monospace", letterSpacing: "0.05em" }}>
                {project.project_id}
              </span>
            )}
            <h2 style={{ fontSize: 26, fontWeight: 800, color: "#f0f6fc", marginTop: 4, display: "flex", alignItems: "center", gap: 12 }}>
              {project.name}
              <span style={{ fontSize: 12, padding: "4px 12px", borderRadius: 20, background: project.status === "Active" ? "rgba(16,185,129,0.12)" : project.status === "Completed" ? "rgba(139,92,246,0.12)" : "rgba(245,158,11,0.12)", color: project.status === "Active" ? "#10b981" : project.status === "Completed" ? "#8b5cf6" : "#f59e0b", fontWeight: 600 }}>
                {project.status}
              </span>
            </h2>
            <div style={{ display: "flex", gap: 20, color: "#8b949e", fontSize: 13, flexWrap: "wrap", marginTop: 6 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Building size={14} /> {project.client_company || project.client_name}</span>
              {project.client_email && <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Mail size={14} /> {project.client_email}</span>}
              {project.client_phone && <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Phone size={14} /> {project.client_phone}</span>}
              {project.category && <span style={{ display: "flex", alignItems: "center", gap: 6 }}><FolderOpen size={14} /> {project.category}</span>}
            </div>
            {project.description && <p style={{ fontSize: 14, color: "#6e7681", marginTop: 8, lineHeight: 1.5, maxWidth: 600 }}>{project.description}</p>}
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
          <button
            onClick={() => setShowEditModal(true)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#3b82f6", cursor: "pointer", fontSize: 13, fontWeight: 700, transition: "all 0.2s" }}
          >
            <Edit3 size={14} /> Edit Project
          </button>
          <div style={{ marginTop: 8 }}>
            <p style={{ fontSize: 24, fontWeight: 800, color: "#10b981" }}>₹{(project.budget || project.cost || 0).toLocaleString("en-IN")}</p>
            <span style={{ fontSize: 12, padding: "4px 12px", borderRadius: 20, background: project.payment_status === "Paid" ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)", color: project.payment_status === "Paid" ? "#10b981" : "#f59e0b", fontWeight: 600, display: "inline-block", marginTop: 4 }}>
              {project.payment_status}
            </span>
          </div>
          <div style={{ marginTop: 12, width: 200 }}>
            <ProgressBar value={project.progress || project.completion_percent || 0} label="Progress" />
          </div>
        </div>
      </div>

      {/* ── Layout ──────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 24 }}>
        {/* Sidebar Tabs */}
        <div style={{ width: 200, display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, fontSize: 14, fontWeight: 500,
              background: activeTab === tab.id ? "rgba(59,130,246,0.12)" : "transparent",
              color: activeTab === tab.id ? "#3b82f6" : "#8b949e",
              border: activeTab === tab.id ? "1px solid rgba(59,130,246,0.2)" : "1px solid transparent",
              cursor: "pointer", textAlign: "left", transition: "all 0.2s"
            }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1 }}>
          {loadingTab && <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Loader2 className="animate-spin" size={32} color="#3b82f6" /></div>}

          {/* ── Overview Tab ──────────────────────────────── */}
          {activeTab === "overview" && !loadingTab && (
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 28 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f0f6fc", marginBottom: 20 }}>Project Overview</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 24 }}>
                <div><p style={{ fontSize: 12, color: "#6e7681", marginBottom: 4 }}>Start Date</p><p style={{ fontSize: 15, color: "#f0f6fc", fontWeight: 600 }}>{project.start_date ? new Date(project.start_date).toLocaleDateString("en-IN") : "Not set"}</p></div>
                <div><p style={{ fontSize: 12, color: "#6e7681", marginBottom: 4 }}>Deadline</p><p style={{ fontSize: 15, color: "#f0f6fc", fontWeight: 600 }}>{project.end_date ? new Date(project.end_date).toLocaleDateString("en-IN") : "Not set"}</p></div>
                <div><p style={{ fontSize: 12, color: "#6e7681", marginBottom: 4 }}>Priority</p><p style={{ fontSize: 15, color: project.priority === "Urgent" ? "#ef4444" : project.priority === "High" ? "#f59e0b" : "#3b82f6", fontWeight: 700 }}>{project.priority || "Medium"}</p></div>
              </div>
              {project.tags && project.tags.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 12, color: "#6e7681", marginBottom: 8 }}>Tags</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {project.tags.map((tag: string) => (
                      <span key={tag} style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", color: "#a78bfa", fontSize: 11, fontWeight: 600 }}>#{tag}</span>
                    ))}
                  </div>
                </div>
              )}
              {project.notes && <div style={{ marginTop: 16 }}><p style={{ fontSize: 12, color: "#6e7681", marginBottom: 6 }}>Notes</p><p style={{ fontSize: 14, color: "#c9d1d9", lineHeight: 1.6 }}>{project.notes}</p></div>}
              {project.deployments?.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: "#f0f6fc", marginBottom: 12 }}>Deployments</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {project.deployments.map((dep: any) => (
                      <div key={dep.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.04)" }}>
                        <span style={{ color: "#c9d1d9", fontSize: 14, fontWeight: 500 }}>{dep.service_name} — <span style={{ color: "#8b949e" }}>{dep.platform}</span></span>
                        {dep.url && <a href={dep.url} target="_blank" rel="noreferrer" style={{ color: "#3b82f6", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Visit →</a>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Tasks Tab ─────────────────────────────────── */}
          {activeTab === "tasks" && !loadingTab && taskStats && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, marginBottom: 20 }}>
                <StatCard label="Total" value={taskStats.total} icon={<ListTodo size={16} />} color="#3b82f6" />
                <StatCard label="Pending" value={taskStats.pending} icon={<Clock size={16} />} color="#9ca3af" />
                <StatCard label="In Progress" value={taskStats.in_progress} icon={<Play size={16} />} color="#3b82f6" />
                <StatCard label="Review" value={taskStats.review} icon={<Eye size={16} />} color="#a855f7" />
                <StatCard label="Completed" value={taskStats.completed} icon={<CheckCircle2 size={16} />} color="#10b981" />
                <StatCard label="Blocked" value={taskStats.blocked} icon={<XCircle size={16} />} color="#ef4444" />
                <StatCard label="Overdue" value={taskStats.overdue} icon={<AlertTriangle size={16} />} color="#f59e0b" />
              </div>
              <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                <StatCard label="Est. Hours" value={taskStats.total_estimated_hours} icon={<Timer size={16} />} color="#06b6d4" />
                <StatCard label="Actual Hours" value={taskStats.total_actual_hours} icon={<Timer size={16} />} color="#ec4899" />
              </div>

              {/* Task List */}
              {taskStats.tasks && taskStats.tasks.length > 0 && (
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden" }}>
                  {taskStats.tasks.map((t: any, i: number) => (
                    <div key={t._id || i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#10b981", fontFamily: "monospace" }}>{t.task_id || "—"}</span>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "#f0f6fc", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</span>
                      </div>
                      <div style={{ display: "flex", gap: 12, alignItems: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 4, background: t.status === "Completed" ? "rgba(16,185,129,0.12)" : t.status === "In Progress" ? "rgba(59,130,246,0.12)" : "rgba(107,114,128,0.12)", color: t.status === "Completed" ? "#10b981" : t.status === "In Progress" ? "#3b82f6" : "#9ca3af", fontWeight: 600 }}>
                          {t.status}
                        </span>
                        <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 4, background: t.priority === "Urgent" ? "rgba(239,68,68,0.12)" : t.priority === "High" ? "rgba(245,158,11,0.12)" : "rgba(59,130,246,0.12)", color: t.priority === "Urgent" ? "#ef4444" : t.priority === "High" ? "#f59e0b" : "#3b82f6", fontWeight: 600 }}>
                          {t.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Finance Tab ───────────────────────────────── */}
          {activeTab === "finance" && !loadingTab && finance && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 20 }}>
                <StatCard label="Budget" value={`₹${(finance.budget / 1000).toFixed(0)}K`} icon={<DollarSign size={16} />} color="#3b82f6" />
                <StatCard label="Invoiced" value={`₹${(finance.total_invoiced / 1000).toFixed(0)}K`} icon={<FileText size={16} />} color="#8b5cf6" />
                <StatCard label="Paid" value={`₹${(finance.total_paid / 1000).toFixed(0)}K`} icon={<CheckCircle2 size={16} />} color="#10b981" />
                <StatCard label="Expenses" value={`₹${(finance.total_expenses / 1000).toFixed(0)}K`} icon={<TrendingUp size={16} />} color="#f59e0b" />
                <StatCard label="Outstanding" value={`₹${(finance.outstanding / 1000).toFixed(0)}K`} icon={<AlertTriangle size={16} />} color="#ef4444" />
                <StatCard label="Profit" value={`₹${(finance.profit / 1000).toFixed(0)}K`} icon={<DollarSign size={16} />} color={finance.profit >= 0 ? "#10b981" : "#ef4444"} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <ProgressBar value={finance.budget_utilization || 0} label="Budget Utilization" />
              </div>

              {/* Invoices List */}
              {finance.invoices && finance.invoices.length > 0 && (
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 20, marginTop: 16 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: "#f0f6fc", marginBottom: 12 }}>Invoices</h4>
                  {finance.invoices.map((inv: any, i: number) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                      <span style={{ fontSize: 13, color: "#c9d1d9" }}>{inv.invoice_number}</span>
                      <span style={{ fontSize: 13, color: "#f0f6fc", fontWeight: 600 }}>₹{(inv.total || 0).toLocaleString("en-IN")}</span>
                      <span style={{ fontSize: 12, color: inv.status === "paid" ? "#10b981" : "#f59e0b", fontWeight: 600 }}>{inv.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Team Tab ──────────────────────────────────── */}
          {activeTab === "team" && !loadingTab && (
            <div>
              {project.project_manager && (
                <div style={{ marginBottom: 20, padding: 20, background: "rgba(59,130,246,0.04)", border: "1px solid rgba(59,130,246,0.12)", borderRadius: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6", textTransform: "uppercase", marginBottom: 8 }}>Project Manager</div>
                  {(() => {
                    const pm = employees.find(e => e._id === project.project_manager);
                    return pm ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16, fontWeight: 700 }}>{pm.full_name?.charAt(0)}</div>
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: "#f0f6fc" }}>{pm.full_name}</div>
                          <div style={{ fontSize: 12, color: "#8b949e" }}>{pm.employee_id && <span style={{ fontFamily: "monospace", color: "#3b82f6" }}>{pm.employee_id} • </span>}{pm.position || "Staff"} • {pm.email}</div>
                        </div>
                      </div>
                    ) : <span style={{ color: "#6e7681", fontSize: 13 }}>Not assigned</span>;
                  })()}
                </div>
              )}

              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#f0f6fc", marginBottom: 12 }}>Team Members ({project.team_members?.length || 0})</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
                {teamMembers.map((emp: any) => (
                  <div key={emp._id} style={{ padding: 18, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: `hsl(${(emp.full_name?.charCodeAt(0) || 0) * 5 % 360}, 50%, 45%)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 15, fontWeight: 700 }}>
                      {emp.full_name?.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#f0f6fc" }}>{emp.full_name}</div>
                      <div style={{ fontSize: 11, color: "#6e7681" }}>
                        {emp.employee_id && <span style={{ fontFamily: "monospace", color: "#3b82f6" }}>{emp.employee_id} • </span>}
                        {emp.position || "Staff"}
                      </div>
                    </div>
                  </div>
                ))}
                {teamMembers.length === 0 && <p style={{ color: "#6e7681", fontSize: 13, padding: 20 }}>No team members assigned to this project.</p>}
              </div>
            </div>
          )}

          {/* ── Milestones Tab ────────────────────────────── */}
          {activeTab === "milestones" && !loadingTab && (
            <div>
              {project.milestones && project.milestones.length > 0 ? (
                <div style={{ position: "relative", paddingLeft: 24 }}>
                  {/* Vertical timeline line */}
                  <div style={{ position: "absolute", left: 11, top: 8, bottom: 8, width: 2, background: "rgba(255,255,255,0.06)" }} />
                  {project.milestones.map((ms: any, i: number) => {
                    const statusColor = ms.status === "Completed" ? "#10b981" : ms.status === "In Progress" ? "#3b82f6" : ms.status === "Delayed" ? "#ef4444" : "#6b7280";
                    return (
                      <div key={ms.id || i} style={{ position: "relative", marginBottom: 20, paddingLeft: 24 }}>
                        <div style={{ position: "absolute", left: -14, top: 6, width: 12, height: 12, borderRadius: "50%", background: statusColor, border: "2px solid #0d1117", zIndex: 1 }} />
                        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: 18 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                            <h4 style={{ fontSize: 15, fontWeight: 700, color: "#f0f6fc" }}>{ms.title}</h4>
                            <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, background: `${statusColor}15`, color: statusColor, fontWeight: 700 }}>{ms.status}</span>
                          </div>
                          {ms.description && <p style={{ fontSize: 13, color: "#8b949e", marginBottom: 8 }}>{ms.description}</p>}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 12, color: "#6e7681" }}>{ms.due_date ? new Date(ms.due_date).toLocaleDateString("en-IN") : "No deadline"}</span>
                            <ProgressBar value={ms.completion_pct || 0} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: 60, color: "#6e7681" }}>
                  <Flag size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
                  <p style={{ fontSize: 14, fontWeight: 500 }}>No milestones defined</p>
                </div>
              )}
            </div>
          )}

          {/* ── .env Vault Tab ────────────────────────────── */}
          {activeTab === "env" && <PMEnvVault />}

          {/* ── Other tabs (files, feedback, activity, timeline) — placeholder ── */}
          {!["overview", "tasks", "finance", "team", "milestones", "env"].includes(activeTab) && !loadingTab && (
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24, minHeight: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ color: "#6e7681", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <FolderOpen size={32} style={{ opacity: 0.4 }} />
                {tabs.find(t => t.id === activeTab)?.label} module is active. No records found.
              </p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showEditModal && project && (
          <ProjectFormModal
            isOpen={true}
            onClose={() => setShowEditModal(false)}
            project={project}
            onSuccess={() => {
              setShowEditModal(false);
              fetchProject(id!);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectProfile;
