import { motion, MotionValue } from "framer-motion";
import { Search } from "lucide-react";

interface TurnpikeAnalystSectionProps {
  opacity?: MotionValue<number>;
  scale?: MotionValue<number>;
}

const TurnpikeAnalystSection = ({ opacity, scale }: TurnpikeAnalystSectionProps) => {
  return (
    <motion.section 
      style={{ opacity, scale }}
      className="relative h-screen w-full flex items-center justify-center z-30 px-4 md:px-10"
    >
      <div 
        className="w-full max-w-6xl h-[85vh] md:h-[80vh] rounded-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] border border-white/10 flex items-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #004d40, #013552)' }}
      >

        {/* Premium Blue + Green Mix Blurs */}
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[#00ff87] opacity-25 blur-[130px] rounded-full -translate-y-1/3 -translate-x-1/4" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#00a2ff] opacity-25 blur-[130px] rounded-full translate-y-1/3 translate-x-1/4" />

        <div className="absolute top-6 md:top-10 left-1/2 -translate-x-1/2 z-20">
          <h3 className="font-display text-2xl md:text-5xl font-black text-white/70">
            Our Partners
          </h3>
        </div>

        <div className="container mx-auto px-8 lg:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <img src="/Turnpikeanalyst.png" alt="Turnpike Analyst" className="w-28 md:w-36 mb-4" />
              <h2 className="text-4xl md:text-6xl font-black text-white">
                Turnpike <span className="block text-white/70">Analyst</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-lg text-white/80 max-w-md">
                Turnpike Analyst empowers businesses with cutting-edge analytics, strategic insights, and premium data solutions for unparalleled growth.
              </p>
              <div className="h-0.5 w-12 bg-white/30 mt-8" />
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[90%] md:w-auto">
          <a 
            href="http://www.turnpikeanalyst.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between bg-[#0a2735] border border-white/20 rounded-full px-5 py-3 shadow-lg w-full md:w-auto hover:bg-[#103a4f] transition-colors cursor-pointer"
          >
            <span className="text-white/90 text-sm md:text-base">
              www.turnpikeanalyst.com
            </span>
            <div className="ml-4 w-9 h-9 flex items-center justify-center border border-white/30 rounded-full text-white/90">
              <Search size={16} />
            </div>
          </a>
        </div>

      </div>
    </motion.section>
  );
};

export default TurnpikeAnalystSection;
