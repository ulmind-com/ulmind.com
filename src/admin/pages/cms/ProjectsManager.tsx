import React, { useState, useEffect, useRef } from "react";
import {
  getPortfolioProjectsAPI, createPortfolioProjectAPI, updatePortfolioProjectAPI, deletePortfolioProjectAPI, uploadCmsImageAPI, PortfolioProject,
} from "../../lib/api";
import {
  Plus, Edit2, Trash2, Loader2, Briefcase, X, AlertCircle, Upload, Type, Tag, Clock, Users, Link2, Github, Layers,
} from "lucide-react";
import {
  iconBtn, iconAdorn, overlayStyle, panelStyle, panelHeaderStyle, panelFooterStyle, closeBtnStyle, DeleteModal,
} from "./StatsManager";

const ChipInput: React.FC<{
  label: string; accent: string; items: string[]; placeholder: string;
  onAdd: (v: string) => void; onRemove: (v: string) => void;
}> = ({ label, accent, items, placeholder, onAdd, onRemove }) => {
  const [draft, setDraft] = useState("");
  const commit = () => { const v = draft.trim(); if (v) { onAdd(v); setDraft(""); } };
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
      <div style={{ display: "flex", gap: 8 }}>
        <input className="admin-input" placeholder={placeholder} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); commit(); } }} />
        <button type="button" onClick={commit} className="admin-btn admin-btn-ghost" style={{ padding: "0 18px", flexShrink: 0 }}>Add</button>
      </div>
      {items.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
          {items.map((t) => (
            <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 8, fontSize: 12, fontWeight: 600, background: `${accent}1a`, color: accent, border: `1px solid ${accent}33` }}>
              {t}
              <button type="button" onClick={() => onRemove(t)} style={{ background: "none", border: "none", color: accent, cursor: "pointer", padding: 0, lineHeight: 0, opacity: 0.7 }}><X size={13} /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const ProjectsManager: React.FC = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [panelMode, setPanelMode] = useState<"add" | "edit" | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<PortfolioProject>>({});
  const [uploading, setUploading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [deleteTarget, setDeleteTarget] = useState<PortfolioProject | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { loadProjects(); }, []);

  const loadProjects = async () => {
    try {
      setError(null);
      setProjects(await getPortfolioProjectsAPI());
    } catch (err: any) {
      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setPanelMode("add"); setEditId(null);
    setForm({ type: "web", languages: [], technologies: [], order: projects.length });
    setFormError(null);
  };
  const openEdit = (p: PortfolioProject) => {
    setPanelMode("edit"); setEditId(p._id);
    setForm({ ...p, languages: p.languages || [], technologies: p.technologies || [] });
    setFormError(null);
  };
  const closePanel = () => { if (!formLoading) setPanelMode(null); };
  const set = (patch: Partial<PortfolioProject>) => setForm((f) => ({ ...f, ...patch }));

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      set({ image: await uploadCmsImageAPI(file) });
    } catch {
      setFormError("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title?.trim() || !form.description?.trim()) { setFormError("Heading and description are required."); return; }
    setFormLoading(true); setFormError(null);
    try {
      const payload = {
        title: form.title!.trim(), description: form.description!.trim(),
        type: form.type || "web", category: form.category?.trim() || "",
        timeline: form.timeline?.trim() || "", teamSize: form.teamSize?.trim() || "",
        demoUrl: form.demoUrl?.trim() || "", githubUrl: form.githubUrl?.trim() || "",
        languages: form.languages || [], technologies: form.technologies || [],
        order: form.order || 0, image: form.image,
      };
      if (panelMode === "edit" && editId) await updatePortfolioProjectAPI(editId, payload);
      else await createPortfolioProjectAPI(payload);
      setPanelMode(null);
      await loadProjects();
    } catch (err: any) {
      setFormError(err.message || "Failed to save project");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deletePortfolioProjectAPI(deleteTarget._id);
      setDeleteTarget(null);
      await loadProjects();
    } catch (err: any) {
      setError(err.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" };

  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--admin-text)" }}>Portfolio Projects</h2>
          <p style={{ fontSize: 13, color: "var(--admin-text-dim)", marginTop: 4 }}>Photo, heading, sub-heading, languages & technologies for every showcase card.</p>
        </div>
        <button onClick={openAdd} className="admin-btn admin-btn-primary" style={{ padding: "11px 22px" }}><Plus size={18} /> Add Project</button>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 64 }}><Loader2 size={32} className="animate-spin" color="var(--admin-text-dim)" /></div>
      ) : error ? (
        <div style={{ padding: 20, background: "rgba(225,29,72,0.1)", border: "1px solid rgba(225,29,72,0.3)", borderRadius: 14, color: "#f87171", display: "flex", gap: 10, alignItems: "center" }}><AlertCircle size={18} /> {error}</div>
      ) : projects.length === 0 ? (
        <div className="admin-card" style={{ padding: "64px 32px", textAlign: "center" }}>
          <Briefcase size={48} style={{ margin: "0 auto 16px", color: "var(--admin-text-dim)", opacity: 0.4 }} />
          <h3 style={{ fontSize: 18, color: "var(--admin-text)", fontWeight: 600, marginBottom: 8 }}>No projects yet</h3>
          <p style={{ color: "var(--admin-text-dim)", fontSize: 14, marginBottom: 24 }}>Add your first portfolio project.</p>
          <button onClick={openAdd} className="admin-btn admin-btn-primary" style={{ padding: "11px 22px", margin: "0 auto" }}><Plus size={16} /> Add First Project</button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
          {projects.map((p) => (
            <div key={p._id} className="admin-card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ position: "relative", width: "100%", height: 170, background: "rgba(15,22,41,0.6)", overflow: "hidden" }}>
                {p.image?.url ? (
                  <img src={p.image.url} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Briefcase size={36} style={{ color: "var(--admin-text-dim)", opacity: 0.3 }} /></div>
                )}
                <span style={{ position: "absolute", top: 12, left: 12 }} className={`admin-badge ${p.type === "app" ? "admin-badge-info" : "admin-badge-success"}`}>{p.type === "app" ? "App" : "Web"}</span>
                <span style={{ position: "absolute", top: 12, right: 12 }} className="admin-badge admin-badge-warning">#{p.order}</span>
              </div>
              <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--admin-text)", marginBottom: 4 }}>{p.title}</h3>
                <p style={{ fontSize: 12, color: "var(--admin-text-dim)", marginBottom: 10 }}>{[p.category, p.timeline, p.teamSize].filter(Boolean).join("  •  ")}</p>
                <p style={{ fontSize: 13, color: "var(--admin-text-muted)", lineHeight: 1.5, flex: 1, marginBottom: 14, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any, overflow: "hidden" }}>{p.description}</p>
                {(p.languages?.length || p.technologies?.length) ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                    {(p.languages || []).slice(0, 3).map((l) => <span key={`l-${l}`} style={chip("#0ea5e9")}>{l}</span>)}
                    {(p.technologies || []).slice(0, 3).map((t) => <span key={`t-${t}`} style={chip("#10b981")}>{t}</span>)}
                    {((p.languages?.length || 0) + (p.technologies?.length || 0)) > 6 && <span style={chip("#a1a1aa")}>+{(p.languages!.length + p.technologies!.length) - 6}</span>}
                  </div>
                ) : null}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, borderTop: "1px solid var(--admin-border)", paddingTop: 12, marginTop: "auto" }}>
                  <button onClick={() => openEdit(p)} title="Edit" style={iconBtn("var(--admin-text-dim)")}><Edit2 size={14} /></button>
                  <button onClick={() => setDeleteTarget(p)} title="Delete" style={iconBtn("#f87171", "rgba(225,29,72,0.1)")}><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {panelMode && (
        <>
          <div onClick={closePanel} style={overlayStyle} />
          <div style={panelStyle}>
            <div style={panelHeaderStyle}>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: "var(--admin-text)" }}>{panelMode === "add" ? "Add Project" : "Edit Project"}</h3>
              <button onClick={closePanel} style={closeBtnStyle}><X size={20} /></button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 32 }}>
              {formError && (
                <div style={{ background: "rgba(225,29,72,0.1)", border: "1px solid rgba(225,29,72,0.3)", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#f87171", marginBottom: 24, display: "flex", gap: 8 }}>
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} /> {formError}
                </div>
              )}
              <form id="project-form" onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                {/* Image */}
                <div>
                  <label style={labelStyle}>Project Photo</label>
                  <div onClick={() => fileRef.current?.click()} style={{ width: "100%", height: 170, borderRadius: 14, overflow: "hidden", cursor: "pointer", border: "2px dashed var(--admin-border)", display: "flex", alignItems: "center", justifyContent: "center", background: form.image ? "transparent" : "rgba(255,255,255,0.02)" }}>
                    {uploading ? <Loader2 size={28} className="animate-spin" color="var(--admin-text-dim)" /> : form.image?.url ? <img src={form.image.url} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (
                      <div style={{ textAlign: "center", color: "var(--admin-text-dim)" }}><Upload size={30} style={{ marginBottom: 8, opacity: 0.5 }} /><p style={{ fontSize: 13 }}>Click to upload project image</p></div>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
                  {form.image && <button type="button" onClick={() => set({ image: undefined })} style={{ marginTop: 8, background: "none", border: "none", color: "#f87171", fontSize: 12, cursor: "pointer" }}>Remove image</button>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Heading *</label>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}><Type size={16} style={iconAdorn} /><input className="admin-input" style={{ paddingLeft: 42 }} placeholder="Project title" value={form.title || ""} onChange={(e) => set({ title: e.target.value })} /></div>
                  </div>
                  <div>
                    <label style={labelStyle}>Sub-heading</label>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}><Tag size={16} style={iconAdorn} /><input className="admin-input" style={{ paddingLeft: 42 }} placeholder="e.g. E-commerce Platform" value={form.category || ""} onChange={(e) => set({ category: e.target.value })} /></div>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Description *</label>
                  <textarea className="admin-input" rows={3} style={{ resize: "vertical", minHeight: 80 }} placeholder="Short description of the project" value={form.description || ""} onChange={(e) => set({ description: e.target.value })} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Type</label>
                    <select className="admin-input" value={form.type || "web"} onChange={(e) => set({ type: e.target.value })} style={{ cursor: "pointer" }}>
                      <option value="web">Web</option>
                      <option value="app">App</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Timeline</label>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}><Clock size={16} style={iconAdorn} /><input className="admin-input" style={{ paddingLeft: 42 }} placeholder="7 days" value={form.timeline || ""} onChange={(e) => set({ timeline: e.target.value })} /></div>
                  </div>
                  <div>
                    <label style={labelStyle}>Team</label>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}><Users size={16} style={iconAdorn} /><input className="admin-input" style={{ paddingLeft: 42 }} placeholder="2 devs" value={form.teamSize || ""} onChange={(e) => set({ teamSize: e.target.value })} /></div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Demo URL</label>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}><Link2 size={16} style={iconAdorn} /><input className="admin-input" style={{ paddingLeft: 42 }} placeholder="https://" value={form.demoUrl || ""} onChange={(e) => set({ demoUrl: e.target.value })} /></div>
                  </div>
                  <div>
                    <label style={labelStyle}>GitHub URL</label>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}><Github size={16} style={iconAdorn} /><input className="admin-input" style={{ paddingLeft: 42 }} placeholder="https://github.com/..." value={form.githubUrl || ""} onChange={(e) => set({ githubUrl: e.target.value })} /></div>
                  </div>
                </div>
                <ChipInput label="Languages" accent="#0ea5e9" placeholder="e.g. TypeScript — press Enter"
                  items={form.languages || []}
                  onAdd={(v) => !((form.languages || []).includes(v)) && set({ languages: [...(form.languages || []), v] })}
                  onRemove={(v) => set({ languages: (form.languages || []).filter((x) => x !== v) })} />
                <ChipInput label="Technologies" accent="#10b981" placeholder="e.g. React — press Enter"
                  items={form.technologies || []}
                  onAdd={(v) => !((form.technologies || []).includes(v)) && set({ technologies: [...(form.technologies || []), v] })}
                  onRemove={(v) => set({ technologies: (form.technologies || []).filter((x) => x !== v) })} />
                <div style={{ maxWidth: 160 }}>
                  <label style={labelStyle}>Display Order</label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}><Layers size={16} style={iconAdorn} /><input type="number" className="admin-input" style={{ paddingLeft: 42 }} value={form.order ?? 0} onChange={(e) => set({ order: parseInt(e.target.value) || 0 })} /></div>
                </div>
              </form>
            </div>
            <div style={panelFooterStyle}>
              <button type="button" onClick={closePanel} className="admin-btn admin-btn-ghost" disabled={formLoading}>Cancel</button>
              <button type="submit" form="project-form" className="admin-btn admin-btn-primary" disabled={formLoading || uploading} style={{ padding: "10px 24px" }}>
                {formLoading ? <Loader2 size={16} className="animate-spin" /> : panelMode === "add" ? "Add Project" : "Save Changes"}
              </button>
            </div>
          </div>
        </>
      )}

      {deleteTarget && <DeleteModal title={deleteTarget.title} deleting={deleting} onCancel={() => !deleting && setDeleteTarget(null)} onConfirm={handleDelete} />}
    </div>
  );
};

const chip = (color: string): React.CSSProperties => ({ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 7, background: `${color}1a`, color, border: `1px solid ${color}33` });

export default ProjectsManager;
