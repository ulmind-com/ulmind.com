/* ──────────────────────────────────────────────────────────────
   Shared CRM helpers
   ----------------------------------------------------------------
   Every CRM section needs the same three things: the client list for
   a picker, a way to turn a stored client_id into a readable name,
   and a consistent ₹ formatter. Keeping them here is what makes the
   sections link to each other instead of showing raw ObjectIds.
   ────────────────────────────────────────────────────────────── */

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getClientsAPI, Client } from "../../lib/api";
import { ModalField } from "../../components/DynamicAddModal";

export const useCrmClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getClientsAPI()
      .then((data) => { if (!cancelled) setClients(data); })
      .catch((err) => console.error("Failed to load clients for CRM linking:", err))
      .finally(() => { if (!cancelled) setLoadingClients(false); });
    return () => { cancelled = true; };
  }, []);

  const clientsById = useMemo(() => {
    const map = new Map<string, Client>();
    clients.forEach((c) => map.set(c._id, c));
    return map;
  }, [clients]);

  /** Dropdown options for the "Client" field on every add/edit modal. */
  const clientOptions = useMemo(
    () => clients
      .slice()
      .sort((a, b) => a.companyName.localeCompare(b.companyName))
      .map((c) => ({ label: c.companyName, value: c._id })),
    [clients]
  );

  const clientField = (required = false): ModalField => ({
    name: "client_id",
    label: required ? "Client" : "Client (optional)",
    type: "select",
    required,
    options: clientOptions,
  });

  return { clients, clientsById, clientOptions, clientField, loadingClients };
};

/** Renders a client_id as a link through to that client's CRM profile. */
export const ClientCell: React.FC<{
  clientId?: string | null;
  clientsById: Map<string, Client>;
}> = ({ clientId, clientsById }) => {
  if (!clientId) return <span style={{ color: "#64748b" }}>—</span>;
  const client = clientsById.get(clientId);
  if (!client) {
    // The client was deleted but the record still points at it.
    return <span style={{ color: "#64748b", fontSize: 12 }} title={clientId}>Unknown client</span>;
  }
  return (
    <Link
      to={`/admin/crm/clients/${clientId}`}
      style={{ color: "#38bdf8", fontWeight: 600, textDecoration: "none" }}
    >
      {client.companyName}
    </Link>
  );
};

export const formatINR = (value?: number | null) =>
  `₹${Number(value ?? 0).toLocaleString("en-IN")}`;

export const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const d = new Date(value);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-IN");
};

export const formatDateTime = (value?: string | null) => {
  if (!value) return "—";
  const d = new Date(value);
  return isNaN(d.getTime()) ? "—" : d.toLocaleString("en-IN");
};

/** Legacy rows use "Pending"/"Active"; newer ones use lowercase. Compare safely. */
export const badgeClassFor = (status?: string | null) => {
  const s = (status || "").toLowerCase();
  if (["active", "completed", "paid", "won", "signed"].includes(s)) return "admin-badge-success";
  if (["expired", "cancelled", "overdue", "closed lost", "lost"].includes(s)) return "admin-badge-danger";
  if (["pending", "scheduled", "negotiation", "proposal sent"].includes(s)) return "admin-badge-warning";
  return "admin-badge-info";
};

/** Drop keys the API would reject and blank optional values, so a partial
 *  edit never overwrites a stored field with "". */
export const cleanPayload = (data: Record<string, any>, allowed?: string[]) => {
  const out: Record<string, any> = {};
  Object.entries(data).forEach(([k, v]) => {
    if (allowed && !allowed.includes(k)) return;
    if (v === "" || v === undefined || v === null) return;
    out[k] = v;
  });
  return out;
};
