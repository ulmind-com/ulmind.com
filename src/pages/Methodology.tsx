import { motion } from 'framer-motion';
import {
  CheckCircle,
  Users,
  Target,
  Repeat,
  Clock,
  Shield,
  Code,
  TestTube,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CTASection } from '@/components/Sections/CTASection';

export default function Methodology() {
  const methodologies = [
    {
      title: 'Agile Development',
      icon: <Repeat className="w-12 h-12" />,
      description:
        'Iterative development approach focusing on collaboration, flexibility, and rapid delivery of working software.',
      principles: [
        'Individuals and interactions over processes and tools',
        'Working software over comprehensive documentation',
        'Customer collaboration over contract negotiation',
        'Responding to change over following a plan',
      ],
      benefits: ['Faster delivery', 'Better quality', 'Increased flexibility', 'Enhanced collaboration'],
    },
    {
      title: 'Waterfall Model',
      icon: <Target className="w-12 h-12" />,
      description:
        'Sequential design process with distinct phases, ideal for projects with well-defined requirements.',
      principles: [
        'Clear project phases and milestones',
        'Comprehensive documentation',
        'Structured approach to development',
        'Thorough testing and validation',
      ],
      benefits: ['Clear structure', 'Detailed documentation', 'Predictable timelines', 'Risk mitigation'],
    },
  ];

  const practices = [
    {
      title: 'Test-Driven Development',
      icon: <TestTube className="w-8 h-8" />,
      description: 'Writing tests before code to ensure quality and maintainability.',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    {
      title: 'CI / CD',
      icon: <Code className="w-8 h-8" />,
      description: 'Automated testing and deployment for faster, reliable releases.',
      color: 'bg-green-500/10 text-green-600 dark:text-green-400',
    },
    {
      title: 'DevOps Culture',
      icon: <Users className="w-8 h-8" />,
      description: 'Strong collaboration between development and operations teams.',
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Security First',
      icon: <Shield className="w-8 h-8" />,
      description: 'Security integrated from the very beginning of development.',
      color: 'bg-red-500/10 text-red-600 dark:text-red-400',
    },
    {
      title: 'Performance Optimization',
      icon: <Clock className="w-8 h-8" />,
      description: 'Fast, scalable, and efficient applications.',
      color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    },
    {
      title: 'Code Quality',
      icon: <CheckCircle className="w-8 h-8" />,
      description: 'High standards through reviews and best practices.',
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    },
  ];

  const processSteps = [
    { title: 'Discovery', description: 'Understanding requirements and scope' },
    { title: 'Planning', description: 'Roadmap, timeline, and resources' },
    { title: 'Design', description: 'UI/UX and system architecture' },
    { title: 'Development', description: 'Iterative coding and testing' },
    { title: 'Testing', description: 'QA and user acceptance testing' },
    { title: 'Deployment', description: 'Production release and monitoring' },
    { title: 'Maintenance', description: 'Support, updates, and optimization' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <section className="relative pt-24 pb-12 lg:pt-36 lg:pb-16 overflow-hidden bg-[#020b16]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop')"
            }}
          />
          {/* Gradient overlay similar to the image */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#021124] via-[#021124]/95 to-[#021124]/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-xl"
          >
            {/* Badge */}
            <div className="inline-block px-5 py-1.5 rounded-[20px] bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-sm">
              <span className="text-sm font-semibold tracking-wider text-[#ff5a5f] uppercase">
                Our Process
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
              Methodology
            </h1>
            
            <div className="w-16 h-1 bg-[#ff5a5f] mb-6" />
            
            <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-lg">
              Proven engineering practices that ensure scalable, secure, and high-quality solutions. 
              We blend strategic planning with technical excellence.
            </p>
          </motion.div>

          {/* Right Image */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative lg:ml-auto w-full"
            style={{ perspective: 1200 }}
          >
            {/* Glowing background blob behind image */}
            <div className="absolute inset-0 bg-[#ff5a5f] opacity-20 blur-[60px] rounded-full scale-90 translate-y-4" />
            
            <motion.div 
              className="relative rounded-[24px] overflow-hidden shadow-2xl w-full border border-white/10 z-10 bg-[#0a1120]"
              animate={{ 
                y: [0, -20, 0]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{ 
                scale: 1.05,
                rotateX: 0,
                rotateY: 0,
                transition: { duration: 0.4 }
              }}
            >
              <img 
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop" 
                alt="Our Methodology" 
                className="w-full h-[280px] md:h-[360px] object-cover transition-transform duration-700"
              />
              {/* Subtle glass overlay inside image container */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </motion.div>
            
            {/* Floating Checkmark Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: [0, -8, 0] 
              }}
              transition={{ 
                opacity: { duration: 0.5, delay: 0.6 },
                scale: { duration: 0.5, delay: 0.6 },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }
              }}
              className="absolute -left-4 top-1/2 -translate-y-1/2 bg-[#222a36]/90 backdrop-blur-md p-3 md:p-4 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.4)] border border-white/10 hidden md:flex items-center justify-center transform hover:scale-110 transition-transform z-20 group"
            >
              <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Target className="w-5 h-5 text-primary" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* METHODOLOGIES Z-PATTERN */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Continuous Dynamic Gradient Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center opacity-60">
          <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute top-0 -left-[10%] w-[1000px] h-[1000px] bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-[150px]" />
          <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute bottom-[10%] -right-[10%] w-[1000px] h-[1000px] bg-rose-500/10 dark:bg-rose-500/15 rounded-full blur-[150px]" />
        </div>
        
        <div className="max-w-7xl mx-auto space-y-32">
          {methodologies.map((m, i) => {
            const isEven = i % 2 === 0;
            // Custom user-provided images
            const imgSrc = isEven 
              ? "/m1.jpeg" 
              : "/m2.jpeg";

            return (
              <motion.div 
                key={i} 
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                {/* Text Content */}
                <div className="flex-1 space-y-8 relative z-10 w-full">
                  <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 shadow-xl backdrop-blur-md">
                    <div className="text-primary">{m.icon}</div>
                  </div>
                  
                  <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">{m.title}</h3>
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">{m.description}</p>
                  
                  <div className="grid sm:grid-cols-2 gap-4 pt-4">
                    {m.principles.map((p, j) => (
                      <div key={j} className="flex gap-3 items-start p-4 rounded-xl bg-card border border-white/5 shadow-sm hover:border-primary/30 transition-colors">
                        <CheckCircle className="w-6 h-6 text-primary shrink-0" />
                        <span className="text-sm font-medium leading-snug">{p}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 pt-4">
                    {m.benefits.map((b, j) => (
                      <Badge key={j} variant="secondary" className="px-4 py-2 text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                        {b}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 3D Corporate Illustration */}
                <div className="flex-1 w-full relative group perspective-1200">
                  <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full scale-90 group-hover:scale-105 transition-transform duration-700" />
                  <motion.div 
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                    className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 bg-black/20 backdrop-blur-sm transform group-hover:rotate-0 transition-transform duration-700"
                    style={{ transformStyle: 'preserve-3d', rotateX: isEven ? '2deg' : '-2deg', rotateY: isEven ? '-4deg' : '4deg' }}
                  >
                    <img 
                      src={imgSrc} 
                      alt={m.title} 
                      className="w-full h-[400px] md:h-[500px] object-cover mix-blend-overlay opacity-90 group-hover:scale-105 transition-transform duration-700"
                      style={{ mixBlendMode: 'normal' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-transparent pointer-events-none" />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* PRACTICES */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black/[0.02] dark:bg-white/[0.02] border-y border-black/5 dark:border-white/5 relative overflow-hidden">
        {/* Ambient Mesh Gradient */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center opacity-50">
          <div className="absolute top-[20%] left-[20%] w-[600px] h-[600px] bg-violet-500/10 dark:bg-violet-500/15 rounded-full blur-[140px]" />
          <div className="absolute bottom-[20%] right-[20%] w-[600px] h-[600px] bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-[140px]" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Our Engineering Practices</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">The unyielding standards we uphold to build resilient and scalable enterprise applications.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {practices.map((p, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                whileInView={{ opacity: 1, scale: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group h-full"
              >
                <Card className="relative p-8 h-full bg-card overflow-hidden border-transparent shadow-lg group-hover:shadow-2xl transition-shadow duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-2xl ${p.color} flex items-center justify-center mb-6 shadow-sm transform group-hover:scale-110 transition-transform duration-300`}>
                      {p.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{p.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{p.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE PROCESS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-background">
        {/* Timeline Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center opacity-60">
          <motion.div animate={{ scale: [1, 1.1, 1], y: [0, 50, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[10%] -left-[10%] w-[800px] h-[800px] bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-[150px]" />
          <motion.div animate={{ scale: [1, 1.2, 1], y: [0, -50, 0] }} transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[10%] -right-[10%] w-[800px] h-[800px] bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Delivery Process</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">From initial discovery to final deployment, we follow a rigorous, stage-gated path to product success.</p>
          </div>

          <div className="relative md:flex md:flex-col items-center">
            {/* Center Glowing Line */}
            <div className="absolute top-0 bottom-0 left-[27px] md:left-1/2 w-[2px] bg-gradient-to-b from-transparent via-primary/50 to-transparent shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
            
            <div className="space-y-12 md:space-y-0 w-full">
              {processSteps.map((step, i) => {
                const isEven = i % 2 === 0;
                return (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 30 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true, margin: "-50px" }}
                    className={`relative md:flex md:items-center ${isEven ? 'md:justify-start' : 'md:justify-end'} md:my-12 pl-16 md:pl-0`}
                  >
                    {/* Node Circle */}
                    <div className="absolute top-2 left-0 md:top-auto md:w-14 md:h-14 shrink-0 md:mx-auto md:absolute md:left-1/2 md:-ml-7 z-10">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(225,29,72,0.6)] border-4 border-background text-white font-black text-xl md:text-2xl transform hover:scale-110 transition-transform">
                        {i + 1}
                      </div>
                    </div>

                    {/* Content Card */}
                    <div className={`md:w-[45%] ${isEven ? 'md:pr-12' : 'md:pl-12'}`}>
                      <Card className="p-6 md:p-8 hover:-translate-y-2 transition-transform duration-300 shadow-xl border-white/10 bg-card backdrop-blur-md relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h4 className="text-xl md:text-2xl font-bold mb-3">{step.title}</h4>
                        <p className="text-base text-muted-foreground leading-relaxed">{step.description}</p>
                      </Card>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </div>
  );
}
