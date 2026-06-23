import React, { useState } from "react";
import { Bell, X, CheckCircle, AlertTriangle, Info, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWebSocket } from "../context/WebSocketContext";
import { useNavigate } from "react-router-dom";

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAllRead, markAsRead } = useWebSocket();
  const navigate = useNavigate();

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

  return (
    <>
      <button 
        className="admin-btn-ghost" 
        style={{ padding: 8, borderRadius: 8, position: "relative" }}
        onClick={() => setIsOpen(true)}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={{
            position: "absolute", top: 2, right: 2, width: 10, height: 10,
            background: "var(--admin-rose)", borderRadius: "50%",
            boxShadow: "0 0 10px var(--admin-rose)"
          }} />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              style={{
                position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", zIndex: 100
              }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              style={{
                position: "fixed", top: 16, right: 16, bottom: 16, width: 400,
                background: "rgba(30, 30, 35, 0.6)", zIndex: 101,
                borderRadius: 24, border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(20px)",
                display: "flex", flexDirection: "column",
                boxShadow: "0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)"
              }}
            >
              <div style={{ 
                padding: "24px 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", 
                display: "flex", justifyContent: "space-between", alignItems: "center" 
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.05)",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <Bell size={18} color="var(--admin-sky)" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Smart Alerts</h3>
                    <span style={{ fontSize: 12, color: "var(--admin-text-dim)" }}>
                      {unreadCount} unread • AI Powered
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={markAllRead} style={{ 
                    background: "rgba(255,255,255,0.05)", border: "none", color: "var(--admin-text)", 
                    fontSize: 12, padding: "6px 12px", borderRadius: 12, cursor: "pointer" 
                  }}>
                    Mark all read
                  </button>
                  <button onClick={() => setIsOpen(false)} style={{ 
                    background: "none", border: "none", color: "var(--admin-text)", cursor: "pointer" 
                  }}><X size={20} /></button>
                </div>
              </div>
              
              <div style={{ padding: 16, overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                {notifications.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--admin-text-dim)" }}>
                    <CheckCircle size={48} style={{ opacity: 0.2, margin: "0 auto 16px" }} />
                    <p>You're all caught up!</p>
                  </div>
                ) : notifications.map(n => (
                  <motion.div 
                    layout
                    key={n._id} 
                    onClick={() => {
                       if (!n.is_read) markAsRead(n._id);
                       if (n.link) {
                          navigate(n.link);
                          setIsOpen(false);
                       }
                    }}
                    style={{
                      background: n.is_read ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      borderRadius: 16, padding: 16, cursor: "pointer",
                      position: "relative", overflow: "hidden",
                      transition: "all 0.2s"
                    }}
                  >
                    {!n.is_read && (
                       <div style={{
                         position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
                         background: getPriorityColor(n.priority)
                       }} />
                    )}
                    <div style={{ display: "flex", gap: 12 }}>
                      <div style={{ marginTop: 2 }}>
                        {getPriorityIcon(n.priority)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontWeight: 600, fontSize: 14 }}>{n.title}</span>
                          <span style={{ fontSize: 11, color: "var(--admin-text-dim)" }}>
                             {new Date(n.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                        <p style={{ fontSize: 13, color: "var(--admin-text-muted)", margin: 0, lineHeight: 1.4 }}>
                          {n.message}
                        </p>
                        {n.recommended_action && (
                          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{
                              fontSize: 11, padding: "4px 8px", borderRadius: 6,
                              background: "rgba(56, 189, 248, 0.1)", color: "var(--admin-sky)"
                            }}>
                              ✨ AI Suggestion
                            </span>
                            <span style={{ fontSize: 12, color: "var(--admin-text)" }}>
                              {n.recommended_action}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NotificationCenter;
