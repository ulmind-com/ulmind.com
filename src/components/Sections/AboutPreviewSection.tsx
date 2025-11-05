import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, Target, Award, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: <Target className="w-6 h-6" />,
    title: "Mission-Driven",
    description: "Delivering exceptional solutions that drive real business value"
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Client-Centric",
    description: "Your success is our success - we work closely with you every step"
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Quality Excellence",
    description: "Maintaining highest standards in code quality and delivery"
  }
];

const stats = [
  { number: "50+", label: "Projects Completed" },
  { number: "30+", label: "Happy Clients" },
  { number: "5+", label: "Years Experience" },
  { number: "15+", label: "Team Members" }
];

export const AboutPreviewSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const navigate = useNavigate();

  return (
    <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              About Mehraki
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              We are a passionate team of developers, designers, and innovators dedicated to 
              transforming your digital dreams into powerful, scalable solutions that drive business growth.
            </p>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Founded with a vision to bridge the gap between innovative technology and business success, 
              we've grown from a small team to a full-service digital agency serving clients worldwide.
            </p>

            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="text-primary mt-1">{feature.icon}</div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button 
              size="lg" 
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground"
              onClick={() => navigate('/about')}
            >
              Learn More About Us
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
              >
                <Card className="p-6 text-center bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-glow transition-all duration-300">
                  <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};