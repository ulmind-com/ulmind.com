import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClientAPI, addClientNoteAPI, Client } from "../../lib/api";
import { useAuth } from "../../context/auth-context";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Phone, Building, Calendar, Loader2, Send } from "lucide-react";

const LeadDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [noteContent, setNoteContent] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);

  useEffect(() => {
    if (id) fetchClientDetails(id);
  }, [id]);

  const fetchClientDetails = async (clientId: string) => {
    try {
      const data = await getClientAPI(clientId);
      setClient(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteContent.trim() || !id || !user) return;
    setSubmittingNote(true);
    try {
      await addClientNoteAPI(id, noteContent, user._id);
      setNoteContent("");
      await fetchClientDetails(id);
    } catch (err) {
      console.error("Failed to add note", err);
    } finally {
      setSubmittingNote(false);
    }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin text-slate-500" size={40} /></div>;
  if (!client) return <div style={{ color: "#fff", padding: 40 }}>Client not found.</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "#94a3b8", cursor: "pointer", marginBottom: 24, fontSize: 14 }}
      >
        <ArrowLeft size={16} /> Back to Pipeline
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
        {/* Main Content: Info & Timeline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Header Card */}
          <div className="admin-glass-panel" style={{ padding: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{client.companyName}</h2>
              <div style={{ display: "flex", gap: 16, color: "#94a3b8", fontSize: 14 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Mail size={16} /> {client.contactEmail}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Building size={16} /> Lead</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span className="admin-badge admin-badge-warning" style={{ fontSize: 14, padding: "6px 12px" }}>
                {client.crm_data?.stage || "Lead"}
              </span>
              <p style={{ fontSize: 12, color: "#64748b", marginTop: 12 }}>Added {new Date(client.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Notes & Activity Timeline */}
          <div className="admin-glass-panel" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#fff", marginBottom: 20 }}>Activity & Notes</h3>
            
            {/* Add Note Input */}
            <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
              <input 
                type="text" 
                placeholder="Log a call, meeting, or internal note..." 
                value={noteContent}
                onChange={e => setNoteContent(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddNote()}
                style={{
                  flex: 1, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
                  padding: "12px 16px", color: "#fff", outline: "none", fontSize: 14
                }}
              />
              <button 
                onClick={handleAddNote}
                disabled={submittingNote || !noteContent.trim()}
                className="admin-btn admin-btn-primary" 
                style={{ padding: "0 20px" }}
              >
                {submittingNote ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>

            {/* Timeline List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {client.crm_data?.notes && client.crm_data.notes.length > 0 ? (
                client.crm_data.notes.slice().reverse().map(note => (
                  <div key={note.id} style={{ display: "flex", gap: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(56, 189, 248, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ color: "#38bdf8", fontWeight: 600, fontSize: 14 }}>A</span>
                    </div>
                    <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontWeight: 500, color: "#e2e8f0", fontSize: 14 }}>Admin Note</span>
                        <span style={{ fontSize: 12, color: "#64748b" }}>{new Date(note.created_at).toLocaleString()}</span>
                      </div>
                      <p style={{ color: "#cbd5e1", fontSize: 14, margin: 0, lineHeight: 1.5 }}>{note.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: "#64748b", textAlign: "center", fontSize: 14, padding: "20px 0" }}>No notes or activity recorded yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: Details & Contracts */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Contracts / Documents */}
          <div className="admin-glass-panel" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 16 }}>Contracts & Files</h3>
            {client.crm_data?.contracts && client.crm_data.contracts.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {client.crm_data.contracts.map(contract => (
                  <div key={contract.id} style={{ display: "flex", justifyContent: "space-between", padding: 12, background: "rgba(0,0,0,0.2)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
                    <span style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 500 }}>{contract.title}</span>
                    <span className="admin-badge admin-badge-success">{contract.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>No active contracts found.</p>
            )}
            <button className="admin-btn admin-btn-ghost" style={{ width: "100%", marginTop: 16, fontSize: 13 }}>+ Upload File</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LeadDetailsPage;
