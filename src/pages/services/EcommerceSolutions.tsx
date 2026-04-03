import React, { useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  ShoppingCart,
  Shield,
  Zap,
  BarChart3,
  Package,
  Tag,
  Truck,
  Star,
  Clock,
  CreditCard,
  RefreshCw,
  TrendingUp,
  Users,
  Lock,
  Layers,
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

/* ─── SVG: Shopping Flow Illustration ─────── */
const ShoppingFlowSVG: React.FC = () => (
  <svg viewBox="0 0 520 440" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <radialGradient id="bgGlowEC" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="violetGradEC" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#7c3aed" />
        <stop offset="100%" stopColor="#6d28d9" />
      </linearGradient>
      <linearGradient id="purpleGradEC" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#9333ea" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
      <linearGradient id="fuchsiaGradEC" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#c026d3" />
        <stop offset="100%" stopColor="#9333ea" />
      </linearGradient>
      <linearGradient id="cardBgEC" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#0f0a2e" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="lineGradEC" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#7c3aed" />
        <stop offset="100%" stopColor="#c026d3" />
      </linearGradient>
      <filter id="glowEC">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>

    {/* BG Glow */}
    <ellipse cx="260" cy="220" rx="210" ry="170" fill="url(#bgGlowEC)" />

    {/* Central cart hub */}
    <g transform="translate(160, 155)">
      <rect x="0" y="0" width="200" height="105" rx="18" fill="url(#cardBgEC)" stroke="#7c3aed44" strokeWidth="1.5" />
      <rect x="0" y="0" width="200" height="4" rx="2" fill="url(#violetGradEC)" />
      {/* Cart icon */}
      <circle cx="36" cy="46" r="20" fill="#7c3aed22" />
      <path d="M26 34 L29 34 L33 52 L46 52 L50 38 L30 38" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="35" cy="56" r="2.5" fill="#a78bfa" />
      <circle cx="46" cy="56" r="2.5" fill="#a78bfa" />
      <text x="64" y="39" fontFamily="system-ui" fontSize="11" fontWeight="800" fill="#a78bfa" letterSpacing="0.5">STORE ENGINE</text>
      <text x="64" y="56" fontFamily="system-ui" fontSize="9" fill="#94a3b8">Cart · Checkout · Orders</text>
      <text x="64" y="70" fontFamily="system-ui" fontSize="9" fill="#64748b">Conversion optimized</text>
      <rect x="148" y="28" width="40" height="15" rx="7" fill="#7c3aed22" stroke="#7c3aed44" strokeWidth="1" />
      <text x="158" y="40" fontFamily="system-ui" fontSize="7.5" fontWeight="700" fill="#a78bfa">LIVE</text>
    </g>

    {/* Top node: Products */}
    <g transform="translate(170, 30)">
      <rect x="0" y="0" width="180" height="72" rx="14" fill="url(#cardBgEC)" stroke="#9333ea30" strokeWidth="1" />
      <circle cx="28" cy="36" r="16" fill="#9333ea18" />
      <rect x="20" y="26" width="16" height="20" rx="3" stroke="#a78bfa" strokeWidth="1.8" fill="none" />
      <rect x="24" y="30" width="8" height="3" rx="1" fill="#a78bfa" opacity="0.6" />
      <rect x="24" y="35" width="5" height="3" rx="1" fill="#a78bfa" opacity="0.4" />
      <text x="52" y="32" fontFamily="system-ui" fontSize="10" fontWeight="700" fill="#a78bfa">PRODUCTS</text>
      <text x="52" y="48" fontFamily="system-ui" fontSize="8" fill="#64748b">Catalog · Variants</text>
    </g>

    {/* Left node: Payments */}
    <g transform="translate(20, 170)">
      <rect x="0" y="0" width="128" height="78" rx="14" fill="url(#cardBgEC)" stroke="#c026d330" strokeWidth="1" />
      <circle cx="28" cy="36" r="16" fill="#c026d318" />
      <rect x="18" y="28" width="20" height="14" rx="3" stroke="#e879f9" strokeWidth="1.8" fill="none" />
      <path d="M18 34 L38 34" stroke="#e879f9" strokeWidth="1.5" />
      <text x="52" y="31" fontFamily="system-ui" fontSize="9" fontWeight="700" fill="#e879f9">PAYMENT</text>
      <text x="52" y="47" fontFamily="system-ui" fontSize="8" fill="#64748b">Multi-gateway</text>
    </g>

    {/* Right node: Analytics */}
    <g transform="translate(372, 170)">
      <rect x="0" y="0" width="128" height="78" rx="14" fill="url(#cardBgEC)" stroke="#7c3aed30" strokeWidth="1" />
      <circle cx="28" cy="36" r="16" fill="#7c3aed18" />
      <path d="M20 44 L24 38 L28 42 L32 34 L36 40" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <text x="52" y="31" fontFamily="system-ui" fontSize="9" fontWeight="700" fill="#a78bfa">ANALYTICS</text>
      <text x="52" y="47" fontFamily="system-ui" fontSize="8" fill="#64748b">Revenue · CVR</text>
    </g>

    {/* Bottom node: Delivery */}
    <g transform="translate(155, 335)">
      <rect x="0" y="0" width="210" height="72" rx="14" fill="url(#cardBgEC)" stroke="#9333ea30" strokeWidth="1" />
      <circle cx="32" cy="36" r="16" fill="#9333ea18" />
      <rect x="21" y="30" width="14" height="12" rx="2" stroke="#c084fc" strokeWidth="1.8" fill="none" />
      <path d="M35 38 L41 38 L44 34 L41 30 L35 30" stroke="#c084fc" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <circle cx="27" cy="44" r="3" stroke="#c084fc" strokeWidth="1.5" fill="none" />
      <circle cx="40" cy="44" r="3" stroke="#c084fc" strokeWidth="1.5" fill="none" />
      <text x="60" y="32" fontFamily="system-ui" fontSize="10" fontWeight="700" fill="#c084fc">SHIPPING & DELIVERY</text>
      <text x="60" y="48" fontFamily="system-ui" fontSize="8" fill="#64748b">Live tracking · Auto dispatch</text>
    </g>

    {/* Connecting lines */}
    <path d="M260 155 L260 104" stroke="url(#lineGradEC)" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.7" />
    <path d="M160 200 L148 205" stroke="url(#lineGradEC)" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.7" />
    <path d="M360 200 L372 205" stroke="url(#lineGradEC)" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.7" />
    <path d="M250 260 L240 335" stroke="url(#lineGradEC)" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.7" />

    {/* Animated dots */}
    <circle cx="260" cy="128" r="3" fill="#7c3aed" filter="url(#glowEC)">
      <animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite" />
    </circle>
    <circle cx="154" cy="204" r="3" fill="#c026d3" filter="url(#glowEC)">
      <animate attributeName="opacity" values="0;1;0" dur="1.8s" begin="0.6s" repeatCount="indefinite" />
    </circle>
    <circle cx="372" cy="204" r="3" fill="#9333ea" filter="url(#glowEC)">
      <animate attributeName="opacity" values="0;1;0" dur="1.8s" begin="1.2s" repeatCount="indefinite" />
    </circle>

    {/* Floating particles */}
    <circle cx="100" cy="130" r="2.5" fill="#7c3aed" opacity="0.5">
      <animate attributeName="r" values="2.5;4.5;2.5" dur="2.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="420" cy="280" r="2" fill="#c026d3" opacity="0.6">
      <animate attributeName="r" values="2;3.5;2" dur="3s" repeatCount="indefinite" />
    </circle>
    <circle cx="80" cy="310" r="3" fill="#9333ea" opacity="0.4">
      <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
    </circle>
  </svg>
);

/* ─── SVG: Conversion Funnel Visual ────── */
const ConversionFunnelSVG: React.FC = () => (
  <svg viewBox="0 0 480 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="funnelBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0f0a2e" />
        <stop offset="100%" stopColor="#1e1b4b" />
      </linearGradient>
      <linearGradient id="bar1EC" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#7c3aed" />
        <stop offset="100%" stopColor="#9333ea" />
      </linearGradient>
      <linearGradient id="bar2EC" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#9333ea" />
        <stop offset="100%" stopColor="#c026d3" />
      </linearGradient>
      <linearGradient id="bar3EC" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#c026d3" />
        <stop offset="100%" stopColor="#e879f9" />
      </linearGradient>
      <filter id="glowEC2">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>

    <rect x="20" y="10" width="440" height="340" rx="22" fill="url(#funnelBg)" />
    <rect x="20" y="10" width="440" height="340" rx="22" stroke="#7c3aed22" strokeWidth="1.5" />

    {/* Top bar */}
    <rect x="20" y="10" width="440" height="44" rx="22" fill="#7c3aed0a" />
    <circle cx="52" cy="32" r="5.5" fill="#ef4444" />
    <circle cx="70" cy="32" r="5.5" fill="#f59e0b" />
    <circle cx="88" cy="32" r="5.5" fill="#7c3aed" />
    <text x="120" y="36" fontFamily="system-ui" fontSize="10" fontWeight="700" fill="#a78bfa" letterSpacing="1.5">USER CONVERSION FLOW</text>

    {/* Funnel steps */}
    {[
      { y: 72, label: "BROWSE PRODUCTS", w: 400, color: "url(#bar1EC)", count: "10,000 visitors", pct: "100%" },
      { y: 132, label: "ADD TO CART", w: 310, color: "url(#bar2EC)", count: "4,200 users", pct: "42%" },
      { y: 192, label: "CHECKOUT INITIATED", w: 230, color: "url(#bar3EC)", count: "2,100 users", pct: "21%" },
      { y: 252, label: "PAYMENT COMPLETE", w: 165, color: "url(#bar1EC)", count: "1,470 orders", pct: "14.7%" },
      { y: 302, label: "REPEAT PURCHASE", w: 110, color: "url(#bar2EC)", count: "882 loyal", pct: "8.8%" },
    ].map((row, i) => (
      <g key={i} transform={`translate(40, ${row.y})`}>
        <rect width={row.w} height="44" rx="10" fill={row.color} opacity="0.18" />
        <rect width={row.w} height="44" rx="10" stroke={row.color.includes("bar1") ? "#7c3aed" : row.color.includes("bar2") ? "#9333ea" : "#c026d3"} strokeWidth="1" opacity="0.4" />
        <rect width="6" height="44" rx="3" fill={row.color} />
        <text x="18" y="18" fontFamily="system-ui" fontSize="8" fontWeight="800" fill="#c4b5fd" letterSpacing="1.5">{row.label}</text>
        <text x="18" y="34" fontFamily="system-ui" fontSize="9" fill="#94a3b8">{row.count}</text>
        <text x={row.w - 36} y="26" fontFamily="system-ui" fontSize="11" fontWeight="800" fill="#e9d5ff">{row.pct}</text>
        {/* Live dot */}
        <circle cx={row.w + 14} cy="22" r="4.5" fill="#7c3aed10">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
        </circle>
        <circle cx={row.w + 14} cy="22" r="3" fill={i % 2 === 0 ? "#a78bfa" : "#e879f9"} filter="url(#glowEC2)" />
      </g>
    ))}
  </svg>
);

/* ─── Phase Data ──────────────────────────────── */
const phases = [
  {
    phase: "PHASE 1",
    label: "Strategy & Planning",
    days: "Day 1–3",
    color: "#7c3aed",
    borderColor: "border-violet-500/40",
    bg: "from-violet-500/10 to-violet-500/5",
    dot: "#7c3aed",
    days_data: [
      { day: "DAY 1 — BUSINESS ANALYSIS", items: ["Business & product analysis", "Competitor research", "Customer journey mapping"] },
      { day: "DAY 2–3 — PLANNING", items: ["Feature planning", "User flow structure", "Tech stack selection"] },
    ],
  },
  {
    phase: "PHASE 2",
    label: "UI/UX Design",
    days: "Day 4–5",
    color: "#9333ea",
    borderColor: "border-purple-500/40",
    bg: "from-purple-500/10 to-purple-500/5",
    dot: "#9333ea",
    days_data: [
      { day: "DAY 4 — UI DESIGN", items: ["Premium modern UI design", "Mobile-first layout"] },
      { day: "DAY 5 — UX OPTIMIZATION", items: ["Conversion-focused design", "CTA & funnel optimization"] },
    ],
  },
  {
    phase: "PHASE 3",
    label: "Core Development",
    days: "Day 6–11",
    color: "#a855f7",
    borderColor: "border-purple-400/40",
    bg: "from-purple-400/10 to-purple-400/5",
    dot: "#a855f7",
    days_data: [
      { day: "DAY 6–7 — FRONTEND", items: ["Homepage, product pages, cart, checkout"] },
      { day: "DAY 8–9 — BACKEND", items: ["API development", "Product / user / order system"] },
      { day: "DAY 10 — PAYMENTS", items: ["Razorpay, PhonePe, Paytm, Stripe, UPI"] },
      { day: "DAY 11 — ADVANCED", items: ["Wishlist, coupon system, discounts"] },
    ],
  },
  {
    phase: "PHASE 4",
    label: "Core Systems",
    days: "Day 12–13",
    color: "#c026d3",
    borderColor: "border-fuchsia-600/40",
    bg: "from-fuchsia-600/10 to-fuchsia-600/5",
    dot: "#c026d3",
    days_data: [
      { day: "DAY 12 — INVENTORY", items: ["Real-time stock management", "Auto stock updates"] },
      { day: "DAY 13 — ORDERS", items: ["Order lifecycle management", "Status tracking & notifications"] },
    ],
  },
  {
    phase: "PHASE 5",
    label: "Testing & Optimization",
    days: "Day 14",
    color: "#86198f",
    borderColor: "border-fuchsia-900/40",
    bg: "from-fuchsia-900/10 to-fuchsia-900/5",
    dot: "#86198f",
    days_data: [
      { day: "DAY 14 — QA", items: ["Payment flow testing", "Checkout optimization", "Performance tuning"] },
    ],
  },
  {
    phase: "PHASE 6",
    label: "Deployment",
    days: "Day 15",
    color: "#581c87",
    borderColor: "border-purple-900/40",
    bg: "from-purple-900/10 to-purple-900/5",
    dot: "#581c87",
    days_data: [
      { day: "DAY 15 — LAUNCH", items: ["Live launch", "Domain & hosting setup", "Final delivery"] },
    ],
  },
];

const paymentGateways = [
  { name: "Razorpay", bg: "#7c3aed" },
  { name: "Stripe", bg: "#9333ea" },
  { name: "PhonePe", bg: "#a855f7" },
  { name: "PayPal", bg: "#c026d3" },
  { name: "Paytm", bg: "#7c3aed" },
  { name: "UPI", bg: "#9333ea" },
  { name: "Net Banking", bg: "#a855f7" },
  { name: "Cards", bg: "#c026d3" },
];

const bentoFeatures = [
  { icon: Package, title: "Inventory Management", desc: "Real-time stock tracking, low stock alerts, bulk product management, and category control." },
  { icon: BarChart3, title: "Analytics & Growth", desc: "Revenue tracking, conversion rate analysis, customer behavior insights, and product performance reports." },
  { icon: Truck, title: "Shipping & Delivery", desc: "Shipping partner integration, dynamic cost calculation, zone-based delivery, and live order tracking." },
  { icon: Users, title: "Admin Dashboard", desc: "Full control panel — products, orders, users, sales analytics, payments, and refund handling." },
];

const useCases = ["Fashion & Apparel", "Electronics Store", "Grocery Delivery", "Digital Products", "Dropshipping"];

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
            <span className="text-xs font-black tracking-wider px-3 py-1.5 rounded-full text-white" style={{ backgroundColor: phase.color }}>
              {phase.phase}
            </span>
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

/* ─── Main Page ──────────────────────────────── */
const EcommerceSolutionsPage: React.FC = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    document.title = "E-Commerce Solutions | ULMiND";
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
          className="flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:gap-3 transition-all duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Services
        </motion.button>
      </div>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-16 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-violet-100/70 via-purple-50/20 to-transparent dark:from-violet-900/20 dark:via-purple-950/10 dark:to-transparent pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-gradient-to-tl from-violet-400/10 to-transparent dark:from-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <BlurBlob position={{ top: "20%", left: "5%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-violet-400" opacityClass="opacity-10" />
        <BlurBlob position={{ top: "60%", left: "70%" }} size={{ width: "350px", height: "350px" }} colorClass="bg-fuchsia-400" opacityClass="opacity-10" />

        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
          {/* LEFT */}
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-violet-500/30 bg-violet-500/10 backdrop-blur-md">
                <ShoppingCart className="w-3.5 h-3.5 text-violet-500" />
                <span className="text-violet-600 dark:text-violet-400 text-[10px] font-black tracking-[0.4em] uppercase">E-Commerce Solutions</span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-black text-zinc-900 dark:text-white leading-none tracking-tighter uppercase mb-6">
                Stores That
                <span className="block bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
                  Actually Sell
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8 max-w-lg font-medium">
                We build high-converting, scalable e-commerce platforms — crafted to maximize conversions, streamline operations, and deliver a seamless shopping experience from browse to buy.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  { icon: Zap, label: "High Converting" },
                  { icon: Shield, label: "Secure Payments" },
                  { icon: TrendingUp, label: "Growth Ready" },
                  { icon: Tag, label: "Multi-Vendor" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200/50 dark:border-white/10">
                    <Icon className="w-4 h-4 text-violet-500" />
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
                  className="h-14 px-8 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-violet-500/30 uppercase tracking-widest flex items-center gap-2 border-0"
                >
                  Start Your Store <ArrowRight className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => document.getElementById("roadmap-ecom")?.scrollIntoView({ behavior: "smooth" })}
                  className="h-14 px-8 border border-violet-300 dark:border-violet-700/50 text-violet-700 dark:text-violet-300 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all bg-transparent"
                >
                  View Roadmap
                </motion.button>
              </div>
            </Reveal>
          </motion.div>

          {/* RIGHT illustration */}
          <Reveal delay={0.3}>
            <motion.div
              animate={{ y: [0, -18, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="flex justify-center"
            >
              <div className="w-full max-w-xl" style={{ filter: "drop-shadow(0 20px 60px rgba(124,58,237,0.3))" }}>
                <ShoppingFlowSVG />
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── WHAT YOU GET ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-50/40 to-transparent dark:via-violet-950/10 pointer-events-none" />
        <BlurBlob position={{ top: "40%", left: "80%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-purple-400" opacityClass="opacity-10" />

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
          {/* LEFT illustration */}
          <Reveal>
            <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
              <div className="w-full max-w-lg mx-auto" style={{ filter: "drop-shadow(0 15px 40px rgba(192,38,211,0.2))" }}>
                <ConversionFunnelSVG />
              </div>
            </motion.div>
          </Reveal>

          {/* RIGHT text */}
          <div>
            <Reveal>
              <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-purple-500/20 bg-purple-500/10">
                <span className="text-purple-600 dark:text-purple-400 text-[10px] font-black tracking-[0.4em] uppercase">Deliverables</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-8">
                What You <span className="text-violet-500">Get</span>
              </h2>
            </Reveal>
            <div className="space-y-3">
              {[
                "Complete custom e-commerce website",
                "Conversion-focused UI/UX design",
                "Secure multi-gateway payment system",
                "Advanced inventory & order management",
                "Powerful admin dashboard",
                "Abandoned cart recovery system",
                "Analytics & performance tracking",
                "Scalable backend infrastructure",
              ].map((item, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <motion.div
                    whileHover={{ x: 8 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/50 dark:border-white/5 group cursor-default"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
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

      {/* ── BENTO FEATURES ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <BlurBlob position={{ top: "30%", left: "10%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-violet-400" opacityClass="opacity-8" />
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-violet-500/20 bg-violet-500/10">
              <span className="text-violet-600 dark:text-violet-400 text-[10px] font-black tracking-[0.4em] uppercase">Platform Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
              Everything You <span className="text-violet-500">Need</span>
            </h2>
          </Reveal>

          {/* Top row: 4 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {bentoFeatures.map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.04, y: -6 }}
                  className="relative p-6 rounded-3xl bg-white dark:bg-white/[0.03] border border-zinc-200/60 dark:border-white/10 shadow-sm hover:shadow-xl dark:hover:shadow-violet-500/10 transition-all duration-300 overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-5 shadow-lg shadow-violet-500/30">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-black text-zinc-900 dark:text-white text-lg mb-2">{title}</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>

          {/* Bottom row: Wide Payment card + Conversion card */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mt-5">
            {/* Payment card (wide) */}
            <Reveal className="md:col-span-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative p-8 rounded-3xl bg-gradient-to-br from-violet-950/90 to-zinc-950 border border-violet-500/20 overflow-hidden h-full"
              >
                <div className="absolute top-0 right-0 w-56 h-56 bg-violet-500/10 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-black text-white text-xl uppercase tracking-tight">Payment System</h3>
                  </div>
                  <p className="text-zinc-400 text-sm mb-6">Secure multi-gateway integration with webhook verification, fraud protection, refund handling, and subscription billing.</p>
                  <div className="flex flex-wrap gap-2">
                    {paymentGateways.map((gw, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ delay: i * 0.06 }}
                        viewport={{ once: true }}
                        className="px-3 py-1.5 rounded-full text-xs font-black border border-violet-500/30 text-violet-300 bg-violet-500/10"
                      >
                        {gw.name}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </Reveal>

            {/* Conversion boosters card */}
            <Reveal className="md:col-span-2">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="relative p-8 rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 text-white overflow-hidden h-full shadow-2xl shadow-violet-500/30"
              >
                <div className="absolute bottom-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <TrendingUp className="w-10 h-10 mb-4 opacity-90" />
                  <h3 className="font-black text-xl uppercase tracking-tight mb-3">Conversion Boosters</h3>
                  <div className="space-y-2.5">
                    {["Abandoned cart recovery", "Smart product recommendations", "One-click checkout", "Coupon & discount engine", "Trust badges & secure UI"].map((t, i) => (
                      <div key={i} className="flex items-center gap-2 text-white/90 text-sm font-semibold">
                        <RefreshCw className="w-3.5 h-3.5 flex-shrink-0" />{t}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── HERO IMAGE SECTION ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <Reveal>
              <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10">
                <span className="text-fuchsia-600 dark:text-fuchsia-400 text-[10px] font-black tracking-[0.4em] uppercase">Dashboard</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-6">
                Full Control <span className="text-fuchsia-500">Panel</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8 font-medium">
                A powerful admin dashboard gives you total control — manage products, track orders, view real-time analytics, handle payments, and grow your business all in one place.
              </p>
            </Reveal>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Package, label: "Product Management" },
                { icon: BarChart3, label: "Sales Analytics" },
                { icon: Layers, label: "Order Control" },
                { icon: Lock, label: "Access Control" },
              ].map(({ icon: Icon, label }, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/50 dark:border-white/5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{label}</span>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Dashboard image */}
          <Reveal delay={0.2}>
            <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
              <img
                src="/illustrations/ecommerce-dashboard.png"
                alt="E-Commerce Admin Dashboard"
                className="w-full max-w-lg mx-auto rounded-3xl shadow-2xl"
                style={{ filter: "drop-shadow(0 20px 60px rgba(124,58,237,0.3))" }}
              />
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── USER FLOW ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-purple-500/20 bg-purple-500/10">
              <span className="text-purple-600 dark:text-purple-400 text-[10px] font-black tracking-[0.4em] uppercase">User Journey</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
              Complete <span className="text-violet-500">User Flow</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-0">
              {["Browse Products", "Add to Cart", "Checkout", "Payment", "Order Confirmation", "Delivery Tracking"].map((step, i, arr) => (
                <React.Fragment key={step}>
                  <motion.div
                    whileHover={{ scale: 1.06 }}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-400/30 dark:border-violet-700/30 text-sm font-black text-violet-700 dark:text-violet-300 text-center"
                  >
                    {step}
                  </motion.div>
                  {i < arr.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-violet-400 mx-1 hidden md:block flex-shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
            <p className="text-center text-zinc-500 dark:text-zinc-400 text-sm mt-6 font-medium">
              ✦ Every step is optimized to reduce drop-offs and maximize conversions
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── ROADMAP ── */}
      <section id="roadmap-ecom" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <BlurBlob position={{ top: "20%", left: "3%" }} size={{ width: "500px", height: "500px" }} colorClass="bg-violet-400" opacityClass="opacity-8" />
        <BlurBlob position={{ top: "65%", left: "78%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-fuchsia-400" opacityClass="opacity-6" />

        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-violet-500/20 bg-violet-500/10">
              <span className="text-violet-600 dark:text-violet-400 text-[10px] font-black tracking-[0.4em] uppercase">Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-4">
              Development <span className="text-violet-500">Roadmap</span>
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">Day 1 – Day 15, structured delivery</p>
          </Reveal>

          <div className="relative">
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-violet-300 dark:via-violet-700 to-transparent -translate-x-1/2" />
            <div className="space-y-12">
              {phases.map((phase, i) => (
                <PhaseCard key={i} phase={phase} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <BlurBlob position={{ top: "30%", left: "0%" }} size={{ width: "500px", height: "500px" }} colorClass="bg-purple-400" opacityClass="opacity-8" />
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Why choose us */}
          <Reveal>
            <div className="p-8 rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 text-white shadow-2xl shadow-violet-500/30 h-full">
              <h2 className="text-3xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                <Star className="w-7 h-7" /> Why Choose Us
              </h2>
              <ul className="space-y-4">
                {[
                  "Business-focused development approach",
                  "Conversion-driven design",
                  "Scalable & future-ready systems",
                  "Secure and reliable architecture",
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

          {/* Security */}
          <Reveal delay={0.15}>
            <ShineBorder borderRadius={24} borderWidth={1} color={["#7c3aed", "#c026d3", "#9333ea"]} className="w-full h-full">
              <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/50 dark:border-white/10 h-full">
                <h2 className="text-3xl font-black uppercase tracking-tight text-zinc-900 dark:text-white mb-6 flex items-center gap-3">
                  <Shield className="w-7 h-7 text-violet-500" /> Security System
                </h2>
                <div className="space-y-4">
                  {[
                    { label: "Secure authentication & session mgmt", icon: Lock },
                    { label: "Encrypted payments & PCI compliance", icon: CreditCard },
                    { label: "Fraud detection & prevention", icon: Shield },
                    { label: "Admin access control & roles", icon: Users },
                    { label: "Data protection & GDPR compliance", icon: Zap },
                  ].map(({ label, icon: Icon }, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-white/[0.03] border border-zinc-200/50 dark:border-white/5"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0">
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
                  className="px-5 py-2.5 rounded-full border border-violet-300/40 dark:border-violet-700/30 bg-violet-50 dark:bg-violet-900/10 text-sm font-bold text-violet-700 dark:text-violet-300 cursor-default"
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
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-purple-600/15 to-fuchsia-600/20" />
              <div className="absolute top-4 right-8 w-32 h-32 rounded-full bg-violet-500/20 blur-3xl" />
              <div className="absolute bottom-4 left-8 w-32 h-32 rounded-full bg-fuchsia-500/20 blur-3xl" />

              <div className="relative z-10 p-12 md:p-16 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                  <Clock className="w-3.5 h-3.5 text-white/80" />
                  <span className="text-white/80 text-[10px] font-black tracking-[0.4em] uppercase">Ready in 15 Days</span>
                </div>

                <h2 className="text-4xl md:text-5xl xl:text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
                  Build Your Store
                  <span className="block bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                    Drive Real Sales
                  </span>
                </h2>

                <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto font-medium">
                  Ready to build a high-converting online store? Let's create an e-commerce platform that actually drives sales.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate("/contact")}
                    className="h-14 px-10 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white rounded-2xl font-black text-sm shadow-2xl shadow-violet-500/40 uppercase tracking-widest flex items-center gap-2 justify-center border-0"
                  >
                    Start Your Store <ArrowRight className="w-5 h-5" />
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

export default EcommerceSolutionsPage;
