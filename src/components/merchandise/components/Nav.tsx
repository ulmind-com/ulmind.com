import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";
import Magnetic from "./Magnetic";
import { NAV } from "../content";
import { onKerbLift } from "../lib/kerb";
import { isStatic } from "../lib/motion";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [tone, setTone] = useState<"ink" | "white">("ink");
  const [bag, setBag] = useState(0);
  const [hl, setHl] = useState({ y: 0, h: 0, on: false });
  const root = useRef<HTMLElement>(null);
  const bagEl = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0, last = "";
    const loop = () => {
      const y = 90;
      let t = "light";
      document.querySelectorAll<HTMLElement>("[data-nav]").forEach((s) => {
        const r = s.getBoundingClientRect();
        if (r.top <= y && r.bottom > y) t = s.dataset.nav!;
      });
      if (t !== last) { last = t; setTone(t === "dark" ? "white" : "ink"); }
      raf = requestAnimationFrame(loop);
    };
    loop();
    const onBag = () => {
      setBag((b) => b + 1);
      if (bagEl.current && !isStatic()) gsap.fromTo(bagEl.current, { scale: 1.6 }, { scale: 1, duration: 0.6, ease: "elastic.out(1,0.5)" });
    };
    window.addEventListener("ulmind:bag", onBag);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("ulmind:bag", onBag); };
  }, []);

  useEffect(() => {
    if (isStatic()) return;
    return onKerbLift(() => gsap.fromTo(root.current, { y: -70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.4 }));
  }, []);

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setOpen(false);
    const el = document.querySelector(href);
    if (el) {
      const lenis = (window as any).__lenis;
      if (lenis?.scrollTo) {
        lenis.scrollTo(el as HTMLElement, { duration: 1.6 });
      } else {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav ref={root} className={`k-nav ${tone === "white" ? "is-white" : ""} ${open ? "is-open" : ""}`} aria-label="Merchandise Sub-Navigation">
      <a href="#hero" className="k-logo" onClick={(e) => go(e, "#hero")}><b>ULMIND</b><i>STUDIO</i></a>
      <div className="k-tab" onMouseEnter={() => setOpen(true)} onMouseLeave={() => { setOpen(false); setHl((h) => ({ ...h, on: false })); }}>
        <Magnetic strength={0.2}>
          <button type="button" className="k-tab-btn" aria-expanded={open} onClick={() => setOpen((o) => !o)} onFocus={() => setOpen(true)}>
            <span className="k-tab-dots" aria-hidden><i /><i /><i /></span>Menu
            <span ref={bagEl} data-bag className="k-bag">Bag {bag}</span>
          </button>
        </Magnetic>
        <div className="k-panel" role="menu">
          <span className="k-hl" style={{ transform: `translateY(${hl.y}px)`, height: hl.h, opacity: hl.on ? 1 : 0 }} />
          {NAV.map((n) => (
            <a key={n.href} href={n.href} role="menuitem" onClick={(e) => go(e, n.href)}
              onMouseEnter={(e) => setHl({ y: e.currentTarget.offsetTop, h: e.currentTarget.offsetHeight, on: true })}>{n.label}<em>→</em></a>
          ))}
        </div>
      </div>
    </nav>
  );
}
