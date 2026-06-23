import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { getCrmDocumentsAPI, authFetch } from "../../lib/api";
import { FolderOpen, UploadCloud, Loader2, Download } from "lucide-react";
import { AdminTable, ColumnDef } from "../../components/AdminTable";
import { DynamicAddModal, ModalField } from "../../components/DynamicAddModal";
import { toast } from "sonner";

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const data = await getCrmDocumentsAPI();
      setDocuments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo<ColumnDef<any>[]>(() => [
    { key: "title", header: "Document Title" },
    { 
      key: "folder", 
      header: "Folder",
      render: (row) => <span style={{ display: "flex", alignItems: "center", gap: 6 }}><FolderOpen size={14} color="#38bdf8"/> {row.folder}</span>
    },
    { 
      key: "size_bytes", 
      header: "Size",
      render: (row) => `${(row.size_bytes / 1024 / 1024).toFixed(2)} MB`
    },
    { key: "uploaded_by", header: "Uploaded By" },
    { 
      key: "created_at", 
      header: "Date",
      render: (row) => new Date(row.created_at).toLocaleString()
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <a 
          href={row.file_url}
          target="_blank"
          rel="noreferrer"
          style={{ display: "flex", alignItems: "center", gap: 6, color: "#10b981", fontWeight: 600, fontSize: 13, textDecoration: "none" }}
        >
          <Download size={14} /> Download
        </a>
      )
    }
  ], []);

  const fields: ModalField[] = [
    { name: "title", label: "Document Title", type: "text", required: true },
    { name: "folder", label: "Folder", type: "text", required: true, defaultValue: "General" },
    { name: "client_id", label: "Client ID (Optional)", type: "text" },
    // A real file upload would require multipart/form-data, but for UI sake we'll simulate URL for now
    { name: "file_url", label: "Document URL", type: "text", required: true },
    { name: "size_bytes", label: "Estimated Size (Bytes)", type: "number", defaultValue: 1048576 }
  ];

  const handleAdd = async (data: any) => {
    try {
      const res = await authFetch("/crm/documents", {
        method: "POST",
        body: JSON.stringify({ ...data, uploaded_by: "admin" })
      });
      if (!res.ok) throw new Error("Failed to upload document");
      toast.success("Document uploaded successfully");
      fetchDocuments();
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin text-slate-500" size={40} /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>Client Documents</h2>
          <p style={{ color: "#94a3b8", fontSize: 14 }}>Secure enterprise file repository.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "#38bdf8", border: "none", color: "#000", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
          <UploadCloud size={16} /> Upload File
        </button>
      </div>

      <AdminTable data={documents} columns={columns} searchPlaceholder="Search documents..." />

      <DynamicAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Upload Document"
        fields={fields}
        onSubmit={handleAdd}
        submitText="Upload"
      />
    </motion.div>
  );
};

export default DocumentsPage;
