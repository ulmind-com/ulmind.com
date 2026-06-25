import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Plus, Copy, Check, Pencil, Trash2, Search,
  X, FileUp, Download, Eye, EyeOff, FolderLock,
  Terminal, Loader2, AlertTriangle, Sparkles, Lock
} from "lucide-react";
import { toast } from "sonner";
import { authFetch } from "../../lib/api";

/* ═══════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════ */
interface EnvEntry {
  _id: string;
  project_name: string;
  env_content: string;
  var_count: number;
  preview: string;
  created_at: string;
  updated_at: string;
}

/* ═══════════════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════════════ */
const countVars = (content: string): number => {
  return content.split("\n").filter(l => {
    const t = l.trim();
    return t && !t.startsWith("#") && t.includes("=");
  }).length;
};

const relativeTime = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
};

/* ═══════════════════════════════════════════════════════════════
   Gradient accent colors per card (cycle through)
   ═══════════════════════════════════════════════════════════════ */
const GRADIENTS = [
  ["#10b981", "#06b6d4"],
  ["#8b5cf6", "#ec4899"],
  ["#f59e0b", "#ef4444"],
  ["#06b6d4", "#3b82f6"],
  ["#ec4899", "#f97316"],
  ["#14b8a6", "#a78bfa"],
];

/* ═══════════════════════════════════════════════════════════════
   CSS-in-JS (scoped inline styles)
   ═══════════════════════════════════════════════════════════════ */
const s = {
  page: {
    display: "flex", flexDirection: "column" as const, gap: 24,
    padding: "24px 32px", height: "100%", position: "relative" as const,
  },
  // background orbs
  orb1: {
    position: "absolute" as const, top: -200, right: -150, width: 500, height: 500,
    background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)",
    pointerEvents: "none" as const, zIndex: 0,
  },
  orb2: {
    position: "absolute" as const, bottom: -200, left: -100, width: 400, height: 400,
    background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)",
    pointerEvents: "none" as const, zIndex: 0,
  },
  headerRow: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-end",
    zIndex: 1, flexWrap: "wrap" as const, gap: 16,
  },
  searchWrap: {
    position: "relative" as const, width: 320,
  },
  searchInput: {
    width: "100%", background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10, padding: "10px 14px 10px 40px", color: "#fff", fontSize: 14,
    outline: "none", fontFamily: "'Inter', sans-serif",
    transition: "border-color 0.2s",
  },
  searchIcon: {
    position: "absolute" as const, left: 12, top: "50%", transform: "translateY(-50%)",
    color: "#64748b", pointerEvents: "none" as const,
  },
  grid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
    gap: 20, zIndex: 1,
  },
  // modal overlay
  overlay: {
    position: "fixed" as const, inset: 0,
    background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200,
  },
};

/* ═══════════════════════════════════════════════════════════════
   Card Component
   ═══════════════════════════════════════════════════════════════ */
interface CardProps {
  entry: EnvEntry;
  index: number;
  onCopy: (id: string, content: string) => void;
  onEdit: (entry: EnvEntry) => void;
  onDelete: (entry: EnvEntry) => void;
  onView: (entry: EnvEntry) => void;
  copiedId: string | null;
}

const EnvCard: React.FC<CardProps> = ({ entry, index, onCopy, onEdit, onDelete, onView, copiedId }) => {
  const [g1, g2] = GRADIENTS[index % GRADIENTS.length];
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: 20,
        overflow: "hidden",
        cursor: "pointer",
      }}
      onClick={() => onView(entry)}
    >
      {/* Animated gradient border */}
      <motion.div
        animate={{
          opacity: hovered ? 1 : 0.3,
          background: hovered
            ? `linear-gradient(135deg, ${g1}, ${g2})`
            : `linear-gradient(135deg, ${g1}33, ${g2}33)`,
        }}
        transition={{ duration: 0.4 }}
        style={{
          position: "absolute", inset: 0, borderRadius: 20, padding: 1, zIndex: 0,
        }}
      />

      {/* Card inner */}
      <div style={{
        position: "relative", zIndex: 1,
        margin: 1, borderRadius: 19,
        background: "rgba(10, 14, 24, 0.92)",
        backdropFilter: "blur(20px)",
        padding: 24,
        display: "flex", flexDirection: "column", gap: 16,
        minHeight: 200,
      }}>
        {/* Top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: `linear-gradient(135deg, ${g1}, ${g2})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              boxShadow: `0 4px 20px ${g1}40`,
            }}>
              <Terminal size={20} color="#fff" />
            </div>
            <div style={{ minWidth: 0 }}>
              <h3 style={{
                fontSize: 17, fontWeight: 700, color: "#fff", margin: 0,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                letterSpacing: "-0.01em",
              }}>
                {entry.project_name}
              </h3>
              <span style={{ fontSize: 12, color: "#64748b" }}>
                {relativeTime(entry.updated_at)}
              </span>
            </div>
          </div>
          {/* var count badge */}
          <div style={{
            padding: "4px 10px", borderRadius: 20,
            background: `${g1}15`, border: `1px solid ${g1}30`,
            fontSize: 12, fontWeight: 700, color: g1,
            whiteSpace: "nowrap",
          }}>
            {entry.var_count} vars
          </div>
        </div>

        {/* Preview keys */}
        <div style={{
          flex: 1, padding: "12px 14px", borderRadius: 10,
          background: "rgba(0,0,0,0.4)",
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: 12, color: "#94a3b8", lineHeight: 1.8,
          overflow: "hidden",
        }}>
          {entry.preview ? entry.preview.split(", ").map((key, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "#38bdf8" }}>{key}</span>
              <span style={{ color: "#475569" }}>=</span>
              <span style={{ color: "#475569" }}>••••••••</span>
            </div>
          )) : (
            <span style={{ color: "#475569", fontStyle: "italic" }}>Empty .env</span>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); onCopy(entry._id, entry.env_content || ""); }}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 14px", borderRadius: 10,
              background: copiedId === entry._id ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.05)",
              border: copiedId === entry._id ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(255,255,255,0.08)",
              color: copiedId === entry._id ? "#10b981" : "#e2e8f0",
              cursor: "pointer", fontSize: 12, fontWeight: 600,
              transition: "all 0.2s",
            }}
          >
            {copiedId === entry._id ? <Check size={14} /> : <Copy size={14} />}
            {copiedId === entry._id ? "Copied!" : "Copy All"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); onEdit(entry); }}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 14px", borderRadius: 10,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#e2e8f0", cursor: "pointer", fontSize: 12, fontWeight: 600,
            }}
          >
            <Pencil size={14} /> Edit
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, background: "rgba(239,68,68,0.15)" }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); onDelete(entry); }}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "8px 10px", borderRadius: 10,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#ef4444", cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <Trash2 size={14} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   Code Editor (with line numbers)
   ═══════════════════════════════════════════════════════════════ */
const CodeEditor: React.FC<{
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
}> = ({ value, onChange, readOnly = false }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumberRef = useRef<HTMLDivElement>(null);

  const lines = value.split("\n");
  const lineCount = Math.max(lines.length, 1);

  const handleScroll = () => {
    if (textareaRef.current && lineNumberRef.current) {
      lineNumberRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  return (
    <div style={{
      display: "flex", borderRadius: 12,
      background: "rgba(0,0,0,0.5)",
      border: "1px solid rgba(255,255,255,0.08)",
      overflow: "hidden", flex: 1, minHeight: 280,
    }}>
      {/* Line numbers */}
      <div
        ref={lineNumberRef}
        style={{
          padding: "16px 0", width: 48, flexShrink: 0,
          background: "rgba(0,0,0,0.3)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: 13, lineHeight: "22px", color: "#475569",
          textAlign: "right", overflowY: "hidden",
          userSelect: "none",
        }}
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i} style={{ paddingRight: 12 }}>{i + 1}</div>
        ))}
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        onScroll={handleScroll}
        readOnly={readOnly}
        spellCheck={false}
        placeholder={"# Paste your .env content here\nDATABASE_URL=postgres://...\nAPI_KEY=sk-...\nSECRET_KEY=your-secret"}
        style={{
          flex: 1, padding: 16,
          background: "transparent",
          border: "none", outline: "none",
          color: "#e2e8f0", resize: "none",
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: 13, lineHeight: "22px",
          tabSize: 2,
        }}
      />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   Main Page Component
   ═══════════════════════════════════════════════════════════════ */
const PMEnvironment: React.FC = () => {
  const [entries, setEntries] = useState<EnvEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal state
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view" | null>(null);
  const [modalEntry, setModalEntry] = useState<EnvEntry | null>(null);
  const [formName, setFormName] = useState("");
  const [formContent, setFormContent] = useState("");
  const [saving, setSaving] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<EnvEntry | null>(null);
  const [deleting, setDeleting] = useState(false);

  // View modal copy
  const [viewCopied, setViewCopied] = useState(false);
  // View modal secret toggle
  const [showSecrets, setShowSecrets] = useState(false);

  /* ─── Fetch ────────────────────────────────────────────────── */
  const fetchEntries = useCallback(async () => {
    try {
      const res = await authFetch("/env-store");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load environment vault");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  /* ─── Handlers ─────────────────────────────────────────────── */
  const handleCopy = async (id: string, content: string) => {
    // If we don't have content yet (list only returns preview), fetch full
    let textToCopy = content;
    if (!textToCopy) {
      try {
        const res = await authFetch(`/env-store/${id}`);
        if (res.ok) {
          const data = await res.json();
          textToCopy = data.env_content;
        }
      } catch { /* fallback to empty */ }
    }
    await navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("Copied to clipboard");
  };

  const openCreate = () => {
    setModalMode("create");
    setModalEntry(null);
    setFormName("");
    setFormContent("");
  };

  const openEdit = async (entry: EnvEntry) => {
    setModalMode("edit");
    setModalEntry(entry);
    setFormName(entry.project_name);
    // Fetch full content
    try {
      const res = await authFetch(`/env-store/${entry._id}`);
      if (res.ok) {
        const data = await res.json();
        setFormContent(data.env_content);
      }
    } catch {
      setFormContent("");
    }
  };

  const openView = async (entry: EnvEntry) => {
    setModalMode("view");
    setModalEntry(entry);
    setShowSecrets(false);
    setViewCopied(false);
    // Fetch full content
    try {
      const res = await authFetch(`/env-store/${entry._id}`);
      if (res.ok) {
        const data = await res.json();
        setModalEntry({ ...entry, env_content: data.env_content, var_count: data.var_count });
      }
    } catch {
      /* keep the preview */
    }
  };

  const closeModal = () => {
    setModalMode(null);
    setModalEntry(null);
    setFormName("");
    setFormContent("");
  };

  const handleSave = async () => {
    if (!formName.trim()) { toast.error("Project name is required"); return; }
    if (!formContent.trim()) { toast.error("Env content is required"); return; }

    setSaving(true);
    try {
      const body = { project_name: formName.trim(), env_content: formContent };

      if (modalMode === "create") {
        const res = await authFetch("/env-store", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail || "Failed to create");
        }
        toast.success("Environment saved securely");
      } else if (modalMode === "edit" && modalEntry) {
        const res = await authFetch(`/env-store/${modalEntry._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail || "Failed to update");
        }
        toast.success("Environment updated");
      }

      closeModal();
      fetchEntries();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await authFetch(`/env-store/${deleteTarget._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success(`Deleted "${deleteTarget.project_name}"`);
      setDeleteTarget(null);
      fetchEntries();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleFileImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".env,.txt";
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        setFormContent(text);
        if (!formName) {
          // Auto-fill name from filename
          const name = file.name.replace(/\.env.*|\.txt/gi, "").replace(/[._-]/g, " ").trim();
          if (name) setFormName(name);
        }
        toast.success("File imported");
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleExport = (entry: EnvEntry) => {
    const blob = new Blob([entry.env_content || ""], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${entry.project_name.replace(/\s+/g, "_").toLowerCase()}.env`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded .env file");
  };

  /* ─── Filtered entries ─────────────────────────────────────── */
  const filtered = entries.filter(e =>
    e.project_name.toLowerCase().includes(search.toLowerCase())
  );

  /* ─── Mask secrets helper ──────────────────────────────────── */
  const maskContent = (content: string): string => {
    return content.split("\n").map(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return line;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) return line;
      const key = trimmed.substring(0, eqIdx + 1);
      return key + "••••••••••••";
    }).join("\n");
  };

  /* ═══════════════════════════════════════════════════════════════
     Render
     ═══════════════════════════════════════════════════════════════ */
  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 400, gap: 16 }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
          <Loader2 size={36} color="#10b981" />
        </motion.div>
        <span style={{ color: "#64748b", fontSize: 14 }}>Initializing Secure Vault...</span>
      </div>
    );
  }

  return (
    <div style={s.page}>
      {/* Background orbs */}
      <div style={s.orb1} />
      <div style={s.orb2} />

      {/* Header */}
      <div style={s.headerRow}>
        <div>
          <h2 style={{
            fontSize: 28, fontWeight: 800, color: "#fff", margin: 0,
            display: "flex", alignItems: "center", gap: 12,
            letterSpacing: "-0.02em",
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: "linear-gradient(135deg, #10b981, #06b6d4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 20px rgba(16,185,129,0.3)",
            }}>
              <Shield size={22} color="#fff" />
            </div>
            Environment Vault
            <span style={{
              fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6,
              background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)",
              color: "#10b981", marginLeft: 4, letterSpacing: "0.05em",
            }}>
              ENCRYPTED
            </span>
          </h2>
          <p style={{ color: "#64748b", fontSize: 14, marginTop: 6 }}>
            Securely store and manage <code style={{ color: "#38bdf8", background: "rgba(56,189,248,0.1)", padding: "2px 6px", borderRadius: 4, fontSize: 13 }}>.env</code> files for all your projects. AES-256 encrypted at rest.
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={s.searchWrap}>
            <Search size={16} style={s.searchIcon as any} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search projects..."
              style={s.searchInput}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={openCreate}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 20px", borderRadius: 12,
              background: "linear-gradient(135deg, #10b981, #059669)",
              border: "none", color: "#fff", cursor: "pointer",
              fontSize: 14, fontWeight: 700,
              boxShadow: "0 4px 20px rgba(16,185,129,0.3)",
              transition: "box-shadow 0.3s",
            }}
          >
            <Plus size={18} /> New .env
          </motion.button>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{
        display: "flex", gap: 24, zIndex: 1,
        padding: "12px 20px", borderRadius: 14,
        background: "rgba(0,0,0,0.2)",
        border: "1px solid rgba(255,255,255,0.04)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FolderLock size={16} color="#10b981" />
          <span style={{ fontSize: 13, color: "#94a3b8" }}>Total Projects:</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{entries.length}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Lock size={16} color="#8b5cf6" />
          <span style={{ fontSize: 13, color: "#94a3b8" }}>Total Variables:</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>
            {entries.reduce((sum, e) => sum + (e.var_count || 0), 0)}
          </span>
        </div>
      </div>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", height: 360, zIndex: 1, gap: 16,
          }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <div style={{
              width: 80, height: 80, borderRadius: 24,
              background: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.1))",
              border: "1px solid rgba(16,185,129,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Sparkles size={36} color="#10b981" style={{ opacity: 0.6 }} />
            </div>
          </motion.div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: "#fff", margin: 0 }}>
            {search ? "No matching projects" : "Vault is empty"}
          </h3>
          <p style={{ color: "#64748b", fontSize: 14, textAlign: "center", maxWidth: 360 }}>
            {search
              ? `No projects match "${search}". Try a different search term.`
              : "Start by adding your first .env file. All content is encrypted before storage."
            }
          </p>
          {!search && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openCreate}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 20px", borderRadius: 12,
                background: "linear-gradient(135deg, #10b981, #059669)",
                border: "none", color: "#fff", cursor: "pointer",
                fontSize: 14, fontWeight: 700, marginTop: 8,
                boxShadow: "0 4px 20px rgba(16,185,129,0.3)",
              }}
            >
              <Plus size={18} /> Add First .env
            </motion.button>
          )}
        </motion.div>
      ) : (
        <motion.div style={s.grid} layout>
          <AnimatePresence mode="popLayout">
            {filtered.map((entry, i) => (
              <EnvCard
                key={entry._id}
                entry={entry}
                index={i}
                copiedId={copiedId}
                onCopy={handleCopy}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
                onView={openView}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ─── Create / Edit Modal ─────────────────────────────── */}
      <AnimatePresence>
        {(modalMode === "create" || modalMode === "edit") && (
          <div style={s.overlay} onClick={closeModal}>
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              onClick={e => e.stopPropagation()}
              className="admin-glass-panel"
              style={{
                width: 700, maxWidth: "90vw", maxHeight: "85vh",
                padding: 0, display: "flex", flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* Modal header */}
              <div style={{
                padding: "24px 28px 20px", display: "flex", justifyContent: "space-between",
                alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: "linear-gradient(135deg, #10b981, #06b6d4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {modalMode === "create" ? <Plus size={18} color="#fff" /> : <Pencil size={18} color="#fff" />}
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 }}>
                    {modalMode === "create" ? "New Environment File" : "Edit Environment"}
                  </h3>
                </div>
                <button onClick={closeModal} style={{
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8, padding: 8, cursor: "pointer", color: "#94a3b8",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <X size={16} />
                </button>
              </div>

              {/* Modal body */}
              <div style={{ flex: 1, padding: "20px 28px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Project name */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Project Name
                  </label>
                  <input
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="e.g. ULMiND Backend, Client Portal..."
                    style={{
                      width: "100%", background: "rgba(0,0,0,0.35)",
                      border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10,
                      padding: "12px 16px", color: "#fff", fontSize: 15,
                      outline: "none", fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                    }}
                  />
                </div>

                {/* Content editor */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      .env Content
                    </label>
                    <button
                      onClick={handleFileImport}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "6px 12px", borderRadius: 8,
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "#94a3b8", cursor: "pointer", fontSize: 12, fontWeight: 600,
                      }}
                    >
                      <FileUp size={14} /> Import File
                    </button>
                  </div>
                  <CodeEditor value={formContent} onChange={setFormContent} />
                </div>

                {/* Variable count */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 14px", borderRadius: 8,
                  background: "rgba(16,185,129,0.06)",
                  border: "1px solid rgba(16,185,129,0.1)",
                }}>
                  <Terminal size={14} color="#10b981" />
                  <span style={{ fontSize: 13, color: "#94a3b8" }}>
                    Detected <strong style={{ color: "#10b981" }}>{countVars(formContent)}</strong> variables
                  </span>
                </div>
              </div>

              {/* Modal footer */}
              <div style={{
                padding: "16px 28px", display: "flex", justifyContent: "flex-end", gap: 12,
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}>
                <button
                  onClick={closeModal}
                  style={{
                    padding: "10px 20px", borderRadius: 10,
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 14,
                  }}
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "10px 24px", borderRadius: 10,
                    background: saving ? "#065f46" : "linear-gradient(135deg, #10b981, #059669)",
                    border: "none", color: "#fff", cursor: saving ? "wait" : "pointer",
                    fontWeight: 700, fontSize: 14,
                    boxShadow: "0 4px 16px rgba(16,185,129,0.25)",
                  }}
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {modalMode === "create" ? "Save Securely" : "Update"}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── View Modal ──────────────────────────────────────── */}
      <AnimatePresence>
        {modalMode === "view" && modalEntry && (
          <div style={s.overlay} onClick={closeModal}>
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              onClick={e => e.stopPropagation()}
              className="admin-glass-panel"
              style={{
                width: 700, maxWidth: "90vw", maxHeight: "85vh",
                padding: 0, display: "flex", flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* View header */}
              <div style={{
                padding: "24px 28px 20px", display: "flex", justifyContent: "space-between",
                alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Eye size={18} color="#fff" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 }}>
                      {modalEntry.project_name}
                    </h3>
                    <span style={{ fontSize: 12, color: "#64748b" }}>
                      {modalEntry.var_count} variables • Updated {relativeTime(modalEntry.updated_at)}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => setShowSecrets(!showSecrets)}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "8px 12px", borderRadius: 8,
                      background: showSecrets ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.05)",
                      border: showSecrets ? "1px solid rgba(16,185,129,0.2)" : "1px solid rgba(255,255,255,0.08)",
                      color: showSecrets ? "#10b981" : "#94a3b8",
                      cursor: "pointer", fontSize: 12, fontWeight: 600,
                    }}
                  >
                    {showSecrets ? <EyeOff size={14} /> : <Eye size={14} />}
                    {showSecrets ? "Hide" : "Reveal"}
                  </button>
                  <button onClick={closeModal} style={{
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 8, padding: 8, cursor: "pointer", color: "#94a3b8",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* View body */}
              <div style={{ flex: 1, padding: "20px 28px", overflowY: "auto" }}>
                <CodeEditor
                  value={showSecrets ? (modalEntry.env_content || "") : maskContent(modalEntry.env_content || "")}
                  onChange={() => {}}
                  readOnly
                />
              </div>

              {/* View footer */}
              <div style={{
                padding: "16px 28px", display: "flex", justifyContent: "space-between",
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}>
                <button
                  onClick={() => handleExport(modalEntry)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "10px 16px", borderRadius: 10,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#e2e8f0", cursor: "pointer", fontSize: 13, fontWeight: 600,
                  }}
                >
                  <Download size={16} /> Download .env
                </button>
                <div style={{ display: "flex", gap: 12 }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { openEdit(modalEntry); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "10px 16px", borderRadius: 10,
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#e2e8f0", cursor: "pointer", fontSize: 13, fontWeight: 600,
                    }}
                  >
                    <Pencil size={16} /> Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={async () => {
                      await navigator.clipboard.writeText(modalEntry.env_content || "");
                      setViewCopied(true);
                      setTimeout(() => setViewCopied(false), 2000);
                      toast.success("Copied to clipboard");
                    }}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "10px 20px", borderRadius: 10,
                      background: viewCopied ? "rgba(16,185,129,0.15)" : "linear-gradient(135deg, #10b981, #059669)",
                      border: viewCopied ? "1px solid rgba(16,185,129,0.3)" : "none",
                      color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700,
                      boxShadow: viewCopied ? "none" : "0 4px 16px rgba(16,185,129,0.25)",
                    }}
                  >
                    {viewCopied ? <Check size={16} /> : <Copy size={16} />}
                    {viewCopied ? "Copied!" : "Copy All"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Delete Confirmation ─────────────────────────────── */}
      <AnimatePresence>
        {deleteTarget && (
          <div style={s.overlay} onClick={() => setDeleteTarget(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="admin-glass-panel"
              style={{ width: 440, padding: 32 }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <AlertTriangle size={28} color="#ef4444" />
                </div>

                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 }}>
                  Delete Environment?
                </h3>
                <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6 }}>
                  This will permanently delete the <strong style={{ color: "#fff" }}>{deleteTarget.project_name}</strong> environment file.
                  This action cannot be undone.
                </p>

                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                  <button
                    onClick={() => setDeleteTarget(null)}
                    style={{
                      padding: "10px 24px", borderRadius: 10,
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 14,
                    }}
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDelete}
                    disabled={deleting}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "10px 24px", borderRadius: 10,
                      background: "linear-gradient(135deg, #ef4444, #dc2626)",
                      border: "none", color: "#fff", cursor: deleting ? "wait" : "pointer",
                      fontWeight: 700, fontSize: 14,
                      boxShadow: "0 4px 16px rgba(239,68,68,0.25)",
                    }}
                  >
                    {deleting && <Loader2 size={16} className="animate-spin" />}
                    Delete Permanently
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PMEnvironment;
