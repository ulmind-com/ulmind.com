import React, { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Layers,
  Server,
  Smartphone,
  Database,
  Cloud,
  Sparkles,
} from "lucide-react";
import { technologies } from "@/data/technologies";
import { CTASection } from "@/components/Sections/CTASection";

/* ─────────────────────────────────────────
   Category metadata (icon + colours)
───────────────────────────────────────── */
const categoryMeta: Record<
  string,
  {
    icon: React.FC<{ className?: string }>;
    gradient: string;
    accentColor: string;
    glowColor: string;
  }
> = {
  "Web Frontend": {
    icon: ({ className }) => <Layers className={className} />,
    gradient: "from-blue-500 via-cyan-400 to-sky-500",
    accentColor: "#38BDF8",
    glowColor: "rgba(56,189,248,0.30)",
  },
  "Web Backend": {
    icon: ({ className }) => <Server className={className} />,
    gradient: "from-emerald-500 via-green-400 to-teal-500",
    accentColor: "#34D399",
    glowColor: "rgba(52,211,153,0.30)",
  },
  "Mobile Development": {
    icon: ({ className }) => <Smartphone className={className} />,
    gradient: "from-violet-500 via-purple-400 to-indigo-500",
    accentColor: "#A78BFA",
    glowColor: "rgba(167,139,250,0.30)",
  },
  Databases: {
    icon: ({ className }) => <Database className={className} />,
    gradient: "from-orange-500 via-amber-400 to-yellow-500",
    accentColor: "#FBBF24",
    glowColor: "rgba(251,191,36,0.30)",
  },
  "Cloud & DevOps": {
    icon: ({ className }) => <Cloud className={className} />,
    gradient: "from-rose-500 via-pink-400 to-fuchsia-500",
    accentColor: "#F472B6",
    glowColor: "rgba(244,114,182,0.30)",
  },
};

/* ─────────────────────────────────────────
   TECH CARD  (no per-card mousemove – hover only via CSS)
   backdrop-filter only activates on :hover so idle cards
   don't cost GPU during scroll
───────────────────────────────────────── */
const TechCard: React.FC<{
  tech: { name: string; icon: React.FC<{ className?: string; size?: number; color?: string }>; color: string; category: string };
  accentColor: string;
  glowColor: string;
}> = ({ tech, accentColor, glowColor }) => {
  return (
    <div
      className="tech-glass-card group"
      style={{ "--pill-glow": accentColor, "--card-glow": glowColor } as React.CSSProperties}
    >
      {/* Top specular highlight */}
      <div className="tech-card-highlight" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-3 p-5">
        <div className="tech-icon-pill">
          <tech.icon
            size={28}
            color={tech.color}
            className="drop-shadow-sm"
          />
        </div>
        <span className="tech-card-label">{tech.name}</span>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   CATEGORY SECTION  (one IntersectionObserver per section,
   not one per card)
───────────────────────────────────────── */
const CategorySection: React.FC<{
  category: string;
  techs: typeof technologies;
  catIndex: number;
}> = ({ category, techs, catIndex }) => {
  const meta = categoryMeta[category] ?? {
    icon: ({ className }: { className?: string }) => <Sparkles className={className} />,
    gradient: "from-gray-400 to-gray-600",
    accentColor: "#94a3b8",
    glowColor: "rgba(148,163,184,0.2)",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Category Header */}
      <div className="flex items-center gap-4 mb-10">
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${meta.gradient} shadow-lg flex-shrink-0`}
        >
          <meta.icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 flex items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight whitespace-nowrap">
            {category}
          </h2>
          <div
            className="flex-1 h-px hidden md:block"
            style={{
              background: `linear-gradient(90deg, ${meta.accentColor}55, transparent)`,
            }}
          />
          <div
            className="hidden md:flex items-center px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background: `${meta.accentColor}18`,
              color: meta.accentColor,
              border: `1px solid ${meta.accentColor}30`,
            }}
          >
            {techs.length} tools
          </div>
        </div>
      </div>

      {/* Cards grid – CSS grid, no scroll-triggered per-card motion */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {techs.map((tech) => (
          <TechCard
            key={tech.name}
            tech={tech}
            accentColor={meta.accentColor}
            glowColor={meta.glowColor}
          />
        ))}
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const Technologies = () => {
  useEffect(() => {
    document.title = "Technology Stack | ULMiND";
    window.scrollTo(0, 0);
  }, []);

  const categories = React.useMemo(
    () =>
      technologies.reduce((acc, tech) => {
        if (!acc[tech.category]) acc[tech.category] = [];
        acc[tech.category].push(tech);
        return acc;
      }, {} as Record<string, typeof technologies>),
    []
  );

  const totalTechs = technologies.length;
  const categoryCount = Object.keys(categories).length;

  return (
    <>
      {/* ── Page-scoped CSS ────────────────────────────────────────────── */}
      <style>{`
        /* ─────────────────────────────────────
           GLASS CARD
           Key perf trick: only apply backdrop-filter
           on :hover, not on every idle card.
           Idle cards use a cheap solid semi-transparent bg.
        ───────────────────────────────────── */
        .tech-glass-card {
          border-radius: 24px;
          position: relative;
          overflow: hidden;
          cursor: default;
          /* GPU layer – prevents repaint bleeding from neighbours */
          transform: translateZ(0);
          will-change: transform;
          /* smooth hover lift */
          transition:
            transform 0.22s cubic-bezier(0.22,1,0.36,1),
            box-shadow  0.22s ease,
            background  0.22s ease,
            border-color 0.22s ease;
        }

        /* ── Light mode idle (cheap – no blur) ── */
        :root .tech-glass-card {
          background: rgba(255,255,255,0.60);
          border: 1px solid rgba(255,255,255,0.80);
          box-shadow:
            0 1px 12px rgba(0,0,0,0.06),
            inset 0 1px 0 rgba(255,255,255,0.95);
        }

        /* ── Dark mode idle (cheap – no blur) ── */
        .dark .tech-glass-card {
          background: rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.09);
          box-shadow:
            0 1px 16px rgba(0,0,0,0.30),
            inset 0 1px 0 rgba(255,255,255,0.10);
        }

        /* ── Light hover: blur activates ONLY on hover ── */
        :root .tech-glass-card:hover {
          background: rgba(255,255,255,0.80);
          border-color: rgba(255,255,255,1);
          box-shadow:
            0 8px 32px rgba(0,0,0,0.10),
            0 0 0 2px var(--card-glow, transparent),
            inset 0 1px 0 rgba(255,255,255,1);
          transform: translateZ(0) translateY(-5px) scale(1.03);
          backdrop-filter: blur(16px) saturate(200%);
          -webkit-backdrop-filter: blur(16px) saturate(200%);
        }

        /* ── Dark hover ── */
        .dark .tech-glass-card:hover {
          background: rgba(255,255,255,0.10);
          border-color: rgba(255,255,255,0.18);
          box-shadow:
            0 8px 40px rgba(0,0,0,0.45),
            0 0 0 2px var(--card-glow, transparent),
            inset 0 1px 0 rgba(255,255,255,0.16);
          transform: translateZ(0) translateY(-5px) scale(1.03);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
        }

        /* ── Top specular line ── */
        .tech-card-highlight {
          position: absolute;
          top: 0; left: 16px; right: 16px;
          height: 1px;
          border-radius: 9999px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.70), transparent);
          opacity: 0.7;
          pointer-events: none;
        }

        /* ── Icon pill ── */
        .tech-icon-pill {
          width: 58px;
          height: 58px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.22s cubic-bezier(0.22,1,0.36,1), box-shadow 0.22s ease;
          /* GPU compositing */
          transform: translateZ(0);
          will-change: transform;
        }

        :root .tech-icon-pill {
          background: rgba(255,255,255,0.82);
          border: 1px solid rgba(255,255,255,0.95);
          box-shadow: 0 3px 10px rgba(0,0,0,0.06), inset 0 1px 0 #fff;
        }

        .dark .tech-icon-pill {
          background: rgba(255,255,255,0.09);
          border: 1px solid rgba(255,255,255,0.13);
          box-shadow: 0 3px 14px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.10);
        }

        .tech-glass-card:hover .tech-icon-pill {
          transform: translateZ(0) scale(1.12);
          box-shadow:
            0 6px 20px rgba(0,0,0,0.12),
            0 0 0 2.5px var(--pill-glow, rgba(99,102,241,0.3)),
            inset 0 1px 0 rgba(255,255,255,0.9);
        }

        .dark .tech-glass-card:hover .tech-icon-pill {
          box-shadow:
            0 6px 24px rgba(0,0,0,0.38),
            0 0 0 2.5px var(--pill-glow, rgba(99,102,241,0.35)),
            inset 0 1px 0 rgba(255,255,255,0.14);
        }

        /* ── Label ── */
        .tech-card-label {
          font-size: 12.5px;
          font-weight: 600;
          letter-spacing: -0.01em;
          text-align: center;
          line-height: 1.25;
          transition: color 0.18s ease;
        }
        :root .tech-card-label          { color: rgba(15,23,42,0.75); }
        .dark  .tech-card-label          { color: rgba(255,255,255,0.75); }
        :root  .tech-glass-card:hover .tech-card-label { color: rgba(15,23,42,1); }
        .dark  .tech-glass-card:hover .tech-card-label { color: rgba(255,255,255,0.96); }

        /* ── Ambient orbs (position:fixed, no filter during scroll) ── */
        .tech-orb {
          position: absolute;
          border-radius: 9999px;
          pointer-events: none;
          /* Pre-composite on own layer; NO filter—filter forces rasterisation */
          transform: translateZ(0);
          will-change: transform;
        }

        @keyframes orbFloat {
          0%,100% { transform: translateZ(0) translateY(0px); }
          50%      { transform: translateZ(0) translateY(-22px); }
        }
        .tech-orb-1 { animation: orbFloat 10s ease-in-out infinite; }
        .tech-orb-2 { animation: orbFloat 13s ease-in-out infinite 2s; }
        .tech-orb-3 { animation: orbFloat 8s  ease-in-out infinite 1s; }

        /* ── Stat chip ── */
        .stat-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 18px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: -0.01em;
        }
        :root .stat-chip {
          background: rgba(255,255,255,0.72);
          border: 1px solid rgba(255,255,255,0.90);
          color: rgba(15,23,42,0.82);
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
        }
        .dark .stat-chip {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.82);
          box-shadow: 0 2px 14px rgba(0,0,0,0.28);
        }

        /* ── Section separator ── */
        .tech-sep {
          height: 1px;
          margin-bottom: 60px;
        }
        :root .tech-sep { background: linear-gradient(90deg, transparent, rgba(0,0,0,0.07), transparent); }
        .dark  .tech-sep { background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent); }
      `}</style>

      <div className="min-h-screen overflow-x-hidden bg-background">
        {/* ══════════════════════════════════════════
            HERO
        ══════════════════════════════════════════ */}
        <section className="relative pt-28 md:pt-32 pb-20 md:pb-28 overflow-hidden">
          {/*
            Orbs: use box-shadow / bg-color for the glow instead of
            CSS filter:blur() – box-shadow is composited on GPU without
            triggering a repaint of sibling elements
          */}
          <div
            className="tech-orb tech-orb-1 absolute top-16 left-[8%] w-72 h-72"
            style={{ background: "radial-gradient(circle, rgba(56,189,248,0.22) 0%, transparent 68%)" }}
          />
          <div
            className="tech-orb tech-orb-2 absolute top-1/3 right-[5%] w-96 h-96"
            style={{ background: "radial-gradient(circle, rgba(167,139,250,0.20) 0%, transparent 68%)" }}
          />
          <div
            className="tech-orb tech-orb-3 absolute bottom-0 left-1/2 -translate-x-1/2 w-[560px] h-44"
            style={{ background: "radial-gradient(ellipse, rgba(244,114,182,0.15) 0%, transparent 68%)" }}
          />

          <div className="container mx-auto px-4 text-center relative z-10">
            {/* Back link */}
            <div className="absolute top-0 left-0 md:left-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-full hover:bg-secondary/40"
              >
                <ArrowLeft size={15} />
                Back to Home
              </Link>
            </div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <div className="stat-chip">
                <Sparkles size={13} className="text-violet-500" />
                OUR COMPLETE TOOLKIT
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-[1.08]"
            >
              Our{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg,#6366f1 0%,#8b5cf6 40%,#a78bfa 70%,#38bdf8 100%)",
                }}
              >
                Technology
              </span>
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg,#38bdf8 0%,#34d399 50%,#6366f1 100%)",
                }}
              >
                Stack
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10"
            >
              A comprehensive toolkit of cutting-edge technologies we use to engineer
              scalable, high-performance digital solutions across all platforms.
            </motion.p>

            {/* Stat chips */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="flex flex-wrap items-center justify-center gap-3"
            >
              {[
                { dot: "#38bdf8", text: `${totalTechs}+ Technologies` },
                { dot: "#34d399", text: `${categoryCount} Categories` },
                { dot: "#f472b6", text: "Production Ready" },
              ].map(({ dot, text }) => (
                <div key={text} className="stat-chip">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dot }} />
                  {text}
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CATEGORIES
        ══════════════════════════════════════════ */}
        <section className="pb-32 container mx-auto px-4 lg:px-8">
          <div className="space-y-20">
            {Object.entries(categories).map(([category, techs], catIndex) => (
              <React.Fragment key={category}>
                {catIndex > 0 && <div className="tech-sep" />}
                <CategorySection category={category} techs={techs} catIndex={catIndex} />
              </React.Fragment>
            ))}
          </div>
        </section>

        <CTASection />
      </div>
    </>
  );
};

export default Technologies;
