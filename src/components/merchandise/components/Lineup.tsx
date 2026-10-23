import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";
import { IMG, PIECES, inrNote } from "../content";
import { usePinProgress, isStatic, pad2 } from "../lib/motion";

/** Two stacked cut-outs: the old piece slides out and fades, the new one fades in.
 *  Scroll steps one piece at a time (both ways); idle: auto-advances every ~3 s. */
export default function Lineup() {
  const outer = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const cur = useRef(0), front = useRef(0), lastScroll = useRef({ idx: 0, at: 0 }), vis = useRef(false);
  const ghost = useRef<HTMLDivElement>(null);

  const show = (i: number) => {
    if (i === cur.current) return;
    cur.current = i; setIdx(i);
    const L = stage.current?.querySelectorAll<HTMLImageElement>(".ls-l");
    if (!L || L.length < 2) return;
    if (isStatic()) { L[0].src = IMG(PIECES[i].front); return; }
    const from = L[front.current], to = L[1 - front.current];
    front.current = 1 - front.current;
    gsap.killTweensOf([from, to]);
    to.src = IMG(PIECES[i].front);
    gsap.fromTo(to, { opacity: 0, x: 36, scale: 0.96 }, { opacity: 1, x: 0, scale: 1, duration: 0.5, delay: 0.2, ease: "power2.out" });
    gsap.to(from, { opacity: 0, x: -36, scale: 0.96, duration: 0.3, ease: "power2.in" });
  };

  usePinProgress(outer, (p) => {
    gsap.set(ghost.current, { x: -p * 420 });
    const i = Math.min(PIECES.length - 1, Math.floor(p * PIECES.length));
    if (i !== lastScroll.current.idx) { lastScroll.current = { idx: i, at: performance.now() }; show(i); }
  }, 0);

  useEffect(() => {
    if (isStatic()) return;
    if (!outer.current) return;
    const io = new IntersectionObserver(([e]) => (vis.current = e.isIntersecting), { threshold: 0.3 });
    io.observe(outer.current);
    const iv = setInterval(() => {
      if (!vis.current || performance.now() - lastScroll.current.at < 3000) return;
      lastScroll.current.at = performance.now();
      show((cur.current + 1) % PIECES.length);
    }, 3200);
    return () => { io.disconnect(); clearInterval(iv); };
  }, []);

  const p = PIECES[idx];
  return (
    <section ref={outer} id="lineup" data-nav="light" className="pin lineup" style={{ ["--pin" as string]: "480vh" }}>
      <div className="pin-in">
        <div ref={ghost} className="ls-ghost" aria-hidden>LINE-UP · DROP 07 · LINE-UP</div>
        <ol className="ls-list" data-reveal="stagger">
          {PIECES.map((x, i) => (
            <li key={x.id} className={i === idx ? "on" : ""} {...(i === 3 ? { "data-hover-demo": true } : {})}
              onMouseEnter={() => { lastScroll.current.at = performance.now(); show(i); }}>
              <span>{pad2(i + 1)}</span><b>{x.name}</b><em>{inrNote(x.price)}</em>
            </li>
          ))}
        </ol>
        <div ref={stage} className="ls-stage" role="img" aria-label={`${p.name}, front`}>
          {[0, 1].map((l) => (
            <img key={l} className="ls-l" src={IMG(PIECES[0].front)} alt="" draggable={false} style={{ opacity: l === 0 ? 1 : 0 }} />
          ))}
        </div>
        <div className="ls-info">
          <i className="ls-tag">ORIGINAL</i>
          <div key={p.id} className="ls-word">{p.word}</div>
          <p>{p.note}</p>
          <a href="#shop" className="ls-more" data-cursor="Shop"><span>View more</span><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
        </div>
        <p className="ls-count">{pad2(idx + 1)} / {pad2(PIECES.length)}</p>
      </div>
    </section>
  );
}
