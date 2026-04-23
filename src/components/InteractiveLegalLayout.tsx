import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate, useMotionTemplate } from 'framer-motion';
import { ChevronLeft, ChevronRight, Globe2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CTASection } from '@/components/Sections/CTASection';
import BlurBlob from "@/components/BlurBlob";

const TranslationContext = createContext<{
  sliderX: any;
  selectedLang: string;
}>({ sliderX: null, selectedLang: 'en' });

export const TranslateBlock = ({ 
  en, 
  hi, 
  bn, 
  es, 
  fr,
  ar,
  zh,
  de,
  ja,
  ru,
  pt
}: { 
  en: React.ReactNode, 
  hi?: React.ReactNode, 
  bn?: React.ReactNode, 
  es?: React.ReactNode, 
  fr?: React.ReactNode,
  ar?: React.ReactNode,
  zh?: React.ReactNode,
  de?: React.ReactNode,
  ja?: React.ReactNode,
  ru?: React.ReactNode,
  pt?: React.ReactNode
}) => {
  const { sliderX, selectedLang } = useContext(TranslationContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef({ left: 0, width: 1000 });

  useEffect(() => {
    const updateBounds = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        boundsRef.current = { left: rect.left, width: rect.width };
      }
    };
    
    updateBounds();
    const observer = new ResizeObserver(updateBounds);
    if (containerRef.current) observer.observe(containerRef.current);
    
    // Also update on scroll and resize to keep bounds perfectly synced
    window.addEventListener('resize', updateBounds);
    window.addEventListener('scroll', updateBounds, { passive: true });
    
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateBounds);
      window.removeEventListener('scroll', updateBounds);
    };
  }, []);

  const clipRight = useTransform(sliderX, (x: number) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width === 0) return 0;
    let percent = ((x - rect.left) / rect.width) * 100;
    percent = Math.max(0, Math.min(100, percent));
    return 100 - percent;
  });

  const clipLeft = useTransform(sliderX, (x: number) => {
    if (!containerRef.current) return 100;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width === 0) return 100;
    let percent = ((x - rect.left) / rect.width) * 100;
    percent = Math.max(0, Math.min(100, percent));
    return percent;
  });

  const clipPathEn = useMotionTemplate`inset(-50px ${clipRight}% -50px -50px)`;
  const clipPathTranslated = useMotionTemplate`inset(-50px -50px -50px ${clipLeft}%)`;

  if (selectedLang === 'en') {
    return <div>{en}</div>;
  }

  const getTranslatedContent = () => {
    switch (selectedLang) {
      case 'hi': return hi || en;
      case 'bn': return bn || en;
      case 'es': return es || en;
      case 'fr': return fr || en;
      case 'ar': return ar || en;
      case 'zh': return zh || en;
      case 'de': return de || en;
      case 'ja': return ja || en;
      case 'ru': return ru || en;
      case 'pt': return pt || en;
      default: return en;
    }
  };

  return (
    <div className="grid relative w-fit" ref={containerRef}>
      <motion.div 
        className="col-start-1 row-start-1"
        style={{ clipPath: clipPathTranslated }}
      >
        {getTranslatedContent()}
      </motion.div>
      
      <motion.div 
        className="col-start-1 row-start-1 z-10" 
        style={{ clipPath: clipPathEn }}
      >
        {en}
      </motion.div>
    </div>
  );
};

export const InteractiveLegalLayout = ({ 
  title, 
  date, 
  icon: Icon, 
  children 
}: { 
  title: string, 
  date: string, 
  icon: any,
  children: React.ReactNode 
}) => {
  const [selectedLang, setSelectedLang] = useState('en');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1000);
  
  const sliderX = useMotionValue(windowWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (selectedLang === 'en') {
      animate(sliderX, windowWidth, { type: 'spring', stiffness: 200, damping: 25 });
    } else {
      animate(sliderX, windowWidth / 2, { type: 'spring', stiffness: 150, damping: 20 });
    }
  }, [selectedLang, windowWidth, sliderX]);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা (Bengali)', flag: '🇮🇳' },
    { code: 'es', name: 'Español (Spanish)', flag: '🇪🇸' },
    { code: 'fr', name: 'Français (French)', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية (Arabic)', flag: '🇸🇦' },
    { code: 'zh', name: '中文 (Chinese)', flag: '🇨🇳' },
    { code: 'de', name: 'Deutsch (German)', flag: '🇩🇪' },
    { code: 'ja', name: '日本語 (Japanese)', flag: '🇯🇵' },
    { code: 'ru', name: 'Русский (Russian)', flag: '🇷🇺' },
    { code: 'pt', name: 'Português (Portuguese)', flag: '🇵🇹' },
  ];

  return (
    <TranslationContext.Provider value={{ sliderX, selectedLang }}>
      <div className="bg-background relative overflow-clip min-h-screen">
        <style>{`
          .legal-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
          .legal-scroll::-webkit-scrollbar-track { background: transparent; }
          .legal-scroll::-webkit-scrollbar-thumb { background: rgba(239, 68, 68, 0.3); border-radius: 10px; }
          .legal-scroll::-webkit-scrollbar-thumb:hover { background: rgba(239, 68, 68, 0.6); }
        `}</style>
        
        <BlurBlob position={{ top: "10%", left: "10%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-cyan-300 dark:bg-cyan-600" opacityClass="opacity-40 dark:opacity-20" />
        <BlurBlob position={{ top: "50%", left: "80%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-fuchsia-300 dark:bg-fuchsia-600" opacityClass="opacity-40 dark:opacity-20" />
        <BlurBlob position={{ top: "90%", left: "20%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-yellow-200 dark:bg-yellow-600" opacityClass="opacity-40 dark:opacity-20" />
        
        {/* Main Content Wrapper (Bounds the Slider) */}
        <div className="relative">
          {/* Top Banner - Moved to top, pt-24 to clear fixed navbar */}
          <div className="w-full relative bg-gradient-to-r from-rose-600 via-red-500 to-orange-500 h-[180px] md:h-[220px] flex flex-col items-center justify-center overflow-hidden border-b border-white/10 shadow-xl pt-16">
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none"></div>
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/20 rounded-full blur-3xl shadow-[0_0_50px_rgba(255,255,255,0.6)]"></div>
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-white/20 rounded-full blur-3xl shadow-[0_0_50px_rgba(255,255,255,0.6)]"></div>
          
          <div className="flex items-center gap-3 md:gap-4 mb-2 relative z-10 scale-95 md:scale-100">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              <Icon className="w-5 h-5 md:w-7 md:h-7 text-white drop-shadow-md" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white m-0 leading-tight tracking-[-0.02em] drop-shadow-md">
              {title}
            </h1>
          </div>
          <div className="relative z-10 mt-1 md:mt-2 bg-black/20 backdrop-blur-sm border border-white/10 px-4 py-1.5 rounded-full flex items-center shadow-lg">
            <div className="text-white/90 text-[10px] md:text-xs font-bold tracking-[0.1em] md:tracking-[0.2em] uppercase flex items-center gap-1">
              {date}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-4xl mx-auto px-6 mt-8 pb-24 space-y-8 text-muted-foreground leading-relaxed relative">
          
          {/* Translation Dropdown */}
          <div className="flex justify-end mb-6">
             <div className="relative z-30">
                <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg shadow-sm hover:border-red-500/50 transition-colors group">
                   <Globe2 className="w-4 h-4 text-muted-foreground group-hover:text-red-500 transition-colors" />
                   <select 
                     value={selectedLang}
                     onChange={(e) => setSelectedLang(e.target.value)}
                     className="bg-transparent text-sm font-semibold text-foreground outline-none appearance-none pr-8 cursor-pointer focus:ring-0"
                   >
                     {languages.map(lang => (
                        <option key={lang.code} value={lang.code} className="bg-background text-foreground">
                          {lang.flag} {lang.name}
                        </option>
                     ))}
                   </select>
                   <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 pointer-events-none group-hover:text-red-500 transition-colors" />
                </div>
             </div>
          </div>
          {selectedLang !== 'en' && (
             <div className="bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 p-4 rounded-xl flex items-start gap-3 mb-8">
               <Globe2 className="w-5 h-5 shrink-0 mt-0.5" />
               <p className="text-sm font-medium">
                 Translation Mode Active: Drag the vertical slider right or left to compare the English original text with the translated version.
               </p>
             </div>
          )}
          {children}
        </div>

        {/* Slider Overlay - Bounded to the relative wrapper */}
        <motion.div 
          className="absolute inset-0 z-50 pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: selectedLang === 'en' ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute top-[80px] bottom-0 w-[2px] bg-red-500/80 pointer-events-auto cursor-ew-resize shadow-[0_0_15px_rgba(239,68,68,1)]"
            style={{ x: sliderX, touchAction: 'pan-y' }}
            drag="x"
            dragConstraints={{ left: 0, right: windowWidth }}
            dragElastic={0}
            dragMomentum={false}
          >
            {/* Glassmorphism Handle - Sticky to viewport center */}
            <div className="sticky top-[50vh] left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-20 bg-background/60 backdrop-blur-xl border border-red-500/50 rounded-full flex flex-col items-center justify-center gap-1 shadow-[0_0_30px_rgba(239,68,68,0.4)]">
              <ChevronLeft className="w-4 h-4 text-foreground/80 -mb-1" />
              <div className="w-1 h-1 rounded-full bg-red-500"></div>
              <ChevronRight className="w-4 h-4 text-foreground/80 -mt-1" />
            </div>
          </motion.div>
        </motion.div>
        </div>

        <CTASection />
      </div>
    </TranslationContext.Provider>
  );
};
