import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { technologies } from "@/data/technologies";
import { CTASection } from "@/components/Sections/CTASection";

const Technologies = () => {
  useEffect(() => {
    document.title = "Technology Stack | ULMiND";
    window.scrollTo(0, 0);
  }, []);

  // Group technologies by category
  const categories = technologies.reduce((acc, tech) => {
    if (!acc[tech.category]) {
      acc[tech.category] = [];
    }
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<string, typeof technologies>);

  return (
    <div className="min-h-screen pt-12 md:pt-16 bg-background">
      {/* Hero Section */}
      <section className="relative pb-16 md:pb-20 overflow-hidden">
        {/* Abstract shapes in background */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl opacity-50 transform-gpu pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl opacity-50 transform-gpu pointer-events-none" />

        <div className="container mx-auto px-4 text-center z-10 relative">
          
          {/* Back to Home Link */}
          <div className="absolute top-4 left-4 md:left-8 z-20">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors bg-secondary/30 hover:bg-secondary/60 rounded-full backdrop-blur-sm"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="pt-10 md:pt-4"
          >
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm">
              <span className="text-sm font-semibold tracking-wide text-primary">OUR COMPLETE TOOLKIT</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight">
              Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Technology Stack</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A comprehensive toolkit of cutting-edge technologies we use to engineer scalable, high-performance digital solutions across all platforms.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 container mx-auto px-4 lg:px-8 pb-32">
        <div className="space-y-32">
          {Object.entries(categories).map(([category, techs], catIndex) => (
            <motion.div 
              key={category}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              {/* Category Header */}
              <div className="flex flex-col md:flex-row md:items-end gap-4 mb-12 relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  {category}
                </h2>
                <div className="flex-1 hidden md:block h-px bg-gradient-to-r from-border/80 to-transparent ml-4 mb-2"></div>
              </div>
              
              {/* Category Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 relative z-10">
                {techs.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: Math.min(index * 0.05, 0.5), duration: 0.4 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="group relative bg-white/40 dark:bg-[#1C1C1E]/60 backdrop-blur-sm border border-white/50 dark:border-white/10 rounded-[28px] p-6 text-center shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] transition-all duration-300 overflow-hidden hover:bg-white/50 dark:hover:bg-[#1C1C1E]/80 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.12)] dark:hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.6)] transform-gpu will-change-transform"
                  >
                    <div className="relative z-10 flex flex-col items-center justify-center h-full">
                      <div className="w-16 h-16 rounded-[18px] bg-white/70 dark:bg-white/10 flex items-center justify-center mb-4 transition-all duration-300 border border-white/80 dark:border-white/10 shadow-[inner_0_1px_4px_rgba(255,255,255,0.8)] dark:shadow-[inner_0_1px_2px_rgba(255,255,255,0.05)] group-hover:scale-110 group-hover:bg-white/90 dark:group-hover:bg-white/20 transform-gpu will-change-transform">
                        <tech.icon
                          size={32}
                          color={tech.color}
                          className="drop-shadow-sm transition-transform duration-400 group-hover:scale-105"
                        />
                      </div>
                      <h3 className="font-semibold text-[15px] tracking-tight text-foreground/90 group-hover:text-foreground transition-colors duration-400">
                        {tech.name}
                      </h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default Technologies;
