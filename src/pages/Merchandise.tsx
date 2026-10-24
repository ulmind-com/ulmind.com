import React, { useEffect } from "react";
import { useTheme } from "next-themes";
import { useLenis } from "@studio-freight/react-lenis";
import { ScrollTrigger } from "@/components/merchandise/lib/gsap";
import Nav from "@/components/merchandise/components/Nav";
import CinematicHero from "@/components/merchandise/components/CinematicHero";
import Hero from "@/components/merchandise/components/Hero";
import Lineup from "@/components/merchandise/components/Lineup";
import Clock from "@/components/merchandise/components/Clock";
import Product from "@/components/merchandise/components/Product";
import Print from "@/components/merchandise/components/Print";
import Fabric from "@/components/merchandise/components/Fabric";
import Night from "@/components/merchandise/components/Night";
import Shop from "@/components/merchandise/components/Shop";
import Looks from "@/components/merchandise/components/Looks";
import Fit from "@/components/merchandise/components/Fit";
import Featured from "@/components/merchandise/components/Featured";
import Join from "@/components/merchandise/components/Join";
import Seam from "@/components/merchandise/components/Seam";
import Animations from "@/components/merchandise/components/Animations";
import { colorsLight, colorsDark } from "@/components/merchandise/site";
import "@/components/merchandise/merchandise.css";

export default function Merchandise() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const C = isDark ? colorsDark : colorsLight;

  // Sync ReactLenis with GSAP ScrollTrigger
  useLenis((lenis) => {
    (window as any).__lenis = lenis;
    ScrollTrigger.update();
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);
    return () => clearTimeout(timer);
  }, [resolvedTheme]);

  return (
    <>
      <Animations />
      <Nav />
      <main className="k-main">
        <CinematicHero />
        <Hero />
        <Seam kind="diag" from={C.khaki} />
        <Lineup />
        <Seam kind="curve" from={C.studio} />
        <Clock />
        <Seam kind="stairs" from={C.clock} />
        <Product />
        <Seam kind="panel" from={C.sky} />
        <Print />
        <Seam kind="notch" from={C.tile} />
        <Fabric />
        <Seam kind="wash" from={C.fabric} to={C.teal} h={40} />
        <Night />
        <Seam kind="diagR" from={C.nightEnd} />
        <Shop />
        <Seam kind="curve" from={C.snow} />
        <Looks />
        <Seam kind="diag" from={C.looks} />
        <Fit />
        <Seam kind="stairs" from={C.studio} />
        <Featured />
        <Seam kind="notch" from={C.ink} />
        <Join />
        <Seam kind="diagR" from={C.orange} />
      </main>
    </>
  );
}
