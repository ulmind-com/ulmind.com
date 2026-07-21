import React, { useMemo } from "react";
import { ColumnDef } from "../../components/AdminTable";
import { CrmRecordSection } from "./CrmRecordSection";
import { formatDate, formatINR, badgeClassFor } from "./useCrmClients";

const ContractsPage: React.FC = () => {
  const columns = useMemo<ColumnDef<any>[]>(() => [
    { key: "contract_number", header: "Contract #", render: (row) => row.contract_number || "—" },
    { key: "title", header: "Title" },
    { key: "value", header: "Value", render: (row) => formatINR(row.value) },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span className={`admin-badge ${badgeClassFor(row.status)}`} style={{ textTransform: "capitalize" }}>
          {row.status || "pending"}
        </span>
      ),
    },
    { key: "start_date", header: "Start Date", render: (row) => formatDate(row.start_date) },
    { key: "end_date", header: "End Date", render: (row) => formatDate(row.end_date) },
    {
      key: "file_url",
      header: "File",
      render: (row) => row.file_url
        ? <a href={row.file_url} target="_blank" rel="noreferrer" style={{ color: "#38bdf8" }}>View</a>
        : <span style={{ color: "#64748b" }}>—</span>,
    },
  ], []);

  return (
    <CrmRecordSection
      resource="contracts"
      title="Contract Management"
      subtitle="Active and historical client agreements."
      addLabel="New Contract"
      searchPlaceholder="Search contracts..."
      columns={columns}
      writableFields={["client_id", "title", "contract_number", "value", "start_date", "end_date", "status", "file_url"]}
      fields={({ clientField }) => [
        clientField(false),
        { name: "title", label: "Contract Title", type: "text", required: true },
        { name: "contract_number", label: "Contract Number", type: "text", required: true },
        { name: "value", label: "Value (₹)", type: "number", required: true, defaultValue: 0 },
        { name: "start_date", label: "Start Date", type: "date", required: true },
        { name: "end_date", label: "End Date", type: "date" },
        {
          name: "status", label: "Status", type: "select", defaultValue: "pending",
          options: [
            { label: "Pending", value: "pending" },
            { label: "Active", value: "active" },
            { label: "Expired", value: "expired" },
          ],
        },
        { name: "file_url", label: "Contract File URL", type: "text" },
      ]}
    />
  );
};

export default ContractsPage;
