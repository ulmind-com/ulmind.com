import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getProjectAPI } from "../../lib/api";
import { ArrowLeft, Building, Mail, Phone, DollarSign, Calendar, Loader2, FolderOpen, LayoutGrid, ListTodo, Clock, Flag, FileText, MessageCircle, Activity, Lock } from "lucide-react";
import PMEnvVault from "./PMEnvVault";

const tabs = [
  { id: "overview", label: "Overview", icon: <LayoutGrid size={16} /> },
  { id: "tasks", label: "Tasks", icon: <ListTodo size={16} /> },
  { id: "timeline", label: "Timeline", icon: <Clock size={16} /> },
  { id: "milestones", label: "Milestones", icon: <Flag size={16} /> },
  { id: "files", label: "Files", icon: <FileText size={16} /> },
  { id: "budget", label: "Budget", icon: <DollarSign size={16} /> },
  { id: "env", label: ".env Vault", icon: <Lock size={16} /> },
  { id: "feedback", label: "Feedback", icon: <MessageCircle size={16} /> },
  { id: "activity", label: "Activity Logs", icon: <Activity size={16} /> },
];

const ProjectProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => { if (id) fetchProject(id); }, [id]);

  const fetchProject = async (pid: string) => {
    try { setProject(await getProjectAPI(pid)); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin" size={40} color="#64748b" /></div>;
  if (!project) return <div style={{ color: "#fff", padding: 40 }}>Project not found.</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <button onClick={() => navigate("/admin/projects/all")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "#94a3b8", cursor: "pointer", marginBottom: 24, fontSize: 14 }}>
        <ArrowLeft size={16} /> Back to Projects
      </button>

      {/* Header Card */}
      <div className="admin-glass-panel" style={{ padding: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 24 }}>
          <div style={{ width: 72, height: 72, borderRadius: 16, background: "linear-gradient(135deg, #06b6d4, #a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 28, fontWeight: 700 }}>
            {project.name?.charAt(0)}
          </div>
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
              {project.name}
              <span className={`admin-badge ${project.status === "Active" ? "admin-badge-success" : project.status === "Completed" ? "admin-badge-primary" : "admin-badge-warning"}`} style={{ fontSize: 12, padding: "4px 8px" }}>{project.status}</span>
            </h2>
            <div style={{ display: "flex", gap: 16, color: "#94a3b8", fontSize: 14, flexWrap: "wrap" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Building size={14} /> {project.client_company || project.client_name}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Mail size={14} /> {project.client_email}</span>
              {project.client_phone && <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Phone size={14} /> {project.client_phone}</span>}
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: 24, fontWeight: 700, color: "#10b981" }}>${project.cost?.toLocaleString()}</p>
          <span className={`admin-badge ${project.payment_status === "Paid" ? "admin-badge-success" : "admin-badge-warning"}`} style={{ fontSize: 12, marginTop: 8, display: "inline-block" }}>{project.payment_status}</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ width: 200, display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 8, fontSize: 14, fontWeight: 500,
              background: activeTab === tab.id ? "rgba(56, 189, 248, 0.15)" : "transparent", color: activeTab === tab.id ? "#fff" : "#94a3b8",
              border: "none", cursor: "pointer", textAlign: "left", transition: "all 0.2s"
            }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }}>
          {activeTab === "overview" && (
            <div className="admin-glass-panel" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "#fff", marginBottom: 20 }}>Project Overview</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
                <div><p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 4 }}>Start Date</p><p style={{ fontSize: 15, color: "#fff", fontWeight: 500 }}>{project.start_date ? new Date(project.start_date).toLocaleDateString() : "Not set"}</p></div>
                <div><p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 4 }}>End Date</p><p style={{ fontSize: 15, color: "#fff", fontWeight: 500 }}>{project.end_date ? new Date(project.end_date).toLocaleDateString() : "Not set"}</p></div>
                <div><p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 4 }}>Currency</p><p style={{ fontSize: 15, color: "#fff", fontWeight: 500 }}>{project.currency}</p></div>
              </div>
              {project.notes && <div style={{ marginTop: 24 }}><p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 4 }}>Notes</p><p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.6 }}>{project.notes}</p></div>}
              {project.deployments?.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 12 }}>Deployments</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {project.deployments.map((dep: any) => (
                      <div key={dep.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
                        <span style={{ color: "#cbd5e1", fontSize: 14 }}>{dep.service_name} — {dep.platform}</span>
                        {dep.url && <a href={dep.url} target="_blank" rel="noreferrer" style={{ color: "#38bdf8", fontSize: 13 }}>Visit</a>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === "env" && (
            <PMEnvVault />
          )}
          {activeTab !== "overview" && activeTab !== "env" && (
            <div className="admin-glass-panel" style={{ padding: 24, minHeight: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ color: "#64748b", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <FolderOpen size={32} opacity={0.5} />
                {tabs.find(t => t.id === activeTab)?.label} module is active. No records found.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectProfile;
