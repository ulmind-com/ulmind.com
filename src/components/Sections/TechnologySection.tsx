import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import BlurBlob from "@/components/BlurBlob";
import { technologies } from "@/data/technologies";
import Lottie from "lottie-react";

export const TechnologySection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const navigate = useNavigate();
  const displayTechnologies = technologies.slice(0, 18);
  const [arrowAnimData, setArrowAnimData] = useState<object | null>(null);

  useEffect(() => {
    fetch('/Jason/lottieflow-arrow-08-2-ffffff-easey.json')
      .then((r) => r.json())
      .then((d: any) => {
        const stripped = {
          ...d,
          layers: (d.layers ?? []).filter(
            (l: any) => l.ty !== 1 && !/^bg$/i.test(l.nm ?? '') && !/^background$/i.test(l.nm ?? '')
          ),
        };
        setArrowAnimData(stripped);
      })
      .catch(() => {});
  }, []);

  return (
    <section ref={ref} className="py-20 bg-secondary/30 relative overflow-hidden">
      {/* Scoped CSS — liquid glass cards + CSS stagger reveal */}
      <style>{`
        .home-tech-glass-card {
          border-radius: 24px;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transform: translateZ(0);
          will-change: transform;
          backface-visibility: hidden;
          transition:
            transform 0.22s cubic-bezier(0.22,1,0.36,1),
            box-shadow  0.22s ease,
            background  0.22s ease,
            border-color 0.22s ease;
          opacity: 0;
          animation: htc-fadeup 0.45s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        @keyframes htc-fadeup {
          from { opacity: 0; transform: translateZ(0) translateY(20px); }
          to   { opacity: 1; transform: translateZ(0) translateY(0); }
        }
        :root .home-tech-glass-card {
          background: rgba(255,255,255,0.60);
          border: 1px solid rgba(255,255,255,0.80);
          box-shadow: 0 1px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.95);
        }
        .dark .home-tech-glass-card {
          background: rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.09);
          box-shadow: 0 1px 16px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.10);
        }
        :root .home-tech-glass-card:hover {
          background: rgba(255,255,255,0.80);
          border-color: rgba(255,255,255,1);
          box-shadow: 0 8px 32px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,1);
          transform: translateZ(0) translateY(-6px) scale(1.04);
          backdrop-filter: blur(16px) saturate(200%);
          -webkit-backdrop-filter: blur(16px) saturate(200%);
        }
        .dark .home-tech-glass-card:hover {
          background: rgba(255,255,255,0.10);
          border-color: rgba(255,255,255,0.18);
          box-shadow: 0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.16);
          transform: translateZ(0) translateY(-6px) scale(1.04);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
        }
        .home-tech-card-highlight {
          position: absolute;
          top: 0; left: 16px; right: 16px;
          height: 1px;
          border-radius: 9999px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.70), transparent);
          opacity: 0.7;
          pointer-events: none;
        }
        .home-tech-icon-pill {
          width: 58px; height: 58px;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.22s cubic-bezier(0.22,1,0.36,1), box-shadow 0.22s ease;
          transform: translateZ(0);
        }
        :root .home-tech-icon-pill {
          background: rgba(255,255,255,0.82);
          border: 1px solid rgba(255,255,255,0.95);
          box-shadow: 0 3px 10px rgba(0,0,0,0.06), inset 0 1px 0 #fff;
        }
        .dark .home-tech-icon-pill {
          background: rgba(255,255,255,0.09);
          border: 1px solid rgba(255,255,255,0.13);
          box-shadow: 0 3px 14px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.10);
        }
        .home-tech-glass-card:hover .home-tech-icon-pill {
          transform: translateZ(0) scale(1.12);
        }
        .home-tech-card-label {
          font-size: 12.5px; font-weight: 600;
          letter-spacing: -0.01em; text-align: center; line-height: 1.25;
          transition: color 0.18s ease;
        }
        :root .home-tech-card-label { color: rgba(15,23,42,0.75); }
        .dark  .home-tech-card-label { color: rgba(255,255,255,0.75); }
        :root  .home-tech-glass-card:hover .home-tech-card-label { color: rgba(15,23,42,1); }
        .dark  .home-tech-glass-card:hover .home-tech-card-label { color: rgba(255,255,255,0.96); }
      `}</style>

      <BlurBlob position={{ top: "30%", left: "20%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-cyan-300" opacityClass="opacity-20" />
      <BlurBlob position={{ top: "70%", left: "80%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-indigo-300" opacityClass="opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
        {/* HEADER — single motion.div for the whole section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Our <span className="gradient-text">Technology Stack</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We use cutting-edge technologies to build scalable, performant, and
            future-ready solutions.
          </p>
        </motion.div>

        {/* TECH GRID — CSS stagger, zero per-card JS animation */}
        {inView && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {displayTechnologies.map((tech, index) => (
              <div
                key={tech.name}
                className={`home-tech-glass-card ${index >= 4 ? "hidden sm:block" : ""}`}
                style={{ animationDelay: `${index * 35}ms` }}
                onClick={() => navigate(`/technologies/${tech.slug}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/technologies/${tech.slug}`)}
                aria-label={`Learn more about ${tech.name}`}
              >
                <div className="home-tech-card-highlight" />
                <div className="relative z-10 flex flex-col items-center justify-center gap-3 p-5">
                  <div className="home-tech-icon-pill">
                    <tech.icon size={28} color={tech.color} className="drop-shadow-sm" />
                  </div>
                  <span className="home-tech-card-label">{tech.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EXPLORE BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-16"
        >
          <button
            onClick={() => navigate("/technologies")}
            className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white transition-all duration-300 bg-gradient-to-r from-rose-600 to-red-600 border border-red-500/30 rounded-full hover:from-rose-700 hover:to-red-700 focus:outline-none shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:shadow-[0_0_30px_rgba(225,29,72,0.6)] hover:scale-105"
          >
            Explore All Technologies
            {arrowAnimData ? (
              <Lottie animationData={arrowAnimData} loop autoplay className="w-5 h-5 ml-2 -mr-1 transition-transform duration-200 group-hover:translate-x-1" />
            ) : (
              <svg
                className="w-5 h-5 ml-2 -mr-1 transition-transform duration-200 group-hover:translate-x-1"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            )}
          </button>
        </motion.div>
      </div>
    </section>
  );
};
