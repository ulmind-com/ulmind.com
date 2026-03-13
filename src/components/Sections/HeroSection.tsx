import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Sparkles, 
  Target, 
  Trophy, 
  Megaphone, 
  BarChart3, 
  Settings,
  Medal,
  Zap,
  Globe,
  Shield,
  Code,
  Smartphone,
  Cloud,
  Rocket,
  Cpu,
  Layers,
  Wifi
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';

// Combined Animated component for seamless sliding of videos AND orbiting icons
const AnimatedHeroVisuals = () => {
    const [index, setIndex] = useState(0);
    
    // Grouped the videos with their specific icons and data for the floating elements
    const slides = [
        {
            src: "/hero_v1.mp4",
            card: { icon: Medal, title: "Best Agency", subtitle: "Awards", color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-500/20" },
            icon1: { icon: Target, color: "text-blue-500" },
            icon2: { icon: Megaphone, color: "text-violet-500" },
            icon3: { icon: BarChart3, color: "text-emerald-500" }
        },
        {
            src: "/hero_v2.mp4", 
            card: { icon: Trophy, title: "Top Rated", subtitle: "Developers", color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-500/20" },
            icon1: { icon: Sparkles, color: "text-amber-500" },
            icon2: { icon: Zap, color: "text-orange-500" },
            icon3: { icon: Globe, color: "text-cyan-500" }
        },
        {
            src: "/hero_v3.mp4",
            card: { icon: Shield, title: "100% Secure", subtitle: "Systems", color: "text-green-500", bg: "bg-green-100 dark:bg-green-500/20" },
            icon1: { icon: Code, color: "text-indigo-500" },
            icon2: { icon: Smartphone, color: "text-pink-500" },
            icon3: { icon: Cloud, color: "text-sky-500" }
        },
        {
            src: "/hero_v4.mp4",
            card: { icon: Rocket, title: "Fast Delivery", subtitle: "Guaranteed", color: "text-red-500", bg: "bg-red-100 dark:bg-red-500/20" },
            icon1: { icon: Cpu, color: "text-purple-500" },
            icon2: { icon: Layers, color: "text-teal-500" },
            icon3: { icon: Wifi, color: "text-blue-400" }
        }
    ];

    // Function to go to the next slide when a video ends
    const handleVideoEnd = () => {
        setIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    const ORBIT_DURATION = 20; // Time in seconds for one full circle rotation

    const CurrentSlide = slides[index];
    const CardIcon = CurrentSlide.card.icon;
    const Icon1 = CurrentSlide.icon1.icon;
    const Icon2 = CurrentSlide.icon2.icon;
    const Icon3 = CurrentSlide.icon3.icon;

    return (
        <div className="absolute inset-0 w-full h-full">
            {/* popLayout ensures they overlap smoothly during the slide */}
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: "100%" }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: "-100%" }}
                    // Increased duration to 1.5s and added a smoother cubic-bezier ease for a premium feel
                    transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute inset-0 w-full h-full"
                >
                    {/* The Central Circular Video */}
                    <div className="absolute inset-4 sm:inset-6 md:inset-8 rounded-full z-10 overflow-hidden shadow-2xl transition-all duration-300 group/circle bg-background">
                        <video
                            src={CurrentSlide.src}
                            autoPlay
                            muted
                            playsInline
                            onEnded={handleVideoEnd} // Triggers next slide ONLY when video finishes
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* The Orbiting Wrapper for the 4 Icons */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: ORBIT_DURATION, ease: "linear" }}
                        className="absolute inset-0 z-20 pointer-events-none"
                    >
                        {/* 1. Floating Card */}
                        <div className="absolute -bottom-2 -left-2 sm:-left-4 md:bottom-10 md:-left-12 pointer-events-auto origin-center">
                            {/* Counter-rotation to keep the card upright */}
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ repeat: Infinity, duration: ORBIT_DURATION, ease: "linear" }}
                            >
                                <motion.div 
                                    animate={{ y: [-10, 10, -10] }}
                                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                    className="bg-background p-3 md:p-4 rounded-2xl shadow-2xl border border-border/50 flex flex-col items-center gap-1 md:gap-2"
                                >
                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${CurrentSlide.card.bg}`}>
                                        <CardIcon className={`w-5 h-5 md:w-6 md:h-6 ${CurrentSlide.card.color}`} />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] md:text-xs font-bold text-foreground leading-tight">{CurrentSlide.card.title}</p>
                                        <p className="text-[10px] md:text-xs text-muted-foreground font-medium">{CurrentSlide.card.subtitle}</p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* 2. Top Left Icon */}
                        <div className="absolute top-[5%] left-[0%] md:top-[10%] md:left-[5%] pointer-events-auto origin-center">
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ repeat: Infinity, duration: ORBIT_DURATION, ease: "linear" }}
                            >
                                <motion.div 
                                    animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
                                    className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center"
                                >
                                    <Icon1 className={`w-5 h-5 md:w-6 md:h-6 ${CurrentSlide.icon1.color}`} />
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* 3. Top Right Icon */}
                        <div className="absolute top-[15%] -right-[2%] md:top-[20%] md:-right-[5%] pointer-events-auto origin-center">
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ repeat: Infinity, duration: ORBIT_DURATION, ease: "linear" }}
                            >
                                <motion.div 
                                    animate={{ y: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 3.5, delay: 1 }}
                                    className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full shadow-lg flex items-center justify-center"
                                >
                                    <Icon2 className={`w-6 h-6 md:w-7 md:h-7 ${CurrentSlide.icon2.color}`} />
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* 4. Bottom Right Icon */}
                        <div className="absolute bottom-[15%] -right-[2%] md:bottom-[20%] md:-right-[2%] pointer-events-auto origin-center">
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ repeat: Infinity, duration: ORBIT_DURATION, ease: "linear" }}
                            >
                                <motion.div 
                                    animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2.5, delay: 0.2 }}
                                    className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center"
                                >
                                    <Icon3 className={`w-5 h-5 md:w-6 md:h-6 ${CurrentSlide.icon3.color}`} />
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// Counter component for the animated numbers
interface CounterProps {
  value: string;
  label: string;
  icon?: React.ElementType; // Fixed TS 'any' type to prevent Vercel build errors
}

const Counter = ({ value, label, icon: Icon }: CounterProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  
  const match = value.match(/(\d+)(.*)/);
  const numericValue = match ? parseInt(match[1]) : 0;
  const suffix = match ? match[2] : '';

  const count = useMotionValue(0);
  const springValue = useSpring(count, {
    stiffness: 60,
    damping: 20,
  });

  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) {
      count.set(numericValue);
    } else {
      count.set(0);
    }
  }, [isInView, numericValue, count]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      setDisplay(Math.round(latest));
    });
  }, [springValue]);

  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -5 }}
      className="bg-card border border-border/50 shadow-xl shadow-black/5 dark:shadow-black/20 rounded-[2rem] p-6 md:p-8 flex flex-col items-center justify-center gap-3 md:gap-4 relative overflow-hidden group"
    >
      <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
        {Icon && <Icon className="w-7 h-7 md:w-8 md:h-8" />}
      </div>
      <div className="text-center">
        <div className="text-3xl md:text-4xl font-extrabold text-foreground mb-1">
          {display}{suffix}
        </div>
        <div className="text-xs md:text-sm font-medium text-muted-foreground">
          {label}
        </div>
      </div>
    </motion.div>
  );
};

export const HeroSection = () => {
  const navigate = useNavigate();

  // Your stats data matched with icons
  const stats = [
    { number: '3', label: 'Years Experience', icon: Trophy },
    { number: '7+', label: 'Completed Projects', icon: Target },
    { number: '7+', label: 'Clients Worldwide', icon: BarChart3 },
    { number: '24/7', label: 'Support', icon: Settings },
  ];

  return (
    <section
      id="home"
      // CHANGED: Responsive padding for top and bottom
      className="relative min-h-screen pt-16 md:pt-20 pb-16 md:pb-20 overflow-hidden bg-gradient-to-br from-background via-violet-50/50 dark:via-violet-900/10 to-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 2-Column Grid */}
        <div className="grid lg:grid-cols-2 gap-10 md:gap-12 lg:gap-8 items-center mb-16 md:mb-24">
          
          {/* Left Column: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left z-10"
          >
            {/* Top Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800 rounded-full mb-6 md:mb-8"
            >
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-violet-600 dark:text-violet-400" />
              <span className="text-xs md:text-sm font-semibold text-violet-700 dark:text-violet-300">
                Welcome to the Future of Development
              </span>
            </motion.div>

            {/* Headline with Dashed Box for "Digital" */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-4 md:mb-6 leading-[1.2] md:leading-[1.1] text-foreground">
              Building Tomorrow's
              <br />
              <span className="relative inline-block border-2 border-dashed border-orange-500 text-orange-500 px-2 sm:px-4 py-0.5 sm:py-1 mx-1 sm:mx-2 my-1 sm:my-2 bg-orange-500/5">
                Digital
                {/* Dashed Box Corner Squares */}
                <span className="absolute -top-1.5 -left-1.5 w-2 sm:w-2.5 h-2 sm:h-2.5 bg-background border border-orange-500" />
                <span className="absolute -top-1.5 -right-1.5 w-2 sm:w-2.5 h-2 sm:h-2.5 bg-background border border-orange-500" />
                <span className="absolute -bottom-1.5 -left-1.5 w-2 sm:w-2.5 h-2 sm:h-2.5 bg-background border border-orange-500" />
                <span className="absolute -bottom-1.5 -right-1.5 w-2 sm:w-2.5 h-2 sm:h-2.5 bg-background border border-orange-500" />
              </span>
              <br />
              Solutions
            </h1>

            {/* Paragraph */}
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 md:mb-10 max-w-lg leading-relaxed">
              We transform ideas into powerful digital experiences using cutting-edge
              technology and innovative design principles.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
              <Button
                size="lg"
                onClick={() => navigate('/contact')}
                className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-6 py-5 md:px-8 md:py-6 text-sm md:text-base font-bold shadow-lg shadow-violet-600/25 transition-all hover:scale-105 group w-full sm:w-auto"
              >
                Start Your Project
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/about')}
                className="rounded-full px-6 py-5 md:px-8 md:py-6 text-sm md:text-base font-bold border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all w-full sm:w-auto"
              >
                Learn More
              </Button>
            </div>
          </motion.div>

          {/* Right Column: Video and Floating Elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            // Responsive width to give breathing room for orbiting icons on mobile
            className="relative w-[85%] max-w-[320px] sm:max-w-md mx-auto aspect-square lg:max-w-none lg:w-full lg:h-[500px] xl:h-[600px] flex items-center justify-center mt-12 lg:mt-0"
          >
            {/* Concentric Rings */}
            <div className="absolute inset-0 border border-amber-300 dark:border-amber-500/30 rounded-full pointer-events-none" />
            <div className="absolute inset-[-20px] sm:inset-[-40px] border border-amber-200 dark:border-amber-500/10 rounded-full hidden md:block pointer-events-none" />

            {/* Combined Component for Videos and Orbiting Elements */}
            <AnimatedHeroVisuals />

          </motion.div>
        </div>

        {/* Bottom Section: Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="relative z-20"
        >
          <div className="text-center mb-8 md:mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">Our Impact</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <Counter 
                key={index} 
                value={stat.number} 
                label={stat.label} 
                icon={stat.icon} 
              />
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};