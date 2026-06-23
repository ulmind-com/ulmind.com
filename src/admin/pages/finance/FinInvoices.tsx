import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { getInvoicesAPI, authFetch } from "../../lib/api";
import { Loader2, Plus, Download } from "lucide-react";
import { AdminTable, ColumnDef } from "../../components/AdminTable";
import { DynamicAddModal, ModalField } from "../../components/DynamicAddModal";
import { toast } from "sonner";

const FinInvoices: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => { fetchInvoices(); }, []);
  const fetchInvoices = async () => {
    try { setInvoices(await getInvoicesAPI()); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const columns = useMemo<ColumnDef<any>[]>(() => [
    { key: "invoice_number", header: "Invoice #" },
    { key: "client_id", header: "Client" },
    { 
      key: "subtotal", 
      header: "Subtotal",
      render: (p) => `₹${(p.subtotal || 0).toLocaleString()}`
    },
    { 
      key: "tax", 
      header: "Tax",
      render: (p) => `₹${(p.tax || 0).toLocaleString()}`
    },
    { 
      key: "total", 
      header: "Total",
      render: (p) => <span style={{ color: "#10b981", fontWeight: 700 }}>₹{(p.total || 0).toLocaleString()}</span>
    },
    { 
      key: "status", 
      header: "Status",
      render: (p) => {
        const c: any = { paid: "admin-badge-success", pending: "admin-badge-warning", overdue: "admin-badge-danger", cancelled: "admin-badge-info", draft: "admin-badge-info" };
        return <span className={`admin-badge ${c[p.status] || "admin-badge-info"}`} style={{ textTransform: "capitalize" }}>{p.status}</span>;
      }
    },
    { 
      key: "due_date", 
      header: "Due Date",
      render: (p) => p.due_date ? new Date(p.due_date).toLocaleDateString() : "N/A"
    },
    { 
      key: "created_at", 
      header: "Created",
      render: (p) => p.created_at ? new Date(p.created_at).toLocaleDateString() : "N/A"
    },
  ], []);

  const fields: ModalField[] = [
    { name: "invoice_number", label: "Invoice Number", type: "text", required: true },
    { name: "client_id", label: "Client ID", type: "text", required: true },
    { name: "subtotal", label: "Subtotal (₹)", type: "number", required: true, defaultValue: 0 },
    { name: "tax", label: "Tax (₹)", type: "number", required: true, defaultValue: 0 },
    { name: "total", label: "Total Amount (₹)", type: "number", required: true, defaultValue: 0 },
    { name: "due_date", label: "Due Date", type: "date", required: true },
    { name: "status", label: "Status", type: "select", required: true, options: [
      { label: "Draft", value: "draft" },
      { label: "Pending", value: "pending" },
      { label: "Paid", value: "paid" },
      { label: "Overdue", value: "overdue" },
      { label: "Cancelled", value: "cancelled" }
    ], defaultValue: "pending" },
  ];

  const handleAdd = async (data: any) => {
    try {
      const res = await authFetch("/finance/invoices", {
        method: "POST",
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to create invoice");
      toast.success("Invoice created successfully");
      fetchInvoices();
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin" size={40} color="#64748b" /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <div><h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>Invoices</h2><p style={{ color: "#94a3b8", fontSize: 14 }}>Complete invoice management system.</p></div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="admin-btn admin-btn-ghost"><Download size={16} /> Export</button>
          <button onClick={() => setShowAddModal(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "#38bdf8", border: "none", color: "#000", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
            <Plus size={16} /> Create Invoice
          </button>
        </div>
      </div>
      
      <AdminTable data={invoices} columns={columns} searchPlaceholder="Search invoices..." />

      <DynamicAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create Invoice"
        fields={fields}
        onSubmit={handleAdd}
        submitText="Save Invoice"
      />
    </motion.div>
  );
};

export default FinInvoices;
