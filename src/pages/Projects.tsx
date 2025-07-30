import { motion } from 'framer-motion';
import { ExternalLink, Github, Calendar, Users, Rocket, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Layout/Navbar';
import { Footer } from '@/components/Layout/Footer';

export default function Projects() {
  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "A comprehensive e-commerce solution with advanced analytics, inventory management, and multi-vendor support.",
      image: "/placeholder.svg",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      category: "Web Development",
      timeline: "6 months",
      teamSize: "5 developers",
      features: ["Multi-vendor marketplace", "Real-time analytics", "Payment gateway integration", "Mobile responsive"],
      demoUrl: "#",
      githubUrl: "#"
    },
    {
      id: 2,
      title: "Healthcare Management System",
      description: "Complete hospital management system with patient records, appointment scheduling, and billing integration.",
      image: "/placeholder.svg",
      technologies: ["React Native", "Spring Boot", "PostgreSQL", "AWS"],
      category: "Mobile & Web",
      timeline: "8 months",
      teamSize: "7 developers",
      features: ["Patient management", "Appointment system", "Medical records", "Billing integration"],
      demoUrl: "#",
      githubUrl: "#"
    },
    {
      id: 3,
      title: "AI-Powered Analytics Dashboard",
      description: "Advanced analytics platform with machine learning insights and predictive modeling for business intelligence.",
      image: "/placeholder.svg",
      technologies: ["Python", "React", "TensorFlow", "Docker"],
      category: "AI & Analytics",
      timeline: "10 months",
      teamSize: "6 developers",
      features: ["Machine learning models", "Predictive analytics", "Real-time dashboards", "Custom reports"],
      demoUrl: "#",
      githubUrl: "#"
    },
    {
      id: 4,
      title: "Financial Trading Platform",
      description: "Real-time trading platform with advanced charting, portfolio management, and risk assessment tools.",
      image: "/placeholder.svg",
      technologies: ["Angular", "Java", "Kafka", "Redis"],
      category: "FinTech",
      timeline: "12 months",
      teamSize: "8 developers",
      features: ["Real-time trading", "Portfolio tracking", "Risk management", "Advanced charts"],
      demoUrl: "#",
      githubUrl: "#"
    },
    {
      id: 5,
      title: "Social Media Analytics Tool",
      description: "Comprehensive social media monitoring and analytics platform for brands and marketing agencies.",
      image: "/placeholder.svg",
      technologies: ["Vue.js", "Python", "Elasticsearch", "Kubernetes"],
      category: "Marketing Tech",
      timeline: "7 months",
      teamSize: "4 developers",
      features: ["Social monitoring", "Sentiment analysis", "Competitor tracking", "Custom reporting"],
      demoUrl: "#",
      githubUrl: "#"
    },
    {
      id: 6,
      title: "IoT Smart Home System",
      description: "Complete IoT ecosystem for smart home automation with mobile app and voice control integration.",
      image: "/placeholder.svg",
      technologies: ["Flutter", "Node.js", "MQTT", "Firebase"],
      category: "IoT",
      timeline: "9 months",
      teamSize: "6 developers",
      features: ["Device automation", "Voice control", "Energy monitoring", "Security system"],
      demoUrl: "#",
      githubUrl: "#"
    }
  ];

  const categories = ["All", "Web Development", "Mobile & Web", "AI & Analytics", "FinTech", "Marketing Tech", "IoT"];

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
              Our Projects
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Explore our portfolio of successful projects that showcase our expertise in delivering 
              innovative solutions across various industries and technologies.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Button 
                  variant={index === 0 ? "default" : "outline"}
                  className="hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  {category}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden glass-card border-border/50 hover:shadow-glow hover:border-primary/20 transition-all duration-500 group hover-scale">
                  <div className="relative overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                        {project.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{project.timeline}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{project.teamSize}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <Button size="sm" className="flex-1" asChild>
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Demo
                        </a>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
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
              Project Success Metrics
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "50+", label: "Projects Delivered" },
                { number: "98%", label: "Client Satisfaction" },
                { number: "15+", label: "Industries Served" },
                { number: "24/7", label: "Support Available" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
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