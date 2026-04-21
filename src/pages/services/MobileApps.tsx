import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Smartphone, ChevronRight, Zap, Shield, Bell, Star, Globe, Code2 } from "lucide-react";
import BlurBlob from "@/components/BlurBlob";
import { TimelineGlowLine } from "@/components/ui/TimelineGlowLine";
import { ShineBorder } from "@/components/ui/shine-border";

// ---- Reveal wrapper ----
const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.7, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

// ---- Roadmap phases ----
const phases = [
  {
    phase: "PHASE 1",
    label: "Research & Planning",
    days: "Day 1–3",
    color: "#6366f1",
    bg: "from-indigo-500/10 to-indigo-500/5",
    border: "border-indigo-400/30",
    dot: "bg-indigo-500",
    days_data: [
      { day: "DAY 1 — REQUIREMENT UNDERSTANDING", items: ["App idea discussion", "Target audience analysis", "Competitor research"] },
      { day: "DAY 2 — FEATURE PLANNING", items: ["Core feature listing", "App flow structure", "Platform decision"] },
      { day: "DAY 3 — WIREFRAMING", items: ["Screen structure design", "User journey mapping"] },
    ],
  },
  {
    phase: "PHASE 2",
    label: "UI/UX Design",
    days: "Day 4–5",
    color: "#8b5cf6",
    bg: "from-violet-500/10 to-violet-500/5",
    border: "border-violet-400/30",
    dot: "bg-violet-500",
    days_data: [
      { day: "DAY 4 — UI DESIGN", items: ["Modern mobile-first design", "Brand identity integration"] },
      { day: "DAY 5 — UX OPTIMIZATION", items: ["Smooth navigation", "User engagement flow"] },
    ],
  },
  {
    phase: "PHASE 3",
    label: "App Development",
    days: "Day 6–10",
    color: "#3b82f6",
    bg: "from-blue-500/10 to-blue-500/5",
    border: "border-blue-400/30",
    dot: "bg-blue-500",
    days_data: [
      { day: "DAY 6–7 — SETUP & COMPONENTS", items: ["React Native / Flutter setup", "Component development"] },
      { day: "DAY 8–9 — INTEGRATION", items: ["API integration", "State management"] },
      { day: "DAY 10 — NOTIFICATIONS & TESTING", items: ["Push notification setup", "Device compatibility testing"] },
    ],
  },
  {
    phase: "PHASE 4",
    label: "Backend & Integration",
    days: "Day 11–12",
    color: "#06b6d4",
    bg: "from-cyan-500/10 to-cyan-500/5",
    border: "border-cyan-400/30",
    dot: "bg-cyan-500",
    days_data: [
      { day: "DAY 11 — SERVER SETUP", items: ["Server setup", "Database integration"] },
      { day: "DAY 12 — SECURITY", items: ["Authentication system", "Data security implementation"] },
    ],
  },
  {
    phase: "PHASE 5",
    label: "Testing & Optimization",
    days: "Day 13–14",
    color: "#f59e0b",
    bg: "from-amber-500/10 to-amber-500/5",
    border: "border-amber-400/30",
    dot: "bg-amber-500",
    days_data: [
      { day: "DAY 13 — BUG FIXING", items: ["Bug fixing", "Performance tuning"] },
      { day: "DAY 14 — POLISH", items: ["Cross-device testing", "UI polish"] },
    ],
  },
  {
    phase: "PHASE 6",
    label: "Deployment",
    days: "Day 15",
    color: "#10b981",
    bg: "from-emerald-500/10 to-emerald-500/5",
    border: "border-emerald-400/30",
    dot: "bg-emerald-500",
    days_data: [
      { day: "DAY 15 — LAUNCH", items: ["App Store submission", "Play Store submission", "Final build delivery"] },
    ],
  },
];

// ---- Tech stack ----
const techStack = [
  { category: "Framework", tech: "React Native / Flutter" },
  { category: "Backend", tech: "Node.js / Firebase" },
  { category: "Database", tech: "MongoDB / Firestore" },
  { category: "Notifications", tech: "Firebase Cloud Messaging" },
  { category: "Deployment", tech: "App Store / Play Store" },
];

// ---- Key Features ----
const keyFeatures = [
  { icon: Globe, title: "Cross-Platform", desc: "Single codebase for iOS & Android." },
  { icon: Zap, title: "Native Performance", desc: "Smooth and fast app experience." },
  { icon: Star, title: "App Store Ready", desc: "Fully optimized for publishing." },
  { icon: Bell, title: "Push Notifications", desc: "Real-time user engagement." },
];

export default function MobileAppsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-blue-50/40 dark:from-[#0a0a14] dark:via-[#0d0d1f] dark:to-[#0a0f1e] overflow-x-hidden">

      {/* ── BACK BUTTON ─────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <motion.button
          onClick={() => navigate(-1)}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:gap-3 transition-all duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Services
        </motion.button>
      </div>

      {/* ── HERO ────────────────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <BlurBlob position={{ top: "10%", left: "5%" }} size={{ width: "500px", height: "500px" }} colorClass="bg-indigo-400" opacityClass="opacity-10" />
        <BlurBlob position={{ top: "50%", left: "60%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-blue-400" opacityClass="opacity-8" />

        {/* LEFT text */}
        <div className="space-y-7 z-10">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 px-4 py-2 rounded-full border border-indigo-200 dark:border-indigo-700">
              <Smartphone className="w-3.5 h-3.5" /> Mobile Apps
            </span>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-5xl lg:text-6xl font-black leading-tight">
              <span className="text-gray-900 dark:text-white">LAUNCH YOUR</span>
              <br />
              <span className="bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                DREAM APP
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg">
              We design and develop high-performance mobile applications that deliver seamless user experiences across both iOS and Android platforms.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex flex-wrap gap-3">
              {["iOS & Android", "Native-like Speed", "App Store Ready", "Push Notifications"].map((tag) => (
                <span key={tag} className="flex items-center gap-1.5 text-sm font-semibold bg-white dark:bg-white/5 border border-indigo-200 dark:border-indigo-800/50 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-full shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" /> {tag}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="flex gap-4">
              <motion.button
                onClick={() => navigate("/contact")}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all"
              >
                Start Your App <ChevronRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => document.getElementById("roadmap")?.scrollIntoView({ behavior: "smooth" })}
                className="text-indigo-600 dark:text-indigo-400 font-bold px-6 py-4 rounded-2xl border border-indigo-200 dark:border-indigo-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
              >
                View Roadmap
              </motion.button>
            </div>
          </Reveal>
        </div>

        {/* RIGHT illustration */}
        <Reveal delay={0.3}>
          <motion.div
            animate={{ y: [0, -18, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex justify-center perspective-1000"
          >
            <img
              src="/app1.png"
              alt="Mobile App Development"
              className="w-full max-w-lg object-contain drop-shadow-[0_20px_60px_rgba(99,102,241,0.4)] dark:drop-shadow-[0_20px_50px_rgba(255,255,255,0.05)] transform hover:scale-105 transition-transform duration-700"
            />
          </motion.div>
        </Reveal>
      </section>

      {/* ── WHAT YOU GET ────────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT illustration */}
          <Reveal>
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="perspective-1000"
            >
              <img
                src="/app2.png"
                alt="Mobile Performance"
                className="w-full max-w-lg mx-auto object-contain drop-shadow-[0_20px_50px_rgba(59,130,246,0.3)] dark:drop-shadow-[0_20px_50px_rgba(255,255,255,0.05)] transform hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          </Reveal>

          {/* RIGHT text */}
          <div className="space-y-6">
            <Reveal>
              <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-4 py-2 rounded-full">
                Deliverables
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-4xl lg:text-5xl font-black dark:text-white">
                WHAT YOU <span className="text-indigo-500">GET</span>
              </h2>
            </Reveal>
            <div className="space-y-3">
              {[
                "Cross-platform mobile apps (iOS + Android)",
                "Native-like performance",
                "App Store & Play Store ready build",
                "Push notification integration",
                "Smooth UI/UX experience",
                "Secure backend integration",
              ].map((item, i) => (
                <Reveal key={item} delay={i * 0.06}>
                  <div className="flex items-center gap-4 bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] rounded-2xl px-5 py-4 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-800/50 transition-all">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{item}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DEVELOPMENT ROADMAP ─────────────────── */}
      <section id="roadmap" className="relative py-24 bg-gradient-to-b from-transparent via-indigo-50/40 to-transparent dark:via-indigo-950/20">
        <BlurBlob position={{ top: "20%", left: "2%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-indigo-400" opacityClass="opacity-8" />
        <BlurBlob position={{ top: "60%", left: "80%" }} size={{ width: "350px", height: "350px" }} colorClass="bg-blue-400" opacityClass="opacity-6" />

        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 px-4 py-2 rounded-full mb-4">
                Process
              </span>
              <h2 className="text-4xl lg:text-5xl font-black dark:text-white">
                DEVELOPMENT <span className="text-indigo-500">ROADMAP</span>
              </h2>
              <p className="mt-3 text-gray-500 dark:text-gray-400">Day 1 – Day 15, structured delivery</p>
            </div>
          </Reveal>

          {/* Timeline */}
          <div className="relative space-y-8">
            <TimelineGlowLine containerClass="left-1/2 -translate-x-1/2 hidden md:block" colors={phases.map(p => p.color)} />

            {phases.map((phase, i) => (
              <Reveal key={phase.phase} delay={i * 0.08}>
                <div className={`relative grid md:grid-cols-2 gap-6 md:gap-16 ${i % 2 === 0 ? "" : ""}`}>
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-6 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 shadow-lg hidden md:block z-10"
                    style={{ backgroundColor: phase.color }} />

                  {/* Card */}
                  <div className={`md:col-span-1 ${i % 2 !== 0 ? "md:col-start-2" : ""}`}>
                    <div className="relative rounded-2xl p-6 overflow-hidden backdrop-blur-xl bg-white/60 dark:bg-white/[0.12] border border-white/80 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.1)]">
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none" />
                      <div className="absolute bottom-0 inset-x-0 h-[3px] rounded-b-2xl pointer-events-none" style={{ background: `linear-gradient(90deg, transparent, ${phase.color}80, transparent)` }} />
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-xs font-black tracking-wider px-3 py-1.5 rounded-full text-white"
                          style={{ backgroundColor: phase.color }}>
                          {phase.phase}
                        </span>
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{phase.days}</span>
                      </div>
                      <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
                        {phase.label}
                      </h3>
                      <div className="space-y-4">
                        {phase.days_data.map((d) => (
                          <div key={d.day}>
                            <button className="flex items-center gap-2 text-xs font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase mb-2 w-full text-left">
                              <ChevronRight className="w-3 h-3" /> {d.day}
                            </button>
                            <ul className="space-y-1.5 pl-5">
                              {d.items.map((item) => (
                                <li key={item} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: phase.color }} />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK ──────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <Reveal>
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-4 py-2 rounded-full mb-4">
              Technology
            </span>
            <h2 className="text-4xl lg:text-5xl font-black dark:text-white">
              TECH <span className="text-blue-500">STACK</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {techStack.map((t, i) => (
            <Reveal key={t.category} delay={i * 0.07}>
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] rounded-2xl p-6 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700/50 hover:shadow-indigo-100 dark:hover:shadow-indigo-900/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                    <Code2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-bold tracking-widest uppercase text-indigo-500 dark:text-indigo-400">{t.category}</span>
                </div>
                <p className="font-bold text-gray-800 dark:text-gray-100 text-lg">{t.tech}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── KEY FEATURES ────────────────────────── */}
      <section className="relative py-24 bg-gradient-to-b from-transparent via-blue-50/40 to-transparent dark:via-blue-950/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* LEFT content */}
            <div className="space-y-6">
              <Reveal>
                <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 px-4 py-2 rounded-full">
                  Key Features
                </span>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="text-4xl lg:text-5xl font-black dark:text-white">
                  BUILT TO <span className="text-indigo-500">PERFORM</span>
                </h2>
              </Reveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {keyFeatures.map((f, i) => (
                  <Reveal key={f.title} delay={i * 0.08}>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] rounded-2xl p-5 hover:border-indigo-200 dark:hover:border-indigo-800/50 transition-all shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mb-3">
                        <f.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-black text-gray-900 dark:text-white mb-1">✔ {f.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
                    </motion.div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* RIGHT illustration */}
            <Reveal delay={0.2}>
              <motion.div
                animate={{ y: [0, -16, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="perspective-1000"
              >
                <img
                  src="/app1.png"
                  alt="Mobile App Features"
                  className="w-full max-w-lg mx-auto object-contain drop-shadow-[0_20px_60px_rgba(99,102,241,0.4)] dark:drop-shadow-[0_20px_50px_rgba(255,255,255,0.05)] transform hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US + SECURITY ─────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* WHY CHOOSE US */}
          <Reveal>
            <ShineBorder borderRadius={20} borderWidth={1} color={["#6366f1", "#3b82f6", "#06b6d4"]} className="w-full h-full">
              <div className="bg-white dark:bg-white/[0.02] rounded-2xl p-8 h-full">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </span>
                  WHY CHOOSE US
                </h3>
                <ul className="space-y-4">
                  {["Clean scalable code", "Fast delivery", "UI/UX focused development", "Long-term support"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ShineBorder>
          </Reveal>

          {/* SECURITY */}
          <Reveal delay={0.1}>
            <ShineBorder borderRadius={20} borderWidth={1} color={["#3b82f6", "#06b6d4", "#8b5cf6"]} className="w-full h-full">
              <div className="bg-white dark:bg-white/[0.02] rounded-2xl p-8 h-full">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </span>
                  SECURITY & PERFORMANCE
                </h3>
                <ul className="space-y-4">
                  {["Secure login system", "Encrypted API communication", "Optimized app speed"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium">
                      <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ShineBorder>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600" />
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }}
        />
        <BlurBlob position={{ top: "10%", left: "10%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-white" opacityClass="opacity-10" />
        <BlurBlob position={{ top: "50%", left: "70%" }} size={{ width: "350px", height: "350px" }} colorClass="bg-white" opacityClass="opacity-8" />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <Reveal>
            <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase bg-white/20 text-white px-4 py-2 rounded-full mb-6">
              Ready to Launch?
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
              LET'S BUILD YOUR<br />NEXT MOBILE APP
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-blue-100 text-lg mb-10">
              Ready to launch your mobile app? Let's build something powerful.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button
                onClick={() => navigate("/contact")}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-white text-indigo-600 font-black px-10 py-4 rounded-2xl shadow-2xl hover:shadow-white/25 transition-all"
              >
                Start Your App <ChevronRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={() => navigate("/")}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="text-white border-2 border-white/40 font-bold px-8 py-4 rounded-2xl hover:bg-white/10 transition-all"
              >
                Explore More Services
              </motion.button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
