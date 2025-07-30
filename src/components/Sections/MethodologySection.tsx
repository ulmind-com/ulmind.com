import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CheckCircle, Zap, Users, Repeat, Target, Code, TestTube, Rocket } from 'lucide-react';

const methodologies = [
  {
    title: 'Agile Development',
    icon: Zap,
    description: 'Iterative development with continuous feedback and rapid delivery of working software.',
    features: ['Sprint Planning', 'Daily Standups', 'Continuous Integration', 'User Feedback'],
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Waterfall Model',
    icon: Target,
    description: 'Sequential development approach with well-defined phases and comprehensive documentation.',
    features: ['Requirements Analysis', 'System Design', 'Implementation', 'Testing & Deployment'],
    color: 'from-green-500 to-green-600',
  },
  {
    title: 'DevOps Practices',
    icon: Repeat,
    description: 'Continuous integration and deployment with automated testing and monitoring.',
    features: ['CI/CD Pipelines', 'Infrastructure as Code', 'Monitoring & Logging', 'Automated Testing'],
    color: 'from-purple-500 to-purple-600',
  },
  {
    title: 'Test-Driven Development',
    icon: TestTube,
    description: 'Writing tests before code to ensure quality and reduce bugs in production.',
    features: ['Unit Testing', 'Integration Testing', 'Code Coverage', 'Automated QA'],
    color: 'from-orange-500 to-orange-600',
  },
];

const principles = [
  { name: 'SOLID Principles', icon: Code },
  { name: 'Clean Architecture', icon: Target },
  { name: 'Microservices', icon: Users },
  { name: 'Domain-Driven Design', icon: Rocket },
];

export const MethodologySection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="methodology" ref={ref} className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <span className="text-sm font-medium text-primary">Our Methodology</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Software Engineering <span className="gradient-text">Excellence</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We follow industry-best practices and proven methodologies to deliver high-quality software solutions
          </p>
        </motion.div>

        {/* Development Methodologies */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {methodologies.map((methodology, index) => (
            <motion.div
              key={methodology.title}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -5 }}
              className="bg-card rounded-2xl p-8 shadow-card hover:shadow-floating smooth-transition group"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${methodology.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 smooth-transition`}>
                <methodology.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl font-bold mb-4">{methodology.title}</h3>
              <p className="text-muted-foreground mb-6">{methodology.description}</p>

              <div className="space-y-3">
                {methodology.features.map((feature, featureIndex) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.5 + index * 0.1 + featureIndex * 0.05, duration: 0.4 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Software Engineering Principles */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="bg-gradient-card rounded-2xl p-8 shadow-card"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Core Engineering Principles</h3>
            <p className="text-muted-foreground">
              We adhere to fundamental software engineering principles that ensure maintainable, scalable, and robust code
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((principle, index) => (
              <motion.div
                key={principle.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 bg-white/50 rounded-xl hover:bg-white/70 smooth-transition group"
              >
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 smooth-transition">
                  <principle.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-sm">{principle.name}</h4>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Process Flow */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">Our Development Process</h3>
            <p className="text-muted-foreground">
              A structured approach from concept to deployment and beyond
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'Discovery', desc: 'Understanding requirements' },
              { step: '02', title: 'Planning', desc: 'Architecture & design' },
              { step: '03', title: 'Development', desc: 'Coding & testing' },
              { step: '04', title: 'Deployment', desc: 'Launch & monitoring' },
              { step: '05', title: 'Maintenance', desc: 'Support & updates' },
            ].map((phase, index) => (
              <motion.div
                key={phase.step}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                className="text-center relative"
              >
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                  {phase.step}
                </div>
                <h4 className="font-semibold mb-2">{phase.title}</h4>
                <p className="text-sm text-muted-foreground">{phase.desc}</p>
                
                {index < 4 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary to-primary/20" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};