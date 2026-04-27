import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Lottie from 'lottie-react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { ShineBorder } from '@/components/ui/shine-border';

const projects = [
  {
    title: 'E-Commerce Platform',
    description: 'A modern, scalable e-commerce solution with real-time inventory, payment processing, and analytics dashboard.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    category: 'Web Application',
    status: 'Live',
    links: {
      demo: '#',
      github: '#',
    },
  },
  {
    title: 'AI-Powered Analytics Dashboard',
    description: 'Advanced analytics platform with machine learning insights for business intelligence and data visualization.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    technologies: ['Python', 'TensorFlow', 'React', 'PostgreSQL'],
    category: 'AI/ML',
    status: 'In Development',
    links: {
      demo: '#',
      github: '#',
    },
  },
  {
    title: 'Mobile Fitness App',
    description: 'Cross-platform fitness tracking app with workout plans, nutrition tracking, and social features.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
    technologies: ['React Native', 'Firebase', 'Node.js', 'MongoDB'],
    category: 'Mobile App',
    status: 'Live',
    links: {
      demo: '#',
      github: '#',
    },
  },
  {
    title: 'Cloud Infrastructure Manager',
    description: 'DevOps tool for managing cloud infrastructure with automated deployment and monitoring capabilities.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
    technologies: ['Docker', 'Kubernetes', 'AWS', 'Terraform'],
    category: 'DevOps',
    status: 'Live',
    links: {
      demo: '#',
      github: '#',
    },
  },
  {
    title: 'Blockchain Voting System',
    description: 'Secure, transparent voting platform built on blockchain technology with smart contract integration.',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop',
    technologies: ['Solidity', 'Web3.js', 'React', 'Ethereum'],
    category: 'Blockchain',
    status: 'Prototype',
    links: {
      demo: '#',
      github: '#',
    },
  },
  {
    title: 'IoT Smart Home Hub',
    description: 'Centralized control system for smart home devices with voice control and automation features.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
    technologies: ['IoT', 'Python', 'React', 'MQTT'],
    category: 'IoT',
    status: 'Live',
    links: {
      demo: '#',
      github: '#',
    },
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Live':
      return 'bg-green-100 text-green-800';
    case 'In Development':
      return 'bg-blue-100 text-blue-800';
    case 'Prototype':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const ProjectsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [arrowAnimData, setArrowAnimData] = useState<object | null>(null);

  useEffect(() => {
    fetch('/Jason/lottieflow-arrow-08-2-ffffff-easey.json')
      .then((r) => r.json())
      .then((d: any) => {
        const stripped = {
          ...d,
          layers: (d.layers ?? []).filter(
            (l: any) => l.ty !== 1 && !/^bg$/i.test(l.nm ?? '') && !/^background$/i.test(l.nm ?? '')
          ),
        };
        setArrowAnimData(stripped);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="projects" ref={ref} className="py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <span className="text-sm font-medium text-primary">Our Portfolio</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our latest work and see how we transform ideas into powerful digital solutions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -10 }}
              className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-floating smooth-transition group h-full relative"
            >
              <ShineBorder
                borderRadius={16}
                borderWidth={1.5}
                color={["#FF007F", "#39FF14", "#00FFFF"]}
                className="bg-transparent h-full w-full !p-[1.5px] !text-inherit border-none overflow-hidden"
              >
                {/* Project Image */}
                <div className="relative overflow-hidden flex-shrink-0 rounded-t-[14.5px]">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-110 smooth-transition"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium rounded-full text-black">
                      {project.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary smooth-transition flex-shrink-0">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-6 flex-shrink-0">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 group/btn"
                      asChild
                    >
                      <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2 group-hover/btn:scale-110 smooth-transition" />
                        Demo
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="group/btn"
                      asChild
                    >
                      <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 group-hover/btn:scale-110 smooth-transition" />
                      </a>
                    </Button>
                  </div>
                </div>
              </ShineBorder>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-primary rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Have a Project in Mind?
            </h3>
            <p className="text-white/80 mb-6">
              Let's discuss how we can bring your vision to life with our expertise and innovative approach
            </p>
            <Button
              size="lg"
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white rounded-full px-8 py-6 text-base font-bold shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:shadow-[0_0_30px_rgba(225,29,72,0.6)] border border-red-500/30 transition-all hover:scale-105 group"
            >
              Start Your Project
              {arrowAnimData ? (
                <Lottie animationData={arrowAnimData} loop autoplay className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              ) : (
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};