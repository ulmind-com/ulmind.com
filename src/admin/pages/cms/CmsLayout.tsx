import React, { useState } from "react";
import { Layers, Star, Briefcase, Globe } from "lucide-react";
import StatsManager from "./StatsManager";
import ReviewsManager from "./ReviewsManager";
import ProjectsManager from "./ProjectsManager";

type TabKey = "stats" | "reviews" | "projects";

const TABS: { key: TabKey; label: string; desc: string; icon: React.ElementType; accent: string; glow: string }[] = [
  { key: "stats", label: "Company Stats", desc: "Counters & milestones", icon: Layers, accent: "#0ea5e9", glow: "rgba(14,165,233,0.35)" },
  { key: "reviews", label: "Client Reviews", desc: "Testimonials & ratings", icon: Star, accent: "#f43f5e", glow: "rgba(244,63,94,0.35)" },
  { key: "projects", label: "Portfolio Projects", desc: "Showcase work", icon: Briefcase, accent: "#10b981", glow: "rgba(16,185,129,0.3)" },
];

const CmsLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("stats");

  return (
    <div style={{ position: "relative", minHeight: "100%" }}>
      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <div
          style={{
            width: 52, height: 52, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(244,63,94,0.05))",
            border: "1px solid rgba(244,63,94,0.25)", boxShadow: "0 8px 24px rgba(239,68,68,0.15)",
          }}
        >
          <Globe size={26} color="var(--admin-accent-hover)" />
        </div>
        <div>
          <h1
            style={{
              fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1,
              background: "linear-gradient(to right, #fff, #a1a1aa)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}
          >
            Website Content
          </h1>
          <p style={{ fontSize: 14, color: "var(--admin-text-dim)", marginTop: 4 }}>
            Live control of everything visitors see — stats, reviews & portfolio
          </p>
        </div>
      </div>

      {/* ── Premium Segmented Tabs ── */}
      <div
        style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 32,
        }}
      >
        {TABS.map((tab) => {
          const active = activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", borderRadius: 18,
                cursor: "pointer", textAlign: "left", transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
                background: active ? "var(--admin-bg-card-hover)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${active ? tab.accent : "var(--admin-border)"}`,
                boxShadow: active ? `0 10px 30px -8px ${tab.glow}` : "none",
                transform: active ? "translateY(-2px)" : "none",
              }}
            >
              <div
                style={{
                  width: 44, height: 44, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  background: active ? tab.glow : "rgba(255,255,255,0.04)",
                  border: `1px solid ${active ? tab.accent : "rgba(255,255,255,0.06)"}`,
                  boxShadow: active ? `0 0 18px -4px ${tab.glow}` : "none",
                  transition: "all 0.35s",
                }}
              >
                <Icon size={20} color={active ? tab.accent : "var(--admin-text-dim)"} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: active ? "#fff" : "var(--admin-text-muted)" }}>
                  {tab.label}
                </div>
                <div style={{ fontSize: 12, color: "var(--admin-text-dim)", marginTop: 2 }}>{tab.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Active Section ── */}
      <div key={activeTab} style={{ animation: "cmsFade 0.4s cubic-bezier(0.16,1,0.3,1)" }}>
        {activeTab === "stats" && <StatsManager />}
        {activeTab === "reviews" && <ReviewsManager />}
        {activeTab === "projects" && <ProjectsManager />}
      </div>

      <style>{`
        @keyframes cmsFade {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cmsSlideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes cmsOverlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default CmsLayout;
