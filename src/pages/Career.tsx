import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  Send,
  X,
  Briefcase,
  Sparkles,
} from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CTASection } from "@/components/Sections/CTASection";

/* ---------------- Job Data ---------------- */

const jobOpenings = [
  {
    id: 1,
    title: "Java Developer",
    department: "Backend Development",
    location: "Remote",
    type: "Full-time",
    experience: "1+ years",
    skills: ["Java", "Spring Boot", "Microservices", "SQL", "REST API"],
    description:
      "We're looking for a Java developer to build scalable backend services.",
  },
  {
    id: 2,
    title: "Full Stack Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    experience: "2+ years",
    skills: ["React", "Node.js", "MongoDB", "REST API", "Git"],
    description:
      "Work across frontend and backend to build complete, scalable web applications.",
  },
  {
    id: 3,
    title: "Mobile App Developer",
    department: "Mobile Development",
    location: "Remote",
    type: "Full-time",
    experience: "2+ years",
    skills: ["React Native", "Flutter", "Android", "iOS"],
    description:
      "Build high-quality mobile applications for Android and iOS platforms.",
  },
  {
    id: 4,
    title: "Graphics Designer",
    department: "Design",
    location: "Remote",
    type: "Part-time / Full-time",
    experience: "1+ years",
    skills: ["Photoshop", "Illustrator", "Figma", "Brand Design"],
    description:
      "Create visually appealing designs for web, social media, and branding.",
  },
  {
    id: 5,
    title: "Video Editor",
    department: "Media & Content",
    location: "Remote",
    type: "Part-time / Contract",
    experience: "1+ years",
    skills: ["Premiere Pro", "After Effects", "Motion Graphics"],
    description:
      "Edit promotional videos, reels, and digital marketing content.",
  },
];

/* ---------------- Types ---------------- */

interface ApplicationFormData {
  name: string;
  email: string;
  phone: string;
  experience: string;
  coverLetter: string;
  resume: File | null;
}

/* ---------------- Component ---------------- */

const Career = () => {
  const [selectedJob, setSelectedJob] =
    useState<(typeof jobOpenings)[0] | null>(null);

  const [formData, setFormData] = useState<ApplicationFormData>({
    name: "",
    email: "",
    phone: "",
    experience: "",
    coverLetter: "",
    resume: null,
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((p) => ({
      ...p,
      resume: e.target.files?.[0] || null,
    }));
  };

  /* ✅ FORM SUBMIT via FormSubmit */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    if (!acceptedTerms || !acceptedPolicy) {
      toast({
        title: "Please accept required terms",
        description: "You must accept Terms & Conditions and Privacy Policy.",
        variant: "destructive",
      });
      return;
    }

    if (!captchaVerified) {
      toast({
        title: "Captcha required",
        description: "Please verify that you are not a robot.",
        variant: "destructive",
      });
      return;
    }

    const submitData = new FormData();
    submitData.append("_subject", `Job Application – ${selectedJob.title}`);
    submitData.append("_template", "table");
    submitData.append("_captcha", "false");

    submitData.append("Job Title", selectedJob.title);
    submitData.append("Name", formData.name);
    submitData.append("Email", formData.email);
    submitData.append("Phone", formData.phone);
    submitData.append("Experience", formData.experience);
    submitData.append("Cover Letter", formData.coverLetter);

    if (formData.resume) {
      submitData.append("Resume", formData.resume);
    }

    try {
      const res = await fetch(
        "https://formsubmit.co/ulmindpvtltd@gmail.com",
        {
          method: "POST",
          body: submitData,
        }
      );

      if (res.ok) {
        toast({
          title: "Application submitted",
          description: `Your application for ${selectedJob.title} was sent successfully.`,
        });

        setSelectedJob(null);
        setAcceptedTerms(false);
        setAcceptedPolicy(false);
        setCaptchaVerified(false);

        setFormData({
          name: "",
          email: "",
          phone: "",
          experience: "",
          coverLetter: "",
          resume: null,
        });
      } else {
        throw new Error();
      }
    } catch {
      toast({
        title: "Submission failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-20 pb-8 lg:pt-28 lg:pb-10 overflow-hidden bg-[#020b16]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop')"
            }}
          />
          {/* Gradient overlay similar to the image */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#021124] via-[#021124]/95 to-[#021124]/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-xl"
          >
            {/* Badge */}
            <div className="inline-block px-4 py-1.5 rounded-[20px] bg-white/5 border border-white/10 backdrop-blur-md mb-4 shadow-sm">
              <span className="text-xs lg:text-sm font-semibold tracking-wider text-[#ff5a5f] uppercase">
                Join Our Team
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
              Careers
            </h1>
            
            <div className="w-12 h-1 bg-[#ff5a5f] mb-4" />
            
            <p className="text-sm md:text-base text-gray-300 leading-relaxed max-w-lg">
              We partner with leaders to unlock sustainable performance. 
              Come architect the future of consulting with us and chart your happiness.
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
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
                alt="Our Team" 
                className="w-full h-[220px] md:h-[300px] object-cover transition-transform duration-700"
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
              className="absolute -right-4 top-1/2 -translate-y-1/2 bg-[#222a36]/90 backdrop-blur-md p-2 md:p-3 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.4)] border border-white/10 hidden md:flex items-center justify-center transform hover:scale-110 transition-transform z-20 group"
            >
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-emerald-500 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Job List */}
      <section className="py-20 relative overflow-hidden bg-background">
        {/* Continuous Dynamic Gradient Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center opacity-50">
          <motion.div animate={{ scale: [1, 1.15, 1], x: [0, -30, 0] }} transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[10%] -right-[10%] w-[900px] h-[900px] bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-[150px]" />
          <motion.div animate={{ scale: [1, 1.1, 1], y: [0, 40, 0] }} transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[20%] -left-[10%] w-[800px] h-[800px] bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-[150px]" />
          <div className="absolute top-[40%] left-[30%] w-[600px] h-[600px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[140px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 space-y-6 relative z-10">
        {jobOpenings.map((job) => (
          <Card key={job.id} className="p-6">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold">{job.title}</h3>
                <Badge className="mt-2">{job.department}</Badge>

                <p className="text-muted-foreground mt-4">
                  {job.description}
                </p>

                <div className="flex gap-4 text-sm mt-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {job.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" /> {job.experience}
                  </span>
                </div>
              </div>

              <Button onClick={() => setSelectedJob(job)}>
                Apply Now <Sparkles className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
        </div>
      </section>

      {/* Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg w-full max-w-2xl p-6 relative">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4"
            >
              <X />
            </button>

            <h2 className="text-2xl font-bold mb-6">
              Apply for {selectedJob.title}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="name" placeholder="Full name" required value={formData.name} onChange={handleChange} />
              <Input name="email" type="email" placeholder="Email" required value={formData.email} onChange={handleChange} />
              <Input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
              <Input name="experience" placeholder="Years of experience" required value={formData.experience} onChange={handleChange} />
              <Textarea name="coverLetter" placeholder="Why should we hire you?" rows={5} required value={formData.coverLetter} onChange={handleChange} />
              <Input type="file" onChange={handleFileChange} required />

              {/* ✅ TERMS */}
              <div className="space-y-2 text-sm">
                <label className="flex gap-2">
                  <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} />
                  I agree to the Terms & Conditions
                </label>
                <label className="flex gap-2">
                  <input type="checkbox" checked={acceptedPolicy} onChange={(e) => setAcceptedPolicy(e.target.checked)} />
                  I agree to the Privacy Policy
                </label>
              </div>

              {/* ✅ CAPTCHA */}
              <ReCAPTCHA
                sitekey="6Lc5pTgsAAAAAMCtIJaKj5iK79KYT6hSfwE4CMBk"
                onChange={() => setCaptchaVerified(true)}
              />

              <Button type="submit" className="w-full">
                Submit Application <Send className="ml-2 w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* CTA */}
      <CTASection />
    </div>
  );
};

export default Career;
