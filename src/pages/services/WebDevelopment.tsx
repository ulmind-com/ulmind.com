import React, { useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Code,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Zap,
  Shield,
  TrendingUp,
  Globe,
  Layers,
  Cpu,
  Clock,
  Star,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BlurBlob from "@/components/BlurBlob";
import { technologies } from "@/data/technologies";

/* ─── Phase Data ─────────────────────────────────────── */import { TimelineGlowLine } from "@/components/ui/TimelineGlowLine";

const phases = [
  {
    phase: "PHASE 1",
    title: "Planning & Strategy",
    days: "Day 1–3",
    color: "#10b981",
    borderColor: "border-emerald-500/40",
    bg: "from-emerald-500/10 to-emerald-500/5",
    dot: "#10b981",
    days_data: [
      { day: "DAY 1 — REQUIREMENT ANALYSIS", items: ["Business goal understanding", "Target audience research", "Competitor analysis", "Feature planning"] },
      { day: "DAY 2 — PROJECT PLANNING", items: ["Tech stack selection (React / Next.js / Node.js)", "Database planning", "System architecture design"] },
      { day: "DAY 3 — WIREFRAMING", items: ["Basic layout structure", "Page flow design", "User journey mapping"] },
    ],
  },
  {
    phase: "PHASE 2",
    title: "UI/UX Design",
    days: "Day 4–5",
    color: "#f59e0b",
    borderColor: "border-yellow-500/40",
    bg: "from-yellow-500/10 to-yellow-500/5",
    dot: "#f59e0b",
    days_data: [
      { day: "DAY 4 — UI DESIGN", items: ["Premium modern design creation", "Brand color integration", "Typography & spacing setup"] },
      { day: "DAY 5 — UX OPTIMIZATION", items: ["User-friendly navigation", "CTA placement", "Conversion-focused layout"] },
    ],
  },
  {
    phase: "PHASE 3",
    title: "Frontend Development",
    days: "Day 6–9",
    color: "#3b82f6",
    borderColor: "border-blue-500/40",
    bg: "from-blue-500/10 to-blue-500/5",
    dot: "#3b82f6",
    days_data: [
      { day: "DAY 6–7 — CORE SETUP", items: ["React / Next.js setup", "Component-based architecture", "Responsive layout implementation"] },
      { day: "DAY 8–9 — ENHANCEMENT", items: ["Animations & transitions", "API integration", "Performance optimization"] },
    ],
  },
  {
    phase: "PHASE 4",
    title: "Backend Development",
    days: "Day 10–12",
    color: "#8b5cf6",
    borderColor: "border-purple-500/40",
    bg: "from-purple-500/10 to-purple-500/5",
    dot: "#8b5cf6",
    days_data: [
      { day: "DAY 10 — SERVER SETUP", items: ["Server setup (Node.js)", "Database connection"] },
      { day: "DAY 11 — API & AUTH", items: ["API development", "Authentication system"] },
      { day: "DAY 12 — SECURITY", items: ["Data handling & security", "Error handling system"] },
    ],
  },
  {
    phase: "PHASE 5",
    title: "Testing & Optimization",
    days: "Day 13–14",
    color: "#f43f5e",
    borderColor: "border-rose-500/40",
    bg: "from-rose-500/10 to-rose-500/5",
    dot: "#f43f5e",
    days_data: [
      { day: "DAY 13 — TESTING", items: ["Bug fixing", "Cross-browser testing", "Mobile optimization"] },
      { day: "DAY 14 — OPTIMIZATION", items: ["Speed optimization", "SEO implementation", "Final review"] },
    ],
  },
  {
    phase: "PHASE 6",
    title: "Deployment",
    days: "Day 15",
    color: "#71717a",
    borderColor: "border-zinc-500/40",
    bg: "from-zinc-500/10 to-zinc-500/5",
    dot: "#71717a",
    days_data: [
      { day: "DAY 15 — GO LIVE", items: ["Live server deployment", "Domain & hosting setup", "SSL configuration", "Final delivery"] },
    ],
  },
];

// Web tech shown in the tech stack section
const webTechNames = [
  "React", "Next.js", "TypeScript", "Node.js", "MongoDB",
  "PostgreSQL", "Tailwind", "Vercel", "Docker", "GraphQL",
];
const techStack = technologies.filter((t) => webTechNames.includes(t.name));

const features = [
  { icon: Globe, title: "Responsive Design", desc: "Works perfectly on mobile, tablet, and desktop." },
  { icon: TrendingUp, title: "SEO Optimized", desc: "Structured for better ranking on Google." },
  { icon: Zap, title: "Performance Focused", desc: "Fast loading with optimized assets." },
  { icon: Layers, title: "Scalable Architecture", desc: "Ready to grow with your business." },
];

const whyUs = [
  "Clean & professional code structure",
  "On-time delivery",
  "Dedicated support",
  "Future-ready development",
  "Business-focused approach",
];

const useCases = ["Startup Website", "SaaS Platform", "Business Website", "Portfolio", "E-commerce"];

/* ─── Animated Section Wrapper ──────────────────────── */
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ─── Phase Card ─────────────────────────────────────── */
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
            {phase.title}
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

/* ─── Main Page ──────────────────────────────────────── */
const WebDevelopmentPage: React.FC = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    document.title = "Web Development | ULMiND";
    return () => { document.title = "ULMiND"; };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300 overflow-x-hidden">

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <BlurBlob position={{ top: "10%", left: "5%" }} size={{ width: "500px", height: "500px" }} colorClass="bg-rose-400" opacityClass="opacity-20" />
        <BlurBlob position={{ top: "50%", left: "70%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-purple-400" opacityClass="opacity-20" />

        {/* ── BACK TO HOME — absolute, no layout impact ── */}
        <motion.button
          onClick={() => navigate("/services")}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-8 left-6 z-20 flex items-center gap-2 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:gap-3 transition-all duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Services
        </motion.button>

        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
          {/* LEFT text */}
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-rose-500/30 bg-rose-500/10 backdrop-blur-md">
                <Code className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-rose-600 dark:text-red-400 text-[10px] font-black tracking-[0.4em] uppercase">Web Development</span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-black text-zinc-900 dark:text-white leading-none tracking-tighter uppercase mb-6">
                Build
                <span className="block bg-gradient-to-r from-rose-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                  Beyond Limits
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8 max-w-lg font-medium">
                We build high-performance, scalable, and modern web applications tailored to your business needs. From idea validation to deployment, everything is handled with a structured and result-driven approach.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  { icon: Zap, label: "Fast" },
                  { icon: Shield, label: "Secure" },
                  { icon: TrendingUp, label: "Scalable" },
                  { icon: Star, label: "Conversion-focused" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200/50 dark:border-white/10">
                    <Icon className="w-4 h-4 text-rose-500" />
                    <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{label}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="h-14 px-8 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-rose-600/30 uppercase tracking-widest"
                  onClick={() => navigate("/contact")}
                >
                  Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 border-zinc-300 dark:border-white/20 rounded-2xl font-black text-sm uppercase tracking-widest hover:border-rose-500 dark:hover:border-rose-500"
                  onClick={() => navigate("/projects")}
                >
                  View Projects
                </Button>
              </div>
            </Reveal>
          </motion.div>

          {/* RIGHT illustration */}
          <Reveal delay={0.3}>
            <motion.div
              animate={{ y: [0, -18, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="flex justify-center perspective-1000"
            >
              <img
                src="/web1.png"
                alt="Web Development"
                className="w-full max-w-lg object-contain drop-shadow-[0_20px_60px_rgba(225,29,72,0.4)] dark:drop-shadow-[0_20px_50px_rgba(255,255,255,0.05)] transform hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── WHAT YOU GET ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <BlurBlob position={{ top: "50%", left: "75%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-blue-400" opacityClass="opacity-10" />
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Illustration LEFT */}
          <Reveal>
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="perspective-1000"
            >
              <img
                src="/web2.png"
                alt="What You Get"
                className="w-full max-w-lg mx-auto object-contain drop-shadow-[0_20px_50px_rgba(139,92,246,0.3)] dark:drop-shadow-[0_20px_50px_rgba(255,255,255,0.05)] transform hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          </Reveal>

          {/* Text RIGHT */}
          <div>
            <Reveal>
              <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-purple-500/20 bg-purple-500/10">
                <span className="text-purple-600 dark:text-purple-400 text-[10px] font-black tracking-[0.4em] uppercase">Deliverables</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-8">
                What You <span className="text-rose-600">Get</span>
              </h2>
            </Reveal>
            <div className="space-y-4">
              {[
                "Custom Web Application (No templates)",
                "Fully Responsive UI/UX",
                "SEO-Optimized Structure",
                "Lightning Fast Performance",
                "Scalable Backend Architecture",
                "Clean & Maintainable Code",
              ].map((item, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <motion.div
                    whileHover={{ x: 8 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/50 dark:border-white/5 group cursor-default"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center flex-shrink-0">
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
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <BlurBlob position={{ top: "20%", left: "5%" }} size={{ width: "500px", height: "500px" }} colorClass="bg-pink-400" opacityClass="opacity-10" />

        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-rose-500/20 bg-rose-500/10">
              <span className="text-rose-600 dark:text-red-400 text-[10px] font-black tracking-[0.4em] uppercase">Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-4">
              Development <span className="text-rose-600">Roadmap</span>
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">Day 1 – Day 15, structured delivery</p>
          </Reveal>

          {/* Timeline */}
          <div className="relative">
            {/* Dynamic Animated Center Line */}
            <TimelineGlowLine colors={phases.map(p => p.color)} />

            <div className="space-y-12">
              {phases.map((phase, i) => (
                <PhaseCard key={i} phase={phase} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-blue-500/20 bg-blue-500/10">
              <span className="text-blue-600 dark:text-blue-400 text-[10px] font-black tracking-[0.4em] uppercase">Stack</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
              Technology <span className="text-rose-600">Stack</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {techStack.map((tech, i) => (
              <Reveal key={tech.name} delay={i * 0.06}>
                <motion.div
                  whileHover={{ scale: 1.06, y: -6 }}
                  className="bg-card rounded-2xl p-5 text-center shadow-card hover:shadow-floating transition-all duration-300 group flex flex-col items-center justify-center gap-3 border border-border hover:border-rose-500/30"
                >
                  <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <tech.icon size={32} color={tech.color} />
                  </div>
                  <span className="text-sm font-semibold text-foreground/80 group-hover:text-foreground transition-colors">
                    {tech.name}
                  </span>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── KEY FEATURES ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <BlurBlob position={{ top: "30%", left: "78%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-emerald-400" opacityClass="opacity-10" />
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Text LEFT */}
          <div>
            <Reveal>
              <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-emerald-500/20 bg-emerald-500/10">
                <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-black tracking-[0.4em] uppercase">Features</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-10">
                Key <span className="text-rose-600">Features</span>
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 gap-6">
              {features.map(({ icon: Icon, title, desc }, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex gap-5 p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-zinc-200/50 dark:border-white/10 shadow-sm hover:shadow-md dark:hover:shadow-rose-500/10 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-rose-500/30">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-zinc-900 dark:text-white text-lg mb-1">{title}</h3>
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm">{desc}</p>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Illustration RIGHT */}
          <Reveal delay={0.2}>
            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="perspective-1000"
            >
              <img
                src="/web1.png"
                alt="Key Features"
                className="w-full max-w-md mx-auto object-contain drop-shadow-[0_20px_60px_rgba(225,29,72,0.4)] dark:drop-shadow-[0_20px_50px_rgba(255,255,255,0.05)] transform hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── WHY CHOOSE US + DESIGN APPROACH ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <BlurBlob position={{ top: "30%", left: "0%" }} size={{ width: "500px", height: "500px" }} colorClass="bg-yellow-400" opacityClass="opacity-10" />
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">
          {/* Why Choose Us */}
          <Reveal>
            <div className="p-8 rounded-3xl bg-gradient-to-br from-rose-600 to-pink-600 text-white shadow-2xl shadow-rose-600/30 h-full">
              <h2 className="text-3xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                <Star className="w-7 h-7" /> Why Choose Us
              </h2>
              <ul className="space-y-4">
                {whyUs.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 text-white/90 font-semibold"
                  >
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Design Approach */}
          <Reveal delay={0.15}>
            <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/50 dark:border-white/10 h-full">
              <h2 className="text-3xl font-black uppercase tracking-tight text-zinc-900 dark:text-white mb-6 flex items-center gap-3">
                <Cpu className="w-7 h-7 text-rose-500" /> Design Approach
              </h2>
              <div className="space-y-4">
                {["Minimal & premium UI", "Smooth micro-interactions", "Balanced whitespace", "Modern gradients & shadows"].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-white/[0.03] border border-zinc-200/50 dark:border-white/5"
                  >
                    <div className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">{item}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8">
                <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">Security & Performance</p>
                <div className="grid grid-cols-2 gap-3">
                  {["Secure authentication", "Data encryption", "API protection", "Optimized loading"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <Shield className="w-4 h-4 text-rose-500 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
                  whileHover={{ scale: 1.05 }}
                  transition={{ delay: i * 0.07 }}
                  viewport={{ once: true }}
                  className="px-5 py-2.5 rounded-full border border-zinc-300 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.03] text-sm font-bold text-zinc-700 dark:text-zinc-300 cursor-default"
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
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-950" />
              <div className="absolute inset-0 bg-gradient-to-r from-rose-600/20 to-purple-600/20" />

              {/* Floating dots */}
              <div className="absolute top-4 right-8 w-32 h-32 rounded-full bg-rose-500/20 blur-3xl" />
              <div className="absolute bottom-4 left-8 w-32 h-32 rounded-full bg-purple-500/20 blur-3xl" />

              <div className="relative z-10 p-12 md:p-16 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                  <Clock className="w-3.5 h-3.5 text-white/80" />
                  <span className="text-white/80 text-[10px] font-black tracking-[0.4em] uppercase">Ready in 15 Days</span>
                </div>

                <h2 className="text-4xl md:text-5xl xl:text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
                  Let's Build Your
                  <span className="block bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
                    Next Project
                  </span>
                </h2>

                <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto font-medium">
                  Ready to build your next project? Let's turn your idea into a powerful web application.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="h-14 px-10 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white rounded-2xl font-black text-sm shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:shadow-[0_0_30px_rgba(225,29,72,0.6)] uppercase tracking-widest border border-rose-500/30 hover:scale-105 transition-all duration-300"
                    onClick={() => navigate("/contact")}
                  >
                    Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <button
                    className="inline-flex items-center justify-center h-14 px-10 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/50 text-white rounded-2xl font-black text-sm shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_32px_rgba(255,255,255,0.15)] backdrop-blur-md uppercase tracking-widest transition-all duration-300 hover:scale-105"
                    onClick={() => navigate("/projects")}
                  >
                    See Our Work
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default WebDevelopmentPage;
