/* ──────────────────────────────────────────────────────────────
   Client profile tab definitions
   ----------------------------------------------------------------
   A client's records live in two places:
     • the standalone CRM collections (crm_contracts, crm_meetings,
       crm_documents, crm_activities, invoices) keyed by client_id
     • legacy arrays inside the client document itself (crm_data.*)
   Older data sits in the second. Rather than migrate — and risk
   losing it — each tab reads BOTH and normalises them into one
   shape, so the profile finally shows everything that exists.
   New records are written to the collection when the tab has one.
   ────────────────────────────────────────────────────────────── */

import React from "react";
import { ModalField } from "../../components/DynamicAddModal";
import { CrmResource } from "../../lib/api";
import { formatINR, formatDate, formatDateTime, badgeClassFor } from "./useCrmClients";

/** Where a merged row came from — decides which API edits/deletes it. */
export type RowSource = "collection" | "legacy";

export interface MergedRow {
  __source: RowSource;
  __id: string;          // collection _id, or the crm_data item id
  [key: string]: any;
}

export interface TabConfig {
  label: string;
  /** Key inside client.crm_data holding the legacy array. */
  fieldKey: string;
  /** Collection this tab writes to; null means crm_data only. */
  resource: CrmResource | null;
  /** Extra data the tab needs that isn't a CrmResource (invoices). */
  external?: "invoices";
  addLabel: string;
  fields: ModalField[];
  /** Field names the collection API accepts. */
  writableFields: string[];
  columns: { key: string; header: string; render?: (row: MergedRow) => React.ReactNode }[];
  /** Map a legacy crm_data item onto the canonical shape. */
  fromLegacy: (item: any) => Record<string, any>;
}

const statusBadge = (row: MergedRow) => (
  <span className={`admin-badge ${badgeClassFor(row.status)}`} style={{ textTransform: "capitalize" }}>
    {row.status || "—"}
  </span>
);

const fileLink = (row: MergedRow) =>
  row.file_url
    ? <a href={row.file_url} target="_blank" rel="noreferrer" style={{ color: "#38bdf8" }}>View</a>
    : <span style={{ color: "#64748b" }}>—</span>;

export const TAB_CONFIGS: Record<string, TabConfig> = {
  contacts: {
    label: "Contacts",
    fieldKey: "contacts",
    resource: null,
    addLabel: "Add Contact",
    writableFields: ["name", "email", "phone", "role"],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "phone", label: "Phone", type: "text" },
      { name: "role", label: "Role", type: "text", required: true },
    ],
    columns: [
      { key: "name", header: "Name" },
      { key: "email", header: "Email" },
      { key: "phone", header: "Phone", render: (r) => r.phone || "—" },
      { key: "role", header: "Role" },
      { key: "created_at", header: "Added On", render: (r) => formatDate(r.created_at) },
    ],
    fromLegacy: (i) => i,
  },

  projects: {
    label: "Projects",
    fieldKey: "projects",
    resource: null,
    addLabel: "Add Project",
    writableFields: ["name", "status", "deadline"],
    fields: [
      { name: "name", label: "Project Name", type: "text", required: true },
      {
        name: "status", label: "Status", type: "select", required: true, defaultValue: "Active",
        options: [
          { label: "Active", value: "Active" },
          { label: "Completed", value: "Completed" },
          { label: "On Hold", value: "On Hold" },
        ],
      },
      { name: "deadline", label: "Deadline", type: "date" },
    ],
    columns: [
      { key: "name", header: "Project Name" },
      { key: "status", header: "Status", render: statusBadge },
      { key: "deadline", header: "Deadline", render: (r) => formatDate(r.deadline) },
    ],
    fromLegacy: (i) => i,
  },

  invoices: {
    label: "Invoices",
    fieldKey: "invoices",
    resource: null,
    external: "invoices",
    addLabel: "Add Invoice",
    writableFields: ["invoice_number", "amount", "status", "due_date"],
    fields: [
      { name: "invoice_number", label: "Invoice Number", type: "text", required: true },
      { name: "amount", label: "Amount (₹)", type: "number", required: true },
      {
        name: "status", label: "Status", type: "select", required: true, defaultValue: "Pending",
        options: [
          { label: "Paid", value: "Paid" },
          { label: "Pending", value: "Pending" },
          { label: "Overdue", value: "Overdue" },
        ],
      },
      { name: "due_date", label: "Due Date", type: "date", required: true },
    ],
    columns: [
      { key: "invoice_number", header: "Invoice #", render: (r) => r.invoice_number || "—" },
      { key: "amount", header: "Amount", render: (r) => formatINR(r.amount) },
      { key: "status", header: "Status", render: statusBadge },
      { key: "due_date", header: "Due Date", render: (r) => formatDate(r.due_date) },
    ],
    fromLegacy: (i) => i,
  },

  contracts: {
    label: "Contracts",
    fieldKey: "contracts",
    resource: "contracts",
    addLabel: "Add Contract",
    writableFields: ["title", "contract_number", "value", "start_date", "end_date", "status", "file_url"],
    fields: [
      { name: "title", label: "Contract Title", type: "text", required: true },
      { name: "contract_number", label: "Contract Number", type: "text" },
      { name: "value", label: "Value (₹)", type: "number", defaultValue: 0 },
      { name: "start_date", label: "Start Date", type: "date", required: true },
      { name: "end_date", label: "End Date", type: "date" },
      {
        name: "status", label: "Status", type: "select", required: true, defaultValue: "pending",
        options: [
          { label: "Pending", value: "pending" },
          { label: "Active", value: "active" },
          { label: "Expired", value: "expired" },
        ],
      },
      { name: "file_url", label: "File URL", type: "text" },
    ],
    columns: [
      { key: "title", header: "Title" },
      { key: "value", header: "Value", render: (r) => formatINR(r.value) },
      { key: "status", header: "Status", render: statusBadge },
      { key: "end_date", header: "Expires", render: (r) => formatDate(r.end_date) },
      { key: "file_url", header: "Link", render: fileLink },
    ],
    // Legacy contracts stored the expiry under expires_at and had no value.
    fromLegacy: (i) => ({
      ...i,
      value: i.value ?? 0,
      start_date: i.start_date ?? i.created_at,
      end_date: i.end_date ?? i.expires_at,
    }),
  },

  documents: {
    label: "Documents",
    fieldKey: "documents",
    resource: "documents",
    addLabel: "Add Document",
    writableFields: ["title", "folder", "file_url", "size_bytes"],
    fields: [
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
      { name: "file_url", label: "File URL", type: "text", required: true },
    ],
    columns: [
      { key: "title", header: "Title" },
      { key: "folder", header: "Folder", render: (r) => r.folder || "Other Files" },
      { key: "created_at", header: "Uploaded On", render: (r) => formatDate(r.created_at) },
      { key: "file_url", header: "Link", render: fileLink },
    ],
    fromLegacy: (i) => ({ ...i, folder: i.folder ?? "Other Files" }),
  },

  meetings: {
    label: "Meetings",
    fieldKey: "meetings",
    resource: "meetings",
    addLabel: "Add Meeting",
    writableFields: ["title", "date", "status", "agenda", "integration", "meeting_link"],
    fields: [
      { name: "title", label: "Meeting Title", type: "text", required: true },
      { name: "date", label: "Date", type: "date", required: true },
      {
        name: "status", label: "Status", type: "select", required: true, defaultValue: "scheduled",
        options: [
          { label: "Scheduled", value: "scheduled" },
          { label: "Completed", value: "completed" },
          { label: "Cancelled", value: "cancelled" },
        ],
      },
      { name: "agenda", label: "Agenda / Notes", type: "textarea" },
    ],
    columns: [
      { key: "title", header: "Title" },
      { key: "date", header: "Date", render: (r) => formatDateTime(r.date) },
      { key: "status", header: "Status", render: statusBadge },
      {
        key: "agenda", header: "Notes",
        render: (r) => <div style={{ maxWidth: 320, whiteSpace: "pre-wrap" }}>{r.agenda || "—"}</div>,
      },
    ],
    // Legacy meetings used scheduled_at + notes.
    fromLegacy: (i) => ({
      ...i,
      date: i.date ?? i.scheduled_at,
      agenda: i.agenda ?? i.notes,
      status: (i.status || "scheduled").toLowerCase(),
    }),
  },

  notes: {
    label: "Notes",
    fieldKey: "notes",
    resource: null,
    addLabel: "Add Note",
    writableFields: ["content"],
    fields: [
      { name: "content", label: "Note Content", type: "textarea", required: true },
    ],
    columns: [
      {
        key: "content", header: "Content",
        render: (r) => <div style={{ maxWidth: 460, whiteSpace: "pre-wrap" }}>{r.content}</div>,
      },
      { key: "author_id", header: "By", render: (r) => r.author_id || "—" },
      { key: "created_at", header: "Added On", render: (r) => formatDateTime(r.created_at) },
    ],
    fromLegacy: (i) => i,
  },

  activity: {
    label: "Activity Logs",
    fieldKey: "activity_logs",
    resource: "activities",
    addLabel: "Log Activity",
    writableFields: ["type", "content"],
    fields: [
      {
        name: "type", label: "Type", type: "select", required: true, defaultValue: "call",
        options: [
          { label: "Call", value: "call" },
          { label: "Email", value: "email" },
          { label: "WhatsApp", value: "whatsapp" },
          { label: "Meeting", value: "meeting" },
          { label: "Note", value: "note" },
        ],
      },
      { name: "content", label: "Description", type: "textarea", required: true },
    ],
    columns: [
      {
        key: "type", header: "Type",
        render: (r) => (
          <span className="admin-badge admin-badge-info" style={{ textTransform: "capitalize" }}>
            {r.type || "note"}
          </span>
        ),
      },
      {
        key: "content", header: "Description",
        render: (r) => <div style={{ maxWidth: 420, whiteSpace: "pre-wrap" }}>{r.content || "—"}</div>,
      },
      { key: "author_id", header: "By", render: (r) => r.author_id || "—" },
      { key: "created_at", header: "Timestamp", render: (r) => formatDateTime(r.created_at) },
    ],
    // Legacy activity_logs used action + description.
    fromLegacy: (i) => ({
      ...i,
      type: i.type ?? i.action,
      content: i.content ?? i.description,
    }),
  },
};

export const TAB_ORDER = ["contacts", "projects", "invoices", "contracts", "documents", "meetings", "notes", "activity"];
