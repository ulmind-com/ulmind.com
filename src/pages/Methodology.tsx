import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Lottie from "lottie-react";
import {
  CheckCircle,
  ArrowRight,
  Zap,
  Target,
  Shield,
  Code2,
  FlaskConical,
  GitBranch,
  Users,
  Gauge,
  Sparkles,
  ChevronRight,
  Ruler,
  Building2,
  Lock,
  Layers,
  Flame,
  Hexagon,
} from "lucide-react";
import BlurBlob from "@/components/BlurBlob";
import { CTASection } from "@/components/Sections/CTASection";

/* ─── Reveal Wrapper ──────────────────── */
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children, delay = 0, className = "",
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
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

/* ─── SVG: Agile Illustration ───────── */
const AgileSVG: React.FC = () => (
  <svg viewBox="0 0 520 440" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <radialGradient id="agileGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="agilePrimary" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
      <linearGradient id="agileSecondary" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#a78bfa" />
      </linearGradient>
      <filter id="agileGlowF">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>

    {/* Central orbit glow */}
    <ellipse cx="260" cy="220" rx="180" ry="150" fill="url(#agileGlow)" opacity="0.6" />

    {/* Sprint circle - outer ring */}
    <circle cx="260" cy="220" r="145" stroke="#6366f130" strokeWidth="1.5" strokeDasharray="8 4" />
    <circle cx="260" cy="220" r="100" stroke="#8b5cf620" strokeWidth="1" strokeDasharray="4 6" />

    {/* Core hub */}
    <circle cx="260" cy="220" r="52" fill="#0f0a2e" stroke="#6366f140" strokeWidth="2" />
    <circle cx="260" cy="220" r="38" fill="url(#agilePrimary)" filter="url(#agileGlowF)" opacity="0.9" />
    <text x="260" y="215" textAnchor="middle" fontFamily="system-ui" fontSize="10" fontWeight="800" fill="#fff" letterSpacing="1">AGILE</text>
    <text x="260" y="228" textAnchor="middle" fontFamily="system-ui" fontSize="8" fontWeight="600" fill="#c4b5fd">SPRINT</text>

    {/* Orbit nodes - sprint stages */}
    {[
      { angle: -90, label: "PLAN", val: "Sprint 1" },
      { angle: -18, label: "BUILD", val: "Iterate" },
      { angle: 54, label: "TEST", val: "QA" },
      { angle: 126, label: "REVIEW", val: "Demo" },
      { angle: 198, label: "RETRO", val: "Improve" },
    ].map(({ angle, label, val }, i) => {
      const rad = (angle * Math.PI) / 180;
      const cx = 260 + 145 * Math.cos(rad);
      const cy = 220 + 145 * Math.sin(rad);
      return (
        <g key={i}>
          <line x1="260" y1="220" x2={cx} y2={cy} stroke="#6366f122" strokeWidth="1" />
          <circle cx={cx} cy={cy} r="32" fill="#0f0a2e" stroke="#6366f140" strokeWidth="1.5" />
          <circle cx={cx} cy={cy} r="20" fill="url(#agileSecondary)" opacity="0.85" filter="url(#agileGlowF)" />
          <text x={cx} y={cy - 2} textAnchor="middle" fontFamily="system-ui" fontSize="7" fontWeight="800" fill="#fff">{label}</text>
          <text x={cx} y={cy + 9} textAnchor="middle" fontFamily="system-ui" fontSize="6" fill="#c4b5fd">{val}</text>
          {/* Animated pulse */}
          <circle cx={cx} cy={cy} r="32" stroke="#8b5cf6" strokeWidth="1" fill="none" opacity="0.4">
            <animate attributeName="r" values="32;44;32" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0;0.4" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
          </circle>
        </g>
      );
    })}

    {/* Travelling dot around orbit */}
    <circle r="5" fill="#a78bfa" filter="url(#agileGlowF)">
      <animateMotion dur="6s" repeatCount="indefinite">
        <mpath xlinkHref="#agileOrbitPath" />
      </animateMotion>
    </circle>
    <path id="agileOrbitPath" d="M 260 75 A 145 145 0 1 1 259.9 75" fill="none" />

    {/* Velocity badge */}
    <g transform="translate(360, 20)">
      <rect width="130" height="52" rx="14" fill="#0f0a2e" stroke="#6366f140" strokeWidth="1" />
      <rect width="130" height="52" rx="14" fill="#6366f108" />
      <text x="65" y="20" textAnchor="middle" fontFamily="system-ui" fontSize="8" fontWeight="700" fill="#8b5cf6" letterSpacing="1">VELOCITY</text>
      <text x="65" y="40" textAnchor="middle" fontFamily="system-ui" fontSize="20" fontWeight="900" fill="#fff">94%</text>
    </g>

    {/* Delivery badge */}
    <g transform="translate(20, 20)">
      <rect width="120" height="52" rx="14" fill="#0f0a2e" stroke="#6366f140" strokeWidth="1" />
      <rect width="120" height="52" rx="14" fill="#6366f108" />
      <text x="60" y="20" textAnchor="middle" fontFamily="system-ui" fontSize="8" fontWeight="700" fill="#8b5cf6" letterSpacing="1">ON TIME</text>
      <text x="60" y="40" textAnchor="middle" fontFamily="system-ui" fontSize="18" fontWeight="900" fill="#fff">DELIVERY</text>
    </g>

    {/* Status dot */}
    <circle cx="260" cy="390" r="6" fill="#22c55e">
      <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite" />
    </circle>
    <text x="275" y="394" fontFamily="system-ui" fontSize="9" fontWeight="700" fill="#22c55e">LIVE PROJECT ACTIVE</text>
  </svg>
);

/* ─── SVG: Waterfall Illustration ──── */
const WaterfallSVG: React.FC = () => (
  <svg viewBox="0 0 520 440" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <radialGradient id="wfGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="wfPrimary" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0ea5e9" />
        <stop offset="100%" stopColor="#38bdf8" />
      </linearGradient>
      <linearGradient id="wfFill1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.2" />
      </linearGradient>
      <filter id="wfGlowF">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>

    <ellipse cx="260" cy="220" rx="200" ry="170" fill="url(#wfGlow)" opacity="0.5" />

    {/* Waterfall Steps */}
    {[
      { x: 60,  y: 60,  w: 400, h: 44, label: "01  DISCOVERY",   color: "#0ea5e9" },
      { x: 80,  y: 124, w: 360, h: 44, label: "02  PLANNING",    color: "#3b82f6" },
      { x: 100, y: 188, w: 320, h: 44, label: "03  DESIGN",      color: "#6366f1" },
      { x: 120, y: 252, w: 280, h: 44, label: "04  BUILD",       color: "#8b5cf6" },
      { x: 140, y: 316, w: 240, h: 44, label: "05  QA & TEST",   color: "#a78bfa" },
      { x: 160, y: 380, w: 200, h: 44, label: "06  DEPLOY",      color: "#c4b5fd" },
    ].map(({ x, y, w, h, label, color }, i) => (
      <g key={i}>
        <rect x={x} y={y} width={w} height={h} rx="10" fill={`${color}18`} stroke={`${color}50`} strokeWidth="1.5" />
        <rect x={x} y={y} width={w} height={h} rx="10" fill="url(#wfFill1)" opacity={0.25 - i * 0.02} />
        <text x={x + 20} y={y + 27} fontFamily="system-ui" fontSize="11" fontWeight="800" fill="#fff" letterSpacing="2">{label}</text>
        {/* Right status */}
        <circle cx={x + w - 20} cy={y + 22} r="5" fill={color} filter="url(#wfGlowF)">
          <animate attributeName="opacity" values="1;0.4;1" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
        {/* Flow arrow */}
        {i < 5 && (
          <text x={x + w + 8} y={y + 28} fontFamily="system-ui" fontSize="14" fill={color} opacity="0.6">↓</text>
        )}
      </g>
    ))}

    {/* Badges */}
    <g transform="translate(20, 20)">
      <rect width="34" height="34" rx="8" fill="#0ea5e920" stroke="#0ea5e940" strokeWidth="1" />
      <text x="17" y="23" textAnchor="middle" fontFamily="system-ui" fontSize="14" fill="#38bdf8">✓</text>
    </g>
  </svg>
);

/* ─── Principles Data ──────────────── */
const practices = [
  { icon: FlaskConical, title: "Test-First Development", desc: "Quality engineered from the start. Every feature validated through test-first practices, ensuring long-term reliability.", color: "#6366f1", glow: "rgba(99,102,241,0.25)" },
  { icon: GitBranch,   title: "CI/CD Pipelines",        desc: "Automated build, test, and deployment cycles enabling rapid, stable, and repeatable releases at scale.", color: "#0ea5e9", glow: "rgba(14,165,233,0.25)" },
  { icon: Users,       title: "DevOps Synergy",          desc: "Deep alignment between development and operations ensuring seamless delivery, monitoring, and scalability.", color: "#8b5cf6", glow: "rgba(139,92,246,0.25)" },
  { icon: Lock,        title: "Security by Design",      desc: "Security embedded from day one — not added later. Every layer built with protection and compliance in mind.", color: "#ef4444", glow: "rgba(239,68,68,0.25)" },
  { icon: Gauge,       title: "Performance Engineering",  desc: "Optimized for speed, scalability, and efficiency — systems that perform flawlessly under real-world load.", color: "#f59e0b", glow: "rgba(245,158,11,0.25)" },
  { icon: Code2,       title: "Code Excellence",          desc: "Clean, maintainable, scalable code enforced through rigorous reviews and engineering best practices.", color: "#10b981", glow: "rgba(16,185,129,0.25)" },
];

/* ─── lifecycle Steps ──────────────── */
const lifecycle = [
  { num: "01", title: "Discovery",                     desc: "Deep understanding of business objectives, technical requirements, and success metrics." },
  { num: "02", title: "Strategic Planning",             desc: "Structured roadmap, defined milestones, and precise resource alignment for execution." },
  { num: "03", title: "Experience & Architecture Design", desc: "User-centric interface design combined with scalable, resilient system architecture." },
  { num: "04", title: "Engineering & Build",            desc: "Iterative development with continuous validation, performance checks, and quality gates." },
  { num: "05", title: "Quality Assurance",              desc: "Comprehensive testing cycles ensuring stability, accuracy, usability, and edge-case resilience." },
  { num: "06", title: "Deployment & Release",           desc: "Seamless production rollout with monitoring, rollback strategies, and high-availability assurance." },
  { num: "07", title: "Continuous Evolution",           desc: "Ongoing optimization, feature enhancement, performance tuning, and long-term support." },
];

/* ─── Signature Badges ─────────────── */
const signatureBadges = [
  { label: "Engineered for Scale.",        Icon: Ruler },
  { label: "Built for Reliability.",       Icon: Building2 },
  { label: "Optimized for Performance.",   Icon: Zap },
  { label: "Secured by Design.",           Icon: Lock },
];

/* ─── Main Component ────────────────── */
export default function Methodology() {
  const [arrowAnimData, setArrowAnimData] = useState<object | null>(null);

  useEffect(() => {
    fetch('/Jason/lottieflow-arrow-08-2-ffffff-easey.json')
      .then((r) => r.json())
      .then((d: any) => {
        const stripped = {
          ...d,
          layers: (d.layers ?? []).filter(
            (l: any) => l.ty !== 1 && !/^bg$/i.test(l.nm ?? '') && !/^background$/i.test(l.nm ?? '')
          ),
        };
        setArrowAnimData(stripped);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    document.title = "Methodology | ULMiND";
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* ── Page-scoped CSS ── */}
      <style>{`
        /* ── Glass Card (methodology) ── */
        .meth-glass {
          position: relative;
          border-radius: 28px;
          overflow: hidden;
          transform: translateZ(0);
          will-change: transform;
          backface-visibility: hidden;
          transition:
            transform 0.28s cubic-bezier(0.22,1,0.36,1),
            box-shadow  0.28s ease,
            border-color 0.28s ease;
        }
        :root .meth-glass {
          background: rgba(255,255,255,0.65);
          border: 1px solid rgba(255,255,255,0.85);
          box-shadow:
            0 2px 24px rgba(0,0,0,0.08),
            inset 0 1px 0 rgba(255,255,255,1);
        }
        .dark .meth-glass {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.11);
          box-shadow:
            0 2px 30px rgba(0,0,0,0.35),
            inset 0 1px 0 rgba(255,255,255,0.10);
        }
        :root .meth-glass:hover {
          background: rgba(255,255,255,0.82);
          border-color: rgba(255,255,255,1);
          box-shadow:
            0 12px 48px rgba(0,0,0,0.13),
            inset 0 1px 0 rgba(255,255,255,1);
          transform: translateZ(0) translateY(-6px);
          backdrop-filter: blur(20px) saturate(200%);
          -webkit-backdrop-filter: blur(20px) saturate(200%);
        }
        .dark .meth-glass:hover {
          background: rgba(255,255,255,0.10);
          border-color: rgba(255,255,255,0.20);
          box-shadow:
            0 12px 52px rgba(0,0,0,0.50),
            inset 0 1px 0 rgba(255,255,255,0.15);
          transform: translateZ(0) translateY(-6px);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
        }

        /* Specular shine line */
        .meth-glass::before {
          content: '';
          position: absolute;
          top: 0; left: 18px; right: 18px;
          height: 1px;
          border-radius: 9999px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent);
          pointer-events: none;
          z-index: 10;
        }

        /* ══ LIFECYCLE PREMIUM GLASS CARDS ══ */
        .lc-card {
          position: relative;
          border-radius: 28px;
          overflow: hidden;
          transform: translateZ(0);
          will-change: transform;
          backface-visibility: hidden;
          transition:
            transform 0.32s cubic-bezier(0.22,1,0.36,1),
            box-shadow 0.32s ease;
          cursor: default;
        }

        /* Light mode idle */
        :root .lc-card {
          background: rgba(255,255,255,0.58);
          border: 1px solid rgba(255,255,255,0.85);
          box-shadow:
            0 4px 24px rgba(0,0,0,0.07),
            0 1px 0 rgba(255,255,255,0.95) inset,
            0 -1px 0 rgba(0,0,0,0.03) inset;
        }

        /* Dark mode idle */
        .dark .lc-card {
          background: rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.10);
          box-shadow:
            0 4px 32px rgba(0,0,0,0.38),
            0 1px 0 rgba(255,255,255,0.10) inset;
        }

        /* Light hover — blur activates only on :hover */
        :root .lc-card:hover {
          background: rgba(255,255,255,0.82);
          border-color: rgba(255,255,255,1);
          backdrop-filter: blur(24px) saturate(220%);
          -webkit-backdrop-filter: blur(24px) saturate(220%);
          transform: translateZ(0) translateY(-10px) scale(1.025);
          box-shadow:
            0 20px 60px rgba(0,0,0,0.13),
            0 8px 20px rgba(0,0,0,0.06),
            0 1px 0 rgba(255,255,255,1) inset;
        }

        /* Dark hover */
        .dark .lc-card:hover {
          background: rgba(255,255,255,0.10);
          border-color: rgba(255,255,255,0.20);
          backdrop-filter: blur(24px) saturate(200%);
          -webkit-backdrop-filter: blur(24px) saturate(200%);
          transform: translateZ(0) translateY(-10px) scale(1.025);
          box-shadow:
            0 20px 65px rgba(0,0,0,0.55),
            0 8px 22px rgba(0,0,0,0.30),
            0 1px 0 rgba(255,255,255,0.15) inset;
        }

        /* Top specular line */
        .lc-card::before {
          content: '';
          position: absolute;
          top: 0; left: 20px; right: 20px;
          height: 1px;
          border-radius: 9999px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
          pointer-events: none;
          z-index: 10;
        }

        /* Shimmer sweep on hover */
        .lc-card::after {
          content: '';
          position: absolute;
          top: 0; left: -100%; right: 0; bottom: 0;
          width: 60%;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%);
          transition: left 0.55s ease;
          pointer-events: none;
          z-index: 5;
        }
        .lc-card:hover::after {
          left: 160%;
        }

        /* Glow tint overlay — colour injected per card via CSS var */
        .lc-card-glow {
          position: absolute;
          inset: 0;
          border-radius: 28px;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
          z-index: 1;
        }
        .lc-card:hover .lc-card-glow { opacity: 1; }

        /* Numbered badge */
        .lc-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px; height: 44px;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 900;
          letter-spacing: -0.02em;
          position: relative;
          z-index: 10;
          flex-shrink: 0;
          transition: transform 0.28s cubic-bezier(0.22,1,0.36,1), box-shadow 0.28s ease;
        }
        .lc-card:hover .lc-num {
          transform: scale(1.12) translateY(-2px);
        }

        /* Bottom accent bar */
        .lc-accent-bar {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          border-radius: 0 0 28px 28px;
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
          z-index: 10;
        }
        .lc-card:hover .lc-accent-bar { opacity: 1; }

        /* Left accent stripe */
        .lc-stripe {
          position: absolute;
          top: 20px; bottom: 20px; left: 0;
          width: 3px;
          border-radius: 0 3px 3px 0;
          opacity: 0;
          transition: opacity 0.35s ease, height 0.35s ease;
          pointer-events: none;
          z-index: 10;
        }
        .lc-card:hover .lc-stripe { opacity: 1; }

        /* ── Hero liquid glass badge ── */
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          border-radius: 9999px;
          backdrop-filter: blur(12px) saturate(180%);
          -webkit-backdrop-filter: blur(12px) saturate(180%);
        }
        :root .hero-badge {
          background: rgba(255,255,255,0.65);
          border: 1px solid rgba(255,255,255,0.85);
          color: rgba(15,23,42,0.85);
        }
        .dark .hero-badge {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.14);
          color: rgba(255,255,255,0.85);
        }

        /* ── Signature badge ── */
        .sig-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 24px;
          border-radius: 16px;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          backdrop-filter: blur(12px) saturate(180%);
          -webkit-backdrop-filter: blur(12px) saturate(180%);
          transform: translateZ(0);
          will-change: transform;
        }
        :root .sig-badge {
          background: rgba(255,255,255,0.60);
          border: 1px solid rgba(255,255,255,0.80);
          box-shadow: 0 2px 12px rgba(0,0,0,0.07);
        }
        .dark .sig-badge {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.11);
          box-shadow: 0 2px 16px rgba(0,0,0,0.28);
        }
        .sig-badge:hover {
          transform: translateZ(0) translateY(-4px) scale(1.04);
          box-shadow: 0 10px 35px rgba(0,0,0,0.15);
        }

        /* Ambient orbs */
        .meth-orb {
          position: absolute;
          border-radius: 9999px;
          pointer-events: none;
          transform: translateZ(0);
          will-change: transform;
        }
        @keyframes methOrb1 { 0%,100%{transform:translateZ(0) translateY(0);} 50%{transform:translateZ(0) translateY(-24px);} }
        @keyframes methOrb2 { 0%,100%{transform:translateZ(0) translateY(0);} 50%{transform:translateZ(0) translateY(20px);} }
        .meth-orb-1 { animation: methOrb1 11s ease-in-out infinite; }
        .meth-orb-2 { animation: methOrb2 14s ease-in-out infinite 2s; }
        .meth-orb-3 { animation: methOrb1 9s ease-in-out infinite 1s; }

        /* Methodology Z-pattern illustration hover */
        .illus-wrapper {
          filter: drop-shadow(0 20px 50px rgba(220,38,38,0.28));
          transition: filter 0.4s ease, transform 0.4s ease;
        }
        .dark .illus-wrapper {
          filter: drop-shadow(0 20px 60px rgba(220,38,38,0.38));
        }
        .illus-wrapper:hover {
          filter: drop-shadow(0 28px 65px rgba(220,38,38,0.45));
        }
        .illus-wrapper-blue {
          filter: drop-shadow(0 20px 50px rgba(239,68,68,0.28));
          transition: filter 0.4s ease;
        }
        .dark .illus-wrapper-blue {
          filter: drop-shadow(0 20px 60px rgba(239,68,68,0.38));
        }
      `}</style>

      <div className="min-h-screen bg-white dark:bg-zinc-950 overflow-x-hidden transition-colors duration-300">

        {/* ═══ HERO ═══════════════════════════════════════════ */}
        <section className="relative min-h-screen flex items-center pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Ambient orbs */}
          <div className="meth-orb meth-orb-1 absolute top-[12%] left-[6%] w-80 h-80"
            style={{ background: "radial-gradient(circle, rgba(99,102,241,0.20) 0%, transparent 70%)" }} />
          <div className="meth-orb meth-orb-2 absolute top-[40%] right-[4%] w-96 h-96"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)" }} />
          <div className="meth-orb meth-orb-3 absolute bottom-[10%] left-[35%] w-[500px] h-40"
            style={{ background: "radial-gradient(ellipse, rgba(14,165,233,0.14) 0%, transparent 70%)" }} />

          <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-14 items-center relative z-10">
            {/* LEFT */}
            <div>
              <Reveal>
                <span className="hero-badge mb-6 inline-flex">
                  <Sparkles className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-[10px] font-black tracking-[0.45em] uppercase text-red-600 dark:text-red-400">
                    Engineering Philosophy
                  </span>
                </span>
              </Reveal>

              <Reveal delay={0.08}>
                <h1 className="text-5xl md:text-6xl xl:text-7xl font-black tracking-tighter leading-none mb-6 text-zinc-900 dark:text-white uppercase">
                  Process.{" "}
                  <span className="block bg-gradient-to-r from-red-600 via-rose-500 to-red-400 bg-clip-text text-transparent">
                    Precision.
                  </span>
                  Performance.
                </h1>
              </Reveal>

              <Reveal delay={0.16}>
                <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8 max-w-lg font-medium">
                  At ULMIND, we architect digital systems with a singular focus — scalability, security, and sustained performance. Our methodology is a disciplined engineering philosophy that ensures every product is built to perform under real-world demands.
                </p>
              </Reveal>

              {/* Mini feature pills */}
              <Reveal delay={0.22}>
                <div className="flex flex-wrap gap-3 mb-10">
                  {[
                    { label: "Agile Engineering", icon: Zap,    color: "text-red-600 dark:text-red-400" },
                    { label: "Waterfall Model",   icon: Target,  color: "text-red-600 dark:text-red-400" },
                    { label: "Security First",    icon: Shield,  color: "text-red-600 dark:text-red-400" },
                  ].map(({ label, icon: Icon, color }) => (
                    <div key={label} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100/80 dark:bg-white/5 border border-zinc-200/60 dark:border-white/10">
                      <Icon className={`w-4 h-4 ${color}`} />
                      <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{label}</span>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* Signature badges */}
              <Reveal delay={0.3}>
                <div className="flex flex-wrap gap-3">
                  {signatureBadges.map(({ label, Icon }) => (
                    <div key={label} className="sig-badge">
                      <Icon className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="text-xs font-black tracking-wide text-zinc-700 dark:text-zinc-300">{label}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* RIGHT — Agile illustration */}
            <Reveal delay={0.28}>
              <div className="flex justify-center">
                <div className="w-full max-w-lg illus-wrapper">
                  <AgileSVG />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══ BRAND DIVIDER ══════════════════════════════════ */}
        <div className="relative py-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-rose-500/10 to-red-400/10 dark:from-red-600/15 dark:via-rose-500/15 dark:to-red-400/15" />
          <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
            <Reveal>
              <blockquote className="text-xl md:text-2xl font-black text-zinc-800 dark:text-white tracking-tight italic">
                "We don't just deliver software.{" "}
                <span className="bg-gradient-to-r from-red-600 to-rose-400 bg-clip-text text-transparent not-italic">
                  We engineer systems that scale, perform, and endure.
                </span>"
              </blockquote>
            </Reveal>
          </div>
        </div>

        {/* ═══ METHODOLOGIES Z-PATTERN ════════════════════════ */}
        <section className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <BlurBlob position={{ top: "20%", left: "5%" }} size={{ width: "500px", height: "500px" }} colorClass="bg-rose-400" opacityClass="opacity-10" />
          <BlurBlob position={{ top: "70%", left: "80%" }} size={{ width: "450px", height: "450px" }} colorClass="bg-red-400"  opacityClass="opacity-10" />

          <div className="max-w-7xl mx-auto space-y-32">
            {/* ── AGILE ── */}
            <motion.div
              className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Text left */}
              <div className="flex-1 space-y-7 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/25 bg-red-500/10 backdrop-blur-sm">
                  <Zap className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-[10px] font-black tracking-[0.4em] uppercase text-red-600 dark:text-red-400">Execution Model</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase flex items-center gap-3 flex-wrap">
                  <Zap className="w-9 h-9 text-red-500 flex-shrink-0" />
                  <span>Agile<br /><span className="bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">Engineering</span></span>
                </h2>

                <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-lg font-medium">
                  A modern, adaptive development model designed for speed, precision, and continuous evolution. Built on human-centric collaboration and functional outcomes over rigid documentation.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { head: "Philosophy", items: ["Human-centric collaboration", "Functional outcomes first", "Continuous client alignment", "Adaptability as core strength"] },
                    { head: "Impact",     items: ["Accelerated delivery cycles", "Continuous product refinement", "High responsiveness to change", "Business–tech alignment"] },
                  ].map(({ head, items }) => (
                    <div key={head} className="meth-glass p-5 group">
                      <p className="text-[10px] font-black tracking-[0.35em] uppercase text-red-600 dark:text-red-400 mb-3">{head}</p>
                      <ul className="space-y-2">
                        {items.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Illustration right */}
              <div className="flex-1 flex justify-center">
                <div
                  className="w-full max-w-lg illus-wrapper"
                >
                  <AgileSVG />
                </div>
              </div>
            </motion.div>

            {/* ── WATERFALL ── */}
            <motion.div
              className="flex flex-col lg:flex-row-reverse items-center gap-14 lg:gap-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Text right */}
              <div className="flex-1 space-y-7 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/25 bg-red-500/10 backdrop-blur-sm">
                  <Target className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-[10px] font-black tracking-[0.4em] uppercase text-red-600 dark:text-red-400">Structured Model</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase flex items-center gap-3 flex-wrap">
                  <Layers className="w-9 h-9 text-red-500 flex-shrink-0" />
                  <span>Structured<br /><span className="bg-gradient-to-r from-red-600 to-rose-400 bg-clip-text text-transparent">Waterfall</span></span>
                </h2>

                <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-lg font-medium">
                  A disciplined, phase-driven model built for clarity, predictability, and control. Sequential validation at every milestone ensures enterprise-grade precision and zero ambiguity.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { head: "Framework", items: ["Clearly defined execution stages", "Comprehensive technical docs", "Sequential milestone validation", "Rigorous testing protocols"] },
                    { head: "Impact",    items: ["Predictable timelines", "Reduced execution ambiguity", "Strong governance & risk control", "Enterprise-grade documentation"] },
                  ].map(({ head, items }) => (
                    <div key={head} className="meth-glass p-5 group">
                      <p className="text-[10px] font-black tracking-[0.35em] uppercase text-red-600 dark:text-red-400 mb-3">{head}</p>
                      <ul className="space-y-2">
                        {items.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Illustration left */}
              <div className="flex-1 flex justify-center">
                <div
                  className="w-full max-w-lg illus-wrapper-blue"
                >
                  <WaterfallSVG />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ ENGINEERING PRINCIPLES ═════════════════════════ */}
        <section className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-50/80 via-white to-zinc-50/80 dark:from-zinc-900/60 dark:via-zinc-950 dark:to-zinc-900/60 pointer-events-none" />
          <BlurBlob position={{ top: "30%", left: "10%" }} size={{ width: "450px", height: "450px" }} colorClass="bg-rose-400" opacityClass="opacity-10" />
          <BlurBlob position={{ top: "60%", left: "80%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-red-400"  opacityClass="opacity-10" />

          <div className="max-w-7xl mx-auto relative z-10">
            <Reveal className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full border border-red-500/20 bg-red-500/10 backdrop-blur-sm">
                <span className="text-[10px] font-black tracking-[0.4em] uppercase text-red-600 dark:text-red-400">Standards</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase mb-5 flex items-center justify-center gap-3 flex-wrap">
                <Hexagon className="w-9 h-9 text-red-500 flex-shrink-0" />
                <span>Engineering{" "}<span className="bg-gradient-to-r from-red-600 to-rose-400 bg-clip-text text-transparent">Principles</span></span>
              </h2>
              <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto font-medium">
                The unyielding standards we uphold to build resilient, scalable, and enterprise-grade systems.
              </p>
            </Reveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {practices.map(({ icon: Icon, title, desc, color, glow }, i) => (
                <Reveal key={i} delay={i * 0.07}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="meth-glass p-7 h-full group cursor-default"
                  >
                    {/* Glow dot */}
                    <div className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: `radial-gradient(circle at 30% 30%, ${glow} 0%, transparent 65%)` }} />

                    <div className="relative z-10">
                      {/* Icon */}
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-lg"
                        style={{ background: `linear-gradient(135deg, ${color}22, ${color}08)`, border: `1px solid ${color}30` }}>
                        <Icon className="w-7 h-7" style={{ color }} />
                      </div>

                      <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-2 tracking-tight">{title}</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{desc}</p>

                      {/* Bottom accent */}
                      <div className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                        style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }} />
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ LIFECYCLE ARCHITECTURE ═════════════════════════ */}
        <section className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <BlurBlob position={{ top: "10%", left: "3%" }}  size={{ width: "550px", height: "550px" }} colorClass="bg-red-400"  opacityClass="opacity-10" />
          <BlurBlob position={{ top: "55%", left: "80%" }} size={{ width: "500px", height: "500px" }} colorClass="bg-rose-400" opacityClass="opacity-10" />
          <BlurBlob position={{ top: "80%", left: "30%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-red-400"  opacityClass="opacity-8"  />

          <div className="max-w-6xl mx-auto relative z-10">
            {/* ── Section Header ── */}
            <Reveal className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full border border-red-500/20 bg-red-500/10 backdrop-blur-sm">
                <span className="text-[10px] font-black tracking-[0.4em] uppercase text-red-600 dark:text-red-400">Process</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase mb-5 flex items-center justify-center gap-3 flex-wrap">
                <Hexagon className="w-9 h-9 text-red-500 flex-shrink-0" />
                <span>Lifecycle{" "}<span className="bg-gradient-to-r from-red-600 to-rose-400 bg-clip-text text-transparent">Architecture</span></span>
              </h2>
              <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto font-medium">
                A controlled, stage-driven journey from concept to continuous evolution.
              </p>
            </Reveal>

            {/* ── Cards Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {lifecycle.map(({ num, title, desc }, i) => {
                const cardColors = [
                  { accent: "#6366f1", glow: "rgba(99,102,241,0.14)",  numBg: "linear-gradient(135deg,#6366f1,#8b5cf6)",  bar: "linear-gradient(90deg,#6366f1,#8b5cf6)"  },
                  { accent: "#0ea5e9", glow: "rgba(14,165,233,0.14)",  numBg: "linear-gradient(135deg,#0ea5e9,#38bdf8)",  bar: "linear-gradient(90deg,#0ea5e9,#38bdf8)"  },
                  { accent: "#8b5cf6", glow: "rgba(139,92,246,0.14)",  numBg: "linear-gradient(135deg,#8b5cf6,#a78bfa)",  bar: "linear-gradient(90deg,#8b5cf6,#a78bfa)"  },
                  { accent: "#10b981", glow: "rgba(16,185,129,0.14)",  numBg: "linear-gradient(135deg,#10b981,#34d399)",  bar: "linear-gradient(90deg,#10b981,#34d399)"  },
                  { accent: "#f59e0b", glow: "rgba(245,158,11,0.14)",  numBg: "linear-gradient(135deg,#f59e0b,#fbbf24)",  bar: "linear-gradient(90deg,#f59e0b,#fbbf24)"  },
                  { accent: "#ef4444", glow: "rgba(239,68,68,0.14)",   numBg: "linear-gradient(135deg,#ef4444,#f87171)",  bar: "linear-gradient(90deg,#ef4444,#f87171)"  },
                  { accent: "#06b6d4", glow: "rgba(6,182,212,0.14)",   numBg: "linear-gradient(135deg,#06b6d4,#22d3ee)",  bar: "linear-gradient(90deg,#06b6d4,#22d3ee)"  },
                ];
                const c = cardColors[i % cardColors.length];
                // Last card (07) spans full width on md screens
                const isLast = i === lifecycle.length - 1;

                return (
                  <Reveal key={i} delay={i * 0.07} className={isLast ? "md:col-span-2 xl:col-span-1" : ""}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="lc-card h-full p-7 group"
                    >
                      {/* Glow overlay */}
                      <div
                        className="lc-card-glow"
                        style={{ background: `radial-gradient(circle at 30% 30%, ${c.glow} 0%, transparent 65%)` }}
                      />

                      {/* Left accent stripe */}
                      <div className="lc-stripe" style={{ background: c.accent }} />

                      {/* Bottom accent bar */}
                      <div className="lc-accent-bar" style={{ background: c.bar }} />

                      {/* Content */}
                      <div className="relative z-10">
                        {/* Header row */}
                        <div className="flex items-start gap-4 mb-5">
                          {/* Numbered badge */}
                          <div
                            className="lc-num shadow-lg flex-shrink-0"
                            style={{
                              background: c.numBg,
                              boxShadow: `0 6px 20px ${c.accent}40`,
                              color: "#fff",
                            }}
                          >
                            {num}
                          </div>
                        </div>

                        {/* Title */}
                        <h3
                          className="text-lg font-black uppercase tracking-tight mb-3 text-zinc-900 dark:text-white transition-colors duration-200"
                          style={{ ['--hover-color' as string]: c.accent }}
                        >
                          {title}
                        </h3>

                        {/* Divider */}
                        <div
                          className="w-10 h-0.5 rounded-full mb-4 transition-all duration-300 group-hover:w-16"
                          style={{ background: c.accent, opacity: 0.6 }}
                        />

                        {/* Description */}
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                          {desc}
                        </p>

                        {/* Bottom tag */}
                        <div className="mt-5 flex items-center gap-1.5">
                          <span
                            className="text-[10px] font-black tracking-[0.3em] uppercase px-2.5 py-1 rounded-lg"
                            style={{
                              color: c.accent,
                              background: `${c.accent}12`,
                              border: `1px solid ${c.accent}22`,
                            }}
                          >
                            Phase {num}
                          </span>
                          <ChevronRight className="w-3 h-3" style={{ color: c.accent, opacity: 0.6 }} />
                        </div>
                      </div>
                    </motion.div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ SIGNATURE STATEMENT ════════════════════════════ */}
        <section className="py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/8 via-rose-500/8 to-red-400/8 dark:from-red-600/12 dark:via-rose-500/12 dark:to-red-400/12 pointer-events-none" />
          <BlurBlob position={{ top: "50%", left: "20%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-rose-400" opacityClass="opacity-10" />
          <BlurBlob position={{ top: "50%", left: "75%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-red-400"  opacityClass="opacity-10" />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <Reveal>
              <div className="meth-glass inline-block px-10 py-12 md:px-16 md:py-16 mx-auto">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent pointer-events-none" />

                <p className="text-[11px] font-black tracking-[0.5em] uppercase text-red-600 dark:text-red-400 mb-6 flex items-center justify-center gap-2">
                  <Flame className="w-4 h-4" /> Our Signature
                </p>
                <blockquote className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white tracking-tight leading-snug mb-8">
                  "We don't just deliver software.{" "}
                  <span className="bg-gradient-to-r from-red-600 via-rose-500 to-red-400 bg-clip-text text-transparent">
                    We engineer systems that scale, perform, and endure.
                  </span>"
                </blockquote>

                <div className="flex flex-wrap justify-center gap-4">
                  {signatureBadges.map(({ label, Icon }) => (
                    <div key={label} className="sig-badge">
                      <Icon className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="text-sm font-black text-zinc-700 dark:text-zinc-200">{label}</span>
                    </div>
                  ))}
                </div>

                <motion.div className="mt-10 flex justify-center gap-4" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <motion.a
                    href="/contact"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-500 to-red-500 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-red-600/30 group/btn"
                  >
                    Start Your Project 
                    {arrowAnimData ? (
                      <Lottie animationData={arrowAnimData} loop autoplay className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                    ) : (
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    )}
                  </motion.a>
                </motion.div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══ CTA ═════════════════════════════════════════════ */}
        <CTASection />
      </div>
    </>
  );
}
