import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const technologies = [
  { name: 'React', icon: '⚛️', color: '#61DAFB' },
  { name: 'Java', icon: '☕', color: '#007396' },
  { name: 'Spring', icon: '🍃', color: '#6DB33F' },
  { name: 'Node.js', icon: '🟢', color: '#339933' },
  { name: 'Kotlin', icon: '🎯', color: '#7F52FF' },
  { name: 'Python', icon: '🐍', color: '#3776AB' },
  { name: 'Next.js', icon: '▲', color: '#000000' },
  { name: 'Angular', icon: '🅰️', color: '#DD0031' },
  { name: 'Flutter', icon: '💙', color: '#02569B' },
  { name: 'Dart', icon: '🎯', color: '#0175C2' },
  { name: 'React Native', icon: '📱', color: '#61DAFB' },
  { name: 'Docker', icon: '🐳', color: '#2496ED' },
  { name: 'Kubernetes', icon: '☸️', color: '#326CE5' },
  { name: 'Cloud', icon: '☁️', color: '#4285F4' },
];

export const TechnologySection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            We use cutting-edge technologies to build scalable, performant, and future-ready solutions
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.1, y: -10 }}
              className="bg-card rounded-2xl p-6 text-center shadow-card hover:shadow-floating smooth-transition group"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="text-4xl mb-3 group-hover:animate-pulse"
              >
                {tech.icon}
              </motion.div>
              <h3 className="font-semibold text-sm group-hover:text-primary smooth-transition">
                {tech.name}
              </h3>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-primary rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to leverage these technologies?
            </h3>
            <p className="text-white/80 mb-6">
              Let's discuss how we can bring your vision to life with our comprehensive tech stack
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 smooth-transition"
            >
              Start Your Project
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};