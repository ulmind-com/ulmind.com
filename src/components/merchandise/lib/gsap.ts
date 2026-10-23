import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { CustomEase } from "gsap/CustomEase";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, DrawSVGPlugin, CustomEase);
}

const lazy = {
  Flip: () => import("gsap/Flip").then((m) => m.Flip),
  MorphSVGPlugin: () => import("gsap/MorphSVGPlugin").then((m) => m.MorphSVGPlugin),
  MotionPathPlugin: () => import("gsap/MotionPathPlugin").then((m) => m.MotionPathPlugin),
  Physics2DPlugin: () => import("gsap/Physics2DPlugin").then((m) => m.Physics2DPlugin),
  InertiaPlugin: () => import("gsap/InertiaPlugin").then((m) => m.InertiaPlugin),
  Observer: () => import("gsap/Observer").then((m) => m.Observer),
};
type Lazy = typeof lazy;
const loaded = new Map<keyof Lazy, Promise<unknown>>();

export function loadPlugin<K extends keyof Lazy>(name: K): ReturnType<Lazy[K]> {
  if (!loaded.has(name))
    loaded.set(
      name,
      lazy[name]().then((p) => {
        gsap.registerPlugin(p as gsap.Plugin);
        return p;
      }),
    );
  return loaded.get(name) as ReturnType<Lazy[K]>;
}

export const prefersReducedMotion = () => typeof window !== "undefined" && new URLSearchParams(window.location.search).has("static");

export const isRecording = () =>
  typeof window !== "undefined" &&
  (document.documentElement.classList.contains("is-recording") || new URLSearchParams(window.location.search).has("record"));

export { gsap, ScrollTrigger, SplitText, ScrambleTextPlugin, DrawSVGPlugin, CustomEase };
