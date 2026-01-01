import { HeroSection } from '@/components/Sections/HeroSection';
import { TechnologySection } from '@/components/Sections/TechnologySection';
import { ServicesSection } from '@/components/Sections/ServicesSection';
import { AboutPreviewSection } from '@/components/Sections/AboutPreviewSection';
import { CTASection } from '@/components/Sections/CTASection';
import { TestimonialsSection } from '@/components/Sections/TestimonialsSection';

const Index = () => {
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection />
        <TechnologySection />
        <ServicesSection />
        <AboutPreviewSection />
        <TestimonialsSection />
        <CTASection />
      </main>
    </div>
  );
};

export default Index;
