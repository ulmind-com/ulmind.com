import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { ExternalLink, Github, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BlurBlob from "@/components/BlurBlob";

export default function Projects() {
  const projects = [
    {
      id: 1,
      title: "Restaurant Food Delivery Platform (Serverless)",
      description:
        "A serverless progressive web app for food ordering with a modern UI, cart system, and direct WhatsApp integration.",
      image: "/maa_laxmi.png",
      technologies: ["React", "TypeScript", "Vercel"],
      category: "Web Development",
      timeline: "3 days",
      teamSize: "3 developers",
      demoUrl: "https://www.malakshmiranirestaurant.online",
      githubUrl: "#",
    },
    {
      id: 2,
      title: "Hotel & Restaurant Business Website",
      description:
        "A fast, mobile-first business website designed to improve online visibility and local engagement.",
      image: "/Jamai_da_project.png",
      technologies: ["React", "TypeScript", "Vercel"],
      category: "Web Development",
      timeline: "2 days",
      teamSize: "2 developers",
      demoUrl: "https://jamaidahotel.online",
      githubUrl: "#",
    },
    {
      id: 3,
      title: "Regional Digital News Platform",
      description:
        "A scalable digital news portal delivering real-time regional updates with SEO-friendly architecture.",
      image: "/jhbihar.png",
      technologies: ["React", "SEO", "Vercel"],
      category: "Media & Web",
      timeline: "4 days",
      teamSize: "3 developers",
      demoUrl: "https://www.jharkhandbiharupdates.com",
      githubUrl: "#",
    },
    {
      id: 4,
      title: "Investment & Financial Consulting Website",
      description:
        "A professional consulting website built to establish trust and convert visitors into leads.",
      image: "/Smart_invest.png",
      technologies: ["React", "Tailwind CSS", "Form Integration"],
      category: "FinTech",
      timeline: "3 days",
      teamSize: "2 developers",
      demoUrl: "https://www.smartinvestsolutions.in",
      githubUrl: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background blobs */}
      <BlurBlob
        position={{ top: "20%", left: "15%" }}
        size={{ width: "400px", height: "400px" }}
      />
      <BlurBlob
        position={{ top: "70%", left: "85%" }}
        size={{ width: "450px", height: "450px" }}
      />

      {/* HERO */}
      <section className="pt-32 pb-20 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold gradient-text mb-6"
        >
          Our Projects
        </motion.h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Scalable, modern, and business-focused digital solutions.
        </p>
      </section>

      {/* PROJECT GRID */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <Tilt
                tiltMaxAngleX={15}
                tiltMaxAngleY={15}
                perspective={1000}
                scale={1.04}
                transitionSpeed={800}
                gyroscope
              >
                <Card className="overflow-hidden bg-background border hover:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.4)] transition-all">
                  <div className="relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-56 object-cover"
                    />
                    <Badge className="absolute top-4 left-4 bg-primary/20 text-primary">
                      {project.category}
                    </Badge>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3">
                      {project.title}
                    </h3>

                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {project.timeline}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {project.teamSize}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <Button asChild className="flex-1">
                        <a href={project.demoUrl} target="_blank" rel="noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Live
                        </a>
                      </Button>
                      <Button variant="outline" asChild>
                        <a href={project.githubUrl} target="_blank" rel="noreferrer">
                          <Github className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </Card>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
