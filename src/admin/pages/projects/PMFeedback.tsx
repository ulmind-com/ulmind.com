import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { getPmFeedbackAPI, authFetch } from "../../lib/api";
import { Loader2, Plus, Star } from "lucide-react";
import { AdminTable, ColumnDef } from "../../components/AdminTable";
import { DynamicAddModal, ModalField } from "../../components/DynamicAddModal";
import { toast } from "sonner";

const PMFeedback: React.FC = () => {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => { fetchFeedback(); }, []);
  const fetchFeedback = async () => {
    try { setFeedback(await getPmFeedbackAPI()); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const columns = useMemo<ColumnDef<any>[]>(() => [
    { key: "content", header: "Feedback" },
    { 
      key: "rating", 
      header: "Rating",
      render: (p) => {
        const rating = p.rating || 0;
        return <span style={{ display: "flex", gap: 2 }}>{[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i <= rating ? "#f59e0b" : "transparent"} color={i <= rating ? "#f59e0b" : "#475569"} />)}</span>;
      }
    },
    { 
      key: "status", 
      header: "Status",
      render: (p) => {
        const c: any = { Open: "admin-badge-warning", Acknowledged: "admin-badge-info", Resolved: "admin-badge-success" };
        return <span className={`admin-badge ${c[p.status] || "admin-badge-info"}`}>{p.status}</span>;
      }
    },
    { 
      key: "created_at", 
      header: "Date",
      render: (p) => p.created_at ? new Date(p.created_at).toLocaleDateString() : "N/A"
    },
  ], []);

  const fields: ModalField[] = [
    { name: "content", label: "Feedback Content", type: "textarea", required: true },
    { name: "rating", label: "Rating (1-5)", type: "number", required: true, defaultValue: 5 },
    { name: "client_id", label: "Client ID", type: "text" },
    { name: "project_id", label: "Project ID", type: "text" },
  ];

  const handleAdd = async (data: any) => {
    try {
      const res = await authFetch("/pm/feedback", {
        method: "POST",
        body: JSON.stringify({ ...data, status: "Open" })
      });
      if (!res.ok) throw new Error("Failed to submit feedback");
      toast.success("Feedback submitted successfully");
      fetchFeedback();
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin" size={40} color="#64748b" /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <div><h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>Client Feedback</h2><p style={{ color: "#94a3b8", fontSize: 14 }}>Collect and manage client communication.</p></div>
        <button onClick={() => setShowAddModal(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "#38bdf8", border: "none", color: "#000", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
          <Plus size={16} /> Add Feedback
        </button>
      </div>
      
      <AdminTable data={feedback} columns={columns} searchPlaceholder="Search feedback..." />

      <DynamicAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Submit Feedback"
        fields={fields}
        onSubmit={handleAdd}
        submitText="Save Feedback"
      />
    </motion.div>
  );
};

export default PMFeedback;
