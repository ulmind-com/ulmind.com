import React, { useMemo } from "react";
import { FolderOpen, Download } from "lucide-react";
import { ColumnDef } from "../../components/AdminTable";
import { CrmRecordSection } from "./CrmRecordSection";
import { formatDateTime } from "./useCrmClients";

/** Older rows have no size recorded — show a dash rather than "NaN MB". */
const formatSize = (bytes?: number) => {
  if (!bytes || bytes <= 0) return "—";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

const DocumentsPage: React.FC = () => {
  const columns = useMemo<ColumnDef<any>[]>(() => [
    { key: "title", header: "Document Title" },
    {
      key: "folder",
      header: "Folder",
      render: (row) => (
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FolderOpen size={14} color="#38bdf8" /> {row.folder || "Other Files"}
        </span>
      ),
    },
    { key: "size_bytes", header: "Size", render: (row) => formatSize(row.size_bytes) },
    { key: "uploaded_by", header: "Uploaded By", render: (row) => row.uploaded_by || "—" },
    { key: "created_at", header: "Date", render: (row) => formatDateTime(row.created_at) },
    {
      key: "file_url",
      header: "File",
      render: (row) => row.file_url
        ? (
          <a
            href={row.file_url}
            target="_blank"
            rel="noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 6, color: "#10b981", fontWeight: 600, fontSize: 13, textDecoration: "none" }}
          >
            <Download size={14} /> Open
          </a>
        )
        : <span style={{ color: "#64748b" }}>—</span>,
    },
  ], []);

  return (
    <CrmRecordSection
      resource="documents"
      title="Client Documents"
      subtitle="Secure enterprise file repository."
      addLabel="Add Document"
      searchPlaceholder="Search documents..."
      columns={columns}
      writableFields={["client_id", "title", "folder", "file_url", "size_bytes"]}
      fields={({ clientField }) => [
        clientField(false),
        { name: "title", label: "Document Title", type: "text", required: true },
        {
          name: "folder", label: "Folder", type: "select", required: true, defaultValue: "Other Files",
          options: [
            { label: "Contracts", value: "Contracts" },
            { label: "Invoices", value: "Invoices" },
            { label: "Proposals", value: "Proposals" },
            { label: "Presentations", value: "Presentations" },
            { label: "Legal Documents", value: "Legal Documents" },
            { label: "Other Files", value: "Other Files" },
          ],
        },
        // File hosting isn't wired up yet, so documents are referenced by URL.
        { name: "file_url", label: "Document URL", type: "text", required: true, placeholder: "https://..." },
        { name: "size_bytes", label: "Size in bytes (optional)", type: "number" },
      ]}
    />
  );
};

export default DocumentsPage;
