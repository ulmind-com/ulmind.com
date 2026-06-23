import React, { useState } from "react";
import { motion, Reorder } from "framer-motion";

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
}

const initialTasks: Task[] = [
  { id: "1", title: "Design CRM UI", status: "In Progress", priority: "High" },
  { id: "2", title: "Setup Database Models", status: "Pending", priority: "Medium" },
  { id: "3", title: "Integrate APIs", status: "Pending", priority: "High" },
  { id: "4", title: "Client Feedback", status: "Review", priority: "Low" }
];

const COLUMNS = ["Pending", "In Progress", "Review", "Completed"];

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  return (
    <div className="kanban-board">
      {COLUMNS.map(col => {
        const colTasks = tasks.filter(t => t.status === col);
        return (
          <div key={col} className="kanban-column admin-glass-panel">
            <div className="kanban-column-header">
              <span style={{ fontWeight: 600, fontSize: 14 }}>{col}</span>
              <span style={{ background: "rgba(255,255,255,0.1)", padding: "2px 8px", borderRadius: 12, fontSize: 12 }}>
                {colTasks.length}
              </span>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: 100 }}>
              {colTasks.map(task => (
                <motion.div 
                  key={task.id}
                  layoutId={task.id}
                  className="kanban-card"
                >
                  <h4 style={{ fontSize: 14, fontWeight: 500, margin: "0 0 8px 0" }}>{task.title}</h4>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className={`admin-badge ${task.priority === 'High' ? 'admin-badge-danger' : 'admin-badge-info'}`}>
                      {task.priority}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
