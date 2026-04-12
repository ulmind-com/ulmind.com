/* ──────────────────────────────────────────────────────────────
   ULMiND Admin — Visitors Page
   Cookie/tracking data viewer with search, filters & expandable rows
   ────────────────────────────────────────────────────────────── */

import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  Search,
  ChevronDown,
  ChevronUp,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Wifi,
  Battery,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { getTrackingData } from "../lib/api";

/* ── Device Icon Mapper ───────────────────────────────────── */
const DeviceIcon = ({ platform }: { platform?: string }) => {
  const p = (platform || "").toLowerCase();
  if (p.includes("iphone") || p.includes("android") || p.includes("mobile"))
    return <Smartphone size={16} color="#f59e0b" />;
  if (p.includes("ipad") || p.includes("tablet"))
    return <Tablet size={16} color="#0ea5e9" />;
  return <Monitor size={16} color="#7c3aed" />;
};

/* ── Consent Badge ────────────────────────────────────────── */
const ConsentBadge = ({ status }: { status: string }) => {
  const s = (status || "").toLowerCase();
  if (s === "accepted")
    return <span className="admin-badge admin-badge-success">Accepted</span>;
  if (s === "declined")
    return <span className="admin-badge admin-badge-danger">Declined</span>;
  return <span className="admin-badge admin-badge-warning">Stealth</span>;
};

const VisitorsPage: React.FC = () => {
  const [visitors, setVisitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOS, setFilterOS] = useState("all");
  const [filterBrowser, setFilterBrowser] = useState("all");
  const [filterConsent, setFilterConsent] = useState("all");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const pageSize = 15;

  const fetchVisitors = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      const data = await getTrackingData();
      const list = Array.isArray(data) ? data : data.data || data.visitors || data.tracks || [];
      setVisitors(list);
    } catch (err: any) {
      setError(err.message || "Failed to load visitor data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  // Unique filter values
  const osList = useMemo(() => {
    const set = new Set(visitors.map((v: any) => v.os || "Unknown"));
    return ["all", ...Array.from(set)];
  }, [visitors]);

  const browserList = useMemo(() => {
    const set = new Set(visitors.map((v: any) => v.browser || "Unknown"));
    return ["all", ...Array.from(set)];
  }, [visitors]);

  // Filtered visitors
  const filtered = useMemo(() => {
    return visitors.filter((v: any) => {
      const matchSearch =
        !searchTerm ||
        (v.ip || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.browser || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.os || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.userAgent || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.timezone || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.language || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchOS = filterOS === "all" || v.os === filterOS;
      const matchBrowser = filterBrowser === "all" || v.browser === filterBrowser;
      const matchConsent = filterConsent === "all" || (v.consent_status || "").toLowerCase() === filterConsent;

      return matchSearch && matchOS && matchBrowser && matchConsent;
    });
  }, [visitors, searchTerm, filterOS, filterBrowser, filterConsent]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterOS, filterBrowser, filterConsent]);

  if (loading) {
    return (
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: "var(--admin-text)" }}>Visitors</h2>
        <div className="admin-skeleton" style={{ height: 60, borderRadius: 16, marginBottom: 20 }} />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="admin-skeleton" style={{ height: 48, borderRadius: 8, marginBottom: 8 }} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: "var(--admin-text)" }}>Visitors</h2>
        <div className="admin-card" style={{ textAlign: "center", padding: 48 }}>
          <p style={{ color: "var(--admin-rose)", fontSize: 15 }}>⚠️ {error}</p>
          <button className="admin-btn admin-btn-primary" style={{ marginTop: 16 }} onClick={() => fetchVisitors()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--admin-text)", fontFamily: "'Inter', sans-serif" }}>
            Visitor Tracking
          </h2>
          <p style={{ fontSize: 13, color: "var(--admin-text-dim)", marginTop: 4 }}>
            {filtered.length.toLocaleString()} visitors tracked •{" "}
            <span style={{ color: "var(--admin-text-muted)" }}>
              Showing {paginated.length} of {filtered.length}
            </span>
          </p>
        </div>
        <button
          className="admin-btn admin-btn-ghost"
          onClick={() => fetchVisitors(true)}
          disabled={refreshing}
          style={{ gap: 8 }}
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="admin-card" style={{ padding: 16, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 220px", minWidth: 200 }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--admin-text-dim)" }} />
            <input
              className="admin-input"
              placeholder="Search by IP, browser, OS, timezone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 36, fontSize: 13 }}
            />
          </div>

          {/* OS Filter */}
          <select
            className="admin-input"
            value={filterOS}
            onChange={(e) => setFilterOS(e.target.value)}
            style={{ width: 140, padding: "10px 12px", fontSize: 13 }}
          >
            {osList.map((os) => (
              <option key={os} value={os}>{os === "all" ? "All OS" : os}</option>
            ))}
          </select>

          {/* Browser Filter */}
          <select
            className="admin-input"
            value={filterBrowser}
            onChange={(e) => setFilterBrowser(e.target.value)}
            style={{ width: 150, padding: "10px 12px", fontSize: 13 }}
          >
            {browserList.map((b) => (
              <option key={b} value={b}>{b === "all" ? "All Browsers" : b}</option>
            ))}
          </select>

          {/* Consent Filter */}
          <select
            className="admin-input"
            value={filterConsent}
            onChange={(e) => setFilterConsent(e.target.value)}
            style={{ width: 140, padding: "10px 12px", fontSize: 13 }}
          >
            <option value="all">All Consent</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
            <option value="stealth">Stealth</option>
          </select>
        </div>
      </div>

      {/* Visitors Table */}
      <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}></th>
                <th>IP Address</th>
                <th>Browser</th>
                <th>OS</th>
                <th>Device</th>
                <th>Screen</th>
                <th>Location</th>
                <th>Consent</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((visitor: any, i: number) => {
                const idx = (currentPage - 1) * pageSize + i;
                const isExpanded = expandedRow === idx;
                return (
                  <React.Fragment key={idx}>
                    <tr
                      style={{ cursor: "pointer" }}
                      onClick={() => setExpandedRow(isExpanded ? null : idx)}
                    >
                      <td>
                        {isExpanded ? (
                          <ChevronUp size={14} color="var(--admin-accent)" />
                        ) : (
                          <ChevronDown size={14} color="var(--admin-text-dim)" />
                        )}
                      </td>
                      <td style={{ fontFamily: "monospace", fontSize: 12, color: "var(--admin-text)" }}>
                        {visitor.ip || "Unknown"}
                      </td>
                      <td>
                        <span style={{ color: "var(--admin-text)" }}>{visitor.browser || "—"}</span>
                        <span style={{ color: "var(--admin-text-dim)", fontSize: 11, marginLeft: 4 }}>
                          {visitor.browserVersion ? `v${visitor.browserVersion.split(".")[0]}` : ""}
                        </span>
                      </td>
                      <td>{visitor.os || "—"}</td>
                      <td><DeviceIcon platform={visitor.platform} /></td>
                      <td style={{ fontSize: 12, fontFamily: "monospace" }}>{visitor.screenResolution || "—"}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <Globe size={12} color="var(--admin-text-dim)" />
                          <span style={{ fontSize: 12 }}>{visitor.timezone || visitor.language || "—"}</span>
                        </div>
                      </td>
                      <td><ConsentBadge status={visitor.consent_status || "stealth"} /></td>
                      <td style={{ fontSize: 12, color: "var(--admin-text-dim)" }}>
                        {visitor.timestamp 
                          ? new Date(
                              visitor.timestamp.endsWith("Z") || visitor.timestamp.includes("+") 
                                ? visitor.timestamp 
                                : visitor.timestamp + "Z"
                            ).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'medium' }) + " IST"
                          : "—"}
                      </td>
                    </tr>

                    {/* Expanded Detail Row */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={9} style={{ background: "rgba(15,22,41,0.5)", padding: 0 }}>
                          <div
                            style={{
                              padding: "16px 24px",
                              display: "grid",
                              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                              gap: 16,
                              animation: "adminFadeIn 0.3s ease",
                            }}
                          >
                            <DetailItem
                              icon={<Monitor size={14} />}
                              label="Platform"
                              value={visitor.platform || "Unknown"}
                            />
                            <DetailItem
                              icon={<Globe size={14} />}
                              label="User Agent"
                              value={visitor.userAgent?.substring(0, 60) + "..." || "—"}
                            />
                            <DetailItem
                              icon={<Wifi size={14} />}
                              label="Connection"
                              value={`${visitor.connectionType || "—"} • ${visitor.onlineStatus ? "Online" : "Offline"}`}
                            />
                            <DetailItem
                              icon={<Battery size={14} />}
                              label="Battery"
                              value={
                                visitor.battery
                                  ? `${visitor.battery.level}% ${visitor.battery.charging ? "⚡ Charging" : ""}`
                                  : "N/A"
                              }
                            />
                            <DetailItem
                              icon={<Monitor size={14} />}
                              label="Hardware"
                              value={`${visitor.hardwareConcurrency || "?"} cores • ${visitor.deviceMemory ? visitor.deviceMemory + "GB RAM" : "—"}`}
                            />
                            <DetailItem
                              icon={<MapPin size={14} />}
                              label="Timezone"
                              value={`${visitor.timezone || "—"} • ${visitor.language || "—"}`}
                            />
                            <DetailItem
                              icon={<Monitor size={14} />}
                              label="Display"
                              value={`${visitor.screenResolution || "—"} • ${visitor.colorDepth || "?"}bit • ${visitor.pixelRatio || 1}x`}
                            />
                            <DetailItem
                              icon={<Users size={14} />}
                              label="Privacy"
                              value={`Cookies: ${visitor.cookieEnabled ? "✅" : "❌"} • DNT: ${visitor.doNotTrack || "off"} • Webdriver: ${visitor.webdriver ? "Yes" : "No"}`}
                            />
                            {/* Geo data if available */}
                            {visitor.geo && (
                              <>
                                <DetailItem icon={<MapPin size={14} />} label="Country" value={visitor.geo.country || "—"} />
                                <DetailItem icon={<MapPin size={14} />} label="City" value={`${visitor.geo.city || "—"}, ${visitor.geo.region || "—"}`} />
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}

              {paginated.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: 48, color: "var(--admin-text-dim)" }}>
                    {searchTerm || filterOS !== "all" || filterBrowser !== "all" || filterConsent !== "all"
                      ? "No visitors match your filters"
                      : "No visitor data available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              padding: "12px 20px",
              borderTop: "1px solid var(--admin-border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 12, color: "var(--admin-text-dim)" }}>
              Page {currentPage} of {totalPages}
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                className="admin-btn admin-btn-ghost"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ padding: "6px 14px", fontSize: 12 }}
              >
                Previous
              </button>
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    className={`admin-tab ${currentPage === pageNum ? "active" : ""}`}
                    onClick={() => setCurrentPage(pageNum)}
                    style={{ padding: "6px 12px", fontSize: 12, minWidth: 32 }}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                className="admin-btn admin-btn-ghost"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{ padding: "6px 14px", fontSize: 12 }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Detail Item Component ────────────────────────────────── */
const DetailItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--admin-text-dim)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
      {icon} {label}
    </div>
    <div style={{ color: "var(--admin-text-muted)", fontSize: 13 }}>{value}</div>
  </div>
);

export default VisitorsPage;
