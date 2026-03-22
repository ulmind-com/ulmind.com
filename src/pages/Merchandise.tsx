import { ShopHeroSection } from "@/components/Sections/Shop/ShopHeroSection";
import { ShopApparelCarousel } from "@/components/Sections/Shop/ShopApparelCarousel";
import { ShopBuildInStyle } from "@/components/Sections/Shop/ShopBuildInStyle";
import { ShopAccessoriesCarousel } from "@/components/Sections/Shop/ShopAccessoriesCarousel";
import { ShopOnTheGo } from "@/components/Sections/Shop/ShopOnTheGo";
import { useEffect } from "react";
import { ReactLenis } from '@studio-freight/react-lenis';
import { motion } from "framer-motion";
import BlurBlob from "@/components/BlurBlob";

export default function Merchandise() {
  
  // Update document title for this route
  useEffect(() => {
    document.title = "Shop | ULMiND";
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center relative overflow-hidden">
      <BlurBlob position={{ top: "20%", left: "20%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-cyan-300 dark:bg-cyan-600" opacityClass="opacity-40 dark:opacity-20" />
      <BlurBlob position={{ top: "80%", left: "80%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-fuchsia-300 dark:bg-fuchsia-600" opacityClass="opacity-40 dark:opacity-20" />

      {/* Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
         <div className="w-[500px] h-[500px] bg-red-500 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 text-center px-4"
      >
        <motion.div
           initial={{ scale: 0.8 }}
           animate={{ scale: 1 }}
           transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
           className="mb-8 flex justify-center"
        >
          <img src="/ULmindLogo.png" alt="ULMind Logo" className="h-16 md:h-24 opacity-80 mix-blend-screen" />
        </motion.div>
        
        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-4">
          COMING <span className="text-red-500">SOON</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl font-medium max-w-lg mx-auto">
          Our exclusive merchandise store is currently under construction. Get ready to build in style.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.history.back()}
          className="mt-12 px-8 py-3 bg-white text-black font-bold rounded-full text-sm uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors duration-300"
        >
          Go Back
        </motion.button>
      </motion.div>
    </div>
  );
}
