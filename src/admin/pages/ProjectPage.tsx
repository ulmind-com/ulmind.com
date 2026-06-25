import React from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, FolderOpen, Kanban, Clock,
  ListTodo, Flag, FileText, MessageCircle,
  Timer, DollarSign, Lock
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const ProjectPage: React.FC = () => {
  const pmNavLinks = [
    { to: "/admin/projects/dashboard", icon: <LayoutDashboard size={16} />, label: "Dashboard" },
    { to: "/admin/projects/all", icon: <FolderOpen size={16} />, label: "All Projects" },
    { to: "/admin/projects/kanban", icon: <Kanban size={16} />, label: "Kanban Board" },
    { to: "/admin/projects/timeline", icon: <Clock size={16} />, label: "Timeline" },
    { to: "/admin/projects/tasks", icon: <ListTodo size={16} />, label: "Tasks" },
    { to: "/admin/projects/milestones", icon: <Flag size={16} />, label: "Milestones" },
    { to: "/admin/projects/files", icon: <FileText size={16} />, label: "Project Files" },
    { to: "/admin/projects/feedback", icon: <MessageCircle size={16} />, label: "Client Feedback" },
    { to: "/admin/projects/time-tracking", icon: <Timer size={16} />, label: "Time Tracking" },
    { to: "/admin/projects/budget", icon: <DollarSign size={16} />, label: "Budget" },
    { to: "/admin/projects/environment", icon: <Lock size={16} />, label: "Environment" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: 24, height: "calc(100vh - 120px)" }}>
      {/* PM Inner Sidebar */}
      <div className="admin-glass-panel" style={{ width: 240, padding: 16, display: "flex", flexDirection: "column", gap: 4, height: "100%", overflowY: "auto", flexShrink: 0 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", padding: "8px 12px", marginBottom: 8 }}>Project Management</h3>
        {pmNavLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
            style={({ isActive }) => ({
              padding: "10px 14px", display: "flex", alignItems: "center", gap: 12,
              borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 500,
              transition: "all 0.2s",
              color: isActive ? "#fff" : "#94a3b8",
              background: isActive ? "rgba(56, 189, 248, 0.15)" : "transparent",
            })}
          >
            {link.icon} {link.label}
          </NavLink>
        ))}
      </div>

      {/* Main PM Content Area */}
      <div style={{ flex: 1, overflowY: "auto", paddingRight: 8 }}>
        <Outlet />
      </div>
    </motion.div>
  );
};

export default ProjectPage;
