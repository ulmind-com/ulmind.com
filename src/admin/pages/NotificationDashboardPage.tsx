import React, { useEffect, useState } from "react";
import { useWebSocket } from "../context/WebSocketContext";
import { CheckCircle, Bell, AlertTriangle, Zap, Info, Calendar } from "lucide-react";

const NotificationDashboardPage: React.FC = () => {
  const { notifications, unreadCount, markAllRead, markAsRead } = useWebSocket();
  const [filter, setFilter] = useState("All");

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "Critical": return "var(--admin-rose)";
      case "High": return "var(--admin-amber)";
      case "Warning": return "var(--admin-amber)";
      case "Medium": return "var(--admin-sky)";
      default: return "var(--admin-emerald)";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case "Critical": return <AlertTriangle size={16} color="var(--admin-rose)" />;
      case "Warning": return <AlertTriangle size={16} color="var(--admin-amber)" />;
      case "High": return <Zap size={16} color="var(--admin-amber)" />;
      default: return <Info size={16} color="var(--admin-sky)" />;
    }
  };

  const filteredNotifs = filter === "All" ? notifications : notifications.filter(n => n.priority === filter);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 8px 0" }}>Notification Dashboard</h1>
          <p style={{ color: "var(--admin-text-muted)", margin: 0 }}>Smart insights & AI powered alerts</p>
        </div>
        <button className="admin-btn-primary" onClick={markAllRead}>
          Mark All Read
        </button>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
        {["All", "Critical", "High", "Medium", "Low"].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "8px 16px", borderRadius: 20, cursor: "pointer",
              background: filter === f ? "var(--admin-accent)" : "rgba(255,255,255,0.05)",
              color: filter === f ? "#fff" : "var(--admin-text)",
              border: "1px solid rgba(255,255,255,0.1)",
              transition: "all 0.2s"
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {filteredNotifs.map(n => (
          <div key={n._id} onClick={() => !n.is_read && markAsRead(n._id)} style={{
            background: "rgba(30,30,35,0.6)", borderRadius: 16, padding: 20,
            border: "1px solid rgba(255,255,255,0.05)",
            display: "flex", gap: 16, alignItems: "flex-start", cursor: "pointer",
            opacity: n.is_read ? 0.7 : 1
          }}>
            <div style={{ padding: 12, borderRadius: 12, background: "rgba(255,255,255,0.05)" }}>
              {getPriorityIcon(n.priority)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{n.title}</h3>
                <span style={{ fontSize: 12, color: "var(--admin-text-dim)", display: "flex", alignItems: "center", gap: 6 }}>
                  <Calendar size={12} />
                  {new Date(n.created_at).toLocaleString()}
                </span>
              </div>
              <p style={{ margin: 0, color: "var(--admin-text-muted)", fontSize: 14 }}>{n.message}</p>
              
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <span style={{ padding: "4px 8px", borderRadius: 6, fontSize: 11, background: "rgba(255,255,255,0.05)" }}>
                  {n.category}
                </span>
                <span style={{ padding: "4px 8px", borderRadius: 6, fontSize: 11, color: getPriorityColor(n.priority), background: "rgba(255,255,255,0.05)" }}>
                  Priority: {n.priority}
                </span>
                {n.recommended_action && (
                  <span style={{ padding: "4px 8px", borderRadius: 6, fontSize: 11, color: "var(--admin-sky)", background: "rgba(56, 189, 248, 0.1)" }}>
                    ✨ {n.recommended_action}
                  </span>
                )}
              </div>
            </div>
            {!n.is_read && (
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: getPriorityColor(n.priority), marginTop: 16 }} />
            )}
          </div>
        ))}
        {filteredNotifs.length === 0 && (
          <div style={{ textAlign: "center", padding: 64, color: "var(--admin-text-dim)" }}>
             <CheckCircle size={48} style={{ margin: "0 auto 16px", opacity: 0.2 }} />
             <p>No notifications found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDashboardPage;
