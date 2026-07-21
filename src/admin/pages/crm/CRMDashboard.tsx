import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { getCrmDashboardAPI } from "../../lib/api";
import {
  Users, Activity, Loader2, Trophy, FileSignature, Calendar,
  History, FolderOpen, Download, IndianRupee, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { formatINR, formatDateTime } from "./useCrmClients";

const CRMDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      setStats(await getCrmDashboardAPI());
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load CRM stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  /** Export the live pipeline numbers as CSV — no server round-trip needed. */
  const handleGenerateReport = () => {
    if (!stats) return;
    const rows: string[][] = [
      ["ULMiND CRM Report"],
      ["Generated", new Date().toLocaleString("en-IN")],
      [],
      ["Metric", "Value"],
      ["Total leads", String(stats.total_leads ?? 0)],
      ["Total clients", String(stats.total_clients ?? 0)],
      ["Active clients", String(stats.active_clients ?? 0)],
      ["Pipeline revenue", String(stats.revenue ?? 0)],
      ["Contract value", String(stats.contract_value ?? 0)],
      ["Win rate %", String(stats.win_rate ?? 0)],
      ["Deals won", String(stats.won_count ?? 0)],
      ["Deals lost", String(stats.lost_count ?? 0)],
      [],
      ["Stage", "Deals", "Value"],
      ...(stats.pipeline_stats || []).map((s: any) => [
        String(s._id ?? "Unassigned"), String(s.count ?? 0), String(s.value ?? 0),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `crm-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("CRM report downloaded");
  };

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin text-slate-500" size={40} /></div>;
  }

  const maxStageValue = Math.max(
    1,
    ...((stats?.pipeline_stats || []).map((s: any) => s.value || 0))
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>CRM Overview</h2>
          <p style={{ fontSize: 14, color: "#94a3b8", marginTop: 4 }}>Enterprise performance and pipeline metrics.</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleGenerateReport} disabled={!stats}
          style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Download size={16} /> Generate Report
        </button>
      </div>

      {error && (
        <div style={{ padding: "12px 16px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, color: "#fca5a5", fontSize: 13, marginBottom: 20 }}>
          {error}
        </div>
      )}

      {/* ── Headline metrics ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 24 }}>
        <StatCard
          label="Total Leads" icon={<Users size={18} color="#38bdf8" />}
          value={stats?.total_leads ?? 0}
          sub={`${stats?.total_clients ?? 0} clients in total`}
          onClick={() => navigate("/admin/crm/pipeline")}
        />
        <StatCard
          label="Active Clients" icon={<Activity size={18} color="#10b981" />}
          value={stats?.active_clients ?? 0}
          sub="Currently marked Active"
          onClick={() => navigate("/admin/crm/clients")}
        />
        <StatCard
          label="Pipeline Revenue" icon={<IndianRupee size={18} color="#f59e0b" />}
          value={formatINR(stats?.revenue)}
          sub={`${formatINR(stats?.contract_value)} under contract`}
        />
        <StatCard
          label="Win Rate" icon={<Trophy size={18} color="#a78bfa" />}
          value={`${stats?.win_rate ?? 0}%`}
          sub={`${stats?.won_count ?? 0} won · ${stats?.lost_count ?? 0} lost`}
        />
      </div>

      {/* ── Every section reachable from here ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        <SectionLink to="/admin/crm/activities" icon={<History size={16} color="#38bdf8" />}
          label="Contact History" count={stats?.counts?.activities} />
        <SectionLink to="/admin/crm/meetings" icon={<Calendar size={16} color="#a78bfa" />}
          label="Meeting Notes" count={stats?.counts?.meetings} />
        <SectionLink to="/admin/crm/contracts" icon={<FileSignature size={16} color="#10b981" />}
          label="Contracts" count={stats?.counts?.contracts} />
        <SectionLink to="/admin/crm/documents" icon={<FolderOpen size={16} color="#f59e0b" />}
          label="Documents" count={stats?.counts?.documents} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
        {/* ── Pipeline by stage ── */}
        <div className="admin-glass-panel" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 20 }}>Pipeline Value by Stage</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {(stats?.pipeline_stats || []).map((stage: any) => (
              <div key={stage._id} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 130, fontSize: 13, color: "#cbd5e1" }}>
                  {stage._id} <span style={{ color: "#64748b" }}>({stage.count})</span>
                </div>
                <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{
                    width: `${Math.max(2, ((stage.value || 0) / maxStageValue) * 100)}%`,
                    height: "100%", background: "#38bdf8", borderRadius: 4, transition: "width 0.6s",
                  }} />
                </div>
                <div style={{ width: 110, fontSize: 13, fontWeight: 600, color: "#fff", textAlign: "right" }}>
                  {formatINR(stage.value)}
                </div>
              </div>
            ))}
            {(!stats?.pipeline_stats || stats.pipeline_stats.length === 0) && (
              <p style={{ color: "#64748b", fontSize: 14 }}>No active deals in pipeline.</p>
            )}
          </div>
        </div>

        {/* ── Upcoming meetings ── */}
        <div className="admin-glass-panel" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>Upcoming Meetings</h3>
            <Link to="/admin/crm/meetings" style={{ color: "#38bdf8", fontSize: 13, textDecoration: "none" }}>
              View all
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(stats?.upcoming_meetings || []).map((m: any) => (
              <div key={m._id} style={{ display: "flex", justifyContent: "space-between", gap: 12, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ color: "#e2e8f0", fontSize: 14 }}>{m.title}</span>
                <span style={{ color: "#94a3b8", fontSize: 12, whiteSpace: "nowrap" }}>{formatDateTime(m.date)}</span>
              </div>
            ))}
            {(!stats?.upcoming_meetings || stats.upcoming_meetings.length === 0) && (
              <p style={{ color: "#64748b", fontSize: 14 }}>Nothing scheduled ahead.</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StatCard: React.FC<{
  label: string; icon: React.ReactNode; value: React.ReactNode; sub?: string; onClick?: () => void;
}> = ({ label, icon, value, sub, onClick }) => (
  <div
    className="admin-glass-panel"
    onClick={onClick}
    style={{ padding: 24, cursor: onClick ? "pointer" : "default" }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
      <span style={{ color: "#94a3b8", fontSize: 14, fontWeight: 500 }}>{label}</span>
      {icon}
    </div>
    <h3 style={{ fontSize: 30, fontWeight: 700, color: "#fff" }}>{value}</h3>
    {sub && <p style={{ fontSize: 12, color: "#64748b", marginTop: 8 }}>{sub}</p>}
  </div>
);

const SectionLink: React.FC<{ to: string; icon: React.ReactNode; label: string; count?: number }> = ({
  to, icon, label, count,
}) => (
  <Link
    to={to}
    className="admin-glass-panel"
    style={{
      padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 12, textDecoration: "none",
    }}
  >
    <span style={{ display: "flex", alignItems: "center", gap: 10, color: "#e2e8f0", fontSize: 14, fontWeight: 500 }}>
      {icon} {label}
    </span>
    <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#64748b", fontSize: 13 }}>
      {count ?? 0} <ChevronRight size={14} />
    </span>
  </Link>
);

export default CRMDashboard;
