/* ──────────────────────────────────────────────────────────────
   ULMiND Admin — Marketing Outreach Tracker
   Premium list of marketing links with animated "Message Sent"
   tracking + client remarks.

   Data layer: self-contained localStorage store (see marketingStore
   below). It is intentionally isolated so it can later be swapped
   for a backend API without touching the UI.
   ────────────────────────────────────────────────────────────── */

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone, Plus, X, Trash2, ExternalLink, Search, Check,
  MessageSquarePlus, Send, Sparkles, Clock, Target, CheckCircle2,
  Link as LinkIcon, User as UserIcon
} from "lucide-react";
import { useAuth } from "../context/auth-context";
import { useAdminAction } from "../context/AdminActionContext";

/* ── Types ─────────────────────────────────────────────────── */
interface Remark {
  id: string;
  text: string;
  at: string;      // ISO
  author: string;
}
interface MarketingLink {
  id: string;
  label: string;
  platform: string;
  url: string;
  client: string;
  sent: boolean;
  sentAt: string | null;
  remarks: Remark[];
  createdAt: string;
}

/* ── Platform palette (different premium colors per channel) ── */
const PLATFORMS: Record<string, { label: string; grad: string; glow: string; ring: string }> = {
  whatsapp:  { label: "WhatsApp",  grad: "linear-gradient(135deg,#25D366,#128C7E)", glow: "rgba(37,211,102,0.35)",  ring: "#25D366" },
  instagram: { label: "Instagram", grad: "linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)", glow: "rgba(238,42,123,0.35)", ring: "#ee2a7b" },
  facebook:  { label: "Facebook",  grad: "linear-gradient(135deg,#1877F2,#0a4bb3)", glow: "rgba(24,119,242,0.35)", ring: "#1877F2" },
  linkedin:  { label: "LinkedIn",  grad: "linear-gradient(135deg,#0A66C2,#004182)", glow: "rgba(10,102,194,0.35)", ring: "#0A66C2" },
  email:     { label: "Email",     grad: "linear-gradient(135deg,#f59e0b,#d97706)", glow: "rgba(245,158,11,0.35)", ring: "#f59e0b" },
  twitter:   { label: "X / Twitter", grad: "linear-gradient(135deg,#3a3a3a,#0f0f0f)", glow: "rgba(120,120,120,0.35)", ring: "#8b8b8b" },
  website:   { label: "Website",   grad: "linear-gradient(135deg,#8b5cf6,#6d28d9)", glow: "rgba(139,92,246,0.35)", ring: "#8b5cf6" },
  other:     { label: "Other",     grad: "linear-gradient(135deg,#14b8a6,#0f766e)", glow: "rgba(20,184,166,0.35)", ring: "#14b8a6" },
};
const platformOf = (k: string) => PLATFORMS[k] || PLATFORMS.other;

/* ── Local persistence store ───────────────────────────────── */
const STORAGE_KEY = "ulmind_marketing_links";
const marketingStore = {
  load(): MarketingLink[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch { /* ignore */ }
    return SEED;
  },
  save(items: MarketingLink[]) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* ignore */ }
  },
};

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const SEED: MarketingLink[] = [
  { id: uid(), label: "Diwali Web Offer — Landing", platform: "whatsapp", url: "https://ulmind.com/offers/diwali", client: "Sharma Textiles", sent: true, sentAt: new Date(Date.now() - 864e5).toISOString(), remarks: [{ id: uid(), text: "Interested, asked for a callback tomorrow.", at: new Date(Date.now() - 82e6).toISOString(), author: "Admin" }], createdAt: new Date(Date.now() - 2 * 864e5).toISOString() },
  { id: uid(), label: "New Portfolio Showcase", platform: "instagram", url: "https://instagram.com/ulmind", client: "GreenLeaf Cafe", sent: false, sentAt: null, remarks: [], createdAt: new Date(Date.now() - 864e5).toISOString() },
  { id: uid(), label: "Enterprise Plan Proposal", platform: "email", url: "https://ulmind.com/proposal", client: "Nexa Corp", sent: false, sentAt: null, remarks: [], createdAt: new Date().toISOString() },
];

/* ── Helpers ───────────────────────────────────────────────── */
const fmt = (iso: string | null) => {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date(iso));
};
const rel = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 864e5);
  if (d > 0) return `${d}d ago`;
  const h = Math.floor(diff / 36e5);
  if (h > 0) return `${h}h ago`;
  const m = Math.floor(diff / 6e4);
  return m > 0 ? `${m}m ago` : "just now";
};

/* ══════════════════════════════════════════════════════════════
   Animated Sent Checkbox
   ══════════════════════════════════════════════════════════════ */
const SentCheck: React.FC<{ sent: boolean; ring: string; onToggle: () => void }> = ({ sent, ring, onToggle }) => {
  const [burst, setBurst] = useState(false);
  const handle = () => {
    if (!sent) { setBurst(true); setTimeout(() => setBurst(false), 700); }
    onToggle();
  };
  return (
    <motion.button
      onClick={handle}
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.08 }}
      title={sent ? "Marked as messaged — click to undo" : "Mark message as sent"}
      style={{
        position: "relative", width: 40, height: 40, borderRadius: 12, cursor: "pointer",
        border: `2px solid ${sent ? ring : "rgba(255,255,255,0.18)"}`,
        background: sent ? `linear-gradient(135deg,${ring},rgba(0,0,0,0.2))` : "rgba(255,255,255,0.03)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: sent ? `0 0 18px ${ring}66, inset 0 1px 0 rgba(255,255,255,0.25)` : "none",
        transition: "background .3s, border-color .3s, box-shadow .3s", flexShrink: 0,
      }}
    >
      <AnimatePresence>
        {sent && (
          <motion.svg
            key="chk" width="22" height="22" viewBox="0 0 24 24" fill="none"
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
          >
            <motion.path
              d="M4 12.5l5 5L20 6.5" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </motion.svg>
        )}
      </AnimatePresence>

      {/* Particle burst */}
      <AnimatePresence>
        {burst && [...Array(8)].map((_, i) => {
          const ang = (i / 8) * Math.PI * 2;
          return (
            <motion.span
              key={i}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: Math.cos(ang) * 26, y: Math.sin(ang) * 26, opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{ position: "absolute", width: 6, height: 6, borderRadius: "50%", background: ring, boxShadow: `0 0 8px ${ring}` }}
            />
          );
        })}
      </AnimatePresence>
    </motion.button>
  );
};

/* ══════════════════════════════════════════════════════════════
   Marketing Card Row
   ══════════════════════════════════════════════════════════════ */
const LinkCard: React.FC<{
  item: MarketingLink;
  onToggle: (id: string) => void;
  onAddRemark: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}> = ({ item, onToggle, onAddRemark, onDelete }) => {
  const p = platformOf(item.platform);
  const [remarkOpen, setRemarkOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [showSent, setShowSent] = useState(false);

  const submit = () => {
    if (!draft.trim()) return;
    onAddRemark(item.id, draft.trim());
    setDraft("");
  };
  const toggle = () => {
    const willSend = !item.sent;
    onToggle(item.id);
    if (willSend) { setShowSent(true); setTimeout(() => setShowSent(false), 1800); }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className="admin-glass-panel"
      style={{
        padding: 0, overflow: "hidden", position: "relative",
        borderColor: item.sent ? `${p.ring}55` : "var(--admin-border)",
      }}
    >
      {/* left accent bar */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: p.grad, opacity: item.sent ? 1 : 0.5 }} />

      {/* "Message Sent" celebratory flash */}
      <AnimatePresence>
        {showSent && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "absolute", inset: 0, zIndex: 5, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", background: `radial-gradient(circle at 60% 50%, ${p.glow}, transparent 70%)` }}
          >
            <motion.div
              initial={{ scale: 0.6, y: 10 }} animate={{ scale: 1, y: 0 }}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 999, background: p.grad, color: "#fff", fontWeight: 700, fontSize: 13, boxShadow: `0 8px 30px ${p.glow}` }}
            >
              <CheckCircle2 size={16} /> Message Sent
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "18px 20px 18px 24px" }}>
        {/* platform icon chip */}
        <div style={{ width: 46, height: 46, borderRadius: 14, background: p.grad, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 6px 18px ${p.glow}`, flexShrink: 0 }}>
          <Megaphone size={20} color="#fff" />
        </div>

        {/* main info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{item.label}</span>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 999, color: "#fff", background: p.grad }}>{p.label}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 6, flexWrap: "wrap" }}>
            <a href={item.url} target="_blank" rel="noopener noreferrer"
               style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, color: p.ring, textDecoration: "none", maxWidth: 340, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              <LinkIcon size={13} /> {item.url.replace(/^https?:\/\//, "")} <ExternalLink size={11} />
            </a>
            {item.client && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "var(--admin-text-muted)" }}>
                <UserIcon size={13} /> {item.client}
              </span>
            )}
          </div>

          {/* status line */}
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            {item.sent ? (
              <span className="admin-badge admin-badge-success" style={{ gap: 6 }}><Check size={12} /> Messaged · {fmt(item.sentAt)}</span>
            ) : (
              <span className="admin-badge admin-badge-warning" style={{ gap: 6 }}><Clock size={12} /> Pending outreach</span>
            )}
            <button
              onClick={() => setRemarkOpen((o) => !o)}
              className="admin-btn admin-btn-ghost"
              style={{ padding: "4px 10px", fontSize: 12, gap: 6, height: "auto" }}
            >
              <MessageSquarePlus size={13} /> Remarks
              {item.remarks.length > 0 && (
                <span style={{ background: "var(--admin-accent)", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 999, padding: "0 6px", minWidth: 16, textAlign: "center" }}>{item.remarks.length}</span>
              )}
            </button>
          </div>
        </div>

        {/* right controls */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <SentCheck sent={item.sent} ring={p.ring} onToggle={toggle} />
          <button onClick={() => onDelete(item.id)} title="Delete"
            style={{ background: "transparent", border: "none", color: "var(--admin-text-dim)", cursor: "pointer", padding: 4, borderRadius: 8 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--admin-rose)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--admin-text-dim)")}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Remarks drawer */}
      <AnimatePresence initial={false}>
        {remarkOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden", borderTop: "1px solid var(--admin-border)", background: "rgba(255,255,255,0.015)" }}
          >
            <div style={{ padding: "14px 20px 18px 24px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--admin-text-dim)", marginBottom: 10 }}>Client Remarks</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                <AnimatePresence initial={false}>
                  {item.remarks.map((r) => (
                    <motion.div key={r.id} layout initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                      style={{ display: "flex", gap: 10, padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid var(--admin-border)" }}>
                      <div style={{ width: 26, height: 26, borderRadius: "50%", background: p.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                        {r.author.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: "var(--admin-text)" }}>{r.text}</div>
                        <div style={{ fontSize: 11, color: "var(--admin-text-dim)", marginTop: 3 }}>{r.author} · {rel(r.at)}</div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {item.remarks.length === 0 && (
                  <div style={{ fontSize: 12.5, color: "var(--admin-text-dim)", fontStyle: "italic" }}>No remarks yet — add the client's response below.</div>
                )}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <input
                  className="admin-input" value={draft} onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  placeholder="Add a client remark…" style={{ flex: 1 }}
                />
                <button className="admin-btn admin-btn-primary" onClick={submit} style={{ gap: 6 }}>
                  <Send size={14} /> Add
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════
   Page
   ══════════════════════════════════════════════════════════════ */
type Filter = "all" | "sent" | "pending";

const MarketingPage: React.FC = () => {
  const { user } = useAuth();
  const { triggerActionAnimation } = useAdminAction();
  const author = user?.email?.split("@")[0] || "Admin";
  const [items, setItems] = useState<MarketingLink[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);

  // add-form state
  const [f, setF] = useState({ label: "", platform: "whatsapp", url: "", client: "" });
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setItems(marketingStore.load()); }, []);
  useEffect(() => { if (items.length) marketingStore.save(items); }, [items]);
  useEffect(() => { if (adding) firstFieldRef.current?.focus(); }, [adding]);

  const persist = (next: MarketingLink[]) => { setItems(next); marketingStore.save(next); };

  const toggle = (id: string) => persist(items.map((it) => it.id === id ? { ...it, sent: !it.sent, sentAt: !it.sent ? new Date().toISOString() : null } : it));
  const addRemark = (id: string, text: string) => persist(items.map((it) => it.id === id ? { ...it, remarks: [...it.remarks, { id: uid(), text, at: new Date().toISOString(), author }] } : it));
  const remove = (id: string) => persist(items.filter((it) => it.id !== id));

  const addLink = () => {
    if (!f.label.trim() || !f.url.trim()) return;
    const url = /^https?:\/\//.test(f.url) ? f.url : `https://${f.url}`;
    persist([{ id: uid(), label: f.label.trim(), platform: f.platform, url, client: f.client.trim(), sent: false, sentAt: null, remarks: [], createdAt: new Date().toISOString() }, ...items]);
    setF({ label: "", platform: "whatsapp", url: "", client: "" });
    setAdding(false);
    triggerActionAnimation("save");
  };

  const stats = useMemo(() => {
    const total = items.length;
    const sent = items.filter((i) => i.sent).length;
    return { total, sent, pending: total - sent, rate: total ? Math.round((sent / total) * 100) : 0 };
  }, [items]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (filter === "sent" && !i.sent) return false;
      if (filter === "pending" && i.sent) return false;
      if (q && !(`${i.label} ${i.client} ${i.url} ${platformOf(i.platform).label}`.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [items, filter, query]);

  const statCards = [
    { label: "Total Links", value: stats.total, icon: Target, color: "#8b5cf6", glow: "rgba(139,92,246,0.3)" },
    { label: "Messaged", value: stats.sent, icon: CheckCircle2, color: "#10b981", glow: "rgba(16,185,129,0.3)" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "#f59e0b", glow: "rgba(245,158,11,0.3)" },
    { label: "Outreach Rate", value: `${stats.rate}%`, icon: Sparkles, color: "#f43f5e", glow: "rgba(244,63,94,0.3)" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#f43f5e,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(139,92,246,0.4)" }}>
            <Megaphone size={24} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", background: "linear-gradient(90deg,#fff,#a1a1aa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Marketing Outreach
            </h2>
            <p style={{ fontSize: 13.5, color: "#94a3b8", marginTop: 2 }}>Track every campaign link, who's been messaged, and client remarks.</p>
          </div>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={() => setAdding((a) => !a)} style={{ gap: 8 }}>
          <Plus size={16} /> Add Link
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 22 }}>
        {statCards.map((s) => (
          <motion.div key={s.label} whileHover={{ y: -3 }} className="admin-glass-panel" style={{ padding: 20, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: "50%", background: `radial-gradient(circle,${s.glow},transparent 70%)` }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500 }}>{s.label}</span>
              <s.icon size={18} color={s.color} />
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#fff" }}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Add-link panel */}
      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden", marginBottom: 20 }}
          >
            <div className="admin-glass-panel" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>New Marketing Link</span>
                <button onClick={() => setAdding(false)} style={{ background: "transparent", border: "none", color: "var(--admin-text-dim)", cursor: "pointer" }}><X size={18} /></button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
                <input ref={firstFieldRef} className="admin-input" placeholder="Campaign / link label *" value={f.label} onChange={(e) => setF({ ...f, label: e.target.value })} />
                <select className="admin-input" value={f.platform} onChange={(e) => setF({ ...f, platform: e.target.value })}>
                  {Object.entries(PLATFORMS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
                <input className="admin-input" placeholder="URL *" value={f.url} onChange={(e) => setF({ ...f, url: e.target.value })} />
                <input className="admin-input" placeholder="Client name" value={f.client} onChange={(e) => setF({ ...f, client: e.target.value })} onKeyDown={(e) => e.key === "Enter" && addLink()} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 14 }}>
                <button className="admin-btn admin-btn-ghost" onClick={() => setAdding(false)}>Cancel</button>
                <button className="admin-btn admin-btn-primary" onClick={addLink} style={{ gap: 6 }}><Plus size={15} /> Add to List</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toolbar: filters + search */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 6, background: "rgba(255,255,255,0.03)", padding: 4, borderRadius: 12, border: "1px solid var(--admin-border)" }}>
          {([["all", "All"], ["pending", "Pending"], ["sent", "Messaged"]] as [Filter, string][]).map(([k, lbl]) => (
            <button key={k} onClick={() => setFilter(k)}
              style={{
                position: "relative", padding: "7px 16px", borderRadius: 9, border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 600, background: "transparent",
                color: filter === k ? "#fff" : "var(--admin-text-dim)", transition: "color .2s",
              }}>
              {filter === k && (
                <motion.div layoutId="mkt-filter-pill" style={{ position: "absolute", inset: 0, borderRadius: 9, background: "linear-gradient(135deg,#f43f5e,#8b5cf6)", zIndex: -1 }} />
              )}
              {lbl}
            </button>
          ))}
        </div>
        <div style={{ position: "relative", flex: "0 1 320px", minWidth: 200 }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--admin-text-dim)" }} />
          <input className="admin-input" placeholder="Search links, clients…" value={query} onChange={(e) => setQuery(e.target.value)} style={{ paddingLeft: 34, width: "100%" }} />
        </div>
      </div>

      {/* List */}
      <motion.div layout style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <AnimatePresence>
          {visible.map((it) => (
            <LinkCard key={it.id} item={it} onToggle={toggle} onAddRemark={addRemark} onDelete={remove} />
          ))}
        </AnimatePresence>
        {visible.length === 0 && (
          <div className="admin-glass-panel" style={{ padding: 48, textAlign: "center" }}>
            <Megaphone size={38} color="var(--admin-text-dim)" style={{ marginBottom: 12 }} />
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--admin-text)" }}>No links here yet</div>
            <div style={{ fontSize: 13, color: "var(--admin-text-dim)", marginTop: 4 }}>
              {query || filter !== "all" ? "Try a different filter or search." : "Click “Add Link” to start tracking outreach."}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MarketingPage;
