import React, { useMemo } from "react";
import { ColumnDef } from "../../components/AdminTable";
import { CrmRecordSection } from "./CrmRecordSection";
import { formatDateTime, badgeClassFor } from "./useCrmClients";

const MeetingsPage: React.FC = () => {
  const columns = useMemo<ColumnDef<any>[]>(() => [
    { key: "title", header: "Meeting Title" },
    { key: "integration", header: "Platform", render: (row) => row.integration || "—" },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span className={`admin-badge ${badgeClassFor(row.status)}`} style={{ textTransform: "capitalize" }}>
          {row.status || "scheduled"}
        </span>
      ),
    },
    { key: "date", header: "Scheduled For", render: (row) => formatDateTime(row.date) },
    {
      key: "agenda",
      header: "Agenda / Notes",
      render: (row) => (
        <div style={{ maxWidth: 320, whiteSpace: "pre-wrap", color: "#cbd5e1" }}>
          {row.agenda || row.notes || "—"}
        </div>
      ),
    },
  ], []);

  return (
    <CrmRecordSection
      resource="meetings"
      title="Meeting Notes"
      subtitle="Schedule and track all enterprise meetings."
      addLabel="Schedule Meeting"
      searchPlaceholder="Search meetings..."
      columns={columns}
      writableFields={["client_id", "title", "date", "integration", "meeting_link", "status", "agenda"]}
      fields={({ clientField }) => [
        clientField(false),
        { name: "title", label: "Meeting Title", type: "text", required: true },
        { name: "date", label: "Date", type: "date", required: true },
        {
          name: "integration", label: "Platform", type: "select",
          options: [
            { label: "Google Meet", value: "Google Meet" },
            { label: "Zoom", value: "Zoom" },
            { label: "Microsoft Teams", value: "Teams" },
            { label: "Phone Call", value: "Phone Call" },
            { label: "In Person", value: "In Person" },
          ],
        },
        { name: "meeting_link", label: "Meeting Link", type: "text" },
        {
          name: "status", label: "Status", type: "select", defaultValue: "scheduled",
          options: [
            { label: "Scheduled", value: "scheduled" },
            { label: "Completed", value: "completed" },
            { label: "Cancelled", value: "cancelled" },
          ],
        },
        { name: "agenda", label: "Agenda / Notes", type: "textarea" },
      ]}
    />
  );
};

export default MeetingsPage;
