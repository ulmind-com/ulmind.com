import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  HeartPulse,
  Music2,
  Building2,
  Briefcase,
  UserCheck,
  Plane,
  Truck,
  Pizza,
  Home,
  Trophy,
  Heart,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Zap,
  Globe,
  Shield,
  TrendingUp,
  Cpu,
  Layers,
} from "lucide-react";
import BlurBlob from "@/components/BlurBlob";
import { industries } from "@/components/Sections/IndustriesSection";

/* ── Reveal wrapper ──────────────────────── */
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children,
  delay = 0,
  className = "",
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
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

/* ── Simple Centered Grid Card ──────────────────── */
const GridCard: React.FC<{
  industry: (typeof industries)[0];
  index: number;
}> = ({ industry, index }) => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const Icon = industry.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: (index % 4) * 0.05, ease: "easeOut" }}
      onClick={() => navigate(`/industries/${industry.slug}`)}
      className="group cursor-pointer aspect-square sm:aspect-auto sm:h-48 w-full"
    >
      <div className="relative h-full w-full rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-[0_8px_30px_rgba(225,29,72,0.15)] transition-all duration-300 group-hover:-translate-y-2 group-hover:border-rose-500/30 dark:group-hover:border-red-500/30 overflow-hidden flex flex-col items-center justify-center p-6 text-center">
        
        {/* Hover Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-rose-50/50 to-transparent dark:from-rose-500/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Icon */}
        <div className="relative z-10 mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
          <Icon className="w-12 h-12 text-zinc-800 dark:text-zinc-200 group-hover:text-rose-600 dark:group-hover:text-red-500 transition-colors duration-300" strokeWidth={1.5} />
        </div>

        {/* Title */}
        <h3 className="relative z-10 text-base sm:text-lg font-black text-zinc-900 dark:text-white tracking-tight group-hover:text-rose-600 dark:group-hover:text-red-400 transition-colors duration-300">
          {industry.title}
        </h3>
      </div>
    </motion.div>
  );
};

/* ── Flipping Grid for Hero ──────────────────── */
const flipPatterns = [
  [0, 3, 6], // Col 1
  [2, 5, 8], // Col 3
  [1, 4, 7], // Col 2
  [0, 1, 2], // Row 1
  [6, 7, 8], // Row 3
  [3, 4, 5], // Row 2
];

const FlippingGridHero: React.FC = () => {
  const navigate = useNavigate();
  const [gridItems, setGridItems] = useState(industries.slice(0, 9));

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      const pattern = flipPatterns[step % flipPatterns.length];
      
      setGridItems(prev => {
        const next = [...prev];
        pattern.forEach((idx, i) => {
          // Find an industry not currently in the grid
          const available = industries.filter(ind => !next.some(c => c.slug === ind.slug));
          if (available.length > 0) {
            // Pick randomly from available
            const randomInd = available[Math.floor(Math.random() * available.length)];
            next[idx] = randomInd;
          }
        });
        return next;
      });
      step++;
    }, 3500); // Change every 3.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      animate={{ y: [0, -16, 0] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      className="grid grid-cols-3 gap-3"
    >
      {gridItems.map((ind, i) => {
        const Icon = ind.icon;
        return (
          <div key={i} className="aspect-square relative w-full h-full" style={{ perspective: "1500px" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={ind.slug}
                initial={{ rotateX: -90, opacity: 0, scale: 0.9 }}
                animate={{ 
                  rotateX: 0, 
                  opacity: 1, 
                  scale: 1,
                  transition: { duration: 0.6, ease: "easeOut" } 
                }}
                exit={{ 
                  rotateX: 90, 
                  opacity: 0, 
                  scale: 0.9,
                  transition: { duration: 0.6, ease: "easeIn" } 
                }}
                onClick={() => navigate(`/industries/${ind.slug}`)}
                className="absolute inset-0 group rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-white/10 shadow-sm hover:shadow-[0_8px_30px_rgba(225,29,72,0.25)] hover:border-rose-500/50 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors p-3 origin-center"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="w-10 h-10 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-rose-600 dark:text-red-500 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 text-center leading-tight group-hover:text-rose-600 dark:group-hover:text-red-400 transition-colors">
                  {ind.title}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        );
      })}
    </motion.div>
  );
};

/* ── Main Page ───────────────────────────── */
const IndustriesPage: React.FC = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  useEffect(() => {
    document.title = "Industries We Serve | ULMiND";
    return () => { document.title = "ULMiND"; };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300 overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-[80vh] flex items-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <BlurBlob position={{ top: "5%", left: "0%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-rose-500" opacityClass="opacity-15" />
        <BlurBlob position={{ top: "40%", left: "75%" }} size={{ width: "500px", height: "500px" }} colorClass="bg-red-400" opacityClass="opacity-10" />

        {/* Back button */}
        <motion.button
          onClick={() => navigate("/")}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-8 left-6 z-20 flex items-center gap-2 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:gap-3 transition-all duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </motion.button>

        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-14 items-center relative z-10">
          {/* LEFT text */}
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-rose-500/30 bg-rose-500/8 dark:bg-rose-500/10">
                <Globe className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-rose-600 dark:text-red-400 text-[10px] font-black tracking-[0.4em] uppercase">Industries We Serve</span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-black text-zinc-900 dark:text-white leading-none tracking-tighter uppercase mb-6">
                Sectors We
                <span className="block bg-gradient-to-r from-rose-600 via-red-500 to-pink-600 bg-clip-text text-transparent">
                  Transform
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8 max-w-lg font-medium">
                From education to entertainment, healthcare to hospitality — we craft precision-engineered digital solutions for every sector, backed by deep domain expertise and world-class engineering.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  { icon: Zap, label: "30+ Industries" },
                  { icon: Shield, label: "Domain Expert" },
                  { icon: TrendingUp, label: "Results-Driven" },
                  { icon: Globe, label: "Global Ready" },
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
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(225,29,72,0.4)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/contact")}
                  className="h-14 px-8 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-rose-600/30 uppercase tracking-widest flex items-center gap-2 transition-all duration-300"
                >
                  Start Your Project <ArrowRight className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03, borderColor: "rgba(225,29,72,0.6)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/services")}
                  className="h-14 px-8 border-2 border-zinc-300 dark:border-white/20 rounded-2xl font-black text-sm uppercase tracking-widest text-zinc-700 dark:text-zinc-300 hover:border-rose-500 dark:hover:border-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition-all duration-300"
                >
                  Our Services
                </motion.button>
              </div>
            </Reveal>
          </motion.div>

          {/* RIGHT — floating illustration grid */}
          <Reveal delay={0.3}>
            <FlippingGridHero />
          </Reveal>
        </div>
      </section>

      {/* ── INDUSTRY GRID ─────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <BlurBlob position={{ top: "30%", left: "85%" }} size={{ width: "500px", height: "500px" }} colorClass="bg-pink-400" opacityClass="opacity-8" />
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-rose-500/20 bg-rose-500/8">
              <span className="text-rose-600 dark:text-red-400 text-[10px] font-black tracking-[0.4em] uppercase">All Industries</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-4">
              Choose Your <span className="text-rose-600">Industry</span>
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto font-medium">
              Click on any industry to see how we approach, build, and deliver solutions tailored specifically for your sector.
            </p>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {industries.map((industry, i) => (
              <GridCard key={industry.slug} industry={industry} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY SECTOR-SPECIFIC ───────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <BlurBlob position={{ top: "20%", left: "5%" }} size={{ width: "500px", height: "500px" }} colorClass="bg-rose-400" opacityClass="opacity-10" />
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <div>
            <Reveal>
              <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-rose-500/20 bg-rose-500/8">
                <span className="text-rose-600 dark:text-red-400 text-[10px] font-black tracking-[0.4em] uppercase">Our Edge</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-8">
                Why Sector-Specific <span className="text-rose-600">Matters</span>
              </h2>
            </Reveal>
            <div className="space-y-4">
              {[
                { title: "Deep Domain Knowledge", desc: "We understand the unique challenges, regulations, and workflows of each industry." },
                { title: "Tailored Architecture", desc: "Every system is built from the ground up for your sector's specific needs — not adapted from a template." },
                { title: "Compliance & Security", desc: "Industry-specific compliance (HIPAA, PCI-DSS, FERPA) baked in from day one." },
                { title: "Proven Track Record", desc: "Hundreds of industry-specific projects delivered across 30+ sectors worldwide." },
              ].map((item, i) => (
                <Reveal key={i} delay={i * 0.07}>
                  <motion.div
                    whileHover={{ x: 8 }}
                    className="flex gap-4 p-5 rounded-2xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/50 dark:border-white/8 group cursor-default transition-all duration-300 hover:border-rose-500/30 dark:hover:border-red-500/30"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-600 to-red-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-rose-500/30">
                      <ChevronRight className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-zinc-900 dark:text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">{item.desc}</p>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Right stats */}
          <Reveal delay={0.2}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "30+", label: "Industries Served", icon: Globe },
                { num: "20+", label: "Projects Delivered", icon: Trophy },
                { num: "98%", label: "Client Satisfaction", icon: Heart },
                { num: "5★", label: "Average Rating", icon: Zap },
              ].map(({ num, label, icon: Icon }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-7 rounded-3xl bg-gradient-to-br from-rose-600/10 to-red-600/5 border border-rose-500/20 dark:border-red-500/15 text-center group hover:shadow-[0_4px_30px_rgba(225,29,72,0.2)] transition-all duration-300"
                >
                  <Icon className="w-7 h-7 text-rose-600 dark:text-red-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <p className="text-4xl font-black text-rose-600 dark:text-red-400 mb-1">{num}</p>
                  <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{label}</p>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TECHNOLOGY ARSENAL ───────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-900/50 relative overflow-hidden">
        <BlurBlob position={{ top: "10%", left: "70%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-pink-500" opacityClass="opacity-5" />
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-rose-500/20 bg-rose-500/8">
              <span className="text-rose-600 dark:text-red-400 text-[10px] font-black tracking-[0.4em] uppercase">Core Technologies</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-4">
              Tech That <span className="text-rose-600">Powers</span> Industries
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto font-medium">
              We leverage the most advanced technology stacks to deliver scalable, secure, and future-proof platforms.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Cpu,
                title: "Artificial Intelligence",
                desc: "Predictive analytics, automated workflows, and machine learning models tailored to your operational needs.",
              },
              {
                icon: Layers,
                title: "Cloud Infrastructure",
                desc: "Serverless architectures, microservices, and multi-cloud environments ensuring 99.99% uptime.",
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                desc: "Zero-trust architecture, automated threat detection, and military-grade encryption for your data.",
              },
            ].map((tech, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="group relative p-8 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200/60 dark:border-white/10 hover:border-rose-500/50 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <tech.icon className="w-10 h-10 text-rose-500 mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-3 relative z-10">{tech.title}</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed relative z-10">{tech.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950" />
              <div className="absolute inset-0 bg-gradient-to-r from-rose-600/25 via-red-600/10 to-pink-600/20" />
              <div className="absolute top-4 right-8 w-40 h-40 rounded-full bg-rose-500/20 blur-3xl" />
              <div className="absolute bottom-4 left-8 w-40 h-40 rounded-full bg-red-500/20 blur-3xl" />

              <div className="relative z-10 p-12 md:p-16 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white/10 border border-white/20">
                  <Zap className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-white/80 text-[10px] font-black tracking-[0.4em] uppercase">Ready to Build?</span>
                </div>

                <h2 className="text-4xl md:text-5xl xl:text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
                  Let's Build for
                  <span className="block bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
                    Your Industry
                  </span>
                </h2>

                <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto font-medium">
                  Tell us your industry and vision. We'll take it from there — with precision, passion, and expertise.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(225,29,72,0.5)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate("/contact")}
                    className="h-14 px-10 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white rounded-2xl font-black text-sm shadow-[0_0_20px_rgba(225,29,72,0.4)] uppercase tracking-widest border border-rose-500/30 flex items-center gap-2 justify-center transition-all duration-300"
                  >
                    Start Your Project <ArrowRight className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03, borderColor: "rgba(255,255,255,0.5)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate("/services")}
                    className="inline-flex items-center justify-center h-14 px-10 bg-white/5 hover:bg-white/10 border border-white/20 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 gap-2"
                  >
                    Explore Services
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

export default IndustriesPage;
