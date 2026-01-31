import { motion } from 'framer-motion';
import { CheckCircle, Users, Target, Repeat, Clock, Shield, Code, TestTube, Zap, Star, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Layout/Navbar';
import { Footer } from '@/components/Layout/Footer';

export default function Methodology() {
  const methodologies = [
    {
      title: "Agile Development",
      icon: <Repeat className="w-12 h-12" />,
      description: "Iterative development approach focusing on collaboration, flexibility, and rapid delivery of working software.",
      principles: [
        "Individuals and interactions over processes and tools",
        "Working software over comprehensive documentation",
        "Customer collaboration over contract negotiation",
        "Responding to change over following a plan"
      ],
      benefits: ["Faster delivery", "Better quality", "Increased flexibility", "Enhanced collaboration"]
    },
    {
      title: "Waterfall Model",
      icon: <Target className="w-12 h-12" />,
      description: "Sequential design process with distinct phases, ideal for projects with well-defined requirements.",
      principles: [
        "Clear project phases and milestones",
        "Comprehensive documentation",
        "Structured approach to development",
        "Thorough testing and validation"
      ],
      benefits: ["Clear structure", "Detailed documentation", "Predictable timelines", "Risk mitigation"]
    }
  ];

  const practices = [
    {
      title: "Test-Driven Development (TDD)",
      icon: <TestTube className="w-8 h-8" />,
      description: "Writing tests before code to ensure quality and maintainability.",
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400"
    },
    {
      title: "Continuous Integration/Deployment",
      icon: <Code className="w-8 h-8" />,
      description: "Automated testing and deployment for faster, more reliable releases.",
      color: "bg-green-500/10 text-green-600 dark:text-green-400"
    },
    {
      title: "DevOps Culture",
      icon: <Users className="w-8 h-8" />,
      description: "Collaboration between development and operations for better efficiency.",
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400"
    },
    {
      title: "Security First",
      icon: <Shield className="w-8 h-8" />,
      description: "Implementing security measures from the ground up in every project.",
      color: "bg-red-500/10 text-red-600 dark:text-red-400"
    },
    {
      title: "Performance Optimization",
      icon: <Clock className="w-8 h-8" />,
      description: "Ensuring applications are fast, scalable, and resource-efficient.",
      color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
    },
    {
      title: "Code Quality",
      icon: <CheckCircle className="w-8 h-8" />,
      description: "Maintaining high standards through code reviews and best practices.",
      color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
    }
  ];

  const processSteps = [
    { title: "Discovery", description: "Understanding requirements and defining project scope" },
    { title: "Planning", description: "Creating roadmap, timeline, and resource allocation" },
    { title: "Design", description: "UI/UX design and system architecture planning" },
    { title: "Development", description: "Iterative coding with regular reviews and testing" },
    { title: "Testing", description: "Comprehensive QA and user acceptance testing" },
    { title: "Deployment", description: "Production deployment and monitoring setup" },
    { title: "Maintenance", description: "Ongoing support, updates, and optimization" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
              Our Methodology
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We follow proven software engineering principles and methodologies to deliver high-quality, 
              scalable solutions that meet your business objectives and exceed expectations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Development Methodologies */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Development Approaches
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We adapt our methodology based on project requirements, choosing the best approach for optimal results.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {methodologies.map((methodology, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 h-full glass-card border-border/50 hover:shadow-glow hover:border-primary/20 transition-all duration-500 group hover-scale">
                  <motion.div 
                    className="text-primary mb-6 group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {methodology.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{methodology.title}</h3>
                  <p className="text-muted-foreground mb-6">{methodology.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-foreground mb-3">Core Principles:</h4>
                    <ul className="space-y-2">
                      {methodology.principles.map((principle, prinIndex) => (
                        <li key={prinIndex} className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>{principle}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-3">Key Benefits:</h4>
                    <div className="flex flex-wrap gap-2">
                      {methodology.benefits.map((benefit, benIndex) => (
                        <Badge key={benIndex} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Engineering Practices */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Engineering Best Practices
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We follow industry-standard practices to ensure code quality, security, and maintainability.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {practices.map((practice, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-glow transition-all duration-300">
                  <div className={`w-16 h-16 rounded-lg ${practice.color} flex items-center justify-center mb-4`}>
                    {practice.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{practice.title}</h3>
                  <p className="text-muted-foreground">{practice.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Development Process */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Our Development Process
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A structured approach that ensures quality delivery from concept to deployment.
            </p>
          </motion.div>

          <div className="relative">
            {/* Process Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <Card className="p-6 text-center bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-glow transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-4">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </Card>
                  
                  {/* Connection Line */}
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 left-full w-8 h-0.5 bg-gradient-to-r from-primary to-primary/50 transform -translate-y-1/2 z-10" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quality Assurance */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
              Quality Assurance Metrics
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "99.9%", label: "Uptime Guarantee" },
                { number: "< 2s", label: "Load Time" },
                { number: "100%", label: "Code Coverage" },
                { number: "24/7", label: "Monitoring" }
              ].map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{metric.number}</div>
                  <div className="text-muted-foreground">{metric.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}