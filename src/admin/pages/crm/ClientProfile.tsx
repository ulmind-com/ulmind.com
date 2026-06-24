import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getClientAPI, updateClientStatusAPI, deleteClientAPI, addClientCRMDataAPI, updateClientCRMDataAPI, Client } from "../../lib/api";
import { toast } from "sonner";
import { useAuth } from "../../context/auth-context";
import { useAdminAction } from "../../context/AdminActionContext";
import { AdminTable } from "../../components/AdminTable";
import { DynamicAddModal, ModalField } from "../../components/DynamicAddModal";
import { 
  ArrowLeft, Building, Mail, Phone, MapPin, 
  Globe, User, LayoutGrid, FileText, Briefcase, 
  Receipt, FileSignature, FolderOpen, Calendar, 
  MessageSquare, Activity, Loader2, Plus
} from "lucide-react";
import { getTabConfigs } from "./clientProfileConfig";

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
  const { user: currentUser } = useAuth();
  const { triggerActionAnimation } = useAdminAction();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    fields: ModalField[];
    fieldKey: string;
  } | null>(null);

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setModalConfig(tabConfigs[activeTab]);
    setShowAddModal(true);
  };

  const tabConfigs = getTabConfigs(handleEdit);

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

  const handleToggleStatus = async () => {
    if (!client) return;
    const newStatus = client.status === "Active" ? "Inactive" : "Active";
    try {
      await updateClientStatusAPI(client._id, newStatus);
      setClient({ ...client, status: newStatus });
      toast.success(`Client marked as ${newStatus}`);
      triggerActionAnimation('success');
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const handleDeleteClient = async () => {
    if (!client || !id) return;
    if (!window.confirm(`Are you sure you want to permanently delete "${client.companyName}"? This action cannot be undone.`)) return;
    
    try {
      await deleteClientAPI(id);
      toast.success("Client deleted successfully");
      triggerActionAnimation('delete');
      navigate("/admin/crm/clients");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete client");
    }
  };

  const handleAddCRMData = async (data: any) => {
    if (!client || !id || !modalConfig) return;
    try {
      let finalData = { ...data };
      if (modalConfig.fieldKey === "notes") {
        finalData.author_id = currentUser?.id || "unknown";
      }

      if (editingItem) {
        // Edit existing item
        finalData = { ...editingItem, ...finalData };
        await updateClientCRMDataAPI(id, modalConfig.fieldKey, editingItem.id, finalData);
        toast.success(`${modalConfig.title.replace("Add ", "")} updated successfully`);
      } else {
        // Add new item
        await addClientCRMDataAPI(id, modalConfig.fieldKey, finalData);
        toast.success(`${modalConfig.title.replace("Add ", "")} added successfully`);
      }
      
      triggerActionAnimation('success');
      fetchClientDetails(id);
      setShowAddModal(false);
      setEditingItem(null);
    } catch (err: any) {
      throw new Error(err.message || "Failed to save data");
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
        <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span className="admin-badge admin-badge-warning" style={{ fontSize: 14, padding: "6px 12px" }}>
              {client.crm_data?.stage || "Lead"}
            </span>
            <button 
              onClick={handleToggleStatus}
              style={{
                padding: "6px 12px", borderRadius: 6, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer",
                background: client.status === "Active" ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)",
                color: client.status === "Active" ? "#ef4444" : "#10b981",
                transition: "all 0.2s"
              }}
            >
              {client.status === "Active" ? "Deactivate" : "Activate"}
            </button>
            {currentUser?.role?.toLowerCase() === "super_admin" && (
              <button 
                onClick={handleDeleteClient}
                style={{
                  padding: "6px 12px", borderRadius: 6, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer",
                  background: "rgba(239, 68, 68, 0.1)",
                  color: "#ef4444",
                  transition: "all 0.2s"
                }}
                title="Delete Client"
              >
                Delete
              </button>
            )}
          </div>
          <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>LTV: ₹{client.lifetime_value?.toLocaleString() || "0"}</p>
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
                  <p style={{ fontSize: 15, color: "#10b981", fontWeight: 500 }}>₹{client.revenue?.toLocaleString() || "0"}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab !== "overview" && (
            <div className="admin-glass-panel" style={{ padding: 24, minHeight: 400 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: 12 }}>
                  {tabs.find(t => t.id === activeTab)?.label}
                  {client.crm_data?.[tabConfigs[activeTab]?.fieldKey as keyof typeof client.crm_data]?.length > 0 && (
                     <span className="admin-badge admin-badge-primary" style={{ fontSize: 12 }}>
                       {client.crm_data[tabConfigs[activeTab].fieldKey as keyof typeof client.crm_data].length}
                     </span>
                  )}
                </h3>
                {tabConfigs[activeTab] && (
                  <button 
                    onClick={() => {
                      setEditingItem(null);
                      setModalConfig(tabConfigs[activeTab]);
                      setShowAddModal(true);
                    }}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "rgba(56, 189, 248, 0.1)", border: "1px solid rgba(56, 189, 248, 0.2)", color: "#38bdf8", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
                  >
                    <Plus size={16} /> Add New
                  </button>
                )}
              </div>

              {tabConfigs[activeTab] && client.crm_data?.[tabConfigs[activeTab].fieldKey as keyof typeof client.crm_data]?.length > 0 ? (
                <AdminTable 
                  data={client.crm_data[tabConfigs[activeTab].fieldKey as keyof typeof client.crm_data]} 
                  columns={tabConfigs[activeTab].columns} 
                />
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200 }}>
                  <p style={{ color: "#64748b", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                    <FolderOpen size={32} opacity={0.5} />
                    No records found. Click "Add New" to get started.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {modalConfig && (
        <DynamicAddModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setEditingItem(null);
          }}
          title={editingItem ? modalConfig.title.replace("Add", "Edit") : modalConfig.title}
          fields={modalConfig.fields.map(f => ({
            ...f,
            defaultValue: editingItem ? editingItem[f.name] : undefined
          }))}
          onSubmit={handleAddCRMData}
          submitText={editingItem ? "Save Changes" : modalConfig.title}
        />
      )}
    </motion.div>
  );
};

export default ClientProfile;
