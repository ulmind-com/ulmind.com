import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { getTeamPerformanceAPI, authFetch } from "../../lib/api";
import { Loader2, Plus, Star } from "lucide-react";
import { AdminTable, ColumnDef } from "../../components/AdminTable";
import { DynamicAddModal, ModalField } from "../../components/DynamicAddModal";
import { toast } from "sonner";

const TeamPerformance: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => { fetchReviews(); }, []);
  const fetchReviews = async () => {
    try { setReviews(await getTeamPerformanceAPI()); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const avgScore = useMemo(() => reviews.length ? (reviews.reduce((a, r) => a + (r.overall_score || 0), 0) / reviews.length).toFixed(1) : 0, [reviews]);

  const columns = useMemo<ColumnDef<any>[]>(() => [
    { key: "employee_id", header: "Employee" },
    { key: "period", header: "Period" },
    { 
      key: "overall_score", 
      header: "Overall Score",
      render: (p) => {
        const score = p.overall_score || 0;
        const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";
        return <span style={{ color, fontWeight: 700 }}>{score.toFixed(1)}/100</span>;
      }
    },
    { key: "attendance_score", header: "Attendance" },
    { key: "productivity_score", header: "Productivity" },
    { key: "quality_score", header: "Quality" },
    { 
      key: "status", 
      header: "Status",
      render: (p) => {
        const c: any = { Approved: "admin-badge-success", Submitted: "admin-badge-info", Draft: "admin-badge-warning" };
        return <span className={`admin-badge ${c[p.status] || "admin-badge-info"}`}>{p.status}</span>;
      }
    },
    { 
      key: "created_at", 
      header: "Date",
      render: (p) => p.created_at ? new Date(p.created_at).toLocaleDateString() : "N/A"
    },
  ], []);

  const fields: ModalField[] = [
    { name: "employee_id", label: "Employee ID", type: "text", required: true },
    { name: "period", label: "Review Period (e.g., Q1 2024)", type: "text", required: true },
    { name: "attendance_score", label: "Attendance Score (0-100)", type: "number", required: true },
    { name: "productivity_score", label: "Productivity Score (0-100)", type: "number", required: true },
    { name: "quality_score", label: "Quality Score (0-100)", type: "number", required: true },
    { name: "comments", label: "Comments", type: "textarea", required: true },
  ];

  const handleAdd = async (data: any) => {
    try {
      const overall_score = (Number(data.attendance_score) + Number(data.productivity_score) + Number(data.quality_score)) / 3;
      
      const res = await authFetch("/team/performance", {
        method: "POST",
        body: JSON.stringify({ ...data, overall_score, status: "Submitted" })
      });
      if (!res.ok) throw new Error("Failed to add performance review");
      toast.success("Review added successfully");
      fetchReviews();
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin" size={40} color="#64748b" /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>Performance Tracking</h2>
          <p style={{ color: "#94a3b8", fontSize: 14 }}>Avg Team Score: <span style={{ color: Number(avgScore) >= 70 ? "#10b981" : "#f59e0b", fontWeight: 700 }}>{avgScore}/100</span></p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "#38bdf8", border: "none", color: "#000", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
          <Plus size={16} /> Add Review
        </button>
      </div>

      <AdminTable data={reviews} columns={columns} searchPlaceholder="Search reviews..." />

      <DynamicAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Performance Review"
        fields={fields}
        onSubmit={handleAdd}
        submitText="Save Review"
      />
    </motion.div>
  );
};

export default TeamPerformance;
