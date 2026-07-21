import React, { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from 'react';
import { useAuth } from './auth-context';
import { authFetch, getWsBaseUrl } from '../lib/api';
import { toast } from 'sonner';

export interface Notification {
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
  read_at?: string | null;
  ai_generated?: boolean;
  actor?: string | null;
}

interface WebSocketContextType {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  unreadCount: number;
  loading: boolean;
  connected: boolean;
  refresh: () => Promise<void>;
  markAllRead: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAsUnread: (id: string) => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
  clearRead: () => Promise<void>;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attemptsRef = useRef(0);

  const refresh = useCallback(async () => {
    try {
      // authFetch resolves the base URL the same way as the rest of the admin
      // panel. The old code hardcoded a localhost:5000 fallback, so in local
      // development notifications silently never loaded.
      const res = await authFetch('/notifications/');
      if (res.ok) setNotifications(await res.json());
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) refresh();
    else { setNotifications([]); setLoading(false); }
  }, [user, refresh]);

  // ── WebSocket with backoff reconnect ────────────────────────
  useEffect(() => {
    if (!user) return;
    let disposed = false;

    const connect = () => {
      if (disposed) return;
      const ws = new WebSocket(`${getWsBaseUrl()}/notifications/${user.email}`);
      socketRef.current = ws;

      ws.onopen = () => {
        attemptsRef.current = 0;
        setConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type !== 'NEW_NOTIFICATION') return;
          const notif = data.notification as Notification;
          // Guard against a duplicate arriving alongside a refresh.
          setNotifications((prev) =>
            prev.some((n) => n._id === notif._id) ? prev : [notif, ...prev]
          );
          if (notif.priority === 'Critical') {
            toast.error(notif.title, { description: notif.message, duration: 6000 });
          } else if (notif.priority === 'High') {
            toast.warning(notif.title, { description: notif.message, duration: 5000 });
          }
          // Medium/Low arrive silently — the bell badge is enough.
        } catch (err) {
          console.error('Error parsing websocket message', err);
        }
      };

      ws.onclose = () => {
        setConnected(false);
        if (disposed) return;
        // Back off so a downed backend doesn't spin a reconnect loop.
        const delay = Math.min(30000, 1000 * 2 ** attemptsRef.current);
        attemptsRef.current += 1;
        reconnectRef.current = setTimeout(connect, delay);
      };

      ws.onerror = () => ws.close();
    };

    connect();

    return () => {
      disposed = true;
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  /** Apply an optimistic change, then roll it back if the server rejects it —
   *  the previous version left the UI showing a success that never happened. */
  const optimistic = useCallback(async (
    apply: (prev: Notification[]) => Notification[],
    request: () => Promise<Response | void>,
    errorMessage: string,
  ) => {
    let snapshot: Notification[] = [];
    setNotifications((prev) => { snapshot = prev; return apply(prev); });
    try {
      const res = await request();
      if (res && !res.ok) throw new Error(`${res.status}`);
    } catch (err) {
      console.error(errorMessage, err);
      setNotifications(snapshot);
      toast.error(errorMessage);
    }
  }, []);

  const markAllRead = useCallback(() => optimistic(
    (prev) => prev.map((n) => ({ ...n, is_read: true })),
    () => authFetch('/notifications/read-all', { method: 'PUT' }),
    'Could not mark all as read',
  ), [optimistic]);

  const markAsRead = useCallback((id: string) => optimistic(
    (prev) => prev.map((n) => (n._id === id ? { ...n, is_read: true } : n)),
    () => authFetch(`/notifications/${id}/read`, { method: 'PUT' }),
    'Could not mark as read',
  ), [optimistic]);

  const markAsUnread = useCallback((id: string) => optimistic(
    (prev) => prev.map((n) => (n._id === id ? { ...n, is_read: false } : n)),
    () => authFetch(`/notifications/${id}/unread`, { method: 'PUT' }),
    'Could not mark as unread',
  ), [optimistic]);

  const removeNotification = useCallback((id: string) => optimistic(
    (prev) => prev.filter((n) => n._id !== id),
    () => authFetch(`/notifications/${id}`, { method: 'DELETE' }),
    'Could not delete notification',
  ), [optimistic]);

  const clearRead = useCallback(() => optimistic(
    (prev) => prev.filter((n) => !n.is_read),
    () => authFetch('/notifications/clear-read', { method: 'DELETE' }),
    'Could not clear read notifications',
  ), [optimistic]);

  return (
    <WebSocketContext.Provider value={{
      notifications, setNotifications, unreadCount, loading, connected,
      refresh, markAllRead, markAsRead, markAsUnread, removeNotification, clearRead,
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) throw new Error("useWebSocket must be used within a WebSocketProvider");
  return context;
};
