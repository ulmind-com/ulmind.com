/* ──────────────────────────────────────────────────────────────
   ULMiND Admin — Offers Management Page
   Full CRUD with image upload, scheduling, and status toggles
   ────────────────────────────────────────────────────────────── */

import React, { useState, useEffect, useRef } from "react";
import {
  Tag, Plus, X, Loader2, Edit2, Trash2, Image as ImageIcon,
  Clock, Calendar, ToggleLeft, ToggleRight, AlertCircle, Check, Upload, Eye, EyeOff
} from "lucide-react";
import {
  Offer,
  listAllOffersAPI,
  createOfferAPI,
  updateOfferAPI,
  updateOfferImageAPI,
  deleteOfferAPI
} from "../lib/api";

type PanelMode = "add" | "edit" | null;

const formatIST = (iso: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso.endsWith("Z") ? iso : iso + "Z");
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium", timeStyle: "short",
    timeZone: "Asia/Kolkata"
  }).format(d);
};

const toLocalDatetimeValue = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso.endsWith("Z") ? iso : iso + "Z");
  const ist = new Date(d.getTime() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().slice(0, 16);
};

const OffersPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [panelMode, setPanelMode] = useState<PanelMode>(null);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await listAllOffersAPI();
      setOffers(data);
    } catch (err: any) {
      setError(err.message || "Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOffers(); }, []);

  const openAddPanel = () => {
    setPanelMode("add");
    setSelectedOffer(null);
    setTitle(""); setDescription(""); setStartTime(""); setEndTime("");
    setIsActive(true); setImageFile(null); setImagePreview(null); setFormError("");
  };

  const openEditPanel = (offer: Offer) => {
    setPanelMode("edit");
    setSelectedOffer(offer);
    setTitle(offer.title || "");
    setDescription(offer.description || "");
    setStartTime(toLocalDatetimeValue(offer.start_time));
    setEndTime(toLocalDatetimeValue(offer.end_time));
    setIsActive(offer.is_active);
    setImageFile(null);
    setImagePreview(offer.image?.url || null);
    setFormError("");
  };

  const closePanel = () => { setPanelMode(null); setSelectedOffer(null); };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setFormError("Image must be under 5MB"); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    try {
      if (panelMode === "add") {
        const fd = new FormData();
        fd.append("title", title);
        fd.append("description", description);
        if (startTime) fd.append("start_time", new Date(startTime).toISOString());
        if (endTime) fd.append("end_time", new Date(endTime).toISOString());
        fd.append("is_active", String(isActive));
        if (imageFile) fd.append("image", imageFile);
        await createOfferAPI(fd);
      } else if (panelMode === "edit" && selectedOffer) {
        await updateOfferAPI(selectedOffer._id, {
          title,
          description,
          start_time: startTime ? new Date(startTime).toISOString() : null,
          end_time: endTime ? new Date(endTime).toISOString() : null,
          is_active: isActive,
        });
        // If image changed, upload separately
        if (imageFile) {
          await updateOfferImageAPI(selectedOffer._id, imageFile);
        }
      }
      await fetchOffers();
      closePanel();
    } catch (err: any) {
      setFormError(err.message || "Save failed");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (offer: Offer) => {
    if (!window.confirm(`Delete offer "${offer.title}"? This action cannot be undone.`)) return;
    try {
      await deleteOfferAPI(offer._id);
      await fetchOffers();
    } catch (err: any) {
      alert(err.message || "Delete failed");
    }
  };

  const handleToggleActive = async (offer: Offer) => {
    try {
      await updateOfferAPI(offer._id, { is_active: !offer.is_active });
      await fetchOffers();
    } catch (err: any) {
      alert(err.message || "Toggle failed");
    }
  };

  const inputStyle = { position: "relative" as const, display: "flex", alignItems: "center" };
  const iconAdornment = { position: "absolute" as const, left: 14, color: "#64748b", pointerEvents: "none" as const };

  return (
    <div style={{ position: "relative", minHeight: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "var(--admin-text)", fontFamily: "'Inter', sans-serif" }}>
            Offers & Promotions
          </h2>
          <p style={{ fontSize: 14, color: "var(--admin-text-dim)", marginTop: 6 }}>
            Manage time-bound promotional banners and deals
          </p>
        </div>
        <button onClick={openAddPanel} className="admin-btn" style={{ background: "var(--admin-accent)", color: "white", padding: "10px 20px", display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
          <Plus size={18} /> New Offer
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 64 }}>
          <Loader2 size={32} className="animate-spin" />
        </div>
      ) : error ? (
        <div style={{ padding: 24, background: "rgba(225,29,72,0.1)", border: "1px solid rgba(225,29,72,0.3)", borderRadius: 12, color: "#f87171" }}>
          {error}
        </div>
      ) : offers.length === 0 ? (
        <div className="admin-card" style={{ padding: "64px 32px", textAlign: "center" }}>
          <Tag size={48} style={{ margin: "0 auto 16px", color: "var(--admin-text-dim)", opacity: 0.4 }} />
          <h3 style={{ fontSize: 18, color: "var(--admin-text)", fontWeight: 600, marginBottom: 8 }}>No offers yet</h3>
          <p style={{ color: "var(--admin-text-dim)", fontSize: 14, marginBottom: 24 }}>Create your first promotional offer to get started.</p>
          <button onClick={openAddPanel} className="admin-btn" style={{ background: "var(--admin-accent)", color: "white", padding: "10px 20px" }}>
            <Plus size={16} /> Create First Offer
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
          {offers.map(offer => (
            <div key={offer._id} className="admin-card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              {/* Image Band */}
              <div style={{ position: "relative", width: "100%", height: 180, background: "rgba(15,22,41,0.6)", overflow: "hidden" }}>
                {offer.image?.url ? (
                  <img src={offer.image.url} alt={offer.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ImageIcon size={40} style={{ color: "var(--admin-text-dim)", opacity: 0.3 }} />
                  </div>
                )}
                {/* Status Pill */}
                <div style={{ position: "absolute", top: 12, right: 12 }}>
                  <span style={{
                    fontSize: 11, padding: "4px 10px", borderRadius: 20, fontWeight: 600,
                    background: offer.is_active ? "rgba(16,185,129,0.85)" : "rgba(239,68,68,0.85)",
                    color: "#fff", backdropFilter: "blur(4px)"
                  }}>
                    {offer.is_active ? "● Active" : "● Inactive"}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: "20px 20px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--admin-text)", marginBottom: 8 }}>
                  {offer.title || "Untitled Offer"}
                </h3>
                <p style={{ fontSize: 13, color: "var(--admin-text-dim)", lineHeight: 1.5, flex: 1, marginBottom: 16,
                  display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as any, overflow: "hidden" }}>
                  {offer.description || "No description provided."}
                </p>

                {/* Schedule Info */}
                <div style={{ display: "flex", gap: 16, fontSize: 11, color: "var(--admin-text-muted)", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Calendar size={12} /> {formatIST(offer.start_time)}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Clock size={12} /> {formatIST(offer.end_time)}
                  </div>
                </div>

                {/* Action Row */}
                <div style={{ display: "flex", gap: 8, borderTop: "1px solid var(--admin-border)", paddingTop: 12 }}>
                  <button
                    onClick={() => handleToggleActive(offer)}
                    style={{ background: "rgba(255,255,255,0.05)", border: "none", height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: offer.is_active ? "#34d399" : "#f87171", transition: "all 0.2s", padding: "0 10px", gap: 4, fontSize: 12 }}
                    title={offer.is_active ? "Deactivate" : "Activate"}
                  >
                    {offer.is_active ? <><ToggleRight size={16} /> Live</> : <><ToggleLeft size={16} /> Off</>}
                  </button>
                  <div style={{ flex: 1 }} />
                  <button
                    onClick={() => openEditPanel(offer)}
                    style={{ background: "rgba(255,255,255,0.05)", border: "none", width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--admin-text-dim)", transition: "all 0.2s" }}
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(offer)}
                    style={{ background: "rgba(225,29,72,0.1)", border: "none", width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#f87171", transition: "all 0.2s" }}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}


      {/* ── Sliding Side Panel ── */}
      {panelMode && (
        <>
          <div
            onClick={closePanel}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 100, animation: "fadeIn 0.2s ease" }}
          />

          <div
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0, width: "100%", maxWidth: 520,
              background: "var(--admin-bg-card)", borderLeft: "1px solid var(--admin-border)",
              zIndex: 101, boxShadow: "-10px 0 40px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column",
              animation: "slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
          >
            {/* Panel Header */}
            <div style={{ padding: "24px 32px", borderBottom: "1px solid var(--admin-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: "var(--admin-text)" }}>
                {panelMode === "add" ? "Create New Offer" : "Edit Offer"}
              </h3>
              <button onClick={closePanel} style={{ background: "none", border: "none", color: "var(--admin-text-dim)", cursor: "pointer", padding: 8, borderRadius: "50%" }}>
                <X size={20} />
              </button>
            </div>

            {/* Panel Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
              {formError && (
                <div style={{ background: "rgba(225,29,72,0.1)", border: "1px solid rgba(225,29,72,0.3)", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#f87171", marginBottom: 24, display: "flex", gap: 8 }}>
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                  {formError}
                </div>
              )}

              <form id="offer-form" onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                {/* Image Upload Area */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 8, textTransform: "uppercase" }}>
                    Offer Banner
                  </label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    style={{
                      width: "100%", height: 180, borderRadius: 12, overflow: "hidden", cursor: "pointer",
                      border: "2px dashed var(--admin-border)", display: "flex", alignItems: "center", justifyContent: "center",
                      background: imagePreview ? "transparent" : "rgba(255,255,255,0.02)",
                      position: "relative", transition: "border-color 0.2s"
                    }}
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ textAlign: "center", color: "var(--admin-text-dim)" }}>
                        <Upload size={32} style={{ marginBottom: 8, opacity: 0.5 }} />
                        <p style={{ fontSize: 13 }}>Click to upload banner image</p>
                        <p style={{ fontSize: 11, marginTop: 4, opacity: 0.5 }}>JPG, PNG, WebP — Max 5MB</p>
                      </div>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                  {imagePreview && (
                    <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} style={{ marginTop: 8, background: "none", border: "none", color: "#f87171", fontSize: 12, cursor: "pointer" }}>
                      Remove image
                    </button>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 8, textTransform: "uppercase" }}>Title *</label>
                  <div style={inputStyle}>
                    <Tag size={16} style={iconAdornment} />
                    <input type="text" required className="admin-input" placeholder="e.g. Summer Sale — 40% Off" value={title} onChange={e => setTitle(e.target.value)} style={{ paddingLeft: 42 }} />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 8, textTransform: "uppercase" }}>Description</label>
                  <textarea
                    className="admin-input"
                    placeholder="Describe the offer details..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={4}
                    style={{ resize: "vertical", minHeight: 80 }}
                  />
                </div>

                {/* Active Toggle */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 8, textTransform: "uppercase" }}>Visibility</label>
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12,
                      border: isActive ? "2px solid #34d399" : "2px solid var(--admin-border)",
                      background: isActive ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.02)",
                      cursor: "pointer", width: "100%", transition: "all 0.2s"
                    }}
                  >
                    {isActive ? <ToggleRight size={24} color="#34d399" /> : <ToggleLeft size={24} color="#64748b" />}
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: isActive ? "#34d399" : "var(--admin-text)" }}>
                        {isActive ? "Active — Visible to Public" : "Inactive — Hidden from Public"}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--admin-text-muted)", marginTop: 2 }}>
                        {isActive ? "This offer will appear on the website." : "Toggle to make this offer live."}
                      </div>
                    </div>
                  </button>
                </div>

                <hr style={{ border: 0, borderTop: "1px solid rgba(255,255,255,0.05)", margin: "4px 0" }} />

                {/* Scheduling */}
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--admin-text)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                    <Calendar size={16} /> Scheduling (Optional)
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 6, textTransform: "uppercase" }}>Start Time (IST)</label>
                      <input type="datetime-local" className="admin-input" value={startTime} onChange={e => setStartTime(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 6, textTransform: "uppercase" }}>End Time (IST)</label>
                      <input type="datetime-local" className="admin-input" value={endTime} onChange={e => setEndTime(e.target.value)} />
                    </div>
                  </div>
                  <p style={{ fontSize: 11, color: "var(--admin-text-muted)", marginTop: 8 }}>
                    Leave empty for an always-active offer. Times are interpreted as IST.
                  </p>
                </div>

              </form>
            </div>

            {/* Panel Footer */}
            <div style={{ padding: "24px 32px", borderTop: "1px solid var(--admin-border)", background: "rgba(0,0,0,0.2)", display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button type="button" onClick={closePanel} className="admin-btn admin-btn-ghost" disabled={formLoading}>
                Cancel
              </button>
              <button type="submit" form="offer-form" className="admin-btn admin-btn-primary" disabled={formLoading} style={{ padding: "10px 24px" }}>
                {formLoading ? <Loader2 size={16} className="animate-spin" /> : (panelMode === "add" ? "Publish Offer" : "Save Changes")}
              </button>
            </div>
          </div>
        </>
      )}

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
};

export default OffersPage;
