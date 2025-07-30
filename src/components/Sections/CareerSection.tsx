import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users, ArrowRight, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

const jobOpenings = [
  {
    id: 1,
    title: 'Senior Full Stack Developer',
    department: 'Engineering',
    location: 'Remote / Hybrid',
    type: 'Full-time',
    experience: '3-5 years',
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
    description: 'We are looking for a passionate Full Stack Developer to join our growing team and help build scalable web applications.',
    requirements: [
      '3+ years of experience with React and Node.js',
      'Strong understanding of TypeScript',
      'Experience with cloud platforms (AWS/Azure)',
      'Knowledge of database design and optimization',
    ],
  },
  {
    id: 2,
    title: 'Java Developer',
    department: 'Engineering',
    location: 'Kolkata, India',
    type: 'Full-time',
    experience: '2-4 years',
    skills: ['Java', 'Spring Boot', 'Microservices', 'Docker', 'Kubernetes'],
    description: 'Join our backend team to develop robust, scalable Java applications and microservices.',
    requirements: [
      '2+ years of Java development experience',
      'Proficiency in Spring Boot and Spring Framework',
      'Experience with microservices architecture',
      'Knowledge of containerization technologies',
    ],
  },
  {
    id: 3,
    title: 'Mobile App Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    experience: '2-3 years',
    skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Firebase'],
    description: 'Create amazing mobile experiences for our clients across iOS and Android platforms.',
    requirements: [
      'Experience with React Native or Flutter',
      'Knowledge of native iOS/Android development',
      'Understanding of mobile UI/UX principles',
      'Experience with app store deployment',
    ],
  },
  {
    id: 4,
    title: 'DevOps Engineer',
    department: 'Infrastructure',
    location: 'Remote / Hybrid',
    type: 'Full-time',
    experience: '3-5 years',
    skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'Jenkins'],
    description: 'Help us build and maintain scalable infrastructure and improve our deployment processes.',
    requirements: [
      'Experience with containerization and orchestration',
      'Knowledge of cloud platforms and infrastructure as code',
      'Familiarity with CI/CD pipelines',
      'Strong scripting and automation skills',
    ],
  },
];

interface ApplicationFormData {
  name: string;
  email: string;
  phone: string;
  experience: string;
  coverLetter: string;
  linkedinUrl: string;
  portfolioUrl: string;
  resume: File | null;
}

export const CareerSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [selectedJob, setSelectedJob] = useState<typeof jobOpenings[0] | null>(null);
  const [formData, setFormData] = useState<ApplicationFormData>({
    name: '',
    email: '',
    phone: '',
    experience: '',
    coverLetter: '',
    linkedinUrl: '',
    portfolioUrl: '',
    resume: null,
  });

  const handleInputChange = (field: keyof ApplicationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, resume: file }));
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
    submitData.append('linkedinUrl', formData.linkedinUrl);
    submitData.append('portfolioUrl', formData.portfolioUrl);
    
    if (formData.resume) {
      submitData.append('resume', formData.resume);
    }

    // Here you would typically send to your backend
    // For now, we'll simulate the submission
    try {
      toast.success('Application submitted successfully! We\'ll get back to you soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        experience: '',
        coverLetter: '',
        linkedinUrl: '',
        portfolioUrl: '',
        resume: null,
      });
      setSelectedJob(null);
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
    }
  };

  return (
    <section id="career" ref={ref} className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <span className="text-sm font-medium text-primary">Join Our Team</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Career <span className="gradient-text">Opportunities</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Be part of an innovative team that's shaping the future of technology
          </p>
        </motion.div>

        {!selectedJob ? (
          // Job Listings
          <div className="grid md:grid-cols-2 gap-6">
            {jobOpenings.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="h-full hover:shadow-floating smooth-transition group cursor-pointer">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-4">
                      <CardTitle className="text-xl group-hover:text-primary smooth-transition">
                        {job.title}
                      </CardTitle>
                      <Badge variant="secondary">{job.department}</Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.type}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {job.experience}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{job.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {job.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button
                      onClick={() => setSelectedJob(job)}
                      className="w-full bg-gradient-primary hover:opacity-90 smooth-transition group/btn"
                    >
                      Apply Now
                      <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 smooth-transition" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          // Application Form
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl">Apply for {selectedJob.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedJob(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name *</label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number *</label>
                      <Input
                        required
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Years of Experience *</label>
                      <Input
                        required
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        placeholder="e.g., 3 years"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
                    <Input
                      value={formData.linkedinUrl}
                      onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Portfolio URL</label>
                    <Input
                      value={formData.portfolioUrl}
                      onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                      placeholder="https://yourportfolio.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Resume *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                        id="resume-upload"
                        required
                      />
                      <label htmlFor="resume-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          {formData.resume ? formData.resume.name : 'Click to upload your resume (PDF, DOC, DOCX)'}
                        </p>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Cover Letter *</label>
                    <Textarea
                      required
                      rows={6}
                      value={formData.coverLetter}
                      onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                      placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-primary hover:opacity-90 smooth-transition"
                  >
                    Submit Application
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  );
};