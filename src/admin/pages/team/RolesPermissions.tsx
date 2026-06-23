import React from "react";
import { motion } from "framer-motion";
import { Shield, Check, X } from "lucide-react";

const ROLES = [
  { name: "Super Admin", color: "#10b981", perms: [true, true, true, true, true, true, true] },
  { name: "Admin", color: "#ef4444", perms: [true, true, true, true, true, false, true] },
  { name: "Team Leader", color: "#f59e0b", perms: [true, true, true, false, true, false, false] },
  { name: "Employee", color: "#38bdf8", perms: [true, false, false, false, false, false, false] },
  { name: "Editor", color: "#a78bfa", perms: [true, false, false, false, false, false, false] },
  { name: "Viewer", color: "#64748b", perms: [true, false, false, false, false, false, false] },
];
const PERMISSIONS = ["Dashboard", "CRM", "Projects", "Finance", "Team", "Database", "Settings"];

const RolesPermissions: React.FC = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <div><h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>Roles & Permissions</h2><p style={{ color: "#94a3b8", fontSize: 14 }}>Enterprise RBAC permission matrix.</p></div>
      </div>

      <div className="admin-glass-panel" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.03)" }}>
              <th style={{ padding: "14px 20px", textAlign: "left", color: "#64748b", fontSize: 13, fontWeight: 600 }}>Role</th>
              {PERMISSIONS.map(p => (
                <th key={p} style={{ padding: "14px 12px", textAlign: "center", color: "#64748b", fontSize: 13, fontWeight: 600 }}>{p}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROLES.map((role, i) => (
              <tr key={role.name} style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Shield size={16} color={role.color} />
                    <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{role.name}</span>
                  </div>
                </td>
                {role.perms.map((allowed, j) => (
                  <td key={j} style={{ padding: "14px 12px", textAlign: "center" }}>
                    {allowed ? <Check size={16} color="#10b981" /> : <X size={16} color="#475569" />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ color: "#64748b", fontSize: 13, marginTop: 16, textAlign: "center" }}>
        Role assignments are managed through the Employee Directory. The permission matrix reflects system access levels.
      </p>
    </motion.div>
  );
};

export default RolesPermissions;
