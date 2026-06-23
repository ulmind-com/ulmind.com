import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getClientAPI, Client } from "../../lib/api";
import { 
  ArrowLeft, Building, Mail, Phone, MapPin, 
  Globe, User, LayoutGrid, FileText, Briefcase, 
  Receipt, FileSignature, FolderOpen, Calendar, 
  MessageSquare, Activity, Loader2
} from "lucide-react";

const tabs = [
  { id: "overview", label: "Overview", icon: <LayoutGrid size={16} /> },
  { id: "contacts", label: "Contacts", icon: <User size={16} /> },
  { id: "projects", label: "Projects", icon: <Briefcase size={16} /> },
  { id: "invoices", label: "Invoices", icon: <Receipt size={16} /> },
  { id: "contracts", label: "Contracts", icon: <FileSignature size={16} /> },
  { id: "documents", label: "Documents", icon: <FolderOpen size={16} /> },
  { id: "meetings", label: "Meetings", icon: <Calendar size={16} /> },
  { id: "notes", label: "Notes", icon: <MessageSquare size={16} /> },
  { id: "activity", label: "Activity Logs", icon: <Activity size={16} /> },
];

const ClientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

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

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin text-slate-500" size={40} /></div>;
  if (!client) return <div style={{ color: "#fff", padding: 40 }}>Client not found.</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <button 
        onClick={() => navigate("/admin/crm/clients")} 
        style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "#94a3b8", cursor: "pointer", marginBottom: 24, fontSize: 14 }}
      >
        <ArrowLeft size={16} /> Back to Directory
      </button>

      {/* Header Profile Card */}
      <div className="admin-glass-panel" style={{ padding: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 24 }}>
          <div style={{ width: 80, height: 80, borderRadius: 16, background: "linear-gradient(135deg, #38bdf8, #818cf8)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 32, fontWeight: 700 }}>
            {client.companyName.charAt(0)}
          </div>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
              {client.companyName}
              <span className="admin-badge admin-badge-success" style={{ fontSize: 12, padding: "4px 8px" }}>{client.status}</span>
            </h2>
            <div style={{ display: "flex", gap: 16, color: "#94a3b8", fontSize: 14, flexWrap: "wrap" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Mail size={14} /> {client.contactEmail}</span>
              {client.phone && <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Phone size={14} /> {client.phone}</span>}
              {client.industry && <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Building size={14} /> {client.industry}</span>}
              {client.address && <span style={{ display: "flex", alignItems: "center", gap: 6 }}><MapPin size={14} /> {client.address}</span>}
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <span className="admin-badge admin-badge-warning" style={{ fontSize: 14, padding: "6px 12px" }}>
            {client.crm_data?.stage || "Lead"}
          </span>
          <p style={{ fontSize: 12, color: "#64748b", marginTop: 12 }}>LTV: ${client.lifetime_value?.toLocaleString() || "0"}</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 24 }}>
        {/* Inner Tabs Sidebar */}
        <div style={{ width: 220, display: "flex", flexDirection: "column", gap: 4 }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 8, fontSize: 14, fontWeight: 500,
                background: activeTab === tab.id ? "rgba(255,255,255,0.1)" : "transparent",
                color: activeTab === tab.id ? "#fff" : "#94a3b8",
                border: "none", cursor: "pointer", textAlign: "left", transition: "all 0.2s"
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div style={{ flex: 1 }}>
          {activeTab === "overview" && (
            <div className="admin-glass-panel" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "#fff", marginBottom: 20 }}>Overview</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div>
                  <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 4 }}>Assigned Manager</p>
                  <p style={{ fontSize: 15, color: "#fff", fontWeight: 500 }}>{client.assigned_manager || "Unassigned"}</p>
                </div>
                <div>
                  <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 4 }}>Revenue Generated</p>
                  <p style={{ fontSize: 15, color: "#10b981", fontWeight: 500 }}>${client.revenue?.toLocaleString() || "0"}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab !== "overview" && (
            <div className="admin-glass-panel" style={{ padding: 24, minHeight: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ color: "#64748b", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <FolderOpen size={32} opacity={0.5} />
                {tabs.find(t => t.id === activeTab)?.label} module is active. No records found for this client.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ClientProfile;
