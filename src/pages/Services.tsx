import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import {
  Code, Smartphone, Cloud, Database, ShoppingCart, Palette,
  ArrowRight, CheckCircle, Cpu, PenTool, Share2, Sparkles,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShineBorder } from "@/components/ui/shine-border";
import BlurBlob from "@/components/BlurBlob";

// ── Shared services data (same as ServicesSection) ─────────────────────────
const services = [
  {
    icon: Code, title: "Web Development", slug: "web-development",
    description: "Custom web applications built with modern frameworks like React, Next.js, and Node.js.",
    features: ["Responsive Design", "SEO Optimized", "Performance Focused", "Scalable Architecture"],
    gradient: "from-cyan-500 to-blue-600", glow: "rgba(6,182,212,0.35)",
    border: ["#06B6D4", "#3B82F6", "#8B5CF6"],
  },
  {
    icon: Smartphone, title: "Mobile App Development", slug: "mobile-apps",
    description: "Native and cross-platform mobile applications for iOS and Android using React Native and Flutter.",
    features: ["Cross-Platform", "Native Performance", "App Store Ready", "Push Notifications"],
    gradient: "from-orange-500 to-rose-500", glow: "rgba(249,115,22,0.35)",
    border: ["#F97316", "#EF4444", "#EC4899"],
  },
  {
    icon: Cloud, title: "Cloud Solutions", slug: "cloud",
    description: "Scalable cloud infrastructure and deployment using AWS, Azure, and Google Cloud.",
    features: ["Auto Scaling", "High Availability", "Cost Optimized", "Security First"],
    gradient: "from-teal-400 to-emerald-500", glow: "rgba(20,184,166,0.35)",
    border: ["#14B8A6", "#10B981", "#06B6D4"],
  },
  {
    icon: Database, title: "Backend Development", slug: "backend-development",
    description: "Robust server-side applications with secure APIs, databases, and microservices architecture.",
    features: ["RESTful APIs", "Database Design", "Microservices", "Security Focused"],
    gradient: "from-violet-500 to-purple-600", glow: "rgba(139,92,246,0.35)",
    border: ["#8B5CF6", "#A855F7", "#EC4899"],
  },
  {
    icon: ShoppingCart, title: "E-commerce Solutions", slug: "ecommerce-solutions",
    description: "Complete online store solutions with payment integration, inventory management, and analytics.",
    features: ["Payment Gateway", "Inventory System", "Order Management", "Analytics Dashboard"],
    gradient: "from-green-500 to-lime-500", glow: "rgba(34,197,94,0.35)",
    border: ["#22C55E", "#84CC16", "#10B981"],
  },
  {
    icon: Cpu, title: "AI & Machine Learning", slug: "ai-machine-learning",
    description: "Automate workflows and gain intelligent insights with integrated AI agents and ML.",
    features: ["Conversational AI", "Process Automation", "Predictive Analytics", "Real-Time Decisions"],
    gradient: "from-sky-500 to-indigo-600", glow: "rgba(14,165,233,0.35)",
    border: ["#0EA5E9", "#6366F1", "#8B5CF6"],
  },
  {
    icon: Palette, title: "Graphics Design & Branding", slug: "graphics-design-branding",
    description: "Crafting high-impact visual identities and premium UI/UX designs that elevate your brand.",
    features: ["Logo & Brand Identity", "UI/UX Visual Design", "Motion Graphics", "Marketing Collaterals"],
    gradient: "from-fuchsia-500 to-pink-600", glow: "rgba(217,70,239,0.35)",
    border: ["#D946EF", "#EC4899", "#F43F5E"],
  },
  {
    icon: PenTool, title: "Content Writing & Strategy", slug: "content-writing-strategy",
    description: "Persuasive, SEO-optimized narratives that engage audiences and drive meaningful growth.",
    features: ["SEO Content Writing", "Technical Copywriting", "Brand Storytelling", "Social Media Strategy"],
    gradient: "from-amber-500 to-orange-500", glow: "rgba(245,158,11,0.35)",
    border: ["#F59E0B", "#F97316", "#EF4444"],
  },
  {
    icon: Palette, title: "UI/UX Design", slug: "ui-ux-design",
    description: "User-centered design solutions that create engaging and intuitive digital experiences.",
    features: ["User Research", "Wireframing", "Prototyping", "Design Systems"],
    gradient: "from-rose-500 to-pink-500", glow: "rgba(244,63,94,0.35)",
    border: ["#F43F5E", "#EC4899", "#D946EF"],
  },
  {
    icon: Share2, title: "Social Media Management", slug: "social-media-management",
    description: "Grow your brand online with data-driven social strategies and performance-focused campaigns.",
    features: ["Content Strategy", "Ad Campaigns", "Analytics & Reporting", "Community Management"],
    gradient: "from-pink-500 to-rose-600", glow: "rgba(236,72,153,0.35)",
    border: ["#EC4899", "#E1306C", "#F43F5E"],
  },
];

// ── 3D tilt card (same technique as ServicesSection) ──────────────────────
const ServiceCard = ({ service, index }: { service: typeof services[0]; index: number }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const Icon = service.icon;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["14deg", "-14deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-14deg", "14deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mX = e.clientX - rect.left;
    const mY = e.clientY - rect.top;
    glowX.set(mX); glowY.set(mY);
    x.set((mX / rect.width) - 0.5);
    y.set((mY / rect.height) - 0.5);
  };

  const glowStyle = useMotionTemplate`radial-gradient(480px circle at ${glowX}px ${glowY}px, ${service.glow}, transparent 55%)`;
  const maskStyle = useMotionTemplate`radial-gradient(240px circle at ${glowX}px ${glowY}px, black 0%, transparent 100%)`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: (index % 6) * 0.08, ease: "easeOut" }}
      style={{ perspective: "1500px" }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative rounded-[2rem] cursor-default h-full"
      >
        <ShineBorder
          borderRadius={32}
          borderWidth={1.5}
          color={service.border}
          className="bg-white/5 overflow-hidden h-full w-full !p-0 !text-inherit !bg-transparent border-none"
        >
          {/* Glow overlay */}
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 group-hover:opacity-100 transition duration-300 z-0"
            style={{ background: glowStyle }}
          />
          {/* Cursor border */}
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-[2rem] border-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            style={{
              borderColor: service.border[0],
              maskImage: maskStyle,
              WebkitMaskImage: maskStyle,
            }}
          />

          {/* Card body */}
          <div
            style={{ transform: "translateZ(60px)" }}
            className="relative z-20 p-8 flex flex-col h-full bg-white dark:bg-zinc-900/60 rounded-[2rem]"
          >
            {/* Icon badge */}
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}
              style={{ boxShadow: `0 8px 24px ${service.glow}` }}
            >
              <Icon className="w-7 h-7 text-white" />
            </div>

            <h3 className="text-xl font-black mb-3 text-zinc-900 dark:text-white tracking-tight uppercase leading-tight">
              {service.title}
            </h3>

            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-6 flex-grow">
              {service.description}
            </p>

            <ul className="space-y-2 mb-8">
              {service.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs font-bold text-zinc-500 dark:text-zinc-400 tracking-wide">
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: service.border[0] }} />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigate(`/services/${service.slug}`)}
              className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest text-white bg-gradient-to-r ${service.gradient} opacity-90 hover:opacity-100 hover:scale-[1.02] transition-all duration-300 shadow-md`}
              style={{ boxShadow: `0 4px 20px ${service.glow}` }}
            >
              Explore Service <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </ShineBorder>
      </motion.div>
    </motion.div>
  );
};

// ── Stats row ─────────────────────────────────────────────────────────────
const stats = [
  { value: "10+", label: "Services Offered" },
  { value: "15+", label: "Projects Delivered" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "5+", label: "Years Experience" },
];

// ── Page ──────────────────────────────────────────────────────────────────
export default function ServicesPage() {
  const navigate = useNavigate();
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className="min-h-screen bg-white dark:bg-[#07070e] overflow-x-hidden">

      {/* ── BACK BUTTON ───────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <motion.button
          onClick={() => navigate(-1)}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-sm font-semibold text-rose-600 dark:text-red-400 hover:gap-3 transition-all duration-200 group"
        >
          <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </motion.button>
      </div>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative py-20 text-center overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(225,29,72,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(225,29,72,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <BlurBlob position={{ top: "30%", left: "15%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-rose-400" opacityClass="opacity-10" />
        <BlurBlob position={{ top: "50%", left: "75%" }} size={{ width: "500px", height: "500px" }} colorClass="bg-pink-400" opacityClass="opacity-8" />

        <div ref={heroRef} className="relative max-w-5xl mx-auto px-6 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 text-xs font-black tracking-[0.3em] uppercase bg-rose-500/10 dark:bg-red-500/10 text-rose-600 dark:text-red-400 px-5 py-2 rounded-full border border-rose-500/20 dark:border-red-500/20 mb-8">
              <Sparkles className="w-3.5 h-3.5" /> Everything We Do
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-8xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase leading-none mb-6"
          >
            ALL OUR{" "}
            <span className="bg-gradient-to-r from-rose-600 via-pink-500 to-red-500 bg-clip-text text-transparent">
              SERVICES
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            From web to social — every capability you need to build, scale, and dominate your digital presence. One team. Infinite possibilities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={heroInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-32 h-1.5 bg-gradient-to-r from-transparent via-rose-600 to-transparent mx-auto rounded-full shadow-[0_0_30px_rgba(225,29,72,0.7)]"
          />
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <section className="relative py-12 border-y border-zinc-100 dark:border-zinc-800/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-black bg-gradient-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent">
                  {s.value}
                </p>
                <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mt-1 uppercase tracking-widest">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ALL SERVICE CARDS ─────────────────────────────────── */}
      <section className="relative py-24">
        <BlurBlob position={{ top: "20%", left: "5%" }} size={{ width: "500px", height: "500px" }} colorClass="bg-rose-400" opacityClass="opacity-8" />
        <BlurBlob position={{ top: "70%", left: "85%" }} size={{ width: "500px", height: "500px" }} colorClass="bg-pink-400" opacityClass="opacity-6" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-14"
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-rose-500/30" />
            <span className="text-xs font-black tracking-[0.3em] uppercase text-rose-600 dark:text-red-400 whitespace-nowrap">
              {services.length} Services Available
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-rose-500/30" />
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {services.map((s, i) => (
              <ServiceCard key={s.slug} service={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section className="relative py-28 overflow-hidden">
        {/* Radial gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-600 via-pink-600 to-red-700" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <BlurBlob position={{ top: "20%", left: "10%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-white" opacityClass="opacity-10" />

        <div className="relative max-w-3xl mx-auto px-6 text-center z-10">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-xs font-black tracking-[0.3em] uppercase bg-white/20 text-white px-5 py-2 rounded-full mb-8"
          >
            Ready to Get Started?
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white leading-tight mb-4 uppercase tracking-tighter"
          >
            LET'S BUILD<br />SOMETHING GREAT
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-rose-100 text-lg mb-10"
          >
            Tell us your vision. We'll make it real — beautifully and on time.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/contact")}
              className="flex items-center gap-2 bg-white text-rose-600 font-black px-10 py-4 rounded-2xl shadow-2xl hover:shadow-white/20 transition-all text-sm uppercase tracking-widest"
            >
              Start Your Project <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/")}
              className="text-white border-2 border-white/30 font-bold px-8 py-4 rounded-2xl hover:bg-white/10 transition-all text-sm uppercase tracking-widest"
            >
              Back to Home
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
