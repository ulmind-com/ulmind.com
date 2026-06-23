import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { getCrmContractsAPI, authFetch } from "../../lib/api";
import { Loader2, Plus } from "lucide-react";
import { AdminTable, ColumnDef } from "../../components/AdminTable";
import { DynamicAddModal, ModalField } from "../../components/DynamicAddModal";
import { toast } from "sonner";

const ContractsPage: React.FC = () => {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const data = await getCrmContractsAPI();
      setContracts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo<ColumnDef<any>[]>(() => [
    { key: "contract_number", header: "Contract #" },
    { key: "title", header: "Title" },
    { 
      key: "value", 
      header: "Value",
      render: (row) => row.value ? `₹${row.value.toLocaleString()}` : "₹0"
    },
    { 
      key: "status", 
      header: "Status",
      render: (row) => {
        let color = "admin-badge-info";
        if (row.status === "active") color = "admin-badge-success";
        if (row.status === "expired") color = "admin-badge-danger";
        if (row.status === "pending") color = "admin-badge-warning";
        return <span className={`admin-badge ${color}`} style={{ textTransform: "capitalize" }}>{row.status}</span>;
      }
    },
    { 
      key: "start_date", 
      header: "Start Date",
      render: (row) => new Date(row.start_date).toLocaleDateString()
    },
    { 
      key: "end_date", 
      header: "End Date",
      render: (row) => row.end_date ? new Date(row.end_date).toLocaleDateString() : "N/A"
    },
  ], []);

  const fields: ModalField[] = [
    { name: "title", label: "Contract Title", type: "text", required: true },
    { name: "contract_number", label: "Contract Number", type: "text", required: true },
    { name: "value", label: "Value (₹)", type: "number", required: true },
    { name: "start_date", label: "Start Date", type: "date", required: true },
    { name: "end_date", label: "End Date", type: "date" },
    { name: "client_id", label: "Client ID", type: "text" },
  ];

  const handleAdd = async (data: any) => {
    try {
      const res = await authFetch("/crm/contracts", {
        method: "POST",
        body: JSON.stringify({ ...data, status: "pending" })
      });
      if (!res.ok) throw new Error("Failed to create contract");
      toast.success("Contract created successfully");
      fetchContracts();
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin text-slate-500" size={40} /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>Contract Management</h2>
          <p style={{ color: "#94a3b8", fontSize: 14 }}>Active and historical client agreements.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "#38bdf8", border: "none", color: "#000", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
          <Plus size={16} /> New Contract
        </button>
      </div>

      <AdminTable data={contracts} columns={columns} searchPlaceholder="Search contracts..." />

      <DynamicAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create Contract"
        fields={fields}
        onSubmit={handleAdd}
        submitText="Save Contract"
      />
    </motion.div>
  );
};

export default ContractsPage;
