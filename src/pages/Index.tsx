import { useRef } from "react";
import { useScroll, useTransform, useSpring } from "framer-motion";

import { HeroSection } from "@/components/Sections/HeroSection";
import { TechnologySection } from "@/components/Sections/TechnologySection";
import { ServicesSection } from "@/components/Sections/ServicesSection";
import { AboutPreviewSection } from "@/components/Sections/AboutPreviewSection";
import { CTASection } from "@/components/Sections/CTASection";
import { TestimonialsSection } from "@/components/Sections/TestimonialsSection";
import PartnershipSection from "@/components/Sections/PartnershipSection";
import BrandIntroSection from "@/components/Sections/BrandIntroSection";

const Index = () => {
  /* ===== STACK SCROLL SETUP ===== */
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const section1Opacity = useTransform(
    smoothProgress,
    [0, 0.4],
    [1, 0]
  );

  const section1Scale = useTransform(
    smoothProgress,
    [0, 0.5],
    [1, 0.95]
  );

  /* ===== PAGE ===== */
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection />
        <TechnologySection />
        <ServicesSection />
        <AboutPreviewSection />

        {/* --- STACKING ZONE START --- */}
        <div ref={containerRef} className="relative h-[200vh]">

          {/* Partnership Card */}
          <div className="sticky top-0 h-screen w-full flex items-center justify-center">
            <PartnershipSection
              opacity={section1Opacity}
              scale={section1Scale}
            />
          </div>

          {/* Brand Intro Card */}
          <div className="sticky top-0 h-screen w-full flex items-center justify-center">
            <BrandIntroSection />
          </div>

        </div>
        {/* --- STACKING ZONE END --- */}

        <TestimonialsSection />
        <CTASection />
      </main>
    </div>
  );
};

export default Index;
