/* ──────────────────────────────────────────────────────────────
   ULMiND Admin — Employee Directory
   Original premium team card UI - fully preserved
   ────────────────────────────────────────────────────────────── */

import React, { useState, useEffect } from "react";
import {
  ShieldCheck, Plus, X, Loader2, Edit2, Trash2, Mail, User, Shield, KeyRound, Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AdminUser,
  listTeamAPI,
  createTeamMemberAPI,
  updateTeamMemberAPI,
  deleteTeamMemberAPI,
  createDeleteRequestAPI
} from "../../lib/api";
import { useAuth } from "../../context/auth-context";
import { useAdminAction } from "../../context/AdminActionContext";

type PanelMode = "add" | "edit" | null;

const EmployeeDirectory: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { triggerActionAnimation } = useAdminAction();
  
  const [team, setTeam] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [panelMode, setPanelMode] = useState<PanelMode>(null);
  const [selectedMember, setSelectedMember] = useState<AdminUser | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("editor");
  const [status, setStatus] = useState("Active");
  const [initialPassword, setInitialPassword] = useState("");
  const [position, setPosition] = useState("");

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchTeam = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await listTeamAPI();
      setTeam(data);
    } catch (err: any) {
      setError(err.message || "Failed to load team data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTeam(); }, []);

  const openAddPanel = () => {
    setPanelMode("add");
    setSelectedMember(null);
    setFullName(""); setEmail(""); setRole("editor"); setStatus("Active"); setInitialPassword(""); setPosition(""); setFormError("");
  };

  const openEditPanel = (member: AdminUser) => {
    setPanelMode("edit");
    setSelectedMember(member);
    setFullName(member.full_name || ""); setEmail(member.email || ""); setRole(member.role?.toLowerCase() || "editor");
    setStatus(member.status || "Active"); setInitialPassword(""); setPosition(member.position || ""); setFormError("");
  };

  const closePanel = () => { setPanelMode(null); setSelectedMember(null); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true); setFormError("");
    try {
      if (panelMode === "add") {
        await createTeamMemberAPI({ full_name: fullName, email, role, initial_password: initialPassword, position });
      } else if (panelMode === "edit" && selectedMember) {
        await updateTeamMemberAPI(selectedMember._id, { full_name: fullName, email, role, status, position });
      }
      await fetchTeam();
      closePanel();
      triggerActionAnimation();
    } catch (err: any) {
      setFormError(err.message || "Action failed");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (id === currentUser?._id) { alert("You cannot delete yourself!"); return; }
    
    const isSuperAdmin = currentUser?.role?.toLowerCase() === "super_admin";
    
    if (isSuperAdmin) {
      if (!window.confirm(`Are you sure you want to permanently delete ${name}?`)) return;
      try {
        await deleteTeamMemberAPI(id);
        await fetchTeam();
        triggerActionAnimation('delete');
      } catch (err: any) {
        alert(err.message || "Failed to delete user");
      }
    } else {
      if (!window.confirm(`You don't have permission to delete. Send a deletion request for ${name} to the Super Admin?`)) return;
      try {
        await createDeleteRequestAPI({
          item_type: "Team Member",
          item_description: name,
          endpoint: `/team/${id}`
        });
        alert("Deletion request sent successfully to Super Admin.");
      } catch (err: any) {
        alert(err.message || "Failed to send deletion request");
      }
    }
  };

  const inputStyle = { position: "relative" as const, display: "flex", alignItems: "center" };
  const iconAdornment = { position: "absolute" as const, left: 14, color: "#64748b", pointerEvents: "none" as const };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} style={{ position: "relative", minHeight: "100%", paddingBottom: 40 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#ffffff", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.02em" }}>Employee Directory</h2>
          <p style={{ fontSize: 14, color: "#94a3b8", marginTop: 6 }}>Add and manage internal staff access</p>
        </div>
        <button onClick={openAddPanel} className="admin-btn" style={{ background: "var(--admin-accent)", color: "white", padding: "10px 20px", display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
          <Plus size={18} /> Add Member
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 64 }}><Loader2 size={32} className="animate-spin text-foreground/40" /></div>
      ) : error ? (
        <div style={{ padding: 24, background: "rgba(225,29,72,0.1)", border: "1px solid rgba(225,29,72,0.3)", borderRadius: 12, color: "#f87171" }}>{error}</div>
      ) : (
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24, padding: "4px" }}>
          {team.map((member) => (
            <motion.div
              key={member._id}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.6), 0 0 30px rgba(225, 29, 72, 0.15)", borderColor: "rgba(225, 29, 72, 0.4)", background: "rgba(25, 20, 22, 0.85)" }}
              className="admin-card"
              style={{ position: "relative", padding: 28, display: "flex", flexDirection: "column", gap: 20, background: "rgba(20, 18, 20, 0.7)", backdropFilter: "blur(24px)", border: "1px solid rgba(225, 29, 72, 0.15)", borderRadius: 24, overflow: "hidden", transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}
            >
              <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "linear-gradient(135deg, #e11d48, #9f1239)", opacity: member.role?.toLowerCase() === "admin" || member.role?.toLowerCase() === "super_admin" ? 0.25 : 0.15, filter: "blur(60px)", pointerEvents: "none" }} className="glow-effect" />
              <div style={{ position: "absolute", bottom: -50, left: -30, width: 150, height: 150, borderRadius: "50%", background: "linear-gradient(135deg, #f43f5e, #be123c)", opacity: 0.1, filter: "blur(50px)", pointerEvents: "none" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", zIndex: 1 }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  {member.profile_photo?.url ? (
                    <div style={{ position: "relative", width: 64, height: 64 }}>
                      <div style={{ position: "absolute", inset: -3, background: "linear-gradient(135deg, #f43f5e, #9f1239)", borderRadius: "50%", zIndex: 0, opacity: 0.8, filter: "blur(4px)" }} />
                      <img src={member.profile_photo.url} alt={member.email} style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", position: "relative", zIndex: 1, border: "2px solid #2a1b1f" }} />
                    </div>
                  ) : (
                    <div style={{ position: "relative", width: 64, height: 64 }}>
                      <div style={{ position: "absolute", inset: -3, background: "linear-gradient(135deg, #f43f5e, #9f1239)", borderRadius: "50%", zIndex: 0, opacity: 0.8, filter: "blur(4px)" }} />
                      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #be123c, #881337)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 24, fontWeight: 800, position: "relative", zIndex: 1, border: "2px solid #2a1b1f", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
                        {member.email.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  )}
                  <div style={{ position: "absolute", bottom: 2, right: 2, width: 16, height: 16, borderRadius: "50%", background: member.status === "Active" ? "#10b981" : "#f43f5e", border: "3px solid #2a1b1f", boxShadow: `0 0 12px ${member.status === "Active" ? "rgba(16,185,129,0.6)" : "rgba(244,63,94,0.6)"}`, zIndex: 2 }} title={member.status} />
                </div>
                <div style={{ padding: "6px 12px", borderRadius: 12, background: member.role?.toLowerCase() === "super_admin" ? "rgba(16, 185, 129, 0.15)" : member.role?.toLowerCase() === "admin" ? "rgba(225, 29, 72, 0.15)" : "rgba(255, 255, 255, 0.05)", border: `1px solid ${member.role?.toLowerCase() === "super_admin" ? "rgba(16, 185, 129, 0.4)" : member.role?.toLowerCase() === "admin" ? "rgba(225, 29, 72, 0.4)" : "rgba(255, 255, 255, 0.15)"}`, display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                  <ShieldCheck size={14} color={member.role?.toLowerCase() === "super_admin" ? "#34d399" : member.role?.toLowerCase() === "admin" ? "#fb7185" : "#e2e8f0"} />
                  <span style={{ fontSize: 11, fontWeight: 800, color: member.role?.toLowerCase() === "super_admin" ? "#34d399" : member.role?.toLowerCase() === "admin" ? "#fb7185" : "#e2e8f0", textTransform: "uppercase", letterSpacing: "0.08em" }}>{member.role?.toUpperCase() || "EDITOR"}</span>
                </div>
              </div>

              <div style={{ minWidth: 0, width: "100%", zIndex: 1, marginTop: -8 }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", letterSpacing: "-0.01em", marginBottom: 4 }}>{member.full_name || "—"}</h3>
                <p style={{ fontSize: 14, color: "#cbd5e1", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: 500 }}>{member.email}</p>
                {member._id === currentUser?._id && <span style={{ display: "inline-block", marginTop: 12, fontSize: 10, padding: "3px 8px", background: "rgba(225, 29, 72, 0.2)", border: "1px solid rgba(225, 29, 72, 0.4)", borderRadius: 12, color: "#fda4af", fontWeight: 800, letterSpacing: "0.05em" }}>YOU</span>}
              </div>

              <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(225,29,72,0.3), transparent)", margin: "4px 0", opacity: 0.5 }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 1 }}>
                <div>
                  <p style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.08em" }}>Position</p>
                  <p style={{ fontSize: 15, color: "#f8fafc", fontWeight: 600, marginTop: 4 }}>{member.position || "Staff Member"}</p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => openEditPanel(member)} className="admin-btn-ghost" style={{ width: 40, height: 40, padding: 0, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", color: "#e2e8f0" }} title="Edit">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(member._id, member.full_name || member.email)} style={{ width: 40, height: 40, padding: 0, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "#fda4af", border: "1px solid rgba(225,29,72,0.3)", background: "rgba(225,29,72,0.1)", transition: "all 0.2s", opacity: member._id === currentUser?._id ? 0.3 : 1, cursor: member._id === currentUser?._id ? "not-allowed" : "pointer" }} title="Delete" disabled={member._id === currentUser?._id}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Sliding Side Panel */}
      <AnimatePresence>
        {panelMode && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closePanel} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", zIndex: 100 }} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "100%", maxWidth: 500, background: "rgba(20, 20, 22, 0.95)", backdropFilter: "blur(40px)", borderLeft: "1px solid rgba(255, 255, 255, 0.1)", zIndex: 101, boxShadow: "-20px 0 60px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "24px 32px", borderBottom: "1px solid var(--admin-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: "var(--admin-text)" }}>{panelMode === "add" ? "Add New Member" : "Edit Member"}</h3>
                <button onClick={closePanel} style={{ background: "none", border: "none", color: "var(--admin-text-dim)", cursor: "pointer", padding: 8, borderRadius: "50%" }}><X size={20} /></button>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
                {formError && <div style={{ background: "rgba(225, 29, 72, 0.1)", border: "1px solid rgba(225, 29, 72, 0.3)", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#f87171", marginBottom: 24 }}>{formError}</div>}
                <form id="team-form" onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 8, textTransform: "uppercase" }}>Email Address *</label>
                    <div style={inputStyle}>
                      <Mail size={16} style={iconAdornment} />
                      <input type="email" required className="admin-input" placeholder="user@ulmind.com" value={email} onChange={e => setEmail(e.target.value)} style={{ paddingLeft: 42, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)" }} disabled={panelMode === "edit"} />
                    </div>
                    {panelMode === "edit" && <p style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>Email cannot be changed after creation.</p>}
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 8, textTransform: "uppercase" }}>Full Name</label>
                    <div style={inputStyle}>
                      <User size={16} style={iconAdornment} />
                      <input type="text" className="admin-input" placeholder="John Doe" value={fullName} onChange={e => setFullName(e.target.value)} style={{ paddingLeft: 42, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)" }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 8, textTransform: "uppercase" }}>Internal Position</label>
                    <div style={inputStyle}>
                      <Briefcase size={16} style={iconAdornment} />
                      <input type="text" className="admin-input" placeholder="e.g. Content Writer" value={position} onChange={e => setPosition(e.target.value)} style={{ paddingLeft: 42, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)" }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 8, textTransform: "uppercase" }}>Access Role</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                      <button type="button" onClick={() => setRole("editor")} style={{ padding: "12px", borderRadius: 12, border: role === "editor" ? "1px solid rgba(56, 189, 248, 0.5)" : "1px solid rgba(255,255,255,0.1)", background: role === "editor" ? "rgba(56,189,248,0.1)" : "rgba(0,0,0,0.2)", textAlign: "left", cursor: "pointer", transition: "all 0.2s" }}>
                        <div style={{ fontWeight: 600, color: role === "editor" ? "#38bdf8" : "#e2e8f0", fontSize: 14 }}>Editor</div>
                        <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>Can edit articles & meta.</div>
                      </button>
                      <button type="button" onClick={() => setRole("admin")} style={{ padding: "12px", borderRadius: 12, border: role === "admin" ? "1px solid rgba(248, 113, 113, 0.5)" : "1px solid rgba(255,255,255,0.1)", background: role === "admin" ? "rgba(248,113,113,0.1)" : "rgba(0,0,0,0.2)", textAlign: "left", cursor: "pointer", transition: "all 0.2s" }}>
                        <div style={{ fontWeight: 600, color: role === "admin" ? "#f87171" : "#e2e8f0", fontSize: 14 }}>Admin</div>
                        <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>Full system access.</div>
                      </button>
                      <button type="button" onClick={() => setRole("super_admin")} style={{ padding: "12px", borderRadius: 12, border: role === "super_admin" ? "1px solid rgba(16, 185, 129, 0.5)" : "1px solid rgba(255,255,255,0.1)", background: role === "super_admin" ? "rgba(16, 185, 129, 0.1)" : "rgba(0,0,0,0.2)", textAlign: "left", cursor: "pointer", transition: "all 0.2s" }}>
                        <div style={{ fontWeight: 600, color: role === "super_admin" ? "#34d399" : "#e2e8f0", fontSize: 14 }}>Super Admin</div>
                        <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>Founders only.</div>
                      </button>
                    </div>
                  </div>
                  {panelMode === "add" && (
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 8, textTransform: "uppercase" }}>Temporary Password *</label>
                      <div style={inputStyle}>
                        <KeyRound size={16} style={iconAdornment} />
                        <input type="text" required minLength={6} className="admin-input" placeholder="Provides temporary access" value={initialPassword} onChange={e => setInitialPassword(e.target.value)} style={{ paddingLeft: 42, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)" }} />
                      </div>
                    </div>
                  )}
                  {panelMode === "edit" && (
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 8, textTransform: "uppercase" }}>Account Status</label>
                      <select className="admin-input" value={status} onChange={e => setStatus(e.target.value)} style={{ cursor: "pointer", WebkitAppearance: "menulist", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <option value="Active">Active (Permitted)</option>
                        <option value="Revoked">Revoked (Blocked)</option>
                      </select>
                    </div>
                  )}
                </form>
              </div>
              <div style={{ padding: "24px 32px", borderTop: "1px solid rgba(255, 255, 255, 0.05)", background: "rgba(0,0,0,0.2)", display: "flex", justifyContent: "flex-end", gap: 12 }}>
                <button type="button" onClick={closePanel} className="admin-btn admin-btn-ghost" disabled={formLoading}>Cancel</button>
                <button type="submit" form="team-form" className="admin-btn admin-btn-primary" disabled={formLoading} style={{ padding: "10px 24px" }}>
                  {formLoading ? <Loader2 size={16} className="animate-spin" /> : (panelMode === "add" ? "Create Member" : "Save Changes")}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EmployeeDirectory;
