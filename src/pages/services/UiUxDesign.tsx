import React, { useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, CheckCircle, ChevronRight,
  Palette, MousePointer, Layers, Layout, Eye,
  Zap, Star, Clock, Shield, Monitor, Smartphone,
  Grid, BarChart2, Users, Crosshair, Activity,
} from "lucide-react";
import BlurBlob from "@/components/BlurBlob";
import { TimelineGlowLine } from "@/components/ui/TimelineGlowLine";
import { ShineBorder } from "@/components/ui/shine-border";

/* ─── Reveal ─────────────────────────────────────── */
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 44 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
};

/* ─── Glass Card ─────────────────────────────────── */
const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`relative backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] border border-white/50 dark:border-white/10 shadow-xl shadow-pink-900/5 dark:shadow-pink-900/20 hover:bg-white/80 dark:hover:bg-white/[0.07] transition-all duration-300 ${className}`}>
    <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-pink-600/5 via-transparent to-rose-800/5 pointer-events-none" />
    {children}
  </div>
);

/* ─── SVG: UI Mockup Dashboard ───────────────────── */
const UIMockupSVG: React.FC = () => (
  <svg viewBox="0 0 540 480" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <radialGradient id="uiGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#db2777" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#db2777" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="uiBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1a0010" />
        <stop offset="100%" stopColor="#0d0008" />
      </linearGradient>
      <linearGradient id="uiPink" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#db2777" />
        <stop offset="100%" stopColor="#9d174d" />
      </linearGradient>
      <linearGradient id="uiPinkLight" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f9a8d4" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
      <linearGradient id="uiCard1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#db277720" />
        <stop offset="100%" stopColor="#9d174d10" />
      </linearGradient>
      <filter id="uiGlowF">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>

    {/* BG glow */}
    <ellipse cx="270" cy="240" rx="230" ry="190" fill="url(#uiGlow)" opacity="0.6" />

    {/* Desktop frame */}
    <rect x="25" y="30" width="490" height="320" rx="18" fill="url(#uiBg)" />
    <rect x="25" y="30" width="490" height="320" rx="18" stroke="#db277730" strokeWidth="1.5" />
    {/* Screen top bar */}
    <rect x="25" y="30" width="490" height="44" rx="18" fill="#db277712" />
    <circle cx="57" cy="52" r="6" fill="#ef4444" opacity="0.8" />
    <circle cx="77" cy="52" r="6" fill="#f59e0b" opacity="0.8" />
    <circle cx="97" cy="52" r="6" fill="#22c55e" opacity="0.8" />
    {/* URL bar */}
    <rect x="180" y="40" width="200" height="24" rx="8" fill="#db27770d" stroke="#db277720" strokeWidth="1" />
    <text x="280" y="56" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#db2777" opacity="0.8">app.ulmind.design</text>

    {/* Left sidebar */}
    <rect x="35" y="84" width="80" height="256" rx="10" fill="#db27770a" stroke="#db277718" strokeWidth="1" />
    {/* Sidebar logo */}
    <circle cx="75" cy="104" r="14" fill="url(#uiPink)" opacity="0.9" />
    <text x="75" y="109" textAnchor="middle" fontFamily="system-ui" fontSize="13" fontWeight="900" fill="#fff">U</text>
    {/* Sidebar nav items */}
    {[
      { y: 130, label: "Dashboard", active: true },
      { y: 154, label: "Projects", active: false },
      { y: 178, label: "Analytics", active: false },
      { y: 202, label: "Users", active: false },
      { y: 226, label: "Settings", active: false },
    ].map((item, i) => (
      <g key={i}>
        {item.active && <rect x="38" y={item.y - 8} width="74" height="22" rx="8" fill="#db277722" />}
        <circle cx="54" cy={item.y + 3} r="4" fill={item.active ? "#db2777" : "#db277744"} />
        <text x="64" y={item.y + 7} fontFamily="system-ui" fontSize="8" fill={item.active ? "#fff" : "#64748b"} fontWeight={item.active ? "700" : "400"}>{item.label}</text>
      </g>
    ))}

    {/* Main content area */}
    {/* KPI cards */}
    {[
      { x: 130, label: "Users", val: "12.4K", trend: "+18%" },
      { x: 250, label: "Sessions", val: "48.2K", trend: "+24%" },
      { x: 370, label: "Conv. Rate", val: "6.8%", trend: "+9%" },
    ].map((c, i) => (
      <g key={i}>
        <rect x={c.x} y={88} width="108" height="68" rx="12" fill="url(#uiCard1)" stroke="#db277720" strokeWidth="1" />
        <text x={c.x + 54} y={108} textAnchor="middle" fontFamily="system-ui" fontSize="8" fontWeight="700" fill="#db2777" letterSpacing="1">{c.label}</text>
        <text x={c.x + 54} y={133} textAnchor="middle" fontFamily="system-ui" fontSize="20" fontWeight="900" fill="#fff">{c.val}</text>
        <text x={c.x + 54} y={148} textAnchor="middle" fontFamily="system-ui" fontSize="8" fontWeight="700" fill="#22c55e">{c.trend}</text>
      </g>
    ))}

    {/* Chart area */}
    <rect x="130" y="168" width="230" height="110" rx="12" fill="#db27770a" stroke="#db277715" strokeWidth="1" />
    <text x="146" y="186" fontFamily="system-ui" fontSize="8" fontWeight="700" fill="#db2777" letterSpacing="1.5">ENGAGEMENT FLOW</text>
    {/* Line chart */}
    <polyline points="150,250 170,230 195,238 220,218 248,224 272,200 295,210 325,195 350,205" stroke="#db2777" strokeWidth="2" fill="none" strokeLinecap="round" />
    <polyline points="150,260 170,248 195,252 220,240 248,246 272,232 295,238 325,228 350,234" stroke="#be185d44" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeDasharray="4 3" />
    {[150,170,195,220,248,272,295,325,350].map((x, i) => (
      <circle key={i} cx={x} cy={[250,230,238,218,224,200,210,195,205][i]} r="3" fill="#db2777" />
    ))}

    {/* Right panel */}
    <rect x="372" y="168" width="130" height="110" rx="12" fill="#db27770a" stroke="#db277715" strokeWidth="1" />
    <text x="388" y="186" fontFamily="system-ui" fontSize="8" fontWeight="700" fill="#db2777" letterSpacing="1.5">USER FLOW</text>
    {["Onboarding", "Dashboard", "Features", "Conversion"].map((step, i) => (
      <g key={i}>
        <circle cx="392" cy={200 + i * 20} r="5" fill="url(#uiPink)" opacity={0.9 - i * 0.15} />
        <text x="403" y={204 + i * 20} fontFamily="system-ui" fontSize="8" fill="#fff" opacity={0.9 - i * 0.1}>{step}</text>
        {i < 3 && <line x1="392" y1={206 + i * 20} x2="392" y2={214 + i * 20} stroke="#db277740" strokeWidth="1" strokeDasharray="2 2" />}
      </g>
    ))}

    {/* Bottom bar */}
    <rect x="130" y="290" width="372" height="36" rx="10" fill="#db27770a" stroke="#db277715" strokeWidth="1" />
    <circle cx="152" cy="308" r="8" fill="url(#uiPink)" opacity="0.8">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
    </circle>
    <text x="168" y="312" fontFamily="system-ui" fontSize="8" fontWeight="700" fill="#db2777">PROTOTYPE LIVE</text>
    <text x="280" y="312" fontFamily="system-ui" fontSize="8" fill="#64748b">Click to interact with the live design</text>
    <text x="472" y="312" fontFamily="system-ui" fontSize="8" fontWeight="700" fill="#22c55e">FIGMA</text>

    {/* Mobile phone mockup below */}
    <g transform="translate(30, 366)">
      <rect width="90" height="100" rx="14" fill="url(#uiBg)" stroke="#db277730" strokeWidth="1" />
      <rect x="30" y="6" width="30" height="5" rx="3" fill="#db277720" />
      <rect x="8" y="18" width="74" height="68" rx="8" fill="#db27770a" />
      {/* App screen content */}
      <rect x="14" y="22" width="62" height="10" rx="3" fill="url(#uiPink)" opacity="0.7" />
      <rect x="14" y="36" width="28" height="22" rx="4" fill="#db277715" stroke="#db277722" strokeWidth="0.8" />
      <rect x="48" y="36" width="28" height="22" rx="4" fill="#db277715" stroke="#db277722" strokeWidth="0.8" />
      <rect x="14" y="62" width="62" height="8" rx="2" fill="#db277715" />
      <circle cx="45" cy="92" r="5" fill="#db277720" stroke="#db277730" strokeWidth="1" />
    </g>

    {/* Tablet mockup */}
    <g transform="translate(136, 358)">
      <rect width="160" height="110" rx="14" fill="url(#uiBg)" stroke="#db277325" strokeWidth="1" />
      <rect x="10" y="12" width="140" height="88" rx="8" fill="#db27770a" />
      <rect x="18" y="18" width="124" height="24" rx="5" fill="url(#uiPink)" opacity="0.6" />
      <rect x="18" y="48" width="56" height="44" rx="6" fill="#db277715" stroke="#db277720" strokeWidth="0.8" />
      <rect x="82" y="48" width="60" height="20" rx="5" fill="#db277715" stroke="#db277720" strokeWidth="0.8" />
      <rect x="82" y="72" width="60" height="20" rx="5" fill="#db277715" stroke="#db277720" strokeWidth="0.8" />
      <circle cx="80" cy="105" r="5" fill="#db277720" />
    </g>

    {/* Design tokens floating */}
    <g transform="translate(316, 358)">
      <rect width="200" height="110" rx="14" fill="url(#uiBg)" stroke="#db277325" strokeWidth="1" />
      <text x="14" y="22" fontFamily="system-ui" fontSize="8" fontWeight="800" fill="#db2777" letterSpacing="2">DESIGN TOKENS</text>
      {[
        { label: "Primary", color: "#db2777" },
        { label: "Secondary", color: "#9d174d" },
        { label: "Accent", color: "#f9a8d4" },
        { label: "Background", color: "#1a0010" },
      ].map((t, i) => (
        <g key={i} transform={`translate(14, ${32 + i * 20})`}>
          <rect width="12" height="12" rx="3" fill={t.color} />
          <text x="18" y="10" fontFamily="system-ui" fontSize="8" fill="#94a3b8">{t.label}</text>
          <text x="90" y="10" fontFamily="monospace" fontSize="7" fill="#475569">{t.color}</text>
        </g>
      ))}
    </g>

    {/* Floating dots */}
    {[[60, 28], [500, 50], [40, 400], [515, 380]].map(([cx, cy], i) => (
      <circle key={i} cx={cx} cy={cy} r="3.5" fill="#db2777" opacity="0.5" filter="url(#uiGlowF)">
        <animate attributeName="opacity" values="0.3;0.9;0.3" dur={`${2 + i * 0.6}s`} repeatCount="indefinite" />
        <animate attributeName="r" values={`${3};${5};${3}`} dur={`${2 + i * 0.6}s`} repeatCount="indefinite" />
      </circle>
    ))}
  </svg>
);

/* ─── SVG: UX Research Map ───────────────────────── */
const UXResearchSVG: React.FC = () => (
  <svg viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="rxBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1a0010" />
        <stop offset="100%" stopColor="#0d0008" />
      </linearGradient>
      <linearGradient id="rxPink" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#db2777" />
        <stop offset="100%" stopColor="#be185d" />
      </linearGradient>
    </defs>

    <rect x="20" y="20" width="460" height="360" rx="20" fill="url(#rxBg)" />
    <rect x="20" y="20" width="460" height="360" rx="20" stroke="#db277720" strokeWidth="1.5" />
    <text x="250" y="52" textAnchor="middle" fontFamily="system-ui" fontSize="11" fontWeight="800" fill="#db2777" letterSpacing="2">UX JOURNEY MAP</text>

    {/* Journey stages */}
    {["Aware", "Consider", "Decide", "Onboard", "Retain"].map((stage, i) => (
      <g key={i} transform={`translate(${60 + i * 80}, 68)`}>
        <rect width="64" height="24" rx="8" fill="#db27771a" stroke="#db277730" strokeWidth="1" />
        <text x="32" y="16" textAnchor="middle" fontFamily="system-ui" fontSize="9" fontWeight="700" fill="#db2777">{stage}</text>
      </g>
    ))}

    {/* Emotion curve */}
    <path d="M80,200 C120,170 160,220 200,190 C240,160 280,210 320,180 C360,150 400,170 440,155"
      stroke="#db2777" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M80,200 C120,170 160,220 200,190 C240,160 280,210 320,180 C360,150 400,170 440,155"
      stroke="#db277722" strokeWidth="12" fill="none" strokeLinecap="round" />
    {[80, 160, 240, 320, 400].map((x, i) => {
      const ys = [200, 190, 180, 175, 165];
      return (
        <g key={i}>
          <circle cx={x} cy={ys[i]} r="8" fill="url(#rxPink)" opacity="0.9" />
          <circle cx={x} cy={ys[i]} r="14" stroke="#db277740" strokeWidth="1" fill="none" />
          <text x={x} y={ys[i] + 4} textAnchor="middle" fontFamily="system-ui" fontSize="8" fontWeight="900" fill="#fff">{i + 1}</text>
        </g>
      );
    })}

    {/* Pain points */}
    <text x="38" y="235" fontFamily="system-ui" fontSize="8" fontWeight="700" fill="#64748b" letterSpacing="1.5">PAIN POINTS</text>
    {["Confusing nav", "Slow load", "Complex forms", "Poor CTA", "No feedback"].map((p, i) => (
      <g key={i} transform={`translate(${60 + i * 80}, 248)`}>
        <rect width="64" height="36" rx="8" fill="#ef444410" stroke="#ef444430" strokeWidth="1" />
        <text x="32" y="14" textAnchor="middle" fontFamily="system-ui" fontSize="7" fill="#fca5a5">{p.split(" ")[0]}</text>
        {p.split(" ")[1] && <text x="32" y="27" textAnchor="middle" fontFamily="system-ui" fontSize="7" fill="#fca5a5">{p.split(" ").slice(1).join(" ")}</text>}
      </g>
    ))}

    {/* Solutions */}
    <text x="38" y="310" fontFamily="system-ui" fontSize="8" fontWeight="700" fill="#64748b" letterSpacing="1.5">SOLUTIONS</text>
    {["Clear menu", "Lazy load", "Step forms", "Bold CTAs", "Toasts"].map((s, i) => (
      <g key={i} transform={`translate(${60 + i * 80}, 320)`}>
        <rect width="64" height="36" rx="8" fill="#db277710" stroke="#db277728" strokeWidth="1" />
        <text x="32" y="14" textAnchor="middle" fontFamily="system-ui" fontSize="7" fill="#f9a8d4">{s.split(" ")[0]}</text>
        {s.split(" ")[1] && <text x="32" y="27" textAnchor="middle" fontFamily="system-ui" fontSize="7" fill="#f9a8d4">{s.split(" ").slice(1).join(" ")}</text>}
      </g>
    ))}
  </svg>
);

/* ─── Phases ─────────────────────────────────────── */
const phases = [
  {
    phase: "PHASE 1", label: "Research", days: "Day 1–3",
    color: "#db2777", borderColor: "border-pink-600/40", bg: "from-pink-600/10 to-pink-600/5", dot: "#db2777",
    days_data: [
      { day: "DAY 1 — USER RESEARCH", items: ["User behavior analysis", "Persona creation", "Pain point identification"] },
      { day: "DAY 2–3 — DISCOVERY", items: ["Competitor UX analysis", "Product understanding", "User journey mapping"] },
    ],
  },
  {
    phase: "PHASE 2", label: "Wireframing", days: "Day 4–5",
    color: "#be185d", borderColor: "border-pink-700/40", bg: "from-pink-700/10 to-pink-700/5", dot: "#be185d",
    days_data: [
      { day: "DAY 4–5 — WIREFRAMES", items: ["Low-fidelity wireframes", "Information architecture", "User flow structuring", "Layout planning"] },
    ],
  },
  {
    phase: "PHASE 3", label: "Prototyping", days: "Day 6–7",
    color: "#9d174d", borderColor: "border-pink-800/40", bg: "from-pink-800/10 to-pink-800/5", dot: "#9d174d",
    days_data: [
      { day: "DAY 6–7 — PROTOTYPES", items: ["Interactive prototypes in Figma", "User flow simulation", "Clickable UI flows", "Initial usability testing"] },
    ],
  },
  {
    phase: "PHASE 4", label: "UI Design", days: "Day 8–11",
    color: "#831843", borderColor: "border-rose-900/40", bg: "from-rose-900/10 to-rose-900/5", dot: "#831843",
    days_data: [
      { day: "DAY 8–9 — HIGH-FIDELITY", items: ["High-fidelity UI design", "Color & typography system", "Component & icon design"] },
      { day: "DAY 10–11 — POLISH", items: ["Micro-interactions design", "Responsive screen variants", "Dark & light mode"] },
    ],
  },
  {
    phase: "PHASE 5", label: "Testing & Refinement", days: "Day 12–13",
    color: "#ec4899", borderColor: "border-pink-400/40", bg: "from-pink-400/10 to-pink-400/5", dot: "#ec4899",
    days_data: [
      { day: "DAY 12–13 — TESTING", items: ["Usability testing sessions", "Feedback implementation", "Heatmap & behavior review", "Design improvements"] },
    ],
  },
  {
    phase: "PHASE 6", label: "Design System & Handover", days: "Day 14–15",
    color: "#db2777", borderColor: "border-pink-600/40", bg: "from-pink-600/10 to-pink-600/5", dot: "#db2777",
    days_data: [
      { day: "DAY 14–15 — DELIVERY", items: ["Design system creation", "Component library handoff", "Developer specs & tokens", "Final Figma file delivery"] },
    ],
  },
];

const toolStack = [
  { name: "Figma", desc: "UI design & prototyping", icon: Layers, color: "from-pink-600 to-pink-800" },
  { name: "Maze / UserTesting", desc: "Usability testing", icon: Users, color: "from-pink-700 to-rose-800" },
  { name: "Hotjar", desc: "Heatmaps & recordings", icon: Activity, color: "from-pink-500 to-pink-700" },
  { name: "FigJam", desc: "Journey & flow mapping", icon: Grid, color: "from-rose-700 to-pink-700" },
  { name: "Zeplin / Storybook", desc: "Developer handoff", icon: Monitor, color: "from-pink-600 to-pink-500" },
  { name: "Principle / Framer", desc: "Interaction prototypes", icon: Zap, color: "from-rose-800 to-pink-700" },
];

const coreServices = [
  { icon: Users, title: "User Research", desc: "Behavior analysis, persona creation, and pain point identification grounded in real data." },
  { icon: Layout, title: "Wireframing", desc: "Low-fidelity layouts, information architecture, and UX flow structuring." },
  { icon: MousePointer, title: "Prototyping", desc: "Interactive Figma prototypes and clickable UI flows for user testing and validation." },
  { icon: Palette, title: "Design Systems", desc: "Reusable component libraries, style guides, and scalable UI systems for developers." },
];

const useCases = ["SaaS Platforms", "Mobile Applications", "E-commerce Websites", "Landing Pages", "Admin Dashboards"];

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
                  <ChevronRight className="w-3.5 h-3.5" />{d.day}
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
const UiUxDesignPage: React.FC = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    document.title = "UI/UX Design | ULMiND";
    return () => { document.title = "ULMiND"; };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300 overflow-x-hidden">

      {/* ── BACK ── */}
      <div className="max-w-7xl mx-auto px-6 pt-8 relative z-20">
        <motion.button onClick={() => navigate(-1)} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-sm font-semibold text-pink-600 dark:text-pink-400 hover:gap-3 transition-all duration-200 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />Back to Services
        </motion.button>
      </div>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-16 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-100/70 via-rose-50/20 to-transparent dark:from-pink-950/30 dark:via-rose-950/10 dark:to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-pink-500/10 to-transparent dark:from-pink-700/14 rounded-full blur-3xl pointer-events-none" />
        <BlurBlob position={{ top: "15%", left: "2%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-pink-600" opacityClass="opacity-10" />
        <BlurBlob position={{ top: "55%", left: "65%" }} size={{ width: "350px", height: "350px" }} colorClass="bg-rose-700" opacityClass="opacity-8" />

        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-pink-500/30 bg-pink-500/10 backdrop-blur-md">
                <MousePointer className="w-3.5 h-3.5 text-pink-600" />
                <span className="text-pink-700 dark:text-pink-400 text-[10px] font-black tracking-[0.4em] uppercase">UI/UX Design</span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-black text-zinc-900 dark:text-white leading-none tracking-tighter uppercase mb-6">
                Experiences
                <span className="block bg-gradient-to-r from-pink-600 via-rose-500 to-pink-400 bg-clip-text text-transparent">Users Love</span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8 max-w-lg font-medium">
                We design intuitive, user-centered digital experiences that look premium and perform exceptionally — from research to full design systems.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  { icon: Eye, label: "User-Centered" },
                  { icon: Crosshair, label: "Conversion Focused" },
                  { icon: Smartphone, label: "Responsive" },
                  { icon: Zap, label: "Pixel-Perfect" },
                ].map(({ icon: Icon, label }) => (
                  <GlassCard key={label} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-pink-200/40 dark:border-pink-900/30">
                    <Icon className="w-4 h-4 text-pink-600" />
                    <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{label}</span>
                  </GlassCard>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="flex flex-wrap gap-4">
                <motion.button onClick={() => navigate("/contact")} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="h-14 px-8 bg-gradient-to-r from-pink-600 via-rose-500 to-pink-400 hover:from-pink-700 hover:to-rose-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-pink-600/30 uppercase tracking-widest flex items-center gap-2 border-0">
                  Design Your Product <ArrowRight className="w-5 h-5" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  onClick={() => document.getElementById("roadmap-uiux")?.scrollIntoView({ behavior: "smooth" })}
                  className="h-14 px-8 border border-pink-400 dark:border-pink-700/50 text-pink-700 dark:text-pink-300 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all bg-transparent">
                  View Roadmap
                </motion.button>
              </div>
            </Reveal>
          </motion.div>

          <Reveal delay={0.3}>
            <motion.div animate={{ y: [0, -18, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="flex justify-center">
              <div className="w-full max-w-xl" style={{ filter: "drop-shadow(0 20px 60px rgba(219,39,119,0.30))" }}>
                <UIMockupSVG />
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── DESIGN FLOW ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-pink-500/20 bg-pink-500/10">
              <span className="text-pink-600 dark:text-pink-400 text-[10px] font-black tracking-[0.4em] uppercase">Pipeline</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
              Design <span className="text-pink-600">Flow</span>
            </h2>
          </Reveal>
          <div className="flex flex-wrap justify-center items-center gap-2">
            {["Research", "Wireframe", "Prototype", "UI Design", "Testing", "Final Delivery"].map((step, i, arr) => (
              <React.Fragment key={i}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} whileHover={{ scale: 1.06, y: -4 }}>
                  <GlassCard className="px-5 py-3 rounded-xl border border-pink-300/30 dark:border-pink-800/30 bg-pink-500/8">
                    <span className="text-sm font-black uppercase tracking-wide text-pink-700 dark:text-pink-300">{step}</span>
                  </GlassCard>
                </motion.div>
                {i < arr.length - 1 && <ArrowRight className="w-4 h-4 text-pink-400 flex-shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-50/40 to-transparent dark:via-pink-950/10 pointer-events-none" />
        <BlurBlob position={{ top: "40%", left: "75%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-pink-600" opacityClass="opacity-8" />

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
          <Reveal>
            <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
              <div className="w-full max-w-lg mx-auto" style={{ filter: "drop-shadow(0 15px 40px rgba(219,39,119,0.22))" }}>
                <UXResearchSVG />
              </div>
            </motion.div>
          </Reveal>

          <div>
            <Reveal>
              <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-pink-600/20 bg-pink-600/10">
                <span className="text-pink-700 dark:text-pink-400 text-[10px] font-black tracking-[0.4em] uppercase">Deliverables</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-8">
                What You <span className="text-pink-600">Get</span>
              </h2>
            </Reveal>
            <div className="space-y-3">
              {[
                "Complete UI/UX design system",
                "User research & journey mapping",
                "Wireframes & interactive prototypes",
                "High-fidelity UI design",
                "Conversion-focused interfaces",
                "Scalable design systems",
              ].map((item, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <motion.div whileHover={{ x: 8 }}>
                    <GlassCard className="flex items-center gap-4 p-4 rounded-xl border border-zinc-200/50 dark:border-white/5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-600 to-rose-800 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">{item}</span>
                    </GlassCard>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ROADMAP ── */}
      <section id="roadmap-uiux" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <BlurBlob position={{ top: "20%", left: "3%" }} size={{ width: "500px", height: "500px" }} colorClass="bg-pink-600" opacityClass="opacity-6" />
        <BlurBlob position={{ top: "65%", left: "78%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-rose-700" opacityClass="opacity-6" />

        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-pink-500/20 bg-pink-500/10">
              <span className="text-pink-600 dark:text-pink-400 text-[10px] font-black tracking-[0.4em] uppercase">Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-4">
              Design <span className="text-pink-600">Roadmap</span>
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">Day 1 – Day 15, structured UX delivery</p>
          </Reveal>

          <div className="relative">
            <TimelineGlowLine colors={phases.map(p => p.color)} />
            <div className="space-y-12">
              {phases.map((phase, i) => <PhaseCard key={i} phase={phase} index={i} />)}
            </div>
          </div>
        </div>
      </section>

      {/* ── TOOL STACK ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-50/30 to-transparent dark:via-pink-950/10 pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <Reveal className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-pink-500/20 bg-pink-500/10">
              <span className="text-pink-600 dark:text-pink-400 text-[10px] font-black tracking-[0.4em] uppercase">Tools</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
              Design <span className="text-pink-600">Toolkit</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {toolStack.map((item, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <motion.div whileHover={{ scale: 1.04, y: -4 }}>
                  <GlassCard className="p-6 rounded-2xl border border-zinc-200/50 dark:border-white/10">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-xs font-black text-pink-600 dark:text-pink-400 uppercase tracking-widest mb-1">{item.name}</p>
                    <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">{item.desc}</p>
                  </GlassCard>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CORE SERVICES ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <BlurBlob position={{ top: "30%", left: "75%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-pink-600" opacityClass="opacity-8" />
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-pink-500/20 bg-pink-500/10">
              <span className="text-pink-600 dark:text-pink-400 text-[10px] font-black tracking-[0.4em] uppercase">Services</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
              Core <span className="text-pink-600">Services</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreServices.map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div whileHover={{ scale: 1.04, y: -6 }} className="h-full">
                  <GlassCard className="p-6 rounded-3xl border border-zinc-200/60 dark:border-white/10 h-full">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-600 to-rose-800 flex items-center justify-center mb-5 shadow-lg shadow-pink-600/30">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-black text-zinc-900 dark:text-white text-lg mb-2">{title}</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{desc}</p>
                  </GlassCard>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── UX + ANALYTICS BENTO ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
              UX + <span className="text-pink-600">Analytics</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Activity, title: "Heatmap Analysis", desc: "Understand where users click, scroll, and drop off with Hotjar heatmaps.", span: "" },
              { icon: Users, title: "User Testing", desc: "Real-session recordings and moderated tests to validate every design decision.", span: "" },
              { icon: BarChart2, title: "Conversion Optimization", desc: "CTA testing, funnel-based UI, and behavior-driven layout changes.", span: "" },
              { icon: Eye, title: "Behavior Insights", desc: "Data-driven UX improvements based on actual user interaction patterns.", span: "md:col-span-2" },
              { icon: Crosshair, title: "UX Audits", desc: "Expert reviews of existing products to identify friction and improvement opportunities.", span: "" },
            ].map(({ icon: Icon, title, desc, span }, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <motion.div whileHover={{ scale: 1.03, y: -4 }} className={`h-full ${span}`}>
                  <GlassCard className="p-6 rounded-2xl border border-pink-200/40 dark:border-pink-900/30 h-full">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-600 to-rose-800 flex items-center justify-center mb-4 shadow-md shadow-pink-600/20">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-black text-zinc-900 dark:text-white text-base mb-2">{title}</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{desc}</p>
                  </GlassCard>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US + QUALITY ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <BlurBlob position={{ top: "30%", left: "0%" }} size={{ width: "500px", height: "500px" }} colorClass="bg-pink-600" opacityClass="opacity-6" />
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          <Reveal>
            <div className="p-8 rounded-3xl bg-gradient-to-br from-pink-600 via-rose-600 to-pink-800 text-white shadow-2xl shadow-pink-600/30 h-full">
              <h2 className="text-3xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                <Star className="w-7 h-7" /> Why Choose Us
              </h2>
              <ul className="space-y-4">
                {["User-first design approach", "Business-focused UX strategy", "Clean and modern UI systems", "Scalable design components", "Long-term design support"].map((item, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="flex items-center gap-3 text-white/90 font-semibold">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 text-white" />{item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <ShineBorder borderRadius={24} borderWidth={1} color={["#db2777", "#be185d", "#ec4899"]} className="w-full h-full">
              <GlassCard className="p-8 rounded-3xl border border-zinc-200/50 dark:border-white/10 h-full">
                <h2 className="text-3xl font-black uppercase tracking-tight text-zinc-900 dark:text-white mb-6 flex items-center gap-3">
                  <Shield className="w-7 h-7 text-pink-600" /> Quality Standards
                </h2>
                <div className="space-y-4">
                  {[
                    { label: "Pixel-perfect design output", icon: Crosshair },
                    { label: "Cross-device compatibility", icon: Smartphone },
                    { label: "Consistent design patterns", icon: Grid },
                    { label: "Industry-standard Figma files", icon: Layers },
                  ].map(({ label, icon: Icon }, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                      <GlassCard className="flex items-center gap-3 p-4 rounded-xl border border-zinc-200/50 dark:border-white/5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-600 to-rose-800 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">{label}</span>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
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
                <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.06 }} transition={{ delay: i * 0.07 }} viewport={{ once: true }}>
                  <GlassCard className="px-5 py-2.5 rounded-full border border-pink-300/40 dark:border-pink-700/30">
                    <span className="text-sm font-bold text-pink-700 dark:text-pink-300">{uc}</span>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950" />
              <div className="absolute inset-0 bg-gradient-to-r from-pink-700/25 via-rose-700/15 to-pink-700/25" />
              <div className="absolute top-4 right-8 w-40 h-40 rounded-full bg-pink-600/15 blur-3xl" />
              <div className="absolute bottom-4 left-8 w-40 h-40 rounded-full bg-rose-800/15 blur-3xl" />
              {[...Array(5)].map((_, i) => (
                <motion.div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-pink-400"
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
                  A Product That
                  <span className="block bg-gradient-to-r from-pink-400 via-rose-400 to-pink-300 bg-clip-text text-transparent">Users Love to Use</span>
                </h2>
                <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto font-medium">
                  Let's design an experience that converts, retains, and delights users at every touchpoint.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/contact")}
                    className="h-14 px-10 bg-gradient-to-r from-pink-600 via-rose-500 to-pink-400 hover:from-pink-700 hover:to-rose-600 text-white rounded-2xl font-black text-sm shadow-2xl shadow-pink-600/40 uppercase tracking-widest border-0 flex items-center justify-center gap-2">
                    Design Your Product <ArrowRight className="w-5 h-5" />
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

export default UiUxDesignPage;
