import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { loading } from "../lib/loading";
import { kerb, loadFilm } from "../lib/kerb";
import { IMG } from "../content";

const PRELOAD = ["hoodie-front", "hoodie-back", "puffer-front", "tee-front", "cargo-front", "cap-front", "socks-front", "hoodie-ember"];
const W = 440, H = 176;

/** I-code "woven neck label": a woven label stitches itself in as the real load % climbs */
export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (prefersReducedMotion()) { setGone(true); kerb.lift(); loading.markFinished(); return; }
    const lenis = (window as any).__lenis;
    lenis?.stop();
    const pct = el.querySelector<HTMLElement>("[data-pct]");
    const edge = el.querySelector<SVGRectElement>("[data-edge]");
    const wordClip = el.querySelector<SVGRectElement>("[data-wordclip]");
    const needle = el.querySelector<SVGGElement>("[data-needle]");
    const thread = el.querySelector<SVGLineElement>("[data-thread]");
    const label = el.querySelector<HTMLElement>(".kl-label");
    const panel = el.querySelector<HTMLElement>(".kl-bg");

    loading.register("kl-time");
    loading.register("kl-imgs");
    let imgsDone = 0;
    PRELOAD.forEach((n) => {
      const i = new Image();
      const fin = () => { imgsDone++; loading.update("kl-imgs", imgsDone / PRELOAD.length); };
      i.onload = fin; i.onerror = fin; i.src = IMG(n);
    });
    loading.register("kl-film");
    loadFilm((p) => loading.update("kl-film", p));
    const t0 = performance.now();
    const MIN = 2400;
    const timer = setInterval(() => loading.update("kl-time", Math.min(1, (performance.now() - t0) / MIN)), 60);

    let shown = 0, exiting = false, stitchT = 0;
    const paint = (p: number) => {
      if (!pct || !edge || !wordClip || !needle || !thread) return;
      pct.textContent = String(Math.round(p * 100)).padStart(2, "0");
      edge.style.strokeDasharray = `${p * 1000} 1000`;
      wordClip.setAttribute("width", String(W * p));
      const x = 28 + (W - 56) * p;
      needle.setAttribute("transform", `translate(${x} ${stitchT})`);
      thread.setAttribute("x2", String(x));
    };
    const bob = gsap.ticker.add((t) => { stitchT = Math.sin(t * 14) * 7; paint(shown); });

    const exit = () => {
      if (exiting) return;
      exiting = true; unsub(); clearInterval(timer); clearTimeout(hard);
      shown = 1;
      if (!label || !panel) {
        gsap.ticker.remove(bob);
        setGone(true);
        kerb.lift();
        loading.markFinished();
        lenis?.start();
        return;
      }
      gsap.timeline()
        .to(label, { scale: 1.04, duration: 0.25, ease: "power2.out" })
        .add(() => kerb.lift(), "<0.05")
        .to(label, { yPercent: -150, rotate: -4, duration: 0.95, ease: "power3.in" }, ">")
        .to(panel, { clipPath: "inset(0 0 100% 0)", duration: 0.85, ease: "power4.inOut" }, "<0.18")
        .add(() => { gsap.ticker.remove(bob); setGone(true); lenis?.start(); loading.markFinished(); }, ">");
    };
    const hard = setTimeout(exit, 9000);
    const unsub = loading.subscribe((p, done) => {
      if (exiting) return;
      shown = Math.max(shown, p);
      if (done) exit();
    });
    return () => { gsap.ticker.remove(bob); clearInterval(timer); clearTimeout(hard); unsub(); };
  }, []);

  if (gone) return null;
  return (
    <div ref={root} data-loader className="kl" aria-hidden>
      <div className="kl-bg" />
      <div className="kl-label">
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
          <defs>
            <clipPath id="kl-wc"><rect data-wordclip x="0" y="0" width="0" height={H} /></clipPath>
            <pattern id="kl-weave" width="6" height="6" patternUnits="userSpaceOnUse">
              <rect width="6" height="6" fill="#EBE6D6" />
              <path d="M0 3H6M3 0V6" stroke="#D8D2BF" strokeWidth="1" />
            </pattern>
          </defs>
          <rect x="0" y="0" width={W} height={H} fill="url(#kl-weave)" />
          <rect x="14" y="14" width={W - 28} height={H - 28} fill="none" stroke="#B8B19B" strokeWidth="2" strokeDasharray="7 6" opacity=".55" />
          <rect data-edge x="14" y="14" width={W - 28} height={H - 28} fill="none" stroke="#0E0F11" strokeWidth="2.4" strokeDasharray="0 1000" pathLength="1000" />
          <g clipPath="url(#kl-wc)">
            <text x={W / 2} y="86" textAnchor="middle" className="kl-word">ULMIND</text>
            <text x={W / 2} y="116" textAnchor="middle" className="kl-sub">STUDIO · DROP 07 · 100% COTTON</text>
          </g>
          <line x1="28" y1="140" x2="28" y2="140" data-thread stroke="#EC6A2C" strokeWidth="2" strokeDasharray="5 4" />
          <g data-needle transform="translate(28 140)">
            <path d="M-2 -26 L2 -26 L1 12 L-1 12 Z" fill="#8f9399" />
            <ellipse cx="0" cy="-20" rx="1.1" ry="3" fill="#EBE6D6" />
          </g>
        </svg>
        <div className="kl-pct"><b data-pct>00</b><i>%</i></div>
      </div>
    </div>
  );
}
