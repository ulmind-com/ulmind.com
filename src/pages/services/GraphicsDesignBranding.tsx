import React, { useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Palette,
  Pen,
  Layers,
  Star,
  Sparkles,
  Clock,
  Eye,
  Zap,
  Shield,
  Grid,
  Type,
  Film,
  Layout,
  Smartphone,
  BookOpen,
  MonitorPlay,
  Package,
  Shapes,
  Briefcase,
  Pipette,
  Box,
  TabletSmartphone,
  Image as ImageIcon,
  Smile,
  Mail,
  BarChart,
} from "lucide-react";
import BlurBlob from "@/components/BlurBlob";
import { TimelineGlowLine } from "@/components/ui/TimelineGlowLine";
import { ShineBorder } from "@/components/ui/shine-border";

/* ─── Reveal ─────────────────────────────────────── */
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 44 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
};

/* ─── SVG: Brand Identity Builder ─────────────────── */
const BrandIdentitySVG: React.FC = () => (
  <svg viewBox="0 0 520 460" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <radialGradient id="brandGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#d946ef" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#d946ef" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="fuchsiaMain" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#d946ef" />
        <stop offset="100%" stopColor="#a21caf" />
      </linearGradient>
      <linearGradient id="fuchsiaLight" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f0abfc" />
        <stop offset="100%" stopColor="#d946ef" />
      </linearGradient>
      <linearGradient id="cardBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1e0722" />
        <stop offset="100%" stopColor="#0d0311" />
      </linearGradient>
      <linearGradient id="swatchGrad1" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#d946ef" />
        <stop offset="100%" stopColor="#c026d3" />
      </linearGradient>
      <linearGradient id="swatchGrad2" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#a21caf" />
        <stop offset="100%" stopColor="#86198f" />
      </linearGradient>
      <linearGradient id="swatchGrad3" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#f0abfc" />
        <stop offset="100%" stopColor="#e879f9" />
      </linearGradient>
      <filter id="fuchsiaGlow">
        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
        <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>

    {/* BG glow */}
    <ellipse cx="260" cy="230" rx="220" ry="180" fill="url(#brandGlow)" opacity="0.6" />

    {/* Central brand card */}
    <g transform="translate(120, 60)">
      <rect width="280" height="170" rx="20" fill="url(#cardBg)" stroke="#d946ef33" strokeWidth="1.5" />
      <rect width="280" height="170" rx="20" fill="#d946ef08" />

      {/* Logo mark */}
      <circle cx="60" cy="60" r="32" fill="#d946ef18" stroke="#d946ef44" strokeWidth="1" />
      <circle cx="60" cy="60" r="32" fill="url(#fuchsiaMain)" opacity="0.15" />
      <text x="60" y="66" textAnchor="middle" fontFamily="Georgia, serif" fontSize="24" fontWeight="900" fill="url(#fuchsiaMain)" filter="url(#fuchsiaGlow)">B</text>

      {/* Brand name */}
      <text x="110" y="50" fontFamily="system-ui" fontSize="18" fontWeight="900" fill="#fff" letterSpacing="-0.5">BRANDMARK</text>
      <text x="110" y="70" fontFamily="system-ui" fontSize="9" fontWeight="600" fill="#d946ef" letterSpacing="3">VISUAL IDENTITY</text>
      <line x1="110" y1="80" x2="270" y2="80" stroke="#d946ef22" strokeWidth="1" />

      {/* Color swatches */}
      <text x="110" y="100" fontFamily="system-ui" fontSize="8" fontWeight="700" fill="#94a3b8" letterSpacing="2">COLOR PALETTE</text>
      <rect x="110" y="108" width="36" height="16" rx="4" fill="url(#swatchGrad1)" />
      <rect x="152" y="108" width="36" height="16" rx="4" fill="url(#swatchGrad2)" />
      <rect x="194" y="108" width="36" height="16" rx="4" fill="url(#swatchGrad3)" />
      <rect x="236" y="108" width="36" height="16" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1" />

      {/* Typography preview */}
      <text x="110" y="145" fontFamily="Georgia, serif" fontSize="14" fontWeight="700" fill="#fff" opacity="0.9">Aa Bb Cc — Primary</text>
      <text x="110" y="160" fontFamily="system-ui" fontSize="10" fill="#64748b">Inter / Roboto — Secondary</text>
    </g>

    {/* Left panel: Grid system */}
    <g transform="translate(25, 270)">
      <rect width="140" height="100" rx="14" fill="url(#cardBg)" stroke="#d946ef22" strokeWidth="1" />
      <text x="70" y="20" textAnchor="middle" fontFamily="system-ui" fontSize="8" fontWeight="800" fill="#d946ef" letterSpacing="2">GRID SYSTEM</text>
      {[0, 1, 2, 3].map(col => (
        <rect key={col} x={16 + col * 28} y={28} width="22" height="58" rx="3" fill="#d946ef10" stroke="#d946ef22" strokeWidth="0.8" />
      ))}
      {[0, 1, 2].map(row => (
        <line key={row} x1="16" y1={44 + row * 20} x2="124" y2={44 + row * 20} stroke="#d946ef15" strokeWidth="0.8" strokeDasharray="3 3" />
      ))}
    </g>

    {/* Right panel: Icon set */}
    <g transform="translate(355, 270)">
      <rect width="140" height="100" rx="14" fill="url(#cardBg)" stroke="#d946ef22" strokeWidth="1" />
      <text x="70" y="20" textAnchor="middle" fontFamily="system-ui" fontSize="8" fontWeight="800" fill="#d946ef" letterSpacing="2">ICONOGRAPHY</text>
      {[
        { x: 22, y: 36, shape: "circle" },
        { x: 56, y: 36, shape: "square" },
        { x: 90, y: 36, shape: "triangle" },
        { x: 22, y: 68, shape: "diamond" },
        { x: 56, y: 68, shape: "star" },
        { x: 90, y: 68, shape: "hex" },
      ].map((s, i) => (
        <g key={i}>
          <circle cx={s.x + 14} cy={s.y + 8} r="12" fill="#d946ef12" stroke="#d946ef30" strokeWidth="1" />
          <circle cx={s.x + 14} cy={s.y + 8} r="5" fill="url(#fuchsiaMain)" opacity={0.6 + i * 0.06} />
        </g>
      ))}
    </g>

    {/* Center bottom: Mockup device hint */}
    <g transform="translate(165, 278)">
      <rect width="190" height="100" rx="14" fill="url(#cardBg)" stroke="#d946ef22" strokeWidth="1" />
      <text x="95" y="20" textAnchor="middle" fontFamily="system-ui" fontSize="8" fontWeight="800" fill="#d946ef" letterSpacing="2">BRAND MOCKUP</text>
      {/* Simple phone shape */}
      <rect x="30" y="28" width="44" height="62" rx="7" fill="#d946ef15" stroke="#d946ef33" strokeWidth="1" />
      <rect x="36" y="34" width="32" height="48" rx="4" fill="#d946ef08" />
      <circle cx="52" cy="84" r="3" fill="#d946ef" opacity="0.5" />
      {/* Simple card shapes on phone */}
      <rect x="39" y="37" width="26" height="8" rx="2" fill="url(#fuchsiaMain)" opacity="0.7" />
      <rect x="39" y="49" width="20" height="3" rx="1" fill="#ffffff30" />
      <rect x="39" y="55" width="26" height="3" rx="1" fill="#ffffff20" />
      {/* Simple business card */}
      <rect x="90" y="30" width="80" height="50" rx="6" fill="url(#fuchsiaMain)" opacity="0.12" stroke="#d946ef33" strokeWidth="1" />
      <rect x="90" y="30" width="80" height="50" rx="6" fill="url(#fuchsiaMain)" opacity="0.06" />
      <circle cx="108" cy="48" r="10" fill="url(#fuchsiaMain)" opacity="0.5" />
      <text x="108" y="52" textAnchor="middle" fontFamily="Georgia,serif" fontSize="11" fontWeight="900" fill="#fff" opacity="0.9">B</text>
      <rect x="122" y="42" width="36" height="3" rx="1" fill="#ffffff40" />
      <rect x="122" y="49" width="24" height="2" rx="1" fill="#ffffff25" />
      <rect x="122" y="55" width="30" height="2" rx="1" fill="#ffffff20" />
    </g>

    {/* Animated floating dots */}
    {[
      { cx: 100, cy: 120, r: 4, dur: "2.5s" },
      { cx: 420, cy: 160, r: 3, dur: "3s" },
      { cx: 260, cy: 400, r: 3.5, dur: "2s" },
      { cx: 60, cy: 220, r: 2.5, dur: "3.5s" },
      { cx: 470, cy: 300, r: 3, dur: "2.2s" },
    ].map((d, i) => (
      <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill="#d946ef" opacity="0.5" filter="url(#fuchsiaGlow)">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur={d.dur} repeatCount="indefinite" begin={`${i * 0.5}s`} />
        <animate attributeName="r" values={`${d.r};${d.r + 2};${d.r}`} dur={d.dur} repeatCount="indefinite" begin={`${i * 0.5}s`} />
      </circle>
    ))}
  </svg>
);

/* ─── SVG: Design Process Illustration ─────────── */
const DesignProcessSVG: React.FC = () => (
  <svg viewBox="0 0 500 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="dpBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1e0722" />
        <stop offset="100%" stopColor="#0d0311" />
      </linearGradient>
      <linearGradient id="dpBar1" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#d946ef" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#d946ef" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="dpBar2" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#a21caf" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#a21caf" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="dpBar3" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#c026d3" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#c026d3" stopOpacity="0.7" />
      </linearGradient>
    </defs>

    {/* Frame */}
    <rect x="30" y="20" width="440" height="380" rx="20" fill="url(#dpBg)" />
    <rect x="30" y="20" width="440" height="380" rx="20" stroke="#d946ef22" strokeWidth="1.5" />

    {/* Top bar */}
    <rect x="30" y="20" width="440" height="44" rx="20" fill="#d946ef10" />
    <circle cx="62" cy="42" r="6" fill="#ef4444" opacity="0.8" />
    <circle cx="82" cy="42" r="6" fill="#f59e0b" opacity="0.8" />
    <circle cx="102" cy="42" r="6" fill="#22c55e" opacity="0.8" />
    <text x="210" y="47" textAnchor="middle" fontFamily="system-ui" fontSize="11" fontWeight="800" fill="#d946ef" letterSpacing="2">DESIGN STUDIO</text>

    {/* Left: Brand score radials */}
    <g transform="translate(55, 88)">
      <text x="0" y="15" fontFamily="system-ui" fontSize="8" fontWeight="700" fill="#d946ef" letterSpacing="2">BRAND STRENGTH</text>
      {[
        { label: "Identity", pct: 92, y: 32 },
        { label: "Consistency", pct: 88, y: 58 },
        { label: "Recognition", pct: 95, y: 84 },
        { label: "Engagement", pct: 80, y: 110 },
      ].map((item, i) => (
        <g key={i}>
          <text x="0" y={item.y + 10} fontFamily="system-ui" fontSize="8" fill="#64748b">{item.label}</text>
          <rect x="70" y={item.y} width="110" height="10" rx="5" fill="#d946ef12" />
          <rect x="70" y={item.y} width={item.pct * 1.1} height="10" rx="5" fill="url(#dpBar1)" opacity="0.9" />
          <text x="185" y={item.y + 9} fontFamily="system-ui" fontSize="8" fontWeight="700" fill="#d946ef">{item.pct}%</text>
        </g>
      ))}
    </g>

    {/* Right: Color system */}
    <g transform="translate(310, 88)">
      <text x="0" y="15" fontFamily="system-ui" fontSize="8" fontWeight="700" fill="#d946ef" letterSpacing="2">COLOR SYSTEM</text>
      {[
        { color: "#d946ef", name: "Fuchsia", hex: "#D946EF" },
        { color: "#a21caf", name: "Magenta", hex: "#A21CAF" },
        { color: "#86198f", name: "Purple", hex: "#86198F" },
        { color: "#f0abfc", name: "Lavender", hex: "#F0ABFC" },
      ].map((c, i) => (
        <g key={i} transform={`translate(0, ${28 + i * 26})`}>
          <rect width="18" height="18" rx="5" fill={c.color} />
          <text x="24" y="12" fontFamily="system-ui" fontSize="9" fontWeight="600" fill="#fff" opacity="0.85">{c.name}</text>
          <text x="90" y="12" fontFamily="monospace" fontSize="8" fill="#64748b">{c.hex}</text>
        </g>
      ))}
    </g>

    {/* Center: Typography preview */}
    <g transform="translate(55, 240)">
      <rect width="390" height="80" rx="12" fill="#d946ef08" stroke="#d946ef18" strokeWidth="1" />
      <text x="20" y="22" fontFamily="system-ui" fontSize="8" fontWeight="700" fill="#d946ef" letterSpacing="2">TYPOGRAPHY SYSTEM</text>
      <text x="20" y="46" fontFamily="Georgia, serif" fontSize="22" fontWeight="900" fill="#fff" opacity="0.95">Brand Headlines</text>
      <text x="20" y="64" fontFamily="system-ui" fontSize="10" fill="#94a3b8">Body text — clean, readable, consistent across platforms</text>
      <text x="310" y="46" fontFamily="monospace" fontSize="10" fill="#d946ef" opacity="0.7">36px / Bold</text>
      <text x="310" y="64" fontFamily="monospace" fontSize="10" fill="#64748b">14px / Regular</text>
    </g>

    {/* Bottom: Asset export status */}
    <g transform="translate(55, 338)">
      <rect width="390" height="44" rx="10" fill="#d946ef09" stroke="#d946ef18" strokeWidth="1" />
      <circle cx="24" cy="22" r="10" fill="#d946ef20" />
      <circle cx="24" cy="22" r="5" fill="#d946ef">
        <animate attributeName="opacity" values="1;0.4;1" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <text x="42" y="26" fontFamily="system-ui" fontSize="9" fontWeight="700" fill="#d946ef">EXPORTING</text>
      <text x="120" y="26" fontFamily="system-ui" fontSize="8" fill="#64748b">SVG · AI · PNG · PDF · Figma</text>
      <text x="330" y="26" fontFamily="system-ui" fontSize="9" fontWeight="700" fill="#22c55e">READY</text>
    </g>
  </svg>
);

/* ─── Phase data ─────────────────────────────────── */
const phases = [
  {
    phase: "PHASE 1", label: "Discovery", days: "Day 1–3",
    color: "#d946ef", borderColor: "border-fuchsia-500/40", bg: "from-fuchsia-500/10 to-fuchsia-500/5", dot: "#d946ef",
    days_data: [
      { day: "DAY 1 — BRAND UNDERSTANDING", items: ["Business goals & vision", "Target audience research", "Brand personality definition"] },
      { day: "DAY 2–3 — RESEARCH & MOODBOARD", items: ["Competitor analysis", "Market positioning", "Moodboard & style direction"] },
    ],
  },
  {
    phase: "PHASE 2", label: "Concept Design", days: "Day 4–6",
    color: "#c026d3", borderColor: "border-fuchsia-600/40", bg: "from-fuchsia-600/10 to-fuchsia-600/5", dot: "#c026d3",
    days_data: [
      { day: "DAY 4–5 — LOGO CONCEPTS", items: ["Multiple logo concepts", "Color palette selection", "Typography exploration"] },
      { day: "DAY 6 — INITIAL PRESENTATION", items: ["Concept presentation", "Client walkthrough", "Feedback collection"] },
    ],
  },
  {
    phase: "PHASE 3", label: "Design Development", days: "Day 7–10",
    color: "#a21caf", borderColor: "border-purple-600/40", bg: "from-purple-600/10 to-purple-600/5", dot: "#a21caf",
    days_data: [
      { day: "DAY 7–8 — LOGO FINALISATION", items: ["Final logo refinement", "Variations (dark/light/mono)", "Brand mark system"] },
      { day: "DAY 9–10 — BRAND ASSETS", items: ["Brand assets creation", "UI/UX visual design", "Marketing collateral design"] },
    ],
  },
  {
    phase: "PHASE 4", label: "Brand System", days: "Day 11–13",
    color: "#86198f", borderColor: "border-purple-700/40", bg: "from-purple-700/10 to-purple-700/5", dot: "#86198f",
    days_data: [
      { day: "DAY 11–13 — GUIDELINES", items: ["Brand guidelines document", "Usage rules & dos/don'ts", "Asset consistency check"] },
    ],
  },
  {
    phase: "PHASE 5", label: "Review & Refinement", days: "Day 14",
    color: "#e879f9", borderColor: "border-fuchsia-400/40", bg: "from-fuchsia-400/10 to-fuchsia-400/5", dot: "#e879f9",
    days_data: [
      { day: "DAY 14 — CLIENT REVIEW", items: ["Client feedback round", "Final design refinements", "Approval sign-off"] },
    ],
  },
  {
    phase: "PHASE 6", label: "Final Delivery", days: "Day 15",
    color: "#d946ef", borderColor: "border-fuchsia-500/40", bg: "from-fuchsia-500/10 to-fuchsia-500/5", dot: "#d946ef",
    days_data: [
      { day: "DAY 15 — HANDOVER", items: ["All design files (AI, PSD, Figma)", "Brand guideline PDF", "Brand kit handover", "Future support setup"] },
    ],
  },
];

const techStack = [
  { category: "Design Tools", tech: "Figma / Adobe XD", icon: Layout, color: "from-fuchsia-500 to-fuchsia-700" },
  { category: "Vector Design", tech: "Adobe Illustrator", icon: Pen, color: "from-purple-600 to-fuchsia-600" },
  { category: "Raster Design", tech: "Adobe Photoshop", icon: Layers, color: "from-fuchsia-700 to-purple-700" },
  { category: "Motion", tech: "After Effects / Lottie", icon: Film, color: "from-purple-500 to-fuchsia-500" },
  { category: "Typography", tech: "Google Fonts / Adobe Fonts", icon: Type, color: "from-fuchsia-600 to-purple-600" },
  { category: "Prototyping", tech: "Figma / InVision", icon: Grid, color: "from-purple-700 to-fuchsia-700" },
];

const coreServices = [
  { icon: Sparkles, title: "Logo & Brand Identity", desc: "Unique logos, brand color systems, and complete visual identity guidelines." },
  { icon: Layout, title: "UI/UX Visual Design", desc: "Website, app, and landing page designs focused on conversion and engagement." },
  { icon: Film, title: "Motion Graphics", desc: "Animated visuals, logo animations, and promo videos that bring brands to life." },
  { icon: Grid, title: "Marketing Collaterals", desc: "Social media creatives, banners, posters, and brochures at brand scale." },
];

const useCases = ["Startup Branding", "Business Rebranding", "SaaS Product Design", "E-commerce Design", "Social Media Branding"];

/* ─── Phase Card ─────────────────────────────────── */
const PhaseCard: React.FC<{ phase: typeof phases[0]; index: number }> = ({ phase, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.1 }} className="relative">
      <div className="absolute left-0 md:left-1/2 top-6 w-4 h-4 rounded-full -translate-x-1/2 z-10 ring-4 ring-white dark:ring-zinc-950 shadow-lg" style={{ backgroundColor: phase.dot }} />
      <div className={`ml-8 md:ml-0 ${index % 2 === 0 ? "md:pr-[calc(50%+2rem)]" : "md:pl-[calc(50%+2rem)]"}`}>
        <div className="relative rounded-2xl p-6 overflow-hidden backdrop-blur-xl bg-white/60 dark:bg-white/[0.12] border border-white/80 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.1)]">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-[3px] rounded-b-2xl pointer-events-none" style={{ background: `linear-gradient(90deg, transparent, ${phase.color}80, transparent)` }} />
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-black tracking-wider px-3 py-1.5 rounded-full text-white" style={{ backgroundColor: phase.color }}>{phase.phase}</span>
            <span className="text-xs font-semibold text-zinc-400">{phase.days}</span>
          </div>
          <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-4 uppercase tracking-tight">{phase.label}</h3>
          <div className="space-y-4">
            {phase.days_data.map((d, di) => (
              <div key={di}>
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">
                  <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />{d.day}
                </p>
                <ul className="space-y-1.5 pl-5">
                  {d.items.map((item, ii) => (
                    <li key={ii} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: phase.color }} />{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Main Page ───────────────────────────────────── */
const GraphicsDesignBrandingPage: React.FC = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    document.title = "Graphics Design & Branding | ULMiND";
    return () => { document.title = "ULMiND"; };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300 overflow-x-hidden">

      {/* ── BACK ── */}
      <div className="max-w-7xl mx-auto px-6 pt-8 relative z-50">
        <motion.button onClick={() => navigate("/services")} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-2 text-sm font-semibold text-fuchsia-600 dark:text-fuchsia-400 hover:gap-3 transition-all duration-200 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />Back to Services
        </motion.button>
      </div>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative pt-8 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-fuchsia-100/60 via-purple-50/20 to-transparent dark:from-fuchsia-950/25 dark:via-purple-950/10 dark:to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-fuchsia-400/10 to-transparent dark:from-fuchsia-600/12 dark:to-transparent rounded-full blur-3xl pointer-events-none" />
        <BlurBlob position={{ top: "15%", left: "2%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-fuchsia-500" opacityClass="opacity-10" />
        <BlurBlob position={{ top: "55%", left: "65%" }} size={{ width: "350px", height: "350px" }} colorClass="bg-purple-600" opacityClass="opacity-8" />

        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 backdrop-blur-md">
                <Palette className="w-3.5 h-3.5 text-fuchsia-500" />
                <span className="text-fuchsia-600 dark:text-fuchsia-400 text-[10px] font-black tracking-[0.4em] uppercase">Graphics Design & Branding</span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-black text-zinc-900 dark:text-white leading-none tracking-tighter uppercase mb-6">
                Design That
                <span className="block bg-gradient-to-r from-fuchsia-600 via-purple-500 to-fuchsia-400 bg-clip-text text-transparent">Defines You</span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8 max-w-lg font-medium">
                We craft powerful visual identities and premium design experiences that make your brand stand out, connect with your audience, and drive real business impact.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  { icon: Sparkles, label: "Brand Identity" },
                  { icon: Eye, label: "UI/UX Design" },
                  { icon: Film, label: "Motion Graphics" },
                  { icon: Zap, label: "High Impact" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200/50 dark:border-white/10">
                    <Icon className="w-4 h-4 text-fuchsia-500" />
                    <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{label}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  onClick={() => navigate("/contact")}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="h-14 px-8 bg-gradient-to-r from-fuchsia-600 via-purple-500 to-fuchsia-400 hover:from-fuchsia-700 hover:to-fuchsia-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-fuchsia-500/30 uppercase tracking-widest flex items-center gap-2 border-0"
                >
                  Build Your Brand <ArrowRight className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  onClick={() => document.getElementById("roadmap-brand")?.scrollIntoView({ behavior: "smooth" })}
                  className="h-14 px-8 border border-fuchsia-400 dark:border-fuchsia-700/50 text-fuchsia-700 dark:text-fuchsia-300 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/20 transition-all bg-transparent"
                >
                  View Roadmap
                </motion.button>
              </div>
            </Reveal>
          </motion.div>

          {/* RIGHT illustration */}
          <Reveal delay={0.3}>
            <motion.div animate={{ y: [0, -18, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="flex justify-center relative">
              <div className="w-full max-w-lg relative">
                <div className="absolute inset-0 bg-fuchsia-500/20 dark:bg-fuchsia-500/10 blur-[80px] rounded-full pointer-events-none" />
                <img 
                  src="/illustrations/d1.png" 
                  alt="Brand Identity Design" 
                  className="w-full h-auto relative z-10 transition-transform duration-700 hover:scale-[1.02]"
                  style={{ filter: "drop-shadow(0 20px 50px rgba(217,70,239,0.4))" }}
                />
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── BRANDING PROCESS FLOW ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10">
              <span className="text-fuchsia-600 dark:text-fuchsia-400 text-[10px] font-black tracking-[0.4em] uppercase">Pipeline</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
              Branding <span className="text-fuchsia-600">Process</span>
            </h2>
          </Reveal>
          <div className="flex flex-wrap justify-center items-center gap-2">
            {["Research", "Strategy", "Concept", "Design", "Feedback", "Final Delivery"].map((step, i, arr) => (
              <React.Fragment key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                  whileHover={{ scale: 1.06, y: -4 }}
                  className="px-5 py-3 rounded-xl bg-gradient-to-br from-fuchsia-600 to-purple-700 text-white text-sm font-black uppercase tracking-wide shadow-lg shadow-fuchsia-600/20"
                >
                  {step}
                </motion.div>
                {i < arr.length - 1 && <ArrowRight className="w-4 h-4 text-fuchsia-400 flex-shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-fuchsia-50/40 to-transparent dark:via-fuchsia-950/10 pointer-events-none" />
        <BlurBlob position={{ top: "40%", left: "75%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-fuchsia-500" opacityClass="opacity-8" />

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
          <Reveal>
            <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
              <div className="w-full max-w-lg mx-auto relative">
                <div className="absolute inset-0 bg-purple-500/20 dark:bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />
                <img 
                  src="/illustrations/d2.png" 
                  alt="Design Process" 
                  className="w-full h-auto relative z-10 transition-transform duration-700 hover:scale-[1.02]"
                  style={{ filter: "drop-shadow(0 20px 50px rgba(162,28,175,0.3))" }}
                />
              </div>
            </motion.div>
          </Reveal>

          <div>
            <Reveal>
              <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-purple-500/20 bg-purple-500/10">
                <span className="text-purple-600 dark:text-purple-400 text-[10px] font-black tracking-[0.4em] uppercase">Deliverables</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-8">
                What You <span className="text-fuchsia-600">Get</span>
              </h2>
            </Reveal>
            <div className="space-y-3">
              {[
                "Complete brand identity system",
                "Logo design & visual guidelines",
                "High-end UI/UX design",
                "Marketing & social media creatives",
                "Motion graphics & animations",
                "Consistent multi-platform design",
              ].map((item, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <motion.div whileHover={{ x: 8 }} className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/50 dark:border-white/5 group cursor-default">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 to-purple-700 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">{item}</span>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ROADMAP ── */}
      <section id="roadmap-brand" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <BlurBlob position={{ top: "20%", left: "3%" }} size={{ width: "500px", height: "500px" }} colorClass="bg-fuchsia-500" opacityClass="opacity-6" />
        <BlurBlob position={{ top: "65%", left: "78%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-purple-500" opacityClass="opacity-6" />

        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10">
              <span className="text-fuchsia-600 dark:text-fuchsia-400 text-[10px] font-black tracking-[0.4em] uppercase">Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-4">
              Design <span className="text-fuchsia-600">Roadmap</span>
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">Day 1 – Day 15, structured creative delivery</p>
          </Reveal>

          <div className="relative">
            <TimelineGlowLine colors={phases.map(p => p.color)} />
            <div className="space-y-12">
              {phases.map((phase, i) => <PhaseCard key={i} phase={phase} index={i} />)}
            </div>
          </div>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-fuchsia-50/30 to-transparent dark:via-fuchsia-950/10 pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <Reveal className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10">
              <span className="text-fuchsia-600 dark:text-fuchsia-400 text-[10px] font-black tracking-[0.4em] uppercase">Tools</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
              Design <span className="text-fuchsia-600">Toolkit</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStack.map((item, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <motion.div whileHover={{ scale: 1.04, y: -4 }} className="relative p-6 rounded-2xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/50 dark:border-white/10 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-xs font-black text-fuchsia-600 dark:text-fuchsia-400 uppercase tracking-widest mb-1">{item.category}</p>
                    <p className="text-lg font-black text-zinc-900 dark:text-white">{item.tech}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CORE SERVICES ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <BlurBlob position={{ top: "30%", left: "75%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-fuchsia-500" opacityClass="opacity-8" />
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10">
              <span className="text-fuchsia-600 dark:text-fuchsia-400 text-[10px] font-black tracking-[0.4em] uppercase">Services</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
              Core <span className="text-fuchsia-600">Services</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreServices.map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div whileHover={{ scale: 1.04, y: -6 }} className="relative p-6 rounded-3xl bg-white dark:bg-white/[0.03] border border-zinc-200/60 dark:border-white/10 shadow-sm hover:shadow-xl dark:hover:shadow-fuchsia-500/10 transition-all duration-300 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-700 flex items-center justify-center mb-5 shadow-lg shadow-fuchsia-500/30">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-black text-zinc-900 dark:text-white text-lg mb-2">{title}</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US + DELIVERABLES ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <BlurBlob position={{ top: "30%", left: "0%" }} size={{ width: "500px", height: "500px" }} colorClass="bg-fuchsia-500" opacityClass="opacity-6" />
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          <Reveal>
            <div className="p-8 rounded-3xl bg-gradient-to-br from-fuchsia-600 via-purple-600 to-fuchsia-800 text-white shadow-2xl shadow-fuchsia-600/30 h-full">
              <h2 className="text-3xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                <Star className="w-7 h-7" /> Why Choose Us
              </h2>
              <ul className="space-y-4">
                {["Strategic design approach", "Premium and modern aesthetics", "Business-focused branding", "Consistent visual identity", "Long-term design support"].map((item, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="flex items-center gap-3 text-white/90 font-semibold">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 text-white" />{item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <ShineBorder borderRadius={24} borderWidth={1} color={["#d946ef", "#a21caf", "#e879f9"]} className="w-full h-full">
              <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/50 dark:border-white/10 h-full">
                <h2 className="text-3xl font-black uppercase tracking-tight text-zinc-900 dark:text-white mb-6 flex items-center gap-3">
                  <Shield className="w-7 h-7 text-fuchsia-500" /> Quality & Files
                </h2>
                <div className="space-y-4">
                  {[
                    { label: "Logo files — PNG, SVG, AI", icon: Sparkles },
                    { label: "Brand guideline PDF", icon: Layers },
                    { label: "UI design files in Figma", icon: Layout },
                    { label: "Marketing & animation assets", icon: Film },
                  ].map(({ label, icon: Icon }, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-white/[0.03] border border-zinc-200/50 dark:border-white/5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 to-purple-700 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">{label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </ShineBorder>
          </Reveal>
        </div>
      </section>

      {/* ── USE CASES ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-6">Use Cases</p>
            <div className="flex flex-wrap justify-center gap-3">
              {useCases.map((uc, i) => (
                <motion.span key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.06 }} transition={{ delay: i * 0.07 }} viewport={{ once: true }} className="px-5 py-2.5 rounded-full border border-fuchsia-300/40 dark:border-fuchsia-700/30 bg-fuchsia-50 dark:bg-fuchsia-900/10 text-sm font-bold text-fuchsia-700 dark:text-fuchsia-300 cursor-default">
                  {uc}
                </motion.span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── INFINITE SCROLL GALLERY ── */}
      <section className="py-20 px-0 relative overflow-hidden">
        {/* Bg gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-fuchsia-50/30 to-transparent dark:via-fuchsia-950/10 pointer-events-none" />

        {/* Section heading */}
        <Reveal className="text-center mb-12 px-4">
          <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10">
            <span className="text-fuchsia-600 dark:text-fuchsia-400 text-[10px] font-black tracking-[0.4em] uppercase">Our Work</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
            Designs That <span className="text-fuchsia-600">Define</span>
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-3 text-base max-w-md mx-auto">
            A glimpse into brand identities, UI kits, and creative systems we've built.
          </p>
        </Reveal>

        {/* CSS for marquee */}
        <style>{`
          @keyframes marquee-left  { from { transform: translateX(0); }   to { transform: translateX(-50%); } }
          @keyframes marquee-right { from { transform: translateX(-50%); } to { transform: translateX(0); }   }
          .marquee-left  { animation: marquee-left  28s linear infinite; }
          .marquee-right { animation: marquee-right 32s linear infinite; }
          .marquee-left:hover,
          .marquee-right:hover { animation-play-state: paused; }
        `}</style>

        {/* ROW 1 — left scroll */}
        <div className="overflow-hidden mb-4 relative">
          <div className="flex gap-4 w-max marquee-left">
            {[
              { label: "Logo Design",         tag: "Brand Identity",   bg: "from-fuchsia-600 to-purple-700",     icon: Palette },
              { label: "Social Media Kit",    tag: "Marketing",        bg: "from-purple-600 to-fuchsia-800",     icon: Smartphone },
              { label: "Brand Guidelines",   tag: "Visual System",    bg: "from-fuchsia-700 to-pink-700",       icon: BookOpen },
              { label: "UI Visual Design",   tag: "Product Design",   bg: "from-violet-600 to-fuchsia-600",     icon: MonitorPlay },
              { label: "Motion Graphics",    tag: "Animation",        bg: "from-pink-600 to-fuchsia-700",       icon: Film },
              { label: "Packaging Design",   tag: "Brand & Print",    bg: "from-purple-700 to-violet-700",      icon: Package },
              { label: "Icon System",         tag: "Iconography",      bg: "from-fuchsia-500 to-purple-600",     icon: Shapes },
              { label: "Business Card",       tag: "Print Design",     bg: "from-violet-700 to-fuchsia-700",     icon: Briefcase },
              /* duplicate for seamless loop */
              { label: "Logo Design",         tag: "Brand Identity",   bg: "from-fuchsia-600 to-purple-700",     icon: Palette },
              { label: "Social Media Kit",    tag: "Marketing",        bg: "from-purple-600 to-fuchsia-800",     icon: Smartphone },
              { label: "Brand Guidelines",   tag: "Visual System",    bg: "from-fuchsia-700 to-pink-700",       icon: BookOpen },
              { label: "UI Visual Design",   tag: "Product Design",   bg: "from-violet-600 to-fuchsia-600",     icon: MonitorPlay },
              { label: "Motion Graphics",    tag: "Animation",        bg: "from-pink-600 to-fuchsia-700",       icon: Film },
              { label: "Packaging Design",   tag: "Brand & Print",    bg: "from-purple-700 to-violet-700",      icon: Package },
              { label: "Icon System",         tag: "Iconography",      bg: "from-fuchsia-500 to-purple-600",     icon: Shapes },
              { label: "Business Card",       tag: "Print Design",     bg: "from-violet-700 to-fuchsia-700",     icon: Briefcase },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex-shrink-0 w-56 h-36 rounded-2xl bg-gradient-to-br ${item.bg} p-5 flex flex-col justify-between shadow-xl shadow-fuchsia-500/20 border border-white/10 cursor-default select-none`}
              >
                <div className="flex items-start justify-between">
                  <item.icon className="w-8 h-8 text-white/90" />
                  <span className="text-[9px] font-black tracking-widest text-white/60 uppercase bg-white/10 px-2 py-0.5 rounded-full">{item.tag}</span>
                </div>
                <p className="text-white font-black text-base leading-tight">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 2 — right scroll */}
        <div className="overflow-hidden relative">
          <div className="flex gap-4 w-max marquee-right">
            {[
              { label: "Color Palette",       tag: "Brand System",    bg: "from-pink-600 to-fuchsia-600",       icon: Pipette },
              { label: "Typography System",  tag: "Type Design",      bg: "from-fuchsia-800 to-purple-800",     icon: Type },
              { label: "Product Mockup",      tag: "3D Branding",      bg: "from-violet-800 to-fuchsia-600",     icon: Box },
              { label: "App UI Design",       tag: "Mobile Design",    bg: "from-purple-800 to-pink-700",        icon: TabletSmartphone },
              { label: "Billboard Ad",        tag: "Out-of-Home",      bg: "from-fuchsia-600 to-violet-700",     icon: ImageIcon },
              { label: "Brand Mascot",        tag: "Illustration",     bg: "from-pink-700 to-fuchsia-800",       icon: Smile },
              { label: "Email Template",      tag: "Digital Design",   bg: "from-violet-600 to-purple-700",      icon: Mail },
              { label: "Annual Report",       tag: "Corporate",        bg: "from-fuchsia-700 to-violet-800",     icon: BarChart },
              /* duplicate */
              { label: "Color Palette",       tag: "Brand System",    bg: "from-pink-600 to-fuchsia-600",       icon: Pipette },
              { label: "Typography System",  tag: "Type Design",      bg: "from-fuchsia-800 to-purple-800",     icon: Type },
              { label: "Product Mockup",      tag: "3D Branding",      bg: "from-violet-800 to-fuchsia-600",     icon: Box },
              { label: "App UI Design",       tag: "Mobile Design",    bg: "from-purple-800 to-pink-700",        icon: TabletSmartphone },
              { label: "Billboard Ad",        tag: "Out-of-Home",      bg: "from-fuchsia-600 to-violet-700",     icon: ImageIcon },
              { label: "Brand Mascot",        tag: "Illustration",     bg: "from-pink-700 to-fuchsia-800",       icon: Smile },
              { label: "Email Template",      tag: "Digital Design",   bg: "from-violet-600 to-purple-700",      icon: Mail },
              { label: "Annual Report",       tag: "Corporate",        bg: "from-fuchsia-700 to-violet-800",     icon: BarChart },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex-shrink-0 w-56 h-36 rounded-2xl bg-gradient-to-br ${item.bg} p-5 flex flex-col justify-between shadow-xl shadow-fuchsia-500/20 border border-white/10 cursor-default select-none`}
              >
                <div className="flex items-start justify-between">
                  <item.icon className="w-8 h-8 text-white/90" />
                  <span className="text-[9px] font-black tracking-widest text-white/60 uppercase bg-white/10 px-2 py-0.5 rounded-full">{item.tag}</span>
                </div>
                <p className="text-white font-black text-base leading-tight">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white dark:from-zinc-950 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white dark:from-zinc-950 to-transparent z-10" />
      </section>


      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950" />
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-700/25 via-purple-600/15 to-fuchsia-700/25" />
              <div className="absolute top-4 right-8 w-40 h-40 rounded-full bg-fuchsia-600/15 blur-3xl" />
              <div className="absolute bottom-4 left-8 w-40 h-40 rounded-full bg-purple-700/15 blur-3xl" />
              {[...Array(5)].map((_, i) => (
                <motion.div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-fuchsia-400"
                  style={{ top: `${20 + i * 14}%`, left: `${6 + i * 16}%`, opacity: 0.4 }}
                  animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.6, 1] }}
                  transition={{ duration: 2.2 + i * 0.3, repeat: Infinity, delay: i * 0.5 }}
                />
              ))}
              <div className="relative z-10 p-12 md:p-16 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                  <Clock className="w-3.5 h-3.5 text-white/80" />
                  <span className="text-white/80 text-[10px] font-black tracking-[0.4em] uppercase">Ready in 15 Days</span>
                </div>
                <h2 className="text-4xl md:text-5xl xl:text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
                  Ready to Build a
                  <span className="block bg-gradient-to-r from-fuchsia-400 via-purple-400 to-fuchsia-300 bg-clip-text text-transparent">Powerful Brand?</span>
                </h2>
                <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto font-medium">
                  Let's create designs that leave a lasting impression and drive real business growth.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/contact")}
                    className="h-14 px-10 bg-gradient-to-r from-fuchsia-600 via-purple-500 to-fuchsia-400 hover:from-fuchsia-700 hover:to-fuchsia-500 text-white rounded-2xl font-black text-sm shadow-2xl shadow-fuchsia-600/40 uppercase tracking-widest border-0 flex items-center justify-center gap-2">
                    Build Your Brand <ArrowRight className="w-5 h-5" />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/projects")}
                    className="h-14 px-10 border border-white/20 text-white hover:bg-white/10 rounded-2xl font-black text-sm uppercase tracking-widest bg-transparent">
                    See Our Work
                  </motion.button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default GraphicsDesignBrandingPage;
