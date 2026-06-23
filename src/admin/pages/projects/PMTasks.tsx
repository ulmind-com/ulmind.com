import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { getPmTasksAPI, authFetch } from "../../lib/api";
import { Loader2, Plus } from "lucide-react";
import { AdminTable, ColumnDef } from "../../components/AdminTable";
import { DynamicAddModal, ModalField } from "../../components/DynamicAddModal";
import { toast } from "sonner";

const PMTasks: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => { fetchTasks(); }, []);
  const fetchTasks = async () => {
    try { setTasks(await getPmTasksAPI()); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const columns = useMemo<ColumnDef<any>[]>(() => [
    { key: "title", header: "Task" },
    { 
      key: "priority", 
      header: "Priority",
      render: (p) => {
        const c: any = { Critical: "#ef4444", High: "#f59e0b", Medium: "#38bdf8", Low: "#94a3b8" };
        return <span style={{ color: c[p.priority] || "#94a3b8", fontWeight: 600 }}>{p.priority}</span>;
      }
    },
    { 
      key: "status", 
      header: "Status",
      render: (p) => <span className="admin-badge admin-badge-info">{p.status}</span> 
    },
    { key: "assignee_id", header: "Assignee" },
    { key: "estimated_hours", header: "Est. Hours" },
    { key: "actual_hours", header: "Actual Hours" },
    { 
      key: "due_date", 
      header: "Due Date",
      render: (p) => p.due_date ? new Date(p.due_date).toLocaleDateString() : "N/A"
    },
  ], []);

  const fields: ModalField[] = [
    { name: "title", label: "Task Title", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea" },
    { name: "priority", label: "Priority", type: "select", required: true, options: [
      { label: "Low", value: "Low" },
      { label: "Medium", value: "Medium" },
      { label: "High", value: "High" },
      { label: "Critical", value: "Critical" }
    ], defaultValue: "Medium" },
    { name: "status", label: "Status", type: "select", required: true, options: [
      { label: "Todo", value: "Todo" },
      { label: "In Progress", value: "In Progress" },
      { label: "In Review", value: "In Review" },
      { label: "Completed", value: "Completed" }
    ], defaultValue: "Todo" },
    { name: "estimated_hours", label: "Estimated Hours", type: "number", required: true, defaultValue: 1 },
    { name: "due_date", label: "Due Date", type: "date", required: true },
    { name: "assignee_id", label: "Assignee Email", type: "text" },
    { name: "project_id", label: "Project ID (Optional)", type: "text" },
  ];

  const handleAdd = async (data: any) => {
    try {
      const res = await authFetch("/pm/tasks", {
        method: "POST",
        body: JSON.stringify({ ...data, actual_hours: 0, order: 0 })
      });
      if (!res.ok) throw new Error("Failed to create task");
      toast.success("Task created successfully");
      fetchTasks();
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin" size={40} color="#64748b" /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <div><h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>Tasks & Assignments</h2><p style={{ color: "#94a3b8", fontSize: 14 }}>Manage all tasks across projects.</p></div>
        <button onClick={() => setShowAddModal(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "#38bdf8", border: "none", color: "#000", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
          <Plus size={16} /> Create Task
        </button>
      </div>
      
      <AdminTable data={tasks} columns={columns} searchPlaceholder="Search tasks..." />

      <DynamicAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create Task"
        fields={fields}
        onSubmit={handleAdd}
        submitText="Save Task"
      />
    </motion.div>
  );
};

export default PMTasks;
