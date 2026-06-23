import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { getClientsAPI, Client, authFetch } from "../../lib/api";
import { Loader2, Download, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AdminTable, ColumnDef } from "../../components/AdminTable";
import { DynamicAddModal, ModalField } from "../../components/DynamicAddModal";
import { toast } from "sonner";

const DirectoryPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const data = await getClientsAPI();
      setClients(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo<ColumnDef<Client>[]>(() => [
    { key: "companyName", header: "Client Name" },
    { key: "contactEmail", header: "Email" },
    { key: "phone", header: "Phone" },
    { key: "industry", header: "Industry" },
    { 
      key: "revenue", 
      header: "Revenue",
      render: (client) => client.revenue ? `₹${client.revenue.toLocaleString()}` : "₹0"
    },
    { 
      key: "crm_data.stage", 
      header: "Pipeline Stage",
      render: (client) => {
        const stage = client.crm_data?.stage || "Lead";
        let colorClass = "admin-badge-info";
        if (stage === "Won" || stage === "Active Client") colorClass = "admin-badge-success";
        if (stage === "Closed Lost") colorClass = "admin-badge-danger";
        if (stage === "Negotiation" || stage === "Proposal Sent") colorClass = "admin-badge-warning";
        return <span className={`admin-badge ${colorClass}`}>{stage}</span>;
      }
    },
    { key: "status", header: "Status" },
    {
      key: "actions",
      header: "Actions",
      render: (client) => (
        <button 
          onClick={() => navigate(`/admin/crm/clients/${client._id}`)}
          style={{ background: "rgba(56, 189, 248, 0.1)", border: "1px solid rgba(56, 189, 248, 0.2)", color: "#38bdf8", cursor: "pointer", fontWeight: 600, fontSize: 12, padding: "6px 12px", borderRadius: 6 }}
        >
          View Profile
        </button>
      )
    }
  ], [navigate]);

  const clientFields: ModalField[] = [
    { name: "companyName", label: "Company Name", type: "text", required: true },
    { name: "contactName", label: "Contact Name", type: "text", required: true },
    { name: "contactEmail", label: "Email Address", type: "email", required: true },
    { name: "phone", label: "Phone Number", type: "text" },
    { name: "industry", label: "Industry", type: "text" },
    { name: "revenue", label: "Estimated Revenue (₹)", type: "number", defaultValue: 0 },
  ];

  const handleAddClient = async (data: any) => {
    try {
      const res = await authFetch("/clients/", {
        method: "POST",
        body: JSON.stringify({ ...data, status: "Active" })
      });
      if (!res.ok) throw new Error("Failed to create client");
      toast.success("Client added successfully");
      fetchClients();
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Client Name", "Email", "Phone", "Industry", "Revenue", "Stage", "Status"];
    const csvContent = [
      headers.join(","),
      ...clients.map(c => [
        `"${c.companyName}"`,
        `"${c.contactEmail}"`,
        `"${c.phone || ''}"`,
        `"${c.industry || ''}"`,
        c.revenue || 0,
        `"${c.crm_data?.stage || 'Lead'}"`,
        `"${c.status || 'Active'}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "client_directory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin text-slate-500" size={40} /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h3 style={{ fontSize: 24, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 12 }}>
          Client Directory
          <span className="admin-badge admin-badge-primary" style={{ fontSize: 12 }}>{clients.length} Clients</span>
        </h3>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={handleExportCSV} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            <Download size={16} /> Export CSV
          </button>
          <button onClick={() => setShowAddModal(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "#38bdf8", border: "none", color: "#000", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
            <Plus size={16} /> Add Client
          </button>
        </div>
      </div>

      <AdminTable data={clients} columns={columns} />

      <DynamicAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Client"
        fields={clientFields}
        onSubmit={handleAddClient}
        submitText="Create Client"
      />
    </motion.div>
  );
};

export default DirectoryPage;
