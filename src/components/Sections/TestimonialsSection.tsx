import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Quote } from 'lucide-react';

const testimonials = [
  // Upper row (left to right animation)
  {
    name: "Anuska",
    username: "@anuska",
    text: "This is hands down the best thing I've experienced. Highly recommend!",
    avatar: "👩‍💼"
  },
  {
    name: "Sujay",
    username: "@sujay",
    text: "I've never seen anything like this before. It's amazing, I love it.",
    avatar: "👨‍💻"
  },
  {
    name: "Anirban",
    username: "@anirban",
    text: "I don't know what to say. I'm speechless. This is amazing.",
    avatar: "👨‍🎨"
  },
  {
    name: "Priyobrata",
    username: "@priyobrata",
    text: "I'm at a loss for words. This is amazing. I love it.",
    avatar: "👨‍🔬"
  }
];

const bottomTestimonials = [
  // Bottom row (right to left animation)
  {
    name: "Chandan",
    username: "@chandan",
    text: "This exceeded all my expectations. Absolutely stunning!",
    avatar: "👨‍🚀"
  },
  {
    name: "Rajanya",
    username: "@rajanya",
    text: "Simply breathtaking. The best decision I've made in a while.",
    avatar: "👩‍🎓"
  },
  {
    name: "Abdul",
    username: "@abdul",
    text: "So glad I found this. It has changed the game for me.",
    avatar: "👨‍🎤"
  },
  {
    name: "Anwesha",
    username: "@anwesha",
    text: "Incredible work! The attention to detail is phenomenal.",
    avatar: "👩‍🎨"
  }
];

const TestimonialCard = ({ testimonial }: { 
  testimonial: typeof testimonials[0]
}) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.05,
        y: -8,
        transition: { duration: 0.3 }
      }}
      className="glass-card p-6 rounded-2xl border border-primary/20 backdrop-blur-lg bg-card/80 hover:bg-card/90 transition-all duration-300 group flex-shrink-0 w-80 h-48 shadow-lg hover:shadow-xl hover:shadow-primary/20 dark:border-primary/30 dark:bg-card/60 dark:hover:bg-card/80"
    >
      <div className="flex items-start space-x-4 h-full">
        <div className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300 bg-primary/10 dark:bg-primary/20 p-2 rounded-full">
          {testimonial.avatar}
        </div>
        <div className="flex-1 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300">
                  {testimonial.name}
                </h4>
                <p className="text-sm text-primary/70 dark:text-primary/80 font-medium">
                  {testimonial.username}
                </p>
              </div>
              <Quote className="w-5 h-5 text-primary/60 group-hover:text-primary transition-colors duration-300" />
            </div>
            <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300 text-sm">
              {testimonial.text}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const TestimonialsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-background/95 to-primary/5 dark:from-background dark:via-background/90 dark:to-primary/10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent mb-6">
            What Our Clients Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto dark:text-muted-foreground/90">
            Don't just take our word for it. Here's what our amazing clients have to say about working with us.
          </p>
        </motion.div>

        {/* Upper row - Left to Right animation */}
        <div className="overflow-hidden mb-8 relative">
          <motion.div
            className="flex gap-6"
            animate={{
              x: [-1920, 0]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {[...testimonials, ...testimonials, ...testimonials].map((testimonial, index) => (
              <TestimonialCard
                key={`top-${index}`}
                testimonial={testimonial}
              />
            ))}
          </motion.div>
        </div>

        {/* Bottom row - Right to Left animation */}
        <div className="overflow-hidden relative">
          <motion.div
            className="flex gap-6"
            animate={{
              x: [0, -1920]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {[...bottomTestimonials, ...bottomTestimonials, ...bottomTestimonials].map((testimonial, index) => (
              <TestimonialCard
                key={`bottom-${index}`}
                testimonial={testimonial}
              />
            ))}
          </motion.div>
        </div>

        {/* Floating animation background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-10 left-10 w-20 h-20 bg-primary/20 dark:bg-primary/30 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-10 right-10 w-32 h-32 bg-accent/20 dark:bg-accent/30 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              y: [0, -15, 0],
              x: [0, 10, 0]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/4 w-16 h-16 bg-secondary/20 dark:bg-secondary/30 rounded-full blur-lg"
          />
        </div>
      </div>
    </section>
  );
};