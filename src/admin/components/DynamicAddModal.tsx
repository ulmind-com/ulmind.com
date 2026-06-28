import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Loader2 } from "lucide-react";

export interface ModalField {
  name: string;
  label: string;
  type: "text" | "number" | "email" | "date" | "select" | "textarea" | "password";
  required?: boolean;
  options?: { label: string; value: string | number }[]; // For select type
  placeholder?: string;
  defaultValue?: any;
}

interface DynamicAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: ModalField[];
  onSubmit: (data: any) => Promise<void>;
  submitText?: string;
  initialData?: any;
}

export const DynamicAddModal: React.FC<DynamicAddModalProps> = ({ 
  isOpen, onClose, title, fields, onSubmit, submitText = "Save Record", initialData 
}) => {
  const defaultState = fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue !== undefined ? field.defaultValue : "";
    return acc;
  }, {} as any);

  const [formData, setFormData] = useState(initialData || defaultState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setFormData(initialData || defaultState);
      setError(null);
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit(formData);
      setFormData(defaultState); // Reset form
      onClose(); // Close modal on success
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 10 }} 
          className="admin-glass-panel" 
          style={{ width: "100%", maxWidth: 500, padding: 32, maxHeight: "90vh", overflowY: "auto" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
              <Plus size={20} color="#38bdf8" /> {title}
            </h3>
            <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", padding: 4 }}>
              <X size={20} />
            </button>
          </div>

          {error && (
            <div style={{ padding: "12px 16px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: 8, color: "#fca5a5", fontSize: 13, marginBottom: 20 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {fields.map((field) => (
              <div key={field.name}>
                <label style={{ display: "block", fontSize: 13, color: "#94a3b8", marginBottom: 6 }}>
                  {field.label} {field.required && <span style={{ color: "#ef4444" }}>*</span>}
                </label>
                
                {field.type === "select" ? (
                  <select
                    required={field.required}
                    value={formData[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 14px", color: "#fff", outline: "none", fontSize: 14 }}
                  >
                    <option value="" disabled>Select {field.label}</option>
                    {field.options?.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    required={field.required}
                    value={formData[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder || `Enter ${field.label}`}
                    rows={4}
                    style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 14px", color: "#fff", outline: "none", fontSize: 14, resize: "vertical" }}
                  />
                ) : (
                  <input
                    type={field.type}
                    required={field.required}
                    value={formData[field.name]}
                    onChange={(e) => handleChange(field.name, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                    placeholder={field.placeholder || `Enter ${field.label}`}
                    style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 14px", color: "#fff", outline: "none", fontSize: 14 }}
                  />
                )}
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
              <button 
                type="button" 
                onClick={onClose} 
                disabled={loading}
                style={{ padding: "10px 20px", borderRadius: 8, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: loading ? "not-allowed" : "pointer", fontWeight: 600, fontSize: 14 }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                style={{ padding: "10px 20px", borderRadius: 8, background: "#38bdf8", border: "none", color: "#000", cursor: loading ? "not-allowed" : "pointer", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : submitText}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
