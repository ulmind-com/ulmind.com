import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, Eye, EyeOff, Plus, FileUp, FileDown,
  History, ShieldCheck, AlertCircle, Copy, Check, Clock
} from "lucide-react";
import { toast } from "sonner";

interface EnvVar {
  _id: string;
  project_id: string;
  key: string;
  value: string;
  environment: string;
  description?: string;
  updated_at: string;
}

interface EnvHistory {
  _id: string;
  env_id: string;
  changed_by: string;
  action: string;
  previous_value?: string;
  new_value?: string;
  timestamp: string;
}

// Ensure you replace this with your actual api module if it exists
const getBaseUrl = () => "http://localhost:5000/api/v1";

const PMEnvVault: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [envVars, setEnvVars] = useState<EnvVar[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Toggles
  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<EnvHistory[]>([]);
  
  // Form State
  const [formData, setFormData] = useState({ key: "", value: "", environment: "production", description: "" });
  const [importText, setImportText] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    fetchEnvVars();
  }, [id]);

  const fetchEnvVars = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${getBaseUrl()}/projects/${id}/env`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch environment variables");
      const data = await res.json();
      setEnvVars(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load .env vault");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (envId: string) => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${getBaseUrl()}/projects/${id}/env/${envId}/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch history");
      const data = await res.json();
      setHistoryData(data);
      setShowHistoryModal(envId);
    } catch (err) {
      toast.error("Failed to load version history");
    }
  };

  const toggleVisibility = (envId: string) => {
    setVisibleSecrets(prev => ({ ...prev, [envId]: !prev[envId] }));
  };

  const copyToClipboard = (text: string, envId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(envId);
    setTimeout(() => setCopiedKey(null), 2000);
    toast.success("Copied to clipboard");
  };

  const handleSaveEnv = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${getBaseUrl()}/projects/${id}/env`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to save variable");
      }
      
      toast.success("Environment variable securely saved.");
      setShowAddModal(false);
      setFormData({ key: "", value: "", environment: "production", description: "" });
      fetchEnvVars();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${getBaseUrl()}/projects/${id}/env/import`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: importText, environment: "production" })
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to import variables");
      }
      
      toast.success("Variables imported securely.");
      setShowImportModal(false);
      setImportText("");
      fetchEnvVars();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleExport = () => {
    const content = envVars.map(env => `${env.key}="${env.value}"`).join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `project_${id}.env`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Exported .env file successfully");
  };

  if (loading) return <div style={{ color: "#94a3b8", padding: 20 }}>Initializing Secure Vault...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: "24px 32px", height: "100%", position: "relative" }}>
      {/* Background Decor */}
      <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, background: "radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, rgba(0,0,0,0) 70%)", zIndex: 0 }} />
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", zIndex: 1 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <Lock size={28} color="#10b981" /> .env Vault
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 14 }}>
            Securely manage environment variables. Encrypted at rest. Strict RBAC enforced.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button 
            onClick={() => setShowImportModal(true)}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
          >
            <FileUp size={16} /> Import
          </button>
          <button 
            onClick={handleExport}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
          >
            <FileDown size={16} /> Export
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "#10b981", border: "none", color: "#000", cursor: "pointer", fontSize: 13, fontWeight: 700 }}
          >
            <Plus size={16} /> Add Variable
          </button>
        </div>
      </div>

      {/* Editor UI */}
      <div className="admin-glass-panel" style={{ flex: 1, padding: 2, display: "flex", flexDirection: "column", zIndex: 1, overflow: "hidden" }}>
        <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "12px 20px", display: "flex", gap: 24, borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          <div style={{ flex: 1.5 }}>Key</div>
          <div style={{ flex: 2 }}>Value</div>
          <div style={{ width: 100 }}>Environment</div>
          <div style={{ width: 120 }}>Last Updated</div>
          <div style={{ width: 80, textAlign: "right" }}>Actions</div>
        </div>
        
        <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {envVars.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 200, color: "#64748b" }}>
              <ShieldCheck size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
              <p>Vault is empty. Add a variable to secure it.</p>
            </div>
          ) : (
            envVars.map((env, i) => (
              <motion.div 
                key={env._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{ 
                  display: "flex", gap: 24, alignItems: "center", padding: "12px 16px", 
                  background: "rgba(0,0,0,0.3)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)",
                  fontFamily: "monospace"
                }}
              >
                <div style={{ flex: 1.5, color: "#38bdf8", fontWeight: 600, fontSize: 14 }}>
                  {env.key}
                </div>
                <div style={{ flex: 2, display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ 
                    flex: 1, background: "rgba(0,0,0,0.5)", padding: "6px 12px", borderRadius: 4, 
                    color: visibleSecrets[env._id] ? "#e2e8f0" : "#64748b",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    fontSize: 13
                  }}>
                    {visibleSecrets[env._id] ? env.value : "••••••••••••••••••••••••"}
                  </div>
                  <button onClick={() => toggleVisibility(env._id)} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", padding: 4 }}>
                    {visibleSecrets[env._id] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button onClick={() => copyToClipboard(env.value, env._id)} style={{ background: "transparent", border: "none", color: copiedKey === env._id ? "#10b981" : "#94a3b8", cursor: "pointer", padding: 4 }}>
                    {copiedKey === env._id ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <div style={{ width: 100 }}>
                  <span style={{ 
                    padding: "4px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                    background: env.environment === "production" ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                    color: env.environment === "production" ? "#10b981" : "#f59e0b",
                    border: env.environment === "production" ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid rgba(245, 158, 11, 0.2)"
                  }}>
                    {env.environment}
                  </span>
                </div>
                <div style={{ width: 120, fontSize: 12, color: "#64748b" }}>
                  {new Date(env.updated_at).toLocaleDateString()}
                </div>
                <div style={{ width: 80, display: "flex", justifyContent: "flex-end" }}>
                  <button onClick={() => fetchHistory(env._id)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", padding: "6px 10px", borderRadius: 6, display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600 }}>
                    <History size={14} /> Log
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="admin-glass-panel" style={{ width: 500, padding: 32 }}>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: "#fff", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
                <Plus size={20} color="#10b981" /> Add Environment Variable
              </h3>
              <form onSubmit={handleSaveEnv} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, color: "#94a3b8", marginBottom: 6 }}>KEY</label>
                  <input required value={formData.key} onChange={e => setFormData({...formData, key: e.target.value.toUpperCase().replace(/\s+/g, '_')})} placeholder="e.g. DATABASE_URL" style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 14px", color: "#fff", fontFamily: "monospace", outline: "none" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, color: "#94a3b8", marginBottom: 6 }}>VALUE</label>
                  <input required type="password" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} placeholder="Secret value" style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 14px", color: "#fff", fontFamily: "monospace", outline: "none" }} />
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: 13, color: "#94a3b8", marginBottom: 6 }}>ENVIRONMENT</label>
                    <select value={formData.environment} onChange={e => setFormData({...formData, environment: e.target.value})} style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 14px", color: "#fff", outline: "none" }}>
                      <option value="development">Development</option>
                      <option value="staging">Staging</option>
                      <option value="production">Production</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, color: "#94a3b8", marginBottom: 6 }}>DESCRIPTION (Optional)</label>
                  <input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="What is this used for?" style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 14px", color: "#fff", outline: "none" }} />
                </div>
                
                <div style={{ background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.2)", borderRadius: 8, padding: 12, display: "flex", gap: 12, alignItems: "flex-start", marginTop: 8 }}>
                  <AlertCircle size={16} color="#f59e0b" style={{ marginTop: 2, flexShrink: 0 }} />
                  <p style={{ fontSize: 12, color: "#fcd34d", margin: 0, lineHeight: 1.5 }}>
                    Security Policy: Variables cannot be deleted once created. All changes will be permanently logged in the audit trail.
                  </p>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
                  <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: "10px 20px", borderRadius: 8, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", fontWeight: 600 }}>Cancel</button>
                  <button type="submit" style={{ padding: "10px 20px", borderRadius: 8, background: "#10b981", border: "none", color: "#000", cursor: "pointer", fontWeight: 700 }}>Securely Save</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Import Modal */}
      <AnimatePresence>
        {showImportModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="admin-glass-panel" style={{ width: 600, padding: 32 }}>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: "#fff", marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
                <FileUp size={20} color="#38bdf8" /> Import .env File
              </h3>
              <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 20 }}>Paste your `.env` contents below. It will be parsed and securely encrypted.</p>
              
              <form onSubmit={handleImport} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <textarea 
                  required 
                  value={importText} 
                  onChange={e => setImportText(e.target.value)} 
                  placeholder="PORT=8080\nDATABASE_URL=postgres://..." 
                  style={{ width: "100%", height: 200, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "16px", color: "#fff", fontFamily: "monospace", outline: "none", resize: "none" }} 
                />

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                  <button type="button" onClick={() => setShowImportModal(false)} style={{ padding: "10px 20px", borderRadius: 8, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", fontWeight: 600 }}>Cancel</button>
                  <button type="submit" style={{ padding: "10px 20px", borderRadius: 8, background: "#38bdf8", border: "none", color: "#000", cursor: "pointer", fontWeight: 700 }}>Parse & Import</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {showHistoryModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="admin-glass-panel" style={{ width: 700, padding: 32, maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: 10 }}>
                  <History size={20} color="#a78bfa" /> Version History Log
                </h3>
                <button onClick={() => setShowHistoryModal(null)} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 24 }}>&times;</button>
              </div>
              
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
                {historyData.map((log, i) => (
                  <div key={log._id} style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 8, padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{log.changed_by}</span>
                      <span style={{ color: "#64748b", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                        <Clock size={12} /> {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                      <span style={{ padding: "4px 8px", borderRadius: 4, background: "rgba(167, 139, 250, 0.1)", color: "#a78bfa", fontSize: 11, fontWeight: 700 }}>{log.action}</span>
                    </div>

                    {log.action.includes("Update") && log.previous_value && (
                      <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 13, fontFamily: "monospace" }}>
                        <div style={{ flex: 1, padding: 12, background: "rgba(239, 68, 68, 0.1)", color: "#fca5a5", borderRadius: 6, border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                          <div style={{ fontSize: 10, color: "#ef4444", fontWeight: 700, marginBottom: 4 }}>PREVIOUS</div>
                          <div style={{ wordBreak: "break-all" }}>{log.previous_value}</div>
                        </div>
                        <div style={{ flex: 1, padding: 12, background: "rgba(16, 185, 129, 0.1)", color: "#6ee7b7", borderRadius: 6, border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                          <div style={{ fontSize: 10, color: "#10b981", fontWeight: 700, marginBottom: 4 }}>NEW</div>
                          <div style={{ wordBreak: "break-all" }}>{log.new_value}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default PMEnvVault;
