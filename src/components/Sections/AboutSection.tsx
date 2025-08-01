import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Target, Users, Zap } from 'lucide-react';

export const AboutSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: Target,
      title: 'Mission-Driven',
      description: 'We are committed to delivering exceptional digital solutions that drive business growth and innovation.',
    },
    {
      icon: Users,
      title: 'Client-Focused',
      description: 'Your success is our priority. We work closely with you to understand your needs and exceed expectations.',
    },
    {
      icon: Zap,
      title: 'Innovation First',
      description: 'We stay ahead of technology trends to provide cutting-edge solutions that give you a competitive edge.',
    },
  ];

  return (
    <section id="about" ref={ref} className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <span className="text-sm font-medium text-primary">About Meraki</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Transforming Ideas Into
              <br />
              <span className="gradient-text">Digital Reality</span>
            </h2>

            <p className="text-xl text-muted-foreground mb-8">
              We are a forward-thinking software development company specializing in creating innovative digital solutions. 
              Our team of experts combines technical excellence with creative vision to deliver products that not only meet 
              your requirements but exceed your expectations.
            </p>

            <div className="space-y-6 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button
              size="lg"
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-primary hover:opacity-90 smooth-transition group"
            >
              Start Your Project
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 smooth-transition" />
            </Button>
          </motion.div>

          {/* Visual Element */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Main card */}
              <div className="bg-gradient-card rounded-3xl p-8 shadow-floating">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">5+</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Years of Excellence</h4>
                      <p className="text-muted-foreground">Building digital solutions</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary/10 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-primary">100+</div>
                      <div className="text-sm text-muted-foreground">Projects</div>
                    </div>
                    <div className="bg-accent/10 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-accent">50+</div>
                      <div className="text-sm text-muted-foreground">Clients</div>
                    </div>
                  </div>

                  <div className="bg-secondary/50 rounded-xl p-4">
                    <h5 className="font-semibold mb-2">Our Expertise</h5>
                    <div className="flex flex-wrap gap-2">
                      {['Web Development', 'Mobile Apps', 'Cloud Solutions', 'AI/ML'].map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow"
              >
                <Zap className="w-10 h-10 text-white" />
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-accent rounded-2xl flex items-center justify-center shadow-floating"
              >
                <Target className="w-8 h-8 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};