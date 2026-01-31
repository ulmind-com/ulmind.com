import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { FloatingObjects } from '@/components/3D/FloatingObjects';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

// Counter component for the animated numbers
const Counter = ({ value, label }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  
  // Logical fix: Separate the first numeric part for animation
  // Example: "24/7" -> animate "24", keep "/7" static
  // Example: "50+" -> animate "50", keep "+" static
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
      whileHover={{ scale: 1.05 }}
      className="text-center"
    >
      <div className="text-2xl font-bold gradient-text">
        {display}{suffix}
      </div>
      <div className="text-sm text-muted-foreground">
        {label}
      </div>
    </motion.div>
  );
};

export const HeroSection = () => {
  const navigate = useNavigate();

  // Updated stats to match your video/requirements
  const stats = [
    { number: '3', label: 'Years Experience' },
    { number: '5', label: 'Completed Projects' },
    { number: '10+', label: 'Clients Worldwide' },
    { number: '24/7', label: 'Support' },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-secondary/20 to-background"
    >
      {/* 3D Background */}
      <div className="absolute inset-0 opacity-30">
        <FloatingObjects />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Welcome to the Future of Development
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6"
          >
            Building Tomorrow&apos;s
            <br />
            <span className="gradient-text">Digital Solutions</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
          >
            We transform ideas into powerful digital experiences using cutting-edge
            technology and innovative design principles.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              onClick={() => navigate('/contact')}
              className="bg-gradient-primary hover:opacity-90 smooth-transition group"
            >
              Start Your Project
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 smooth-transition" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/about')}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground smooth-transition"
            >
              Learn More
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
        >
          {stats.map((stat, index) => (
            <Counter key={index} value={stat.number} label={stat.label} />
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 border-2 border-primary rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-1 h-3 bg-primary rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};