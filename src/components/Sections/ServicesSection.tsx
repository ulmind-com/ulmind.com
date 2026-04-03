import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Code,
  Smartphone,
  Cloud,
  Database,
  ShoppingCart,
  Palette,
  ArrowRight,
  CheckCircle,
  Cpu,
  PenTool,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import BlurBlob from "@/components/BlurBlob";
import { ShineBorder } from "@/components/ui/shine-border";

const services = [
  { icon: Code, title: "Web Development", slug: "web-development", description: "Custom web applications built with modern frameworks like React, Next.js, and Node.js", features: ["Responsive Design", "SEO Optimized", "Performance Focused", "Scalable Architecture"] },
  { icon: Smartphone, title: "Mobile Apps", slug: "mobile-apps", description: "Native and cross-platform mobile applications for iOS and Android using React Native and Flutter", features: ["Cross-Platform", "Native Performance", "App Store Ready", "Push Notifications"] },
  { icon: Cloud, title: "Cloud Solutions", slug: "cloud", description: "Scalable cloud infrastructure and deployment solutions using AWS, Azure, and Google Cloud", features: ["Auto Scaling", "High Availability", "Cost Optimized", "Security First"] },
  { icon: Database, title: "Backend Development", slug: "backend-development", description: "Robust server-side applications with secure APIs, databases, and microservices architecture", features: ["RESTful APIs", "Database Design", "Microservices", "Security Focused"] },
  { icon: ShoppingCart, title: "E-commerce Solutions", slug: "ecommerce-solutions", description: "Complete online store solutions with payment integration, inventory management, and analytics", features: ["Payment Gateway", "Inventory System", "Order Management", "Analytics Dashboard"] },
  { icon: Cpu, title: "AI & Machine Learning", slug: "ai-machine-learning", description: "Automate workflows and gain intelligent insights with integrated AI agents and machine learning.", features: ["Conversational AI", "Process Automation", "Predictive Analytics", "Real-Time Decision Making"] },
  { icon: Palette, title: "Graphics Design & Branding", slug: "graphics-design-branding", description: "Crafting high-impact visual identities and premium UI/UX designs that elevate your brand's digital presence.", features: ["Logo & Brand Identity", "UI/UX Visual Design", "Motion Graphics", "Marketing Collaterals"] },
  { icon: PenTool, title: "Content Writing & Strategy", slug: "content-writing-strategy", description: "Creating persuasive, SEO-optimized narratives that engage audiences and drive meaningful business growth.", features: ["SEO Content Writing", "Technical Copywriting", "Brand Storytelling", "Social Media Strategy"] },
  { icon: Palette, title: "UI/UX Design", slug: "ui-ux-design", description: "User-centered design solutions that create engaging and intuitive digital experiences", features: ["User Research", "Wireframing", "Prototyping", "Design Systems"] },
];

const ServiceCard = ({ service, index, inView }) => {
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const Icon = service.icon;
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Use framer-motion values instead of React state for 60fps performance without re-renders
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mX = e.clientX - rect.left;
    const mY = e.clientY - rect.top;
    glowX.set(mX);
    glowY.set(mY);
    x.set((mX / rect.width) - 0.5);
    y.set((mY / rect.height) - 0.5);
  };

  const glowStyle = useMotionTemplate`radial-gradient(500px circle at ${glowX}px ${glowY}px, var(--glow-color), transparent 50%)`;
  const maskStyle = useMotionTemplate`radial-gradient(250px circle at ${glowX}px ${glowY}px, black 0%, transparent 100%)`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      style={{ perspective: "1500px" }}
      className="transform-gpu will-change-transform"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative rounded-[2rem] transition-all duration-200 cursor-default shadow-2xl h-full transform-gpu will-change-transform"
      >
        <ShineBorder
          borderRadius={32}
          borderWidth={1.5}
          color={["#FF007F", "#39FF14", "#00FFFF"]}
          className="bg-white/10 dark:bg-white/5 backdrop-blur-xl overflow-hidden h-full w-full !p-0 !text-inherit !bg-transparent group-hover:bg-white/10 dark:group-hover:bg-white/5 border-none transform-gpu will-change-transform"
        >
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 group-hover:opacity-100 transition duration-300 z-0"
            style={{ background: glowStyle }}
          />
          <style dangerouslySetInnerHTML={{ __html: `
            :root { --glow-color: rgba(225, 29, 72, 0.15); } 
            .dark { --glow-color: rgba(255, 0, 0, 0.25); } 
          `}} />

          <motion.div
            className="pointer-events-none absolute -inset-px rounded-[2rem] border-[2.5px] border-rose-600 dark:border-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            style={{
              maskImage: maskStyle,
              WebkitMaskImage: maskStyle,
            }}
          />

          <div style={{ transform: "translateZ(70px)" }} className="relative z-20 p-8 text-left w-full h-full flex flex-col">
            <div className="text-rose-600 dark:text-red-500 mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]">
              <Icon className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black mb-4 text-zinc-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-red-500 transition-colors tracking-tight uppercase flex-shrink-0">
              {service.title}
            </h3>

            <p className="text-zinc-600 dark:text-zinc-400 mb-6 text-sm leading-relaxed font-medium flex-grow">
              {service.description}
            </p>

            <ul className="space-y-3 mb-8 flex-shrink-0">
              {service.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 font-bold tracking-wide">
                  <CheckCircle className="w-4 h-4 text-rose-600 dark:text-red-600 flex-shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Button
              variant="outline"
              className="w-full h-12 border-black/10 dark:border-white/20 hover:border-rose-600 dark:hover:border-red-600 hover:bg-rose-600 dark:hover:bg-red-600 hover:text-white transition-all duration-300 rounded-xl font-black text-xs uppercase tracking-widest flex-shrink-0"
              onClick={() => navigate(`/services/${service.slug}`)}
            >
              Learn More <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </ShineBorder>
      </motion.div>
    </motion.div>
  );
};

export const ServicesSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const navigate = useNavigate();

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      <BlurBlob position={{ top: "20%", left: "80%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-pink-400" opacityClass="opacity-20" />
      <BlurBlob position={{ top: "80%", left: "20%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-yellow-300" opacityClass="opacity-20" />
      <div className="max-w-7xl mx-auto z-10 relative">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-20">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-rose-500/20 dark:border-red-500/20 bg-rose-500/5 dark:bg-red-500/10 backdrop-blur-md">
            <span className="text-rose-600 dark:text-red-500 text-[10px] font-black tracking-[0.4em] uppercase">Expertise</span>
          </div>
          <h2 className="text-4xl md:text-7xl font-black text-zinc-900 dark:text-white mb-6 tracking-tighter uppercase">OUR SERVICES</h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-transparent via-rose-600 dark:via-red-600 to-transparent mx-auto rounded-full shadow-[0_0_25px_rgba(255,0,0,0.6)]" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((s, i) => (
            <ServiceCard key={i} service={s} index={i} inView={inView} />
          ))}
        </div>

        <div className="text-center mt-20">
          <Button
            size="lg"
            className="h-14 px-10 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white rounded-full font-black text-lg shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:shadow-[0_0_30px_rgba(225,29,72,0.6)] border border-red-500/30 transition-all duration-300 hover:scale-105 uppercase tracking-widest group"
            onClick={() => navigate("/contact")}
          >
            Start Your Project <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};