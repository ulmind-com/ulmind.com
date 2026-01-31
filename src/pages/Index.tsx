import { HeroSection } from '@/components/Sections/HeroSection';
import { TechnologySection } from '@/components/Sections/TechnologySection';
import { ServicesSection } from '@/components/Sections/ServicesSection';
import { AboutPreviewSection } from '@/components/Sections/AboutPreviewSection';
import { ContactSection } from '@/components/Sections/ContactSection';
import { Navbar } from '@/components/Layout/Navbar';
import { Footer } from '@/components/Layout/Footer';
import { TestimonialsSection } from '@/components/Sections/TestimonialsSection';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <TechnologySection />
        <ServicesSection />
        <AboutPreviewSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
