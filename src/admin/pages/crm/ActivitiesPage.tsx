import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { getCrmActivitiesAPI, authFetch } from "../../lib/api";
import { Loader2, Plus } from "lucide-react";
import { AdminTable, ColumnDef } from "../../components/AdminTable";
import { DynamicAddModal, ModalField } from "../../components/DynamicAddModal";
import { toast } from "sonner";

const ActivitiesPage: React.FC = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const data = await getCrmActivitiesAPI();
      setActivities(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo<ColumnDef<any>[]>(() => [
    { 
      key: "type", 
      header: "Type", 
      render: (row) => <span className="admin-badge admin-badge-info" style={{ textTransform: "capitalize" }}>{row.type}</span> 
    },
    { key: "content", header: "Activity Content" },
    { key: "author_id", header: "Logged By" },
    { 
      key: "created_at", 
      header: "Date",
      render: (row) => new Date(row.created_at).toLocaleString() 
    },
  ], []);

  const fields: ModalField[] = [
    { name: "type", label: "Activity Type", type: "select", required: true, options: [
      { label: "Call", value: "call" },
      { label: "Email", value: "email" },
      { label: "Note", value: "note" },
      { label: "Meeting", value: "meeting" }
    ]},
    { name: "content", label: "Details", type: "textarea", required: true },
    { name: "client_id", label: "Client ID (Optional)", type: "text" },
  ];

  const handleAdd = async (data: any) => {
    try {
      const res = await authFetch("/crm/activities", {
        method: "POST",
        body: JSON.stringify({ ...data, author_id: "admin" })
      });
      if (!res.ok) throw new Error("Failed to log activity");
      toast.success("Activity logged successfully");
      fetchActivities();
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin text-slate-500" size={40} /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>Contact History</h2>
          <p style={{ color: "#94a3b8", fontSize: 14 }}>Global log of all client interactions and internal notes.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "#38bdf8", border: "none", color: "#000", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
          <Plus size={16} /> Log Activity
        </button>
      </div>

      <AdminTable data={activities} columns={columns} searchPlaceholder="Search activities..." />

      <DynamicAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Log Activity"
        fields={fields}
        onSubmit={handleAdd}
        submitText="Save Log"
      />
    </motion.div>
  );
};

export default ActivitiesPage;
