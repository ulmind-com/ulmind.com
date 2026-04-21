import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Share2,
  ChevronRight,
  TrendingUp,
  Target,
  BarChart3,
  Users,
  Star,
  Shield,
  Zap,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";
import BlurBlob from "@/components/BlurBlob";
import { TimelineGlowLine } from "@/components/ui/TimelineGlowLine";
import { ShineBorder } from "@/components/ui/shine-border";

// Per-platform icon lookup
const platformIcons: Record<string, React.ElementType> = {
  Facebook,
  Instagram,
  LinkedIn: Linkedin,
  "Twitter (X)": Twitter,
  YouTube: Youtube,
};

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

// ---- Social Platforms ----
const platforms = [
  {
    name: "Facebook",
    color: "#1877F2",
    bg: "from-blue-600 to-blue-700",
    users: "3B+ Users",
    desc: "Organic posts, paid ads & community building",
  },
  {
    name: "Instagram",
    color: "#E1306C",
    bg: "from-pink-500 via-rose-500 to-orange-400",
    users: "2B+ Users",
    desc: "Reels, Stories, Carousels & influencer collab",
  },
  {
    name: "LinkedIn",
    color: "#0A66C2",
    bg: "from-blue-700 to-sky-600",
    users: "1B+ Users",
    desc: "B2B content, thought leadership & lead gen",
  },
  {
    name: "Twitter (X)",
    color: "#000000",
    bg: "from-zinc-900 to-zinc-800",
    users: "600M+ Users",
    desc: "Real-time engagement, trending content & ads",
  },
  {
    name: "YouTube",
    color: "#FF0000",
    bg: "from-red-600 to-rose-600",
    users: "2.7B+ Users",
    desc: "Video strategy, Shorts, SEO & monetization",
  },
];

// ---- Roadmap phases ----
const phases = [
  {
    phase: "PHASE 1",
    label: "Discovery & Audit",
    days: "Day 1–3",
    color: "#8b5cf6",
    dot: "bg-violet-500",
    days_data: [
      { day: "DAY 1 — BRAND DISCOVERY", items: ["Brand voice & identity analysis", "Target audience research", "Competitor social audit"] },
      { day: "DAY 2 — PLATFORM AUDIT", items: ["Existing account performance review", "Hashtag & keyword research"] },
      { day: "DAY 3 — GOAL SETTING", items: ["KPI definition", "Content pillar planning", "Posting frequency strategy"] },
    ],
  },
  {
    phase: "PHASE 2",
    label: "Strategy & Content Plan",
    days: "Day 4–6",
    color: "#ec4899",
    dot: "bg-pink-500",
    days_data: [
      { day: "DAY 4 — CONTENT CALENDAR", items: ["30-day content calendar creation", "Reel & carousel planning"] },
      { day: "DAY 5–6 — VISUAL DIRECTION", items: ["Brand color & typography guidelines", "Template design for posts", "Story highlight covers"] },
    ],
  },
  {
    phase: "PHASE 3",
    label: "Content Creation",
    days: "Day 7–12",
    color: "#f59e0b",
    dot: "bg-amber-500",
    days_data: [
      { day: "DAY 7–9 — COPYWRITING", items: ["Caption writing (SEO-optimized)", "Hashtag sets per platform", "CTA integration"] },
      { day: "DAY 10–12 — DESIGN & VIDEO", items: ["Graphic design for posts", "Reel scripts & editing", "Story & carousel creation"] },
    ],
  },
  {
    phase: "PHASE 4",
    label: "Publishing & Engagement",
    days: "Day 13–20",
    color: "#10b981",
    dot: "bg-emerald-500",
    days_data: [
      { day: "DAY 13–15 — POSTING", items: ["Scheduled publishing across platforms", "Optimal timing optimization"] },
      { day: "DAY 16–20 — COMMUNITY", items: ["Comment & DM responses", "Influencer outreach", "Brand mention monitoring"] },
    ],
  },
  {
    phase: "PHASE 5",
    label: "Paid Campaigns",
    days: "Day 21–25",
    color: "#3b82f6",
    dot: "bg-blue-500",
    days_data: [
      { day: "DAY 21–23 — AD SETUP", items: ["Meta & Google Ads setup", "Audience targeting", "Ad creative production"] },
      { day: "DAY 24–25 — OPTIMIZATION", items: ["A/B testing", "Bid strategy tuning", "ROAS tracking"] },
    ],
  },
  {
    phase: "PHASE 6",
    label: "Analytics & Reporting",
    days: "Day 26–30",
    color: "#e1306c",
    dot: "bg-rose-500",
    days_data: [
      { day: "DAY 26–30 — REPORTING", items: ["Monthly performance report", "Reach, engagement & conversion metrics", "Next-cycle strategy refinement"] },
    ],
  },
];

// ---- Tech Stack (Deliverables) ----
const techStack = [
  { category: "Content", tech: "Reels, Carousels & Stories" },
  { category: "Advertising", tech: "Meta Ads & Google Ads" },
  { category: "Analytics", tech: "Meta Insights & Google Analytics" },
  { category: "Scheduling", tech: "Buffer / Later / Hootsuite" },
  { category: "Design", tech: "Canva Pro / Adobe Express" },
  { category: "Reporting", tech: "Monthly PDF / Looker Studio" },
];

// ---- Key Features ----
const keyFeatures = [
  { icon: TrendingUp, title: "Reach & Growth", desc: "Consistent follower growth and organic reach expansion." },
  { icon: Target, title: "Targeted Ads", desc: "Laser-focused paid campaigns with defined ROAS goals." },
  { icon: BarChart3, title: "Analytics & Reporting", desc: "Clear monthly reports on every metric that matters." },
  { icon: Users, title: "Community Management", desc: "Active engagement, responses, and brand monitoring." },
];

const whyUs = [
  "Platform-specific strategies (not one-size-fits-all)",
  "Creative content tailored to your brand voice",
  "Data-driven decisions backed by analytics",
  "Dedicated account manager for your brand",
  "Transparent monthly performance reports",
];

export default function SocialMediaManagementPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50/30 to-rose-50/40 dark:from-[#0a0a14] dark:via-[#120d1a] dark:to-[#0d0a12] overflow-x-hidden">

      {/* ── BACK BUTTON ─────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pt-8 relative z-50">
        <motion.button
          onClick={() => navigate("/services")}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-sm font-semibold text-pink-600 dark:text-pink-400 hover:gap-3 transition-all duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Services
        </motion.button>
      </div>

      {/* ── HERO ────────────────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-6 pt-8 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <BlurBlob position={{ top: "10%", left: "5%" }} size={{ width: "500px", height: "500px" }} colorClass="bg-pink-400" opacityClass="opacity-10" />
        <BlurBlob position={{ top: "50%", left: "60%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-rose-400" opacityClass="opacity-8" />

        {/* LEFT text */}
        <div className="space-y-7 z-10">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-300 px-4 py-2 rounded-full border border-pink-200 dark:border-pink-700">
              <Share2 className="w-3.5 h-3.5" /> Social Media Management
            </span>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-5xl lg:text-6xl font-black leading-tight">
              <span className="text-gray-900 dark:text-white">GROW YOUR</span>
              <br />
              <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 bg-clip-text text-transparent">
                BRAND ONLINE
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg">
              We design and execute data-driven social media strategies that build real audiences, drive meaningful engagement, and turn followers into loyal customers.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex flex-wrap gap-3">
              {["5 Platforms", "30-Day Strategy", "Monthly Reports", "Paid Ads Included"].map((tag) => (
                <span key={tag} className="flex items-center gap-1.5 text-sm font-semibold bg-white dark:bg-white/5 border border-pink-200 dark:border-pink-800/50 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-full shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-500" /> {tag}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="flex gap-4 flex-wrap">
              <motion.button
                onClick={() => navigate("/contact")}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-pink-500/25 hover:shadow-xl transition-all"
              >
                Start Growing <ChevronRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => document.getElementById("roadmap")?.scrollIntoView({ behavior: "smooth" })}
                className="text-pink-600 dark:text-pink-400 font-bold px-6 py-4 rounded-2xl border border-pink-200 dark:border-pink-800/50 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all"
              >
                View Roadmap
              </motion.button>
            </div>
          </Reveal>
        </div>

        {/* RIGHT — Platform stack visualization */}
        <Reveal delay={0.3}>
          {/* CSS float — zero JS overhead */}
          <div className="flex flex-col gap-3 animate-float-slow">
            {platforms.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ x: 8, scale: 1.02 }}
                className={`flex items-center gap-4 bg-gradient-to-r ${p.bg} text-white px-5 py-4 rounded-2xl shadow-lg cursor-default`}
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  {(() => { const Icon = platformIcons[p.name]; return Icon ? <Icon className="w-5 h-5 text-white" /> : null; })()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm leading-tight">{p.name}</p>
                  <p className="text-white/80 text-xs">{p.desc}</p>
                </div>
                <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0">{p.users}</span>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── WHAT YOU GET ────────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT: Feature grid */}
          <div className="space-y-6">
            <Reveal>
              <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 px-4 py-2 rounded-full">
                Deliverables
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-4xl lg:text-5xl font-black dark:text-white">
                WHAT YOU <span className="text-pink-500">GET</span>
              </h2>
            </Reveal>
            <div className="space-y-3">
              {[
                "Full social media strategy (30-day plan)",
                "Custom content creation (posts, reels, stories)",
                "Paid ad campaigns on Meta & Google",
                "Community management & DM responses",
                "Hashtag & SEO optimization",
                "Monthly analytics & performance reports",
              ].map((item, i) => (
                <Reveal key={item} delay={i * 0.06}>
                  <div className="flex items-center gap-4 bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] rounded-2xl px-5 py-4 shadow-sm hover:border-pink-200 dark:hover:border-pink-800/50 transition-all">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{item}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* RIGHT: Platform cards */}
          <Reveal delay={0.2}>
            <div className="grid grid-cols-2 gap-4">
              {platforms.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ scale: 1.04, y: -4 }}
                  className={`bg-gradient-to-br ${p.bg} rounded-2xl p-5 text-white shadow-lg ${i === 4 ? "col-span-2" : ""}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                    {(() => { const Icon = platformIcons[p.name]; return Icon ? <Icon className="w-5 h-5 text-white" /> : null; })()}
                  </div>
                  <p className="font-black text-base">{p.name}</p>
                  <p className="text-white/75 text-xs mt-1">{p.users}</p>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── DEVELOPMENT ROADMAP ─────────────────── */}
      <section id="roadmap" className="relative py-24 bg-gradient-to-b from-transparent via-pink-50/40 to-transparent dark:via-pink-950/10">
        <BlurBlob position={{ top: "20%", left: "2%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-pink-400" opacityClass="opacity-8" />
        <BlurBlob position={{ top: "60%", left: "80%" }} size={{ width: "350px", height: "350px" }} colorClass="bg-rose-400" opacityClass="opacity-6" />

        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300 px-4 py-2 rounded-full mb-4">
                Process
              </span>
              <h2 className="text-4xl lg:text-5xl font-black dark:text-white">
                CAMPAIGN <span className="text-pink-500">ROADMAP</span>
              </h2>
              <p className="mt-3 text-gray-500 dark:text-gray-400">Day 1 – Day 30, structured delivery</p>
            </div>
          </Reveal>

          {/* Timeline */}
          <div className="relative space-y-8">
            <TimelineGlowLine containerClass="left-1/2 -translate-x-1/2 hidden md:block" colors={phases.map(p => p.color)} />

            {phases.map((phase, i) => (
              <Reveal key={phase.phase} delay={i * 0.08}>
                <div className={`relative grid md:grid-cols-2 gap-6 md:gap-16`}>
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

      {/* ── TOOLS & PLATFORMS ──────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <Reveal>
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 px-4 py-2 rounded-full mb-4">
              Tools & Deliverables
            </span>
            <h2 className="text-4xl lg:text-5xl font-black dark:text-white">
              HOW WE <span className="text-pink-500">DELIVER</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {techStack.map((t, i) => (
            <Reveal key={t.category} delay={i * 0.07}>
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] rounded-2xl p-6 shadow-sm hover:border-pink-300 dark:hover:border-pink-700/50 hover:shadow-pink-100 dark:hover:shadow-pink-900/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                    <Share2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-bold tracking-widest uppercase text-pink-500 dark:text-pink-400">{t.category}</span>
                </div>
                <p className="font-bold text-gray-800 dark:text-gray-100 text-lg">{t.tech}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── KEY FEATURES ────────────────────────── */}
      <section className="relative py-24 bg-gradient-to-b from-transparent via-rose-50/40 to-transparent dark:via-rose-950/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* LEFT content */}
            <div className="space-y-6">
              <Reveal>
                <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300 px-4 py-2 rounded-full">
                  Key Features
                </span>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="text-4xl lg:text-5xl font-black dark:text-white">
                  BUILT TO <span className="text-pink-500">ENGAGE</span>
                </h2>
              </Reveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {keyFeatures.map((f, i) => (
                  <Reveal key={f.title} delay={i * 0.08}>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] rounded-2xl p-5 hover:border-pink-200 dark:hover:border-pink-800/50 transition-all shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-3">
                        <f.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-black text-gray-900 dark:text-white mb-1">✔ {f.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
                    </motion.div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* RIGHT: animated platform icons */}
            <Reveal delay={0.2}>
              {/* Outer float wrapper — CSS only */}
              <div className="animate-float-medium relative flex items-center justify-center">
                <div className="relative w-80 h-80">
                  {/* Center circle */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-600/20 blur-3xl" />
                  <div className="absolute inset-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-2xl shadow-pink-500/30">
                    <Share2 className="w-16 h-16 text-white" />
                  </div>

                  {/* Orbiting platform icons — single CSS ring, zero JS overhead */}
                  {/* The ring rotates via CSS; children counter-rotate to stay upright */}
                  <div
                    className="animate-spin-orbit absolute inset-0"
                    style={{ borderRadius: "9999px" }}
                  >
                    {[
                      { icon: Facebook,  color: "#1877F2", shadow: "0 0 16px rgba(24,119,242,0.7)",   topPct: "0%",   leftPct: "50%" },
                      { icon: Instagram, color: "#E1306C", shadow: "0 0 16px rgba(225,48,108,0.7)",  topPct: "29%",  leftPct: "95%" },
                      { icon: Linkedin,  color: "#0A66C2", shadow: "0 0 16px rgba(10,102,194,0.7)",  topPct: "76%",  leftPct: "79%" },
                      { icon: Twitter,   color: "#1DA1F2", shadow: "0 0 16px rgba(29,161,242,0.7)",  topPct: "76%",  leftPct: "21%" },
                      { icon: Youtube,   color: "#FF0000", shadow: "0 0 16px rgba(255,0,0,0.7)",     topPct: "29%",  leftPct: "5%" },
                    ].map(({ icon: Icon, color, shadow, topPct, leftPct }) => (
                      <div
                        key={color}
                        className="animate-spin-orbit-reverse absolute"
                        style={{
                          top: topPct,
                          left: leftPct,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <div
                          className="w-11 h-11 rounded-full flex items-center justify-center shadow-xl"
                          style={{ backgroundColor: color, boxShadow: shadow }}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US + RESULTS ─────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* WHY CHOOSE US */}
          <Reveal>
            <ShineBorder borderRadius={20} borderWidth={1} color={["#ec4899", "#e1306c", "#f43f5e"]} className="w-full h-full">
              <div className="bg-white dark:bg-white/[0.02] rounded-2xl p-8 h-full">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </span>
                  WHY CHOOSE US
                </h3>
                <ul className="space-y-4">
                  {whyUs.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium">
                      <span className="w-2 h-2 rounded-full bg-pink-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ShineBorder>
          </Reveal>

          {/* RESULTS YOU CAN EXPECT */}
          <Reveal delay={0.1}>
            <ShineBorder borderRadius={20} borderWidth={1} color={["#f43f5e", "#fb923c", "#ec4899"]} className="w-full h-full">
              <div className="bg-white dark:bg-white/[0.02] rounded-2xl p-8 h-full">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </span>
                  RESULTS YOU CAN EXPECT
                </h3>
                <ul className="space-y-4">
                  {[
                    "3× increase in organic reach in 60 days",
                    "Higher engagement rate (likes, shares, saves)",
                    "Quality lead generation via DMs & ads",
                    "Brand authority & trust building",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium">
                      <Zap className="w-4 h-4 text-rose-500 flex-shrink-0" />
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
        <div className="absolute inset-0 bg-gradient-to-br from-pink-600 via-rose-600 to-red-600" />
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }}
        />
        <BlurBlob position={{ top: "10%", left: "10%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-white" opacityClass="opacity-10" />
        <BlurBlob position={{ top: "50%", left: "70%" }} size={{ width: "350px", height: "350px" }} colorClass="bg-white" opacityClass="opacity-8" />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <Reveal>
            <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase bg-white/20 text-white px-4 py-2 rounded-full mb-6">
              Ready to Grow?
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
              LET'S BUILD YOUR<br />SOCIAL MEDIA PRESENCE
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-rose-100 text-lg mb-10">
              Start your social media journey today and watch your brand grow across all major platforms.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button
                onClick={() => navigate("/contact")}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-white text-pink-600 font-black px-10 py-4 rounded-2xl shadow-2xl hover:shadow-white/25 transition-all"
              >
                Get Started <ChevronRight className="w-5 h-5" />
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
