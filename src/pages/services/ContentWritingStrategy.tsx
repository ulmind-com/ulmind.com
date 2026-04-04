import React, { useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, CheckCircle, ChevronRight,
  PenTool, TrendingUp, Search, BarChart3, FileText,
  MessageSquare, Target, Zap, Star, Clock, Shield,
  BookOpen, Megaphone, Globe, Activity,
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

/* ─── Glassmorphism wrapper ───────────────────────── */
const GlassCard: React.FC<{ children: React.ReactNode; className?: string; hover?: boolean }> = ({ children, className = "", hover = true }) => (
  <div className={`relative backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] border border-white/40 dark:border-white/10 shadow-xl shadow-orange-900/5 dark:shadow-orange-900/20 ${hover ? "hover:bg-white/80 dark:hover:bg-white/[0.07] transition-all duration-300" : ""} ${className}`}>
    <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-orange-500/5 via-transparent to-red-800/5 pointer-events-none" />
    {children}
  </div>
);

/* ─── SVG: Content Dashboard ──────────────────────── */
const ContentDashboardSVG: React.FC = () => (
  <svg viewBox="0 0 540 480" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <radialGradient id="cwGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#c2410c" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#c2410c" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="cwBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1c0a00" />
        <stop offset="100%" stopColor="#0f0500" />
      </linearGradient>
      <linearGradient id="cwOrange" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ea580c" />
        <stop offset="100%" stopColor="#9a3412" />
      </linearGradient>
      <linearGradient id="cwBar1" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#ea580c" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#ea580c" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="cwBar2" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#c2410c" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#c2410c" stopOpacity="0.8" />
      </linearGradient>
      <linearGradient id="cwBar3" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#7c2d12" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#fb923c" stopOpacity="0.7" />
      </linearGradient>
      <filter id="cwGlowF">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <clipPath id="frameClip"><rect x="30" y="20" width="480" height="440" rx="22" /></clipPath>
    </defs>

    {/* BG glow */}
    <ellipse cx="270" cy="240" rx="220" ry="190" fill="url(#cwGlow)" opacity="0.5" />

    {/* Main frame */}
    <rect x="30" y="20" width="480" height="440" rx="22" fill="url(#cwBg)" />
    <rect x="30" y="20" width="480" height="440" rx="22" stroke="#ea580c22" strokeWidth="1.5" />

    {/* Top bar */}
    <rect x="30" y="20" width="480" height="46" rx="22" fill="#ea580c12" />
    <circle cx="64" cy="43" r="6" fill="#ef4444" opacity="0.8" />
    <circle cx="84" cy="43" r="6" fill="#f59e0b" opacity="0.8" />
    <circle cx="104" cy="43" r="6" fill="#22c55e" opacity="0.8" />
    <text x="260" y="49" textAnchor="middle" fontFamily="system-ui" fontSize="12" fontWeight="800" fill="#ea580c" letterSpacing="2">CONTENT ANALYTICS</text>

    {/* Metric cards row */}
    {[
      { x: 50, label: "TRAFFIC", val: "+187%", sub: "vs last month" },
      { x: 200, label: "RANK", val: "#1", sub: "Google position" },
      { x: 350, label: "CONVERSIONS", val: "34%", sub: "CTR increase" },
    ].map((m, i) => (
      <g key={i} transform={`translate(${m.x}, 84)`}>
        <rect width="124" height="74" rx="14" fill="#ea580c0a" stroke="#ea580c25" strokeWidth="1" />
        <rect width="124" height="74" rx="14" fill="url(#cwBg)" opacity="0.3" />
        <text x="62" y="22" textAnchor="middle" fontFamily="system-ui" fontSize="8" fontWeight="700" fill="#ea580c" letterSpacing="1.5">{m.label}</text>
        <text x="62" y="50" textAnchor="middle" fontFamily="system-ui" fontSize="22" fontWeight="900" fill="#fff">{m.val}</text>
        <text x="62" y="64" textAnchor="middle" fontFamily="system-ui" fontSize="8" fill="#64748b">{m.sub}</text>
      </g>
    ))}

    {/* SEO keywords section */}
    <g transform="translate(50, 178)">
      <rect width="200" height="140" rx="14" fill="#ea580c08" stroke="#ea580c20" strokeWidth="1" />
      <text x="16" y="22" fontFamily="system-ui" fontSize="9" fontWeight="800" fill="#ea580c" letterSpacing="2">SEO KEYWORDS</text>
      {[
        { kw: "brand strategy", vol: "12K", diff: "Med" },
        { kw: "content marketing", vol: "45K", diff: "High" },
        { kw: "SEO copywriting", vol: "8K", diff: "Low" },
        { kw: "digital growth", vol: "22K", diff: "Med" },
      ].map((k, i) => (
        <g key={i} transform={`translate(12, ${36 + i * 26})`}>
          <rect width="176" height="20" rx="6" fill="#ea580c0c" />
          <text x="10" y="14" fontFamily="system-ui" fontSize="9" fill="#fff" opacity="0.85">{k.kw}</text>
          <text x="110" y="14" fontFamily="monospace" fontSize="8" fill="#ea580c">{k.vol}</text>
          <text x="148" y="14" fontFamily="system-ui" fontSize="8" fill={k.diff === "Low" ? "#22c55e" : k.diff === "High" ? "#ef4444" : "#f59e0b"} fontWeight="700">{k.diff}</text>
        </g>
      ))}
    </g>

    {/* Traffic chart */}
    <g transform="translate(270, 178)">
      <rect width="220" height="140" rx="14" fill="#ea580c08" stroke="#ea580c20" strokeWidth="1" />
      <text x="16" y="22" fontFamily="system-ui" fontSize="9" fontWeight="800" fill="#ea580c" letterSpacing="2">TRAFFIC GROWTH</text>
      {/* Bars */}
      {[
        { x: 20, h: 40, c: "url(#cwBar3)" },
        { x: 48, h: 55, c: "url(#cwBar2)" },
        { x: 76, h: 48, c: "url(#cwBar1)" },
        { x: 104, h: 72, c: "url(#cwBar2)" },
        { x: 132, h: 60, c: "url(#cwBar3)" },
        { x: 160, h: 88, c: "url(#cwBar1)" },
        { x: 188, h: 76, c: "url(#cwBar2)" },
      ].map((b, i) => (
        <rect key={i} x={b.x} y={110 - b.h} width="22" height={b.h} rx="5" fill={b.c} />
      ))}
      <line x1="16" y1="111" x2="214" y2="111" stroke="#ea580c25" strokeWidth="1" />
    </g>

    {/* Blog post cards */}
    <g transform="translate(50, 338)">
      <text x="0" y="14" fontFamily="system-ui" fontSize="9" fontWeight="800" fill="#ea580c" letterSpacing="2">RECENT ARTICLES</text>
      {[
        { title: "10 Growth Hacks for SaaS Brands", tag: "SEO", reads: "2.4K" },
        { title: "Content Funnel Strategy 2025", tag: "Strategy", reads: "1.8K" },
      ].map((p, i) => (
        <g key={i} transform={`translate(0, ${24 + i * 52})`}>
          <rect width="440" height="44" rx="10" fill="#ea580c0a" stroke="#ea580c18" strokeWidth="1" />
          <rect x="0" y="0" width="4" height="44" rx="2" fill="url(#cwOrange)" />
          <text x="16" y="18" fontFamily="Georgia, serif" fontSize="11" fontWeight="700" fill="#fff" opacity="0.9">{p.title}</text>
          <rect x="16" y="24" width={p.tag.length * 7 + 12} height="14" rx="4" fill="#ea580c22" />
          <text x="22" y="35" fontFamily="system-ui" fontSize="8" fontWeight="700" fill="#ea580c">{p.tag}</text>
          <text x="380" y="26" textAnchor="end" fontFamily="system-ui" fontSize="9" fill="#64748b">{p.reads} reads</text>
        </g>
      ))}
    </g>

    {/* Live indicator */}
    <circle cx="490" cy="43" r="5" fill="#22c55e">
      <animate attributeName="opacity" values="1;0.3;1" dur="1.6s" repeatCount="indefinite" />
    </circle>
    <text x="476" y="47" textAnchor="end" fontFamily="system-ui" fontSize="8" fontWeight="700" fill="#22c55e">LIVE</text>

    {/* Floating dots */}
    {[[80, 60], [450, 130], [160, 450], [490, 380]].map(([cx, cy], i) => (
      <circle key={i} cx={cx} cy={cy} r="3" fill="#ea580c" opacity="0.5" filter="url(#cwGlowF)">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
      </circle>
    ))}
  </svg>
);

/* ─── SVG: Strategy Map Illustration ─────────────── */
const StrategyMapSVG: React.FC = () => (
  <svg viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="smBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1c0a00" />
        <stop offset="100%" stopColor="#0f0500" />
      </linearGradient>
      <linearGradient id="smNode" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ea580c" />
        <stop offset="100%" stopColor="#c2410c" />
      </linearGradient>
      <linearGradient id="smLine" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#ea580c" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#ea580c" stopOpacity="0.1" />
      </linearGradient>
    </defs>

    <rect x="20" y="20" width="460" height="360" rx="20" fill="url(#smBg)" />
    <rect x="20" y="20" width="460" height="360" rx="20" stroke="#ea580c20" strokeWidth="1.5" />

    {/* Title */}
    <text x="250" y="52" textAnchor="middle" fontFamily="system-ui" fontSize="11" fontWeight="800" fill="#ea580c" letterSpacing="2">CONTENT STRATEGY MAP</text>

    {/* Central node */}
    <circle cx="250" cy="200" r="42" fill="#ea580c15" stroke="#ea580c44" strokeWidth="1.5" />
    <circle cx="250" cy="200" r="28" fill="url(#smNode)" opacity="0.9" />
    <text x="250" y="196" textAnchor="middle" fontFamily="system-ui" fontSize="9" fontWeight="900" fill="#fff">CONTENT</text>
    <text x="250" y="210" textAnchor="middle" fontFamily="system-ui" fontSize="9" fontWeight="900" fill="#fff">STRATEGY</text>

    {/* Satellite nodes */}
    {[
      { cx: 100, cy: 110, label: "SEO", sub: "Keywords" },
      { cx: 390, cy: 110, label: "COPY", sub: "Conversions" },
      { cx: 70, cy: 260, label: "SOCIAL", sub: "Engagement" },
      { cx: 410, cy: 260, label: "BLOG", sub: "Authority" },
      { cx: 250, cy: 330, label: "EMAIL", sub: "Nurture" },
    ].map((n, i) => (
      <g key={i}>
        <line x1={n.cx} y1={n.cy} x2={250} y2={200} stroke="url(#smLine)" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.6" />
        <circle cx={n.cx} cy={n.cy} r="28" fill="#ea580c12" stroke="#ea580c33" strokeWidth="1" />
        <circle cx={n.cx} cy={n.cy} r="28" fill="#1c0a00" opacity="0.6" />
        <text x={n.cx} y={n.cy - 4} textAnchor="middle" fontFamily="system-ui" fontSize="9" fontWeight="800" fill="#ea580c">{n.label}</text>
        <text x={n.cx} y={n.cy + 10} textAnchor="middle" fontFamily="system-ui" fontSize="7.5" fill="#94a3b8">{n.sub}</text>
        {/* Travelling dot on each connection */}
        <circle r="3" fill="#ea580c" opacity="0.8">
          <animateMotion dur={`${2 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.6}s`}>
            <mpath xlinkHref={`#smpath-${i}`} />
          </animateMotion>
          <animate attributeName="opacity" values="0;1;0" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
        </circle>
        <path id={`smpath-${i}`} d={`M${n.cx},${n.cy} L250,200`} fill="none" />
      </g>
    ))}

    {/* Pulsing ring on center */}
    <circle cx="250" cy="200" r="52" stroke="#ea580c" strokeWidth="1" fill="none" opacity="0.15">
      <animate attributeName="r" values="46;64;46" dur="3s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.2;0;0.2" dur="3s" repeatCount="indefinite" />
    </circle>
  </svg>
);

/* ─── Phase Data ─────────────────────────────────── */
const phases = [
  {
    phase: "PHASE 1", label: "Discovery", days: "Day 1–3",
    color: "#ea580c", borderColor: "border-orange-600/40", bg: "from-orange-600/10 to-orange-600/5", dot: "#ea580c",
    days_data: [
      { day: "DAY 1 — BUSINESS AUDIT", items: ["Business goals & value proposition", "Target audience profiling", "Existing content audit"] },
      { day: "DAY 2–3 — RESEARCH", items: ["Competitor content analysis", "Industry tone & voice study", "Content gap identification"] },
    ],
  },
  {
    phase: "PHASE 2", label: "Strategy", days: "Day 4–6",
    color: "#c2410c", borderColor: "border-orange-700/40", bg: "from-orange-700/10 to-orange-700/5", dot: "#c2410c",
    days_data: [
      { day: "DAY 4–5 — KEYWORD RESEARCH", items: ["Target keyword identification", "Search intent mapping", "Content funnel planning"] },
      { day: "DAY 6 — CONTENT PLAN", items: ["Topic clustering", "Content calendar creation", "Platform-specific strategy"] },
    ],
  },
  {
    phase: "PHASE 3", label: "Content Creation", days: "Day 7–10",
    color: "#9a3412", borderColor: "border-orange-800/40", bg: "from-orange-800/10 to-orange-800/5", dot: "#9a3412",
    days_data: [
      { day: "DAY 7–8 — CORE CONTENT", items: ["Website copywriting", "Blog & article writing", "Product/service descriptions"] },
      { day: "DAY 9–10 — SUPPORTING CONTENT", items: ["Social media content", "Email sequences", "Sales & landing page copy"] },
    ],
  },
  {
    phase: "PHASE 4", label: "Optimization", days: "Day 11–12",
    color: "#7c2d12", borderColor: "border-red-900/40", bg: "from-red-900/10 to-red-900/5", dot: "#7c2d12",
    days_data: [
      { day: "DAY 11–12 — SEO & POLISH", items: ["On-page SEO optimization", "Internal linking structure", "Meta tags & descriptions", "Readability improvements"] },
    ],
  },
  {
    phase: "PHASE 5", label: "Publishing", days: "Day 13–14",
    color: "#fb923c", borderColor: "border-orange-400/40", bg: "from-orange-400/10 to-orange-400/5", dot: "#fb923c",
    days_data: [
      { day: "DAY 13–14 — DELIVERY", items: ["CMS upload & formatting", "Performance tracking setup", "Analytics integration"] },
    ],
  },
  {
    phase: "PHASE 6", label: "Tracking & Improvement", days: "Day 15",
    color: "#ea580c", borderColor: "border-orange-600/40", bg: "from-orange-600/10 to-orange-600/5", dot: "#ea580c",
    days_data: [
      { day: "DAY 15 — REVIEW", items: ["Analytics dashboard review", "Performance reporting", "Content refinement plan", "Future strategy handover"] },
    ],
  },
];

const toolStack = [
  { category: "SEO Tools", tech: "Ahrefs / SEMrush", icon: Search, color: "from-orange-600 to-orange-800" },
  { category: "CMS", tech: "WordPress / Webflow", icon: Globe, color: "from-orange-700 to-red-800" },
  { category: "Analytics", tech: "Google Analytics 4", icon: BarChart3, color: "from-orange-500 to-orange-700" },
  { category: "Writing AI", tech: "GPT + Human-edited", icon: PenTool, color: "from-red-700 to-orange-700" },
  { category: "Social", tech: "Buffer / Hootsuite", icon: Megaphone, color: "from-orange-600 to-orange-500" },
  { category: "Email", tech: "Mailchimp / Klaviyo", icon: MessageSquare, color: "from-red-800 to-orange-700" },
];

const coreServices = [
  { icon: Search, title: "SEO Content Writing", desc: "Blog posts, website content, and keyword-rich articles engineered to rank and convert." },
  { icon: FileText, title: "Technical Copywriting", desc: "Product docs, SaaS content, and API documentation that explains complex ideas clearly." },
  { icon: BookOpen, title: "Brand Storytelling", desc: "Voice development, story-driven frameworks, and messaging that builds authentic authority." },
  { icon: Target, title: "Social Media Strategy", desc: "Platform-specific calendars, engagement-focused posts, and viral content frameworks." },
];

const useCases = ["Business Websites", "SaaS Platforms", "E-commerce Stores", "Blogs & Media", "Marketing Campaigns"];

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
const ContentWritingStrategyPage: React.FC = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    document.title = "Content Writing & Strategy | ULMiND";
    return () => { document.title = "ULMiND"; };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300 overflow-x-hidden">

      {/* ── BACK ── */}
      <div className="max-w-7xl mx-auto px-6 pt-8 relative z-20">
        <motion.button onClick={() => navigate(-1)} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-sm font-semibold text-orange-600 dark:text-orange-400 hover:gap-3 transition-all duration-200 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />Back to Services
        </motion.button>
      </div>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-16 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-100/60 via-amber-50/20 to-transparent dark:from-orange-950/25 dark:via-red-950/10 dark:to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-orange-500/10 to-transparent dark:from-orange-700/12 dark:to-transparent rounded-full blur-3xl pointer-events-none" />
        <BlurBlob position={{ top: "15%", left: "2%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-orange-600" opacityClass="opacity-10" />
        <BlurBlob position={{ top: "55%", left: "65%" }} size={{ width: "350px", height: "350px" }} colorClass="bg-red-700" opacityClass="opacity-8" />

        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-orange-500/30 bg-orange-500/10 backdrop-blur-md">
                <PenTool className="w-3.5 h-3.5 text-orange-600" />
                <span className="text-orange-700 dark:text-orange-400 text-[10px] font-black tracking-[0.4em] uppercase">Content Writing & Strategy</span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-black text-zinc-900 dark:text-white leading-none tracking-tighter uppercase mb-6">
                Words That
                <span className="block bg-gradient-to-r from-orange-600 via-red-600 to-orange-500 bg-clip-text text-transparent">Drive Growth</span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8 max-w-lg font-medium">
                We create high-impact, SEO-optimized, and conversion-driven content that attracts attention and turns visitors into customers — from brand storytelling to full content strategy.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  { icon: Search, label: "SEO Optimized" },
                  { icon: TrendingUp, label: "Conversion Focused" },
                  { icon: Zap, label: "Fast Delivery" },
                  { icon: Shield, label: "Plagiarism-Free" },
                ].map(({ icon: Icon, label }) => (
                  <GlassCard key={label} className="flex items-center gap-2 px-4 py-2 rounded-xl" hover={false}>
                    <Icon className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{label}</span>
                  </GlassCard>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="flex flex-wrap gap-4">
                <motion.button onClick={() => navigate("/contact")} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="h-14 px-8 bg-gradient-to-r from-orange-600 via-red-600 to-orange-500 hover:from-orange-700 hover:to-red-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-orange-600/30 uppercase tracking-widest flex items-center gap-2 border-0">
                  Get Content Strategy <ArrowRight className="w-5 h-5" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  onClick={() => document.getElementById("roadmap-content")?.scrollIntoView({ behavior: "smooth" })}
                  className="h-14 px-8 border border-orange-400 dark:border-orange-700/50 text-orange-700 dark:text-orange-300 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all bg-transparent">
                  View Roadmap
                </motion.button>
              </div>
            </Reveal>
          </motion.div>

          {/* RIGHT illustration */}
          <Reveal delay={0.3}>
            <motion.div animate={{ y: [0, -18, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="flex justify-center">
              <div className="w-full max-w-xl" style={{ filter: "drop-shadow(0 20px 60px rgba(234,88,12,0.28))" }}>
                <ContentDashboardSVG />
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── CONTENT FLOW ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-orange-500/20 bg-orange-500/10">
              <span className="text-orange-600 dark:text-orange-400 text-[10px] font-black tracking-[0.4em] uppercase">Pipeline</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
              Content <span className="text-orange-600">Flow System</span>
            </h2>
          </Reveal>
          <div className="flex flex-wrap justify-center items-center gap-2">
            {["Research", "Strategy", "Writing", "Optimization", "Publishing", "Performance Tracking"].map((step, i, arr) => (
              <React.Fragment key={i}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} whileHover={{ scale: 1.06, y: -4 }}>
                  <GlassCard className="px-5 py-3 rounded-xl border border-orange-500/20 bg-orange-500/8" hover={false}>
                    <span className="text-sm font-black uppercase tracking-wide text-orange-700 dark:text-orange-300">{step}</span>
                  </GlassCard>
                </motion.div>
                {i < arr.length - 1 && <ArrowRight className="w-4 h-4 text-orange-400 flex-shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-50/40 to-transparent dark:via-orange-950/10 pointer-events-none" />
        <BlurBlob position={{ top: "40%", left: "75%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-orange-600" opacityClass="opacity-8" />

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
          <Reveal>
            <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
              <div className="w-full max-w-lg mx-auto" style={{ filter: "drop-shadow(0 15px 40px rgba(194,65,12,0.22))" }}>
                <StrategyMapSVG />
              </div>
            </motion.div>
          </Reveal>

          <div>
            <Reveal>
              <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-red-700/20 bg-red-700/10">
                <span className="text-red-700 dark:text-orange-400 text-[10px] font-black tracking-[0.4em] uppercase">Deliverables</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-8">
                What You <span className="text-orange-600">Get</span>
              </h2>
            </Reveal>
            <div className="space-y-3">
              {[
                "SEO-optimized website content",
                "High-converting sales copy",
                "Technical & product content",
                "Brand storytelling & messaging",
                "Social media content strategy",
                "Full content planning & execution",
              ].map((item, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <motion.div whileHover={{ x: 8 }}>
                    <GlassCard className="flex items-center gap-4 p-4 rounded-xl border border-zinc-200/50 dark:border-white/5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-600 to-red-800 flex items-center justify-center flex-shrink-0">
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
      <section id="roadmap-content" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <BlurBlob position={{ top: "20%", left: "3%" }} size={{ width: "500px", height: "500px" }} colorClass="bg-orange-600" opacityClass="opacity-6" />
        <BlurBlob position={{ top: "65%", left: "78%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-red-700" opacityClass="opacity-6" />

        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-orange-500/20 bg-orange-500/10">
              <span className="text-orange-600 dark:text-orange-400 text-[10px] font-black tracking-[0.4em] uppercase">Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-4">
              Content <span className="text-orange-600">Roadmap</span>
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">Day 1 – Day 15, structured content delivery</p>
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
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-50/30 to-transparent dark:via-orange-950/10 pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <Reveal className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-orange-500/20 bg-orange-500/10">
              <span className="text-orange-600 dark:text-orange-400 text-[10px] font-black tracking-[0.4em] uppercase">Tools</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
              Content <span className="text-orange-600">Toolkit</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {toolStack.map((item, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <motion.div whileHover={{ scale: 1.04, y: -4 }}>
                  <GlassCard className="relative p-6 rounded-2xl border border-zinc-200/50 dark:border-white/10 overflow-hidden">
                    <div className="relative z-10">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-1">{item.category}</p>
                      <p className="text-lg font-black text-zinc-900 dark:text-white">{item.tech}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CORE SERVICES ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <BlurBlob position={{ top: "30%", left: "75%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-orange-600" opacityClass="opacity-8" />
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-orange-500/20 bg-orange-500/10">
              <span className="text-orange-600 dark:text-orange-400 text-[10px] font-black tracking-[0.4em] uppercase">Services</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
              Core <span className="text-orange-600">Services</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreServices.map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div whileHover={{ scale: 1.04, y: -6 }}>
                  <GlassCard className="relative p-6 rounded-3xl border border-zinc-200/60 dark:border-white/10 h-full">
                    <div className="relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-600 to-red-800 flex items-center justify-center mb-5 shadow-lg shadow-orange-600/30">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="font-black text-zinc-900 dark:text-white text-lg mb-2">{title}</h3>
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{desc}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEO & ANALYTICS BENTO ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
              SEO + <span className="text-orange-600">Analytics</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Search, title: "Keyword Research", desc: "Deep research with Ahrefs & SEMrush — finding high-intent, low-competition terms.", span: "" },
              { icon: BarChart3, title: "Performance Reports", desc: "Monthly dashboards showing traffic, engagement, and conversion impact.", span: "" },
              { icon: Activity, title: "Conversion Analysis", desc: "A/B testing support, CTA optimization, and funnel performance tracking.", span: "" },
              { icon: TrendingUp, title: "Traffic Growth", desc: "Consistent upward content strategy — more organic sessions month over month.", span: "md:col-span-2" },
              { icon: Target, title: "On-Page SEO", desc: "Meta tags, internal linking, and structure optimization built into every piece.", span: "" },
            ].map(({ icon: Icon, title, desc, span }, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <motion.div whileHover={{ scale: 1.03, y: -4 }} className={`h-full ${span}`}>
                  <GlassCard className="p-6 rounded-2xl border border-orange-200/40 dark:border-orange-900/30 h-full">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-red-800 flex items-center justify-center mb-4 shadow-md shadow-orange-600/20">
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
        <BlurBlob position={{ top: "30%", left: "0%" }} size={{ width: "500px", height: "500px" }} colorClass="bg-orange-600" opacityClass="opacity-6" />
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          <Reveal>
            <div className="p-8 rounded-3xl bg-gradient-to-br from-orange-600 via-red-700 to-orange-800 text-white shadow-2xl shadow-orange-700/30 h-full">
              <h2 className="text-3xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                <Star className="w-7 h-7" /> Why Choose Us
              </h2>
              <ul className="space-y-4">
                {["Strategy + writing combined approach", "SEO + conversion-focused content", "Scalable content systems", "Consistent quality delivery", "Business-driven results"].map((item, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="flex items-center gap-3 text-white/90 font-semibold">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 text-white" />{item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <ShineBorder borderRadius={24} borderWidth={1} color={["#ea580c", "#c2410c", "#fb923c"]} className="w-full h-full">
              <GlassCard className="p-8 rounded-3xl border border-zinc-200/50 dark:border-white/10 h-full" hover={false}>
                <h2 className="text-3xl font-black uppercase tracking-tight text-zinc-900 dark:text-white mb-6 flex items-center gap-3">
                  <Shield className="w-7 h-7 text-orange-600" /> Quality Standards
                </h2>
                <div className="space-y-4">
                  {[
                    { label: "100% plagiarism-free content", icon: FileText },
                    { label: "SEO best practices followed", icon: Search },
                    { label: "Consistent brand voice", icon: MessageSquare },
                    { label: "Data-driven strategy", icon: BarChart3 },
                  ].map(({ label, icon: Icon }, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                      <GlassCard className="flex items-center gap-3 p-4 rounded-xl border border-zinc-200/50 dark:border-white/5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-600 to-red-800 flex items-center justify-center flex-shrink-0">
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
                  <GlassCard className="px-5 py-2.5 rounded-full border border-orange-300/40 dark:border-orange-700/30" hover={false}>
                    <span className="text-sm font-bold text-orange-700 dark:text-orange-300">{uc}</span>
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
              <div className="absolute inset-0 bg-gradient-to-r from-orange-700/25 via-red-700/15 to-orange-700/25" />
              <div className="absolute top-4 right-8 w-40 h-40 rounded-full bg-orange-600/15 blur-3xl" />
              <div className="absolute bottom-4 left-8 w-40 h-40 rounded-full bg-red-800/15 blur-3xl" />
              {[...Array(5)].map((_, i) => (
                <motion.div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-orange-500"
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
                  Content That
                  <span className="block bg-gradient-to-r from-orange-400 via-red-400 to-orange-300 bg-clip-text text-transparent">Actually Drives Results</span>
                </h2>
                <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto font-medium">
                  Let's build a strategy that grows your business with words that rank, engage, and convert.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/contact")}
                    className="h-14 px-10 bg-gradient-to-r from-orange-600 via-red-600 to-orange-500 hover:from-orange-700 hover:to-red-700 text-white rounded-2xl font-black text-sm shadow-2xl shadow-orange-600/40 uppercase tracking-widest border-0 flex items-center justify-center gap-2">
                    Get Content Strategy <ArrowRight className="w-5 h-5" />
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

export default ContentWritingStrategyPage;
