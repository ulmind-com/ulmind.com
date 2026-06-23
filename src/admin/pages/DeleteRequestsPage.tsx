import React, { useState, useEffect } from "react";
import { Loader2, ShieldAlert, CheckCircle, XCircle } from "lucide-react";
import { getDeleteRequestsAPI, updateDeleteRequestStatusAPI, DeleteRequest } from "../lib/api";
import { useAdminAction } from "../context/AdminActionContext";

const DeleteRequestsPage: React.FC = () => {
  const { triggerActionAnimation } = useAdminAction();
  const [requests, setRequests] = useState<DeleteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getDeleteRequestsAPI("pending");
      setRequests(res.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load delete requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    if (!window.confirm(`Are you sure you want to ${status === "approved" ? "approve and delete this item" : "reject this request"}?`)) return;
    setProcessingId(id);
    try {
      await updateDeleteRequestStatusAPI(id, status);
      await fetchRequests();
      triggerActionAnimation();
    } catch (err: any) {
      alert(err.message || "Failed to update request status");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: "var(--admin-text)" }}>Delete Requests</h2>
        <p style={{ fontSize: 14, color: "var(--admin-text-dim)", marginTop: 6 }}>
          Review and approve deletion requests from editors.
        </p>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 64 }}>
          <Loader2 size={32} className="animate-spin" />
        </div>
      ) : error ? (
        <div style={{ padding: 24, background: "rgba(225,29,72,0.1)", color: "#f87171", borderRadius: 12 }}>
          {error}
        </div>
      ) : requests.length === 0 ? (
        <div className="admin-card" style={{ padding: "64px 32px", textAlign: "center" }}>
          <ShieldAlert size={48} style={{ margin: "0 auto 16px", color: "var(--admin-text-dim)", opacity: 0.4 }} />
          <h3 style={{ fontSize: 18, color: "var(--admin-text)", fontWeight: 600 }}>No Pending Requests</h3>
          <p style={{ color: "var(--admin-text-dim)", fontSize: 14, marginTop: 8 }}>All caught up! No deletion requests require your approval.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {requests.map(req => (
            <div key={req._id} className="admin-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 20 }}>
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 600, color: "var(--admin-text)", marginBottom: 4 }}>
                  {req.item_type}: <span style={{ color: "var(--admin-accent)" }}>{req.item_description}</span>
                </h4>
                <p style={{ fontSize: 13, color: "var(--admin-text-dim)", marginTop: 8 }}>
                  Requested by <strong>{req.user_name}</strong> ({req.user_email})
                </p>
                <p style={{ fontSize: 12, color: "var(--admin-text-muted)", marginTop: 4 }}>
                  on {new Date(req.created_at).toLocaleString()}
                </p>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={() => handleAction(req._id, "rejected")}
                  disabled={processingId === req._id}
                  style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
                    background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)",
                    borderRadius: 8, cursor: processingId ? "not-allowed" : "pointer", fontWeight: 600, fontSize: 13
                  }}
                >
                  <XCircle size={16} /> Reject
                </button>
                <button
                  onClick={() => handleAction(req._id, "approved")}
                  disabled={processingId === req._id}
                  style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
                    background: "rgba(16,185,129,0.1)", color: "#34d399", border: "1px solid rgba(16,185,129,0.2)",
                    borderRadius: 8, cursor: processingId ? "not-allowed" : "pointer", fontWeight: 600, fontSize: 13
                  }}
                >
                  {processingId === req._id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                  Approve & Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeleteRequestsPage;
