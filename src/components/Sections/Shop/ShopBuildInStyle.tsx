import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export const ShopBuildInStyle = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax the shirt image
  const shirtY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-[60vh] min-h-[500px] overflow-hidden bg-[#0A4DDE] flex items-center"
    >
      <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-8 relative z-20">
        <motion.h2 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-[12vw] md:text-[8vw] font-black text-white leading-[0.85] tracking-tighter mix-blend-overlay"
        >
          BUILD<br />IN STYLE
        </motion.h2>

         {/* Floating Mini Card */}
         <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="absolute bottom-10 left-4 sm:left-8 bg-[#1A1A1A] text-white p-4 w-40 text-xs shadow-2xl"
        >
          <div className="flex justify-between mb-8 border-b border-white/20 pb-2">
            <span className="font-bold tracking-widest text-[9px] uppercase">Classics</span>
            <span>$35</span>
          </div>
          <p className="font-medium text-sm leading-tight">Loading tee</p>
        </motion.div>
      </div>

      {/* Parallax T-Shirt Image Overlapping from Right */}
      <motion.div 
        style={{ y: shirtY }}
        className="absolute right-[-10%] md:right-[5%] top-0 h-[150%] w-[120%] md:w-[60%] pointer-events-none z-10"
      >
        <img 
          src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop" 
          alt="Black T-Shirt"
          className="w-full h-full object-cover mix-blend-multiply opacity-90 drop-shadow-2xl"
        />
      </motion.div>
    </section>
  );
};
