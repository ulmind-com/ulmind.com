import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Twitter, ArrowRight } from 'lucide-react';

const teamMembers = [
  {
    name: 'Soumyajit Banerjee',
    role: 'CEO & Lead Developer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    bio: 'Visionary leader with 5+ years in software development and team management.',
    social: {
      github: '#',
      linkedin: '#',
      twitter: '#',
    },
  },
  {
    name: 'Priya Sharma',
    role: 'CTO & Full Stack Developer',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    bio: 'Technical expert specializing in scalable architecture and modern web technologies.',
    social: {
      github: '#',
      linkedin: '#',
      twitter: '#',
    },
  },
  {
    name: 'Rahul Kumar',
    role: 'Lead Mobile Developer',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    bio: 'Mobile development specialist with expertise in React Native and Flutter.',
    social: {
      github: '#',
      linkedin: '#',
      twitter: '#',
    },
  },
  {
    name: 'Anita Desai',
    role: 'UI/UX Designer',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    bio: 'Creative designer focused on user-centered design and intuitive interfaces.',
    social: {
      github: '#',
      linkedin: '#',
      twitter: '#',
    },
  },
];

export const TeamSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="team" ref={ref} className="py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <span className="text-sm font-medium text-primary">Meet Our Team</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            The Minds Behind <span className="gradient-text">StartupCorp</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our diverse team of experts brings together years of experience in technology, design, and innovation
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -10 }}
              className="bg-card rounded-2xl p-6 shadow-card hover:shadow-floating smooth-transition group"
            >
              <div className="relative mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-32 h-32 mx-auto rounded-2xl overflow-hidden"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 smooth-transition"
                  />
                </motion.div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✦</span>
                </div>
              </div>

              <div className="text-center">
                <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm mb-4">{member.bio}</p>

                <div className="flex justify-center gap-3">
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href={member.social.github}
                    className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center hover:bg-primary hover:text-white smooth-transition"
                  >
                    <Github className="w-4 h-4" />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href={member.social.linkedin}
                    className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center hover:bg-primary hover:text-white smooth-transition"
                  >
                    <Linkedin className="w-4 h-4" />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href={member.social.twitter}
                    className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center hover:bg-primary hover:text-white smooth-transition"
                  >
                    <Twitter className="w-4 h-4" />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-card rounded-2xl p-8 max-w-2xl mx-auto shadow-card">
            <h3 className="text-2xl font-bold mb-4">Join Our Growing Team</h3>
            <p className="text-muted-foreground mb-6">
              We're always looking for talented individuals who share our passion for innovation and excellence.
            </p>
            <Button
              size="lg"
              onClick={() => document.querySelector('#career')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-primary hover:opacity-90 smooth-transition group"
            >
              View Open Positions
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 smooth-transition" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};