import React, { useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Cpu,
  Brain,
  Zap,
  Shield,
  BarChart3,
  Bot,
  Network,
  Layers,
  TrendingUp,
  Eye,
  MessageSquare,
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

/* ─── SVG: Neural Network Illustration ─────────────── */
const NeuralNetworkSVG: React.FC = () => (
  <svg viewBox="0 0 540 460" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <radialGradient id="aiGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#dc2626" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="aiNodeGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1a0000" />
        <stop offset="100%" stopColor="#0d0d0d" />
      </linearGradient>
      <linearGradient id="aiRedGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#dc2626" />
        <stop offset="100%" stopColor="#991b1b" />
      </linearGradient>
      <linearGradient id="aiCrimsonGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#b91c1c" />
      </linearGradient>
      <linearGradient id="aiLineGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#dc2626" stopOpacity="0.2" />
      </linearGradient>
      <filter id="aiGlowFilter">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="softGlow">
        <feGaussianBlur stdDeviation="6" result="coloredBlur" />
        <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>

    {/* BG glow */}
    <ellipse cx="270" cy="230" rx="210" ry="180" fill="url(#aiGlow)" opacity="0.5" />

    {/* === INPUT LAYER (left) === */}
    {[80, 150, 220, 290, 360].map((cy, i) => (
      <g key={`in-${i}`}>
        <circle cx="70" cy={cy} r="22" fill="url(#aiNodeGrad)" stroke="#dc262644" strokeWidth="1.5" />
        <circle cx="70" cy={cy} r="22" fill="#dc262608" />
        <circle cx="70" cy={cy} r="10" fill="url(#aiRedGrad)" filter="url(#aiGlowFilter)" />
        <text x="70" y={cy + 4} textAnchor="middle" fontFamily="system-ui" fontSize="7" fontWeight="800" fill="#fff" opacity="0.8">IN</text>
      </g>
    ))}

    {/* === HIDDEN LAYER 1 === */}
    {[100, 185, 270, 355].map((cy, i) => (
      <g key={`h1-${i}`}>
        <circle cx="190" cy={cy} r="26" fill="url(#aiNodeGrad)" stroke="#ef444433" strokeWidth="1.5" />
        <circle cx="190" cy={cy} r="26" fill="#ef444406" />
        <circle cx="190" cy={cy} r="13" fill="url(#aiCrimsonGrad)" filter="url(#aiGlowFilter)" opacity="0.9" />
        <text x="190" y={cy + 4} textAnchor="middle" fontFamily="system-ui" fontSize="7" fontWeight="800" fill="#fff" opacity="0.9">HL1</text>
      </g>
    ))}

    {/* === HIDDEN LAYER 2 === */}
    {[130, 230, 330].map((cy, i) => (
      <g key={`h2-${i}`}>
        <circle cx="320" cy={cy} r="30" fill="url(#aiNodeGrad)" stroke="#dc262655" strokeWidth="2" />
        <circle cx="320" cy={cy} r="30" fill="#dc262609" />
        <circle cx="320" cy={cy} r="15" fill="url(#aiRedGrad)" filter="url(#softGlow)" opacity="0.95" />
        <text x="320" y={cy + 5} textAnchor="middle" fontFamily="system-ui" fontSize="8" fontWeight="800" fill="#fff">HL2</text>
      </g>
    ))}

    {/* === OUTPUT LAYER === */}
    {[160, 260, 360].map((cy, i) => (
      <g key={`out-${i}`}>
        <circle cx="460" cy={cy} r="28" fill="url(#aiNodeGrad)" stroke="#ef4444" strokeWidth="1.5" />
        <circle cx="460" cy={cy} r="28" fill="#ef44440a" />
        <circle cx="460" cy={cy} r="14" fill="url(#aiCrimsonGrad)" filter="url(#softGlow)" />
        <text x="460" y={cy + 5} textAnchor="middle" fontFamily="system-ui" fontSize="8" fontWeight="800" fill="#fff">OUT</text>
      </g>
    ))}

    {/* Connections: Input → H1 */}
    {[80, 150, 220, 290, 360].flatMap((y1, i) =>
      [100, 185, 270, 355].map((y2, j) => (
        <line key={`il-${i}-${j}`} x1="92" y1={y1} x2="164" y2={y2} stroke="url(#aiLineGrad)" strokeWidth="0.8" opacity="0.35" />
      ))
    )}

    {/* Connections: H1 → H2 */}
    {[100, 185, 270, 355].flatMap((y1, i) =>
      [130, 230, 330].map((y2, j) => (
        <line key={`h1l-${i}-${j}`} x1="216" y1={y1} x2="290" y2={y2} stroke="url(#aiLineGrad)" strokeWidth="1" opacity="0.45" />
      ))
    )}

    {/* Connections: H2 → Output */}
    {[130, 230, 330].flatMap((y1, i) =>
      [160, 260, 360].map((y2, j) => (
        <line key={`h2l-${i}-${j}`} x1="350" y1={y1} x2="432" y2={y2} stroke="url(#aiLineGrad)" strokeWidth="1.2" opacity="0.55" />
      ))
    )}

    {/* Animated travelling dots */}
    {[
      { x1: 92, y1: 150, x2: 164, y2: 185, dur: "1.8s" },
      { x1: 216, y1: 185, x2: 290, y2: 230, dur: "2s", begin: "0.4s" },
      { x1: 350, y1: 230, x2: 432, y2: 260, dur: "1.6s", begin: "0.8s" },
      { x1: 92, y1: 220, x2: 164, y2: 270, dur: "2.2s", begin: "0.2s" },
      { x1: 216, y1: 270, x2: 290, y2: 130, dur: "1.9s", begin: "0.6s" },
    ].map((d, i) => (
      <circle key={`dot-${i}`} r="3.5" fill="#ef4444" filter="url(#aiGlowFilter)" opacity="0.9">
        <animateMotion dur={d.dur} begin={d.begin || "0s"} repeatCount="indefinite">
          <mpath xlinkHref={`#path-ai-${i}`} />
        </animateMotion>
        <animate attributeName="opacity" values="0;1;0" dur={d.dur} repeatCount="indefinite" />
      </circle>
    ))}
    {[
      { x1: 92, y1: 150, x2: 164, y2: 185 },
      { x1: 216, y1: 185, x2: 290, y2: 230 },
      { x1: 350, y1: 230, x2: 432, y2: 260 },
      { x1: 92, y1: 220, x2: 164, y2: 270 },
      { x1: 216, y1: 270, x2: 290, y2: 130 },
    ].map((p, i) => (
      <path key={`path-ai-${i}`} id={`path-ai-${i}`} d={`M${p.x1},${p.y1} L${p.x2},${p.y2}`} fill="none" />
    ))}

    {/* Labels */}
    <text x="70" y="395" textAnchor="middle" fontFamily="system-ui" fontSize="9" fontWeight="700" fill="#ef4444" letterSpacing="1" opacity="0.8">INPUT</text>
    <text x="190" y="395" textAnchor="middle" fontFamily="system-ui" fontSize="9" fontWeight="700" fill="#ef4444" letterSpacing="1" opacity="0.8">LAYER 1</text>
    <text x="320" y="395" textAnchor="middle" fontFamily="system-ui" fontSize="9" fontWeight="700" fill="#ef4444" letterSpacing="1" opacity="0.8">LAYER 2</text>
    <text x="460" y="395" textAnchor="middle" fontFamily="system-ui" fontSize="9" fontWeight="700" fill="#ef4444" letterSpacing="1" opacity="0.8">OUTPUT</text>

    {/* Floating accuracy badge */}
    <g transform="translate(360, 30)">
      <rect width="120" height="48" rx="12" fill="#1a0000" stroke="#dc262640" strokeWidth="1" />
      <rect width="120" height="48" rx="12" fill="#dc262608" />
      <text x="60" y="16" textAnchor="middle" fontFamily="system-ui" fontSize="8" fontWeight="700" fill="#ef4444">ACCURACY</text>
      <text x="60" y="34" textAnchor="middle" fontFamily="system-ui" fontSize="18" fontWeight="900" fill="#fff">97.4%</text>
    </g>
    <g transform="translate(10, 30)">
      <rect width="110" height="48" rx="12" fill="#1a0000" stroke="#dc262640" strokeWidth="1" />
      <rect width="110" height="48" rx="12" fill="#dc262608" />
      <text x="55" y="16" textAnchor="middle" fontFamily="system-ui" fontSize="8" fontWeight="700" fill="#ef4444">MODEL</text>
      <text x="55" y="34" textAnchor="middle" fontFamily="system-ui" fontSize="14" fontWeight="900" fill="#fff">TRAINED</text>
    </g>

    {/* Pulsing outer rings on central H2 node */}
    <circle cx="320" cy="230" r="40" stroke="#ef4444" strokeWidth="1" fill="none" opacity="0.2">
      <animate attributeName="r" values="35;55;35" dur="3s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" />
    </circle>
  </svg>
);

/* ─── SVG: AI Dashboard Illustration ─────────── */
const AiDashboardSVG: React.FC = () => (
  <svg viewBox="0 0 500 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="dashBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0d0000" />
        <stop offset="100%" stopColor="#1a0505" />
      </linearGradient>
      <linearGradient id="dashRed1" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#dc2626" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#dc2626" stopOpacity="0.8" />
      </linearGradient>
      <linearGradient id="dashRed2" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#ef4444" stopOpacity="0.6" />
      </linearGradient>
      <linearGradient id="dashRed3" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#b91c1c" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.9" />
      </linearGradient>
    </defs>

    {/* Main frame */}
    <rect x="30" y="20" width="440" height="380" rx="20" fill="url(#dashBg)" />
    <rect x="30" y="20" width="440" height="380" rx="20" stroke="#dc262622" strokeWidth="1.5" />

    {/* Top bar */}
    <rect x="30" y="20" width="440" height="44" rx="20" fill="#dc262610" />
    <circle cx="62" cy="42" r="6" fill="#ef4444" opacity="0.8" />
    <circle cx="82" cy="42" r="6" fill="#f59e0b" opacity="0.8" />
    <circle cx="102" cy="42" r="6" fill="#22c55e" opacity="0.8" />
    <text x="200" y="47" fontFamily="system-ui" fontSize="11" fontWeight="800" fill="#ef4444" letterSpacing="2">AI ANALYTICS DASHBOARD</text>

    {/* Metric cards row */}
    {[
      { x: 50, label: "ACCURACY", val: "97.4%", color: "#ef4444" },
      { x: 185, label: "MODELS", val: "12", color: "#dc2626" },
      { x: 320, label: "PROCESSED", val: "2.4M", color: "#b91c1c" },
    ].map((m, i) => (
      <g key={i} transform={`translate(${m.x}, 80)`}>
        <rect width="115" height="68" rx="12" fill="#dc262609" stroke={`${m.color}33`} strokeWidth="1" />
        <text x="58" y="22" textAnchor="middle" fontFamily="system-ui" fontSize="8" fontWeight="700" fill={m.color} letterSpacing="1">{m.label}</text>
        <text x="58" y="48" textAnchor="middle" fontFamily="system-ui" fontSize="22" fontWeight="900" fill="#fff">{m.val}</text>
      </g>
    ))}

    {/* Chart area */}
    <rect x="50" y="168" width="280" height="140" rx="12" fill="#dc262606" stroke="#dc262620" strokeWidth="1" />
    <text x="68" y="188" fontFamily="system-ui" fontSize="9" fontWeight="700" fill="#ef4444" letterSpacing="1">MODEL PERFORMANCE</text>

    {/* Bar chart */}
    {[
      { x: 68, h: 60, color: "url(#dashRed1)" },
      { x: 98, h: 85, color: "url(#dashRed2)" },
      { x: 128, h: 50, color: "url(#dashRed1)" },
      { x: 158, h: 95, color: "url(#dashRed3)" },
      { x: 188, h: 70, color: "url(#dashRed2)" },
      { x: 218, h: 100, color: "url(#dashRed3)" },
      { x: 248, h: 80, color: "url(#dashRed1)" },
      { x: 278, h: 90, color: "url(#dashRed2)" },
    ].map((b, i) => (
      <g key={i}>
        <rect x={b.x} y={283 - b.h} width="20" height={b.h} rx="4" fill={b.color} />
        <rect x={b.x} y={283 - b.h} width="20" height={b.h} rx="4" fill="none" stroke="#ef444422" strokeWidth="1" />
      </g>
    ))}
    <line x1="50" y1="284" x2="330" y2="284" stroke="#dc262630" strokeWidth="1" />

    {/* Right panel: process flow */}
    <rect x="350" y="168" width="110" height="140" rx="12" fill="#dc262606" stroke="#dc262620" strokeWidth="1" />
    <text x="405" y="186" textAnchor="middle" fontFamily="system-ui" fontSize="8" fontWeight="700" fill="#ef4444">AI FLOW</text>
    {["Data In", "Process", "Predict", "Output"].map((step, i) => (
      <g key={i} transform={`translate(362, ${198 + i * 26})`}>
        <rect width="86" height="18" rx="6" fill="#dc262614" />
        <circle cx="12" cy="9" r="5" fill="#dc2626" opacity="0.8" />
        <text x="24" y="13" fontFamily="system-ui" fontSize="8" fontWeight="600" fill="#fff" opacity="0.85">{step}</text>
        {i < 3 && <text x="44" y="26" fontFamily="system-ui" fontSize="8" fill="#ef4444" opacity="0.6">↓</text>}
      </g>
    ))}

    {/* Bottom status bar */}
    <rect x="50" y="325" width="400" height="56" rx="12" fill="#dc26260a" stroke="#dc262618" strokeWidth="1" />
    <text x="70" y="347" fontFamily="system-ui" fontSize="8" fontWeight="700" fill="#ef4444" opacity="0.7">STATUS</text>
    <circle cx="130" cy="353" r="5" fill="#22c55e">
      <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
    </circle>
    <text x="142" y="357" fontFamily="system-ui" fontSize="9" fontWeight="700" fill="#22c55e">LIVE</text>
    <text x="200" y="357" fontFamily="system-ui" fontSize="8" fill="#64748b">Continuous learning active</text>
    <text x="370" y="357" fontFamily="system-ui" fontSize="9" fontWeight="700" fill="#ef4444">v3.2.1</text>
  </svg>
);

/* ─── Phase Data ──────────────────────────────────── */
const phases = [
  {
    phase: "PHASE 1",
    label: "Discovery & Planning",
    days: "Day 1–3",
    color: "#dc2626",
    borderColor: "border-red-600/40",
    bg: "from-red-600/10 to-red-600/5",
    dot: "#dc2626",
    days_data: [
      { day: "DAY 1 — BUSINESS ANALYSIS", items: ["Business problem identification", "Data availability analysis", "Use-case definition"] },
      { day: "DAY 2 — AI FEASIBILITY", items: ["AI feasibility study", "Technology selection", "Data strategy planning"] },
      { day: "DAY 3 — ARCHITECTURE", items: ["System architecture design", "Model selection roadmap", "Infrastructure planning"] },
    ],
  },
  {
    phase: "PHASE 2",
    label: "Data Preparation",
    days: "Day 4–6",
    color: "#b91c1c",
    borderColor: "border-red-700/40",
    bg: "from-red-700/10 to-red-700/5",
    dot: "#b91c1c",
    days_data: [
      { day: "DAY 4 — DATA COLLECTION", items: ["Data sources identification", "Data pipeline setup", "Raw data aggregation"] },
      { day: "DAY 5 — DATA CLEANING", items: ["Data cleaning & preprocessing", "Missing data handling", "Outlier detection"] },
      { day: "DAY 6 — FEATURE ENGINEERING", items: ["Feature extraction", "Data normalization", "Training/test split"] },
    ],
  },
  {
    phase: "PHASE 3",
    label: "Model Development",
    days: "Day 7–10",
    color: "#991b1b",
    borderColor: "border-red-800/40",
    bg: "from-red-800/10 to-red-800/5",
    dot: "#991b1b",
    days_data: [
      { day: "DAY 7–8 — TRAINING", items: ["Model selection", "Training & testing", "Hyperparameter tuning"] },
      { day: "DAY 9–10 — OPTIMIZATION", items: ["Accuracy optimization", "Cross-validation", "Performance benchmarking"] },
    ],
  },
  {
    phase: "PHASE 4",
    label: "Integration",
    days: "Day 11–12",
    color: "#7f1d1d",
    borderColor: "border-red-900/40",
    bg: "from-red-900/10 to-red-900/5",
    dot: "#7f1d1d",
    days_data: [
      { day: "DAY 11–12 — SYSTEM INTEGRATION", items: ["API integration", "System & frontend connection", "Real-time inference setup"] },
    ],
  },
  {
    phase: "PHASE 5",
    label: "Testing & Optimization",
    days: "Day 13–14",
    color: "#ef4444",
    borderColor: "border-red-500/40",
    bg: "from-red-500/10 to-red-500/5",
    dot: "#ef4444",
    days_data: [
      { day: "DAY 13–14 — QA", items: ["Model evaluation", "Performance tuning", "Edge case handling", "Bias detection"] },
    ],
  },
  {
    phase: "PHASE 6",
    label: "Deployment",
    days: "Day 15",
    color: "#dc2626",
    borderColor: "border-red-600/40",
    bg: "from-red-600/10 to-red-600/5",
    dot: "#dc2626",
    days_data: [
      { day: "DAY 15 — GO LIVE", items: ["Live deployment", "Monitoring setup", "Continuous learning system", "Team handover"] },
    ],
  },
];

const techStack = [
  { category: "ML Frameworks", tech: "TensorFlow / PyTorch", icon: Brain, color: "from-red-600 to-red-800" },
  { category: "Languages", tech: "Python / JavaScript", icon: Cpu, color: "from-red-700 to-red-900" },
  { category: "Data Tools", tech: "Pandas / NumPy / Spark", icon: BarChart3, color: "from-red-500 to-red-700" },
  { category: "AI APIs", tech: "OpenAI / NLP APIs", icon: Bot, color: "from-red-800 to-red-600" },
  { category: "ML Toolkit", tech: "Scikit-learn / Keras", icon: Layers, color: "from-red-600 to-red-500" },
  { category: "Vision & NLP", tech: "Computer Vision / NLP", icon: Eye, color: "from-red-900 to-red-700" },
];

const keyCapabilities = [
  { icon: MessageSquare, title: "Conversational AI", desc: "Chatbots & virtual assistants that handle customer support with human-like accuracy." },
  { icon: Network, title: "Process Automation", desc: "Intelligent workflow automation that eliminates repetitive tasks and boosts efficiency." },
  { icon: TrendingUp, title: "Predictive Analytics", desc: "Sales forecasting, demand prediction, and data-driven insights at scale." },
  { icon: Activity, title: "Real-Time Decisions", desc: "Smart recommendation engines and dynamic pricing systems built for speed." },
];

const useCases = [
  "Customer Support Automation",
  "Fraud Detection",
  "E-commerce Recommendations",
  "Healthcare Predictions",
  "Financial Analytics",
  "Marketing Automation",
];

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
const AiMachineLearningPage: React.FC = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    document.title = "AI & Machine Learning | ULMiND";
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
          className="flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:gap-3 transition-all duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Services
        </motion.button>
      </div>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-16 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-100/60 via-rose-50/20 to-transparent dark:from-red-950/30 dark:via-red-900/10 dark:to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-red-500/10 to-transparent dark:from-red-700/15 dark:to-transparent rounded-full blur-3xl pointer-events-none" />
        <BlurBlob position={{ top: "15%", left: "2%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-red-600" opacityClass="opacity-10" />
        <BlurBlob position={{ top: "55%", left: "65%" }} size={{ width: "350px", height: "350px" }} colorClass="bg-red-500" opacityClass="opacity-8" />

        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
          {/* LEFT text */}
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-red-500/30 bg-red-500/10 backdrop-blur-md">
                <Brain className="w-3.5 h-3.5 text-red-500" />
                <span className="text-red-600 dark:text-red-400 text-[10px] font-black tracking-[0.4em] uppercase">AI & Machine Learning</span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-black text-zinc-900 dark:text-white leading-none tracking-tighter uppercase mb-6">
                Intelligence
                <span className="block bg-gradient-to-r from-red-600 via-red-500 to-rose-600 bg-clip-text text-transparent">
                  Engineered
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8 max-w-lg font-medium">
                We build intelligent systems that automate workflows, enhance decision-making, and unlock powerful insights from your data. From chatbots to predictive analytics — transforming ideas into real-world AI.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  { icon: Bot, label: "Conversational AI" },
                  { icon: Zap, label: "Automation" },
                  { icon: BarChart3, label: "Predictive" },
                  { icon: Shield, label: "Ethical AI" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200/50 dark:border-white/10">
                    <Icon className="w-4 h-4 text-red-500" />
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
                  className="h-14 px-8 bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-red-600/30 uppercase tracking-widest flex items-center gap-2 border-0"
                >
                  Build AI Solution <ArrowRight className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => document.getElementById("roadmap-ai")?.scrollIntoView({ behavior: "smooth" })}
                  className="h-14 px-8 border border-red-400 dark:border-red-700/50 text-red-700 dark:text-red-300 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/20 transition-all bg-transparent"
                >
                  View Roadmap
                </motion.button>
              </div>
            </Reveal>
          </motion.div>

          {/* RIGHT illustration — Neural Network */}
          <Reveal delay={0.3}>
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="flex justify-center"
            >
              <div
                className="w-full max-w-xl"
                style={{ filter: "drop-shadow(0 20px 60px rgba(220,38,38,0.3))" }}
              >
                <NeuralNetworkSVG />
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── WHAT YOU GET ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-50/40 to-transparent dark:via-red-950/10 pointer-events-none" />
        <BlurBlob position={{ top: "40%", left: "75%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-red-500" opacityClass="opacity-8" />

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
          {/* LEFT illustration */}
          <Reveal>
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
              <div
                className="w-full max-w-lg mx-auto"
                style={{ filter: "drop-shadow(0 15px 40px rgba(220,38,38,0.25))" }}
              >
                <AiDashboardSVG />
              </div>
            </motion.div>
          </Reveal>

          {/* RIGHT text */}
          <div>
            <Reveal>
              <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-red-500/20 bg-red-500/10">
                <span className="text-red-600 dark:text-red-400 text-[10px] font-black tracking-[0.4em] uppercase">Deliverables</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-8">
                What You <span className="text-red-600">Get</span>
              </h2>
            </Reveal>
            <div className="space-y-3">
              {[
                "AI-powered custom applications",
                "Conversational AI (chatbots & assistants)",
                "Predictive analytics systems",
                "Process automation workflows",
                "Real-time decision systems",
                "Custom ML model development",
              ].map((item, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <motion.div
                    whileHover={{ x: 8 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/50 dark:border-white/5 group cursor-default"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center flex-shrink-0">
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

      {/* ── AI FLOW ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-red-500/20 bg-red-500/10">
              <span className="text-red-600 dark:text-red-400 text-[10px] font-black tracking-[0.4em] uppercase">Pipeline</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
              AI <span className="text-red-600">Implementation Flow</span>
            </h2>
          </Reveal>
          <div className="flex flex-wrap justify-center items-center gap-2">
            {[
              "Data Collection",
              "Data Processing",
              "Model Training",
              "Evaluation",
              "Deployment",
              "Continuous Learning",
            ].map((step, i, arr) => (
              <React.Fragment key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.06, y: -4 }}
                  className="px-5 py-3 rounded-xl bg-gradient-to-br from-red-600 to-red-800 text-white text-sm font-black uppercase tracking-wide shadow-lg shadow-red-600/20"
                >
                  {step}
                </motion.div>
                {i < arr.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-red-400 flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROADMAP TIMELINE ── */}
      <section id="roadmap-ai" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <BlurBlob position={{ top: "20%", left: "3%" }} size={{ width: "500px", height: "500px" }} colorClass="bg-red-600" opacityClass="opacity-8" />
        <BlurBlob position={{ top: "65%", left: "78%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-red-500" opacityClass="opacity-6" />

        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-red-500/20 bg-red-500/10">
              <span className="text-red-600 dark:text-red-400 text-[10px] font-black tracking-[0.4em] uppercase">Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-4">
              Development <span className="text-red-600">Roadmap</span>
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">Day 1 – Day 15, structured AI delivery</p>
          </Reveal>

          <div className="relative">
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-red-400 dark:via-red-700 to-transparent -translate-x-1/2" />
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
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-50/30 to-transparent dark:via-red-950/10 pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <Reveal className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-red-500/20 bg-red-500/10">
              <span className="text-red-600 dark:text-red-400 text-[10px] font-black tracking-[0.4em] uppercase">Stack</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
              Technology <span className="text-red-600">Stack</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStack.map((item, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <motion.div
                  whileHover={{ scale: 1.04, y: -4 }}
                  className="relative p-6 rounded-2xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/50 dark:border-white/10 overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-red-800/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-widest mb-1">{item.category}</p>
                    <p className="text-lg font-black text-zinc-900 dark:text-white">{item.tech}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── KEY CAPABILITIES ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <BlurBlob position={{ top: "30%", left: "75%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-red-600" opacityClass="opacity-8" />

        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-red-500/20 bg-red-500/10">
              <span className="text-red-600 dark:text-red-400 text-[10px] font-black tracking-[0.4em] uppercase">Capabilities</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
              Core AI <span className="text-red-600">Capabilities</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyCapabilities.map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.04, y: -6 }}
                  className="relative p-6 rounded-3xl bg-white dark:bg-white/[0.03] border border-zinc-200/60 dark:border-white/10 shadow-sm hover:shadow-xl dark:hover:shadow-red-600/10 transition-all duration-300 overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-red-800/5 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center mb-5 shadow-lg shadow-red-600/30">
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
        <BlurBlob position={{ top: "30%", left: "0%" }} size={{ width: "500px", height: "500px" }} colorClass="bg-red-600" opacityClass="opacity-6" />
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Why Choose Us */}
          <Reveal>
            <div className="p-8 rounded-3xl bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white shadow-2xl shadow-red-700/30 h-full">
              <h2 className="text-3xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                <Star className="w-7 h-7" /> Why Choose Us
              </h2>
              <ul className="space-y-4">
                {[
                  "Business-focused AI solutions",
                  "Custom model development",
                  "Scalable and future-ready systems",
                  "Deep technical expertise",
                  "End-to-end implementation",
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

          {/* Security & Ethics */}
          <Reveal delay={0.15}>
            <ShineBorder borderRadius={24} borderWidth={1} color={["#dc2626", "#ef4444", "#b91c1c"]} className="w-full h-full">
              <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/50 dark:border-white/10 h-full">
                <h2 className="text-3xl font-black uppercase tracking-tight text-zinc-900 dark:text-white mb-6 flex items-center gap-3">
                  <Shield className="w-7 h-7 text-red-500" /> Security & Ethics
                </h2>
                <div className="space-y-4">
                  {[
                    { label: "Data privacy protection", icon: Shield },
                    { label: "Secure AI model deployment", icon: Zap },
                    { label: "Bias detection & control", icon: Eye },
                    { label: "Ethical AI practices", icon: Brain },
                  ].map(({ label, icon: Icon }, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-white/[0.03] border border-zinc-200/50 dark:border-white/5"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center flex-shrink-0">
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
                  className="px-5 py-2.5 rounded-full border border-red-300/40 dark:border-red-700/30 bg-red-50 dark:bg-red-900/10 text-sm font-bold text-red-700 dark:text-red-300 cursor-default"
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
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950" />
              <div className="absolute inset-0 bg-gradient-to-r from-red-700/25 via-red-600/15 to-rose-700/25" />

              <div className="absolute top-4 right-8 w-40 h-40 rounded-full bg-red-600/15 blur-3xl" />
              <div className="absolute bottom-4 left-8 w-40 h-40 rounded-full bg-red-700/15 blur-3xl" />

              {/* Animated neural dots */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-red-500"
                  style={{
                    top: `${20 + i * 12}%`,
                    left: `${5 + i * 14}%`,
                    opacity: 0.4,
                  }}
                  animate={{ opacity: [0.2, 0.7, 0.2], scale: [1, 1.5, 1] }}
                  transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
                />
              ))}

              <div className="relative z-10 p-12 md:p-16 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                  <Clock className="w-3.5 h-3.5 text-white/80" />
                  <span className="text-white/80 text-[10px] font-black tracking-[0.4em] uppercase">Ready in 15 Days</span>
                </div>

                <h2 className="text-4xl md:text-5xl xl:text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
                  Ready to Integrate
                  <span className="block bg-gradient-to-r from-red-400 via-rose-400 to-red-300 bg-clip-text text-transparent">
                    AI Into Your Business?
                  </span>
                </h2>

                <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto font-medium">
                  Let's build intelligent systems that give you a competitive edge and drive real business outcomes.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate("/contact")}
                    className="h-14 px-10 bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-2xl font-black text-sm shadow-2xl shadow-red-600/40 uppercase tracking-widest border-0 flex items-center justify-center gap-2"
                  >
                    Build AI Solution <ArrowRight className="w-5 h-5" />
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

export default AiMachineLearningPage;
