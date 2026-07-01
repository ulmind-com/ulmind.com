/* ──────────────────────────────────────────────────────────────
   HW Employee Management — Add/Edit/Delete + QR Generation
   Premium employee cards with QR code display and printing
   ────────────────────────────────────────────────────────────── */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Plus, Edit, Trash2, QrCode, Download, RefreshCw,
  Mail, Briefcase, Phone, ArrowLeft, Shield, X, Save,
  Check, AlertTriangle, Search, Hash, Building,
} from "lucide-react";
import { listEmployees, createEmployee, updateEmployee, deleteEmployee, regenerateQR } from "../../lib/hw-api";
import "../../admin.css";

interface Employee {
  _id: string;
  name: string;
  email: string;
  designation: string;
  employee_id: string;
  phone?: string;
  department?: string;
  status: string;
  qr_code_data?: string;
  qr_code_image?: string;
  total_working_hours: number;
  total_sessions: number;
  avg_productivity_score: number;
  created_at?: string;
}

const INITIAL_FORM = {
  name: "", email: "", designation: "", employee_id: "", phone: "", department: "",
};

const HWEmployeeManagement: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showQR, setShowQR] = useState<Employee | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await listEmployees();
      setEmployees(res.employees || []);
    } catch (e: any) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.designation || !form.employee_id) {
      setError("All fields except phone and department are required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (editId) {
        await updateEmployee(editId, form);
      } else {
        await createEmployee(form as any);
      }
      setShowForm(false);
      setEditId(null);
      setForm(INITIAL_FORM);
      await fetchEmployees();
    } catch (e: any) {
      setError(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (emp: Employee) => {
    setForm({
      name: emp.name,
      email: emp.email,
      designation: emp.designation,
      employee_id: emp.employee_id,
      phone: emp.phone || "",
      department: emp.department || "",
    });
    setEditId(emp._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEmployee(id);
      setShowDeleteConfirm(null);
      await fetchEmployees();
    } catch (e: any) {
      console.error("Delete error:", e);
    }
  };

  const handleRegenQR = async (emp: Employee) => {
    try {
      const res = await regenerateQR(emp._id);
      if (res.status === "success") {
        await fetchEmployees();
        // Update the shown QR
        if (showQR && showQR._id === emp._id) {
          setShowQR({ ...emp, qr_code_image: res.qr_code_image, qr_code_data: res.qr_code_data });
        }
      }
    } catch (e: any) {
      console.error("Regen error:", e);
    }
  };

  const downloadQR = (emp: Employee) => {
    if (!emp.qr_code_image) return;
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${emp.qr_code_image}`;
    link.download = `${emp.employee_id}_qr.png`;
    link.click();
  };

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.employee_id.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      minHeight: "100vh", background: "#030712", color: "#fff",
      fontFamily: "'Inter', system-ui, sans-serif", padding: 24,
    }}>
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 24, flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => navigate("/admin/hw/admin")}
            style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10, padding: "8px 12px", color: "#94a3b8", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 4, fontSize: 12,
            }}
          >
            <ArrowLeft size={14} /> Back
          </button>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <Users size={22} color="#3b82f6" /> Employee Management
            </h1>
            <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>
              {employees.length} employees registered
            </p>
          </div>
        </div>

        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm(INITIAL_FORM); setError(""); }}
          style={{
            padding: "10px 20px", borderRadius: 12,
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            color: "#fff", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8,
            boxShadow: "0 4px 15px rgba(59,130,246,0.3)",
          }}
        >
          <Plus size={16} /> Add Employee
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20, position: "relative", maxWidth: 400 }}>
        <Search size={16} color="#64748b" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
        <input
          type="text"
          placeholder="Search by name, ID, or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%", paddingLeft: 40, paddingRight: 16, height: 44,
            background: "rgba(15,23,42,0.5)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, color: "#fff", fontSize: 13, outline: "none",
          }}
        />
      </div>

      {/* Employee Cards */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>Loading employees...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 16 }}>
          {filtered.map((emp) => (
            <motion.div
              key={emp._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: "rgba(15,23,42,0.5)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 20, padding: 24, backdropFilter: "blur(20px)",
                position: "relative", overflow: "hidden",
              }}
            >
              {/* Status indicator */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 2,
                background: emp.status === "Active"
                  ? "linear-gradient(90deg, transparent, #10b981, transparent)"
                  : "linear-gradient(90deg, transparent, #64748b, transparent)",
              }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 50, height: 50, borderRadius: 16,
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20, fontWeight: 800, color: "#fff",
                  }}>
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{emp.name}</h3>
                    <p style={{ fontSize: 12, color: "#94a3b8", margin: "2px 0 0" }}>{emp.designation}</p>
                    <p style={{ fontSize: 11, color: "#64748b", margin: "2px 0 0" }}>{emp.employee_id}</p>
                  </div>
                </div>

                <div style={{
                  padding: "3px 8px", borderRadius: 6, fontSize: 9, fontWeight: 700,
                  background: emp.status === "Active" ? "rgba(16,185,129,0.1)" : "rgba(100,116,139,0.1)",
                  color: emp.status === "Active" ? "#10b981" : "#64748b",
                  textTransform: "uppercase",
                }}>
                  {emp.status}
                </div>
              </div>

              {/* Details */}
              <div style={{
                marginTop: 16, display: "flex", flexDirection: "column", gap: 6,
                fontSize: 12, color: "#94a3b8",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Mail size={12} color="#64748b" /> {emp.email}
                </div>
                {emp.phone && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Phone size={12} color="#64748b" /> {emp.phone}
                  </div>
                )}
                {emp.department && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Building size={12} color="#64748b" /> {emp.department}
                  </div>
                )}
              </div>

              {/* Stats */}
              <div style={{
                marginTop: 14, display: "flex", gap: 8,
              }}>
                <div style={{
                  flex: 1, padding: "8px 12px", borderRadius: 8,
                  background: "rgba(0,0,0,0.2)", textAlign: "center",
                }}>
                  <p style={{ fontSize: 16, fontWeight: 800, margin: 0, color: "#3b82f6" }}>{emp.total_sessions}</p>
                  <p style={{ fontSize: 9, color: "#64748b", margin: 0 }}>Sessions</p>
                </div>
                <div style={{
                  flex: 1, padding: "8px 12px", borderRadius: 8,
                  background: "rgba(0,0,0,0.2)", textAlign: "center",
                }}>
                  <p style={{ fontSize: 16, fontWeight: 800, margin: 0, color: "#10b981" }}>{emp.total_working_hours.toFixed(1)}</p>
                  <p style={{ fontSize: 9, color: "#64748b", margin: 0 }}>Hours</p>
                </div>
                <div style={{
                  flex: 1, padding: "8px 12px", borderRadius: 8,
                  background: "rgba(0,0,0,0.2)", textAlign: "center",
                }}>
                  <p style={{ fontSize: 16, fontWeight: 800, margin: 0, color: "#f59e0b" }}>{emp.avg_productivity_score}%</p>
                  <p style={{ fontSize: 9, color: "#64748b", margin: 0 }}>Score</p>
                </div>
              </div>

              {/* Actions */}
              <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
                <button onClick={() => setShowQR(emp)} style={actionBtnStyle("#8b5cf6")}>
                  <QrCode size={14} /> QR Code
                </button>
                <button onClick={() => handleEdit(emp)} style={actionBtnStyle("#3b82f6")}>
                  <Edit size={14} /> Edit
                </button>
                <button onClick={() => setShowDeleteConfirm(emp._id)} style={actionBtnStyle("#ef4444")}>
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 100,
              background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
            }}
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: "rgba(15,23,42,0.95)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 24, padding: 32, maxWidth: 440, width: "100%",
              }}
            >
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>
                {editId ? "Edit Employee" : "Add New Employee"}
              </h2>

              {error && (
                <div style={{
                  padding: "10px 14px", borderRadius: 10, marginBottom: 16,
                  background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                  color: "#fca5a5", fontSize: 12, fontWeight: 600,
                }}>{error}</div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <FormField label="Full Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} icon={<Users size={14} />} placeholder="John Doe" />
                <FormField label="Email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} icon={<Mail size={14} />} placeholder="john@ulmind.com" type="email" />
                <FormField label="Designation" value={form.designation} onChange={v => setForm(f => ({ ...f, designation: v }))} icon={<Briefcase size={14} />} placeholder="Developer" />
                <FormField label="Employee ID" value={form.employee_id} onChange={v => setForm(f => ({ ...f, employee_id: v }))} icon={<Hash size={14} />} placeholder="UL-001" disabled={!!editId} />
                <FormField label="Phone (Optional)" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} icon={<Phone size={14} />} placeholder="+91 9876543210" />
                <FormField label="Department (Optional)" value={form.department} onChange={v => setForm(f => ({ ...f, department: v }))} icon={<Building size={14} />} placeholder="Engineering" />
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <button onClick={() => setShowForm(false)} style={{
                  flex: 1, padding: "12px", borderRadius: 12,
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#e2e8f0", fontSize: 14, fontWeight: 600, cursor: "pointer",
                }}>
                  Cancel
                </button>
                <button onClick={handleSubmit} disabled={saving} style={{
                  flex: 1, padding: "12px", borderRadius: 12,
                  background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                  border: "none", color: "#fff", fontSize: 14, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}>
                  {saving ? "Saving..." : <><Save size={16} /> {editId ? "Update" : "Create"}</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 100,
              background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
            }}
            onClick={() => setShowQR(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: "rgba(15,23,42,0.95)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 24, padding: 32, maxWidth: 380, width: "100%", textAlign: "center",
              }}
            >
              <QrCode size={24} color="#8b5cf6" style={{ margin: "0 auto 12px" }} />
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{showQR.name}</h2>
              <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 20 }}>{showQR.employee_id} • {showQR.designation}</p>

              {showQR.qr_code_image ? (
                <div style={{
                  background: "#fff", borderRadius: 16, padding: 20,
                  display: "inline-block", marginBottom: 20,
                }}>
                  <img
                    src={`data:image/png;base64,${showQR.qr_code_image}`}
                    alt="QR Code"
                    style={{ width: 200, height: 200, imageRendering: "pixelated" }}
                  />
                </div>
              ) : (
                <div style={{
                  padding: 40, borderRadius: 16,
                  background: "rgba(255,255,255,0.03)", marginBottom: 20,
                  color: "#64748b", fontSize: 13,
                }}>
                  No QR code generated yet
                </div>
              )}

              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                {showQR.qr_code_image && (
                  <button onClick={() => downloadQR(showQR)} style={{
                    padding: "8px 16px", borderRadius: 10,
                    background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)",
                    color: "#6ee7b7", fontSize: 12, fontWeight: 600, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 6,
                  }}>
                    <Download size={14} /> Download
                  </button>
                )}
                <button onClick={() => handleRegenQR(showQR)} style={{
                  padding: "8px 16px", borderRadius: 10,
                  background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
                  color: "#93c5fd", fontSize: 12, fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  <RefreshCw size={14} /> Regenerate
                </button>
              </div>

              <button onClick={() => setShowQR(null)} style={{
                marginTop: 16, width: "100%", padding: "10px", borderRadius: 12,
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                color: "#e2e8f0", fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 100,
              background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: "rgba(15,23,42,0.95)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 20, padding: 32, maxWidth: 360, width: "90%", textAlign: "center",
              }}
            >
              <AlertTriangle size={40} color="#ef4444" style={{ margin: "0 auto 16px" }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Delete Employee?</h3>
              <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>
                This will permanently delete the employee and their QR code.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button onClick={() => setShowDeleteConfirm(null)} style={{
                  padding: "10px 24px", borderRadius: 12,
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#e2e8f0", fontSize: 14, fontWeight: 600, cursor: "pointer",
                }}>Cancel</button>
                <button onClick={() => handleDelete(showDeleteConfirm)} style={{
                  padding: "10px 24px", borderRadius: 12,
                  background: "linear-gradient(135deg, #ef4444, #dc2626)",
                  border: "none", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer",
                }}>Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────

const FormField: React.FC<{
  label: string; value: string; onChange: (v: string) => void;
  icon: React.ReactNode; placeholder: string; type?: string; disabled?: boolean;
}> = ({ label, value, onChange, icon, placeholder, type = "text", disabled }) => (
  <div>
    <label style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
      {label}
    </label>
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#475569" }}>{icon}</div>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} disabled={disabled}
        style={{
          width: "100%", paddingLeft: 38, paddingRight: 14, height: 44,
          background: disabled ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12,
          color: disabled ? "#64748b" : "#fff", fontSize: 13, outline: "none",
          transition: "border-color 0.2s",
        }}
      />
    </div>
  </div>
);

const actionBtnStyle = (color: string): React.CSSProperties => ({
  flex: 1, padding: "8px", borderRadius: 10,
  background: `${color}15`, border: `1px solid ${color}25`,
  color, fontSize: 11, fontWeight: 600, cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
});

export default HWEmployeeManagement;
