import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { getPmFilesAPI, authFetch } from "../../lib/api";
import { Loader2, Plus, UploadCloud, Download } from "lucide-react";
import { AdminTable, ColumnDef } from "../../components/AdminTable";
import { DynamicAddModal, ModalField } from "../../components/DynamicAddModal";
import { toast } from "sonner";

const PMFiles: React.FC = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => { fetchFiles(); }, []);
  const fetchFiles = async () => {
    try { setFiles(await getPmFilesAPI()); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const columns = useMemo<ColumnDef<any>[]>(() => [
    { key: "filename", header: "File Name" },
    { key: "project_id", header: "Project" },
    { key: "uploaded_by", header: "Uploaded By" },
    { 
      key: "created_at", 
      header: "Date",
      render: (p) => p.created_at ? new Date(p.created_at).toLocaleDateString() : "N/A"
    },
    { 
      key: "actions", 
      header: "Actions",
      render: (p) => (
        <a href={p.file_url} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, color: "#10b981", fontWeight: 600, fontSize: 13, textDecoration: "none" }}>
          <Download size={14} /> Download
        </a>
      )
    }
  ], []);

  const formFields: ModalField[] = [
    { name: "filename", label: "File Name", type: "text", required: true },
    { name: "project_id", label: "Project ID", type: "text", required: true },
    { name: "file_url", label: "File URL", type: "text", required: true },
  ];

  const handleAdd = async (data: any) => {
    try {
      const res = await authFetch("/pm/files", {
        method: "POST",
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to upload file");
      toast.success("File uploaded successfully");
      fetchFiles();
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin" size={40} color="#64748b" /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <div><h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>Project Files</h2><p style={{ color: "#94a3b8", fontSize: 14 }}>Enterprise document repository.</p></div>
        <button onClick={() => setShowAddModal(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "#38bdf8", border: "none", color: "#000", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
          <UploadCloud size={16} /> Upload File
        </button>
      </div>
      
      <AdminTable data={files} columns={columns} searchPlaceholder="Search files..." />

      <DynamicAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Upload File"
        fields={formFields}
        onSubmit={handleAdd}
        submitText="Upload"
      />
    </motion.div>
  );
};

export default PMFiles;
