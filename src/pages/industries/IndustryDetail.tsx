import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  TrendingUp,
  Shield,
  Zap,
  Layers,
  ArrowRight,
  Cpu,
  Clock,
  Star,
  Users,
  Activity,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BlurBlob from "@/components/BlurBlob";
import { industries } from "@/components/Sections/IndustriesSection";

/* ─── Shared Content Blocks ───────────────────────────── */
const workProcess = [
  {
    step: "01",
    title: "Discovery & Analysis",
    desc: "We dive deep into your industry's specific challenges, understanding your audience, competitors, and core business objectives to craft a tailored strategy.",
  },
  {
    step: "02",
    title: "Architecture & Design",
    desc: "Our architects map out scalable systems while our designers create intuitive, premium UI/UX that aligns perfectly with your brand identity.",
  },
  {
    step: "03",
    title: "Agile Development",
    desc: "We build using modern, robust tech stacks in two-week sprints. You get continuous visibility, daily updates, and rapid iterations.",
  },
  {
    step: "04",
    title: "Rigorous QA & Security",
    desc: "Every module undergoes strict automated and manual testing, ensuring zero vulnerabilities and perfect performance under heavy load.",
  },
  {
    step: "05",
    title: "Deployment & Scaling",
    desc: "Seamless zero-downtime deployment. We continuously monitor performance and scale infrastructure as your user base grows.",
  },
];

const dailyImprovements = [
  "Daily Standups & Progress Tracking",
  "Continuous Integration & Deployment (CI/CD)",
  "Real-time Performance Monitoring",
  "User Feedback Loop Integration",
  "Weekly Code Reviews & Refactoring",
  "Proactive Security Patching",
];

/* ─── Animated Wrapper ───────────────────────────────── */
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

/* ─── Main Page Component ────────────────────────────── */
const IndustryDetail: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const industry = industries.find((ind) => ind.slug === slug);
  const Icon = industry?.icon || Globe;

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    if (industry) {
      document.title = `${industry.title} Industry Solutions | ULMiND`;
    } else {
      navigate("/industries");
    }
    window.scrollTo(0, 0);
  }, [industry, navigate]);

  if (!industry) return null;

  // Get all other industries (29 items)
  const otherIndustries = industries.filter((ind) => ind.slug !== slug);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300 overflow-x-hidden">
      
      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen md:min-h-[90vh] flex items-center pt-28 pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <BlurBlob position={{ top: "10%", left: "5%" }} size={{ width: "500px", height: "500px" }} colorClass="bg-rose-400" opacityClass="opacity-20" />
        <BlurBlob position={{ top: "50%", left: "70%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-red-400" opacityClass="opacity-15" />

        <motion.button
          onClick={() => navigate("/industries")}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-8 left-6 z-20 flex items-center gap-2 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:gap-3 transition-all duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          All Industries
        </motion.button>

        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-10 md:gap-16 items-center relative z-10 mt-6 md:mt-0">
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-rose-500/30 bg-rose-500/10 backdrop-blur-md">
                <Icon className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-rose-600 dark:text-red-400 text-[10px] font-black tracking-[0.4em] uppercase">{industry.title} Solutions</span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black text-zinc-900 dark:text-white leading-none tracking-tighter uppercase mb-6">
                Transforming
                <span className="block bg-gradient-to-r from-rose-600 via-red-500 to-pink-600 bg-clip-text text-transparent">
                  {industry.title}
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8 max-w-lg font-medium">
                {industry.description} We build robust, scalable, and ultra-premium digital solutions tailored precisely for the {industry.title.toLowerCase()} sector.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="flex flex-wrap gap-4 mb-10">
                <Button
                  size="lg"
                  className="h-14 px-8 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-rose-600/30 uppercase tracking-widest"
                  onClick={() => navigate("/contact")}
                >
                  Start Your Project <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </Reveal>
          </motion.div>

          <Reveal delay={0.3}>
            <motion.div
              animate={{ y: [0, -18, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="flex justify-center perspective-1000 mt-10 md:mt-0"
            >
              <div className="w-full max-w-sm md:max-w-md aspect-square rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-500/10 dark:to-red-500/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-rose-100/50 dark:from-rose-900/20 to-transparent" />
                <Icon className="w-32 h-32 md:w-48 md:h-48 text-rose-500 dark:text-red-500 drop-shadow-[0_20px_40px_rgba(225,29,72,0.3)]" strokeWidth={1} />
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── CORE CAPABILITIES ── */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <BlurBlob position={{ top: "30%", left: "10%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-rose-500" opacityClass="opacity-5" />
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-12 md:mb-16">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-rose-500/20 bg-rose-500/8">
              <span className="text-rose-600 dark:text-red-400 text-[10px] font-black tracking-[0.4em] uppercase">Core Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-4">
              Built for <span className="text-rose-600">Scale</span>
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto font-medium">
              We engineer platforms that don't just solve today's problems, but anticipate tomorrow's challenges in the {industry.title.toLowerCase()} sector.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Custom Architecture", desc: "Purpose-built architectures designed to handle industry-specific workloads and high-concurrency traffic without breaking a sweat.", icon: Layers },
              { title: "Seamless Integration", desc: "API-first design allows fluid integration with existing legacy systems, third-party services, and IoT devices.", icon: Zap },
              { title: "Data Intelligence", desc: "Advanced analytics and real-time dashboards that turn raw data into actionable business intelligence.", icon: TrendingUp },
              { title: "Bank-Grade Security", desc: "End-to-end encryption, regular vulnerability assessments, and compliance with global security standards.", icon: Shield },
              { title: "Cloud Native", desc: "Optimized for AWS, GCP, and Azure to ensure dynamic scaling and minimal latency worldwide.", icon: Globe },
              { title: "Rapid Iteration", desc: "CI/CD pipelines that allow for continuous deployment of new features without disrupting active users.", icon: Activity },
            ].map((feature, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="group relative p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-white/10 hover:border-rose-500/30 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl md:rounded-3xl" />
                  <feature.icon className="w-8 h-8 text-rose-500 mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-3 relative z-10">{feature.title}</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed relative z-10">{feature.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW WE WORK ── */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-900/50 relative">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-6">
              How We <span className="text-rose-600">Work</span>
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-lg">
              Our proven methodology ensures we deliver world-class {industry.title.toLowerCase()} platforms on time, every time.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workProcess.map((step, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-rose-500/30 transition-all duration-300 h-full group">
                  <div className="text-4xl md:text-5xl font-black text-rose-500/10 dark:text-rose-500/20 mb-4 group-hover:text-rose-500/20 dark:group-hover:text-rose-500/30 transition-colors">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-3">{step.title}</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── DAILY IMPROVEMENTS ── */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <Reveal>
              <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-rose-500/20 bg-rose-500/10">
                <span className="text-rose-600 dark:text-red-400 text-[10px] font-black tracking-[0.4em] uppercase">Day to Day</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-8">
                How We Improve <span className="text-rose-600">Daily</span>
              </h2>
            </Reveal>
            <div className="space-y-4">
              {dailyImprovements.map((item, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <motion.div
                    whileHover={{ x: 8 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/50 dark:border-white/5 group cursor-default"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-red-500 flex items-center justify-center flex-shrink-0">
                      <Activity className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">{item}</span>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.2}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Uptime Guaranteed", icon: Zap },
                { label: "Data Security", icon: Shield },
                { label: "Global Scalability", icon: Globe },
                { label: "User Centric", icon: Users },
              ].map(({ label, icon: Icon }, i) => (
                <div key={i} className="aspect-square rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-white/10 flex flex-col items-center justify-center p-6 text-center hover:border-rose-500/50 transition-colors duration-300">
                  <Icon className="w-10 h-10 text-rose-500 mb-4" />
                  <span className="font-bold text-zinc-900 dark:text-white">{label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SUGGESTED INDUSTRIES (MARQUEE) ── */}
      <section className="py-16 md:py-24 bg-zinc-50 dark:bg-[#121214] relative overflow-hidden">
        <style>
          {`
            @keyframes infinite-scroll {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }
            .animate-infinite-scroll {
              animation: infinite-scroll 80s linear infinite;
              width: max-content;
            }
            .marquee-container:hover .animate-infinite-scroll {
              animation-play-state: paused;
            }
          `}
        </style>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-12 md:mb-16">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-rose-500/20 bg-rose-500/8">
              <span className="text-rose-600 dark:text-red-400 text-[10px] font-black tracking-[0.4em] uppercase">Explore More</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-4">
              Other <span className="text-rose-600">Sectors</span> We Serve
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto font-medium">
              Discover how we drive innovation and build scalable platforms across various other industries.
            </p>
          </Reveal>
        </div>

        {/* Marquee Container */}
        <div className="relative w-full marquee-container py-4">
          {/* Fading Edges */}
          <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-zinc-50 dark:from-[#121214] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-zinc-50 dark:from-[#121214] to-transparent z-10 pointer-events-none" />
          
          <div className="flex gap-4 sm:gap-6 animate-infinite-scroll px-4 sm:px-6">
            {[...otherIndustries, ...otherIndustries].map((ind, i) => {
              const SugIcon = ind.icon;
              return (
                <div key={`${ind.slug}-${i}`} className="w-[160px] sm:w-[200px] flex-shrink-0">
                  <div
                    onClick={() => navigate(`/industries/${ind.slug}`)}
                    className="group cursor-pointer aspect-square w-full block"
                  >
                    <div className="relative h-full w-full rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-[0_8px_30px_rgba(225,29,72,0.15)] transition-all duration-300 group-hover:-translate-y-2 group-hover:border-rose-500/30 dark:group-hover:border-red-500/30 overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6 text-center">
                      <div className="absolute inset-0 bg-gradient-to-b from-rose-50/50 to-transparent dark:from-rose-500/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative z-10 mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                        <SugIcon className="w-8 h-8 sm:w-12 sm:h-12 text-zinc-800 dark:text-zinc-200 group-hover:text-rose-600 dark:group-hover:text-red-500 transition-colors duration-300" strokeWidth={1.5} />
                      </div>

                      <h3 className="relative z-10 text-xs sm:text-sm md:text-base font-black text-zinc-900 dark:text-white tracking-tight group-hover:text-rose-600 dark:group-hover:text-red-400 transition-colors duration-300 leading-tight">
                        {ind.title}
                      </h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal delay={0.2} className="text-center mt-12 md:mt-16">
            <Button
              variant="outline"
              className="rounded-full border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white px-8 py-6 h-auto text-sm font-bold uppercase tracking-wider transition-colors"
              onClick={() => navigate("/industries")}
            >
              View All Industries
            </Button>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="relative rounded-[2rem] md:rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950" />
              <div className="absolute inset-0 bg-gradient-to-r from-rose-600/25 via-red-600/10 to-pink-600/20" />
              <div className="absolute top-4 right-8 w-40 h-40 rounded-full bg-rose-500/20 blur-3xl" />
              <div className="absolute bottom-4 left-8 w-40 h-40 rounded-full bg-red-500/20 blur-3xl" />

              <div className="relative z-10 px-6 py-12 sm:p-12 md:p-16 text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
                  Ready to Disrupt
                  <span className="block bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent mt-2">
                    {industry.title}?
                  </span>
                </h2>

                <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto font-medium">
                  Let's engineer a solution that puts you years ahead of the competition.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="h-14 px-10 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white rounded-2xl font-black text-sm shadow-[0_0_20px_rgba(225,29,72,0.4)] uppercase tracking-widest border border-rose-500/30 transition-all duration-300 hover:scale-105"
                    onClick={() => navigate("/contact")}
                  >
                    Discuss Your Project <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default IndustryDetail;
