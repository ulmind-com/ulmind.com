import { motion } from 'framer-motion';
import {
  Users,
  Target,
  Award,
  Lightbulb,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { CTASection } from '@/components/Sections/CTASection';

export default function About() {
  const navigate = useNavigate();

  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Mission-Driven',
      description:
        "We're committed to delivering solutions that create real business impact.",
      gradient: 'from-blue-500 to-purple-600',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Client-Centric',
      description:
        "Your success is our priority. We collaborate closely at every step.",
      gradient: 'from-green-500 to-teal-600',
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Quality Excellence',
      description:
        'We maintain high standards in code quality, delivery, and service.',
      gradient: 'from-orange-500 to-red-600',
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: 'Innovation First',
      description:
        'We leverage modern technology and creative thinking to solve challenges.',
      gradient: 'from-purple-500 to-pink-600',
    },
  ];

  const stats = [
    { number: '7+', label: 'Projects Completed' },
    { number: '7+', label: 'Happy Clients' },
    { number: '3+', label: 'Years Experience' },
    { number: '8+', label: 'Team Members' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <section className="relative pt-24 pb-12 lg:pt-36 lg:pb-16 overflow-hidden bg-[#020b16]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop')"
            }}
          />
          {/* Gradient overlay similar to the image */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#021124] via-[#021124]/95 to-[#021124]/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-xl"
          >
            {/* Badge */}
            <div className="inline-block px-5 py-1.5 rounded-[20px] bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-sm">
              <span className="text-sm font-semibold tracking-wider text-[#ff5a5f] uppercase">
                Who We Are
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
              About Us
            </h1>
            
            <div className="w-16 h-1 bg-[#ff5a5f] mb-6" />
            
            <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-lg">
              A passionate team transforming ideas into scalable digital solutions. We believe every business deserves future-ready digital foundations.
            </p>
          </motion.div>

          {/* Right Image */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative lg:ml-auto w-full"
            style={{ perspective: 1200 }}
          >
            {/* Glowing background blob behind image */}
            <div className="absolute inset-0 bg-[#ff5a5f] opacity-20 blur-[60px] rounded-full scale-90 translate-y-4" />
            
            <motion.div 
              className="relative rounded-[24px] overflow-hidden shadow-2xl w-full border border-white/10 z-10 bg-[#0a1120]"
              animate={{ 
                y: [0, -20, 0]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{ 
                scale: 1.05,
                rotateX: 0,
                rotateY: 0,
                transition: { duration: 0.4 }
              }}
            >
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop" 
                alt="About Our Team" 
                className="w-full h-[280px] md:h-[360px] object-cover transition-transform duration-700"
              />
              {/* Subtle glass overlay inside image container */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </motion.div>
            
            {/* Floating Checkmark Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: [0, -8, 0] 
              }}
              transition={{ 
                opacity: { duration: 0.5, delay: 0.6 },
                scale: { duration: 0.5, delay: 0.6 },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }
              }}
              className="absolute -left-4 top-1/2 -translate-y-1/2 bg-[#222a36]/90 backdrop-blur-md p-3 md:p-4 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.4)] border border-white/10 hidden md:flex items-center justify-center transform hover:scale-110 transition-transform z-20 group"
            >
              <div className="w-8 h-8 rounded-full border-2 border-blue-500 flex items-center justify-center group-hover:bg-blue-500/10 transition-colors">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* STORY SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-background">
        {/* Ultra Premium Ambient Mesh Gradient */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-rose-500/10 dark:bg-rose-500/15 rounded-full blur-[140px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-violet-500/10 dark:bg-violet-500/15 rounded-full blur-[150px]" />
          <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-[150px]" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            className="flex flex-col lg:flex-row items-center gap-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Left Content */}
            <div className="flex-1 space-y-8 relative z-10 w-full">
              {/* Floating Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md shadow-[0_0_15px_rgba(var(--primary),0.1)]">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
                <span className="text-xs font-bold tracking-widest text-primary uppercase">
                  Our Origin
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-500 drop-shadow-sm">Story</span>
              </h2>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Founded with a vision to bridge technology and business success, we
                evolved into a full-service digital agency serving clients worldwide.
              </p>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                We believe every business deserves scalable, future-ready digital
                solutions.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6">
                {stats.map((stat, i) => (
                  <div key={i} className="flex flex-col space-y-2 relative group">
                    <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/50 group-hover:from-primary group-hover:to-primary/50 transition-all duration-300">
                      {stat.number}
                    </span>
                    <span className="text-sm font-semibold text-muted-foreground">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Illustration Node */}
            <div className="flex-1 w-full flex justify-center relative">
              <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center perspective-1000">
                <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full scale-110 animate-pulse" />
                <motion.div 
                  className="absolute inset-4 rounded-full bg-gradient-to-tr from-background/80 via-card/80 to-primary/10 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(255,255,255,0.05)] flex items-center justify-center backdrop-blur-xl"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                >
                  {/* Orbital dots */}
                  <div className="absolute top-10 left-10 w-3 h-3 rounded-full bg-rose-400 shadow-[0_0_15px_rgba(251,113,133,0.8)]" />
                  <div className="absolute bottom-20 right-10 w-4 h-4 rounded-full bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)]" />
                  <div className="absolute top-1/2 -left-4 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.8)]" />
                </motion.div>
                <div className="relative z-10 w-40 h-40 bg-card/80 backdrop-blur-md rounded-3xl shadow-2xl flex items-center justify-center border border-white/20 transform rotate-12 hover:rotate-0 transition-transform duration-500">
                  <Sparkles className="w-20 h-20 text-primary drop-shadow-[0_0_20px_rgba(var(--primary),0.8)]" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CORE VALUES (Dynamic Z-Pattern Layout) */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-background">
        
        {/* Continuous Dynamic Gradient Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center opacity-70">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 90, 0]
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 -left-[10%] w-[1000px] h-[1000px] bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-[150px]" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, -90, 0]
            }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 -right-[10%] w-[1200px] h-[1200px] bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-[160px]" 
          />
          <motion.div 
            animate={{ 
              y: [0, 100, 0],
              x: [0, 50, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[40%] left-[30%] w-[800px] h-[800px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[140px]" 
          />
        </div>
        
        {/* Top subtle structural border */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="max-w-7xl mx-auto text-center mb-28 relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card/80 shadow-[0_0_20px_rgba(0,0,0,0.05)] border border-primary/20 backdrop-blur-xl mb-6">
            <span className="text-[13px] font-bold tracking-widest text-primary uppercase">
              What We Stand For
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground drop-shadow-sm">
            Our Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500 animate-pulse">Values</span>
          </h2>
          <p className="mt-8 text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            The principles that guide every decision we make.
          </p>
        </div>

        <div className="max-w-7xl mx-auto space-y-32">
          {values.map((value, i) => {
            const isEven = i % 2 === 0;
            // Determine gradient colors for titles based on the index to give each section a unique flavor
            const titleGradients = [
               "from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300",
               "from-rose-600 to-pink-500 dark:from-pink-500 dark:to-rose-400",
               "from-emerald-600 to-teal-400 dark:from-teal-400 dark:to-emerald-300",
               "from-purple-600 to-indigo-500 dark:from-indigo-400 dark:to-purple-300"
            ];
            
            // Abstract premium 3D illustrations for each value
            const valueImages = [
              "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=1000&auto=format&fit=crop", // Mission
              "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop", // Client
              "https://images.unsplash.com/photo-1633412802994-5c058f151b66?q=80&w=1000&auto=format&fit=crop", // Quality
              "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop"  // Innovation
            ];
            
            return (
              <motion.div 
                key={i} 
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                {/* Text Content side */}
                <div className="flex-1 space-y-6 relative z-10 w-full">
                  <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-card shadow-sm border border-border/50">
                    <div className="text-primary flex items-center justify-center [&_svg]:w-4 [&_svg]:h-4">
                      {value.icon}
                    </div>
                    <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase leading-none pt-[1px]">
                      Value 0{i + 1}
                    </span>
                  </div>
                  
                  <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                    Our <span className={`text-transparent bg-clip-text bg-gradient-to-r ${titleGradients[i]}`}>{value.title.split('-')[0].split(' ')[0]}</span>
                    {value.title.substring(value.title.indexOf(value.title.split('-')[0].split(' ')[0]) + value.title.split('-')[0].split(' ')[0].length).replace('-', ' ')}
                  </h3>
                  
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
                    {value.description}
                  </p>
                  
                  {/* Pills */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    <span className="px-4 py-2 text-sm font-medium rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">Commitment</span>
                    <span className="px-4 py-2 text-sm font-medium rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">Excellence</span>
                    <span className="px-4 py-2 text-sm font-medium rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">Impact</span>
                  </div>
                </div>

                {/* Abstract Illustration side */}
                <div className="flex-1 w-full flex justify-center relative">
                  <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center">
                    {/* Glowing Orb Background */}
                    <motion.div 
                      className={`absolute inset-4 rounded-full bg-gradient-to-br ${value.gradient} opacity-10 dark:opacity-20 blur-3xl`}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    
                    {/* Main Circular Container */}
                    <div className="absolute inset-8 rounded-full bg-card/80 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl flex items-center justify-center overflow-hidden">
                       {/* Subtle internal grid/rings to look technical */}
                       <div className="absolute inset-0 border-[0.5px] border-border/50 rounded-full scale-[0.8]" />
                       <div className="absolute inset-0 border-[0.5px] border-border/50 rounded-full scale-[0.6]" />
                       
                       {/* Floating Center Image Wrapper */}
                       <motion.div 
                         className="relative z-10 w-32 h-32 md:w-48 md:h-48 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-white/20 flex items-center justify-center overflow-hidden"
                         animate={{ y: [0, -15, 0] }}
                         transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
                       >
                         <img src={valueImages[i]} alt={value.title} className="w-full h-full object-cover scale-105" />
                         <div className="absolute inset-0 bg-gradient-to-tr from-black/30 to-transparent pointer-events-none" />
                       </motion.div>
                    </div>

                    {/* Orbiting / Abstract Decorative Dots */}
                    <motion.div 
                      className="absolute inset-0 z-20 pointer-events-none"
                      animate={{ rotate: isEven ? 360 : -360 }}
                      transition={{ duration: 20 + i * 2, repeat: Infinity, ease: "linear" }}
                    >
                      <div className="absolute top-8 right-16 w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                      <div className="absolute bottom-8 left-16 w-5 h-5 rounded-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.8)]" />
                      <div className="absolute top-1/2 -left-2 w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.8)]" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </div>
  );
}
