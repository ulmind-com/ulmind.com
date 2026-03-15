"use client";
import { Globe3D, GlobeMarker } from "@/components/ui/3d-globe";
import { BlobButton } from "@/components/ui/blob-button";
import { useNavigate } from "react-router-dom";

const sampleMarkers: GlobeMarker[] = [
  { lat: 40.7128, lng: -74.006, src: "https://assets.aceternity.com/avatars/1.webp", label: "New York" },
  { lat: 51.5074, lng: -0.1278, src: "https://assets.aceternity.com/avatars/2.webp", label: "London" },
  { lat: 35.6762, lng: 139.6503, src: "https://assets.aceternity.com/avatars/3.webp", label: "Tokyo" },
  { lat: -33.8688, lng: 151.2093, src: "https://assets.aceternity.com/avatars/4.webp", label: "Sydney" },
  { lat: 48.8566, lng: 2.3522, src: "https://assets.aceternity.com/avatars/5.webp", label: "Paris" },
  { lat: 28.6139, lng: 77.209, src: "https://assets.aceternity.com/avatars/6.webp", label: "New Delhi" },
  { lat: 55.7558, lng: 37.6173, src: "https://assets.aceternity.com/avatars/7.webp", label: "Moscow" },
  { lat: -22.9068, lng: -43.1729, src: "https://assets.aceternity.com/avatars/8.webp", label: "Rio de Janeiro" },
  { lat: 31.2304, lng: 121.4737, src: "https://assets.aceternity.com/avatars/9.webp", label: "Shanghai" },
  { lat: 25.2048, lng: 55.2708, src: "https://assets.aceternity.com/avatars/10.webp", label: "Dubai" },
  { lat: -34.6037, lng: -58.3816, src: "https://assets.aceternity.com/avatars/11.webp", label: "Buenos Aires" },
  { lat: 1.3521, lng: 103.8198, src: "https://assets.aceternity.com/avatars/12.webp", label: "Singapore" },
  { lat: 37.5665, lng: 126.978, src: "https://assets.aceternity.com/avatars/13.webp", label: "Seoul" },
];

export function GlobeSection() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-7xl px-4 my-16">
      {/* Container height adjusted for mobile to give the globe breathing room, md: stays exactly same */}
      <div className="relative mx-auto h-[550px] md:h-[500px] w-full overflow-hidden rounded-2xl md:rounded-xl bg-white dark:bg-[#0a0a0a] shadow-sm ring-1 ring-black/10 dark:ring-white/10 transition-colors duration-300">
        
        {/* Z-index increased to 20 so text stays clearly above the globe on mobile */}
        <div className="relative z-20 p-6 pt-10 md:p-12 pointer-events-none">
          <h2 className="mb-4 max-w-2xl text-4xl font-extrabold tracking-tight text-balance text-neutral-900 dark:text-white md:text-5xl lg:text-6xl">
            Play all over the <br /> world with a click.
          </h2>
          <p className="mt-2 max-w-lg text-balance text-neutral-600 dark:text-neutral-400 md:mt-8 text-base md:text-lg">
            Sign up for an account and start posting all over the world with one
            click. Join our network of successful businesses today.
          </p>

          <div className="mt-8 md:mt-12 flex gap-4 pointer-events-auto">
            <BlobButton onClick={() => navigate("/contact")}>
              Get Started
            </BlobButton>
          </div>
        </div>

        {/* Mobile view: Centered at the bottom (left-1/2, -translate-x-1/2) for a premium balanced look
            Desktop view: Resets alignment (md:left-auto, md:translate-x-0) and matches your original perfect positioning 
        */}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-[220px] sm:-bottom-[280px] md:left-auto md:translate-x-0 md:-right-[300px] md:-bottom-[450px] lg:-right-[350px] lg:-bottom-[500px] z-10 w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] md:w-[900px] md:h-[900px] lg:w-[1000px] lg:h-[1000px]">
          <Globe3D
            className="h-full w-full cursor-grab active:cursor-grabbing"
            markers={sampleMarkers}
            config={{
              atmosphereColor: "#4da6ff",
              atmosphereIntensity: 20,
              bumpScale: 5,
              autoRotateSpeed: 1.0, 
            }}
            onMarkerClick={(marker) => {
              console.log("Clicked marker:", marker.label);
            }}
            onMarkerHover={(marker) => {
              if (marker) {
                console.log("Hovering:", marker.label);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}