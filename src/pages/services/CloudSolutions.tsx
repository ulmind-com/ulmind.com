import React, { useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Cloud,
  Server,
  Shield,
  Zap,
  BarChart3,
  Lock,
  Globe2,
  Repeat2,
  DollarSign,
  Clock,
  Star,
  Activity,
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

/* ─── SVG: Cloud Architecture Illustration ─────── */
const CloudArchSVG: React.FC = () => (
  <svg viewBox="0 0 520 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Background glow */}
    <ellipse cx="260" cy="210" rx="200" ry="160" fill="url(#glowGrad)" opacity="0.3" />

    {/* Central Cloud */}
    <g transform="translate(160, 80)">
      <rect x="10" y="30" width="200" height="100" rx="16" fill="url(#cloudCardGrad)" stroke="url(#goldBorder)" strokeWidth="1.5" />
      <rect x="10" y="30" width="200" height="100" rx="16" fill="url(#glassFill)" />
      {/* Cloud Icon */}
      <circle cx="55" cy="70" r="22" fill="url(#amberGrad)" opacity="0.9" />
      <path d="M44 70 Q44 58 55 57 Q62 50 72 56 Q80 52 85 60 Q91 58 91 66 Q91 76 80 76 H48 Q44 76 44 70Z" fill="white" opacity="0.95" />
      <text x="105" y="66" fontFamily="system-ui" fontSize="13" fontWeight="800" fill="#fbbf24" letterSpacing="-0.3">CLOUD</text>
      <text x="105" y="84" fontFamily="system-ui" fontSize="11" fontWeight="600" fill="#94a3b8">AWS / Azure / GCP</text>
      <text x="105" y="100" fontFamily="system-ui" fontSize="10" fill="#64748b">Multi-cloud ready</text>
    </g>

    {/* Left node: Auto-Scale */}
    <g transform="translate(30, 200)">
      <rect x="0" y="0" width="130" height="80" rx="14" fill="url(#nodeCard1)" stroke="#f59e0b33" strokeWidth="1" />
      <circle cx="28" cy="30" r="16" fill="#f59e0b22" />
      <path d="M20 30 L28 22 L36 30 M28 22 L28 36" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <text x="50" y="26" fontFamily="system-ui" fontSize="11" fontWeight="700" fill="#f59e0b">AUTO SCALE</text>
      <text x="50" y="42" fontFamily="system-ui" fontSize="9" fill="#64748b">0→∞ instantly</text>
    </g>

    {/* Right node: Security */}
    <g transform="translate(360, 200)">
      <rect x="0" y="0" width="130" height="80" rx="14" fill="url(#nodeCard2)" stroke="#fb923c33" strokeWidth="1" />
      <circle cx="28" cy="30" r="16" fill="#fb923c22" />
      <path d="M22 26 L28 22 L34 26 L34 34 Q34 36 28 38 Q22 36 22 34Z" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" fill="none" />
      <text x="50" y="26" fontFamily="system-ui" fontSize="11" fontWeight="700" fill="#fb923c">SECURITY</text>
      <text x="50" y="42" fontFamily="system-ui" fontSize="9" fill="#64748b">Zero-trust model</text>
    </g>

    {/* Bottom node: Monitoring */}
    <g transform="translate(160, 320)">
      <rect x="0" y="0" width="200" height="72" rx="14" fill="url(#nodeCard3)" stroke="#fcd34d33" strokeWidth="1" />
      <circle cx="30" cy="36" r="16" fill="#fcd34d22" />
      <path d="M22 36 L26 30 L30 36 L34 26 L38 36" stroke="#fcd34d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <text x="56" y="32" fontFamily="system-ui" fontSize="11" fontWeight="700" fill="#fcd34d">MONITORING</text>
      <text x="56" y="48" fontFamily="system-ui" fontSize="9" fill="#64748b">Real-time alerts</text>
    </g>

    {/* Connecting lines */}
    <path d="M165 190 L95 200" stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.6" />
    <path d="M275 190 L365 200" stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.6" />
    <path d="M220 190 L220 318" stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.6" />

    {/* Floating particles */}
    <circle cx="140" cy="150" r="3" fill="#f59e0b" opacity="0.6">
      <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="380" cy="160" r="2.5" fill="#fb923c" opacity="0.5">
      <animate attributeName="r" values="2.5;4.5;2.5" dur="2.5s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="260" cy="270" r="2" fill="#fcd34d" opacity="0.7">
      <animate attributeName="r" values="2;4;2" dur="3s" repeatCount="indefinite" />
    </circle>

    {/* Defs */}
    <defs>
      <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="cloudCardGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
      <linearGradient id="glassFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.05" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="goldBorder" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#fb923c" stopOpacity="0.2" />
      </linearGradient>
      <linearGradient id="amberGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
      <linearGradient id="nodeCard1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1e293b" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="nodeCard2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1e293b" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="nodeCard3" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1e293b" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#fb923c" />
      </linearGradient>
    </defs>
  </svg>
);

/* ─── SVG: Infrastructure Stack Illustration ─── */
const InfraStackSVG: React.FC = () => (
  <svg viewBox="0 0 480 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="stackAmber1" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
      <linearGradient id="stackOrange" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#fb923c" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
      <linearGradient id="stackYellow" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
      <linearGradient id="infraBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0f172a" />
        <stop offset="100%" stopColor="#1e293b" />
      </linearGradient>
      <filter id="glow1">
        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
        <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>

    {/* Main frame */}
    <rect x="40" y="20" width="400" height="360" rx="24" fill="url(#infraBg)" />
    <rect x="40" y="20" width="400" height="360" rx="24" stroke="#f59e0b22" strokeWidth="1.5" />

    {/* Top bar */}
    <rect x="40" y="20" width="400" height="48" rx="24" fill="#f59e0b11" />
    <circle cx="72" cy="44" r="6" fill="#ef4444" />
    <circle cx="92" cy="44" r="6" fill="#f59e0b" />
    <circle cx="112" cy="44" r="6" fill="#22c55e" />
    <text x="160" y="49" fontFamily="system-ui" fontSize="11" fontWeight="700" fill="#f59e0b" letterSpacing="2">CLOUD INFRASTRUCTURE</text>

    {/* Stack layers */}
    {/* Layer 1 - CDN */}
    <g transform="translate(60, 88)">
      <rect width="360" height="52" rx="10" fill="#f59e0b18" />
      <rect width="360" height="52" rx="10" stroke="url(#stackAmber1)" strokeWidth="1" />
      <rect width="8" height="52" rx="4" fill="url(#stackAmber1)" />
      <circle cx="36" cy="26" r="14" fill="#f59e0b22" />
      <path d="M29 26 Q36 18 43 26 Q36 34 29 26Z" stroke="#f59e0b" strokeWidth="1.8" fill="none" />
      <path d="M32 22 Q36 26 40 22 M32 30 Q36 26 40 30" stroke="#f59e0b" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <text x="62" y="22" fontFamily="system-ui" fontSize="10" fontWeight="800" fill="#f59e0b" letterSpacing="1">CDN LAYER</text>
      <text x="62" y="38" fontFamily="system-ui" fontSize="9" fill="#94a3b8">Global content delivery · 99.9% uptime</text>
      <text x="310" y="30" fontFamily="system-ui" fontSize="10" fontWeight="700" fill="#f59e0b">ACTIVE</text>
    </g>

    {/* Layer 2 - Load Balancer */}
    <g transform="translate(60, 152)">
      <rect width="360" height="52" rx="10" fill="#fb923c18" />
      <rect width="360" height="52" rx="10" stroke="url(#stackOrange)" strokeWidth="1" />
      <rect width="8" height="52" rx="4" fill="url(#stackOrange)" />
      <circle cx="36" cy="26" r="14" fill="#fb923c22" />
      <path d="M27 22 L36 22 M27 26 L36 26 M36 26 L42 22 M36 26 L42 30" stroke="#fb923c" strokeWidth="1.8" strokeLinecap="round" />
      <text x="62" y="22" fontFamily="system-ui" fontSize="10" fontWeight="800" fill="#fb923c" letterSpacing="1">LOAD BALANCER</text>
      <text x="62" y="38" fontFamily="system-ui" fontSize="9" fill="#94a3b8">Traffic distribution · Auto-failover</text>
      <text x="310" y="30" fontFamily="system-ui" fontSize="10" fontWeight="700" fill="#22c55e">HEALTHY</text>
    </g>

    {/* Layer 3 - Compute */}
    <g transform="translate(60, 216)">
      <rect width="360" height="52" rx="10" fill="#fbbf2418" />
      <rect width="360" height="52" rx="10" stroke="url(#stackYellow)" strokeWidth="1" />
      <rect width="8" height="52" rx="4" fill="url(#stackYellow)" />
      <circle cx="36" cy="26" r="14" fill="#fbbf2422" />
      <rect x="27" y="20" width="18" height="12" rx="2" stroke="#fbbf24" strokeWidth="1.8" fill="none" />
      <path d="M29 32 L29 36 M36 32 L36 36" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
      <text x="62" y="22" fontFamily="system-ui" fontSize="10" fontWeight="800" fill="#fbbf24" letterSpacing="1">COMPUTE CLUSTER</text>
      <text x="62" y="38" fontFamily="system-ui" fontSize="9" fill="#94a3b8">EC2 / VMs · Auto-scaling groups</text>
      <text x="310" y="30" fontFamily="system-ui" fontSize="10" fontWeight="700" fill="#fbbf24">×4 nodes</text>
    </g>

    {/* Layer 4 - Database */}
    <g transform="translate(60, 280)">
      <rect width="360" height="52" rx="10" fill="#f59e0b18" />
      <rect width="360" height="52" rx="10" stroke="#f59e0b55" strokeWidth="1" />
      <rect width="8" height="52" rx="4" fill="#f59e0b" />
      <circle cx="36" cy="26" r="14" fill="#f59e0b22" />
      <ellipse cx="36" cy="20" rx="9" ry="3.5" stroke="#f59e0b" strokeWidth="1.8" fill="none" />
      <path d="M27 20 L27 32" stroke="#f59e0b" strokeWidth="1.8" />
      <path d="M45 20 L45 32" stroke="#f59e0b" strokeWidth="1.8" />
      <ellipse cx="36" cy="32" rx="9" ry="3.5" stroke="#f59e0b" strokeWidth="1.8" fill="none" />
      <text x="62" y="22" fontFamily="system-ui" fontSize="10" fontWeight="800" fill="#f59e0b" letterSpacing="1">DATABASE LAYER</text>
      <text x="62" y="38" fontFamily="system-ui" fontSize="9" fill="#94a3b8">RDS / MongoDB · Automated backups</text>
      <text x="310" y="30" fontFamily="system-ui" fontSize="10" fontWeight="700" fill="#f59e0b">ENCRYPTED</text>
    </g>

    {/* Animated connection dots */}
    <circle cx="240" cy="142" r="2.5" fill="#f59e0b" filter="url(#glow1)">
      <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="240" cy="206" r="2.5" fill="#fb923c" filter="url(#glow1)">
      <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="0.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="240" cy="270" r="2.5" fill="#fbbf24" filter="url(#glow1)">
      <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="1s" repeatCount="indefinite" />
    </circle>
  </svg>
);

/* ─── Phase Data ──────────────────────────────────── */
const phases = [
  {
    phase: "PHASE 1",
    label: "Discovery & Architecture",
    days: "Day 1–3",
    color: "#d97706",
    borderColor: "border-amber-500/40",
    bg: "from-amber-500/10 to-amber-500/5",
    dot: "#d97706",
    days_data: [
      { day: "DAY 1 — BUSINESS ANALYSIS", items: ["Business requirement mapping", "Existing system audit", "Traffic & load estimation"] },
      { day: "DAY 2 — CLOUD STRATEGY", items: ["Platform selection (AWS/Azure/GCP)", "Cost estimation planning", "Scalability roadmap"] },
      { day: "DAY 3 — ARCHITECTURE DESIGN", items: ["System architecture diagrams", "Service selection & planning", "Security framework design"] },
    ],
  },
  {
    phase: "PHASE 2",
    label: "Infrastructure Setup",
    days: "Day 4–6",
    color: "#ea580c",
    borderColor: "border-orange-500/40",
    bg: "from-orange-500/10 to-orange-500/5",
    dot: "#ea580c",
    days_data: [
      { day: "DAY 4 — CORE SETUP", items: ["Virtual server provisioning", "VPC & network configuration", "Subnet & routing setup"] },
      { day: "DAY 5 — LOAD & STORAGE", items: ["Load balancer deployment", "S3/Blob storage setup", "Database provisioning"] },
      { day: "DAY 6 — AUTO SCALING", items: ["Auto-scaling group config", "Resource allocation rules", "Failover configuration"] },
    ],
  },
  {
    phase: "PHASE 3",
    label: "Deployment & CI/CD",
    days: "Day 7–10",
    color: "#b45309",
    borderColor: "border-yellow-600/40",
    bg: "from-yellow-600/10 to-yellow-600/5",
    dot: "#b45309",
    days_data: [
      { day: "DAY 7–8 — APP DEPLOYMENT", items: ["Server environment setup", "Application deployment config", "CI/CD pipeline integration"] },
      { day: "DAY 9–10 — DATABASE & BACKUP", items: ["Database deployment", "Automated backup system", "Version control & rollback"] },
    ],
  },
  {
    phase: "PHASE 4",
    label: "Security & Optimization",
    days: "Day 11–13",
    color: "#c2410c",
    borderColor: "border-red-600/40",
    bg: "from-red-600/10 to-red-600/5",
    dot: "#c2410c",
    days_data: [
      { day: "DAY 11 — SECURITY HARDENING", items: ["IAM roles & permissions", "Firewall configuration", "API security setup"] },
      { day: "DAY 12 — PERFORMANCE", items: ["CDN integration", "Smart caching layers", "Resource optimization"] },
      { day: "DAY 13 — COST CONTROL", items: ["Usage analysis", "Cost reduction strategies", "Billing monitoring setup"] },
    ],
  },
  {
    phase: "PHASE 5",
    label: "Testing & Monitoring",
    days: "Day 14",
    color: "#92400e",
    borderColor: "border-amber-700/40",
    bg: "from-amber-700/10 to-amber-700/5",
    dot: "#92400e",
    days_data: [
      { day: "DAY 14 — QA & MONITORING", items: ["Load & stress testing", "Monitoring tools setup", "Alert & notification system"] },
    ],
  },
  {
    phase: "PHASE 6",
    label: "Go Live & Handover",
    days: "Day 15",
    color: "#78350f",
    borderColor: "border-yellow-900/40",
    bg: "from-yellow-900/10 to-yellow-900/5",
    dot: "#78350f",
    days_data: [
      { day: "DAY 15 — FINAL DELIVERY", items: ["Production deployment", "Documentation handover", "Team training session", "Ongoing support setup"] },
    ],
  },
];

const techStack = [
  { category: "Cloud Platform", tech: "AWS / Azure / GCP", icon: Cloud, color: "from-amber-500 to-orange-500" },
  { category: "Compute", tech: "EC2 / Virtual Machines", icon: Server, color: "from-orange-500 to-red-500" },
  { category: "CI/CD", tech: "GitHub Actions / Jenkins", icon: Repeat2, color: "from-yellow-500 to-amber-600" },
  { category: "Monitoring", tech: "CloudWatch / Prometheus", icon: BarChart3, color: "from-amber-600 to-orange-600" },
  { category: "Container", tech: "Docker / Kubernetes", icon: Globe2, color: "from-orange-600 to-red-600" },
  { category: "Security", tech: "IAM / Vault / WAF", icon: Shield, color: "from-red-500 to-orange-500" },
];

const keyFeatures = [
  { icon: Repeat2, title: "Auto Scaling", desc: "Dynamically adjusts resources based on real-time traffic — zero manual intervention." },
  { icon: Activity, title: "High Availability", desc: "Multi-zone redundancy ensures 99.99% uptime with zero single points of failure." },
  { icon: DollarSign, title: "Cost Optimized", desc: "Intelligent resource planning — pay only for what you use, nothing more." },
  { icon: Lock, title: "Security First", desc: "Zero-trust model, end-to-end encryption, and automated compliance enforcement." },
];

const useCases = ["SaaS Applications", "E-commerce Platforms", "Startup MVPs", "Enterprise Systems", "High-traffic Websites"];

/* ─── Phase Card ─────────────────────────────────── */
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
      {/* Timeline dot */}
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

/* ─── Main Page ───────────────────────────────────── */
const CloudSolutionsPage: React.FC = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    document.title = "Cloud Solutions | ULMiND";
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
          className="flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:gap-3 transition-all duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Services
        </motion.button>
      </div>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-16 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Mesh/gradient bg */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-100/60 via-orange-50/20 to-transparent dark:from-amber-900/20 dark:via-orange-950/10 dark:to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-amber-400/10 to-transparent dark:from-amber-500/10 dark:to-transparent rounded-full blur-3xl pointer-events-none" />
        <BlurBlob position={{ top: "15%", left: "2%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-amber-400" opacityClass="opacity-10" />
        <BlurBlob position={{ top: "55%", left: "65%" }} size={{ width: "350px", height: "350px" }} colorClass="bg-orange-400" opacityClass="opacity-10" />

        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
          {/* LEFT text */}
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-md">
                <Cloud className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-amber-600 dark:text-amber-400 text-[10px] font-black tracking-[0.4em] uppercase">Cloud Solutions</span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-black text-zinc-900 dark:text-white leading-none tracking-tighter uppercase mb-6">
                Scale Without
                <span className="block bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                  Boundaries
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8 max-w-lg font-medium">
                We design, deploy, and manage enterprise-grade cloud infrastructure built for speed, security, and exponential growth. From startup MVPs to global enterprise systems.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  { icon: Zap, label: "Auto-Scale" },
                  { icon: Shield, label: "Zero-Trust" },
                  { icon: BarChart3, label: "99.99% Uptime" },
                  { icon: DollarSign, label: "Cost-Optimized" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200/50 dark:border-white/10">
                    <Icon className="w-4 h-4 text-amber-500" />
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
                  className="h-14 px-8 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-amber-500/30 uppercase tracking-widest flex items-center gap-2 border-0"
                >
                  Deploy Now <ArrowRight className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => document.getElementById("roadmap-cloud")?.scrollIntoView({ behavior: "smooth" })}
                  className="h-14 px-8 border border-amber-300 dark:border-amber-700/50 text-amber-700 dark:text-amber-300 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all bg-transparent"
                >
                  View Roadmap
                </motion.button>
              </div>
            </Reveal>
          </motion.div>

          {/* RIGHT illustration */}
          <Reveal delay={0.3}>
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="flex justify-center"
            >
              <div
                className="w-full max-w-xl"
                style={{ filter: "drop-shadow(0 20px 60px rgba(245,158,11,0.25))" }}
              >
                <CloudArchSVG />
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── WHAT YOU GET ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-50/40 to-transparent dark:via-amber-950/10 pointer-events-none" />
        <BlurBlob position={{ top: "40%", left: "75%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-orange-400" opacityClass="opacity-10" />

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
          {/* LEFT illustration */}
          <Reveal>
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <div
                className="w-full max-w-lg mx-auto"
                style={{ filter: "drop-shadow(0 15px 40px rgba(234,88,12,0.2))" }}
              >
                <InfraStackSVG />
              </div>
            </motion.div>
          </Reveal>

          {/* RIGHT text */}
          <div>
            <Reveal>
              <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-orange-500/20 bg-orange-500/10">
                <span className="text-orange-600 dark:text-orange-400 text-[10px] font-black tracking-[0.4em] uppercase">Deliverables</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-8">
                What You <span className="text-amber-500">Get</span>
              </h2>
            </Reveal>
            <div className="space-y-3">
              {[
                "End-to-end cloud infrastructure setup",
                "Auto-scaling architecture configured",
                "Load balancing & traffic management",
                "CI/CD pipeline implementation",
                "Advanced security configuration",
                "Real-time monitoring & alerts",
              ].map((item, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <motion.div
                    whileHover={{ x: 8 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/50 dark:border-white/5 group cursor-default"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
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

      {/* ── ROADMAP TIMELINE ── */}
      <section id="roadmap-cloud" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <BlurBlob position={{ top: "20%", left: "3%" }} size={{ width: "500px", height: "500px" }} colorClass="bg-amber-400" opacityClass="opacity-8" />
        <BlurBlob position={{ top: "65%", left: "78%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-orange-400" opacityClass="opacity-6" />

        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-amber-500/20 bg-amber-500/10">
              <span className="text-amber-600 dark:text-amber-400 text-[10px] font-black tracking-[0.4em] uppercase">Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-4">
              Implementation <span className="text-amber-500">Roadmap</span>
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">Day 1 – Day 15, structured deployment</p>
          </Reveal>

          {/* Timeline */}
          <div className="relative">
            {/* Center line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-300 dark:via-amber-700 to-transparent -translate-x-1/2" />

            <div className="space-y-12">
              {phases.map((phase, i) => (
                <PhaseCard key={i} phase={phase} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-50/30 to-transparent dark:via-orange-950/10 pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <Reveal className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-orange-500/20 bg-orange-500/10">
              <span className="text-orange-600 dark:text-orange-400 text-[10px] font-black tracking-[0.4em] uppercase">Stack</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
              Technology <span className="text-amber-500">Stack</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStack.map((item, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <motion.div
                  whileHover={{ scale: 1.04, y: -4 }}
                  className="relative p-6 rounded-2xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/50 dark:border-white/10 overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1">{item.category}</p>
                    <p className="text-lg font-black text-zinc-900 dark:text-white">{item.tech}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── KEY FEATURES ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <BlurBlob position={{ top: "30%", left: "75%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-amber-400" opacityClass="opacity-10" />

        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-amber-500/20 bg-amber-500/10">
              <span className="text-amber-600 dark:text-amber-400 text-[10px] font-black tracking-[0.4em] uppercase">Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
              Cloud Built For <span className="text-amber-500">Scale</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyFeatures.map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.04, y: -6 }}
                  className="relative p-6 rounded-3xl bg-white dark:bg-white/[0.03] border border-zinc-200/60 dark:border-white/10 shadow-sm hover:shadow-xl dark:hover:shadow-amber-500/10 transition-all duration-300 overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-5 shadow-lg shadow-amber-500/30">
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

      {/* ── WHY CHOOSE US + SECURITY ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <BlurBlob position={{ top: "30%", left: "0%" }} size={{ width: "500px", height: "500px" }} colorClass="bg-orange-400" opacityClass="opacity-8" />
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Why Choose Us */}
          <Reveal>
            <div className="p-8 rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white shadow-2xl shadow-amber-500/30 h-full">
              <h2 className="text-3xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                <Star className="w-7 h-7" /> Why Choose Us
              </h2>
              <ul className="space-y-4">
                {[
                  "Future-proof cloud architecture",
                  "Cloud cost optimization expertise",
                  "Fast and secure deployment",
                  "Continuous monitoring & support",
                  "Business-focused infrastructure",
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

          {/* Security & Compliance */}
          <Reveal delay={0.15}>
            <ShineBorder borderRadius={24} borderWidth={1} color={["#f59e0b", "#fb923c", "#ef4444"]} className="w-full h-full">
              <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/50 dark:border-white/10 h-full">
                <h2 className="text-3xl font-black uppercase tracking-tight text-zinc-900 dark:text-white mb-6 flex items-center gap-3">
                  <Shield className="w-7 h-7 text-amber-500" /> Security & Compliance
                </h2>
                <div className="space-y-4">
                  {[
                    { label: "IAM & Role-based access control", icon: Lock },
                    { label: "End-to-end data encryption", icon: Shield },
                    { label: "Firewall & DDoS protection", icon: Globe2 },
                    { label: "Automated security audits", icon: Activity },
                  ].map(({ label, icon: Icon }, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-white/[0.03] border border-zinc-200/50 dark:border-white/5"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
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
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.06 }}
                  transition={{ delay: i * 0.07 }}
                  viewport={{ once: true }}
                  className="px-5 py-2.5 rounded-full border border-amber-300/40 dark:border-amber-700/30 bg-amber-50 dark:bg-amber-900/10 text-sm font-bold text-amber-700 dark:text-amber-300 cursor-default"
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
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950" />
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 via-orange-600/15 to-red-600/20" />

              {/* Hexagonal pattern overlay */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='52' viewBox='0 0 60 52'%3E%3Cpolygon points='30,2 58,17 58,47 30,62 2,47 2,17' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
                  backgroundSize: "60px 52px",
                }}
              />

              {/* Glow blobs */}
              <div className="absolute top-4 right-8 w-48 h-48 rounded-full bg-amber-500/20 blur-3xl" />
              <div className="absolute bottom-4 left-8 w-48 h-48 rounded-full bg-orange-500/20 blur-3xl" />

              <div className="relative z-10 p-12 md:p-16 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                  <Clock className="w-3.5 h-3.5 text-amber-300" />
                  <span className="text-amber-200 text-[10px] font-black tracking-[0.4em] uppercase">Ready in 15 Days</span>
                </div>

                <h2 className="text-4xl md:text-5xl xl:text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
                  Launch Your Cloud
                  <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                    Infrastructure
                  </span>
                </h2>

                <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto font-medium">
                  Ready to scale your infrastructure? Let's build a cloud system that grows with your business — not against it.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    onClick={() => navigate("/contact")}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="h-14 px-10 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-white rounded-2xl font-black text-sm shadow-2xl shadow-amber-500/40 uppercase tracking-widest border-0 flex items-center justify-center gap-2"
                  >
                    Get Cloud Setup <ArrowRight className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    onClick={() => navigate("/projects")}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="h-14 px-10 border border-white/20 text-white hover:bg-white/10 rounded-2xl font-black text-sm uppercase tracking-widest transition-all bg-transparent"
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

export default CloudSolutionsPage;
