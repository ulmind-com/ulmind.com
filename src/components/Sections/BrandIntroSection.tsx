import { motion } from "framer-motion";

const BrandIntroSection = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center z-20 px-4 md:px-10">
      <div className="w-full max-w-6xl h-[85vh] md:h-[80vh] bg-[#004225] rounded-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] border border-white/10 flex items-center relative overflow-hidden">

        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[#d7e812] opacity-45 blur-[130px] rounded-full -translate-y-1/3 -translate-x-1/4" />

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
              <img src="/public/JBU.png" className="w-28 md:w-36 mb-4" />
              <h2 className="text-4xl md:text-6xl font-black text-white">
                JharkhandBihar <span className="block text-white/70">Update</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-lg text-white/80 max-w-md">
                JharkhandBihar Update is a trusted regional digital news platform delivering authentic stories across Jharkhand and Bihar.
              </p>
              <div className="h-0.5 w-12 bg-white/30 mt-8" />
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[90%] md:w-auto">
          <div className="flex items-center justify-between bg-[#0f3f2a] border border-white/20 rounded-full px-5 py-3 shadow-lg w-full md:w-auto">
            <span className="text-white/90 text-sm md:text-base">
              www.jharkhandbiharupdates.com
            </span>
            <div className="ml-4 w-9 h-9 flex items-center justify-center border border-white/30 rounded-full">
              🔍
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default BrandIntroSection;
