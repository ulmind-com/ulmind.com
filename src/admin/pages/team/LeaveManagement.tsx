import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { getTeamLeavesAPI, authFetch } from "../../lib/api";
import { Loader2, Plus } from "lucide-react";
import { AdminTable, ColumnDef } from "../../components/AdminTable";
import { DynamicAddModal, ModalField } from "../../components/DynamicAddModal";
import { toast } from "sonner";

const LeaveManagement: React.FC = () => {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => { fetchLeaves(); }, []);
  const fetchLeaves = async () => {
    try { setLeaves(await getTeamLeavesAPI()); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const pending = useMemo(() => leaves.filter(l => l.status === "Pending").length, [leaves]);
  const approved = useMemo(() => leaves.filter(l => l.status === "Approved").length, [leaves]);

  const columns = useMemo<ColumnDef<any>[]>(() => [
    { key: "employee_id", header: "Employee" },
    { 
      key: "leave_type", 
      header: "Leave Type",
      render: (p) => <span className="admin-badge admin-badge-info">{p.leave_type}</span>
    },
    { 
      key: "from_date", 
      header: "From",
      render: (p) => p.from_date ? new Date(p.from_date).toLocaleDateString() : "N/A"
    },
    { 
      key: "to_date", 
      header: "To",
      render: (p) => p.to_date ? new Date(p.to_date).toLocaleDateString() : "N/A"
    },
    { key: "reason", header: "Reason" },
    { 
      key: "status", 
      header: "Status",
      render: (p) => {
        const c: any = { Approved: "admin-badge-success", Pending: "admin-badge-warning", Rejected: "admin-badge-danger" };
        return <span className={`admin-badge ${c[p.status] || "admin-badge-info"}`}>{p.status}</span>;
      }
    },
    { 
      key: "actions", 
      header: "Actions",
      render: (p) => p.status === "Pending" ? (
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ fontSize: 12, color: "#10b981", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: 4, padding: "4px 8px", cursor: "pointer", fontWeight: 600 }}>Approve</button>
          <button style={{ fontSize: 12, color: "#ef4444", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: 4, padding: "4px 8px", cursor: "pointer", fontWeight: 600 }}>Reject</button>
        </div>
      ) : null
    },
  ], []);

  const fields: ModalField[] = [
    { name: "employee_id", label: "Employee ID", type: "text", required: true },
    { name: "leave_type", label: "Leave Type", type: "select", required: true, options: [
      { label: "Sick Leave", value: "Sick Leave" },
      { label: "Casual Leave", value: "Casual Leave" },
      { label: "Paid Leave", value: "Paid Leave" },
      { label: "Unpaid Leave", value: "Unpaid Leave" }
    ], defaultValue: "Casual Leave" },
    { name: "from_date", label: "From Date", type: "date", required: true },
    { name: "to_date", label: "To Date", type: "date", required: true },
    { name: "reason", label: "Reason", type: "textarea", required: true },
  ];

  const handleAdd = async (data: any) => {
    try {
      const res = await authFetch("/team/leaves", {
        method: "POST",
        body: JSON.stringify({ ...data, status: "Pending" })
      });
      if (!res.ok) throw new Error("Failed to apply for leave");
      toast.success("Leave applied successfully");
      fetchLeaves();
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin" size={40} color="#64748b" /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>Leave Management</h2>
          <p style={{ color: "#94a3b8", fontSize: 14 }}>Pending: <span style={{ color: "#f59e0b", fontWeight: 700 }}>{pending}</span> · Approved: <span style={{ color: "#10b981", fontWeight: 700 }}>{approved}</span></p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "#38bdf8", border: "none", color: "#000", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
          <Plus size={16} /> Apply Leave
        </button>
      </div>

      <AdminTable data={leaves} columns={columns} searchPlaceholder="Search leaves..." />

      <DynamicAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Apply for Leave"
        fields={fields}
        onSubmit={handleAdd}
        submitText="Submit Application"
      />
    </motion.div>
  );
};

export default LeaveManagement;
