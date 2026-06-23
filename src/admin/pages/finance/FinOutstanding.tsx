import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { getOutstandingInvoicesAPI } from "../../lib/api";
import { Loader2 } from "lucide-react";
import { AdminTable, ColumnDef } from "../../components/AdminTable";

const FinOutstanding: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOutstanding(); }, []);
  const fetchOutstanding = async () => {
    try { setInvoices(await getOutstandingInvoicesAPI()); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const totalOutstanding = useMemo(() => invoices.reduce((a, i) => a + (i.total || 0), 0), [invoices]);

  const columns = useMemo<ColumnDef<any>[]>(() => [
    { key: "invoice_number", header: "Invoice #", render: (p) => <span style={{ fontWeight: 600, color: "#fff" }}>{p.invoice_number}</span> },
    { key: "client_id", header: "Client" },
    { 
      key: "total", 
      header: "Amount Due",
      render: (p) => <span style={{ color: "#f59e0b", fontWeight: 700 }}>₹{(p.total || 0).toLocaleString()}</span>
    },
    { 
      key: "status", 
      header: "Status",
      render: (p) => <span className={`admin-badge ${p.status === "overdue" ? "admin-badge-danger" : "admin-badge-warning"}`} style={{ textTransform: "capitalize" }}>{p.status}</span>
    },
    { 
      key: "due_date", 
      header: "Due Date",
      render: (p) => p.due_date ? new Date(p.due_date).toLocaleDateString() : "N/A"
    },
    { 
      key: "actions", 
      header: "Actions",
      render: () => <button style={{ background: "none", border: "none", color: "#38bdf8", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Send Reminder</button>
    },
  ], []);

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin" size={40} color="#64748b" /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>Outstanding Payments</h2>
          <p style={{ color: "#94a3b8", fontSize: 14 }}>Total Outstanding: <span style={{ color: "#f59e0b", fontWeight: 700 }}>₹{totalOutstanding.toLocaleString()}</span> ({invoices.length} invoices)</p>
        </div>
      </div>
      
      <AdminTable data={invoices} columns={columns} searchPlaceholder="Search outstanding invoices..." />
    </motion.div>
  );
};

export default FinOutstanding;
