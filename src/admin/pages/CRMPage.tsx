import React from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, Users, Kanban, 
  History, Calendar, FileSignature, 
  Receipt, CreditCard, FolderOpen, Search
} from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const CRMPage: React.FC = () => {
  const location = useLocation();

  const crmNavLinks = [
    { to: "/admin/crm/dashboard", icon: <LayoutDashboard size={16} />, label: "Dashboard" },
    { to: "/admin/crm/clients", icon: <Users size={16} />, label: "Client List" },
    { to: "/admin/crm/lead-finder", icon: <Search size={16} />, label: "Lead Finder" },
    { to: "/admin/crm/activities", icon: <History size={16} />, label: "Contact History" },
    { to: "/admin/crm/meetings", icon: <Calendar size={16} />, label: "Meeting Notes" },
    { to: "/admin/crm/contracts", icon: <FileSignature size={16} />, label: "Contracts" },
    { to: "/admin/crm/invoices", icon: <Receipt size={16} />, label: "Invoices" },
    { to: "/admin/crm/payments", icon: <CreditCard size={16} />, label: "Payments" },
    { to: "/admin/crm/documents", icon: <FolderOpen size={16} />, label: "Documents" },
    { to: "/admin/crm/pipeline", icon: <Kanban size={16} />, label: "Lead Pipeline" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: 24, height: "calc(100vh - 120px)" }}>
      {/* CRM Inner Sidebar */}
      <div className="admin-glass-panel" style={{ width: 240, padding: 16, display: "flex", flexDirection: "column", gap: 8, height: "100%", overflowY: "auto" }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", padding: "8px 12px", marginBottom: 8 }}>CRM Module</h3>
        {crmNavLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
            style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 12, borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "all 0.2s" }}
          >
            {link.icon} {link.label}
          </NavLink>
        ))}
      </div>

      {/* Main CRM Content Area */}
      <div style={{ flex: 1, overflowY: "auto", paddingRight: 8 }}>
        <Outlet />
      </div>
    </motion.div>
  );
};

export default CRMPage;
