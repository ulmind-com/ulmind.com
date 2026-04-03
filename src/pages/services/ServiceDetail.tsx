import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Code, Smartphone, Cloud, Database, ShoppingCart,
  Cpu, Palette, PenTool, ArrowRight, CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BlurBlob from "@/components/BlurBlob";

/* Map slug → full service data */
const serviceMap: Record<string, {
  icon: React.ElementType;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  benefits: string[];
  color: string;
  glow: string;
}> = {
  "mobile-apps": {
    icon: Smartphone,
    title: "Mobile Apps",
    tagline: "Native & Cross-Platform Excellence",
    description: "Native and cross-platform mobile applications for iOS and Android using React Native and Flutter. We craft seamless, high-performance apps that users love.",
    features: ["Cross-Platform (iOS & Android)", "Native Performance", "App Store Ready", "Push Notifications", "Offline Support", "Biometric Auth"],
    benefits: ["Reach more users across all devices", "Faster time to market", "Consistent UX", "Lower development cost"],
    color: "from-blue-500 to-indigo-600",
    glow: "rgba(59,130,246,0.3)",
  },
  "cloud-solutions": {
    icon: Cloud,
    title: "Cloud Solutions",
    tagline: "Scalable Infrastructure, Zero Downtime",
    description: "Scalable cloud infrastructure and deployment solutions using AWS, Azure, and Google Cloud. We architect systems that grow with your business.",
    features: ["Auto Scaling", "High Availability", "Cost Optimized", "Security First", "CI/CD Pipelines", "Monitoring & Alerts"],
    benefits: ["99.99% uptime guarantee", "Pay only for what you use", "Global CDN reach", "Enterprise-grade security"],
    color: "from-cyan-500 to-sky-600",
    glow: "rgba(6,182,212,0.3)",
  },
  "backend-development": {
    icon: Database,
    title: "Backend Development",
    tagline: "Robust APIs. Rock-Solid Architecture.",
    description: "Robust server-side applications with secure APIs, databases, and microservices architecture. We build the backbone of your digital product.",
    features: ["RESTful & GraphQL APIs", "Database Design", "Microservices", "Security Focused", "Rate Limiting", "Real-time WebSockets"],
    benefits: ["Secure & scalable APIs", "Clean code structure", "Comprehensive documentation", "Long-term maintainability"],
    color: "from-orange-500 to-amber-600",
    glow: "rgba(249,115,22,0.3)",
  },
  "ecommerce-solutions": {
    icon: ShoppingCart,
    title: "E-commerce Solutions",
    tagline: "Sell More. Convert Better.",
    description: "Complete online store solutions with payment integration, inventory management, and analytics. We build stores that drive real revenue.",
    features: ["Payment Gateway Integration", "Inventory System", "Order Management", "Analytics Dashboard", "Multi-currency", "SEO Ready"],
    benefits: ["Higher conversion rates", "Seamless checkout flow", "Real-time inventory", "Detailed analytics"],
    color: "from-green-500 to-emerald-600",
    glow: "rgba(16,185,129,0.3)",
  },
  "ai-machine-learning": {
    icon: Cpu,
    title: "AI & Machine Learning",
    tagline: "Intelligence That Drives Results",
    description: "Automate workflows and gain intelligent insights with integrated AI agents and machine learning. We make AI practical for your business.",
    features: ["Conversational AI Agents", "Process Automation", "Predictive Analytics", "Real-Time Decision Making", "NLP Models", "Computer Vision"],
    benefits: ["Automate repetitive tasks", "Data-driven decisions", "24/7 AI support", "Competitive advantage"],
    color: "from-violet-500 to-purple-600",
    glow: "rgba(139,92,246,0.3)",
  },
  "graphics-design-branding": {
    icon: Palette,
    title: "Graphics Design & Branding",
    tagline: "Visuals That Tell Your Story",
    description: "Crafting high-impact visual identities and premium UI/UX designs that elevate your brand's digital presence. We make you unforgettable.",
    features: ["Logo & Brand Identity", "UI/UX Visual Design", "Motion Graphics", "Marketing Collaterals", "Brand Guidelines", "Social Media Assets"],
    benefits: ["Memorable brand identity", "Consistent visual language", "Premium design quality", "Stand out from competition"],
    color: "from-pink-500 to-rose-600",
    glow: "rgba(236,72,153,0.3)",
  },
  "content-writing-strategy": {
    icon: PenTool,
    title: "Content Writing & Strategy",
    tagline: "Words That Convert & Inspire",
    description: "Creating persuasive, SEO-optimized narratives that engage audiences and drive meaningful business growth. We tell your story powerfully.",
    features: ["SEO Content Writing", "Technical Copywriting", "Brand Storytelling", "Social Media Strategy", "Email Campaigns", "Blog Management"],
    benefits: ["Higher organic rankings", "Engaged audience", "Consistent brand voice", "Measurable ROI"],
    color: "from-teal-500 to-emerald-600",
    glow: "rgba(20,184,166,0.3)",
  },
  "ui-ux-design": {
    icon: Palette,
    title: "UI/UX Design",
    tagline: "Experiences People Remember",
    description: "User-centered design solutions that create engaging and intuitive digital experiences. We design for humans, optimized for business.",
    features: ["User Research", "Wireframing", "Prototyping", "Design Systems", "Accessibility", "Usability Testing"],
    benefits: ["Reduced user drop-off", "Higher engagement", "Faster development", "Design consistency"],
    color: "from-fuchsia-500 to-pink-600",
    glow: "rgba(217,70,239,0.3)",
  },
};

const ServiceDetail: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const service = serviceId ? serviceMap[serviceId] : null;

  useEffect(() => {
    if (service) {
      document.title = `${service.title} | ULMiND`;
    }
    return () => { document.title = "ULMiND"; };
  }, [service]);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-black text-zinc-900 dark:text-white mb-4">Service Not Found</h2>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const Icon = service.icon;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300 overflow-x-hidden">
      {/* HERO */}
      <section className="relative min-h-[80vh] flex items-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <BlurBlob position={{ top: "10%", left: "5%" }} size={{ width: "500px", height: "500px" }} colorClass="bg-rose-400" opacityClass="opacity-20" />
        <BlurBlob position={{ top: "50%", left: "70%" }} size={{ width: "400px", height: "400px" }} colorClass="bg-purple-400" opacityClass="opacity-15" />

        <div className="max-w-5xl mx-auto w-full text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${service.color} mb-8 shadow-2xl mx-auto`}
            style={{ boxShadow: `0 20px 60px ${service.glow}` }}
          >
            <Icon className="w-10 h-10 text-white" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
          >
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-rose-500/30 bg-rose-500/10 backdrop-blur-md">
              <span className="text-rose-600 dark:text-red-400 text-[10px] font-black tracking-[0.4em] uppercase">Service</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter leading-none mb-4">
              {service.title}
            </h1>
            <p className={`text-xl md:text-2xl font-bold bg-gradient-to-r ${service.color} bg-clip-text text-transparent mb-6`}>
              {service.tagline}
            </p>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10">
              {service.description}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                className={`h-14 px-10 bg-gradient-to-r ${service.color} text-white rounded-2xl font-black text-sm uppercase tracking-widest border-0 shadow-2xl`}
                onClick={() => navigate("/contact")}
              >
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-10 border-zinc-300 dark:border-white/20 rounded-2xl font-black text-sm uppercase tracking-widest"
                onClick={() => navigate("/")}
              >
                Back to Services
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES + BENEFITS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
          {/* Features */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/50 dark:border-white/10 h-full">
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-6">
                What's Included
              </h2>
              <ul className="space-y-4">
                {service.features.map((f, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300 font-semibold"
                  >
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${service.color} flex items-center justify-center flex-shrink-0`}>
                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                    </div>
                    {f}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className={`p-8 rounded-3xl bg-gradient-to-br ${service.color} text-white h-full shadow-2xl`}
              style={{ boxShadow: `0 20px 60px ${service.glow}` }}>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-6">Why This Service?</h2>
              <ul className="space-y-5">
                {service.benefits.map((b, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 text-white/90 font-semibold"
                  >
                    <ArrowRight className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    {b}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-800" />
            <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-20`} />
            <div className="relative z-10 p-12">
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">
                Let's Get Started
              </h2>
              <p className="text-zinc-400 mb-8">Contact us today and let's discuss your project.</p>
              <Button
                size="lg"
                className={`h-14 px-10 bg-gradient-to-r ${service.color} text-white rounded-2xl font-black text-sm uppercase tracking-widest border-0`}
                onClick={() => navigate("/contact")}
              >
                Contact Us Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
