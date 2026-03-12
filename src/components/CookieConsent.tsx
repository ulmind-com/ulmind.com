import React, { useState, useEffect } from "react";
import { useFingerprint } from "@/hooks/useFingerprint";
import { Shield, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { trackUser } = useFingerprint();

  useEffect(() => {
    // Show on every refresh as requested
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleConsent = (status: "accepted" | "declined") => {
    // Track user for both buttons to ensure data storage
    trackUser("accepted"); 
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-[10000]"
        >
          <div className="relative group">
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl shadow-black/20 overflow-hidden" />
            
            {/* Content */}
            <div className="relative p-6 px-7 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary animate-pulse" />
                  </div>
                  <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
                    Cookie Privacy
                  </h3>
                </div>
                <button 
                  onClick={() => setIsVisible(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4 text-foreground/40" />
                </button>
              </div>

              <p className="text-sm leading-relaxed text-foreground/70">
                We use cookies to enhance your experience and analyze our traffic. By clicking "Accept", you help us improve our services.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <button
                  onClick={() => handleConsent("accepted")}
                  className="flex-1 group/btn relative px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 overflow-hidden"
                >
                  <span>Accept All</span>
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                </button>
                
                <button
                  onClick={() => handleConsent("declined")}
                  className="flex-1 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-foreground/80 font-medium text-sm transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center"
                >
                  Decline
                </button>
              </div>

              <div className="text-[10px] text-center text-foreground/40 mt-1 uppercase tracking-widest font-bold">
                Protecting your data & privacy
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
