import React from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Receipt, CreditCard, TrendingDown,
  BarChart3, DollarSign, AlertCircle, FileText
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const FinancePage: React.FC = () => {
  const finNavLinks = [
    { to: "/admin/finance/dashboard", icon: <LayoutDashboard size={16} />, label: "Dashboard" },
    { to: "/admin/finance/invoices", icon: <Receipt size={16} />, label: "Invoices" },
    { to: "/admin/finance/payments", icon: <CreditCard size={16} />, label: "Payments" },
    { to: "/admin/finance/expenses", icon: <TrendingDown size={16} />, label: "Expenses" },
    { to: "/admin/finance/profit-loss", icon: <BarChart3 size={16} />, label: "Profit & Loss" },
    { to: "/admin/finance/revenue", icon: <DollarSign size={16} />, label: "Monthly Revenue" },
    { to: "/admin/finance/outstanding", icon: <AlertCircle size={16} />, label: "Outstanding" },
    { to: "/admin/finance/reports", icon: <FileText size={16} />, label: "Reports" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: 24, height: "calc(100vh - 120px)" }}>
      <div className="admin-glass-panel" style={{ width: 240, padding: 16, display: "flex", flexDirection: "column", gap: 4, height: "100%", overflowY: "auto", flexShrink: 0 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", padding: "8px 12px", marginBottom: 8 }}>Finance</h3>
        {finNavLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
            style={({ isActive }) => ({
              padding: "10px 14px", display: "flex", alignItems: "center", gap: 12,
              borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 500,
              transition: "all 0.2s",
              color: isActive ? "#fff" : "#94a3b8",
              background: isActive ? "rgba(16, 185, 129, 0.15)" : "transparent",
            })}
          >
            {link.icon} {link.label}
          </NavLink>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto", paddingRight: 8 }}>
        <Outlet />
      </div>
    </motion.div>
  );
};

export default FinancePage;
