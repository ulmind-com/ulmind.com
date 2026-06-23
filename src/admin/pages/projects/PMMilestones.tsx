import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { getPmMilestonesAPI, authFetch } from "../../lib/api";
import { Loader2, Plus, Flag } from "lucide-react";
import { AdminTable, ColumnDef } from "../../components/AdminTable";
import { DynamicAddModal, ModalField } from "../../components/DynamicAddModal";
import { toast } from "sonner";

const PMMilestones: React.FC = () => {
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => { fetchMilestones(); }, []);
  const fetchMilestones = async () => {
    try { setMilestones(await getPmMilestonesAPI()); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const columns = useMemo<ColumnDef<any>[]>(() => [
    { key: "title", header: "Milestone" },
    { 
      key: "status", 
      header: "Status",
      render: (p) => {
        const c: any = { Completed: "admin-badge-success", "In Progress": "admin-badge-info", Pending: "admin-badge-warning", Delayed: "admin-badge-danger" };
        return <span className={`admin-badge ${c[p.status] || "admin-badge-info"}`}>{p.status}</span>;
      }
    },
    { 
      key: "completion_pct", 
      header: "Progress",
      render: (p) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: `${p.completion_pct || 0}%`, height: "100%", background: "#10b981", borderRadius: 3 }} />
          </div>
          <span style={{ color: "#94a3b8", fontSize: 12, width: 36 }}>{p.completion_pct || 0}%</span>
        </div>
      )
    },
    { 
      key: "due_date", 
      header: "Due Date",
      render: (p) => p.due_date ? new Date(p.due_date).toLocaleDateString() : "N/A"
    },
  ], []);

  const fields: ModalField[] = [
    { name: "title", label: "Milestone Title", type: "text", required: true },
    { name: "status", label: "Status", type: "select", required: true, options: [
      { label: "Pending", value: "Pending" },
      { label: "In Progress", value: "In Progress" },
      { label: "Completed", value: "Completed" },
      { label: "Delayed", value: "Delayed" }
    ], defaultValue: "Pending" },
    { name: "completion_pct", label: "Progress (%)", type: "number", required: true, defaultValue: 0 },
    { name: "due_date", label: "Due Date", type: "date", required: true },
    { name: "project_id", label: "Project ID (Optional)", type: "text" },
  ];

  const handleAdd = async (data: any) => {
    try {
      const res = await authFetch("/pm/milestones", {
        method: "POST",
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to create milestone");
      toast.success("Milestone created successfully");
      fetchMilestones();
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin" size={40} color="#64748b" /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <div><h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 12 }}><Flag size={24} color="#38bdf8" /> Milestones</h2><p style={{ color: "#94a3b8", fontSize: 14 }}>Track major project phases and deliverables.</p></div>
        <button onClick={() => setShowAddModal(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "#38bdf8", border: "none", color: "#000", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
          <Plus size={16} /> Add Milestone
        </button>
      </div>

      <AdminTable data={milestones} columns={columns} searchPlaceholder="Search milestones..." />

      <DynamicAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create Milestone"
        fields={fields}
        onSubmit={handleAdd}
        submitText="Save Milestone"
      />
    </motion.div>
  );
};

export default PMMilestones;
