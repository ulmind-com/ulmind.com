import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { getPmExpensesAPI, authFetch } from "../../lib/api";
import { Loader2, Plus } from "lucide-react";
import { AdminTable, ColumnDef } from "../../components/AdminTable";
import { DynamicAddModal, ModalField } from "../../components/DynamicAddModal";
import { toast } from "sonner";

const PMBudget: React.FC = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => { fetchExpenses(); }, []);
  const fetchExpenses = async () => {
    try { setExpenses(await getPmExpensesAPI()); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const totalSpent = useMemo(() => expenses.reduce((acc, e) => acc + (e.amount || 0), 0), [expenses]);

  const categorySummary = useMemo(() => {
    const cats: any = {};
    expenses.forEach(e => { cats[e.category] = (cats[e.category] || 0) + (e.amount || 0); });
    return Object.entries(cats).sort((a: any, b: any) => b[1] - a[1]);
  }, [expenses]);

  const columns = useMemo<ColumnDef<any>[]>(() => [
    { key: "description", header: "Description" },
    { 
      key: "category", 
      header: "Category",
      render: (p) => <span className="admin-badge admin-badge-info">{p.category}</span>
    },
    { 
      key: "amount", 
      header: "Amount",
      render: (p) => <span style={{ color: "#f59e0b", fontWeight: 600 }}>₹{p.amount?.toLocaleString()}</span>
    },
    { 
      key: "date", 
      header: "Date",
      render: (p) => p.date ? new Date(p.date).toLocaleDateString() : "N/A"
    },
  ], []);

  const fields: ModalField[] = [
    { name: "description", label: "Description", type: "text", required: true },
    { name: "category", label: "Category", type: "text", required: true, defaultValue: "Software" },
    { name: "amount", label: "Amount (₹)", type: "number", required: true },
    { name: "date", label: "Date", type: "date", required: true },
    { name: "project_id", label: "Project ID", type: "text" },
  ];

  const handleAdd = async (data: any) => {
    try {
      const res = await authFetch("/pm/expenses", {
        method: "POST",
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to log expense");
      toast.success("Expense logged successfully");
      fetchExpenses();
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin" size={40} color="#64748b" /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>Budget Tracking</h2>
          <p style={{ color: "#94a3b8", fontSize: 14 }}>Total Expenses: <span style={{ color: "#f59e0b", fontWeight: 700 }}>₹{totalSpent.toLocaleString()}</span></p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "#38bdf8", border: "none", color: "#000", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
          <Plus size={16} /> Add Expense
        </button>
      </div>

      {/* Category Breakdown */}
      {categorySummary.length > 0 && (
        <div className="admin-glass-panel" style={{ padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 16 }}>Cost Breakdown</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {categorySummary.map(([cat, val]: any) => (
              <div key={cat} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 120, fontSize: 13, color: "#cbd5e1" }}>{cat}</div>
                <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${totalSpent ? (val / totalSpent) * 100 : 0}%`, height: "100%", background: "#f59e0b", borderRadius: 4 }} />
                </div>
                <div style={{ width: 100, fontSize: 13, fontWeight: 600, color: "#fff", textAlign: "right" }}>₹{val.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <AdminTable data={expenses} columns={columns} searchPlaceholder="Search expenses..." />

      <DynamicAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Log Expense"
        fields={fields}
        onSubmit={handleAdd}
        submitText="Save Expense"
      />
    </motion.div>
  );
};

export default PMBudget;
