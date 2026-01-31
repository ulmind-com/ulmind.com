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
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
              Our Methodology
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Proven engineering practices that ensure scalable, secure, and high-quality solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* METHODOLOGIES */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
          {methodologies.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Card className="p-8 h-full">
                <div className="text-primary mb-6">{m.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{m.title}</h3>
                <p className="text-muted-foreground mb-6">{m.description}</p>

                <ul className="space-y-2 mb-6">
                  {m.principles.map((p, j) => (
                    <li key={j} className="flex gap-2">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {m.benefits.map((b, j) => (
                    <Badge key={j} variant="secondary">
                      {b}
                    </Badge>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRACTICES */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {practices.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Card className="p-6">
                <div className={`w-14 h-14 rounded-lg ${p.color} flex items-center justify-center mb-4`}>
                  {p.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{p.title}</h3>
                <p className="text-muted-foreground">{p.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((step, i) => (
            <Card key={i} className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                {i + 1}
              </div>
              <h4 className="font-semibold mb-1">{step.title}</h4>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
