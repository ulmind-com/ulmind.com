import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { getExpensesAPI, authFetch } from "../../lib/api";
import { Loader2, Plus, Download } from "lucide-react";
import { AdminTable, ColumnDef } from "../../components/AdminTable";
import { DynamicAddModal, ModalField } from "../../components/DynamicAddModal";
import { toast } from "sonner";

const FinExpenses: React.FC = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => { fetchExpenses(); }, []);
  const fetchExpenses = async () => {
    try { setExpenses(await getExpensesAPI()); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const totalSpent = useMemo(() => expenses.reduce((a, e) => a + (e.amount || 0), 0), [expenses]);

  const columns = useMemo<ColumnDef<any>[]>(() => [
    { key: "description", header: "Description" },
    { 
      key: "category", 
      header: "Category",
      render: (p) => <span className="admin-badge admin-badge-info" style={{ textTransform: "capitalize" }}>{p.category}</span>
    },
    { 
      key: "amount", 
      header: "Amount",
      render: (p) => <span style={{ color: "#ef4444", fontWeight: 700 }}>₹{(p.amount || 0).toLocaleString()}</span>
    },
    { 
      key: "date", 
      header: "Date",
      render: (p) => p.date ? new Date(p.date).toLocaleDateString() : "N/A"
    },
    { 
      key: "receipt_url", 
      header: "Receipt",
      render: (p) => p.receipt_url ? <a href={p.receipt_url} target="_blank" rel="noreferrer" style={{ color: "#38bdf8", fontSize: 13 }}>View Receipt</a> : <span style={{ color: "#64748b" }}>—</span>
    },
  ], []);

  const fields: ModalField[] = [
    { name: "description", label: "Description", type: "text", required: true },
    { name: "category", label: "Category", type: "select", required: true, options: [
      { label: "Software", value: "software" },
      { label: "Hardware", value: "hardware" },
      { label: "Office", value: "office" },
      { label: "Travel", value: "travel" },
      { label: "Marketing", value: "marketing" },
      { label: "Other", value: "other" }
    ], defaultValue: "office" },
    { name: "amount", label: "Amount (₹)", type: "number", required: true },
    { name: "date", label: "Expense Date", type: "date", required: true },
    { name: "receipt_url", label: "Receipt URL (Optional)", type: "text" },
  ];

  const handleAdd = async (data: any) => {
    try {
      const res = await authFetch("/finance/expenses", {
        method: "POST",
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to add expense");
      toast.success("Expense added successfully");
      fetchExpenses();
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Description", "Category", "Amount", "Date"];
    const csvContent = [
      headers.join(","),
      ...expenses.map(e => [
        `"${e.description}"`,
        `"${e.category}"`,
        e.amount || 0,
        `"${e.date}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "expenses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin" size={40} color="#64748b" /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <div><h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>Expenses</h2><p style={{ color: "#94a3b8", fontSize: 14 }}>Total Spent: <span style={{ color: "#ef4444", fontWeight: 700 }}>₹{totalSpent.toLocaleString()}</span></p></div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={handleExportCSV} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            <Download size={16} /> Export
          </button>
          <button onClick={() => setShowAddModal(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "#38bdf8", border: "none", color: "#000", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
            <Plus size={16} /> Add Expense
          </button>
        </div>
      </div>
      
      <AdminTable data={expenses} columns={columns} searchPlaceholder="Search expenses..." />

      <DynamicAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Expense"
        fields={fields}
        onSubmit={handleAdd}
        submitText="Save Expense"
      />
    </motion.div>
  );
};

export default FinExpenses;
