import React from "react";
import { MacbookScroll } from "@/components/ui/macbook-scroll";

import image1 from "@/assets/GD/image1.jpg";
import image2 from "@/assets/GD/image2.jpg";
import image3 from "@/assets/GD/image3.jpg";



export function MacbookScrollSection() {
  return (
    <div className="w-full overflow-hidden bg-background">
      <MacbookScroll
        title={
          <div className="flex flex-col items-center justify-center -mt-48 mb-8 px-4">
            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground drop-shadow-md tracking-tight text-center">
              Crafting the Future of
            </span>
            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-orange-500 drop-shadow-sm mt-2 text-center">
              Digital Experiences.
            </span>
          </div>
        }

        src={[
          image1,
          image2,
          image3,
        ]}
        showGradient={false}
      />
    </div>
  );
}
