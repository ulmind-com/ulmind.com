import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { getTeamWorkLogsAPI, authFetch } from "../../lib/api";
import { Loader2, Plus, Clock } from "lucide-react";
import { AdminTable, ColumnDef } from "../../components/AdminTable";
import { DynamicAddModal, ModalField } from "../../components/DynamicAddModal";
import { toast } from "sonner";

const TeamWorkLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => { fetchLogs(); }, []);
  const fetchLogs = async () => {
    try { setLogs(await getTeamWorkLogsAPI()); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const columns = useMemo<ColumnDef<any>[]>(() => [
    { key: "employee_id", header: "Employee" },
    { key: "project_id", header: "Project" },
    { 
      key: "hours", 
      header: "Hours Logged",
      render: (p) => <span style={{ color: "#38bdf8", fontWeight: 700 }}>{p.hours}h</span>
    },
    { key: "description", header: "Description" },
    { 
      key: "date", 
      header: "Date",
      render: (p) => p.date ? new Date(p.date).toLocaleDateString() : "N/A"
    },
  ], []);

  const fields: ModalField[] = [
    { name: "employee_id", label: "Employee ID", type: "text", required: true },
    { name: "project_id", label: "Project ID", type: "text", required: true },
    { name: "hours", label: "Hours", type: "number", required: true, defaultValue: 8 },
    { name: "description", label: "Description", type: "textarea", required: true },
    { name: "date", label: "Date", type: "date", required: true },
  ];

  const handleAdd = async (data: any) => {
    try {
      const res = await authFetch("/team/work-logs", {
        method: "POST",
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to create work log");
      toast.success("Work log created successfully");
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
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 10 }}><Clock size={24} color="#38bdf8" /> Work Logs</h2>
          <p style={{ color: "#94a3b8", fontSize: 14 }}>Track daily activities and project hours.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "#38bdf8", border: "none", color: "#000", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
          <Plus size={16} /> Add Work Log
        </button>
      </div>
      
      <AdminTable data={logs} columns={columns} searchPlaceholder="Search work logs..." />

      <DynamicAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Work Log"
        fields={fields}
        onSubmit={handleAdd}
        submitText="Save Log"
      />
    </motion.div>
  );
};

export default TeamWorkLogs;
