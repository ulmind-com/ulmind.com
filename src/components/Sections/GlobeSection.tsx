import { Globe } from "@/components/ui/globe";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function GlobeSection() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full min-h-[600px] bg-[#0B0B0F] overflow-hidden">
      {/* Globe positioned to the right */}
      <div className="absolute right-[-10%] md:right-[-5%] top-1/2 -translate-y-1/2 w-[80%] sm:w-[60%] md:w-[50%] opacity-80 pointer-events-auto">
        <Globe />
      </div>

      {/* Content overlay on the left */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-full flex flex-col justify-center min-h-[600px] py-20">
        <div className="max-w-xl">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight">
            Trusted by{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-orange-400">
              Clients Worldwide
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-lg leading-relaxed">
            Delivering cutting-edge digital solutions to partners across the globe. Join our network of successful businesses today.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              onClick={() => navigate("/contact")}
              className="bg-white text-black hover:bg-gray-200 rounded-full px-8 py-6 text-base font-bold shadow-lg transition-transform hover:scale-105 group"
            >
              Get Started
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/about")}
              className="rounded-full px-8 py-6 text-base font-bold border-2 border-gray-600 text-white hover:bg-white/10"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
