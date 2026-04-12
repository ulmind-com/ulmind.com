/* ──────────────────────────────────────────────────────────────
   ULMiND Admin — Team Management Page
   List, Create, Update, Delete team members with an OP Side Panel
   ────────────────────────────────────────────────────────────── */

import React, { useState, useEffect } from "react";
import {
  ShieldCheck, Plus, X, Loader2, Edit2, Trash2, Mail, User, Shield, KeyRound, Briefcase
} from "lucide-react";
import {
  AdminUser,
  listTeamAPI,
  createTeamMemberAPI,
  updateTeamMemberAPI,
  deleteTeamMemberAPI
} from "../lib/api";
import { useAuth } from "../context/auth-context";

type PanelMode = "add" | "edit" | null;

const TeamPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  
  // Data State
  const [team, setTeam] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Panel State
  const [panelMode, setPanelMode] = useState<PanelMode>(null);
  const [selectedMember, setSelectedMember] = useState<AdminUser | null>(null);

  // Form State
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

  useEffect(() => {
    fetchTeam();
  }, []);

  const openAddPanel = () => {
    setPanelMode("add");
    setSelectedMember(null);
    setFullName("");
    setEmail("");
    setRole("editor");
    setStatus("Active");
    setInitialPassword("");
    setPosition("");
    setFormError("");
  };

  const openEditPanel = (member: AdminUser) => {
    setPanelMode("edit");
    setSelectedMember(member);
    setFullName(member.full_name || "");
    setEmail(member.email || "");
    setRole(member.role || "editor");
    setStatus(member.status || "Active");
    setInitialPassword(""); // Password cannot be viewed, only changed (or omitted on edit)
    setPosition(member.position || "");
    setFormError("");
  };

  const closePanel = () => {
    setPanelMode(null);
    setSelectedMember(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    try {
      if (panelMode === "add") {
        await createTeamMemberAPI({
          full_name: fullName,
          email,
          role,
          initial_password: initialPassword,
          position
        });
      } else if (panelMode === "edit" && selectedMember) {
        await updateTeamMemberAPI(selectedMember._id, {
          full_name: fullName,
          email,
          role,
          status,
          position
        });
      }
      await fetchTeam();
      closePanel();
    } catch (err: any) {
      setFormError(err.message || "Action failed");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (id === currentUser?._id) {
      alert("You cannot delete yourself!");
      return;
    }
    if (!window.confirm(`Are you sure you want to permanently delete ${name}?`)) return;

    try {
      await deleteTeamMemberAPI(id);
      await fetchTeam();
    } catch (err: any) {
      alert(err.message || "Failed to delete user");
    }
  };

  const inputStyle = {
    position: "relative" as const,
    display: "flex",
    alignItems: "center"
  };
  const iconAdornment = {
    position: "absolute" as const,
    left: 14,
    color: "#64748b",
    pointerEvents: "none" as const,
  };

  return (
    <div style={{ position: "relative", minHeight: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "var(--admin-text)", fontFamily: "'Inter', sans-serif" }}>
            Team Management
          </h2>
          <p style={{ fontSize: 14, color: "var(--admin-text-dim)", marginTop: 6 }}>
            Add and manage internal staff access
          </p>
        </div>

        <button 
          onClick={openAddPanel}
          className="admin-btn" 
          style={{ background: "var(--admin-accent)", color: "white", padding: "10px 20px", display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}
        >
          <Plus size={18} /> Add Member
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 64 }}>
          <Loader2 size={32} className="animate-spin text-foreground/40" />
        </div>
      ) : error ? (
        <div style={{ padding: 24, background: "rgba(225,29,72,0.1)", border: "1px solid rgba(225,29,72,0.3)", borderRadius: 12, color: "#f87171" }}>
          {error}
        </div>
      ) : (
        <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid var(--admin-border)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--admin-text-dim)" }}>
                  <th style={{ padding: "16px 24px", fontWeight: 600 }}>Member</th>
                  <th style={{ padding: "16px 24px", fontWeight: 600 }}>Position</th>
                  <th style={{ padding: "16px 24px", fontWeight: 600 }}>Role</th>
                  <th style={{ padding: "16px 24px", fontWeight: 600 }}>Status</th>
                  <th style={{ padding: "16px 24px", fontWeight: 600, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {team.map((member) => (
                  <tr key={member._id} style={{ borderBottom: "1px solid var(--admin-border)", transition: "background 0.2s" }} className="hover:bg-white/5">
                    
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        {member.profile_photo?.url ? (
                          <img src={member.profile_photo.url} alt={member.email} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.1)" }} />
                        ) : (
                          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 18, fontWeight: 600 }}>
                            {member.email.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--admin-text)" }}>
                            {member.full_name || "—"}
                            {member._id === currentUser?._id && <span style={{ marginLeft: 8, fontSize: 10, padding: "2px 6px", background: "rgba(255,255,255,0.1)", borderRadius: 4, color: "var(--admin-text-dim)" }}>YOU</span>}
                          </div>
                          <div style={{ fontSize: 12, color: "var(--admin-text-muted)", marginTop: 2 }}>{member.email}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: "16px 24px", fontSize: 13, color: "var(--admin-text-dim)" }}>
                      {member.position || "—"}
                    </td>

                    <td style={{ padding: "16px 24px" }}>
                      <span style={{ 
                        fontSize: 12, padding: "4px 10px", borderRadius: 20, fontWeight: 600, textTransform: "capitalize",
                        background: member.role === "admin" ? "rgba(124, 58, 237, 0.15)" : "rgba(56, 189, 248, 0.15)",
                        color: member.role === "admin" ? "#a78bfa" : "#7dd3fc"
                      }}>
                        <ShieldCheck size={12} style={{ display: "inline", marginRight: 4, marginBottom: 2 }} />
                        {member.role}
                      </span>
                    </td>

                    <td style={{ padding: "16px 24px" }}>
                      <span className={`admin-badge ${member.status === "Active" ? "admin-badge-success" : "admin-badge-warning"}`}>
                        {member.status}
                      </span>
                    </td>

                    <td style={{ padding: "16px 24px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <button 
                          onClick={() => openEditPanel(member)}
                          style={{ background: "rgba(255,255,255,0.05)", border: "none", width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--admin-text-dim)", transition: "all 0.2s" }}
                          className="hover:bg-white/10 hover:text-white"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(member._id, member.full_name || member.email)}
                          style={{ background: "rgba(225,29,72,0.1)", border: "none", width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#f87171", transition: "all 0.2s" }}
                          className="hover:opacity-80"
                          title="Delete"
                          disabled={member._id === currentUser?._id}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* ── Sliding Side Panel Overlay ── */}
      {panelMode && (
        <>
          <div 
            onClick={closePanel}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 100, animation: "fadeIn 0.2s ease" }}
            className="animate-in fade-in duration-200"
          />
          
          <div 
            style={{ 
              position: "fixed", top: 0, right: 0, bottom: 0, width: "100%", maxWidth: 500, 
              background: "var(--admin-bg-card)", borderLeft: "1px solid var(--admin-border)", 
              zIndex: 101, boxShadow: "-10px 0 40px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column",
              animation: "slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
            className="animate-in slide-in-from-right duration-300"
          >
            {/* Panel Header */}
            <div style={{ padding: "24px 32px", borderBottom: "1px solid var(--admin-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: "var(--admin-text)" }}>
                {panelMode === "add" ? "Add New Member" : "Edit Member"}
              </h3>
              <button 
                onClick={closePanel}
                style={{ background: "none", border: "none", color: "var(--admin-text-dim)", cursor: "pointer", padding: 8, borderRadius: "50%", transition: "all 0.2s" }}
                className="hover:bg-white/5 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Panel Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
              {formError && (
                <div style={{ background: "rgba(225, 29, 72, 0.1)", border: "1px solid rgba(225, 29, 72, 0.3)", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#f87171", marginBottom: 24 }}>
                  {formError}
                </div>
              )}

              <form id="team-form" onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                
                {/* Email (Required) */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 8, textTransform: "uppercase" }}>Email Address *</label>
                  <div style={inputStyle}>
                    <Mail size={16} style={iconAdornment} />
                    <input type="email" required className="admin-input" placeholder="user@ulmind.com" value={email} onChange={e => setEmail(e.target.value)} style={{ paddingLeft: 42 }} disabled={panelMode === "edit"} />
                  </div>
                  {panelMode === "edit" && <p style={{ fontSize: 11, color: "var(--admin-text-muted)", marginTop: 4 }}>Email cannot be changed after creation.</p>}
                </div>

                {/* Full Name */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 8, textTransform: "uppercase" }}>Full Name</label>
                  <div style={inputStyle}>
                    <User size={16} style={iconAdornment} />
                    <input type="text" className="admin-input" placeholder="John Doe" value={fullName} onChange={e => setFullName(e.target.value)} style={{ paddingLeft: 42 }} />
                  </div>
                </div>

                {/* Position */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 8, textTransform: "uppercase" }}>Internal Position</label>
                  <div style={inputStyle}>
                    <Briefcase size={16} style={iconAdornment} />
                    <input type="text" className="admin-input" placeholder="e.g. Content Writer" value={position} onChange={e => setPosition(e.target.value)} style={{ paddingLeft: 42 }} />
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 8, textTransform: "uppercase" }}>Access Role</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    
                    <button type="button" onClick={() => setRole("editor")} style={{ padding: "12px", borderRadius: 12, border: role === "editor" ? "2px solid #38bdf8" : "2px solid var(--admin-border)", background: role === "editor" ? "rgba(56,189,248,0.1)" : "rgba(255,255,255,0.02)", textAlign: "left", cursor: "pointer", transition: "all 0.2s" }}>
                      <div style={{ fontWeight: 600, color: role === "editor" ? "#38bdf8" : "var(--admin-text)", fontSize: 14 }}>Editor</div>
                      <div style={{ fontSize: 11, color: "var(--admin-text-muted)", marginTop: 4 }}>Can edit articles & meta.</div>
                    </button>

                    <button type="button" onClick={() => setRole("admin")} style={{ padding: "12px", borderRadius: 12, border: role === "admin" ? "2px solid #a78bfa" : "2px solid var(--admin-border)", background: role === "admin" ? "rgba(167,139,250,0.1)" : "rgba(255,255,255,0.02)", textAlign: "left", cursor: "pointer", transition: "all 0.2s" }}>
                      <div style={{ fontWeight: 600, color: role === "admin" ? "#a78bfa" : "var(--admin-text)", fontSize: 14 }}>Admin</div>
                      <div style={{ fontSize: 11, color: "var(--admin-text-muted)", marginTop: 4 }}>Full system access.</div>
                    </button>
                    
                  </div>
                </div>

                {/* Initial Password (Creation Only) */}
                {panelMode === "add" && (
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 8, textTransform: "uppercase" }}>Temporary Password *</label>
                    <div style={inputStyle}>
                      <KeyRound size={16} style={iconAdornment} />
                      <input type="text" required minLength={6} className="admin-input" placeholder="Provides temporary access" value={initialPassword} onChange={e => setInitialPassword(e.target.value)} style={{ paddingLeft: 42 }} />
                    </div>
                    <p style={{ fontSize: 11, color: "var(--admin-text-muted)", marginTop: 6 }}>The user will be forced to change this upon their first login.</p>
                  </div>
                )}

                {/* Status (Edit Only) */}
                {panelMode === "edit" && (
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 8, textTransform: "uppercase" }}>Account Status</label>
                    <select className="admin-input" value={status} onChange={e => setStatus(e.target.value)} style={{ cursor: "pointer", WebkitAppearance: "menulist" }}>
                      <option value="Active">Active (Permitted)</option>
                      <option value="Revoked">Revoked (Blocked)</option>
                    </select>
                  </div>
                )}

              </form>
            </div>

            {/* Panel Footer */}
            <div style={{ padding: "24px 32px", borderTop: "1px solid var(--admin-border)", background: "rgba(0,0,0,0.2)", display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button type="button" onClick={closePanel} className="admin-btn admin-btn-ghost" disabled={formLoading}>
                Cancel
              </button>
              <button type="submit" form="team-form" className="admin-btn admin-btn-primary" disabled={formLoading} style={{ padding: "10px 24px" }}>
                {formLoading ? <Loader2 size={16} className="animate-spin" /> : (panelMode === "add" ? "Create Member" : "Save Changes")}
              </button>
            </div>
            
          </div>
        </>
      )}

      {/* Global Style overrides for sliding panel */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default TeamPage;
