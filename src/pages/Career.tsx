import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, DollarSign, Upload, Send, X, Briefcase, CheckCircle, Sparkles, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Navbar } from '@/components/Layout/Navbar';
import { Footer } from '@/components/Layout/Footer';

// Job openings data
const jobOpenings = [
  {
    id: 1,
    title: "Senior Java Developer",
    department: "Backend Development",
    location: "Remote",
    type: "Full-time",
    experience: "5+ years",
    salary: "$80,000 - $120,000",
    skills: ["Java", "Spring Boot", "Microservices", "SQL", "RESTful API", "AWS/Azure"],
    description: "We're looking for an experienced Java developer to join our backend team and work on scalable microservices architecture.",
    requirements: [
      "5+ years of Java development experience",
      "Strong knowledge of Spring Boot framework",
      "Experience with microservices architecture",
      "Proficiency in SQL and NoSQL databases",
      "Knowledge of RESTful API design",
      "Experience with cloud platforms (AWS/Azure)"
    ],
    responsibilities: [
      "Design and develop scalable backend services",
      "Collaborate with frontend teams on API design",
      "Optimize application performance and scalability",
      "Participate in code reviews and mentoring",
      "Contribute to technical architecture decisions"
    ]
  },
  {
    id: 2,
    title: "React Frontend Developer",
    department: "Frontend Development",
    location: "Remote",
    type: "Full-time",
    experience: "3+ years",
    salary: "$60,000 - $90,000",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL", "Testing"],
    description: "Join our frontend team to build beautiful, responsive user interfaces using React and modern web technologies.",
    requirements: [
      "3+ years of React development experience",
      "Strong proficiency in TypeScript",
      "Experience with Next.js framework",
      "Knowledge of modern CSS frameworks",
      "Understanding of state management (Redux/Zustand)",
      "Experience with testing frameworks"
    ],
    responsibilities: [
      "Develop responsive web applications",
      "Implement pixel-perfect UI designs",
      "Optimize frontend performance",
      "Write comprehensive tests",
      "Collaborate with design and backend teams"
    ]
  },
  {
    id: 3,
    title: "UI/UX Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    experience: "4+ years",
    salary: "$65,000 - $95,000",
    skills: ["Figma", "Adobe Creative Suite", "Prototyping", "User Research", "Wireframing"],
    description: "Create exceptional user experiences and intuitive interfaces for web and mobile applications.",
    requirements: [
      "4+ years of UI/UX design experience",
      "Proficiency in Figma and Adobe Creative Suite",
      "Strong portfolio of web and mobile designs",
      "Experience with user research and testing",
      "Knowledge of design systems and style guides"
    ],
    responsibilities: [
      "Design user interfaces for web and mobile",
      "Conduct user research and usability testing",
      "Create wireframes and prototypes",
      "Maintain design systems",
      "Collaborate with development teams"
    ]
  }
];

interface ApplicationFormData {
  name: string;
  email: string;
  phone: string;
  experience: string;
  coverLetter: string;
  portfolioUrl: string;
  linkedinUrl: string;
  resume: File | null;
}

export default function Career() {
  const [selectedJob, setSelectedJob] = useState<typeof jobOpenings[0] | null>(null);
  const [formData, setFormData] = useState<ApplicationFormData>({
    name: '',
    email: '',
    phone: '',
    experience: '',
    coverLetter: '',
    portfolioUrl: '',
    linkedinUrl: '',
    resume: null,
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      resume: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedJob) return;

    // Create FormData for file upload
    const submitData = new FormData();
    submitData.append('jobTitle', selectedJob.title);
    submitData.append('name', formData.name);
    submitData.append('email', formData.email);
    submitData.append('phone', formData.phone);
    submitData.append('experience', formData.experience);
    submitData.append('coverLetter', formData.coverLetter);
    submitData.append('portfolioUrl', formData.portfolioUrl);
    submitData.append('linkedinUrl', formData.linkedinUrl);
    if (formData.resume) {
      submitData.append('resume', formData.resume);
    }

    try {
      // Simulate form submission
      console.log('Form submitted:', {
        job: selectedJob.title,
        applicant: formData.name,
        email: 'banerjeesoumyajit2005@gmail.com'
      });

      toast({
        title: "Application Submitted!",
        description: `Your application for ${selectedJob.title} has been submitted successfully. We'll get back to you soon.`,
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        experience: '',
        coverLetter: '',
        portfolioUrl: '',
        linkedinUrl: '',
        resume: null,
      });
      setSelectedJob(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    }
  };

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
              Join Our Team
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Be part of our innovative team and help us build the future of technology. 
              We're always looking for talented individuals who share our passion for excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Job Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background border border-border rounded-lg"
          >
            <div className="flex flex-col lg:flex-row">
              {/* Job Details */}
              <div className="lg:w-2/5 p-6 bg-muted/30 border-r border-border">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">{selectedJob.title}</h2>
                    <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                      {selectedJob.department}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedJob(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedJob.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{selectedJob.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    <span>{selectedJob.salary}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="w-4 h-4" />
                    <span>{selectedJob.experience}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Responsibilities</h3>
                  <ul className="space-y-2">
                    {selectedJob.responsibilities.map((resp, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Application Form */}
              <div className="lg:w-3/5 p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Apply for this position</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Full Name *
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                        className="bg-background border-border"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Email *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        required
                        className="bg-background border-border"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Phone
                      </label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Your phone number"
                        className="bg-background border-border"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Years of Experience *
                      </label>
                      <Input
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        placeholder="e.g., 5 years"
                        required
                        className="bg-background border-border"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Portfolio/LinkedIn URL
                    </label>
                    <Input
                      name="portfolioUrl"
                      value={formData.portfolioUrl}
                      onChange={handleInputChange}
                      placeholder="https://yourportfolio.com or LinkedIn profile"
                      className="bg-background border-border"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Resume *
                    </label>
                    <div className="relative">
                      <Input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        required
                        className="bg-background border-border file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                      />
                      <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Cover Letter *
                    </label>
                    <Textarea
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleInputChange}
                      placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                      required
                      rows={6}
                      className="bg-background border-border resize-none"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-primary hover:opacity-90 text-primary-foreground"
                    >
                      Submit Application
                      <Send className="ml-2 w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedJob(null)}
                      className="px-8"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Job Listings */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Open Positions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore our current job openings and find the perfect role to advance your career.
            </p>
          </motion.div>

          <div className="space-y-6">
            {jobOpenings.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="p-6 glass-card border-border/50 hover:shadow-glow hover:border-primary/20 transition-all duration-500 group hover-scale">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">{job.title}</h3>
                          <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 mb-3">
                            {job.department}
                          </Badge>
                          <p className="text-muted-foreground mb-4">{job.description}</p>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{job.type}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              <span>{job.salary}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4" />
                              <span>{job.experience}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill, skillIndex) => (
                              <Badge key={skillIndex} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <Button
                        onClick={() => setSelectedJob(job)}
                        className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-8 group-hover:scale-105 transition-all duration-300"
                      >
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center gap-2"
                        >
                          Apply Now
                          <Sparkles className="w-4 h-4" />
                        </motion.span>
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
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
              Why Work With Us?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We offer competitive benefits and a supportive work environment for professional growth.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Competitive Salary",
                description: "Industry-leading compensation packages with performance bonuses"
              },
              {
                title: "Remote Work",
                description: "Flexible work arrangements with full remote work options"
              },
              {
                title: "Health Benefits",
                description: "Comprehensive health insurance coverage for you and your family"
              },
              {
                title: "Learning & Development",
                description: "Continuous learning opportunities and professional development programs"
              },
              {
                title: "Work-Life Balance",
                description: "Flexible hours and generous vacation time to maintain healthy balance"
              },
              {
                title: "Innovation Culture",
                description: "Encourage creativity and innovation in a collaborative environment"
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full bg-card/50 backdrop-blur-sm border-border/50">
                  <h3 className="text-lg font-bold text-foreground mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}