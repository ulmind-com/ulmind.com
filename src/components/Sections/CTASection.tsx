import { motion } from "framer-motion";

export const CTASection = () => {
  return (
    <section className="relative overflow-hidden bg-[#ff4d4f] py-28">
      {/* BACKGROUND DECOR */}
      <div className="absolute inset-0 pointer-events-none">
        {/* dotted grid */}
        <div className="absolute right-32 top-1/2 -translate-y-1/2 grid grid-cols-6 gap-3 opacity-15">
          {Array.from({ length: 36 }).map((_, i) => (
            <span key={i} className="w-1.5 h-1.5 bg-white rounded-full" />
          ))}
        </div>

        {/* faint shapes */}
        <div className="absolute top-16 left-24 w-10 h-10 border border-white/20 rotate-45" />
        <div className="absolute top-20 right-24 w-12 h-12 border border-white/20 rotate-12" />
        <div className="absolute bottom-20 right-52 w-8 h-8 border border-white/20 rotate-45" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 items-center gap-16">
          
          {/* LEFT TEXT */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <p className="text-yellow-300 font-semibold mb-4">
              Let’s talk
            </p>

            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight max-w-xl">
              Let’s build something <br />
              awesome together!
            </h2>
          </motion.div>

          {/* RIGHT BOX */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex"
          >
            <div className="w-full max-w-md h-48 border border-white/10 rounded-xl flex items-center justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border-2  px-12 py-4 text-white font-semibold hover:bg-white hover:text-[#ff4d4f] transition-colors"
              >
                Contact us
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
