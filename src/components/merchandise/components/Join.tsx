import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { isStatic } from "../lib/motion";

const LINES = [
  "KERBCODE STUDIO · DROP 07",
  "---------------------------",
  "ENTRY .......... DROP LIST",
  "OPENS .......... 05 DEC 8PM",
  "PIECES ......... 6",
  "RESTOCKS ....... NONE",
  "---------------------------",
];

/** Launch signup: queue ticket print-out line by line. */
export default function Join() {
  const root = useRef<HTMLElement>(null);
  const num = useRef<HTMLElement>(null);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!root.current) return;
    const lines = root.current.querySelectorAll<HTMLElement>(".jn-line");
    const ticket = root.current.querySelector<HTMLElement>(".jn-ticket");
    if (!ticket || !num.current) return;
    if (isStatic()) { num.current.textContent = "12,480"; return; }
    const o = { n: 0 };
    gsap.set(lines, { clipPath: "inset(0 100% 0 0)", opacity: 1 });
    gsap.set(ticket, { yPercent: -4 });
    const tl = gsap.timeline({ paused: true })
      .to(ticket, { yPercent: 0, duration: 0.6, ease: "power3.out" })
      .to(lines, { clipPath: "inset(0 0% 0 0)", duration: 0.35, ease: "steps(14)", stagger: 0.22 }, 0.2)
      .to(o, { n: 12480, duration: 1.6, ease: "power2.out", onUpdate: () => { if (num.current) num.current.textContent = Math.round(o.n).toLocaleString("en-IN"); } }, ">-0.2");
    const st = ScrollTrigger.create({
      trigger: root.current, start: "top 60%", end: "bottom 10%",
      onEnter: () => tl.play(0), onEnterBack: () => tl.play(0), onLeave: () => tl.pause(0), onLeaveBack: () => tl.pause(0),
    });
    return () => { st.kill(); tl.kill(); };
  }, []);

  return (
    <section ref={root} id="join" data-nav="light" className="join">
      <div className="container-x jn-in">
        <div className="jn-copy">
          <p className="k-eyebrow">Drop list</p>
          <h2 className="k-h2">Join the<br />line</h2>
          <p className="jn-sub">Get the code before the doors open. One email, no spam.</p>
          <form className="jn-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <label className="jn-field">
              <input type="email" required placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email" />
              <i />
            </label>
            <button type="submit" className="jn-btn" data-cursor="Go" data-hover-demo><span>{sent ? "You're in (sample)" : "Join the list"}</span></button>
          </form>
        </div>
        <div className="jn-ticket" aria-label="Queue ticket">
          <div className="jn-tape" aria-hidden />
          <div className="jn-pre">{LINES.map((l, i) => <span key={i} className="jn-line">{l}</span>)}
            <span className="jn-line jn-big">YOU ARE # <b ref={num}>12,480</b></span>
            <span className="jn-line">IN LINE (SAMPLE)</span></div>
          <div className="jn-bars" aria-hidden />
        </div>
      </div>
    </section>
  );
}
