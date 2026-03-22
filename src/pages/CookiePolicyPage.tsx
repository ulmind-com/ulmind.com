import React from 'react';
import { CTASection } from '@/components/Sections/CTASection';
import BlurBlob from "@/components/BlurBlob";

const CookiePolicyPage = () => {
  return (
    <div className="min-h-screen bg-background pb-20 pt-[80px] md:pt-[10px] relative overflow-hidden">
      <BlurBlob position={{ top: "10%", left: "10%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-cyan-300 dark:bg-cyan-600" opacityClass="opacity-40 dark:opacity-20" />
      <BlurBlob position={{ top: "50%", left: "80%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-fuchsia-300 dark:bg-fuchsia-600" opacityClass="opacity-40 dark:opacity-20" />
      <BlurBlob position={{ top: "90%", left: "20%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-yellow-200 dark:bg-yellow-600" opacityClass="opacity-40 dark:opacity-20" />
      
      {/* Top Banner */}
      <div className="w-full bg-[#F94E4E] h-[120px] md:h-[140px] flex items-center justify-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white m-0 leading-none">
          Cookie Policy
        </h1>
      </div>

      {/* Content Area */}
      <div className="max-w-4xl mx-auto px-6 mt-12 space-y-8 text-muted-foreground leading-relaxed">
        <p>
          This Cookie Policy explains how ULMiND uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
        </p>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">What are Cookies?</h2>
          <p>
            Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Why do we use Cookies?</h2>
          <p>
            <span className="font-bold italic text-foreground">Essential Cookies:</span> These cookies are strictly necessary to provide you with services available through our website and to use some of its features.
          </p>
          <p>
            <span className="font-bold italic text-foreground">Performance & Functionality:</span> These cookies are used to enhance the performance and functionality of our website but are non-essential to their use.
          </p>
        </div>
      </div>
      
      {/* CTA */}
      <CTASection />
    </div>
  );
};

export default CookiePolicyPage;