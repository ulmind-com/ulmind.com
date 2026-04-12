/* ──────────────────────────────────────────────────────────────
   ULMiND Admin — Layout
   Sidebar + Topbar shell for all admin pages
   ────────────────────────────────────────────────────────────── */

import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import "../admin.css";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { path: "/admin/analytics", label: "Analytics", icon: BarChart3, end: false },
  { path: "/admin/visitors", label: "Visitors", icon: Users, end: false },
  { path: "/admin/team", label: "Team", icon: ShieldCheck, end: false },
  { path: "/admin/settings", label: "Settings", icon: Settings, end: false },
];

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="admin-root">
      {/* Mobile Overlay */}
      <div
        className={`admin-sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="admin-sidebar-logo">
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #7c3aed, #e11d48)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 15px rgba(124,58,237,0.3)",
            }}
          >
            <Shield size={20} color="#fff" />
          </div>
          <h1>ULMiND Admin</h1>
        </div>

        {/* Navigation */}
        <nav className="admin-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? "active" : ""}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon />
              <span>{item.label}</span>
              <ChevronRight
                size={14}
                style={{ marginLeft: "auto", opacity: 0.3 }}
              />
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer — User */}
        <div
          style={{
            padding: "16px 12px",
            borderTop: "1px solid var(--admin-border)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.03)",
            }}
          >
            {user?.profile_photo?.url ? (
              <img
                src={user.profile_photo.url}
                alt="Admin"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid var(--admin-accent)",
                }}
              />
            ) : (
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #7c3aed, #e11d48)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {user?.email?.charAt(0).toUpperCase() || "A"}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--admin-text)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.email || "Admin"}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--admin-text-dim)",
                  textTransform: "capitalize",
                }}
              >
                {user?.role || "admin"}
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              style={{
                background: "transparent",
                border: "none",
                color: "var(--admin-text-dim)",
                cursor: "pointer",
                padding: 4,
                borderRadius: 8,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--admin-rose)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--admin-text-dim)")
              }
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main" style={{ marginLeft: 260 }}>
        {/* Top Bar */}
        <header className="admin-topbar">
          <button
            className="admin-btn-ghost"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              display: "none",
              padding: 8,
              borderRadius: 8,
              border: "none",
              background: "transparent",
              color: "var(--admin-text)",
              cursor: "pointer",
            }}
            // Show on mobile via CSS
            id="admin-mobile-menu"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div style={{ fontSize: 14, color: "var(--admin-text-muted)" }}>
            Welcome back,{" "}
            <span style={{ color: "var(--admin-text)", fontWeight: 600 }}>
              {user?.email?.split("@")[0] || "Admin"}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="admin-badge admin-badge-success">
              ● Online
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ padding: 24, minHeight: "calc(100vh - 64px)" }}>
          <Outlet />
        </main>
      </div>

      {/* Mobile menu button — always visible on mobile */}
      <style>{`
        @media (max-width: 768px) {
          #admin-mobile-menu {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
