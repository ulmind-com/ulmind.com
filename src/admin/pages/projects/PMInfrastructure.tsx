import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Server, Globe, Database, Mail, Search, Plus,
  Trash2, Pencil, ExternalLink, ShieldAlert, Layers
} from "lucide-react";
import { toast } from "sonner";
import Lottie from "lottie-react";

import {
  getInfraAPI,
  createInfraAPI,
  updateInfraAPI,
  deleteInfraAPI
} from "../../lib/api";

import successAnim from "../../../../public/Jason/Success.json";
import deleteAnim from "../../../../public/Jason/delete.json";
import { ShineBorder } from "@/components/ui/shine-border";

// Using the same date formatting as PMEnvironment
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

const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("en-US", {
        month: "short", day: "numeric", year: "numeric",
        hour: "numeric", minute: "2-digit", hour12: true
    });
};

const s = {
  page: {
    display: "flex", flexDirection: "column" as const, gap: 24,
    padding: "24px 32px", height: "100%", position: "relative" as const,
  },
  orb1: {
    position: "absolute" as const, top: -200, right: -150, width: 500, height: 500,
    background: "radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)",
    pointerEvents: "none" as const, zIndex: 0,
  },
  orb2: {
    position: "absolute" as const, bottom: -200, left: -100, width: 400, height: 400,
    background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)",
    pointerEvents: "none" as const, zIndex: 0,
  },
  headerRow: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-end",
    zIndex: 1, flexWrap: "wrap" as const, gap: 16,
  },
  grid: {
    display: "flex", flexWrap: "wrap" as const,
    gap: 24, zIndex: 1, alignItems: "stretch"
  },
  overlay: {
    position: "fixed" as const, inset: 0,
    background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200,
  },
};

const InfraCard = ({ item, onEdit, onDelete }: { item: any, onEdit: (i: any) => void, onDelete: (i: any) => void }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ borderRadius: 20, width: 380, flexShrink: 0, position: "relative", maxWidth: "100%" }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <ShineBorder
                borderRadius={20}
                borderWidth={1.5}
                color={["#ec4899", "#3b82f6", "#8b5cf6"]}
                className="bg-transparent h-full w-full !p-[1.5px] !text-inherit border-none"
            >
                <div style={{
                    background: "rgba(10, 14, 24, 0.95)",
                    backdropFilter: "blur(20px)",
                    borderRadius: 19,
                    padding: "20px 24px",
                    display: "flex", flexDirection: "column", gap: 20,
                    height: "100%", width: "100%", overflow: "hidden"
                }}>
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{
                                width: 44, height: 44, borderRadius: 12,
                                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 4px 20px rgba(59,130,246,0.3)"
                            }}>
                                <Server size={20} color="#fff" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#fff", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180 }}>
                                    {item.project_name}
                                </h3>
                                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                                    Updated {relativeTime(item.updated_at)}
                                </div>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => onEdit(item)} style={{
                                width: 32, height: 32, borderRadius: 8, background: hovered ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.05)",
                                display: "flex", alignItems: "center", justifyContent: "center", color: hovered ? "#3b82f6" : "#94a3b8", border: "none", cursor: "pointer", transition: "all 0.2s"
                            }}>
                                <Pencil size={14} />
                            </button>
                            <button onClick={() => onDelete(item)} style={{
                                width: 32, height: 32, borderRadius: 8, background: hovered ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.05)",
                                display: "flex", alignItems: "center", justifyContent: "center", color: hovered ? "#ef4444" : "#94a3b8", border: "none", cursor: "pointer", transition: "all 0.2s"
                            }}>
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {[
                            { icon: <Mail size={14}/>, label: "Account Email", value: item.email_used, color: "#f59e0b" },
                            { icon: <Globe size={14}/>, label: "Frontend", value: item.frontend_url, email: item.frontend_email, color: "#06b6d4", link: true },
                            { icon: <Server size={14}/>, label: "Backend", value: item.backend_url, email: item.backend_email, color: "#8b5cf6", link: true },
                            { icon: <Database size={14}/>, label: "Database", value: item.database_url, email: item.database_email, color: "#10b981", link: true },
                            { icon: <Globe size={14}/>, label: "Server Location", value: item.server_location, email: item.server_email, color: "#ec4899" },
                        ].map((detail, idx) => (
                            detail.value ? (
                                <div key={idx} style={{
                                    display: "flex", alignItems: "center", gap: 12,
                                    padding: "8px 12px", background: "rgba(255,255,255,0.03)",
                                    borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)",
                                    width: "100%", overflow: "hidden"
                                }}>
                                    <div style={{ color: detail.color, display: "flex", flexShrink: 0 }}>{detail.icon}</div>
                                    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
                                        <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5, color: "#64748b", fontWeight: 600 }}>{detail.label}</span>
                                        {detail.link && (detail.value.startsWith("http") || detail.value.startsWith("mongodb")) ? (
                                            <a href={detail.value} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "#e2e8f0", textDecoration: "none", display: "flex", alignItems: "center", gap: 6, minWidth: 0, width: "100%" }}>
                                                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, display: "block" }}>{detail.value}</span> 
                                                <ExternalLink size={10} style={{ flexShrink: 0 }} />
                                            </a>
                                        ) : (
                                            <span style={{ fontSize: 13, color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block", width: "100%" }}>{detail.value}</span>
                                        )}
                                        {detail.email && (
                                            <span style={{ fontSize: 11, color: "#94a3b8", display: "flex", alignItems: "center", gap: 6, marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                <Mail size={10} /> {detail.email}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ) : null
                        ))}
                        {(item.custom_sections || []).map((sec: any) => (
                            <div key={sec.id} style={{
                                display: "flex", alignItems: "center", gap: 12,
                                padding: "8px 12px", background: "rgba(255,255,255,0.03)",
                                borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)",
                                width: "100%", overflow: "hidden"
                            }}>
                                <div style={{ color: "#eab308", display: "flex", flexShrink: 0 }}><Layers size={14} /></div>
                                <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
                                    <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5, color: "#64748b", fontWeight: 600 }}>{sec.label}</span>
                                    {sec.url ? (
                                        sec.url.startsWith("http") ? (
                                            <a href={sec.url} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "#e2e8f0", textDecoration: "none", display: "flex", alignItems: "center", gap: 6, minWidth: 0, width: "100%" }}>
                                                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, display: "block" }}>{sec.url}</span>
                                                <ExternalLink size={10} style={{ flexShrink: 0 }} />
                                            </a>
                                        ) : (
                                            <span style={{ fontSize: 13, color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block", width: "100%" }}>{sec.url}</span>
                                        )
                                    ) : null}
                                    {sec.email && (
                                        <span style={{ fontSize: 11, color: "#94a3b8", display: "flex", alignItems: "center", gap: 6, marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            <Mail size={10} /> {sec.email}
                                        </span>
                                    )}
                                    {sec.notes && (
                                        <span style={{ fontSize: 11, color: "#64748b", marginTop: 4, whiteSpace: "pre-wrap" }}>
                                            {sec.notes}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ flex: 1 }} />

                    {/* Footer - Created By */}
                    <div style={{
                        display: "flex", alignItems: "center", gap: 10,
                        paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)",
                        marginTop: 4
                    }}>
                        <div style={{
                            width: 24, height: 24, borderRadius: "50%",
                            background: "#334155", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                            {item.created_by?.profile_photo ? (
                                <img src={item.created_by.profile_photo} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                                <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700 }}>
                                    {item.created_by?.name?.charAt(0) || "A"}
                                </span>
                            )}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>
                                Saved by <strong style={{ color: "#e2e8f0" }}>{item.created_by?.name || "Admin"}</strong>
                            </span>
                            <span style={{ fontSize: 10, color: "#64748b" }}>
                                {formatDate(item.created_at)}
                            </span>
                        </div>
                    </div>
                </div>
            </ShineBorder>
        </motion.div>
    );
};

const ModernInput = ({ label, value, onChange, placeholder, type = "text", required = false }: any) => {
    const [focused, setFocused] = useState(false);
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
            <label style={{
                color: focused ? "#3b82f6" : "#94a3b8",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 0.5,
                transition: "color 0.3s ease"
            }}>
                {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
            </label>
            <div style={{
                position: "relative",
                borderRadius: 12,
                background: "rgba(15, 23, 42, 0.6)",
                border: focused ? "1px solid #3b82f6" : "1px solid rgba(255,255,255,0.08)",
                boxShadow: focused ? "0 0 0 3px rgba(59, 130, 246, 0.15), inset 0 2px 4px rgba(0,0,0,0.1)" : "inset 0 2px 4px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                overflow: "hidden"
            }}>
                <div style={{
                    position: "absolute", inset: 0,
                    background: focused ? "linear-gradient(120deg, rgba(59,130,246,0.05), transparent)" : "transparent",
                    pointerEvents: "none", transition: "background 0.3s ease"
                }} />
                <input
                    type={type}
                    required={required}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={placeholder}
                    style={{
                        width: "100%", padding: "14px 16px",
                        background: "transparent", border: "none",
                        color: "#f8fafc", fontSize: 14, outline: "none",
                        position: "relative", zIndex: 1,
                    }}
                />
            </div>
        </div>
    );
};

export default function PMInfrastructure() {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [editItem, setEditItem] = useState<any>(null);
  
  // Forms
  const [formData, setFormData] = useState({
      project_name: "", email_used: "",
      frontend_url: "", frontend_email: "",
      backend_url: "", backend_email: "",
      database_url: "", database_email: "",
      server_location: "", server_email: "",
      custom_sections: [] as { id?: string; label: string; url: string; email: string; notes: string }[]
  });

  // Animations
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);
  const [showDeleteAnim, setShowDeleteAnim] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const fetchItems = async () => {
    try {
      const data = await getInfraAPI(search);
      setItems(data.items || []);
    } catch (err) {
      toast.error("Failed to load infrastructure data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [search]);

  const openAdd = () => {
      setFormData({
          project_name: "", email_used: "",
          frontend_url: "", frontend_email: "",
          backend_url: "", backend_email: "",
          database_url: "", database_email: "",
          server_location: "", server_email: "",
          custom_sections: []
      });
      setModalMode("add");
  };

  const openEdit = (item: any) => {
      setFormData({
          project_name: item.project_name || "",
          email_used: item.email_used || "",
          frontend_url: item.frontend_url || "",
          frontend_email: item.frontend_email || "",
          backend_url: item.backend_url || "",
          backend_email: item.backend_email || "",
          database_url: item.database_url || "",
          database_email: item.database_email || "",
          server_location: item.server_location || "",
          server_email: item.server_email || "",
          custom_sections: (item.custom_sections || []).map((sec: any) => ({
              id: sec.id, label: sec.label || "", url: sec.url || "", email: sec.email || "", notes: sec.notes || ""
          }))
      });
      setEditItem(item);
      setModalMode("edit");
  };

  const addCustomSection = () => {
      setFormData(prev => ({
          ...prev,
          custom_sections: [...prev.custom_sections, { label: "", url: "", email: "", notes: "" }]
      }));
  };

  const updateCustomSection = (index: number, field: "label" | "url" | "email" | "notes", value: string) => {
      setFormData(prev => ({
          ...prev,
          custom_sections: prev.custom_sections.map((sec, i) => i === index ? { ...sec, [field]: value } : sec)
      }));
  };

  const removeCustomSection = (index: number) => {
      setFormData(prev => ({
          ...prev,
          custom_sections: prev.custom_sections.filter((_, i) => i !== index)
      }));
  };

  const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          const payload = {
              ...formData,
              custom_sections: formData.custom_sections
                  .filter(sec => sec.label.trim())
                  .map(sec => ({ ...sec, label: sec.label.trim() }))
          };
          if (modalMode === "add") {
              await createInfraAPI(payload);
              setShowSuccessAnim(true);
              toast.success("Infrastructure saved");
          } else if (modalMode === "edit" && editItem) {
              await updateInfraAPI(editItem._id || editItem.id, payload);
              setShowSuccessAnim(true);
              toast.success("Infrastructure updated");
          }
          setModalMode(null);
          fetchItems();
          setTimeout(() => setShowSuccessAnim(false), 2000);
      } catch (err) {
          toast.error("Failed to save changes");
      }
  };

  const confirmDelete = async () => {
      if (!itemToDelete) return;
      try {
          await deleteInfraAPI(itemToDelete._id || itemToDelete.id);
          setShowDeleteAnim(true);
          toast.success("Infrastructure deleted");
          setItemToDelete(null);
          fetchItems();
          setTimeout(() => setShowDeleteAnim(false), 2500);
      } catch (err) {
          toast.error("Failed to delete entry");
      }
  };

  return (
    <div style={s.page}>
      <div style={s.orb1} />
      <div style={s.orb2} />

      <div style={s.headerRow}>
        <div style={{ zIndex: 1 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#fff", margin: "0 0 6px 0", letterSpacing: "-0.02em" }}>
            Project Infrastructure
          </h2>
          <p style={{ margin: 0, color: "#94a3b8", fontSize: 14 }}>
            Manage hosting details, domains, and environments for your projects.
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", zIndex: 1 }}>
          <div style={{ position: "relative", width: 280 }}>
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%", background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10, padding: "10px 14px 10px 38px", color: "#fff", fontSize: 14, outline: "none"
              }}
            />
            <Search size={16} color="#64748b" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          </div>
          
          <button
            onClick={openAdd}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #3b82f6, #ec4899)",
              color: "#fff", fontSize: 14, fontWeight: 600, boxShadow: "0 4px 15px rgba(236,72,153,0.3)"
            }}
          >
            <Plus size={16} />
            Add Infra
          </button>
        </div>
      </div>

      <div style={s.grid}>
          <AnimatePresence>
              {items.map(item => (
                  <InfraCard key={item._id || item.id} item={item} onEdit={openEdit} onDelete={setItemToDelete} />
              ))}
          </AnimatePresence>
      </div>

      {/* Save Modal */}
      <AnimatePresence>
        {modalMode && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={s.overlay}
            onClick={() => setModalMode(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 20, width: 550, maxWidth: "90%", padding: 24,
                maxHeight: "90vh", overflowY: "auto",
                boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
              }}
            >
              <h3 style={{ margin: "0 0 24px", color: "#f8fafc", fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}>
                {modalMode === "add" ? "Add Infrastructure" : "Edit Infrastructure"}
              </h3>
              
              <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <ModernInput label="PROJECT NAME" required value={formData.project_name} onChange={(e: any) => setFormData({...formData, project_name: e.target.value})} placeholder="e.g. ULMIND Backend" />
                    <ModernInput label="ACCOUNT EMAIL" type="email" value={formData.email_used} onChange={(e: any) => setFormData({...formData, email_used: e.target.value})} placeholder="e.g. admin@ulmind.com" />
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
                        <h4 style={{ color: "#06b6d4", fontSize: 13, margin: "0 0 12px 0", textTransform: "uppercase", letterSpacing: 0.5 }}>Frontend Details</h4>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <ModernInput label="URL" value={formData.frontend_url} onChange={(e: any) => setFormData({...formData, frontend_url: e.target.value})} placeholder="https://..." />
                            <ModernInput label="Email" value={formData.frontend_email} onChange={(e: any) => setFormData({...formData, frontend_email: e.target.value})} placeholder="frontend@..." />
                        </div>
                    </div>
                    
                    <div style={{ padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
                        <h4 style={{ color: "#8b5cf6", fontSize: 13, margin: "0 0 12px 0", textTransform: "uppercase", letterSpacing: 0.5 }}>Backend Details</h4>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <ModernInput label="URL" value={formData.backend_url} onChange={(e: any) => setFormData({...formData, backend_url: e.target.value})} placeholder="https://api..." />
                            <ModernInput label="Email" value={formData.backend_email} onChange={(e: any) => setFormData({...formData, backend_email: e.target.value})} placeholder="backend@..." />
                        </div>
                    </div>

                    <div style={{ padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
                        <h4 style={{ color: "#10b981", fontSize: 13, margin: "0 0 12px 0", textTransform: "uppercase", letterSpacing: 0.5 }}>Database Details</h4>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <ModernInput label="URL" value={formData.database_url} onChange={(e: any) => setFormData({...formData, database_url: e.target.value})} placeholder="mongodb+srv://..." />
                            <ModernInput label="Email" value={formData.database_email} onChange={(e: any) => setFormData({...formData, database_email: e.target.value})} placeholder="dbadmin@..." />
                        </div>
                    </div>

                    <div style={{ padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
                        <h4 style={{ color: "#ec4899", fontSize: 13, margin: "0 0 12px 0", textTransform: "uppercase", letterSpacing: 0.5 }}>Server Details</h4>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <ModernInput label="Location" value={formData.server_location} onChange={(e: any) => setFormData({...formData, server_location: e.target.value})} placeholder="AWS, Render, etc." />
                            <ModernInput label="Email" value={formData.server_email} onChange={(e: any) => setFormData({...formData, server_email: e.target.value})} placeholder="serveradmin@..." />
                        </div>
                    </div>

                    <div style={{ padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: formData.custom_sections.length ? 12 : 0 }}>
                            <h4 style={{ color: "#eab308", fontSize: 13, margin: 0, textTransform: "uppercase", letterSpacing: 0.5 }}>Custom Sections</h4>
                            <button
                                type="button"
                                onClick={addCustomSection}
                                style={{
                                    display: "flex", alignItems: "center", gap: 6,
                                    padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(234,179,8,0.3)",
                                    background: "rgba(234,179,8,0.1)", color: "#eab308", fontSize: 12, fontWeight: 600, cursor: "pointer"
                                }}
                            >
                                <Plus size={13} /> Add Section
                            </button>
                        </div>
                        <p style={{ margin: formData.custom_sections.length ? "0 0 12px" : 0, color: "#64748b", fontSize: 12 }}>
                            Add any extra service this project uses — Cloudinary, AWS, Twilio, etc. — and which account/email it's saved under.
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {formData.custom_sections.map((sec, idx) => (
                                <div key={idx} style={{
                                    position: "relative", padding: "14px", borderRadius: 10,
                                    background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.06)",
                                    display: "flex", flexDirection: "column", gap: 12
                                }}>
                                    <button
                                        type="button"
                                        onClick={() => removeCustomSection(idx)}
                                        style={{
                                            position: "absolute", top: 10, right: 10, width: 26, height: 26, borderRadius: 7,
                                            background: "rgba(239,68,68,0.1)", border: "none", color: "#ef4444",
                                            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
                                        }}
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, paddingRight: 32 }}>
                                        <ModernInput label="Service / Section Name" required value={sec.label} onChange={(e: any) => updateCustomSection(idx, "label", e.target.value)} placeholder="e.g. Cloudinary, AWS S3" />
                                        <ModernInput label="Email" value={sec.email} onChange={(e: any) => updateCustomSection(idx, "email", e.target.value)} placeholder="account@..." />
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
                                        <ModernInput label="URL / Console Link (optional)" value={sec.url} onChange={(e: any) => updateCustomSection(idx, "url", e.target.value)} placeholder="https://..." />
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                        <label style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600, letterSpacing: 0.5 }}>Notes (optional)</label>
                                        <textarea
                                            value={sec.notes}
                                            onChange={(e) => updateCustomSection(idx, "notes", e.target.value)}
                                            placeholder="Any extra detail worth remembering..."
                                            rows={2}
                                            style={{
                                                width: "100%", padding: "10px 12px", borderRadius: 10,
                                                background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255,255,255,0.08)",
                                                color: "#f8fafc", fontSize: 13, outline: "none", resize: "vertical", fontFamily: "inherit"
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <button type="button" onClick={() => setModalMode(null)} style={{ 
                        padding: "12px 24px", borderRadius: 12, background: "rgba(255,255,255,0.03)", 
                        border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0", cursor: "pointer",
                        fontWeight: 600, transition: "all 0.2s" 
                    }} className="hover:bg-white/10">
                        Cancel
                    </button>
                    <button type="submit" style={{ 
                        padding: "12px 28px", borderRadius: 12, 
                        background: "linear-gradient(135deg, #3b82f6, #6366f1)", 
                        boxShadow: "0 4px 15px rgba(59,130,246,0.3)",
                        border: "none", color: "#fff", fontWeight: 600, cursor: "pointer",
                        transition: "all 0.2s" 
                    }} className="hover:scale-105">
                        Save Details
                    </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {itemToDelete && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={s.overlay}
            onClick={() => setItemToDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#0f172a", border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 20, width: 400, maxWidth: "90%", padding: 30,
                textAlign: "center"
              }}
            >
              <div style={{ width: 64, height: 64, borderRadius: 32, background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <ShieldAlert size={32} color="#ef4444" />
              </div>
              <h3 style={{ color: "#fff", fontSize: 20, margin: "0 0 10px" }}>Delete {itemToDelete.project_name}?</h3>
              <p style={{ color: "#94a3b8", fontSize: 14, margin: "0 0 24px" }}>Are you sure you want to delete this infrastructure configuration? This action cannot be undone.</p>
              
              <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => setItemToDelete(null)} style={{ flex: 1, padding: "12px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "none", color: "#fff", cursor: "pointer" }}>Cancel</button>
                  <button onClick={confirmDelete} style={{ flex: 1, padding: "12px", borderRadius: 8, background: "#ef4444", border: "none", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Lottie Animation Overlay */}
      <AnimatePresence>
          {showSuccessAnim && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}
              >
                  <Lottie animationData={successAnim} loop={false} style={{ width: 300, height: 300 }} />
              </motion.div>
          )}
      </AnimatePresence>

      {/* Delete Lottie Animation Overlay */}
      <AnimatePresence>
          {showDeleteAnim && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}
              >
                  <Lottie animationData={deleteAnim} loop={false} style={{ width: 400, height: 400 }} />
              </motion.div>
          )}
      </AnimatePresence>

    </div>
  );
}
