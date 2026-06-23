import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getPmTasksAPI, updatePmTaskAPI } from "../../lib/api";
import { Loader2, Plus, Filter } from "lucide-react";
import { DndContext, closestCorners, PointerSensor, KeyboardSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const KANBAN_COLUMNS = ["Backlog", "Pending", "In Progress", "Review", "Testing", "Completed"];
const PRIORITY_COLORS: any = { Critical: "#ef4444", High: "#f59e0b", Medium: "#38bdf8", Low: "#64748b" };

const SortableTaskCard = ({ task, onClick }: { task: any; onClick: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, cursor: "grab" };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="kanban-card" onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <h4 style={{ fontSize: 14, fontWeight: 600, color: "#fff", margin: 0 }}>{task.title}</h4>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: PRIORITY_COLORS[task.priority] || "#64748b", flexShrink: 0, marginTop: 4 }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
        <span style={{ color: "#94a3b8" }}>{task.estimated_hours ? `${task.estimated_hours}h est.` : ""}</span>
        <span style={{ color: "#64748b" }}>{task.due_date ? new Date(task.due_date).toLocaleDateString() : ""}</span>
      </div>
    </div>
  );
};

const PMKanban: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(KeyboardSensor));

  useEffect(() => { fetchTasks(); }, []);
  const fetchTasks = async () => {
    try { setTasks(await getPmTasksAPI()); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const taskId = active.id as string;
    const overId = over.id as string;
    const isCol = KANBAN_COLUMNS.includes(overId);
    const overTask = tasks.find(t => t._id === overId);
    const newStatus = isCol ? overId : overTask?.status;
    if (newStatus) {
      const current = tasks.find(t => t._id === taskId);
      if (current && current.status !== newStatus) {
        setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
        try { await updatePmTaskAPI(taskId, { status: newStatus }); } catch { fetchTasks(); }
      }
    }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin" size={40} color="#64748b" /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>Kanban Board</h2>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="admin-btn admin-btn-ghost"><Filter size={16} /> Filter</button>
          <button className="admin-btn admin-btn-primary"><Plus size={16} /> New Task</button>
        </div>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 16 }}>
          {KANBAN_COLUMNS.map(col => {
            const colTasks = tasks.filter(t => (t.status || "Backlog") === col);
            return (
              <div key={col} className="kanban-column admin-glass-panel" style={{ minWidth: 280, flexShrink: 0 }}>
                <div className="kanban-column-header">
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{col}</span>
                  <span style={{ background: "rgba(255,255,255,0.1)", padding: "2px 8px", borderRadius: 12, fontSize: 12 }}>{colTasks.length}</span>
                </div>
                <div id={col} style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 120 }}>
                  <SortableContext items={colTasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
                    {colTasks.map(task => <SortableTaskCard key={task._id} task={task} onClick={() => {}} />)}
                  </SortableContext>
                </div>
              </div>
            );
          })}
        </div>
      </DndContext>
    </motion.div>
  );
};

export default PMKanban;
