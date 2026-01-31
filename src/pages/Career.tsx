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
      {/* Job List */}
      <section className="py-20 max-w-7xl mx-auto px-4 space-y-6">
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
    </div>
  );
};

export default Career;
