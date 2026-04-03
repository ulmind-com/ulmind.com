import React, { useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Database,
  Shield,
  Zap,
  Lock,
  Globe2,
  Activity,
  Server,
  Code2,
  Cpu,
  GitBranch,
  Star,
  Clock,
  Layers,
  CreditCard,
  RefreshCw,
} from "lucide-react";
import BlurBlob from "@/components/BlurBlob";
import { ShineBorder } from "@/components/ui/shine-border";

/* ─── Reveal wrapper ──────────────────────────────── */
const Reveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ─── SVG: API Network Hero Illustration ─────── */
const APINetworkSVG: React.FC = () => (
  <svg viewBox="0 0 520 440" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <radialGradient id="bgGlowBE" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="coreGradBE" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#064e3b" />
        <stop offset="100%" stopColor="#022c22" />
      </linearGradient>
      <linearGradient id="emeraldGradBE" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <linearGradient id="nodeCardBE" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#064e3b" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#022c22" stopOpacity="0.85" />
      </linearGradient>
      <linearGradient id="lineGradBE" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#34d399" />
      </linearGradient>
      <filter id="glowFilterBE">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>

    {/* Background glow */}
    <ellipse cx="260" cy="220" rx="210" ry="170" fill="url(#bgGlowBE)" />

    {/* Central API Hub */}
    <g transform="translate(155, 140)">
      <rect x="0" y="0" width="210" height="110" rx="18" fill="url(#coreGradBE)" stroke="#10b98155" strokeWidth="1.5" />
      <rect x="0" y="0" width="210" height="110" rx="18" fill="url(#glassFillBE)" />
      <rect x="0" y="0" width="210" height="4" rx="2" fill="url(#emeraldGradBE)" />
      <circle cx="38" cy="45" r="22" fill="#10b98120" />
      <rect x="27" y="35" width="22" height="6" rx="3" fill="#10b981" opacity="0.9" />
      <rect x="27" y="45" width="16" height="6" rx="3" fill="#34d399" opacity="0.7" />
      <rect x="27" y="55" width="19" height="6" rx="3" fill="#6ee7b7" opacity="0.5" />
      <text x="72" y="40" fontFamily="monospace" fontSize="11" fontWeight="800" fill="#10b981" letterSpacing="1">API GATEWAY</text>
      <text x="72" y="58" fontFamily="monospace" fontSize="9" fill="#6ee7b7" opacity="0.8">REST · GraphQL · WS</text>
      <text x="72" y="74" fontFamily="monospace" fontSize="9" fill="#64748b">Highly available</text>
      <rect x="155" y="32" width="42" height="16" rx="8" fill="#10b98122" stroke="#10b98144" strokeWidth="1" />
      <text x="168" y="44" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#10b981">LIVE</text>
    </g>

    {/* Left node: Auth */}
    <g transform="translate(20, 80)">
      <rect x="0" y="0" width="118" height="78" rx="14" fill="url(#nodeCardBE)" stroke="#10b98130" strokeWidth="1" />
      <circle cx="26" cy="32" r="14" fill="#10b98115" />
      <path d="M20 28 L26 24 L32 28 L32 36 Q32 40 26 42 Q20 40 20 36Z" stroke="#10b981" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <text x="46" y="28" fontFamily="monospace" fontSize="10" fontWeight="700" fill="#10b981">JWT / OAuth</text>
      <text x="46" y="44" fontFamily="monospace" fontSize="8" fill="#64748b">Secure auth</text>
    </g>

    {/* Right node: Database */}
    <g transform="translate(382, 80)">
      <rect x="0" y="0" width="118" height="78" rx="14" fill="url(#nodeCardBE)" stroke="#34d39930" strokeWidth="1" />
      <circle cx="26" cy="32" r="14" fill="#34d39915" />
      <ellipse cx="26" cy="26" rx="9" ry="3.5" stroke="#34d399" strokeWidth="1.8" fill="none" />
      <path d="M17 26 L17 36" stroke="#34d399" strokeWidth="1.8" />
      <path d="M35 26 L35 36" stroke="#34d399" strokeWidth="1.8" />
      <ellipse cx="26" cy="36" rx="9" ry="3.5" stroke="#34d399" strokeWidth="1.8" fill="none" />
      <text x="46" y="28" fontFamily="monospace" fontSize="10" fontWeight="700" fill="#34d399">DATABASE</text>
      <text x="46" y="44" fontFamily="monospace" fontSize="8" fill="#64748b">Mongo · PG · Redis</text>
    </g>

    {/* Bottom-left: Microservices */}
    <g transform="translate(30, 290)">
      <rect x="0" y="0" width="135" height="78" rx="14" fill="url(#nodeCardBE)" stroke="#059669" strokeWidth="1" />
      <circle cx="26" cy="32" r="14" fill="#05966915" />
      <circle cx="20" cy="28" r="5" stroke="#059669" strokeWidth="1.5" fill="none" />
      <circle cx="32" cy="28" r="5" stroke="#059669" strokeWidth="1.5" fill="none" />
      <circle cx="26" cy="38" r="5" stroke="#059669" strokeWidth="1.5" fill="none" />
      <path d="M24 32 L20 32 M28 32 L32 32 M26 34 L26 38" stroke="#059669" strokeWidth="1" />
      <text x="46" y="28" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#059669">MICROSERVICES</text>
      <text x="46" y="44" fontFamily="monospace" fontSize="8" fill="#64748b">Independent scale</text>
    </g>

    {/* Bottom-right: Payments */}
    <g transform="translate(355, 290)">
      <rect x="0" y="0" width="135" height="78" rx="14" fill="url(#nodeCardBE)" stroke="#6ee7b730" strokeWidth="1" />
      <circle cx="26" cy="32" r="14" fill="#6ee7b715" />
      <rect x="17" y="24" width="18" height="14" rx="3" stroke="#6ee7b7" strokeWidth="1.8" fill="none" />
      <path d="M17 30 L35 30" stroke="#6ee7b7" strokeWidth="1.5" />
      <text x="46" y="28" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#6ee7b7">PAYMENTS</text>
      <text x="46" y="44" fontFamily="monospace" fontSize="8" fill="#64748b">Razorpay · Stripe</text>
    </g>

    {/* Connecting lines */}
    <path d="M138 118 L155 180" stroke="url(#lineGradBE)" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.7" />
    <path d="M382 180 L382 118" stroke="url(#lineGradBE)" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.7" />
    <path d="M180 250 L140 290" stroke="url(#lineGradBE)" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.7" />
    <path d="M340 250 L368 290" stroke="url(#lineGradBE)" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.7" />

    {/* Animated dots */}
    <circle cx="145" cy="148" r="3" fill="#10b981" filter="url(#glowFilterBE)">
      <animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite" />
    </circle>
    <circle cx="375" cy="148" r="3" fill="#34d399" filter="url(#glowFilterBE)">
      <animate attributeName="opacity" values="0;1;0" dur="1.8s" begin="0.6s" repeatCount="indefinite" />
    </circle>
    <circle cx="258" cy="268" r="3" fill="#6ee7b7" filter="url(#glowFilterBE)">
      <animate attributeName="opacity" values="0;1;0" dur="1.8s" begin="1.2s" repeatCount="indefinite" />
    </circle>

    {/* Floating particles */}
    <circle cx="90" cy="220" r="2.5" fill="#10b981" opacity="0.6">
      <animate attributeName="r" values="2.5;4;2.5" dur="2.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="430" cy="230" r="2" fill="#34d399" opacity="0.5">
      <animate attributeName="r" values="2;3.5;2" dur="3s" repeatCount="indefinite" />
    </circle>

    <defs>
      <linearGradient id="glassFillBE" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.04" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

/* ─── SVG: Tech Stack Visual ──────────────────── */
const TechStackSVG: React.FC = () => (
  <svg viewBox="0 0 480 380" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="stackBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#022c22" />
        <stop offset="100%" stopColor="#064e3b" />
      </linearGradient>
      <linearGradient id="barGreen1" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <linearGradient id="barGreen2" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#34d399" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
      <linearGradient id="barGreen3" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#6ee7b7" />
        <stop offset="100%" stopColor="#34d399" />
      </linearGradient>
      <filter id="glowBE2">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>

    <rect x="30" y="10" width="420" height="360" rx="22" fill="url(#stackBg)" />
    <rect x="30" y="10" width="420" height="360" rx="22" stroke="#10b98122" strokeWidth="1.5" />

    {/* Top bar */}
    <rect x="30" y="10" width="420" height="46" rx="22" fill="#10b98108" />
    <circle cx="60" cy="33" r="5.5" fill="#ef4444" />
    <circle cx="78" cy="33" r="5.5" fill="#f59e0b" />
    <circle cx="96" cy="33" r="5.5" fill="#10b981" />
    <text x="130" y="37" fontFamily="monospace" fontSize="10" fontWeight="700" fill="#10b981" letterSpacing="1.5">BACKEND TECH STACK</text>

    {/* Rows */}
    {[
      { y: 76, label: "Node.js / NestJS", color: "url(#barGreen1)", w: 320, cat: "RUNTIME", tag: "PRIMARY" },
      { y: 138, label: "Python / FastAPI / Django", color: "url(#barGreen2)", w: 280, cat: "LANGUAGE", tag: "SUPPORTED" },
      { y: 200, label: "MongoDB / PostgreSQL / Redis", color: "url(#barGreen3)", w: 300, cat: "DATABASE", tag: "MULTI-DB" },
      { y: 262, label: "Docker / Kubernetes / CI-CD", color: "url(#barGreen1)", w: 260, cat: "INFRA", tag: "SCALABLE" },
      { y: 314, label: "JWT / OAuth2 / Encryption", color: "url(#barGreen2)", w: 240, cat: "SECURITY", tag: "HARDENED" },
    ].map((row, i) => (
      <g key={i} transform={`translate(50, ${row.y})`}>
        <rect width="380" height="50" rx="10" fill="#10b98110" />
        <rect width="380" height="50" rx="10" stroke="#10b98118" strokeWidth="1" />
        <rect width="6" height="50" rx="3" fill={row.color} />
        <text x="22" y="14" fontFamily="monospace" fontSize="7" fontWeight="800" fill="#6ee7b7" letterSpacing="1.5">{row.cat}</text>
        <text x="22" y="30" fontFamily="monospace" fontSize="10" fontWeight="700" fill="#e2e8f0">{row.label}</text>
        <rect x={row.w} y="14" width="60" height="16" rx="8" fill="#10b98118" stroke="#10b98130" strokeWidth="1" />
        <text x={row.w + 8} y="26" fontFamily="monospace" fontSize="7" fontWeight="700" fill="#10b981">{row.tag}</text>
        <circle cx="358" cy="25" r="5" fill="#10b98115">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
        </circle>
        <circle cx="358" cy="25" r="3" fill="#10b981" filter="url(#glowBE2)" />
      </g>
    ))}
  </svg>
);

/* ─── Phase Data ──────────────────────────────── */
const phases = [
  {
    phase: "PHASE 1",
    label: "Planning & Architecture",
    days: "Day 1–3",
    color: "#10b981",
    borderColor: "border-emerald-500/40",
    bg: "from-emerald-500/10 to-emerald-500/5",
    dot: "#10b981",
    days_data: [
      { day: "DAY 1 — REQUIREMENT ANALYSIS", items: ["Business logic understanding", "Feature breakdown", "System scope planning"] },
      { day: "DAY 2 — TECH STACK SELECTION", items: ["Language selection (Node / Python / Java / PHP)", "Database choice", "Architecture decision"] },
      { day: "DAY 3 — SYSTEM DESIGN", items: ["API structure design", "Database schema planning", "Architecture diagram"] },
    ],
  },
  {
    phase: "PHASE 2",
    label: "Core Setup",
    days: "Day 4–6",
    color: "#059669",
    borderColor: "border-green-600/40",
    bg: "from-green-600/10 to-green-600/5",
    dot: "#059669",
    days_data: [
      { day: "DAY 4 — PROJECT SETUP", items: ["Project scaffold", "Server configuration", "Folder structure"] },
      { day: "DAY 5 — DATABASE", items: ["Database setup", "Schema creation", "Connection pooling"] },
      { day: "DAY 6 — API ROUTING", items: ["Basic API setup", "Routing system", "Middleware stack"] },
    ],
  },
  {
    phase: "PHASE 3",
    label: "Core Development",
    days: "Day 7–11",
    color: "#047857",
    borderColor: "border-emerald-700/40",
    bg: "from-emerald-700/10 to-emerald-700/5",
    dot: "#047857",
    days_data: [
      { day: "DAY 7–8 — CORE APIs", items: ["Core API development", "Business logic implementation"] },
      { day: "DAY 9 — AUTHENTICATION", items: ["JWT / OAuth integration", "Role-based access control"] },
      { day: "DAY 10 — ADVANCED FEATURES", items: ["Payments, uploads, notifications"] },
      { day: "DAY 11 — MICROSERVICES", items: ["Microservices setup (if required)"] },
    ],
  },
  {
    phase: "PHASE 4",
    label: "Security & Optimization",
    days: "Day 12–13",
    color: "#065f46",
    borderColor: "border-teal-700/40",
    bg: "from-teal-700/10 to-teal-700/5",
    dot: "#065f46",
    days_data: [
      { day: "DAY 12 — SECURITY", items: ["API security hardening", "Rate limiting", "Data validation & sanitization"] },
      { day: "DAY 13 — PERFORMANCE", items: ["Performance optimization", "Redis caching", "Query optimization"] },
    ],
  },
  {
    phase: "PHASE 5",
    label: "Testing",
    days: "Day 14",
    color: "#064e3b",
    borderColor: "border-green-900/40",
    bg: "from-green-900/10 to-green-900/5",
    dot: "#064e3b",
    days_data: [
      { day: "DAY 14 — QA", items: ["Unit testing", "API testing", "Load testing"] },
    ],
  },
  {
    phase: "PHASE 6",
    label: "Deployment",
    days: "Day 15",
    color: "#022c22",
    borderColor: "border-emerald-950/40",
    bg: "from-emerald-950/20 to-emerald-950/10",
    dot: "#022c22",
    days_data: [
      { day: "DAY 15 — GO LIVE", items: ["Server deployment", "CI/CD setup", "Documentation delivery"] },
    ],
  },
];

const keyFeatures = [
  { icon: Code2, title: "RESTful & GraphQL APIs", desc: "Clean, versioned, and scalable API design following industry best practices." },
  { icon: Database, title: "Database Design", desc: "Efficient schema design and optimized queries for maximum performance." },
  { icon: Layers, title: "Microservices", desc: "Independent, scalable services built for resilience and maintainability." },
  { icon: Shield, title: "Security Focused", desc: "Strong authentication, input validation, and encrypted data handling." },
];

const paymentGateways = [
  { name: "Razorpay", color: "#10b981" },
  { name: "Stripe", color: "#34d399" },
  { name: "PayPal", color: "#059669" },
  { name: "PhonePe", color: "#6ee7b7" },
  { name: "Paytm", color: "#10b981" },
  { name: "UPI", color: "#34d399" },
];

const useCases = ["SaaS Platforms", "E-commerce Backend", "Mobile App Backend", "Admin Panels", "Enterprise Software"];

/* ─── Phase Card ─────────────────────────────── */
const PhaseCard: React.FC<{ phase: typeof phases[0]; index: number }> = ({ phase, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1 }}
      className="relative"
    >
      <div
        className="absolute left-0 md:left-1/2 top-6 w-4 h-4 rounded-full -translate-x-1/2 z-10 ring-4 ring-white dark:ring-zinc-950 shadow-lg"
        style={{ backgroundColor: phase.dot }}
      />
      <div className={`ml-8 md:ml-0 ${index % 2 === 0 ? "md:pr-[calc(50%+2rem)]" : "md:pl-[calc(50%+2rem)]"}`}>
        <div className="relative rounded-2xl p-6 overflow-hidden backdrop-blur-xl bg-white/60 dark:bg-white/[0.12] border border-white/80 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.1)]">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-[3px] rounded-b-2xl pointer-events-none" style={{ background: `linear-gradient(90deg, transparent, ${phase.color}80, transparent)` }} />
          <div className="flex items-center gap-3 mb-4">
            <span
              className="text-xs font-black tracking-wider px-3 py-1.5 rounded-full text-white"
              style={{ backgroundColor: phase.color }}
            >
              {phase.phase}
            </span>
            <span className="text-xs font-semibold text-zinc-400">{phase.days}</span>
          </div>
          <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-4 uppercase tracking-tight">
            {phase.label}
          </h3>
          <div className="space-y-4">
            {phase.days_data.map((d, di) => (
              <div key={di}>
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">
                  <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                  {d.day}
                </p>
                <ul className="space-y-1.5 pl-5">
                  {d.items.map((item, ii) => (
                    <li key={ii} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: phase.color }} />
                      {item}
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

/* ─── Main Page ───────────────────────────────── */
const BackendDevelopmentPage: React.FC = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    document.title = "Backend Development | ULMiND";
    return () => { document.title = "ULMiND"; };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300 overflow-x-hidden">

      {/* ── BACK BUTTON ── */}
      <div className="max-w-7xl mx-auto px-6 pt-8 relative z-20">
        <motion.button
          onClick={() => navigate(-1)}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:gap-3 transition-all duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Services
        </motion.button>
      </div>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-16 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Mesh bg */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-100/60 via-green-50/20 to-transparent dark:from-emerald-900/20 dark:via-green-950/10 dark:to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-emerald-400/10 to-transparent dark:from-emerald-500/10 dark:to-transparent rounded-full blur-3xl pointer-events-none" />
        <BlurBlob position={{ top: "15%", left: "80%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-emerald-400" opacityClass="opacity-10" />
        <BlurBlob position={{ top: "60%", left: "5%" }} size={{ width: "350px", height: "350px" }} colorClass="bg-green-400" opacityClass="opacity-10" />

        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
          {/* LEFT text */}
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md">
                <Database className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-black tracking-[0.4em] uppercase">Backend Development</span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-black text-zinc-900 dark:text-white leading-none tracking-tighter uppercase mb-6">
                The Engine
                <span className="block bg-gradient-to-r from-emerald-500 via-green-400 to-teal-400 bg-clip-text text-transparent">
                  Behind Everything
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8 max-w-lg font-medium">
                We build powerful, secure, and scalable backend systems — from simple APIs to complex microservices. Built to handle high traffic, large data, and real-time operations efficiently.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  { icon: Zap, label: "High Performance" },
                  { icon: Shield, label: "Secure" },
                  { icon: Server, label: "Scalable" },
                  { icon: CreditCard, label: "Payment Ready" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200/50 dark:border-white/10">
                    <Icon className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{label}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  onClick={() => navigate("/contact")}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="h-14 px-8 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-500/30 uppercase tracking-widest flex items-center gap-2 border-0"
                >
                  Build Backend <ArrowRight className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => document.getElementById("roadmap-backend")?.scrollIntoView({ behavior: "smooth" })}
                  className="h-14 px-8 border border-emerald-300 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all bg-transparent"
                >
                  View Roadmap
                </motion.button>
              </div>
            </Reveal>
          </motion.div>

          {/* RIGHT illustration — SVG */}
          <Reveal delay={0.3}>
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="flex justify-center"
            >
              <div
                className="w-full max-w-xl"
                style={{ filter: "drop-shadow(0 20px 60px rgba(16,185,129,0.25))" }}
              >
                <APINetworkSVG />
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── WHAT YOU GET ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-50/40 to-transparent dark:via-emerald-950/10 pointer-events-none" />
        <BlurBlob position={{ top: "40%", left: "75%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-green-400" opacityClass="opacity-10" />

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
          {/* LEFT illustration */}
          <Reveal>
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <div
                className="w-full max-w-lg mx-auto"
                style={{ filter: "drop-shadow(0 15px 40px rgba(5,150,105,0.2))" }}
              >
                <TechStackSVG />
              </div>
            </motion.div>
          </Reveal>

          {/* RIGHT text */}
          <div>
            <Reveal>
              <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-emerald-500/20 bg-emerald-500/10">
                <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-black tracking-[0.4em] uppercase">Deliverables</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-8">
                What You <span className="text-emerald-500">Get</span>
              </h2>
            </Reveal>
            <div className="space-y-3">
              {[
                "RESTful & GraphQL API development",
                "Scalable server-side architecture",
                "Secure authentication system (JWT/OAuth)",
                "Database design & optimization",
                "Payment gateway integration",
                "Microservices & background jobs",
                "Real-time WebSocket systems",
                "Comprehensive API documentation",
              ].map((item, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <motion.div
                    whileHover={{ x: 8 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/50 dark:border-white/5 group cursor-default"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0">
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

      {/* ── KEY FEATURES – BENTO GRID ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <BlurBlob position={{ top: "30%", left: "75%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-emerald-400" opacityClass="opacity-10" />
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-emerald-500/20 bg-emerald-500/10">
              <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-black tracking-[0.4em] uppercase">Core Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
              Built For <span className="text-emerald-500">Power</span>
            </h2>
          </Reveal>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {keyFeatures.map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.04, y: -6 }}
                  className="relative p-6 rounded-3xl bg-white dark:bg-white/[0.03] border border-zinc-200/60 dark:border-white/10 shadow-sm hover:shadow-xl dark:hover:shadow-emerald-500/10 transition-all duration-300 overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/30">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-black text-zinc-900 dark:text-white text-lg mb-2">{title}</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>

          {/* Extra wide bento cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
            {/* Payment Integration card */}
            <Reveal className="md:col-span-2">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative p-8 rounded-3xl bg-gradient-to-br from-emerald-950/90 to-zinc-950 border border-emerald-500/20 overflow-hidden h-full"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-black text-white text-xl uppercase tracking-tight">Payment Integration</h3>
                  </div>
                  <p className="text-zinc-400 text-sm mb-6">Secure, multi-gateway payment systems with webhook verification, fraud detection, and subscription billing.</p>
                  <div className="flex flex-wrap gap-2">
                    {paymentGateways.map((gw, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ delay: i * 0.06 }}
                        viewport={{ once: true }}
                        className="px-4 py-1.5 rounded-full text-xs font-black border"
                        style={{ borderColor: gw.color + "40", color: gw.color, background: gw.color + "15" }}
                      >
                        {gw.name}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </Reveal>

            {/* Real-time card */}
            <Reveal>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="relative p-8 rounded-3xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 text-white overflow-hidden h-full shadow-2xl shadow-emerald-500/30"
              >
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <Activity className="w-10 h-10 mb-4 opacity-90" />
                  <h3 className="font-black text-xl uppercase tracking-tight mb-3">Real-Time Systems</h3>
                  <p className="text-white/80 text-sm leading-relaxed">WebSocket servers, live notifications, and event-driven architecture for instant data flow.</p>
                  <div className="mt-6 space-y-2">
                    {["WebSockets", "Event-driven", "Pub/Sub queues"].map((t, i) => (
                      <div key={i} className="flex items-center gap-2 text-white/90 text-sm font-semibold">
                        <RefreshCw className="w-3.5 h-3.5 flex-shrink-0" />
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── ROADMAP TIMELINE ── */}
      <section id="roadmap-backend" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <BlurBlob position={{ top: "20%", left: "3%" }} size={{ width: "500px", height: "500px" }} colorClass="bg-emerald-400" opacityClass="opacity-8" />
        <BlurBlob position={{ top: "65%", left: "78%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-green-400" opacityClass="opacity-6" />

        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-emerald-500/20 bg-emerald-500/10">
              <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-black tracking-[0.4em] uppercase">Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-4">
              Development <span className="text-emerald-500">Roadmap</span>
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">Day 1 – Day 15, structured delivery</p>
          </Reveal>

          <div className="relative">
            {/* Center line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-emerald-300 dark:via-emerald-700 to-transparent -translate-x-1/2" />
            <div className="space-y-12">
              {phases.map((phase, i) => (
                <PhaseCard key={i} phase={phase} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US + SECURITY ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <BlurBlob position={{ top: "30%", left: "0%" }} size={{ width: "500px", height: "500px" }} colorClass="bg-green-400" opacityClass="opacity-8" />
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Why Choose Us */}
          <Reveal>
            <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 text-white shadow-2xl shadow-emerald-500/30 h-full">
              <h2 className="text-3xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                <Star className="w-7 h-7" /> Why Choose Us
              </h2>
              <ul className="space-y-4">
                {[
                  "Clean and scalable architecture",
                  "Multi-language backend expertise",
                  "High-performance systems",
                  "Secure and reliable solutions",
                  "Long-term support & maintenance",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 text-white/90 font-semibold"
                  >
                    <CheckCircle className="w-5 h-5 flex-shrink-0 text-white" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Security System */}
          <Reveal delay={0.15}>
            <ShineBorder borderRadius={24} borderWidth={1} color={["#10b981", "#34d399", "#059669"]} className="w-full h-full">
              <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/50 dark:border-white/10 h-full">
                <h2 className="text-3xl font-black uppercase tracking-tight text-zinc-900 dark:text-white mb-6 flex items-center gap-3">
                  <Shield className="w-7 h-7 text-emerald-500" /> Security System
                </h2>
                <div className="space-y-4">
                  {[
                    { label: "JWT / OAuth authentication", icon: Lock },
                    { label: "Role-based access control", icon: Shield },
                    { label: "API rate limiting & DDoS protection", icon: Globe2 },
                    { label: "Input validation & sanitization", icon: Activity },
                    { label: "Data encryption at rest & transit", icon: Cpu },
                  ].map(({ label, icon: Icon }, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-white/[0.03] border border-zinc-200/50 dark:border-white/5"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0">
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

      {/* ── ARCHITECTURE OVERVIEW ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-green-500/20 bg-green-500/10">
              <span className="text-green-600 dark:text-green-400 text-[10px] font-black tracking-[0.4em] uppercase">Architecture</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
              System <span className="text-emerald-500">Layers</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Globe2, label: "API Layer", desc: "Client requests" },
              { icon: GitBranch, label: "Service Layer", desc: "Business logic" },
              { icon: Database, label: "Database", desc: "Data storage" },
              { icon: Zap, label: "Cache", desc: "Speed boost" },
            ].map(({ icon: Icon, label, desc }, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="p-6 rounded-2xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/50 dark:border-white/10 text-center group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-black text-zinc-900 dark:text-white text-sm uppercase tracking-wide">{label}</p>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1">{desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── USE CASES ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-6">Use Cases</p>
            <div className="flex flex-wrap justify-center gap-3">
              {useCases.map((uc, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.06 }}
                  transition={{ delay: i * 0.07 }}
                  viewport={{ once: true }}
                  className="px-5 py-2.5 rounded-full border border-emerald-300/40 dark:border-emerald-700/30 bg-emerald-50 dark:bg-emerald-900/10 text-sm font-bold text-emerald-700 dark:text-emerald-300 cursor-default"
                >
                  {uc}
                </motion.span>
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
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950" />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-green-600/15 to-teal-600/20" />
              <div className="absolute top-4 right-8 w-32 h-32 rounded-full bg-emerald-500/20 blur-3xl" />
              <div className="absolute bottom-4 left-8 w-32 h-32 rounded-full bg-green-500/20 blur-3xl" />

              <div className="relative z-10 p-12 md:p-16 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                  <Clock className="w-3.5 h-3.5 text-white/80" />
                  <span className="text-white/80 text-[10px] font-black tracking-[0.4em] uppercase">Ready in 15 Days</span>
                </div>

                <h2 className="text-4xl md:text-5xl xl:text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
                  Build the Engine
                  <span className="block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    Behind Your Product
                  </span>
                </h2>

                <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto font-medium">
                  Need a powerful backend system? Let's build the engine behind your product.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate("/contact")}
                    className="h-14 px-10 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-black text-sm shadow-2xl shadow-emerald-500/40 uppercase tracking-widest flex items-center gap-2 justify-center border-0"
                  >
                    Build Backend <ArrowRight className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate("/projects")}
                    className="h-14 px-10 border border-white/20 text-white hover:bg-white/10 rounded-2xl font-black text-sm uppercase tracking-widest bg-transparent"
                  >
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

export default BackendDevelopmentPage;
