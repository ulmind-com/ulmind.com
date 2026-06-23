import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { getCrmMeetingsAPI, authFetch } from "../../lib/api";
import { Loader2, Plus } from "lucide-react";
import { AdminTable, ColumnDef } from "../../components/AdminTable";
import { DynamicAddModal, ModalField } from "../../components/DynamicAddModal";
import { toast } from "sonner";

const MeetingsPage: React.FC = () => {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const data = await getCrmMeetingsAPI();
      setMeetings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo<ColumnDef<any>[]>(() => [
    { key: "title", header: "Meeting Title" },
    { key: "integration", header: "Platform" },
    { 
      key: "status", 
      header: "Status",
      render: (row) => {
        let color = "admin-badge-info";
        if (row.status === "completed") color = "admin-badge-success";
        if (row.status === "cancelled") color = "admin-badge-danger";
        return <span className={`admin-badge ${color}`} style={{ textTransform: "capitalize" }}>{row.status}</span>;
      }
    },
    { 
      key: "date", 
      header: "Scheduled For",
      render: (row) => new Date(row.date).toLocaleString()
    },
  ], []);

  const fields: ModalField[] = [
    { name: "title", label: "Meeting Title", type: "text", required: true },
    { name: "date", label: "Date & Time", type: "date", required: true },
    { name: "integration", label: "Platform", type: "select", required: true, options: [
      { label: "Google Meet", value: "Google Meet" },
      { label: "Zoom", value: "Zoom" },
      { label: "Microsoft Teams", value: "Teams" },
      { label: "Phone Call", value: "Phone Call" }
    ]},
    { name: "client_id", label: "Client ID (Optional)", type: "text" },
  ];

  const handleAdd = async (data: any) => {
    try {
      const res = await authFetch("/crm/meetings", {
        method: "POST",
        body: JSON.stringify({ ...data, status: "scheduled" })
      });
      if (!res.ok) throw new Error("Failed to schedule meeting");
      toast.success("Meeting scheduled successfully");
      fetchMeetings();
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin text-slate-500" size={40} /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>Meeting Notes</h2>
          <p style={{ color: "#94a3b8", fontSize: 14 }}>Schedule and track all enterprise meetings.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "#38bdf8", border: "none", color: "#000", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
          <Plus size={16} /> Schedule Meeting
        </button>
      </div>

      <AdminTable data={meetings} columns={columns} searchPlaceholder="Search meetings..." />

      <DynamicAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Schedule Meeting"
        fields={fields}
        onSubmit={handleAdd}
        submitText="Schedule"
      />
    </motion.div>
  );
};

export default MeetingsPage;
