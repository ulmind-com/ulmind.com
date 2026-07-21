/* ──────────────────────────────────────────────────────────────
   Notification Dashboard
   ----------------------------------------------------------------
   Every alert is actionable: open the record it refers to, toggle
   read state, or dismiss it. Filters are derived from the data that
   actually exists, so nothing can end up unreachable.
   ────────────────────────────────────────────────────────────── */

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2, Bell, AlertTriangle, Zap, Info, Search, Trash2,
  ArrowUpRight, Mail, MailOpen, Sparkles, ShieldAlert, Inbox,
  RefreshCw, Wifi, WifiOff, CheckCheck,
} from "lucide-react";
import { useWebSocket, Notification } from "../context/WebSocketContext";

/* ── Priority system ──────────────────────────────────────────
   Historical rows use "Warning" and "Info" alongside the current
   four levels, so both vocabularies are normalised here. Without
   this a "Warning" alert matched no filter chip and was invisible. */
type Level = "Critical" | "High" | "Medium" | "Low";

const normalisePriority = (raw?: string): Level => {
  switch ((raw || "").toLowerCase()) {
    case "critical": return "Critical";
    case "high":
    case "warning": return "High";
    case "low":
    case "info": return "Low";
    default: return "Medium";
  }
};

const LEVEL_STYLE: Record<Level, { color: string; glow: string; icon: React.ReactNode; label: string }> = {
  Critical: { color: "#f43f5e", glow: "rgba(244,63,94,0.35)", icon: <ShieldAlert size={17} />, label: "Critical" },
  High:     { color: "#f59e0b", glow: "rgba(245,158,11,0.30)", icon: <AlertTriangle size={17} />, label: "High" },
  Medium:   { color: "#0ea5e9", glow: "rgba(14,165,233,0.28)", icon: <Zap size={17} />, label: "Medium" },
  Low:      { color: "#10b981", glow: "rgba(16,185,129,0.25)", icon: <Info size={17} />, label: "Low" },
};

const LEVELS: Level[] = ["Critical", "High", "Medium", "Low"];

/* ── Time helpers ─────────────────────────────────────────── */
const relativeTime = (iso: string) => {
  const then = new Date(iso).getTime();
  if (isNaN(then)) return "";
  const diff = Date.now() - then;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const dayBucket = (iso: string) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "Earlier";
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const same = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (same(d, today)) return "Today";
  if (same(d, yesterday)) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
};

const NotificationDashboardPage: React.FC = () => {
  const {
    notifications, unreadCount, loading, connected,
    refresh, markAllRead, markAsRead, markAsUnread, removeNotification, clearRead,
  } = useWebSocket();
  const navigate = useNavigate();

  const [level, setLevel] = useState<"All" | Level>("All");
  const [category, setCategory] = useState("All");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  /* Categories come from the data, never a hardcoded list. */
  const categories = useMemo(() => {
    const found = new Set<string>();
    notifications.forEach((n) => found.add(n.category || "System"));
    return ["All", ...Array.from(found).sort()];
  }, [notifications]);

  const counts = useMemo(() => {
    const byLevel: Record<string, number> = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    notifications.forEach((n) => { byLevel[normalisePriority(n.priority)] += 1; });
    return byLevel;
  }, [notifications]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return notifications.filter((n) => {
      if (level !== "All" && normalisePriority(n.priority) !== level) return false;
      if (category !== "All" && (n.category || "System") !== category) return false;
      if (unreadOnly && n.is_read) return false;
      if (q && ![n.title, n.message, n.category, n.type, n.actor]
        .some((f) => (f || "").toLowerCase().includes(q))) return false;
      return true;
    });
  }, [notifications, level, category, unreadOnly, search]);

  /* Grouped by day so a long list stays readable. */
  const groups = useMemo(() => {
    const map = new Map<string, Notification[]>();
    filtered.forEach((n) => {
      const key = dayBucket(n.created_at);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(n);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const openNotification = (n: Notification) => {
    if (!n.is_read) markAsRead(n._id);
    if (n.link) navigate(n.link);
  };

  const readCount = notifications.length - unreadCount;

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "24px 24px 64px" }}>
      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, flexWrap: "wrap", marginBottom: 28 }}>
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <div style={{
            width: 56, height: 56, borderRadius: 18, flexShrink: 0,
            background: "linear-gradient(140deg, rgba(244,63,94,0.22), rgba(14,165,233,0.18))",
            border: "1px solid rgba(255,255,255,0.10)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 30px rgba(244,63,94,0.16), inset 0 1px 0 rgba(255,255,255,0.12)",
          }}>
            <Bell size={24} color="#fb7185" />
          </div>
          <div>
            <h1 style={{ fontSize: 30, fontWeight: 700, margin: 0, letterSpacing: "-0.025em", lineHeight: 1.15 }}>
              Notifications
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6, flexWrap: "wrap" }}>
              <span style={{ color: "var(--admin-text-muted)", fontSize: 14 }}>
                {unreadCount > 0 ? `${unreadCount} unread of ${notifications.length}` : `${notifications.length} alerts · all caught up`}
              </span>
              {/* Honest live indicator instead of an unconditional "AI powered" claim. */}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 600,
                padding: "3px 9px", borderRadius: 999,
                color: connected ? "#34d399" : "var(--admin-text-dim)",
                background: connected ? "rgba(16,185,129,0.10)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${connected ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.07)"}`,
              }}>
                {connected ? <Wifi size={11} /> : <WifiOff size={11} />}
                {connected ? "Live" : "Reconnecting"}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <GhostButton onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw size={14} style={{ animation: refreshing ? "spin 0.9s linear infinite" : undefined }} />
            Refresh
          </GhostButton>
          <GhostButton onClick={markAllRead} disabled={unreadCount === 0}>
            <CheckCheck size={14} /> Mark all read
          </GhostButton>
          <GhostButton onClick={clearRead} disabled={readCount === 0} danger>
            <Trash2 size={14} /> Clear read ({readCount})
          </GhostButton>
        </div>
      </div>

      {/* ── Stat tiles double as filters ── */}
      {/* minmax(150px) keeps two tiles per row on a phone instead of four
          full-width blocks that push the list below the fold. */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 22 }}>
        <StatTile
          label="Unread" value={unreadCount} icon={<Inbox size={16} />} accent="#fb7185"
          active={unreadOnly}
          onClick={() => { setUnreadOnly((v) => !v); setLevel("All"); }}
        />
        {LEVELS.slice(0, 3).map((lv) => (
          <StatTile
            key={lv}
            label={lv} value={counts[lv]} icon={LEVEL_STYLE[lv].icon} accent={LEVEL_STYLE[lv].color}
            active={level === lv}
            onClick={() => setLevel((cur) => (cur === lv ? "All" : lv))}
          />
        ))}
      </div>

      {/* ── Filter bar ── */}
      <div className="admin-glass-panel" style={{
        padding: 14, marginBottom: 24, display: "flex", gap: 14,
        alignItems: "center", flexWrap: "wrap",
      }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center", flex: "1 1 260px", minWidth: 220 }}>
          <Search size={15} style={{ position: "absolute", left: 13, color: "var(--admin-text-dim)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notifications..."
            style={{
              width: "100%", background: "rgba(0,0,0,0.28)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 11, padding: "10px 14px 10px 38px", color: "var(--admin-text)",
              fontSize: 13.5, outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {(["All", ...LEVELS] as const).map((lv) => {
            const isActive = level === lv;
            const accent = lv === "All" ? "#94a3b8" : LEVEL_STYLE[lv as Level].color;
            return (
              <button
                key={lv}
                onClick={() => setLevel(lv as any)}
                style={{
                  padding: "7px 15px", borderRadius: 999, cursor: "pointer", fontSize: 12.5, fontWeight: 600,
                  background: isActive ? `${accent}22` : "rgba(255,255,255,0.03)",
                  color: isActive ? accent : "var(--admin-text-muted)",
                  border: `1px solid ${isActive ? `${accent}55` : "rgba(255,255,255,0.07)"}`,
                  transition: "all 0.18s",
                }}
              >
                {lv}
              </button>
            );
          })}
        </div>

        {categories.length > 2 && (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              background: "rgba(0,0,0,0.28)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 11, padding: "9px 13px", color: "var(--admin-text)",
              fontSize: 13, outline: "none", cursor: "pointer",
            }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c === "All" ? "All categories" : c}</option>
            ))}
          </select>
        )}
      </div>

      {/* ── List ── */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          filtered={notifications.length > 0}
          onReset={() => { setLevel("All"); setCategory("All"); setUnreadOnly(false); setSearch(""); }}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          {groups.map(([day, items]) => (
            <div key={day}>
              <div style={{
                display: "flex", alignItems: "center", gap: 12, marginBottom: 12,
                color: "var(--admin-text-dim)", fontSize: 11.5, fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.09em",
              }}>
                {day}
                <span style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(255,255,255,0.09), transparent)" }} />
                <span style={{ fontWeight: 600, letterSpacing: 0 }}>{items.length}</span>
              </div>

              {/* No AnimatePresence here: its exit handling kept filtered-out
                  rows mounted forever, so the list stopped matching the
                  filters. Rows animate in and are removed immediately. */}
              <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                {items.map((n) => (
                  <NotificationRow
                    key={n._id}
                    notification={n}
                    onOpen={() => openNotification(n)}
                    onToggleRead={() => (n.is_read ? markAsUnread(n._id) : markAsRead(n._id))}
                    onDelete={() => removeNotification(n._id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes notif-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
        /* Touch devices have no hover, so the row actions must stay visible. */
        @media (hover: none) { .notif-row-actions { opacity: 1 !important; } }
      `}</style>
    </div>
  );
};

/* ── Row ─────────────────────────────────────────────────────── */
const NotificationRow: React.FC<{
  notification: Notification;
  onOpen: () => void;
  onToggleRead: () => void;
  onDelete: () => void;
}> = ({ notification: n, onOpen, onToggleRead, onDelete }) => {
  const [hover, setHover] = useState(false);
  const level = normalisePriority(n.priority);
  const { color, glow, icon } = LEVEL_STYLE[level];
  const unread = !n.is_read;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative", overflow: "hidden", borderRadius: 16,
        background: unread
          ? `linear-gradient(100deg, ${color}0e 0%, rgba(14,18,30,0.72) 42%)`
          : "rgba(14,18,30,0.46)",
        border: `1px solid ${unread ? `${color}2e` : "rgba(255,255,255,0.06)"}`,
        boxShadow: hover ? `0 12px 32px rgba(0,0,0,0.36), 0 0 0 1px ${color}22` : "0 1px 2px rgba(0,0,0,0.2)",
        transform: hover ? "translateY(-1px)" : "none",
        transition: "box-shadow 0.2s, transform 0.2s, border-color 0.2s",
      }}
    >
      {/* priority rail */}
      <span style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
        background: unread ? color : `${color}44`,
        boxShadow: unread ? `0 0 14px ${glow}` : "none",
      }} />

      <div style={{ display: "flex", gap: 15, padding: "17px 18px 17px 21px", alignItems: "flex-start" }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: `${color}17`, border: `1px solid ${color}2e`, color,
          boxShadow: unread ? `0 0 18px ${glow}` : "none",
        }}>
          {icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "baseline" }}>
            <h3
              onClick={onOpen}
              style={{
                margin: 0, fontSize: 15.5, fontWeight: unread ? 650 : 550,
                color: unread ? "#fff" : "var(--admin-text-muted)",
                cursor: n.link ? "pointer" : "default",
                display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
              }}
            >
              {n.title}
              {unread && (
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}`, flexShrink: 0 }} />
              )}
            </h3>
            <span
              title={new Date(n.created_at).toLocaleString("en-IN")}
              style={{ fontSize: 11.5, color: "var(--admin-text-dim)", whiteSpace: "nowrap", flexShrink: 0 }}
            >
              {relativeTime(n.created_at)}
            </span>
          </div>

          <p style={{ margin: "6px 0 0", color: "var(--admin-text-muted)", fontSize: 13.5, lineHeight: 1.55 }}>
            {n.message}
          </p>

          <div style={{ display: "flex", gap: 7, marginTop: 13, alignItems: "center", flexWrap: "wrap" }}>
            <Chip>{n.category || "System"}</Chip>
            <Chip tone={color}>{level}</Chip>
            {n.actor && <Chip subtle>{n.actor}</Chip>}
            {/* Only claim AI when the alert really was AI-written. */}
            {n.ai_generated && (
              <Chip tone="#a78bfa"><Sparkles size={10} style={{ marginRight: 4 }} />AI insight</Chip>
            )}
            {n.link && (
              <button
                onClick={onOpen}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 5, marginLeft: "auto",
                  background: "rgba(56,189,248,0.10)", border: "1px solid rgba(56,189,248,0.22)",
                  color: "#38bdf8", fontSize: 12, fontWeight: 600, padding: "5px 11px",
                  borderRadius: 8, cursor: "pointer",
                }}
              >
                {n.recommended_action || "Open"} <ArrowUpRight size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Row actions */}
        <div className="notif-row-actions" style={{
          display: "flex", flexDirection: "column", gap: 6, flexShrink: 0,
          opacity: hover ? 1 : 0.25, transition: "opacity 0.18s",
        }}>
          <IconButton title={n.is_read ? "Mark as unread" : "Mark as read"} onClick={onToggleRead}>
            {n.is_read ? <Mail size={14} /> : <MailOpen size={14} />}
          </IconButton>
          <IconButton title="Delete" onClick={onDelete} danger>
            <Trash2 size={14} />
          </IconButton>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Small pieces ─────────────────────────────────────────────── */
const Chip: React.FC<{ children: React.ReactNode; tone?: string; subtle?: boolean }> = ({ children, tone, subtle }) => (
  <span style={{
    display: "inline-flex", alignItems: "center",
    padding: "3.5px 9px", borderRadius: 7, fontSize: 11, fontWeight: 600,
    background: tone ? `${tone}16` : "rgba(255,255,255,0.045)",
    color: tone || (subtle ? "var(--admin-text-dim)" : "var(--admin-text-muted)"),
    border: `1px solid ${tone ? `${tone}2b` : "rgba(255,255,255,0.06)"}`,
    whiteSpace: "nowrap",
  }}>
    {children}
  </span>
);

const IconButton: React.FC<{
  children: React.ReactNode; title: string; onClick: () => void; danger?: boolean;
}> = ({ children, title, onClick, danger }) => {
  const [hover, setHover] = useState(false);
  const accent = danger ? "#f43f5e" : "#38bdf8";
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 30, height: 30, borderRadius: 9, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: hover ? `${accent}1f` : "rgba(255,255,255,0.04)",
        border: `1px solid ${hover ? `${accent}44` : "rgba(255,255,255,0.07)"}`,
        color: hover ? accent : "var(--admin-text-dim)",
        transition: "all 0.16s",
      }}
    >
      {children}
    </button>
  );
};

const GhostButton: React.FC<{
  children: React.ReactNode; onClick: () => void; disabled?: boolean; danger?: boolean;
}> = ({ children, onClick, disabled, danger }) => {
  const [hover, setHover] = useState(false);
  const accent = danger ? "#f43f5e" : "#38bdf8";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 7,
        padding: "9px 15px", borderRadius: 11, fontSize: 13, fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.38 : 1,
        background: hover && !disabled ? `${accent}18` : "rgba(255,255,255,0.04)",
        border: `1px solid ${hover && !disabled ? `${accent}3d` : "rgba(255,255,255,0.08)"}`,
        color: hover && !disabled ? accent : "var(--admin-text)",
        transition: "all 0.16s",
      }}
    >
      {children}
    </button>
  );
};

const StatTile: React.FC<{
  label: string; value: number; icon: React.ReactNode; accent: string;
  active: boolean; onClick: () => void;
}> = ({ label, value, icon, accent, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      textAlign: "left", cursor: "pointer", padding: "14px 16px", borderRadius: 15,
      background: active
        ? `linear-gradient(140deg, ${accent}1f, rgba(14,18,30,0.7))`
        : "rgba(14,18,30,0.5)",
      border: `1px solid ${active ? `${accent}55` : "rgba(255,255,255,0.07)"}`,
      boxShadow: active ? `0 8px 26px ${accent}1f` : "none",
      transition: "all 0.2s",
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--admin-text-muted)" }}>{label}</span>
      <span style={{ color: accent, display: "flex" }}>{icon}</span>
    </div>
    <div style={{ fontSize: 24, fontWeight: 700, color: value > 0 ? "#fff" : "var(--admin-text-dim)", lineHeight: 1 }}>
      {value}
    </div>
  </button>
);

const Skeleton: React.FC = () => (
  <div style={{
    height: 98, borderRadius: 16, background: "rgba(14,18,30,0.5)",
    border: "1px solid rgba(255,255,255,0.05)",
    animation: "notif-pulse 1.6s ease-in-out infinite",
  }} />
);

const EmptyState: React.FC<{ filtered: boolean; onReset: () => void }> = ({ filtered, onReset }) => (
  <div className="admin-glass-panel" style={{ textAlign: "center", padding: "72px 24px" }}>
    <div style={{
      width: 68, height: 68, borderRadius: 22, margin: "0 auto 20px",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.20)",
    }}>
      <CheckCircle2 size={30} color="#34d399" />
    </div>
    <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 650 }}>
      {filtered ? "Nothing matches these filters" : "You're all caught up"}
    </h3>
    <p style={{ margin: 0, color: "var(--admin-text-muted)", fontSize: 14 }}>
      {filtered ? "Try widening your search." : "New alerts will appear here the moment they happen."}
    </p>
    {filtered && (
      <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
        <GhostButton onClick={onReset}>Clear filters</GhostButton>
      </div>
    )}
  </div>
);

export default NotificationDashboardPage;
