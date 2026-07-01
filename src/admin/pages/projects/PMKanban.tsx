import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getPmTasksAPI, updatePmTaskAPI, createPmTaskAPI, deletePmTaskAPI } from "../../lib/api";
import { Loader2, Plus, Filter } from "lucide-react";
import { DndContext, closestCorners, PointerSensor, KeyboardSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskModal } from "../../components/TaskModal";
import { toast } from "sonner";

const KANBAN_COLUMNS = ["Backlog", "Pending", "In Progress", "Review", "Testing", "Completed"];
const PRIORITY_COLORS: any = { Critical: "#ef4444", High: "#f59e0b", Medium: "#38bdf8", Low: "#64748b" };

const SortableTaskCard = ({ task, onClick }: { task: any; onClick: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, cursor: "grab" };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="kanban-card" onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, alignItems: "flex-start" }}>
        <h4 style={{ fontSize: 14, fontWeight: 600, color: "#fff", margin: 0, paddingRight: 8 }}>{task.title}</h4>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <button onClick={(e) => { e.stopPropagation(); onClick(); }} style={{ background: "transparent", border: "none", color: "#8b949e", cursor: "pointer", padding: 0 }} title="Edit Task">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: PRIORITY_COLORS[task.priority] || "#64748b", marginTop: 2 }} />
        </div>
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(KeyboardSensor));

  useEffect(() => { fetchTasks(); }, []);
  const fetchTasks = async () => {
    try { setTasks(await getPmTasksAPI()); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleTaskSubmit = async (data: any) => {
    try {
      if (selectedTask) {
        await updatePmTaskAPI(selectedTask._id, data);
      } else {
        await createPmTaskAPI(data);
      }
      setIsModalOpen(false);
      setSelectedTask(null);
      fetchTasks();
    } catch (err: any) {
      toast.error(err.message || "Operation failed");
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    try {
      await deletePmTaskAPI(selectedTask._id);
      setIsModalOpen(false);
      setSelectedTask(null);
      fetchTasks();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete task");
    }
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
          <button className="admin-btn admin-btn-primary" onClick={() => { setSelectedTask(null); setIsModalOpen(true); }}><Plus size={16} /> New Task</button>
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
                    {colTasks.map(task => <SortableTaskCard key={task._id} task={task} onClick={() => { setSelectedTask(task); setIsModalOpen(true); }} />)}
                  </SortableContext>
                </div>
              </div>
            );
          })}
        </div>
      </DndContext>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedTask(null); }}
        onSubmit={handleTaskSubmit}
        onDelete={handleDeleteTask}
        initialData={selectedTask}
      />
    </motion.div>
  );
};

export default PMKanban;
