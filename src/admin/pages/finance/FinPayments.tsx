import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { getPaymentsAPI, authFetch } from "../../lib/api";
import { Loader2, Plus, Download } from "lucide-react";
import { AdminTable, ColumnDef } from "../../components/AdminTable";
import { DynamicAddModal, ModalField } from "../../components/DynamicAddModal";
import { toast } from "sonner";

const FinPayments: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => { fetchPayments(); }, []);
  const fetchPayments = async () => {
    try { setPayments(await getPaymentsAPI()); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const totalCollected = useMemo(() => payments.reduce((a, p) => a + (p.amount || 0), 0), [payments]);

  const columns = useMemo<ColumnDef<any>[]>(() => [
    { key: "client_id", header: "Client" },
    { key: "invoice_id", header: "Invoice" },
    { 
      key: "amount", 
      header: "Amount",
      render: (p) => <span style={{ color: "#10b981", fontWeight: 700 }}>₹{(p.amount || 0).toLocaleString()}</span>
    },
    { 
      key: "payment_method", 
      header: "Method",
      render: (p) => <span className="admin-badge admin-badge-info" style={{ textTransform: "capitalize" }}>{p.payment_method?.replace("_", " ")}</span>
    },
    { key: "reference_number", header: "Reference #" },
    { 
      key: "payment_date", 
      header: "Date",
      render: (p) => p.payment_date ? new Date(p.payment_date).toLocaleDateString() : "N/A"
    },
  ], []);

  const fields: ModalField[] = [
    { name: "client_id", label: "Client ID", type: "text", required: true },
    { name: "invoice_id", label: "Invoice ID", type: "text", required: true },
    { name: "amount", label: "Payment Amount (₹)", type: "number", required: true },
    { name: "payment_method", label: "Payment Method", type: "select", required: true, options: [
      { label: "Bank Transfer", value: "bank_transfer" },
      { label: "Credit Card", value: "credit_card" },
      { label: "PayPal", value: "paypal" },
      { label: "Cash", value: "cash" }
    ], defaultValue: "bank_transfer" },
    { name: "reference_number", label: "Transaction / Reference #", type: "text" },
    { name: "payment_date", label: "Payment Date", type: "date", required: true }
  ];

  const handleAdd = async (data: any) => {
    try {
      const res = await authFetch("/finance/payments", {
        method: "POST",
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to record payment");
      toast.success("Payment recorded successfully");
      fetchPayments();
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Client", "Invoice", "Amount", "Method", "Reference", "Date"];
    const csvContent = [
      headers.join(","),
      ...payments.map(p => [
        `"${p.client_id}"`,
        `"${p.invoice_id}"`,
        p.amount || 0,
        `"${p.payment_method}"`,
        `"${p.reference_number}"`,
        `"${p.payment_date}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "payments.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin" size={40} color="#64748b" /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <div><h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>Payments</h2><p style={{ color: "#94a3b8", fontSize: 14 }}>Total Collected: <span style={{ color: "#10b981", fontWeight: 700 }}>₹{totalCollected.toLocaleString()}</span></p></div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={handleExportCSV} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            <Download size={16} /> Export
          </button>
          <button onClick={() => setShowAddModal(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "#38bdf8", border: "none", color: "#000", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
            <Plus size={16} /> Record Payment
          </button>
        </div>
      </div>
      
      <AdminTable data={payments} columns={columns} searchPlaceholder="Search payments..." />

      <DynamicAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Record Payment"
        fields={fields}
        onSubmit={handleAdd}
        submitText="Save Payment"
      />
    </motion.div>
  );
};

export default FinPayments;
