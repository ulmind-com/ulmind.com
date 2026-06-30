import React, { useState, useEffect, useRef } from "react";
import {
  getTestimonialsAPI, createTestimonialAPI, updateTestimonialAPI, deleteTestimonialAPI, uploadCmsImageAPI, Testimonial,
} from "../../lib/api";
import { Plus, Edit2, Trash2, Loader2, Star, X, User, AtSign, ArrowUpDown, AlertCircle, Upload, MessageSquareQuote } from "lucide-react";
import {
  iconBtn, iconAdorn, overlayStyle, panelStyle, panelHeaderStyle, panelFooterStyle, closeBtnStyle, DeleteModal,
} from "./StatsManager";

const ReviewsManager: React.FC = () => {
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [panelMode, setPanelMode] = useState<"add" | "edit" | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(5);
  const [order, setOrder] = useState(0);
  const [img, setImg] = useState<{ url: string; public_id: string } | undefined>(undefined);
  const [uploading, setUploading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { loadReviews(); }, []);

  const loadReviews = async () => {
    try {
      setError(null);
      setReviews(await getTestimonialsAPI());
    } catch (err: any) {
      setError(err.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setPanelMode("add"); setEditId(null);
    setName(""); setUsername(""); setBody(""); setRating(5); setOrder(reviews.length); setImg(undefined);
    setFormError(null);
  };
  const openEdit = (r: Testimonial) => {
    setPanelMode("edit"); setEditId(r._id);
    setName(r.name); setUsername(r.username); setBody(r.body); setRating(r.rating || 5); setOrder(r.order); setImg(r.img);
    setFormError(null);
  };
  const closePanel = () => { if (!formLoading) setPanelMode(null); };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      setImg(await uploadCmsImageAPI(file));
    } catch {
      setFormError("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !body.trim()) { setFormError("Client name and review text are required."); return; }
    setFormLoading(true); setFormError(null);
    try {
      const payload = { name: name.trim(), username: username.trim(), body: body.trim(), rating, order, img };
      if (panelMode === "edit" && editId) await updateTestimonialAPI(editId, payload);
      else await createTestimonialAPI(payload);
      setPanelMode(null);
      await loadReviews();
    } catch (err: any) {
      setFormError(err.message || "Failed to save review");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteTestimonialAPI(deleteTarget._id);
      setDeleteTarget(null);
      await loadReviews();
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
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--admin-text)" }}>Client Reviews</h2>
          <p style={{ fontSize: 13, color: "var(--admin-text-dim)", marginTop: 4 }}>Photo, name, sub-heading, star rating & testimonial text.</p>
        </div>
        <button onClick={openAdd} className="admin-btn admin-btn-primary" style={{ padding: "11px 22px" }}><Plus size={18} /> Add Review</button>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 64 }}><Loader2 size={32} className="animate-spin" color="var(--admin-text-dim)" /></div>
      ) : error ? (
        <div style={{ padding: 20, background: "rgba(225,29,72,0.1)", border: "1px solid rgba(225,29,72,0.3)", borderRadius: 14, color: "#f87171", display: "flex", gap: 10, alignItems: "center" }}><AlertCircle size={18} /> {error}</div>
      ) : reviews.length === 0 ? (
        <div className="admin-card" style={{ padding: "64px 32px", textAlign: "center" }}>
          <MessageSquareQuote size={48} style={{ margin: "0 auto 16px", color: "var(--admin-text-dim)", opacity: 0.4 }} />
          <h3 style={{ fontSize: 18, color: "var(--admin-text)", fontWeight: 600, marginBottom: 8 }}>No reviews yet</h3>
          <p style={{ color: "var(--admin-text-dim)", fontSize: 14, marginBottom: 24 }}>Add the first client testimonial.</p>
          <button onClick={openAdd} className="admin-btn admin-btn-primary" style={{ padding: "11px 22px", margin: "0 auto" }}><Plus size={16} /> Add First Review</button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
          {reviews.map((r) => (
            <div key={r._id} className="admin-card" style={{ padding: 22, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
                {r.img?.url ? (
                  <img src={r.img.url} alt={r.name} style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(244,63,94,0.3)" }} />
                ) : (
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--admin-border)" }}><User size={22} color="var(--admin-text-dim)" /></div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--admin-text)" }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: "var(--admin-text-dim)" }}>{r.username}</div>
                  <div style={{ marginTop: 4, display: "flex", gap: 2 }}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} size={13} color={n <= (r.rating || 5) ? "#f59e0b" : "#3f3f46"} fill={n <= (r.rating || 5) ? "#f59e0b" : "transparent"} />
                    ))}
                  </div>
                </div>
                <span className="admin-badge admin-badge-info" style={{ fontSize: 10 }}>#{r.order}</span>
              </div>
              <p style={{ fontSize: 13, color: "var(--admin-text-muted)", lineHeight: 1.6, fontStyle: "italic", flex: 1, display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical" as any, overflow: "hidden" }}>"{r.body}"</p>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, borderTop: "1px solid var(--admin-border)", paddingTop: 12, marginTop: 14 }}>
                <button onClick={() => openEdit(r)} title="Edit" style={iconBtn("var(--admin-text-dim)")}><Edit2 size={14} /></button>
                <button onClick={() => setDeleteTarget(r)} title="Delete" style={iconBtn("#f87171", "rgba(225,29,72,0.1)")}><Trash2 size={14} /></button>
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
              <h3 style={{ fontSize: 20, fontWeight: 600, color: "var(--admin-text)" }}>{panelMode === "add" ? "Add Review" : "Edit Review"}</h3>
              <button onClick={closePanel} style={closeBtnStyle}><X size={20} /></button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 32 }}>
              {formError && (
                <div style={{ background: "rgba(225,29,72,0.1)", border: "1px solid rgba(225,29,72,0.3)", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#f87171", marginBottom: 24, display: "flex", gap: 8 }}>
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} /> {formError}
                </div>
              )}
              <form id="review-form" onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {/* Avatar */}
                <div>
                  <label style={labelStyle}>Client Photo</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div onClick={() => fileRef.current?.click()} style={{ width: 84, height: 84, borderRadius: "50%", cursor: "pointer", border: "2px dashed var(--admin-border)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "rgba(255,255,255,0.02)", flexShrink: 0 }}>
                      {uploading ? <Loader2 size={22} className="animate-spin" color="var(--admin-text-dim)" /> : img?.url ? <img src={img.url} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Upload size={22} color="var(--admin-text-dim)" />}
                    </div>
                    <div>
                      <button type="button" onClick={() => fileRef.current?.click()} className="admin-btn admin-btn-ghost" style={{ padding: "8px 16px", fontSize: 13 }}>{img ? "Change Photo" : "Upload Photo"}</button>
                      {img && <button type="button" onClick={() => setImg(undefined)} style={{ marginLeft: 12, background: "none", border: "none", color: "#f87171", fontSize: 12, cursor: "pointer" }}>Remove</button>}
                      <p style={{ fontSize: 11, color: "var(--admin-text-muted)", marginTop: 6 }}>Square image recommended.</p>
                    </div>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Name *</label>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}><User size={16} style={iconAdorn} /><input className="admin-input" style={{ paddingLeft: 42 }} placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} /></div>
                  </div>
                  <div>
                    <label style={labelStyle}>Sub-heading</label>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}><AtSign size={16} style={iconAdorn} /><input className="admin-input" style={{ paddingLeft: 42 }} placeholder="CEO, Acme Inc." value={username} onChange={(e) => setUsername(e.target.value)} /></div>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Review Text *</label>
                  <textarea className="admin-input" rows={4} style={{ resize: "vertical", minHeight: 100 }} placeholder="What did the client say?" value={body} onChange={(e) => setBody(e.target.value)} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "flex-end" }}>
                  <div>
                    <label style={labelStyle}>Rating</label>
                    <div style={{ display: "flex", gap: 6, padding: "10px 4px" }}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button key={n} type="button" onClick={() => setRating(n)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 0 }}>
                          <Star size={24} color={n <= rating ? "#f59e0b" : "#3f3f46"} fill={n <= rating ? "#f59e0b" : "transparent"} style={{ transition: "all 0.15s" }} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Display Order</label>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}><ArrowUpDown size={16} style={iconAdorn} /><input type="number" className="admin-input" style={{ paddingLeft: 42 }} value={order} onChange={(e) => setOrder(parseInt(e.target.value) || 0)} /></div>
                  </div>
                </div>
              </form>
            </div>
            <div style={panelFooterStyle}>
              <button type="button" onClick={closePanel} className="admin-btn admin-btn-ghost" disabled={formLoading}>Cancel</button>
              <button type="submit" form="review-form" className="admin-btn admin-btn-primary" disabled={formLoading || uploading} style={{ padding: "10px 24px" }}>
                {formLoading ? <Loader2 size={16} className="animate-spin" /> : panelMode === "add" ? "Add Review" : "Save Changes"}
              </button>
            </div>
          </div>
        </>
      )}

      {deleteTarget && <DeleteModal title={deleteTarget.name} deleting={deleting} onCancel={() => !deleting && setDeleteTarget(null)} onConfirm={handleDelete} />}
    </div>
  );
};

export default ReviewsManager;
