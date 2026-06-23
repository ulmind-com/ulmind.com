import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { getProjectsAPI, authFetch } from "../../lib/api";
import { Loader2, Plus, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AdminTable, ColumnDef } from "../../components/AdminTable";
import { DynamicAddModal, ModalField } from "../../components/DynamicAddModal";
import { toast } from "sonner";

const ProjectDirectory: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try { setProjects(await getProjectsAPI()); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const columns = useMemo<ColumnDef<any>[]>(() => [
    { key: "name", header: "Project Name" },
    { key: "client_name", header: "Client" },
    { 
      key: "status", 
      header: "Status",
      render: (p) => {
        const colors: any = { Active: "admin-badge-success", Planning: "admin-badge-info", "On Hold": "admin-badge-warning", Completed: "admin-badge-primary" };
        return <span className={`admin-badge ${colors[p.status] || "admin-badge-info"}`}>{p.status}</span>;
      }
    },
    { 
      key: "cost", 
      header: "Budget",
      render: (p) => `₹${p.cost?.toLocaleString() || 0}`
    },
    { 
      key: "payment_status", 
      header: "Payment",
      render: (p) => {
        const colors: any = { Paid: "admin-badge-success", Partial: "admin-badge-warning", Pending: "admin-badge-danger" };
        return <span className={`admin-badge ${colors[p.payment_status] || "admin-badge-info"}`}>{p.payment_status}</span>;
      }
    },
    { 
      key: "createdAt", 
      header: "Created",
      render: (p) => p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "N/A"
    },
    { 
      key: "actions", 
      header: "Actions",
      render: (p) => (
        <button onClick={() => navigate(`/admin/projects/${p._id}`)} style={{ background: "rgba(56, 189, 248, 0.1)", border: "1px solid rgba(56, 189, 248, 0.2)", color: "#38bdf8", cursor: "pointer", fontWeight: 600, fontSize: 12, padding: "6px 12px", borderRadius: 6 }}>
          View Details
        </button>
      )
    }
  ], [navigate]);

  const fields: ModalField[] = [
    { name: "name", label: "Project Name", type: "text", required: true },
    { name: "client_name", label: "Client Name", type: "text", required: true },
    { name: "status", label: "Status", type: "select", required: true, options: [
      { label: "Planning", value: "Planning" },
      { label: "Active", value: "Active" },
      { label: "On Hold", value: "On Hold" },
      { label: "Completed", value: "Completed" }
    ], defaultValue: "Planning" },
    { name: "cost", label: "Project Budget (₹)", type: "number", required: true, defaultValue: 0 },
    { name: "payment_status", label: "Payment Status", type: "select", required: true, options: [
      { label: "Pending", value: "Pending" },
      { label: "Partial", value: "Partial" },
      { label: "Paid", value: "Paid" }
    ], defaultValue: "Pending" },
  ];

  const handleAdd = async (data: any) => {
    try {
      const res = await authFetch("/projects/", {
        method: "POST",
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to create project");
      toast.success("Project created successfully");
      fetchProjects();
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Project Name", "Client", "Status", "Budget", "Payment Status"];
    const csvContent = [
      headers.join(","),
      ...projects.map(p => [
        `"${p.name}"`,
        `"${p.client_name}"`,
        `"${p.status}"`,
        p.cost || 0,
        `"${p.payment_status}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "projects.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin" size={40} color="#64748b" /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>All Projects</h2>
          <p style={{ color: "#94a3b8", fontSize: 14 }}>Complete project directory with advanced filtering.</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={handleExportCSV} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            <Download size={16} /> Export
          </button>
          <button onClick={() => setShowAddModal(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "#38bdf8", border: "none", color: "#000", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
            <Plus size={16} /> New Project
          </button>
        </div>
      </div>
      
      <AdminTable data={projects} columns={columns} searchPlaceholder="Search projects..." />

      <DynamicAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create New Project"
        fields={fields}
        onSubmit={handleAdd}
        submitText="Create Project"
      />
    </motion.div>
  );
};

export default ProjectDirectory;
