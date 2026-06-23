import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { getPmTimeLogsAPI, authFetch } from "../../lib/api";
import { Loader2, Plus, Timer } from "lucide-react";
import { AdminTable, ColumnDef } from "../../components/AdminTable";
import { DynamicAddModal, ModalField } from "../../components/DynamicAddModal";
import { toast } from "sonner";

const PMTimeTracking: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => { fetchLogs(); }, []);
  const fetchLogs = async () => {
    try { setLogs(await getPmTimeLogsAPI()); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const totalHours = useMemo(() => logs.reduce((acc, l) => acc + (l.hours || 0), 0), [logs]);

  const columns = useMemo<ColumnDef<any>[]>(() => [
    { key: "employee_id", header: "Employee" },
    { key: "project_id", header: "Project" },
    { key: "task_id", header: "Task" },
    { 
      key: "hours", 
      header: "Hours",
      render: (p) => <span style={{ color: "#10b981", fontWeight: 600 }}>{p.hours}h</span>
    },
    { key: "notes", header: "Notes" },
    { 
      key: "log_date", 
      header: "Date",
      render: (p) => p.log_date ? new Date(p.log_date).toLocaleDateString() : "N/A"
    },
  ], []);

  const fields: ModalField[] = [
    { name: "employee_id", label: "Employee Email/ID", type: "text", required: true },
    { name: "project_id", label: "Project ID", type: "text", required: true },
    { name: "task_id", label: "Task ID (Optional)", type: "text" },
    { name: "hours", label: "Hours Logged", type: "number", required: true, defaultValue: 1 },
    { name: "notes", label: "Work Notes", type: "textarea", required: true },
    { name: "log_date", label: "Date", type: "date", required: true },
  ];

  const handleAdd = async (data: any) => {
    try {
      const res = await authFetch("/pm/time-logs", {
        method: "POST",
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to log time");
      toast.success("Time logged successfully");
      fetchLogs();
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin" size={40} color="#64748b" /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>Time Tracking</h2>
          <p style={{ color: "#94a3b8", fontSize: 14 }}>Enterprise timesheet management. <span style={{ color: "#10b981", fontWeight: 600 }}>Total: {totalHours.toFixed(1)}h</span></p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "#38bdf8", border: "none", color: "#000", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
          <Plus size={16} /> Log Time
        </button>
      </div>

      <AdminTable data={logs} columns={columns} searchPlaceholder="Search time logs..." />

      <DynamicAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Log Time"
        fields={fields}
        onSubmit={handleAdd}
        submitText="Save Time Log"
      />
    </motion.div>
  );
};

export default PMTimeTracking;
