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
  Tag,
  ChevronRight,
  Database,
  Activity,
  Briefcase,
  DollarSign,
  FolderKanban,
  Bell,
  ShieldAlert,
  Rss,
  Megaphone
} from "lucide-react";
import NotificationCenter from "./NotificationCenter";
import "../admin.css";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { path: "/admin/crm", label: "CRM Pipeline", icon: Briefcase, end: false },
  { path: "/admin/projects", label: "Projects", icon: FolderKanban, end: false },
  { path: "/admin/finance", label: "Finance", icon: DollarSign, end: false },
  { path: "/admin/analytics", label: "Analytics", icon: BarChart3, end: false },
  { path: "/admin/visitors", label: "Visitors", icon: Users, end: false },
  { path: "/admin/team", label: "Team", icon: ShieldCheck, end: false },
  { path: "/admin/activity", label: "Activity Tracker", icon: Activity, end: false },
  { path: "/admin/offers", label: "Offers", icon: Tag, end: false },
  { path: "/admin/marketing", label: "Marketing", icon: Megaphone, end: false },
  { path: "/admin/website-content", label: "Website Content", icon: LayoutDashboard, end: false },
  { path: "/admin/database", label: "Database", icon: Database, end: false },
  { path: "/admin/notifications", label: "AI Notifications", icon: Bell, end: false },
  { path: "/admin/cron-monitor", label: "CRON Job Monitor", icon: Activity, end: false },
  { path: "/admin/activity-feed", label: "Activity Feed", icon: Rss, end: false },
  { path: "/admin/audit-logs", label: "Audit Logs", icon: ShieldAlert, end: false },
  { path: "/admin/delete-requests", label: "Delete Requests", icon: ShieldAlert, end: false },
  { path: "/admin/settings", label: "Settings", icon: Settings, end: false },
];

import { AdminActionProvider } from "../context/AdminActionContext";
import { WebSocketProvider } from "../context/WebSocketContext";

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <AdminActionProvider>
      <WebSocketProvider>
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
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
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
            {navItems.map((item) => {
              if (item.path === "/admin/activity" && user?.role?.toLowerCase() !== "super_admin") return null;
              if (item.path === "/admin/delete-requests" && user?.role?.toLowerCase() !== "super_admin") return null;
              return (
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
              );
            })}
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
                    background: "linear-gradient(135deg, #ef4444, #dc2626)",
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
              <NotificationCenter />
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
      </WebSocketProvider>
    </AdminActionProvider>
  );
};

export default AdminLayout;
