import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export const ShopHeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  
  return (
    <section 
      ref={containerRef}
      className="relative w-full h-[80vh] md:h-screen min-h-[600px] overflow-hidden bg-[#0A4DDE] flex flex-col md:flex-row"
    >
      {/* Left (Blue side - Apparel focus) */}
      <div className="flex-1 relative h-full flex items-center justify-center p-8 overflow-hidden z-10">
        <motion.img
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop"
          alt="Blue Sweatshirt"
          className="object-contain w-full h-[80%] max-w-[600px] drop-shadow-2xl mix-blend-multiply" 
        />
        
        {/* Floating Mini Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="absolute bottom-10 left-10 md:bottom-20 md:left-20 bg-black text-white p-4 w-40 text-xs hidden sm:block"
        >
          <div className="flex justify-between mb-8 border-b border-white/20 pb-2">
            <span className="font-bold tracking-widest text-[9px] uppercase">Classics</span>
            <span>$65</span>
          </div>
          <p className="font-medium text-sm leading-tight">Logo sweatshirt</p>
        </motion.div>
      </div>

      {/* Right (Black side - Accessories focus) */}
      <div className="flex-1 relative h-full bg-[#0E0E0E] flex items-center justify-center p-8 overflow-hidden z-10 hidden md:flex">
         <motion.img
          initial={{ opacity: 0, scale: 0.9, y: -50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          src="https://images.unsplash.com/photo-1597348989645-46b190ce4918?q=80&w=1200&auto=format&fit=crop"
          alt="Black Tote Bag"
          className="object-contain w-full h-[80%] max-w-[600px] drop-shadow-2xl opacity-90"
        />

        {/* Floating Mini Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute top-20 left-10 bg-[#1A1A1A] text-white p-4 w-40 text-xs"
        >
          <div className="flex justify-between mb-8 border-b border-white/20 pb-2">
            <span className="font-bold tracking-widest text-[9px] uppercase">Classics</span>
            <span>$35</span>
          </div>
          <p className="font-medium text-sm leading-tight">Container Baggu tote</p>
        </motion.div>
      </div>

      {/* Massive Centered Text Layer */}
      <motion.div 
        style={{ y: textY }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 mix-blend-overlay"
      >
        <h1 className="text-[15vw] md:text-[18vw] font-black tracking-tighter text-white opacity-90 leading-none select-none">
          CLASSICS
        </h1>
      </motion.div>
    </section>
  );
};
