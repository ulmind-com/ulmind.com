import React, { useState, useEffect, useCallback } from "react";
import {
  getFestiveBannerAPI,
  updateFestiveBannerAPI,
  FestiveBanner,
} from "../../lib/api";
import {
  Loader2,
  Save,
  CheckCircle2,
  AlertCircle,
  Flag,
  Sparkles,
  Eye,
  Palette,
  Clock,
  Sun,
  Power,
  RotateCcw,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   Festive Banner Manager — Ultra-Premium Admin Config UI
   ═══════════════════════════════════════════════════════════════ */

// ── tiny helpers ─────────────────────────────────────────────
const toLocalISO = (utc: string | null): string => {
  if (!utc) return "";
  const d = new Date(utc);
  if (isNaN(d.getTime())) return "";
  // datetime-local needs "YYYY-MM-DDTHH:mm"
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const toUTC = (local: string): string | null => {
  if (!local) return null;
  return new Date(local).toISOString();
};

// ── 24-spoke Ashoka Chakra (mini SVG for preview) ───────────
const MiniChakra = ({ size = 22, spinning = false }: { size?: number; spinning?: boolean }) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    style={{
      display: "block",
      color: "#000080",
      animation: spinning ? "festiveChakraSpin 8s linear infinite" : undefined,
    }}
  >
    <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="3" />
    <circle cx="50" cy="50" r="5.5" fill="currentColor" />
    {Array.from({ length: 24 }).map((_, i) => (
      <line key={i} x1="50" y1="50" x2="50" y2="5" stroke="currentColor" strokeWidth="1.4" transform={`rotate(${i * 15} 50 50)`} />
    ))}
    {Array.from({ length: 24 }).map((_, i) => (
      <circle key={`d${i}`} cx="50" cy="9" r="1.4" fill="currentColor" transform={`rotate(${i * 15 + 7.5} 50 50)`} />
    ))}
  </svg>
);

// ── Default values (same as backend schema) ──────────────────
const DEFAULTS: Omit<FestiveBanner, "active"> = {
  enabled: false,
  text: "Celebrating 80th Independence Day 🇮🇳",
  color1: "#FF9933",
  color2: "#138808",
  intensity: 0.48,
  showChakra: true,
  startAt: null,
  endAt: null,
};

// ── Status dot ───────────────────────────────────────────────
const StatusDot = ({ live }: { live: boolean }) => (
  <span
    style={{
      display: "inline-block",
      width: 10,
      height: 10,
      borderRadius: "50%",
      background: live ? "#22c55e" : "#71717a",
      boxShadow: live ? "0 0 8px #22c55e" : "none",
      marginRight: 8,
      animation: live ? "festivePulse 2s ease-in-out infinite" : undefined,
    }}
  />
);

const FestiveBannerManager: React.FC = () => {
  const [cfg, setCfg] = useState<FestiveBanner | null>(null);
  const [draft, setDraft] = useState<Omit<FestiveBanner, "active">>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── load ──
  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await getFestiveBannerAPI();
      setCfg(data);
      setDraft({
        enabled: data.enabled,
        text: data.text,
        color1: data.color1,
        color2: data.color2,
        intensity: data.intensity,
        showChakra: data.showChakra,
        startAt: data.startAt,
        endAt: data.endAt,
      });
    } catch (err: any) {
      setError(err.message || "Failed to load festive banner config");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── save ──
  const save = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const payload: any = { ...draft };
      // Convert local datetime strings to UTC ISO strings for the API
      if (typeof payload.startAt === "string") payload.startAt = toUTC(payload.startAt) || payload.startAt;
      if (typeof payload.endAt === "string") payload.endAt = toUTC(payload.endAt) || payload.endAt;
      const updated = await updateFestiveBannerAPI(payload);
      setCfg(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  // ── reset ──
  const reset = () => {
    setDraft(DEFAULTS);
    setSaved(false);
  };

  // ── patch helper ──
  const patch = (key: string, val: any) => {
    setSaved(false);
    setDraft((d) => ({ ...d, [key]: val }));
  };

  // ── loading state ──
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
        <Loader2 size={32} style={{ animation: "spin 1s linear infinite", color: "var(--admin-text-dim)" }} />
      </div>
    );
  }

  const isLive = cfg?.active ?? false;

  return (
    <div>
      {/* ── Error ── */}
      {error && (
        <div
          style={{
            display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderRadius: 14,
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", marginBottom: 20,
            color: "#fca5a5", fontSize: 14,
          }}
        >
          <AlertCircle size={18} color="#ef4444" />
          {error}
        </div>
      )}

      {/* ═══ Live Status Banner ═══ */}
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap",
          gap: 14, padding: "18px 22px", borderRadius: 18, marginBottom: 24,
          background: isLive
            ? "linear-gradient(135deg, rgba(255,153,51,0.10), rgba(19,136,8,0.08))"
            : "rgba(255,255,255,0.02)",
          border: `1px solid ${isLive ? "rgba(255,153,51,0.35)" : "var(--admin-border)"}`,
          boxShadow: isLive ? "0 8px 30px -8px rgba(255,153,51,0.18)" : "none",
          transition: "all 0.5s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <StatusDot live={isLive} />
          <span style={{ fontSize: 15, fontWeight: 700, color: isLive ? "#fff" : "var(--admin-text-muted)" }}>
            {isLive ? "Banner is LIVE on website" : "Banner is currently OFF"}
          </span>
        </div>
        {isLive && cfg && (
          <span style={{ fontSize: 12, color: "var(--admin-text-dim)" }}>
            Showing: "{cfg.text}"
          </span>
        )}
      </div>

      {/* ═══ Config Card ═══ */}
      <div
        style={{
          background: "var(--admin-bg-card)", borderRadius: 22, border: "1px solid var(--admin-border)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)", overflow: "hidden",
        }}
      >
        {/* ── Card Header ── */}
        <div
          style={{
            padding: "22px 26px", borderBottom: "1px solid var(--admin-border)",
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 46, height: 46, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
                background: "linear-gradient(135deg, rgba(255,153,51,0.18), rgba(19,136,8,0.12))",
                border: "1px solid rgba(255,153,51,0.3)",
              }}
            >
              <Flag size={22} color="#FF9933" />
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>Festive Banner Configuration</div>
              <div style={{ fontSize: 12, color: "var(--admin-text-dim)", marginTop: 2 }}>
                Control the celebration decoration on the hero section
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={reset}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 12,
                background: "rgba(255,255,255,0.04)", border: "1px solid var(--admin-border)", cursor: "pointer",
                fontSize: 13, fontWeight: 600, color: "var(--admin-text-muted)", transition: "all 0.3s",
              }}
            >
              <RotateCcw size={14} /> Reset
            </button>
            <button
              onClick={save}
              disabled={saving}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "10px 22px", borderRadius: 12,
                background: saved ? "rgba(16,185,129,0.15)" : "linear-gradient(135deg, #FF9933, #138808)",
                border: saved ? "1px solid rgba(16,185,129,0.4)" : "1px solid rgba(255,153,51,0.5)",
                cursor: saving ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 700, color: "#fff",
                boxShadow: saved ? "0 0 20px rgba(16,185,129,0.2)" : "0 4px 20px rgba(255,153,51,0.3)",
                transition: "all 0.35s", opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                : saved ? <CheckCircle2 size={14} color="#10b981" />
                : <Save size={14} />}
              {saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </div>

        {/* ── Config Body ── */}
        <div style={{ padding: "26px 26px 30px", display: "flex", flexDirection: "column", gap: 28 }}>

          {/* ──── Row 1: Master Toggle ──── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Power size={18} color={draft.enabled ? "#22c55e" : "var(--admin-text-dim)"} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Enable Banner</div>
                <div style={{ fontSize: 12, color: "var(--admin-text-dim)" }}>Master switch to show/hide the festive decoration</div>
              </div>
            </div>
            <button
              onClick={() => patch("enabled", !draft.enabled)}
              style={{
                width: 54, height: 30, borderRadius: 15, padding: 3, cursor: "pointer",
                background: draft.enabled ? "linear-gradient(135deg, #FF9933, #138808)" : "rgba(255,255,255,0.08)",
                border: `1px solid ${draft.enabled ? "rgba(255,153,51,0.5)" : "var(--admin-border)"}`,
                transition: "all 0.35s", position: "relative",
              }}
            >
              <div
                style={{
                  width: 22, height: 22, borderRadius: "50%", background: "#fff",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                  transform: draft.enabled ? "translateX(24px)" : "translateX(0)",
                  transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
                }}
              />
            </button>
          </div>

          {/* ──── Row 2: Banner Text ──── */}
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, fontSize: 13, fontWeight: 700, color: "var(--admin-text-muted)" }}>
              <Sparkles size={14} color="#f59e0b" /> Banner Text
            </label>
            <input
              type="text"
              value={draft.text}
              onChange={(e) => patch("text", e.target.value)}
              placeholder="Celebrating 80th Independence Day 🇮🇳"
              style={{
                width: "100%", padding: "14px 18px", borderRadius: 14, fontSize: 15, fontWeight: 600,
                background: "rgba(255,255,255,0.04)", border: "1px solid var(--admin-border)",
                color: "#fff", outline: "none", transition: "border 0.3s, box-shadow 0.3s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(255,153,51,0.5)";
                e.target.style.boxShadow = "0 0 16px rgba(255,153,51,0.12)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--admin-border)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* ──── Row 3: Colors + Intensity ──── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}>
            {/* Color 1 */}
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, fontSize: 13, fontWeight: 700, color: "var(--admin-text-muted)" }}>
                <Palette size={14} color={draft.color1} /> Left Glow Color
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ position: "relative" }}>
                  <input
                    type="color"
                    value={draft.color1}
                    onChange={(e) => patch("color1", e.target.value)}
                    style={{
                      width: 48, height: 48, borderRadius: 12, border: "2px solid var(--admin-border)",
                      cursor: "pointer", background: "transparent", padding: 0,
                    }}
                  />
                </div>
                <input
                  type="text"
                  value={draft.color1}
                  onChange={(e) => patch("color1", e.target.value)}
                  style={{
                    flex: 1, padding: "12px 14px", borderRadius: 12, fontSize: 13, fontFamily: "monospace",
                    background: "rgba(255,255,255,0.04)", border: "1px solid var(--admin-border)",
                    color: "#fff", outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Color 2 */}
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, fontSize: 13, fontWeight: 700, color: "var(--admin-text-muted)" }}>
                <Palette size={14} color={draft.color2} /> Right Glow Color
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ position: "relative" }}>
                  <input
                    type="color"
                    value={draft.color2}
                    onChange={(e) => patch("color2", e.target.value)}
                    style={{
                      width: 48, height: 48, borderRadius: 12, border: "2px solid var(--admin-border)",
                      cursor: "pointer", background: "transparent", padding: 0,
                    }}
                  />
                </div>
                <input
                  type="text"
                  value={draft.color2}
                  onChange={(e) => patch("color2", e.target.value)}
                  style={{
                    flex: 1, padding: "12px 14px", borderRadius: 12, fontSize: 13, fontFamily: "monospace",
                    background: "rgba(255,255,255,0.04)", border: "1px solid var(--admin-border)",
                    color: "#fff", outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Intensity */}
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, fontSize: 13, fontWeight: 700, color: "var(--admin-text-muted)" }}>
                <Sun size={14} color="#f59e0b" /> Glow Intensity
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={draft.intensity}
                  onChange={(e) => patch("intensity", parseFloat(e.target.value))}
                  style={{
                    flex: 1, height: 6, borderRadius: 3, appearance: "none", outline: "none", cursor: "pointer",
                    background: `linear-gradient(90deg, ${draft.color1} 0%, ${draft.color2} 100%)`,
                  }}
                />
                <span
                  style={{
                    fontSize: 14, fontWeight: 700, fontFamily: "monospace", color: "#fff",
                    minWidth: 40, textAlign: "right",
                  }}
                >
                  {Math.round(draft.intensity * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* ──── Row 4: Ashoka Chakra Toggle ──── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <MiniChakra size={20} spinning={draft.showChakra} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Ashoka Chakra</div>
                <div style={{ fontSize: 12, color: "var(--admin-text-dim)" }}>Show spinning chakra accent on desktop</div>
              </div>
            </div>
            <button
              onClick={() => patch("showChakra", !draft.showChakra)}
              style={{
                width: 54, height: 30, borderRadius: 15, padding: 3, cursor: "pointer",
                background: draft.showChakra ? "rgba(0,0,128,0.4)" : "rgba(255,255,255,0.08)",
                border: `1px solid ${draft.showChakra ? "rgba(0,0,128,0.6)" : "var(--admin-border)"}`,
                transition: "all 0.35s", position: "relative",
              }}
            >
              <div
                style={{
                  width: 22, height: 22, borderRadius: "50%", background: "#fff",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                  transform: draft.showChakra ? "translateX(24px)" : "translateX(0)",
                  transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
                }}
              />
            </button>
          </div>

          {/* ──── Row 5: Date/Time Range ──── */}
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, fontSize: 13, fontWeight: 700, color: "var(--admin-text-muted)" }}>
              <Clock size={14} color="#0ea5e9" /> Schedule (Optional)
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              <div>
                <label style={{ fontSize: 12, color: "var(--admin-text-dim)", marginBottom: 6, display: "block" }}>
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={toLocalISO(draft.startAt)}
                  onChange={(e) => patch("startAt", e.target.value ? toUTC(e.target.value) : null)}
                  style={{
                    width: "100%", padding: "12px 14px", borderRadius: 12, fontSize: 13,
                    background: "rgba(255,255,255,0.04)", border: "1px solid var(--admin-border)",
                    color: "#fff", outline: "none", colorScheme: "dark", boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--admin-text-dim)", marginBottom: 6, display: "block" }}>
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={toLocalISO(draft.endAt)}
                  onChange={(e) => patch("endAt", e.target.value ? toUTC(e.target.value) : null)}
                  style={{
                    width: "100%", padding: "12px 14px", borderRadius: 12, fontSize: 13,
                    background: "rgba(255,255,255,0.04)", border: "1px solid var(--admin-border)",
                    color: "#fff", outline: "none", colorScheme: "dark", boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
            <p style={{ fontSize: 11, color: "var(--admin-text-dim)", marginTop: 8, lineHeight: 1.5 }}>
              Leave empty for no time restriction. Banner shows when enabled AND current time is within the range.
            </p>
          </div>
        </div>
      </div>

      {/* ═══ Live Preview Card ═══ */}
      <div
        style={{
          marginTop: 28, borderRadius: 22, overflow: "hidden",
          border: "1px solid var(--admin-border)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          background: "var(--admin-bg-card)",
        }}
      >
        <div
          style={{
            padding: "16px 22px", borderBottom: "1px solid var(--admin-border)",
            display: "flex", alignItems: "center", gap: 10,
          }}
        >
          <Eye size={16} color="#0ea5e9" />
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--admin-text-muted)" }}>Live Preview</span>
        </div>

        <div
          style={{
            padding: "40px 26px", textAlign: "center",
            background: draft.enabled
              ? `radial-gradient(ellipse at 0% 0%, ${draft.color1}22 0%, transparent 50%), radial-gradient(ellipse at 100% 0%, ${draft.color2}22 0%, transparent 50%), var(--admin-bg-card)`
              : "var(--admin-bg-card)",
            transition: "background 0.6s ease",
          }}
        >
          {draft.enabled ? (
            <div
              style={{
                display: "inline-flex", alignItems: "center", gap: 12, padding: "12px 28px",
                borderRadius: 999, position: "relative", overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: `0 4px 24px ${draft.color1}40`,
                background: `linear-gradient(90deg, ${draft.color1}25 0%, rgba(30,41,59,0.6) 50%, ${draft.color2}25 100%)`,
              }}
            >
              {/* Shimmer */}
              <div
                style={{
                  position: "absolute", inset: 0, transform: "skewX(-12deg)",
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                  animation: "festiveShimmer 3s ease-in-out infinite",
                }}
              />
              {draft.showChakra && (
                <span style={{ position: "relative", zIndex: 1 }}>
                  <MiniChakra size={18} spinning />
                </span>
              )}
              <span
                style={{
                  position: "relative", zIndex: 1, fontSize: 14, fontWeight: 800, letterSpacing: "0.04em",
                  backgroundImage: `linear-gradient(90deg, ${draft.color1}, #fff 55%, ${draft.color2})`,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {draft.text || "Your banner text here…"}
              </span>
            </div>
          ) : (
            <div style={{ color: "var(--admin-text-dim)", fontSize: 14, fontStyle: "italic" }}>
              Banner is disabled — enable it to see a preview
            </div>
          )}
        </div>
      </div>

      {/* ── Keyframe styles ── */}
      <style>{`
        @keyframes festiveChakraSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes festiveShimmer {
          0% { transform: translateX(-120%) skewX(-12deg); }
          50% { transform: translateX(120%) skewX(-12deg); }
          100% { transform: translateX(120%) skewX(-12deg); }
        }
        @keyframes festivePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px; height: 18px; border-radius: 50%;
          background: #fff; border: 2px solid rgba(255,153,51,0.6);
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default FestiveBannerManager;
