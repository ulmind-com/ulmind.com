/* ──────────────────────────────────────────────────────────────
   CRM → Invoices
   ----------------------------------------------------------------
   Reads the same `invoices` collection the Finance module uses, but
   presented client-first: every row links back to the CRM profile,
   and the list can be narrowed to a single client.
   ────────────────────────────────────────────────────────────── */

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Loader2, Filter, ExternalLink } from "lucide-react";
import { getInvoicesAPI } from "../../lib/api";
import { AdminTable, ColumnDef } from "../../components/AdminTable";
import { useCrmClients, ClientCell, formatINR, formatDate, badgeClassFor } from "./useCrmClients";

const InvoicesPage: React.FC = () => {
  const { clientsById, clientOptions } = useCrmClients();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientFilter, setClientFilter] = useState("");

  useEffect(() => {
    getInvoicesAPI()
      .then((data) => setInvoices(Array.isArray(data) ? data : []))
      .catch((err) => { console.error(err); setError(err.message || "Failed to load invoices"); })
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(
    () => (clientFilter ? invoices.filter((i) => i.client_id === clientFilter) : invoices),
    [invoices, clientFilter]
  );

  const totals = useMemo(() => {
    const sum = (pred: (i: any) => boolean) =>
      visible.filter(pred).reduce((t, i) => t + (i.total || 0), 0);
    return {
      all: sum(() => true),
      paid: sum((i) => (i.status || "").toLowerCase() === "paid"),
      outstanding: sum((i) => ["pending", "overdue"].includes((i.status || "").toLowerCase())),
    };
  }, [visible]);

  const columns = useMemo<ColumnDef<any>[]>(() => [
    { key: "invoice_number", header: "Invoice #", render: (row) => row.invoice_number || "—" },
    { key: "client_id", header: "Client", render: (row) => <ClientCell clientId={row.client_id} clientsById={clientsById} /> },
    { key: "total", header: "Total", render: (row) => formatINR(row.total) },
    { key: "subtotal", header: "Subtotal", render: (row) => formatINR(row.subtotal) },
    { key: "tax", header: "Tax", render: (row) => formatINR(row.tax) },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span className={`admin-badge ${badgeClassFor(row.status)}`} style={{ textTransform: "capitalize" }}>
          {row.status || "pending"}
        </span>
      ),
    },
    { key: "due_date", header: "Due", render: (row) => formatDate(row.due_date) },
  ], [clientsById]);

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin text-slate-500" size={40} /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>
            Invoices
            <span className="admin-badge admin-badge-primary" style={{ fontSize: 12, marginLeft: 12 }}>{visible.length}</span>
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 14 }}>Billing raised against CRM clients.</p>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Filter size={14} color="#64748b" />
            <select
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px", color: "#fff", fontSize: 13, outline: "none" }}
            >
              <option value="">All clients</option>
              {clientOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          {/* Creating/editing invoices lives in the Finance module. */}
          <Link
            to="/admin/finance/invoices"
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}
          >
            <ExternalLink size={14} /> Manage in Finance
          </Link>
        </div>
      </div>

      {error && (
        <div style={{ padding: "12px 16px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, color: "#fca5a5", fontSize: 13, marginBottom: 16 }}>
          {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        <Tile label="Total Billed" value={formatINR(totals.all)} color="#38bdf8" />
        <Tile label="Paid" value={formatINR(totals.paid)} color="#10b981" />
        <Tile label="Outstanding" value={formatINR(totals.outstanding)} color="#f59e0b" />
      </div>

      {visible.length === 0 && !error ? (
        <div className="admin-glass-panel" style={{ padding: 48, textAlign: "center", color: "#64748b" }}>
          No invoices found.
        </div>
      ) : (
        <AdminTable data={visible} columns={columns} searchPlaceholder="Search invoices..." />
      )}
    </motion.div>
  );
};

const Tile: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className="admin-glass-panel" style={{ padding: 20 }}>
    <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 8 }}>{label}</div>
    <div style={{ color, fontSize: 22, fontWeight: 700 }}>{value}</div>
  </div>
);

export default InvoicesPage;
