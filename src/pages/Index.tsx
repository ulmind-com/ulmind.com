import { useRef } from "react";
import { useScroll, useTransform, useSpring } from "framer-motion";

import { HeroSection } from "@/components/Sections/HeroSection";
import { TechnologySection } from "@/components/Sections/TechnologySection";
import { ServicesSection } from "@/components/Sections/ServicesSection";
import { IndustriesSection } from "@/components/Sections/IndustriesSection";
import { AboutPreviewSection } from "@/components/Sections/AboutPreviewSection";
import { CTASection } from "@/components/Sections/CTASection";
import { TestimonialsSection } from "@/components/Sections/TestimonialsSection";
import { NewsletterSection } from "@/components/Sections/NewsletterSection";
import PartnershipSection from "@/components/Sections/PartnershipSection";
import BrandIntroSection from "@/components/Sections/BrandIntroSection";
import TurnpikeAnalystSection from "@/components/Sections/TurnpikeAnalystSection";
import { GlobeSection } from "@/components/Sections/GlobeSection";

const Index = () => {
  /* ===== STACK SCROLL SETUP ===== */
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 30,
    damping: 40,
    restDelta: 0.001,
  });

  const section1Opacity = useTransform(
    smoothProgress,
    [0, 0.33],
    [1, 0]
  );

  const section1Scale = useTransform(
    smoothProgress,
    [0, 0.33],
    [1, 0.9]
  );

  const section2Opacity = useTransform(
    smoothProgress,
    [0.33, 0.66],
    [1, 0]
  );

  const section2Scale = useTransform(
    smoothProgress,
    [0.33, 0.66],
    [1, 0.9]
  );

  /* ===== PAGE ===== */
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection />
        <TechnologySection />
        <ServicesSection />
        <IndustriesSection />
        <AboutPreviewSection />

        {/* --- STACKING ZONE START --- */}
        <div ref={containerRef} className="relative h-[300vh]">

          {/* Partnership Card */}
          <div className="sticky top-0 h-screen w-full flex items-center justify-center">
            <PartnershipSection
              opacity={section1Opacity}
              scale={section1Scale}
            />
          </div>

          {/* Turnpike Analyst Card */}
          <div className="sticky top-0 h-screen w-full flex items-center justify-center">
            <TurnpikeAnalystSection 
              opacity={section2Opacity}
              scale={section2Scale}
            />
          </div>

          {/* Brand Intro Card (Jharkhand Updates) */}
          <div className="sticky top-0 h-screen w-full flex items-center justify-center">
            <BrandIntroSection />
          </div>

        </div>
        {/* --- STACKING ZONE END --- */}

        <TestimonialsSection />
        <NewsletterSection />
        <GlobeSection />
        <CTASection />
      </main>
    </div>
  );
};

export default Index;
