import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './auth-context';
import { toast } from 'sonner';

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  priority: string;
  category: string;
  recommended_action?: string;
  is_read: boolean;
  link?: string;
  created_at: string;
}

interface WebSocketContextType {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  unreadCount: number;
  markAllRead: () => void;
  markAsRead: (id: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Fetch initial notifications
    const fetchNotifications = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
        const res = await fetch(`${apiUrl}/notifications/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("ulmind_admin_token")}` }
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    if (user) fetchNotifications();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const wsUrlBase = import.meta.env.VITE_WS_URL || "ws://localhost:5000/ws";
    const wsUrl = `${wsUrlBase}/notifications/${user.email}`;
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log('Connected to Notification WebSocket');
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'NEW_NOTIFICATION') {
          const notif = data.notification as Notification;
          setNotifications(prev => [notif, ...prev]);
          
          // Toast for High/Critical
          if (notif.priority === 'Critical' || notif.priority === 'High') {
             toast.error(notif.title, { description: notif.message, duration: 5000 });
          } else {
             toast.info(notif.title, { description: notif.message });
          }
        }
      } catch (err) {
        console.error("Error parsing websocket message", err);
      }
    };

    websocket.onclose = () => {
      console.log('Disconnected from Notification WebSocket');
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [user]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
      await fetch(`${apiUrl}/notifications/read-all`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("ulmind_admin_token")}` }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, is_read: true } : n));
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
      await fetch(`${apiUrl}/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("ulmind_admin_token")}` }
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <WebSocketContext.Provider value={{ notifications, setNotifications, unreadCount, markAllRead, markAsRead }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) throw new Error("useWebSocket must be used within a WebSocketProvider");
  return context;
};
