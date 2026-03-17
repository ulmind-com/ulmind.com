import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export const ShopOnTheGo = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax the tumbler images
  const tumblersY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-[70vh] min-h-[500px] overflow-hidden bg-[#0A0A0A] flex items-center justify-end"
    >
      <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-8 relative z-20 flex justify-end">
        <motion.h2 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-[12vw] md:text-[8vw] font-black text-white leading-[0.85] tracking-tighter text-right mix-blend-overlay"
        >
          ON<br />THE<br />GO
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
            <span>$40</span>
          </div>
          <p className="font-medium text-sm leading-tight">Container travel tumbler</p>
        </motion.div>
      </div>

      {/* Parallax Tumbler Image Overlapping from Left */}
      <motion.div 
        style={{ y: tumblersY }}
        className="absolute left-[-20%] md:left-[-5%] top-[-10%] h-[120%] w-[120%] md:w-[60%] pointer-events-none z-10"
      >
        <img 
          src="https://images.unsplash.com/photo-1620138546344-7b6a4ea184ec?q=80&w=1200&auto=format&fit=crop" 
          alt="Black Tumblers"
          className="w-full h-full object-cover opacity-80 mix-blend-lighten drop-shadow-2xl brightness-75 contrast-125"
        />
      </motion.div>
    </section>
  );
};
