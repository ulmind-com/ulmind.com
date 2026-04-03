import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import BlurBlob from "@/components/BlurBlob";
import { technologies } from "@/data/technologies";

export const TechnologySection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const navigate = useNavigate();

  // Show exactly 18 items (3 rows on extra large screens)
  const displayTechnologies = technologies.slice(0, 18);

  return (
    <section ref={ref} className="py-20 bg-secondary/30 relative overflow-hidden">
      <BlurBlob position={{ top: "30%", left: "20%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-cyan-300" opacityClass="opacity-20" />
      <BlurBlob position={{ top: "70%", left: "80%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-indigo-300" opacityClass="opacity-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
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

        {/* TECH GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 justify-items-center">
          {displayTechnologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              whileHover={{ scale: 1.1, y: -10 }}
              className="bg-card rounded-2xl p-6 text-center shadow-card hover:shadow-floating smooth-transition group w-full flex flex-col items-center justify-center"
            >
              <div className="mb-3 group-hover:animate-pulse">
                <tech.icon
                  size={40}
                  color={tech.color}
                  className="mx-auto"
                />
              </div>
              <h3 className="font-semibold text-sm group-hover:text-primary smooth-transition">
                {tech.name}
              </h3>
            </motion.div>
          ))}
        </div>

        {/* SEE MORE BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center mt-16"
        >
          <button
            onClick={() => navigate("/technologies")}
            className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white transition-all duration-300 bg-gradient-to-r from-rose-600 to-red-600 border border-red-500/30 rounded-full hover:from-rose-700 hover:to-red-700 focus:outline-none shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:shadow-[0_0_30px_rgba(225,29,72,0.6)] hover:scale-105"
          >
            Explore All Technologies
            <svg
              className="w-5 h-5 ml-2 -mr-1 transition-transform duration-200 group-hover:translate-x-1"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
};
