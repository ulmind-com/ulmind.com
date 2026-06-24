import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Loader2, Globe, Phone, Map, ShieldAlert, Plus, CheckCircle, Database } from "lucide-react";
import { authFetch } from "../../lib/api";
import { toast } from "sonner";

interface ScrapedLead {
  companyName: string;
  phone: string | null;
  address: string;
  rating: number;
  mapsLink: string;
  maps_url: string;
  industry: string;
  contactEmail: string;
  status: string;
}

const LeadFinderPage: React.FC = () => {
  const [niche, setNiche] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<ScrapedLead[]>([]);
  const [addedLeadNames, setAddedLeadNames] = useState<Set<string>>(new Set());

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche.trim() || !location.trim()) {
      toast.error("Please provide both Niche and Location");
      return;
    }

    setLoading(true);
    setLeads([]);
    toast.info("Scraping Google Maps listings... This may take up to a minute.");

    try {
      const res = await authFetch(
        `/lead-scraper/scrape?niche=${encodeURIComponent(niche.trim())}&location=${encodeURIComponent(location.trim())}`
      );
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || "Scraping failed");
      }
      const data = await res.json();
      if (data.status === "success") {
        setLeads(data.leads || []);
        toast.success(`Found ${data.count} leads without a website!`);
      } else {
        throw new Error(data.message || "Scraping failed");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Scraping request failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCRM = async (lead: ScrapedLead) => {
    try {
      const clientPayload = {
        companyName: lead.companyName,
        contactEmail: lead.contactEmail,
        phone: lead.phone,
        industry: lead.industry,
        address: lead.address,
        revenue: 0.0,
        status: "Active",
        crm_data: {
          stage: "Lead",
          tags: ["Google Maps Lead", "No Website"],
          notes: [
            {
              id: Math.random().toString(36).substr(2, 9),
              content: `Lead generated via ULMIND Google Maps scraper. Map Link: ${lead.maps_url || lead.mapsLink}. Rating: ${lead.rating} stars.`,
              author_id: "system",
              created_at: new Date().toISOString()
            }
          ]
        }
      };

      const res = await authFetch("/clients/", {
        method: "POST",
        body: JSON.stringify(clientPayload),
      });

      if (!res.ok) throw new Error("Failed to save lead to CRM");
      
      setAddedLeadNames((prev) => {
        const next = new Set(prev);
        next.add(lead.companyName);
        return next;
      });
      
      toast.success(`${lead.companyName} added to CRM`);
    } catch (err: any) {
      toast.error(err.message || "Could not add lead");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", gap: 12 }}>
            Google Maps Lead Finder
            <span className="admin-badge admin-badge-danger" style={{ fontSize: 12, background: "rgba(225, 29, 72, 0.15)", border: "1px solid rgba(225, 29, 72, 0.3)", color: "#f43f5e" }}>
              Zero-Cost Leads
            </span>
          </h2>
          <p style={{ color: "#64748b", marginTop: 4, fontSize: 14 }}>
            Identify local businesses on Google Maps that do not have a website. Perfect prospects for selling web design services.
          </p>
        </div>
      </div>

      {/* Control Panel / Search Form */}
      <div className="admin-glass-panel" style={{ padding: 24, borderRadius: 16, border: "1px solid rgba(225, 29, 72, 0.1)" }}>
        <form onSubmit={handleScrape} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 16, alignItems: "end" }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 8 }}>
              Business Niche
            </label>
            <div style={{ position: "relative" }}>
              <Search size={18} style={{ position: "absolute", left: 14, top: 15, color: "#475569" }} />
              <input
                type="text"
                placeholder="e.g. Plumber, Dentist, Cafe, Gym"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="admin-input"
                style={{ paddingLeft: 44, height: 48, background: "rgba(0, 0, 0, 0.3)", border: "1px solid rgba(255, 255, 255, 0.08)" }}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 8 }}>
              Location (City/Area)
            </label>
            <div style={{ position: "relative" }}>
              <MapPin size={18} style={{ position: "absolute", left: 14, top: 15, color: "#475569" }} />
              <input
                type="text"
                placeholder="e.g. Salt Lake, Kolkata, New York"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="admin-input"
                style={{ paddingLeft: 44, height: 48, background: "rgba(0, 0, 0, 0.3)", border: "1px solid rgba(255, 255, 255, 0.08)" }}
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="admin-btn"
            style={{
              height: 48,
              padding: "0 28px",
              background: "linear-gradient(135deg, #e11d48, #be123c)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 20px rgba(225, 29, 72, 0.25)"
            }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Loader2 size={18} className="animate-spin" /> Scraping Maps...
              </span>
            ) : (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Search size={18} /> Find Leads
              </span>
            )}
          </button>
        </form>
      </div>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              padding: "80px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16
            }}
          >
            <Loader2 size={48} className="animate-spin" style={{ color: "#e11d48" }} />
            <div style={{ textAlign: "center" }}>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Gathering maps listings...</h4>
              <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>
                This queries Google Maps live, scrolls to load businesses, and filters out those with websites.
              </p>
            </div>
          </motion.div>
        ) : leads.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="admin-glass-panel"
            style={{ padding: 0, overflow: "hidden", borderRadius: 16 }}
          >
            <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(225,29,72,0.02)" }}>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
                <Database size={18} style={{ color: "#e11d48" }} /> Scraped Results ({leads.length} website-less prospects)
              </h4>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(0,0,0,0.2)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <th style={{ padding: "16px 24px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Business Name</th>
                    <th style={{ padding: "16px 24px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Phone</th>
                    <th style={{ padding: "16px 24px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Address</th>
                    <th style={{ padding: "16px 24px", textAlign: "center", fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Rating</th>
                    <th style={{ padding: "16px 24px", textAlign: "right", fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, index) => {
                    const isAdded = addedLeadNames.has(lead.companyName);
                    return (
                      <tr
                        key={`lead-${index}`}
                        style={{
                          borderBottom: index === leads.length - 1 ? "none" : "1px solid rgba(255,255,255,0.05)",
                          background: isAdded ? "rgba(16, 185, 129, 0.02)" : "transparent"
                        }}
                      >
                        <td style={{ padding: "16px 24px", color: "#f1f5f9", fontWeight: 600 }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            <span>{lead.companyName}</span>
                            <span style={{ fontSize: 11, color: "#e11d48", fontWeight: 500 }}>
                              {lead.industry}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: "16px 24px", color: "#e2e8f0" }}>
                          {lead.phone ? (
                            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                              <Phone size={14} style={{ color: "#64748b" }} /> {lead.phone}
                            </span>
                          ) : (
                            <span style={{ color: "#64748b", fontSize: 12, fontStyle: "italic" }}>No phone</span>
                          )}
                        </td>
                        <td style={{ padding: "16px 24px", color: "#cbd5e1", fontSize: 13, maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {lead.address}
                        </td>
                        <td style={{ padding: "16px 24px", textAlign: "center" }}>
                          <span
                            className="admin-badge"
                            style={{
                              background: lead.rating >= 4.0 ? "rgba(16, 185, 129, 0.15)" : "rgba(234, 179, 8, 0.15)",
                              color: lead.rating >= 4.0 ? "#10b981" : "#eab308",
                              fontWeight: 700
                            }}
                          >
                            ★ {lead.rating > 0 ? lead.rating.toFixed(1) : "N/A"}
                          </span>
                        </td>
                        <td style={{ padding: "16px 24px", textAlign: "right" }}>
                          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                            <button
                              onClick={() => {
                                if (lead.maps_url) {
                                  window.open(lead.maps_url, "_blank");
                                } else if (lead.mapsLink) {
                                  window.open(lead.mapsLink, "_blank");
                                } else {
                                  toast.error("Maps link not available");
                                }
                              }}
                              className="admin-btn"
                              style={{
                                padding: "6px 12px",
                                borderRadius: 8,
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "#94a3b8",
                                fontSize: 12,
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                cursor: "pointer"
                              }}
                            >
                              <Map size={13} /> Maps
                            </button>

                            <button
                              onClick={() => handleAddToCRM(lead)}
                              disabled={isAdded}
                              className="admin-btn"
                              style={{
                                padding: "6px 12px",
                                borderRadius: 8,
                                background: isAdded ? "rgba(16, 185, 129, 0.1)" : "rgba(225, 29, 72, 0.1)",
                                border: isAdded ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid rgba(225, 29, 72, 0.2)",
                                color: isAdded ? "#10b981" : "#f43f5e",
                                fontSize: 12,
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                cursor: isAdded ? "not-allowed" : "pointer"
                              }}
                            >
                              {isAdded ? (
                                <>
                                  <CheckCircle size={13} /> Saved
                                </>
                              ) : (
                                <>
                                  <Plus size={13} /> Add CRM
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="admin-glass-panel"
            style={{
              padding: "48px 24px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "rgba(225,29,72,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(225,29,72,0.1)",
                color: "#e11d48"
              }}
            >
              <Globe size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>No search performed yet</h4>
              <p style={{ color: "#64748b", fontSize: 13, marginTop: 4, maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
                Enter a business niche and location above to scan Google Maps live for prospective website design clients.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LeadFinderPage;
