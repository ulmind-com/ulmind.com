/* ──────────────────────────────────────────────────────────────
   ULMiND Admin — Team Management Enterprise Layout
   Inner sidebar navigation for the full Team/HRMS suite
   ────────────────────────────────────────────────────────────── */

import React from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, CalendarCheck, ClipboardList,
  BarChart2, Crown, Shield, Plane, DollarSign, TrendingUp, Activity
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const TeamLayout: React.FC = () => {
  const teamNavLinks = [
    { to: "/admin/team/dashboard", icon: <LayoutDashboard size={16} />, label: "Dashboard" },
    { to: "/admin/team/directory", icon: <Users size={16} />, label: "Employee Directory" },
    { to: "/admin/team/attendance", icon: <CalendarCheck size={16} />, label: "Attendance" },
    { to: "/admin/team/work-logs", icon: <ClipboardList size={16} />, label: "Work Logs" },
    { to: "/admin/team/performance", icon: <BarChart2 size={16} />, label: "Performance" },
    { to: "/admin/team/leader", icon: <Crown size={16} />, label: "Leader Dashboard" },
    { to: "/admin/team/roles", icon: <Shield size={16} />, label: "Roles & Permissions" },
    { to: "/admin/team/leaves", icon: <Plane size={16} />, label: "Leave Management" },
    { to: "/admin/team/payroll", icon: <DollarSign size={16} />, label: "Payroll Overview" },
    { to: "/admin/team/analytics", icon: <TrendingUp size={16} />, label: "Team Analytics" },
    { to: "/admin/team/manager-tracking", icon: <Activity size={16} />, label: "Manager Tracking" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ display: "flex", gap: 24, height: "calc(100vh - 120px)" }}
    >
      {/* Team Inner Sidebar */}
      <div
        className="admin-glass-panel"
        style={{
          width: 240,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          height: "100%",
          overflowY: "auto",
          flexShrink: 0,
        }}
      >
        <h3
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            padding: "8px 12px",
            marginBottom: 8,
          }}
        >
          Team Management
        </h3>
        {teamNavLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
            style={({ isActive }) => ({
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              borderRadius: 8,
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 500,
              transition: "all 0.2s",
              color: isActive ? "#fff" : "#94a3b8",
              background: isActive ? "rgba(225, 29, 72, 0.15)" : "transparent",
            })}
          >
            {link.icon} {link.label}
          </NavLink>
        ))}
      </div>

      {/* Main Team Content Area */}
      <div style={{ flex: 1, overflowY: "auto", paddingRight: 8 }}>
        <Outlet />
      </div>
    </motion.div>
  );
};

export default TeamLayout;
