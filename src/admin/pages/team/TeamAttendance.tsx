import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { getTeamAttendanceAPI, authFetch } from "../../lib/api";
import { Loader2, Plus, Download } from "lucide-react";
import { AdminTable, ColumnDef } from "../../components/AdminTable";
import { DynamicAddModal, ModalField } from "../../components/DynamicAddModal";
import { toast } from "sonner";

const TeamAttendance: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => { fetchAttendance(); }, []);
  const fetchAttendance = async () => {
    try { setRecords(await getTeamAttendanceAPI()); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const stats = useMemo(() => {
    const present = records.filter(r => r.status === "Present").length;
    const absent = records.filter(r => r.status === "Absent").length;
    const leave = records.filter(r => r.status === "Leave").length;
    const rate = records.length ? ((present / records.length) * 100).toFixed(1) : 0;
    return { present, absent, leave, rate };
  }, [records]);

  const columns = useMemo<ColumnDef<any>[]>(() => [
    { key: "employee_id", header: "Employee ID" },
    { 
      key: "date", 
      header: "Date",
      render: (p) => p.date ? new Date(p.date).toLocaleDateString() : "N/A"
    },
    { 
      key: "status", 
      header: "Status",
      render: (p) => {
        const c: any = { Present: "admin-badge-success", Absent: "admin-badge-danger", "Half Day": "admin-badge-warning", Leave: "admin-badge-info", Remote: "admin-badge-primary" };
        return <span className={`admin-badge ${c[p.status] || "admin-badge-info"}`}>{p.status}</span>;
      }
    },
    { key: "check_in", header: "Check In" },
    { key: "check_out", header: "Check Out" },
    { key: "notes", header: "Notes" },
  ], []);

  const fields: ModalField[] = [
    { name: "employee_id", label: "Employee ID", type: "text", required: true },
    { name: "date", label: "Date", type: "date", required: true },
    { name: "status", label: "Status", type: "select", required: true, options: [
      { label: "Present", value: "Present" },
      { label: "Absent", value: "Absent" },
      { label: "Half Day", value: "Half Day" },
      { label: "Leave", value: "Leave" },
      { label: "Remote", value: "Remote" }
    ], defaultValue: "Present" },
    { name: "check_in", label: "Check In Time", type: "text" },
    { name: "check_out", label: "Check Out Time", type: "text" },
    { name: "notes", label: "Notes", type: "text" },
  ];

  const handleAdd = async (data: any) => {
    try {
      const res = await authFetch("/team/attendance", {
        method: "POST",
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to mark attendance");
      toast.success("Attendance marked successfully");
      fetchAttendance();
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Employee ID", "Date", "Status", "Check In", "Check Out", "Notes"];
    const csvContent = [
      headers.join(","),
      ...records.map(r => [
        `"${r.employee_id}"`,
        `"${r.date}"`,
        `"${r.status}"`,
        `"${r.check_in || ""}"`,
        `"${r.check_out || ""}"`,
        `"${r.notes || ""}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "attendance.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin" size={40} color="#64748b" /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <div><h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>Attendance Management</h2><p style={{ color: "#94a3b8", fontSize: 14 }}>Daily attendance tracking and analytics.</p></div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={handleExportCSV} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            <Download size={16} /> Export
          </button>
          <button onClick={() => setShowAddModal(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "#38bdf8", border: "none", color: "#000", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
            <Plus size={16} /> Mark Attendance
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
        {[
          { label: "Present", value: stats.present, color: "#10b981" },
          { label: "Absent", value: stats.absent, color: "#ef4444" },
          { label: "On Leave", value: stats.leave, color: "#f59e0b" },
          { label: "Attendance Rate", value: `${stats.rate}%`, color: "#38bdf8" },
        ].map(s => (
          <div key={s.label} className="admin-glass-panel" style={{ padding: 16 }}>
            <p style={{ color: "#94a3b8", fontSize: 13 }}>{s.label}</p>
            <p style={{ color: s.color, fontSize: 22, fontWeight: 700 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <AdminTable data={records} columns={columns} searchPlaceholder="Search attendance..." />

      <DynamicAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Mark Attendance"
        fields={fields}
        onSubmit={handleAdd}
        submitText="Save Record"
      />
    </motion.div>
  );
};

export default TeamAttendance;
