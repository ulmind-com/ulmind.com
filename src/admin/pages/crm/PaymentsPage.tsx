/* ──────────────────────────────────────────────────────────────
   CRM → Payments
   ----------------------------------------------------------------
   Payments recorded against invoices. Older rows carry no client_id,
   so the client is resolved through the payment's invoice — that is
   what links this page back to the rest of the CRM.
   ────────────────────────────────────────────────────────────── */

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Loader2, Filter, ExternalLink } from "lucide-react";
import { getPaymentsAPI, getInvoicesAPI } from "../../lib/api";
import { AdminTable, ColumnDef } from "../../components/AdminTable";
import { useCrmClients, ClientCell, formatINR, formatDate } from "./useCrmClients";

const PaymentsPage: React.FC = () => {
  const { clientsById, clientOptions } = useCrmClients();
  const [payments, setPayments] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientFilter, setClientFilter] = useState("");

  useEffect(() => {
    Promise.all([getPaymentsAPI(), getInvoicesAPI()])
      .then(([p, i]) => {
        setPayments(Array.isArray(p) ? p : []);
        setInvoices(Array.isArray(i) ? i : []);
      })
      .catch((err) => { console.error(err); setError(err.message || "Failed to load payments"); })
      .finally(() => setLoading(false));
  }, []);

  /** invoice _id → {invoice_number, client_id} so a payment can name its client. */
  const invoicesById = useMemo(() => {
    const map = new Map<string, any>();
    invoices.forEach((i) => map.set(i._id, i));
    return map;
  }, [invoices]);

  const resolveClientId = (payment: any) =>
    payment.client_id || invoicesById.get(payment.invoice_id)?.client_id || null;

  const visible = useMemo(
    () => (clientFilter ? payments.filter((p) => resolveClientId(p) === clientFilter) : payments),
    [payments, clientFilter, invoicesById]
  );

  const total = useMemo(
    () => visible.reduce((t, p) => t + (p.amount || 0), 0),
    [visible]
  );

  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      key: "client",
      header: "Client",
      render: (row) => <ClientCell clientId={resolveClientId(row)} clientsById={clientsById} />,
    },
    {
      key: "invoice_id",
      header: "Invoice",
      render: (row) => {
        const inv = invoicesById.get(row.invoice_id);
        return inv?.invoice_number
          ? <span style={{ color: "#e2e8f0" }}>{inv.invoice_number}</span>
          : <span style={{ color: "#64748b" }}>—</span>;
      },
    },
    { key: "amount", header: "Amount", render: (row) => <span style={{ color: "#10b981", fontWeight: 600 }}>{formatINR(row.amount)}</span> },
    {
      key: "payment_method",
      header: "Method",
      render: (row) => (
        <span className="admin-badge admin-badge-info" style={{ textTransform: "capitalize" }}>
          {(row.payment_method || "unknown").replace(/_/g, " ")}
        </span>
      ),
    },
    { key: "reference_number", header: "Reference", render: (row) => row.reference_number || "—" },
    { key: "payment_date", header: "Paid On", render: (row) => formatDate(row.payment_date || row.created_at) },
  ], [clientsById, invoicesById]);

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin text-slate-500" size={40} /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>
            Payments
            <span className="admin-badge admin-badge-primary" style={{ fontSize: 12, marginLeft: 12 }}>{visible.length}</span>
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 14 }}>
            Received against client invoices — {formatINR(total)} collected.
          </p>
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
          <Link
            to="/admin/finance/payments"
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

      {visible.length === 0 && !error ? (
        <div className="admin-glass-panel" style={{ padding: 48, textAlign: "center", color: "#64748b" }}>
          No payments recorded yet.
        </div>
      ) : (
        <AdminTable data={visible} columns={columns} searchPlaceholder="Search payments..." />
      )}
    </motion.div>
  );
};

export default PaymentsPage;
