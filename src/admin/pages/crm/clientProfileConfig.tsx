import React from "react";
import { ModalField } from "../../components/DynamicAddModal";
import { Edit } from "lucide-react";

export const getTabConfigs = (onEdit: (item: any) => void): Record<string, {
  title: string;
  fieldKey: string;
  fields: ModalField[];
  columns: { key: string, header: string, render?: (item: any) => React.ReactNode }[];
}> => {
  const configs: Record<string, {
    title: string;
    fieldKey: string;
    fields: ModalField[];
    columns: { key: string, header: string, render?: (item: any) => React.ReactNode }[];
  }> = {
    contacts: {
    title: "Add Contact",
    fieldKey: "contacts",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "phone", label: "Phone", type: "text" },
      { name: "role", label: "Role", type: "text", required: true },
    ],
    columns: [
      { key: "name", header: "Name" },
      { key: "email", header: "Email" },
      { key: "phone", header: "Phone" },
      { key: "role", header: "Role" },
      { key: "created_at", header: "Added On", render: (item) => new Date(item.created_at).toLocaleDateString() },
    ]
  },
  projects: {
    title: "Add Project",
    fieldKey: "projects",
    fields: [
      { name: "name", label: "Project Name", type: "text", required: true },
      { name: "status", label: "Status", type: "select", options: [{label: "Active", value: "Active"}, {label: "Completed", value: "Completed"}, {label: "On Hold", value: "On Hold"}], required: true },
      { name: "deadline", label: "Deadline", type: "date" },
    ],
    columns: [
      { key: "name", header: "Project Name" },
      { key: "status", header: "Status", render: (item) => <span className={`admin-badge ${item.status === 'Active' ? 'admin-badge-success' : item.status === 'Completed' ? 'admin-badge-info' : 'admin-badge-warning'}`}>{item.status}</span> },
      { key: "deadline", header: "Deadline", render: (item) => item.deadline ? new Date(item.deadline).toLocaleDateString() : "No Deadline" },
    ]
  },
  invoices: {
    title: "Add Invoice",
    fieldKey: "invoices",
    fields: [
      { name: "invoice_number", label: "Invoice Number", type: "text", required: true },
      { name: "amount", label: "Amount (₹)", type: "number", required: true },
      { name: "status", label: "Status", type: "select", options: [{label: "Paid", value: "Paid"}, {label: "Pending", value: "Pending"}, {label: "Overdue", value: "Overdue"}], required: true },
      { name: "due_date", label: "Due Date", type: "date", required: true },
    ],
    columns: [
      { key: "invoice_number", header: "Invoice Number" },
      { key: "amount", header: "Amount", render: (item) => `₹${item.amount.toLocaleString()}` },
      { key: "status", header: "Status", render: (item) => <span className={`admin-badge ${item.status === 'Paid' ? 'admin-badge-success' : item.status === 'Overdue' ? 'admin-badge-danger' : 'admin-badge-warning'}`}>{item.status}</span> },
      { key: "due_date", header: "Due Date", render: (item) => new Date(item.due_date).toLocaleDateString() },
    ]
  },
  contracts: {
    title: "Add Contract",
    fieldKey: "contracts",
    fields: [
      { name: "title", label: "Contract Title", type: "text", required: true },
      { name: "file_url", label: "File URL", type: "text", required: true },
      { name: "status", label: "Status", type: "select", options: [{label: "Active", value: "Active"}, {label: "Expired", value: "Expired"}, {label: "Pending", value: "Pending"}], required: true },
      { name: "expires_at", label: "Expiry Date", type: "date" },
    ],
    columns: [
      { key: "title", header: "Title" },
      { key: "status", header: "Status", render: (item) => <span className={`admin-badge ${item.status === 'Active' ? 'admin-badge-success' : item.status === 'Expired' ? 'admin-badge-danger' : 'admin-badge-warning'}`}>{item.status}</span> },
      { key: "expires_at", header: "Expiry Date", render: (item) => item.expires_at ? new Date(item.expires_at).toLocaleDateString() : "Never" },
      { key: "file_url", header: "Link", render: (item) => <a href={item.file_url} target="_blank" rel="noreferrer" style={{color: "#38bdf8"}}>View</a> },
    ]
  },
  documents: {
    title: "Add Document",
    fieldKey: "documents",
    fields: [
      { name: "title", label: "Document Title", type: "text", required: true },
      { name: "file_url", label: "File URL", type: "text", required: true },
    ],
    columns: [
      { key: "title", header: "Title" },
      { key: "created_at", header: "Uploaded On", render: (item) => new Date(item.created_at).toLocaleDateString() },
      { key: "file_url", header: "Link", render: (item) => <a href={item.file_url} target="_blank" rel="noreferrer" style={{color: "#38bdf8"}}>View</a> },
    ]
  },
  meetings: {
    title: "Add Meeting",
    fieldKey: "meetings",
    fields: [
      { name: "title", label: "Meeting Title", type: "text", required: true },
      { name: "scheduled_at", label: "Scheduled At", type: "date", required: true },
      { name: "status", label: "Status", type: "select", options: [{label: "Scheduled", value: "Scheduled"}, {label: "Completed", value: "Completed"}, {label: "Cancelled", value: "Cancelled"}], required: true },
      { name: "notes", label: "Notes", type: "textarea" },
    ],
    columns: [
      { key: "title", header: "Title" },
      { key: "scheduled_at", header: "Date", render: (item) => new Date(item.scheduled_at).toLocaleString() },
      { key: "status", header: "Status", render: (item) => <span className={`admin-badge ${item.status === 'Scheduled' ? 'admin-badge-info' : item.status === 'Completed' ? 'admin-badge-success' : 'admin-badge-danger'}`}>{item.status}</span> },
      { key: "notes", header: "Notes", render: (item) => item.notes || "-" },
    ]
  },
  notes: {
    title: "Add Note",
    fieldKey: "notes",
    fields: [
      { name: "content", label: "Note Content", type: "textarea", required: true },
    ],
    columns: [
      { key: "content", header: "Content", render: (item) => <div style={{maxWidth: 400, whiteSpace: "pre-wrap"}}>{item.content}</div> },
      { key: "created_at", header: "Added On", render: (item) => new Date(item.created_at).toLocaleString() },
    ]
  },
  activity: {
    title: "Add Activity Log",
    fieldKey: "activity_logs",
    fields: [
      { name: "action", label: "Action", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
    ],
    columns: [
      { key: "action", header: "Action", render: (item) => <span style={{fontWeight: 600, color: "#fff"}}>{item.action}</span> },
      { key: "description", header: "Description" },
      { key: "created_at", header: "Timestamp", render: (item) => new Date(item.created_at).toLocaleString() },
    ]
  }
};

  Object.keys(configs).forEach(key => {
    configs[key].columns.push({
      key: "actions",
      header: "Actions",
      render: (item) => (
        <button 
          onClick={() => onEdit(item)}
          style={{ background: "transparent", border: "none", color: "#38bdf8", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 4 }}
          title="Edit"
        >
          <Edit size={14} /> Edit
        </button>
      )
    });
  });

  return configs;
};
