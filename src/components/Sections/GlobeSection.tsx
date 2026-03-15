import { Globe } from "@/components/ui/globe";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { GlobeConfig } from "@/components/ui/globe";

export function GlobeSection() {
  const navigate = useNavigate();

  const globeConfig: GlobeConfig = {
    pointSize: 4,
    globeColor: "#062056",
    showAtmosphere: true,
    atmosphereColor: "#FFFFFF",
    atmosphereAltitude: 0.1,
    emissive: "#062056",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    ambientLight: "#38bdf8",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };

  // Sample data for arcs (Worldwide clients simulation)
  const data = [
    {
      order: 1,
      startLat: -15.7801,
      startLng: -47.9292,
      endLat: 38.7223,
      endLng: -9.1393,
      arcAlt: 0.2,
      color: "#FF5733",
    },
    {
      order: 2,
      startLat: 38.7223,
      startLng: -9.1393,
      endLat: 51.5074,
      endLng: -0.1278,
      arcAlt: 0.2,
      color: "#FF8C00",
    },
    {
      order: 3,
      startLat: 51.5074,
      startLng: -0.1278,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.3,
      color: "#FFD700",
    },
    {
      order: 4,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: -33.8688,
      endLng: 151.2093,
      arcAlt: 0.3,
      color: "#7FFF00",
    },
    {
      order: 5,
      startLat: -33.8688,
      startLng: 151.2093,
      endLat: 22.5726,
      endLng: 88.3639,
      arcAlt: 0.3,
      color: "#00FF7F",
    },
  ];

  return (
    <section className="relative w-full h-[600px] bg-background overflow-hidden border-t">
      <div className="absolute inset-x-0 w-full h-[600px] z-0">
        <Globe globeConfig={globeConfig} data={data} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center pointer-events-none pb-20">
        <div className="max-w-2xl pointer-events-auto">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground mb-6 leading-[1.1] tracking-tight">
            Trusted by<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-orange-500">
              Clients Worldwide
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-lg">
            Delivering cutting-edge digital solutions to partners across the globe. Join our network of successful businesses today.
          </p>
          <div className="flex gap-4">
            <Button
              size="lg"
              onClick={() => navigate('/contact')}
              className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-8 py-6 text-base font-bold shadow-lg transition-transform hover:scale-105 group"
            >
              Get Started
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/about')}
              className="rounded-full px-8 py-6 text-base font-bold border-2"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
      
      {/* Gradient overlay for fade effect to match aceternity demo */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background via-transparent to-background dark:opacity-80 opacity-0 z-0"></div>
    </section>
  );
}
