import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, AlignLeft, Target, AlertCircle } from "lucide-react";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  onDelete?: () => void;
  initialData?: any;
}

const KANBAN_COLUMNS = ["Backlog", "Pending", "In Progress", "Review", "Testing", "Completed"];
const PRIORITIES = ["Low", "Medium", "High", "Critical"];

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSubmit, onDelete, initialData }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Backlog",
    priority: "Medium",
    due_date: "",
    estimated_hours: "",
    project_id: "default",
  });

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        status: initialData.status || "Backlog",
        priority: initialData.priority || "Medium",
        due_date: initialData.due_date ? new Date(initialData.due_date).toISOString().split("T")[0] : "",
        estimated_hours: initialData.estimated_hours || "",
        project_id: initialData.project_id || "default",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "Backlog",
        priority: "Medium",
        due_date: "",
        estimated_hours: "",
        project_id: "default",
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : 0,
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(8px)",
          display: "flex", justifyContent: "center", alignItems: "center",
          zIndex: 9999, padding: 20
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              background: "linear-gradient(145deg, #1e293b, #0f172a)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 24, padding: 32, width: "100%", maxWidth: 600,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              position: "relative"
            }}
          >
            <button
              onClick={onClose}
              style={{
                position: "absolute", top: 24, right: 24,
                background: "rgba(255, 255, 255, 0.05)", border: "none",
                borderRadius: "50%", width: 36, height: 36,
                display: "flex", justifyContent: "center", alignItems: "center",
                color: "#94a3b8", cursor: "pointer", transition: "all 0.2s"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"; e.currentTarget.style.color = "#94a3b8"; }}
            >
              <X size={18} />
            </button>

            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #3b82f6, #2563eb)", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Target size={20} color="#fff" />
              </div>
              {initialData ? "Edit Task" : "Create New Task"}
            </h2>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 8 }}>Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="E.g., Implement login flow"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: 12,
                    background: "rgba(15, 23, 42, 0.5)", border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#fff", fontSize: 15, outline: "none", transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#3b82f6"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)"}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                  <AlignLeft size={14} /> Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide task details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: 12,
                    background: "rgba(15, 23, 42, 0.5)", border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#fff", fontSize: 15, outline: "none", resize: "vertical", transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#3b82f6"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)"}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 8 }}>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{
                      width: "100%", padding: "12px 16px", borderRadius: 12,
                      background: "rgba(15, 23, 42, 0.5)", border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#fff", fontSize: 15, outline: "none"
                    }}
                  >
                    {KANBAN_COLUMNS.map(col => <option key={col} value={col}>{col}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    <AlertCircle size={14} /> Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    style={{
                      width: "100%", padding: "12px 16px", borderRadius: 12,
                      background: "rgba(15, 23, 42, 0.5)", border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#fff", fontSize: 15, outline: "none"
                    }}
                  >
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    <Calendar size={14} /> Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    style={{
                      width: "100%", padding: "12px 16px", borderRadius: 12,
                      background: "rgba(15, 23, 42, 0.5)", border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#fff", fontSize: 15, outline: "none", colorScheme: "dark"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    <Clock size={14} /> Est. Hours
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="E.g., 4.5"
                    value={formData.estimated_hours}
                    onChange={(e) => setFormData({ ...formData, estimated_hours: e.target.value })}
                    style={{
                      width: "100%", padding: "12px 16px", borderRadius: 12,
                      background: "rgba(15, 23, 42, 0.5)", border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#fff", fontSize: 15, outline: "none"
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 12 }}>
                {initialData && onDelete && (
                  <button
                    type="button"
                    onClick={onDelete}
                    style={{
                      padding: "12px 24px", borderRadius: 12,
                      background: "rgba(239, 68, 68, 0.1)", color: "#ef4444",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                      fontSize: 14, fontWeight: 600, cursor: "pointer",
                      marginRight: "auto"
                    }}
                  >
                    Delete Task
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: "12px 24px", borderRadius: 12,
                    background: "rgba(255, 255, 255, 0.05)", color: "#e2e8f0",
                    border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer",
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "12px 32px", borderRadius: 12,
                    background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "#fff",
                    border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer",
                    boxShadow: "0 8px 20px -6px rgba(59, 130, 246, 0.5)",
                    transition: "transform 0.2s, box-shadow 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 12px 24px -6px rgba(59, 130, 246, 0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 20px -6px rgba(59, 130, 246, 0.5)";
                  }}
                >
                  {initialData ? "Save Changes" : "Create Task"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
