import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Code,
  Smartphone,
  Cloud,
  Database,
  ShoppingCart,
  Palette,
  ArrowRight,
  CheckCircle,
  Cpu,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const services = [
  {
    icon: <Code className="w-8 h-8" />,
    title: "Web Development",
    description:
      "Custom web applications built with modern frameworks like React, Next.js, and Node.js",
    features: [
      "Responsive Design",
      "SEO Optimized",
      "Performance Focused",
      "Scalable Architecture",
    ],
  },
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: "Mobile Apps",
    description:
      "Native and cross-platform mobile applications for iOS and Android using React Native and Flutter",
    features: [
      "Cross-Platform",
      "Native Performance",
      "App Store Ready",
      "Push Notifications",
    ],
  },
  {
    icon: <Cloud className="w-8 h-8" />,
    title: "Cloud Solutions",
    description:
      "Scalable cloud infrastructure and deployment solutions using AWS, Azure, and Google Cloud",
    features: [
      "Auto Scaling",
      "High Availability",
      "Cost Optimized",
      "Security First",
    ],
  },
  {
    icon: <Database className="w-8 h-8" />,
    title: "Backend Development",
    description:
      "Robust server-side applications with secure APIs, databases, and microservices architecture",
    features: [
      "RESTful APIs",
      "Database Design",
      "Microservices",
      "Security Focused",
    ],
  },
  {
    icon: <ShoppingCart className="w-8 h-8" />,
    title: "E-commerce Solutions",
    description:
      "Complete online store solutions with payment integration, inventory management, and analytics",
    features: [
      "Payment Gateway",
      "Inventory System",
      "Order Management",
      "Analytics Dashboard",
    ],
  },
  {
    icon: <Palette className="w-8 h-8" />,
    title: "UI/UX Design",
    description:
      "User-centered design solutions that create engaging and intuitive digital experiences",
    features: [
      "User Research",
      "Wireframing",
      "Prototyping",
      "Design Systems",
    ],
  },
  {
    icon: <Cpu className="w-8 h-8" />,
    title: "Artificial Intelligence & Machine Learning",
    description:
      "Automate workflows and gain intelligent insights with integrated AI agents and machine learning.",
    features: [
      "Conversational AI",
      "Process Automation",
      "Predictive Analytics",
      "Real-Time Decision Making",
    ],
  },
];

export const ServicesSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const navigate = useNavigate();

  return (
    <section
      ref={ref}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30"
    >
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Our Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We offer comprehensive digital solutions to help your business thrive
            in the modern world. From concept to deployment, we've got you
            covered.
          </p>
        </motion.div>

        {/* SERVICES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <Card className="p-6 h-full bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-glow transition-all duration-300 group">
                <div className="text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3">
                  {service.title}
                </h3>

                <p className="text-muted-foreground mb-4">
                  {service.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant="outline"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                  onClick={() => navigate("/contact")}
                >
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <Button
            size="lg"
            className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-8 py-3"
            onClick={() => navigate("/contact")}
          >
            Start Your Project
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
