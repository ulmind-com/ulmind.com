import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  getClientAPI, updateClientAPI, updateClientStatusAPI, updateClientStageAPI,
  deleteClientAPI, addClientCRMDataAPI, updateClientCRMDataAPI, deleteClientCRMDataAPI,
  getCrmRecordsAPI, createCrmRecordAPI, updateCrmRecordAPI, deleteCrmRecordAPI,
  getInvoicesAPI, Client,
} from "../../lib/api";
import { toast } from "sonner";
import { useAuth } from "../../context/auth-context";
import { useAdminAction } from "../../context/AdminActionContext";
import { AdminTable, ColumnDef } from "../../components/AdminTable";
import { DynamicAddModal, ModalField } from "../../components/DynamicAddModal";
import {
  ArrowLeft, Building, Mail, Phone, MapPin, User, LayoutGrid,
  Briefcase, Receipt, FileSignature, FolderOpen, Calendar,
  MessageSquare, Activity, Loader2, Plus, Pencil, Trash2,
} from "lucide-react";
import { TAB_CONFIGS, TAB_ORDER, MergedRow } from "./clientProfileConfig";
import { formatINR, cleanPayload } from "./useCrmClients";

const CRM_STAGES = ["Lead", "Qualified", "Prospect", "Proposal Sent", "Negotiation", "Won", "Active Client", "Closed Lost"];

const TAB_ICONS: Record<string, React.ReactNode> = {
  overview: <LayoutGrid size={16} />,
  contacts: <User size={16} />,
  projects: <Briefcase size={16} />,
  invoices: <Receipt size={16} />,
  contracts: <FileSignature size={16} />,
  documents: <FolderOpen size={16} />,
  meetings: <Calendar size={16} />,
  notes: <MessageSquare size={16} />,
  activity: <Activity size={16} />,
};

const CLIENT_FIELDS: ModalField[] = [
  { name: "companyName", label: "Company Name", type: "text", required: true },
  { name: "contactName", label: "Contact Name", type: "text" },
  { name: "contactEmail", label: "Email Address", type: "email", required: true },
  { name: "phone", label: "Phone Number", type: "text" },
  { name: "industry", label: "Industry", type: "text" },
  { name: "address", label: "Address", type: "text" },
  { name: "assigned_manager", label: "Assigned Manager", type: "text" },
  { name: "revenue", label: "Revenue (₹)", type: "number" },
  { name: "lifetime_value", label: "Lifetime Value (₹)", type: "number" },
];

const ClientProfile: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { triggerActionAnimation } = useAdminAction();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  /** Records held in the standalone CRM collections for THIS client. */
  const [collections, setCollections] = useState<Record<string, any[]>>({
    contracts: [], meetings: [], documents: [], activities: [], invoices: [],
  });

  const [showModal, setShowModal] = useState(false);
  const [editingRow, setEditingRow] = useState<MergedRow | null>(null);
  const [showClientEdit, setShowClientEdit] = useState(false);

  const authorName = currentUser?.full_name || currentUser?.email || "admin";

  const fetchAll = useCallback(async (clientId: string) => {
    try {
      const [c, contracts, meetings, documents, activities, invoices] = await Promise.all([
        getClientAPI(clientId),
        getCrmRecordsAPI("contracts", clientId).catch(() => []),
        getCrmRecordsAPI("meetings", clientId).catch(() => []),
        getCrmRecordsAPI("documents", clientId).catch(() => []),
        getCrmRecordsAPI("activities", clientId).catch(() => []),
        getInvoicesAPI(clientId).catch(() => []),
      ]);
      setClient(c);
      setCollections({ contracts, meetings, documents, activities, invoices });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load client");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (id) fetchAll(id); }, [id, fetchAll]);

  /** Merge the collection records with the legacy crm_data array for a tab. */
  const rowsForTab = useCallback((tabId: string): MergedRow[] => {
    const cfg = TAB_CONFIGS[tabId];
    if (!cfg || !client) return [];

    const collectionKey = cfg.external === "invoices" ? "invoices" : cfg.resource;
    const fromCollection: MergedRow[] = collectionKey
      ? (collections[collectionKey] || []).map((r: any) => ({
          ...r,
          // Invoices store the figure under `total`, the tab renders `amount`.
          amount: r.amount ?? r.total,
          __source: "collection" as const,
          __id: r._id,
        }))
      : [];

    const legacyItems = (client.crm_data as any)?.[cfg.fieldKey] || [];
    const fromLegacy: MergedRow[] = legacyItems.map((item: any) => ({
      ...cfg.fromLegacy(item),
      __source: "legacy" as const,
      __id: item.id,
    }));

    return [...fromCollection, ...fromLegacy].sort((a, b) =>
      new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );
  }, [client, collections]);

  const handleToggleStatus = async () => {
    if (!client) return;
    const newStatus = client.status === "Active" ? "Inactive" : "Active";
    try {
      await updateClientStatusAPI(client._id, newStatus);
      setClient({ ...client, status: newStatus });
      toast.success(`Client marked as ${newStatus}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const handleStageChange = async (stage: string) => {
    if (!client) return;
    const previous = client.crm_data?.stage;
    setClient({ ...client, crm_data: { ...client.crm_data, stage } });
    try {
      await updateClientStageAPI(client._id, stage);
      toast.success(`Stage set to ${stage}`);
    } catch (err: any) {
      setClient((c) => c ? { ...c, crm_data: { ...c.crm_data, stage: previous } } : c);
      toast.error(err.message || "Failed to update stage");
    }
  };

  const handleDeleteClient = async () => {
    if (!client || !id) return;
    if (!window.confirm(`Permanently delete "${client.companyName}"? This cannot be undone.`)) return;
    try {
      await deleteClientAPI(id);
      toast.success("Client deleted");
      triggerActionAnimation("delete");
      navigate("/admin/crm/clients");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete client");
    }
  };

  const handleSaveClient = async (data: any) => {
    if (!id) return;
    const updated = await updateClientAPI(id, cleanPayload(data) as any);
    setClient(updated);
    toast.success("Client details updated");
  };

  /** Create or edit a record in whichever store the row belongs to. */
  const handleSaveRow = async (data: any) => {
    const cfg = TAB_CONFIGS[activeTab];
    if (!cfg || !id) return;
    const payload = cleanPayload(data, cfg.writableFields);

    // Editing an existing row: stay in the store it already lives in, so a
    // legacy record is never silently duplicated into a collection.
    if (editingRow) {
      if (editingRow.__source === "collection" && cfg.resource) {
        await updateCrmRecordAPI(cfg.resource, editingRow.__id, payload);
      } else {
        await updateClientCRMDataAPI(id, cfg.fieldKey, editingRow.__id, {
          ...editingRow, ...payload, id: editingRow.__id,
        });
      }
      toast.success(`${cfg.label} updated`);
    } else if (cfg.resource) {
      // New records go to the collection — the single source of truth.
      await createCrmRecordAPI(cfg.resource, {
        ...payload,
        client_id: id,
        ...(cfg.resource === "activities" ? { author_id: authorName } : {}),
      });
      toast.success(`${cfg.label} added`);
    } else {
      await addClientCRMDataAPI(id, cfg.fieldKey, {
        ...payload,
        ...(cfg.fieldKey === "notes" ? { author_id: authorName } : {}),
      });
      toast.success(`${cfg.label} added`);
    }

    setEditingRow(null);
    setShowModal(false);
    await fetchAll(id);
  };

  const handleDeleteRow = async (row: MergedRow) => {
    const cfg = TAB_CONFIGS[activeTab];
    if (!cfg || !id) return;
    const label = row.title || row.name || row.content || "this record";
    if (!window.confirm(`Delete "${String(label).slice(0, 60)}"? This cannot be undone.`)) return;
    try {
      if (row.__source === "collection" && cfg.resource) {
        await deleteCrmRecordAPI(cfg.resource, row.__id);
      } else if (row.__source === "collection") {
        toast.error("Invoices are managed in the Finance module.");
        return;
      } else {
        await deleteClientCRMDataAPI(id, cfg.fieldKey, row.__id);
      }
      toast.success("Deleted");
      await fetchAll(id);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  const activeConfig = activeTab === "overview" ? null : TAB_CONFIGS[activeTab];
  const activeRows = useMemo(
    () => (activeTab === "overview" ? [] : rowsForTab(activeTab)),
    [activeTab, rowsForTab]
  );

  const tableColumns = useMemo<ColumnDef<any>[]>(() => {
    if (!activeConfig) return [];
    return [
      ...activeConfig.columns,
      {
        key: "actions",
        header: "Actions",
        render: (row: MergedRow) => (
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => { setEditingRow(row); setShowModal(true); }} style={actionBtn("#38bdf8")}>
              <Pencil size={13} /> Edit
            </button>
            <button onClick={() => handleDeleteRow(row)} style={actionBtn("#f87171")}>
              <Trash2 size={13} /> Delete
            </button>
          </div>
        ),
      },
    ];
  }, [activeConfig, activeTab, id]);

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin text-slate-500" size={40} /></div>;
  }
  if (!client) return <div style={{ color: "#fff", padding: 40 }}>Client not found.</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <button
        onClick={() => navigate("/admin/crm/clients")}
        style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "#94a3b8", cursor: "pointer", marginBottom: 24, fontSize: 14 }}
      >
        <ArrowLeft size={16} /> Back to Directory
      </button>

      {/* ── Header ── */}
      <div className="admin-glass-panel" style={{ padding: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, gap: 24, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 24 }}>
          <div style={{ width: 80, height: 80, borderRadius: 16, background: "linear-gradient(135deg, #38bdf8, #818cf8)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 32, fontWeight: 700, flexShrink: 0 }}>
            {client.companyName.charAt(0)}
          </div>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 8, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              {client.companyName}
              <span className={`admin-badge ${client.status === "Active" ? "admin-badge-success" : "admin-badge-warning"}`} style={{ fontSize: 12, padding: "4px 8px" }}>
                {client.status}
              </span>
            </h2>
            <div style={{ display: "flex", gap: 16, color: "#94a3b8", fontSize: 14, flexWrap: "wrap" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Mail size={14} /> {client.contactEmail}</span>
              {client.phone && <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Phone size={14} /> {client.phone}</span>}
              {client.industry && <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Building size={14} /> {client.industry}</span>}
              {client.address && <span style={{ display: "flex", alignItems: "center", gap: 6 }}><MapPin size={14} /> {client.address}</span>}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
            {/* Stage is editable straight from the profile, mirroring the board. */}
            <select
              value={client.crm_data?.stage || "Lead"}
              onChange={(e) => handleStageChange(e.target.value)}
              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, padding: "6px 10px", color: "#fff", fontSize: 13, outline: "none" }}
            >
              {CRM_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={() => setShowClientEdit(true)} style={headerBtn("#38bdf8")}>Edit</button>
            <button onClick={handleToggleStatus} style={headerBtn(client.status === "Active" ? "#ef4444" : "#10b981")}>
              {client.status === "Active" ? "Deactivate" : "Activate"}
            </button>
            {currentUser?.role?.toLowerCase() === "super_admin" && (
              <button onClick={handleDeleteClient} style={headerBtn("#ef4444")}>Delete</button>
            )}
          </div>
          <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
            Revenue {formatINR(client.revenue)} · LTV {formatINR(client.lifetime_value)}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* ── Tabs ── */}
        <div style={{ width: 220, display: "flex", flexDirection: "column", gap: 4 }}>
          <TabButton id="overview" label="Overview" active={activeTab} onSelect={setActiveTab} />
          {TAB_ORDER.map((tabId) => (
            <TabButton
              key={tabId}
              id={tabId}
              label={TAB_CONFIGS[tabId].label}
              count={rowsForTab(tabId).length}
              active={activeTab}
              onSelect={setActiveTab}
            />
          ))}
        </div>

        {/* ── Content ── */}
        <div style={{ flex: 1, minWidth: 320 }}>
          {activeTab === "overview" ? (
            <div className="admin-glass-panel" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "#fff", marginBottom: 20 }}>Overview</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 24 }}>
                <Field label="Assigned Manager" value={client.assigned_manager || "Unassigned"} />
                <Field label="Pipeline Stage" value={client.crm_data?.stage || "Lead"} />
                <Field label="Revenue Generated" value={formatINR(client.revenue)} color="#10b981" />
                <Field label="Lifetime Value" value={formatINR(client.lifetime_value)} color="#10b981" />
                <Field label="Contact Person" value={client.contactName || "—"} />
                <Field label="Industry" value={client.industry || "—"} />
              </div>

              <h4 style={{ fontSize: 14, fontWeight: 600, color: "#94a3b8", margin: "28px 0 12px" }}>Linked records</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
                {TAB_ORDER.map((tabId) => (
                  <button
                    key={tabId}
                    onClick={() => setActiveTab(tabId)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
                      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 8, padding: "10px 12px", color: "#cbd5e1", cursor: "pointer", fontSize: 13,
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {TAB_ICONS[tabId]} {TAB_CONFIGS[tabId].label}
                    </span>
                    <span style={{ color: "#38bdf8", fontWeight: 700 }}>{rowsForTab(tabId).length}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="admin-glass-panel" style={{ padding: 24, minHeight: 400 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, gap: 12, flexWrap: "wrap" }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: 12 }}>
                  {activeConfig?.label}
                  {activeRows.length > 0 && (
                    <span className="admin-badge admin-badge-primary" style={{ fontSize: 12 }}>{activeRows.length}</span>
                  )}
                </h3>
                <button
                  onClick={() => { setEditingRow(null); setShowModal(true); }}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)", color: "#38bdf8", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
                >
                  <Plus size={16} /> {activeConfig?.addLabel}
                </button>
              </div>

              {activeRows.length > 0 ? (
                <AdminTable data={activeRows} columns={tableColumns} />
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200 }}>
                  <p style={{ color: "#64748b", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                    <FolderOpen size={32} opacity={0.5} />
                    No records found. Click "{activeConfig?.addLabel}" to get started.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {activeConfig && (
        <DynamicAddModal
          key={`${activeTab}-${editingRow?.__id || "new"}`}
          isOpen={showModal}
          onClose={() => { setShowModal(false); setEditingRow(null); }}
          title={editingRow ? `Edit ${activeConfig.label}` : activeConfig.addLabel}
          fields={activeConfig.fields.map((f) => ({
            ...f,
            defaultValue: editingRow ? forInput(editingRow[f.name], f.type) : f.defaultValue,
          }))}
          onSubmit={handleSaveRow}
          submitText={editingRow ? "Save Changes" : activeConfig.addLabel}
        />
      )}

      <DynamicAddModal
        key={`client-edit-${client._id}`}
        isOpen={showClientEdit}
        onClose={() => setShowClientEdit(false)}
        title="Edit Client Details"
        fields={CLIENT_FIELDS.map((f) => ({ ...f, defaultValue: (client as any)[f.name] ?? "" }))}
        onSubmit={handleSaveClient}
        submitText="Save Changes"
      />
    </motion.div>
  );
};

/** <input type="date"> needs YYYY-MM-DD, not a full ISO timestamp. */
const forInput = (value: any, type: ModalField["type"]) => {
  if (value === undefined || value === null) return undefined;
  if (type === "date" && typeof value === "string") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
  }
  return value;
};

const TabButton: React.FC<{
  id: string; label: string; count?: number; active: string; onSelect: (id: string) => void;
}> = ({ id, label, count, active, onSelect }) => (
  <button
    onClick={() => onSelect(id)}
    style={{
      display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 8,
      fontSize: 14, fontWeight: 500,
      background: active === id ? "rgba(255,255,255,0.1)" : "transparent",
      color: active === id ? "#fff" : "#94a3b8",
      border: "none", cursor: "pointer", textAlign: "left", transition: "all 0.2s",
    }}
  >
    {TAB_ICONS[id]}
    <span style={{ flex: 1 }}>{label}</span>
    {count !== undefined && count > 0 && (
      <span style={{ fontSize: 11, color: "#38bdf8", fontWeight: 700 }}>{count}</span>
    )}
  </button>
);

const Field: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color }) => (
  <div>
    <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 4 }}>{label}</p>
    <p style={{ fontSize: 15, color: color || "#fff", fontWeight: 500 }}>{value}</p>
  </div>
);

const headerBtn = (color: string): React.CSSProperties => ({
  padding: "6px 12px", borderRadius: 6, fontSize: 13, fontWeight: 600, border: "none",
  cursor: "pointer", background: `${color}1a`, color, transition: "all 0.2s",
});

const actionBtn = (color: string): React.CSSProperties => ({
  display: "flex", alignItems: "center", gap: 4,
  background: `${color}1a`, border: `1px solid ${color}33`, color,
  cursor: "pointer", fontWeight: 600, fontSize: 12,
  padding: "5px 10px", borderRadius: 6,
});

export default ClientProfile;
