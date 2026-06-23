import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { getTeamPayrollAPI, authFetch } from "../../lib/api";
import { Loader2, Plus, Download } from "lucide-react";
import { AdminTable, ColumnDef } from "../../components/AdminTable";
import { DynamicAddModal, ModalField } from "../../components/DynamicAddModal";
import { toast } from "sonner";

const PayrollOverview: React.FC = () => {
  const [payroll, setPayroll] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => { fetchPayroll(); }, []);
  const fetchPayroll = async () => {
    try { setPayroll(await getTeamPayrollAPI()); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const totalNetPay = useMemo(() => payroll.reduce((a, p) => a + (p.net_pay || 0), 0), [payroll]);
  const totalBonus = useMemo(() => payroll.reduce((a, p) => a + (p.bonus || 0), 0), [payroll]);
  const totalDeductions = useMemo(() => payroll.reduce((a, p) => a + (p.deductions || 0), 0), [payroll]);

  const columns = useMemo<ColumnDef<any>[]>(() => [
    { key: "employee_id", header: "Employee" },
    { key: "month", header: "Month" },
    { 
      key: "basic_salary", 
      header: "Basic",
      render: (p) => `₹${(p.basic_salary || 0).toLocaleString()}`
    },
    { 
      key: "bonus", 
      header: "Bonus",
      render: (p) => <span style={{ color: "#10b981" }}>₹${(p.bonus || 0).toLocaleString()}</span>
    },
    { 
      key: "deductions", 
      header: "Deductions",
      render: (p) => <span style={{ color: "#ef4444" }}>-₹${(p.deductions || 0).toLocaleString()}</span>
    },
    { 
      key: "net_pay", 
      header: "Net Pay",
      render: (p) => <span style={{ color: "#38bdf8", fontWeight: 700 }}>₹${(p.net_pay || 0).toLocaleString()}</span>
    },
    { 
      key: "status", 
      header: "Status",
      render: (p) => {
        const c: any = { Paid: "admin-badge-success", Processed: "admin-badge-info", Draft: "admin-badge-warning" };
        return <span className={`admin-badge ${c[p.status] || "admin-badge-info"}`}>{p.status}</span>;
      }
    },
  ], []);

  const fields: ModalField[] = [
    { name: "employee_id", label: "Employee ID", type: "text", required: true },
    { name: "month", label: "Month (e.g., Oct 2024)", type: "text", required: true },
    { name: "basic_salary", label: "Basic Salary (₹)", type: "number", required: true },
    { name: "bonus", label: "Bonus (₹)", type: "number", required: true, defaultValue: 0 },
    { name: "deductions", label: "Deductions (₹)", type: "number", required: true, defaultValue: 0 },
    { name: "status", label: "Status", type: "select", required: true, options: [
      { label: "Draft", value: "Draft" },
      { label: "Processed", value: "Processed" },
      { label: "Paid", value: "Paid" }
    ], defaultValue: "Draft" },
  ];

  const handleAdd = async (data: any) => {
    try {
      const net_pay = Number(data.basic_salary) + Number(data.bonus) - Number(data.deductions);

      const res = await authFetch("/team/payroll", {
        method: "POST",
        body: JSON.stringify({ ...data, net_pay })
      });
      if (!res.ok) throw new Error("Failed to add payroll record");
      toast.success("Payroll record added successfully");
      fetchPayroll();
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Employee ID", "Month", "Basic", "Bonus", "Deductions", "Net Pay", "Status"];
    const csvContent = [
      headers.join(","),
      ...payroll.map(p => [
        `"${p.employee_id}"`,
        `"${p.month}"`,
        p.basic_salary || 0,
        p.bonus || 0,
        p.deductions || 0,
        p.net_pay || 0,
        `"${p.status}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "payroll.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin" size={40} color="#64748b" /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <div><h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>Payroll Overview</h2><p style={{ color: "#94a3b8", fontSize: 14 }}>Employee salary and compensation management.</p></div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={handleExportCSV} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            <Download size={16} /> Export
          </button>
          <button onClick={() => setShowAddModal(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "#38bdf8", border: "none", color: "#000", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
            <Plus size={16} /> Add Payroll
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
        <div className="admin-glass-panel" style={{ padding: 20 }}><p style={{ color: "#94a3b8", fontSize: 13 }}>Total Net Pay</p><p style={{ color: "#38bdf8", fontSize: 22, fontWeight: 700 }}>₹{totalNetPay.toLocaleString()}</p></div>
        <div className="admin-glass-panel" style={{ padding: 20 }}><p style={{ color: "#94a3b8", fontSize: 13 }}>Total Bonuses</p><p style={{ color: "#10b981", fontSize: 22, fontWeight: 700 }}>₹{totalBonus.toLocaleString()}</p></div>
        <div className="admin-glass-panel" style={{ padding: 20 }}><p style={{ color: "#94a3b8", fontSize: 13 }}>Total Deductions</p><p style={{ color: "#ef4444", fontSize: 22, fontWeight: 700 }}>₹{totalDeductions.toLocaleString()}</p></div>
      </div>

      <AdminTable data={payroll} columns={columns} searchPlaceholder="Search payroll..." />

      <DynamicAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Payroll Record"
        fields={fields}
        onSubmit={handleAdd}
        submitText="Save Payroll"
      />
    </motion.div>
  );
};

export default PayrollOverview;
