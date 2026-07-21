/* ──────────────────────────────────────────────────────────────
   CrmRecordSection — the shared engine behind Contact History,
   Meeting Notes, Contracts and Documents.
   ----------------------------------------------------------------
   Each of those pages is the same thing: a client-linked list with
   full create / edit / delete. Sharing one implementation means a
   fix in one place applies to all four.
   ────────────────────────────────────────────────────────────── */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Plus, Pencil, Trash2, Filter } from "lucide-react";
import { toast } from "sonner";
import { AdminTable, ColumnDef } from "../../components/AdminTable";
import { DynamicAddModal, ModalField } from "../../components/DynamicAddModal";
import {
  CrmResource, getCrmRecordsAPI, createCrmRecordAPI,
  updateCrmRecordAPI, deleteCrmRecordAPI, Client,
} from "../../lib/api";
import { useCrmClients, ClientCell, cleanPayload } from "./useCrmClients";

interface Props {
  resource: CrmResource;
  title: string;
  subtitle: string;
  addLabel: string;
  /** Columns specific to this record type. Client + Actions are added here. */
  columns: ColumnDef<any>[];
  /** Modal fields specific to this record type. Client picker is added here. */
  fields: (helpers: { clientField: (required?: boolean) => ModalField }) => ModalField[];
  /** Extra values merged into every create request (e.g. author_id). */
  createDefaults?: Record<string, any>;
  /** Field names the API accepts, so stray UI-only keys are stripped. */
  writableFields: string[];
  searchPlaceholder?: string;
}

export const CrmRecordSection: React.FC<Props> = ({
  resource, title, subtitle, addLabel, columns, fields,
  createDefaults = {}, writableFields, searchPlaceholder,
}) => {
  const { clientsById, clientField, clientOptions } = useCrmClients();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [clientFilter, setClientFilter] = useState<string>("");

  const fetchRecords = useCallback(async () => {
    try {
      setError(null);
      const data = await getCrmRecordsAPI(resource);
      setRecords(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || `Failed to load ${resource}`);
    } finally {
      setLoading(false);
    }
  }, [resource]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  const handleSubmit = async (data: any) => {
    const payload = cleanPayload(data, writableFields);
    if (editing) {
      await updateCrmRecordAPI(resource, editing._id, payload);
      toast.success(`${title} entry updated`);
    } else {
      await createCrmRecordAPI(resource, { ...createDefaults, ...payload });
      toast.success(`${title} entry created`);
    }
    setEditing(null);
    fetchRecords();
  };

  const handleDelete = async (row: any) => {
    const label = row.title || row.content || "this record";
    if (!window.confirm(`Delete "${String(label).slice(0, 60)}"? This cannot be undone.`)) return;
    try {
      await deleteCrmRecordAPI(resource, row._id);
      // Drop it locally too so the row disappears instantly.
      setRecords((prev) => prev.filter((r) => r._id !== row._id));
      toast.success("Deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
      fetchRecords();
    }
  };

  const visibleRecords = useMemo(
    () => (clientFilter ? records.filter((r) => r.client_id === clientFilter) : records),
    [records, clientFilter]
  );

  const allColumns = useMemo<ColumnDef<any>[]>(() => [
    {
      key: "client_id",
      header: "Client",
      render: (row) => <ClientCell clientId={row.client_id} clientsById={clientsById} />,
    },
    ...columns,
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => { setEditing(row); setShowModal(true); }}
            title="Edit"
            style={actionBtn("#38bdf8")}
          >
            <Pencil size={13} /> Edit
          </button>
          <button onClick={() => handleDelete(row)} title="Delete" style={actionBtn("#f87171")}>
            <Trash2 size={13} /> Delete
          </button>
        </div>
      ),
    },
  ], [columns, clientsById]);

  const modalFields = useMemo(() => fields({ clientField }), [fields, clientOptions]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 100 }}>
        <Loader2 className="animate-spin text-slate-500" size={40} />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>
            {title}
            <span className="admin-badge admin-badge-primary" style={{ fontSize: 12, marginLeft: 12 }}>
              {visibleRecords.length}
            </span>
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 14 }}>{subtitle}</p>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Filter size={14} color="#64748b" />
            <select
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              style={{
                background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8, padding: "8px 12px", color: "#fff", fontSize: 13, outline: "none",
              }}
            >
              <option value="">All clients</option>
              {clientOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => { setEditing(null); setShowModal(true); }}
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8,
              background: "#38bdf8", border: "none", color: "#000", cursor: "pointer",
              fontSize: 13, fontWeight: 700,
            }}
          >
            <Plus size={16} /> {addLabel}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: "12px 16px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, color: "#fca5a5", fontSize: 13, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {visibleRecords.length === 0 && !error ? (
        <div className="admin-glass-panel" style={{ padding: 48, textAlign: "center", color: "#64748b" }}>
          {clientFilter ? "No records for this client yet." : `No ${title.toLowerCase()} recorded yet.`}
        </div>
      ) : (
        <AdminTable data={visibleRecords} columns={allColumns} searchPlaceholder={searchPlaceholder} />
      )}

      <DynamicAddModal
        key={editing?._id || "new"}
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditing(null); }}
        title={editing ? `Edit ${addLabel.replace(/^(Add|Log|New|Schedule|Upload)\s*/i, "")}` : addLabel}
        fields={modalFields.map((f) => ({
          ...f,
          defaultValue: editing ? normaliseForInput(editing[f.name], f.type) : f.defaultValue,
        }))}
        onSubmit={handleSubmit}
        submitText={editing ? "Save Changes" : addLabel}
      />
    </motion.div>
  );
};

/** <input type="date"> only accepts YYYY-MM-DD, not a full ISO timestamp. */
const normaliseForInput = (value: any, type: ModalField["type"]) => {
  if (value === undefined || value === null) return undefined;
  if (type === "date" && typeof value === "string") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
  }
  return value;
};

const actionBtn = (color: string): React.CSSProperties => ({
  display: "flex", alignItems: "center", gap: 4,
  background: `${color}1a`, border: `1px solid ${color}33`, color,
  cursor: "pointer", fontWeight: 600, fontSize: 12,
  padding: "5px 10px", borderRadius: 6,
});
