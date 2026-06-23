import React, { useEffect, useState } from "react";
import { Activity, User } from "lucide-react";

interface AuditLog {
  _id: string;
  user_id: string;
  event_type: string;
  resource_type: string;
  description: string;
  created_at: string;
}

const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/audit/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` }
        });
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 8px 0" }}>Audit Logs</h1>
          <p style={{ color: "var(--admin-text-muted)", margin: 0 }}>System security and activity audit trail</p>
        </div>
      </div>

      <div style={{ background: "rgba(30,30,35,0.6)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <th style={{ padding: 16, fontWeight: 500, color: "var(--admin-text-dim)" }}>Timestamp</th>
              <th style={{ padding: 16, fontWeight: 500, color: "var(--admin-text-dim)" }}>User</th>
              <th style={{ padding: 16, fontWeight: 500, color: "var(--admin-text-dim)" }}>Event</th>
              <th style={{ padding: 16, fontWeight: 500, color: "var(--admin-text-dim)" }}>Resource</th>
              <th style={{ padding: 16, fontWeight: 500, color: "var(--admin-text-dim)" }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <td style={{ padding: 16, color: "var(--admin-text-muted)" }}>{new Date(log.created_at).toLocaleString()}</td>
                <td style={{ padding: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--admin-accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <User size={12} color="#fff" />
                    </div>
                    <span>{log.user_id.split("@")[0]}</span>
                  </div>
                </td>
                <td style={{ padding: 16 }}>
                  <span style={{ padding: "4px 8px", borderRadius: 6, fontSize: 11, background: "rgba(255,255,255,0.05)" }}>
                    {log.event_type}
                  </span>
                </td>
                <td style={{ padding: 16, color: "var(--admin-text-muted)" }}>{log.resource_type}</td>
                <td style={{ padding: 16, color: "var(--admin-text)" }}>{log.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogsPage;
