import React, { useMemo } from "react";
import { useAuth } from "../../context/auth-context";
import { ColumnDef } from "../../components/AdminTable";
import { CrmRecordSection } from "./CrmRecordSection";
import { formatDateTime } from "./useCrmClients";

const ActivitiesPage: React.FC = () => {
  const { user } = useAuth();

  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      key: "type",
      header: "Type",
      render: (row) => (
        <span className="admin-badge admin-badge-info" style={{ textTransform: "capitalize" }}>
          {row.type || "note"}
        </span>
      ),
    },
    {
      key: "content",
      header: "Activity Content",
      render: (row) => (
        <div style={{ maxWidth: 420, whiteSpace: "pre-wrap" }}>{row.content || "—"}</div>
      ),
    },
    { key: "author_id", header: "Logged By", render: (row) => row.author_id || "—" },
    { key: "created_at", header: "Date", render: (row) => formatDateTime(row.created_at) },
  ], []);

  return (
    <CrmRecordSection
      resource="activities"
      title="Contact History"
      subtitle="Global log of all client interactions and internal notes."
      addLabel="Log Activity"
      searchPlaceholder="Search activities..."
      columns={columns}
      writableFields={["client_id", "type", "content"]}
      createDefaults={{ author_id: user?.full_name || user?.email || "admin" }}
      fields={({ clientField }) => [
        clientField(false),
        {
          name: "type", label: "Activity Type", type: "select", required: true,
          defaultValue: "call",
          options: [
            { label: "Call", value: "call" },
            { label: "Email", value: "email" },
            { label: "WhatsApp", value: "whatsapp" },
            { label: "Meeting", value: "meeting" },
            { label: "Note", value: "note" },
          ],
        },
        { name: "content", label: "Details", type: "textarea", required: true },
      ]}
    />
  );
};

export default ActivitiesPage;
