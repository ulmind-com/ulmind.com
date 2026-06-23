import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { getPmTasksAPI, getPmMilestonesAPI } from "../../lib/api";
import { Loader2, ChevronLeft, ChevronRight, Flag } from "lucide-react";

const PMTimeline: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMonths, setViewMonths] = useState(3);
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    Promise.all([getPmTasksAPI(), getPmMilestonesAPI()])
      .then(([t, m]) => { setTasks(t); setMilestones(m); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const months = useMemo(() => {
    const arr: Date[] = [];
    for (let i = 0; i < viewMonths; i++) {
      const d = new Date(startDate);
      d.setMonth(d.getMonth() + i);
      arr.push(d);
    }
    return arr;
  }, [startDate, viewMonths]);

  const navigate = (dir: number) => {
    const nd = new Date(startDate);
    nd.setMonth(nd.getMonth() + dir);
    setStartDate(nd);
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin" size={40} color="#64748b" /></div>;

  const allItems = [
    ...tasks.filter(t => t.due_date).map(t => ({ ...t, type: "task" })),
    ...milestones.filter(m => m.due_date).map(m => ({ ...m, type: "milestone" })),
  ].sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <div><h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>Timeline View</h2><p style={{ color: "#94a3b8", fontSize: 14 }}>Visual overview of task and milestone schedules.</p></div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => navigate(-1)} className="admin-btn admin-btn-ghost"><ChevronLeft size={16} /></button>
          <span style={{ color: "#fff", fontSize: 14, fontWeight: 500 }}>{months[0]?.toLocaleDateString("en-US", { month: "long", year: "numeric" })} — {months[months.length - 1]?.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
          <button onClick={() => navigate(1)} className="admin-btn admin-btn-ghost"><ChevronRight size={16} /></button>
        </div>
      </div>

      <div className="admin-glass-panel" style={{ padding: 24 }}>
        {/* Month Headers */}
        <div style={{ display: "grid", gridTemplateColumns: `200px repeat(${viewMonths}, 1fr)`, gap: 0, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 12, marginBottom: 16 }}>
          <div style={{ color: "#64748b", fontSize: 13, fontWeight: 600 }}>Item</div>
          {months.map((m, i) => <div key={i} style={{ color: "#94a3b8", fontSize: 13, fontWeight: 600, textAlign: "center" }}>{m.toLocaleDateString("en-US", { month: "short", year: "numeric" })}</div>)}
        </div>

        {/* Items */}
        {allItems.length === 0 && <p style={{ color: "#64748b", textAlign: "center", padding: 40 }}>No scheduled items found. Create tasks or milestones with due dates.</p>}
        {allItems.map((item, i) => {
          const dueDate = new Date(item.due_date);
          const monthIdx = months.findIndex(m => m.getMonth() === dueDate.getMonth() && m.getFullYear() === dueDate.getFullYear());
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: `200px repeat(${viewMonths}, 1fr)`, gap: 0, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ color: "#cbd5e1", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
                {item.type === "milestone" && <Flag size={12} color="#f59e0b" />}
                {item.title}
              </div>
              {months.map((_, mi) => (
                <div key={mi} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  {mi === monthIdx && (
                    <div style={{
                      height: 6, width: "80%", borderRadius: 3,
                      background: item.type === "milestone" ? "linear-gradient(90deg, #f59e0b, #ef4444)" : "linear-gradient(90deg, #38bdf8, #a78bfa)",
                    }} />
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default PMTimeline;
