import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ExternalLink, Github, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BlurBlob from "@/components/BlurBlob";

const ProjectCard = ({ project, index }) => {
  const cardRef = useRef(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPos = e.clientX - rect.left;
    const yPos = e.clientY - rect.top;
    setMouseX(xPos);
    setMouseY(yPos);
    const xPct = xPos / rect.width - 0.5;
    const yPct = yPos / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      style={{ perspective: "1200px" }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative rounded-[1.5rem] bg-white/40 dark:bg-transparent border border-black/5 dark:border-white/10 backdrop-blur-md transition-all duration-200 overflow-hidden cursor-default shadow-xl dark:shadow-2xl"
      >
        <div
          className="pointer-events-none absolute -inset-px rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition duration-500 z-0"
          style={{
            background: `radial-gradient(400px circle at ${mouseX}px ${mouseY}px, var(--glow-color), transparent 40%)`,
          }}
        />
        <style dangerouslySetInnerHTML={{ __html: `
          :root { --glow-color: rgba(225, 29, 72, 0.1); }
          .dark { --glow-color: rgba(255, 0, 0, 0.15); }
        `}} />

        <div
          className="pointer-events-none absolute -inset-px rounded-[1.5rem] border-[2px] border-rose-500 dark:border-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 shadow-[0_0_20px_rgba(255,0,0,0.1)]"
          style={{
            maskImage: `radial-gradient(200px circle at ${mouseX}px ${mouseY}px, black 0%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(200px circle at ${mouseX}px ${mouseY}px, black 0%, transparent 100%)`,
          }}
        />

        <div style={{ transform: "translateZ(50px)" }} className="relative z-20">
          <div className="relative overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-56 object-cover opacity-95 group-hover:scale-105 transition-transform duration-500"
            />
            <Badge className="absolute top-4 left-4 bg-rose-600/10 dark:bg-red-600/20 text-rose-600 dark:text-red-500 border-rose-600/20 dark:border-red-600/30 backdrop-blur-md">
              {project.category}
            </Badge>
          </div>

          <div className="p-6">
            <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-red-500 transition-colors">
              {project.title}
            </h3>

            <p className="text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-3 text-sm leading-relaxed">
              {project.description}
            </p>

            <div className="flex gap-4 text-xs text-zinc-500 mb-4 font-mono">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-rose-500 dark:text-red-500" />
                {project.timeline}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-rose-500 dark:text-red-500" />
                {project.teamSize}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {project.technologies.map((tech) => (
                <Badge key={tech} variant="outline" className="text-[10px] border-black/10 dark:border-white/10 text-zinc-600 dark:text-zinc-300 bg-white/50 dark:bg-transparent">
                  {tech}
                </Badge>
              ))}
            </div>

            <div className="flex gap-3">
              <Button asChild className="flex-1 bg-rose-600 dark:bg-red-600 hover:bg-rose-700 dark:hover:bg-red-700 text-white font-bold transition-all shadow-lg shadow-rose-600/20 dark:shadow-red-600/20">
                <a href={project.demoUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Live
                </a>
              </Button>
              <Button variant="outline" asChild className="border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5">
                <a href={project.githubUrl} target="_blank" rel="noreferrer">
                  <Github className="w-4 h-4 text-zinc-800 dark:text-white" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Projects() {
  const projects = [
    { id: 1, title: "Multi-Level Marketing (MLM) Engine", description: "A scalable MLM platform featuring automated referral tracking, dynamic commission distribution, and a real-time genealogy tree visualizer for distributors.", image: "/mlm_platform.png", technologies: ["MERN Stack", "TypeScript", "Tailwind CSS", "Redux Toolkit", "Node.js"], category: "Business / FinTech", timeline: "7 days", teamSize: "2 developers", demoUrl: "https://www.sarvasolutionvision.com/", githubUrl: "#" },
    { id: 2, title: "Restaurant Food Delivery Platform (Serverless)", description: "A serverless progressive web app for food ordering with a modern UI, cart system, and direct WhatsApp integration.", image: "/maa_laxmi.png", technologies: ["React", "TypeScript", "Vercel"], category: "Web Development", timeline: "3 days", teamSize: "3 developers", demoUrl: "https://www.malakshmiranirestaurant.online", githubUrl: "#" },
    { id: 3, title: "Hotel & Restaurant Business Website", description: "A fast, mobile-first business website designed to improve online visibility and local engagement.", image: "/Jamai_da_project.png", technologies: ["React", "TypeScript", "Vercel"], category: "Web Development", timeline: "2 days", teamSize: "2 developers", demoUrl: "https://jamaidahotel.online", githubUrl: "#" },
    { id: 4, title: "Regional Digital News Platform", description: "A scalable digital news portal delivering real-time regional updates with SEO-friendly architecture.", image: "/jhbihar.png", technologies: ["React", "SEO", "Vercel"], category: "Media & Web", timeline: "4 days", teamSize: "3 developers", demoUrl: "https://www.jharkhandbiharupdates.com", githubUrl: "#" },
    { id: 5, title: "Investment & Financial Consulting Website", description: "A professional consulting website built to establish trust and convert visitors into leads.", image: "/Smart_invest.png", technologies: ["React", "Tailwind CSS", "Form Integration"], category: "FinTech", timeline: "3 days", teamSize: "2 developers", demoUrl: "https://www.smartinvestsolutions.in", githubUrl: "#" },
    { id: 6, title: " Online Food Ordering Platform with Admin Panel", description: "A high-performance food ordering platform featuring a seamless customer experience and a robust Admin Panel for real-time order tracking and inventory management.", image: "/zomato_app.png", technologies: ["TypeScript", "Tailwind CSS", "Node.js", "Express", "MongoDB"], category: "E-commerce / FoodTech", timeline: "3 days", teamSize: "2 developers", demoUrl: "https://food-delivery-frontend-ten-gold.vercel.app/", githubUrl: "#" },
    { id: 7, title: " Portfolio Website for Creative Professionals", description: "A high-performance portfolio website designed for creative professionals to showcase their work and attract clients.", image: "/portfolio.png", technologies: ["TypeScript", "Tailwind CSS", "React", "Vercel"], category: "Web Development", timeline: "2 days", teamSize: "1 developers", demoUrl: "https://www.arnabsenapati.in", githubUrl: "#" }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-background relative overflow-hidden font-sans transition-colors duration-300">
      <BlurBlob position={{ top: "20%", left: "15%" }} size={{ width: "400px", height: "400px" }} />
      <BlurBlob position={{ top: "70%", left: "85%" }} size={{ width: "450px", height: "450px" }} />

      {/* Padding-top changed from pt-32 to pt-16 to reduce navbar gap */}
      <section className="pt-16 pb-16 px-4 text-center">
        <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-rose-600 dark:text-red-500 text-xs font-black tracking-[0.4em] uppercase mb-4 block">
          Selected Works
        </motion.span>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-7xl font-black text-zinc-900 dark:text-white mb-6 tracking-tighter uppercase">
          PROJECTS
        </motion.h1>
        <div className="w-20 h-1 bg-rose-600 dark:bg-red-600 mx-auto rounded-full shadow-[0_0_20px_rgba(225,29,72,0.4)] dark:shadow-[0_0_20px_rgba(255,0,0,0.8)]" />
      </section>

      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}