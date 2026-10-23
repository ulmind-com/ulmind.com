import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { IMG, SHOP, inrNote } from "../content";
import { isStatic } from "../lib/motion";

/** PS14 tile grid, wave-stagger from the top-left tile. */
export default function Shop() {
  const root = useRef<HTMLElement>(null);
  const head = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isStatic()) return;
    if (!head.current) return;
    const st = ScrollTrigger.create({ trigger: head.current, start: "top top+=130", end: "bottom top+=40", scrub: true, onUpdate: (self) => { if (head.current) head.current.style.opacity = String(1 - self.progress); }, onRefresh: (self) => { if (head.current) head.current.style.opacity = String(1 - self.progress); } });
    return () => st.kill();
  }, []);

  useEffect(() => {
    if (isStatic()) return;
    if (!root.current) return;
    const tiles = Array.from(root.current.querySelectorAll<HTMLElement>(".sh-tile"));
    const order = tiles.map((_, i) => (i % 4) + Math.floor(i / 4));
    gsap.set(tiles, { opacity: 0, scale: 0.78, y: 40 });
    const play = () => gsap.to(tiles, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.5)", delay: (i: number) => order[i] * 0.09, overwrite: true });
    const out = () => gsap.to(tiles, { opacity: 0, scale: 0.78, y: 40, duration: 0.35, overwrite: true });
    const st = ScrollTrigger.create({ trigger: root.current, start: "top 65%", end: "bottom 15%", onEnter: play, onEnterBack: play, onLeaveBack: out, onLeave: out });
    return () => st.kill();
  }, []);

  return (
    <section ref={root} id="shop" data-nav="light" className="shop">
      <div className="container-x">
        <div ref={head} className="sh-head">
          <h2 className="k-h2">The full<br />drop</h2>
          <p>Eight tiles, six pieces. Hover a tile to see the back.</p>
        </div>
        <div className="sh-grid">
          {SHOP.map((s, i) => (
            <article key={i} className="sh-tile" {...(i === 1 ? { "data-hover-demo": true } : {})} data-cursor="View">
              <div className="sh-img">
                <img src={IMG(s.front)} alt={`${s.name}, ${s.sub}`} />
                {s.back && <img className="b" src={IMG(s.back)} alt="" aria-hidden />}
              </div>
              <h3>{s.name}</h3>
              <p>{s.sub}</p>
              <div className="sh-mrp"><span>{inrNote(s.price)}</span><i>+</i></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
