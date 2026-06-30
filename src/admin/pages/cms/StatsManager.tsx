import React, { useState, useEffect } from "react";
import {
  getWebsiteStatsAPI, createWebsiteStatAPI, updateWebsiteStatAPI, deleteWebsiteStatAPI, WebsiteStat,
} from "../../lib/api";
import {
  Loader2, Trash2, AlertCircle, Save, Plus, CheckCircle2, Briefcase, Users, Award, UsersRound, Globe, Headphones, BarChart3,
} from "lucide-react";

// The canonical ULMiND counters — each gets its own dedicated input section.
const CANONICAL: { label: string; icon: React.ElementType; placeholder: string }[] = [
  { label: "Projects Completed", icon: Briefcase, placeholder: "7+" },
  { label: "Happy Clients", icon: Users, placeholder: "7+" },
  { label: "Years Of Experience", icon: Award, placeholder: "3+" },
  { label: "Team Members", icon: UsersRound, placeholder: "8+" },
  { label: "Clients Worldwide", icon: Globe, placeholder: "7+" },
  { label: "Support", icon: Headphones, placeholder: "24/7" },
];

interface Slot {
  key: string;
  label: string;
  value: string;
  icon: React.ElementType;
  fixed: boolean;        // canonical labels can't be renamed; custom ones can
  existingId?: string;   // _id when this slot already lives in the DB
}

const norm = (s: string) => s.trim().toLowerCase();
let _uid = 0;
const uid = () => `custom-${Date.now()}-${_uid++}`;

const StatsManager: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      setError(null);
      const data: WebsiteStat[] = await getWebsiteStatsAPI();
      const byLabel = new Map(data.map((s) => [norm(s.label), s]));

      // Build the 6 fixed slots, pre-filled from the DB where a match exists.
      const fixedSlots: Slot[] = CANONICAL.map((c) => {
        const existing = byLabel.get(norm(c.label));
        return { key: c.label, label: c.label, value: existing?.value || "", icon: c.icon, fixed: true, existingId: existing?._id };
      });

      // Any DB stat that isn't one of the canonical labels → keep as an editable custom slot.
      const canonicalSet = new Set(CANONICAL.map((c) => norm(c.label)));
      const customSlots: Slot[] = data
        .filter((s) => !canonicalSet.has(norm(s.label)))
        .map((s) => ({ key: s._id, label: s.label, value: s.value, icon: BarChart3, fixed: false, existingId: s._id }));

      setSlots([...fixedSlots, ...customSlots]);
    } catch (err: any) {
      setError(err.message || "Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  const updateSlot = (key: string, patch: Partial<Slot>) => {
    setSaved(false);
    setSlots((prev) => prev.map((s) => (s.key === key ? { ...s, ...patch } : s)));
  };

  const addCustomSlot = () => {
    setSaved(false);
    setSlots((prev) => [...prev, { key: uid(), label: "", value: "", icon: BarChart3, fixed: false }]);
  };

  const removeSlot = (key: string) => {
    setSaved(false);
    setSlots((prev) => prev.filter((s) => s.key !== key));
  };

  const handleSaveAll = async () => {
    setSaving(true); setError(null);
    try {
      const tasks: Promise<any>[] = [];
      slots.forEach((slot, index) => {
        const value = slot.value.trim();
        const label = slot.label.trim();

        if (!value || !label) {
          // Empty slot — if it previously existed in the DB, remove it.
          if (slot.existingId) tasks.push(deleteWebsiteStatAPI(slot.existingId));
          return;
        }
        const payload = { value, label, order: index };
        if (slot.existingId) tasks.push(updateWebsiteStatAPI(slot.existingId, payload));
        else tasks.push(createWebsiteStatAPI(payload));
      });
      await Promise.all(tasks);
      await loadStats();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setError(err.message || "Failed to save stats");
    } finally {
      setSaving(false);
    }
  };

  const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" };

  return (
    <div style={{ position: "relative" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, gap: 16, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--admin-text)" }}>Company Stats</h2>
          <p style={{ fontSize: 13, color: "var(--admin-text-dim)", marginTop: 4 }}>
            Each counter has its own field. Type a value, hit Save, and it updates live on the site.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {saved && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--admin-emerald)" }}>
              <CheckCircle2 size={16} /> Saved
            </span>
          )}
          <button onClick={handleSaveAll} disabled={saving || loading} className="admin-btn admin-btn-primary" style={{ padding: "11px 24px" }}>
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: 16, marginTop: 16, background: "rgba(225,29,72,0.1)", border: "1px solid rgba(225,29,72,0.3)", borderRadius: 14, color: "#f87171", display: "flex", gap: 10, alignItems: "center" }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 64 }}><Loader2 size={32} className="animate-spin" color="var(--admin-text-dim)" /></div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18, marginTop: 24 }}>
            {slots.map((slot) => {
              const Icon = slot.icon;
              const hasValue = slot.value.trim().length > 0;
              return (
                <div key={slot.key} className="admin-card" style={{ padding: 20 }}>
                  {/* Slot header */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: hasValue ? "rgba(244,63,94,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${hasValue ? "rgba(244,63,94,0.25)" : "var(--admin-border)"}`, transition: "all 0.3s" }}>
                      <Icon size={19} color={hasValue ? "var(--admin-accent-hover)" : "var(--admin-text-dim)"} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {slot.fixed ? (
                        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--admin-text)" }}>{slot.label}</div>
                      ) : (
                        <input
                          className="admin-input"
                          style={{ padding: "8px 12px", fontSize: 13, fontWeight: 600 }}
                          placeholder="Custom label"
                          value={slot.label}
                          onChange={(e) => updateSlot(slot.key, { label: e.target.value })}
                        />
                      )}
                      {slot.fixed && <div style={{ fontSize: 11, color: "var(--admin-text-dim)", marginTop: 2 }}>Counter label</div>}
                    </div>
                    {!slot.fixed && (
                      <button onClick={() => removeSlot(slot.key)} title="Remove" style={iconBtn("#f87171", "rgba(225,29,72,0.1)")}><Trash2 size={14} /></button>
                    )}
                  </div>

                  {/* Value input */}
                  <label style={labelStyle}>Value</label>
                  <input
                    className="admin-input"
                    placeholder={`e.g. ${CANONICAL.find((c) => c.label === slot.label)?.placeholder || "7+"}`}
                    value={slot.value}
                    onChange={(e) => updateSlot(slot.key, { value: e.target.value })}
                  />

                  {/* Mini live preview */}
                  <div style={{ marginTop: 16, borderRadius: 12, padding: "16px 12px", textAlign: "center", background: "rgba(10,17,32,0.5)", border: "1px solid rgba(244,63,94,0.12)" }}>
                    <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1, backgroundImage: "linear-gradient(135deg, #e11d48 0%, #f43f5e 60%, #9f1239 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      {slot.value.trim() || "—"}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--admin-text-muted)", marginTop: 6 }}>{slot.label || "Label"}</div>
                  </div>
                </div>
              );
            })}

            {/* Add custom slot card */}
            <button
              onClick={addCustomSlot}
              className="admin-card"
              style={{ padding: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, cursor: "pointer", border: "1px dashed var(--admin-border)", background: "rgba(255,255,255,0.015)", minHeight: 200 }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.04)", border: "1px solid var(--admin-border)" }}>
                <Plus size={22} color="var(--admin-text-dim)" />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-text-muted)" }}>Add another stat</span>
            </button>
          </div>

          <p style={{ fontSize: 12, color: "var(--admin-text-dim)", marginTop: 20, display: "flex", alignItems: "center", gap: 6 }}>
            <AlertCircle size={13} /> Leave a value empty and Save to hide / remove that counter from the website.
          </p>
        </>
      )}
    </div>
  );
};

// ── Shared style helpers (used across CMS managers) ──
export const iconBtn = (color: string, bg = "rgba(255,255,255,0.05)"): React.CSSProperties => ({
  background: bg, border: "none", width: 30, height: 30, borderRadius: 8,
  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color, transition: "all 0.2s",
});
export const iconAdorn: React.CSSProperties = { position: "absolute", left: 14, color: "#64748b", pointerEvents: "none" };
export const overlayStyle: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 100, animation: "cmsOverlayIn 0.2s ease" };
export const panelStyle: React.CSSProperties = {
  position: "fixed", top: 0, right: 0, bottom: 0, width: "100%", maxWidth: 540,
  background: "var(--admin-bg-card)", borderLeft: "1px solid var(--admin-border)", zIndex: 101,
  boxShadow: "-10px 0 40px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column",
  animation: "cmsSlideIn 0.3s cubic-bezier(0.16,1,0.3,1)",
};
export const panelHeaderStyle: React.CSSProperties = { padding: "24px 32px", borderBottom: "1px solid var(--admin-border)", display: "flex", justifyContent: "space-between", alignItems: "center" };
export const panelFooterStyle: React.CSSProperties = { padding: "20px 32px", borderTop: "1px solid var(--admin-border)", background: "rgba(0,0,0,0.2)", display: "flex", justifyContent: "flex-end", gap: 12 };
export const closeBtnStyle: React.CSSProperties = { background: "none", border: "none", color: "var(--admin-text-dim)", cursor: "pointer", padding: 8, borderRadius: "50%" };

export const DeleteModal: React.FC<{ title: string; deleting: boolean; onCancel: () => void; onConfirm: () => void }> = ({ title, deleting, onCancel, onConfirm }) => (
  <>
    <div onClick={onCancel} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", zIndex: 200, animation: "cmsOverlayIn 0.2s ease" }} />
    <div style={{
      position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 201,
      background: "var(--admin-bg-card)", border: "1px solid var(--admin-border)", borderRadius: 16, padding: 32,
      maxWidth: 400, width: "90%", boxShadow: "0 24px 64px rgba(0,0,0,0.4)", textAlign: "center",
    }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(239,68,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
        <Trash2 size={24} color="#f87171" />
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--admin-text)", marginBottom: 8 }}>Delete this item?</h3>
      <p style={{ fontSize: 13, color: "var(--admin-text-dim)", lineHeight: 1.6, marginBottom: 28 }}>
        <strong style={{ color: "var(--admin-text)" }}>"{title}"</strong> permanently delete hobe. Eta undo kora jabe na.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button onClick={onCancel} disabled={deleting} className="admin-btn admin-btn-ghost" style={{ padding: "10px 24px" }}>Cancel</button>
        <button onClick={onConfirm} disabled={deleting} style={{
          padding: "10px 24px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 10, fontWeight: 600,
          cursor: deleting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14, opacity: deleting ? 0.7 : 1,
        }}>
          {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={14} />}{deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  </>
);

export default StatsManager;
