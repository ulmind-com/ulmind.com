import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Zap,
  Code2,
  Layers,
  Star,
  ExternalLink,
  ChevronRight,
  Terminal,
  Copy,
  Check,
  BookOpen,
  Cpu,
  Clock,
  Globe,
  Lightbulb,
  Package,
} from "lucide-react";
import { technologies, Technology } from "@/data/technologies";
import { techDetails, TechDetail } from "@/data/techDetails";
import { TechIllustration } from "@/components/TechIllustrations";
import { useTheme } from "next-themes";

console.log("Registered tech detail keys:", Object.keys(techDetails));


/* ─────────────────────────────────────────
   Reveal animation helper
───────────────────────────────────────── */
const Reveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
  fromLeft?: boolean;
  fromRight?: boolean;
}> = ({ children, delay = 0, className = "", fromLeft, fromRight }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const initial = fromLeft
    ? { opacity: 0, x: -50 }
    : fromRight
    ? { opacity: 0, x: 50 }
    : { opacity: 0, y: 40 };

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ─────────────────────────────────────────
   Copy-to-clipboard button
───────────────────────────────────────── */
const CopyButton: React.FC<{ text: string; color: string }> = ({ text, color }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.button
      onClick={handleCopy}
      whileTap={{ scale: 0.9 }}
      className={`group absolute top-3 right-3 p-2 rounded-lg transition-all duration-200 ${
        copied 
          ? "" 
          : "bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white"
      }`}
      style={copied ? {
        background: `${color}30`,
        border: `1px solid ${color}60`,
      } : {}}
      title="Copy to clipboard"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.div
            key="check"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Check size={14} color={color} />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Copy size={14} className="text-white/60 group-hover:text-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

/* ─────────────────────────────────────────
   Code Block
───────────────────────────────────────── */
const CodeBlock: React.FC<{
  code: string;
  color: string;
  isCode?: boolean;
}> = ({ code, color, isCode = false }) => (
  <div className="relative mt-3">
    <div
      className="rounded-xl overflow-hidden font-mono text-sm leading-relaxed bg-[#0d1117] border border-[#30363d] shadow-lg"
    >
      {/* Window chrome */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b border-[#30363d] bg-[#161b22]"
      >
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex items-center gap-1.5 ml-2">
          {isCode ? (
            <Code2 size={12} className="text-slate-400" />
          ) : (
            <Terminal size={12} className="text-slate-400" />
          )}
          <span className="text-slate-400 text-xs">{isCode ? "code" : "terminal"}</span>
        </div>
      </div>
      {/* Code content */}
      <pre className="p-4 overflow-x-auto text-slate-300 whitespace-pre-wrap">
        <code>{code}</code>
      </pre>
    </div>
    <CopyButton text={code} color={color} />
  </div>
);

/* ─────────────────────────────────────────
   Stat Card
───────────────────────────────────────── */
const StatCard: React.FC<{
  label: string;
  value: string;
  color: string;
  delay: number;
}> = ({ label, value, color, delay }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative rounded-2xl p-5 flex flex-col gap-2 overflow-hidden group"
      style={{
        background: `linear-gradient(135deg, ${color}12, ${color}06)`,
        border: `1px solid ${color}30`,
      }}
    >
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at 50% 50%, ${color}15, transparent 70%)` }}
      />
      <span
        className="text-2xl font-black tracking-tight"
        style={{ color: isDark ? color : `color-mix(in srgb, ${color}, black 45%)` }}
      >
        {value}
      </span>
      <span className="text-xs uppercase tracking-widest text-slate-500 dark:text-white/50 font-semibold">
        {label}
      </span>
    </motion.div>
  );
};

/* ─────────────────────────────────────────
   Related Tech Card
───────────────────────────────────────── */
const RelatedTechCard: React.FC<{ tech: Technology }> = ({ tech }) => (
  <Link to={`/technologies/${tech.slug}`}>
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-3 p-5 rounded-2xl cursor-pointer transition-colors duration-200 bg-slate-50/50 hover:bg-slate-100/50 border border-slate-200/60 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10"
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center"
        style={{
          background: `${tech.accentColor}18`,
          border: `1px solid ${tech.accentColor}30`,
        }}
      >
        <tech.icon size={28} color={tech.color} />
      </div>
      <span className="text-sm font-semibold text-center text-slate-700 dark:text-foreground/80">{tech.name}</span>
    </motion.div>
  </Link>
);

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const TechnologyDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const tech = technologies.find((t) => t.slug === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  if (!tech) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">Technology not found</p>
          <Link to="/" className="mt-4 inline-block text-primary underline">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  // Get adjacent technologies in the same category
  const sameCategory = technologies.filter(
    (t) => t.category === tech.category && t.slug !== tech.slug
  );
  const relatedTechs = sameCategory.slice(0, 5);

  // Current index among all techs
  const currentIndex = technologies.findIndex((t) => t.slug === slug);
  const prevTech = technologies[currentIndex - 1];
  const nextTech = technologies[currentIndex + 1];

  // Extra detail data
  const detail: TechDetail | null = techDetails[tech.slug] ?? null;

  const color = tech.accentColor || tech.color || "#6366f1";
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const activeColor = isDark ? color : "#0f172a";

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* ── Ambient background glows ── */}
      <div
        className="fixed pointer-events-none -z-10"
        aria-hidden="true"
        style={{
          top: "-15%",
          right: "-20%",
          width: "700px",
          height: "700px",
          transform: "translateZ(0)",
          background: `radial-gradient(circle, ${color}1e 0%, transparent 70%)`,
          borderRadius: "9999px"
        }}
      />
      <div
        className="fixed pointer-events-none -z-10"
        aria-hidden="true"
        style={{
          bottom: "-10%",
          left: "-15%",
          width: "500px",
          height: "500px",
          transform: "translateZ(0)",
          background: `radial-gradient(circle, ${color}14 0%, transparent 70%)`,
          borderRadius: "9999px"
        }}
      />

      {/* ═══════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════ */}
      <section className="relative pt-14 pb-12 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Back button */}
          <Reveal className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 group text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-200/80 dark:bg-white/5 dark:border-white/10 dark:text-white/60 dark:hover:text-white"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
              Back
            </button>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — Text content */}
            <div>
              {/* Category badge */}
              <Reveal delay={0.05}>
                <div className="inline-flex items-center gap-2 mb-5">
                  <span
                    className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
                    style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}
                  >
                    {tech.category}
                  </span>
                </div>
              </Reveal>

              {/* Tech name */}
              <Reveal delay={0.1}>
                <h1
                  className="text-5xl md:text-6xl xl:text-7xl font-black tracking-tight leading-none mb-5 bg-clip-text text-transparent w-fit"
                  style={isDark ? {
                    backgroundImage: `linear-gradient(135deg, #fff 0%, ${color} 100%)`,
                  } : {
                    backgroundImage: `linear-gradient(135deg, #0f172a 0%, ${color} 100%)`,
                  }}
                >
                  {tech.name}
                </h1>
              </Reveal>

              {/* Description */}
              <Reveal delay={0.15}>
                <p className="text-lg text-slate-600 dark:text-white/65 leading-relaxed mb-8 max-w-xl">
                  {tech.description}
                </p>
              </Reveal>

              {/* Stat cards row */}
              {detail?.techStats && (
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {detail.techStats.map((stat, i) => (
                    <StatCard
                      key={stat.label}
                      label={stat.label}
                      value={stat.value}
                      color={color}
                      delay={0.2 + i * 0.05}
                    />
                  ))}
                </div>
              )}

              {/* Usage tags */}
              {tech.useCases && (
                <Reveal delay={0.35}>
                  <div className="flex flex-wrap gap-2">
                    {tech.useCases.slice(0, 5).map((uc) => (
                      <span
                        key={uc}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200/60 dark:bg-white/5 dark:text-white/60 dark:border-white/10"
                      >
                        {uc}
                      </span>
                    ))}
                  </div>
                </Reveal>
              )}
            </div>

            {/* Right — Unique SVG illustration */}
            <Reveal fromRight delay={0.12} className="flex items-center justify-center">
              <motion.div
                className="relative w-full max-w-md aspect-square"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Glow ring */}
                <div
                  className="absolute inset-0 rounded-full blur-3xl opacity-30"
                  style={{ background: `radial-gradient(ellipse, ${color}, transparent 70%)` }}
                />
                <TechIllustration
                  slug={tech.slug}
                  color={activeColor}
                  category={tech.category}
                  className="relative z-10 w-full h-full drop-shadow-2xl"
                />
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          DIVIDER
      ═══════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }} />
      </div>

      {/* ═══════════════════════════════════════════════
          FROM SCRATCH SECTION
      ═══════════════════════════════════════════════ */}
      {detail?.fromScratch && (
        <section className="px-6 py-16">
          <div className="max-w-5xl mx-auto">
            <Reveal className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl" style={{ background: `${color}20`, border: `1px solid ${color}35` }}>
                  <Terminal size={20} color={color} />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
                  {detail.fromScratch.title}
                </h2>
              </div>
              <p className="text-slate-600 dark:text-white/50 ml-14">
                <span className="font-semibold text-slate-800 dark:text-white/70">Environment: </span>
                {detail.fromScratch.environment}
              </p>
            </Reveal>

            {/* Step cards */}
            <div className="space-y-4">
              {detail.fromScratch.steps.map((step, idx) => {
                const isOpen = activeStep === idx;
                return (
                  <Reveal key={step.step} delay={idx * 0.07}>
                    <motion.div
                      className={`rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border ${
                        isOpen
                          ? "border-slate-200/80 dark:border-white/10 shadow-sm"
                          : "border-transparent hover:border-slate-200/50 dark:hover:border-white/10"
                      }`}
                      style={{
                        background: isOpen ? `${color}0a` : "transparent",
                        borderColor: isOpen ? `${color}50` : undefined,
                      }}
                      onClick={() => setActiveStep(isOpen ? null : idx)}
                    >
                      {/* Step header */}
                      <div className="flex items-center gap-4 px-6 py-5">
                        {/* Step number */}
                        <div
                          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-base"
                          style={isDark ? {
                            background: isOpen ? color : `${color}20`,
                            color: isOpen ? "#fff" : color,
                            border: `2px solid ${color}40`,
                          } : {
                            background: isOpen ? `color-mix(in srgb, ${color}, black 20%)` : `${color}20`,
                            color: isOpen ? "#fff" : `color-mix(in srgb, ${color}, black 30%)`,
                            border: `2px solid ${isOpen ? `color-mix(in srgb, ${color}, black 20%)` : `${color}40`}`,
                          }}
                        >
                          {step.step}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-snug">
                            {step.title}
                          </h3>
                          {!isOpen && (
                            <p className="text-slate-500 dark:text-white/40 text-sm mt-0.5 line-clamp-1">
                              {step.description}
                            </p>
                          )}
                        </div>

                        <motion.div
                          animate={{ rotate: isOpen ? 90 : 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <ChevronRight size={20} className="text-slate-400 dark:text-white/30" />
                        </motion.div>
                      </div>

                      {/* Expanded content */}
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key="content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 ml-14">
                              <p className="text-slate-600 dark:text-white/65 leading-relaxed mb-4 whitespace-pre-line">
                                {step.description}
                              </p>
                              {step.command && (
                                <CodeBlock
                                  code={step.command}
                                  color={color}
                                  isCode={step.isCode}
                                />
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Reveal>
                );
              })}
            </div>

            {/* Pro Tip */}
            <Reveal delay={0.3} className="mt-10">
              <div
                className="relative rounded-2xl p-6 overflow-hidden"
                style={{ background: `${color}10`, border: `1px solid ${color}35` }}
              >
                {/* Glow spot */}
                <div
                  className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
                  style={{ background: isDark ? color : `color-mix(in srgb, ${color}, black 20%)` }}
                />
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 p-2.5 rounded-xl flex-shrink-0 border dark:bg-transparent" style={isDark ? { background: `${color}20`, borderColor: `${color}35` } : { background: `${color}15`, borderColor: `${color}30` }}>
                    <Lightbulb size={18} color={isDark ? color : `color-mix(in srgb, ${color}, black 35%)`} />
                  </div>
                  <div>
                    <p className="font-bold text-sm uppercase tracking-widest mb-2" style={isDark ? { color } : { color: `color-mix(in srgb, ${color}, black 40%)` }}>
                      ULMiND Pro Tip
                    </p>
                    <p className="text-slate-700 dark:text-white/70 leading-relaxed text-sm">
                      {detail.fromScratch.proTip}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          DIVIDER
      ═══════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }} />
      </div>

      {/* ═══════════════════════════════════════════════
          WHY + ECOSYSTEM
      ═══════════════════════════════════════════════ */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">

          {/* Why we use it */}
          {tech.howWeUse && (
            <Reveal fromLeft>
              <div
                className="rounded-2xl p-7 h-full transition-colors duration-300 bg-slate-50/50 border border-slate-200/60 dark:bg-white/5 dark:border-white/10"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl" style={{ background: `${color}20`, border: `1px solid ${color}35` }}>
                    <Star size={18} color={color} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Why We Use It</h2>
                </div>
                <ul className="space-y-3">
                  {tech.howWeUse.map((reason) => (
                    <li key={reason} className="flex items-start gap-3">
                      <CheckCircle size={16} className="mt-0.5 flex-shrink-0" color={color} />
                      <span className="text-slate-600 dark:text-white/65 text-sm leading-relaxed">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}

          {/* Ecosystem / features */}
          {tech.keyBenefits && (
            <Reveal fromRight>
              <div
                className="rounded-2xl p-7 h-full transition-colors duration-300 bg-slate-50/50 border border-slate-200/60 dark:bg-white/5 dark:border-white/10"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl" style={{ background: `${color}20`, border: `1px solid ${color}35` }}>
                    <Package size={18} color={color} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Key Features</h2>
                </div>
                <ul className="space-y-3">
                  {tech.keyBenefits.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Zap size={16} className="mt-0.5 flex-shrink-0" color={color} />
                      <span className="text-slate-600 dark:text-white/65 text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}

          {/* Use cases */}
          {tech.useCases && (
            <Reveal>
              <div
                className="rounded-2xl p-7 h-full transition-colors duration-300 bg-slate-50/50 border border-slate-200/60 dark:bg-white/5 dark:border-white/10"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl" style={{ background: `${color}20`, border: `1px solid ${color}35` }}>
                    <Layers size={18} color={color} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Use Cases</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tech.useCases.map((uc) => (
                    <span
                      key={uc}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
                    >
                      {uc}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {/* How we use it at ULMiND */}
          {tech.howWeUse && tech.howWeUse.length > 0 && (
            <Reveal>
              <div
                className="rounded-2xl p-7 h-full border border-slate-200/60 dark:border-white/10"
                style={{ background: `linear-gradient(135deg, ${color}12, transparent)` }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl" style={{ background: `${color}20`, border: `1px solid ${color}35` }}>
                    <Code2 size={18} color={color} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">How ULMiND Uses It</h2>
                </div>
                <ul className="space-y-3">
                  {tech.howWeUse.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle size={16} className="mt-0.5 flex-shrink-0" color={color} />
                      <span className="text-slate-600 dark:text-white/65 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          RELATED TECHNOLOGIES
      ═══════════════════════════════════════════════ */}
      {relatedTechs.length > 0 && (
        <>
          <div className="max-w-7xl mx-auto px-6">
            <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }} />
          </div>
          <section className="px-6 py-16">
            <div className="max-w-7xl mx-auto">
              <Reveal className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 dark:bg-transparent" style={isDark ? { background: `${color}20`, borderColor: `${color}35` } : {}}>
                    <Globe size={18} color={activeColor} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                    Related in <span style={isDark ? { color } : { color: "#0f172a" }}>{tech.category}</span>
                  </h2>
                </div>
              </Reveal>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {relatedTechs.map((t, i) => (
                  <Reveal key={t.slug} delay={i * 0.07}>
                    <RelatedTechCard tech={t} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ═══════════════════════════════════════════════
          PREV / NEXT NAVIGATION
      ═══════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }} />
      </div>
      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 flex-wrap">
          {prevTech ? (
            <Link to={`/technologies/${prevTech.slug}`} className="group">
              <motion.div
                whileHover={{ x: -4 }}
                className="flex items-center gap-4 p-5 rounded-2xl transition-colors duration-200 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10"
              >
                <ArrowLeft size={20} className="text-slate-400 group-hover:text-slate-600 dark:text-white/40 dark:group-hover:text-white transition-colors" />
                <div>
                  <p className="text-xs text-slate-400 dark:text-white/40 uppercase tracking-widest mb-1">Previous</p>
                  <p className="font-bold text-slate-700 group-hover:text-slate-900 dark:text-white/80 dark:group-hover:text-white transition-colors">{prevTech.name}</p>
                </div>
              </motion.div>
            </Link>
          ) : <div />}
          {nextTech ? (
            <Link to={`/technologies/${nextTech.slug}`} className="group">
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 p-5 rounded-2xl transition-colors duration-200 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10"
              >
                <div className="text-right">
                  <p className="text-xs text-slate-400 dark:text-white/40 uppercase tracking-widest mb-1">Next</p>
                  <p className="font-bold text-slate-700 group-hover:text-slate-900 dark:text-white/80 dark:group-hover:text-white transition-colors">{nextTech.name}</p>
                </div>
                <ArrowRight size={20} className="text-slate-400 group-hover:text-slate-600 dark:text-white/40 dark:group-hover:text-white transition-colors" />
              </motion.div>
            </Link>
          ) : <div />}
        </div>
      </section>
    </div>
  );
};

export default TechnologyDetail;
