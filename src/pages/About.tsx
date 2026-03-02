import { motion } from 'framer-motion';
import {
  Users,
  Target,
  Award,
  Lightbulb,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();

  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Mission-Driven',
      description:
        "We're committed to delivering solutions that create real business impact.",
      gradient: 'from-blue-500 to-purple-600',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Client-Centric',
      description:
        "Your success is our priority. We collaborate closely at every step.",
      gradient: 'from-green-500 to-teal-600',
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Quality Excellence',
      description:
        'We maintain high standards in code quality, delivery, and service.',
      gradient: 'from-orange-500 to-red-600',
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: 'Innovation First',
      description:
        'We leverage modern technology and creative thinking to solve challenges.',
      gradient: 'from-purple-500 to-pink-600',
    },
  ];

  const stats = [
    { number: '5+', label: 'Projects Completed' },
    { number: '5+', label: 'Happy Clients' },
    { number: '3+', label: 'Years Experience' },
    { number: '9+', label: 'Team Members' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
            About Our Journey
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A passionate team transforming ideas into scalable digital solutions.
          </p>
        </motion.div>
      </section>

      {/* STORY */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Our Story
            </h2>
            <p className="text-muted-foreground mb-6 text-lg">
              Founded with a vision to bridge technology and business success, we
              evolved into a full-service digital agency serving clients worldwide.
            </p>
            <p className="text-muted-foreground text-lg">
              We believe every business deserves scalable, future-ready digital
              solutions.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, i) => (
              <Card key={i} className="p-6 text-center bg-card/50">
                <div className="text-3xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The principles that guide every decision we make.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full relative overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 hover:opacity-5 transition`}
                  />
                  <div className="relative">
                    <div className="text-primary mb-4">{value.icon}</div>
                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                    <Sparkles className="absolute top-4 right-4 w-4 h-4 text-primary opacity-50" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Let’s turn your ideas into powerful digital solutions.
          </p>
          <Button size="lg" onClick={() => navigate('/contact')}>
            Start Your Project
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
