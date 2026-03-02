import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ReCAPTCHA from "react-google-recaptcha";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
}

const Contact = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    company: "",
    phone: "",
    projectType: "",
    budget: "",
    timeline: "",
    message: "",
  });

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /* ✅ FORM SUBMIT — FormSubmit */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!captchaVerified) {
      toast.error("Please confirm you are not a robot.");
      return;
    }

    const formDataToSend = new FormData();

    /* FormSubmit settings */
    formDataToSend.append("_subject", "New Project Inquiry – ULMIND");
    formDataToSend.append("_template", "table");
    formDataToSend.append("_captcha", "false");

    /* Actual form fields */
    formDataToSend.append("Name", formData.name);
    formDataToSend.append("Email", formData.email);
    formDataToSend.append("Company", formData.company);
    formDataToSend.append("Phone", formData.phone);
    formDataToSend.append("Project Type", formData.projectType);
    formDataToSend.append("Budget", formData.budget);
    formDataToSend.append("Timeline", formData.timeline);
    formDataToSend.append("Message", formData.message);

    try {
      const response = await fetch(
        "https://formsubmit.co/ulmindpvtltd@gmail.com",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (response.ok) {
        toast.success("Thank you! Your message has been sent.");

        setCaptchaVerified(false);
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          projectType: "",
          budget: "",
          timeline: "",
          message: "",
        });
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      value: "contact@ulmind.com",
      description: "Send us an email anytime",
    },
    {
      icon: Phone,
      title: "Call Us",
      value: "+91 85378 61040",
      description: "Mon–Fri, 9am to 6pm",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      value: "Haldia, West Bengal, India",
      description: "Come say hello at our office",
    },
  ];

  return (
    <section id="contact" ref={ref} className="py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 mb-4 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Let’s Connect
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Start Your{" "}
            <span className="gradient-text">Project?</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Let’s discuss your vision and turn it into a powerful digital solution.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* FORM */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">
                  Tell Us About Your Project
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      required
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                    />

                    <Input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Company name"
                      value={formData.company}
                      onChange={(e) =>
                        handleInputChange("company", e.target.value)
                      }
                    />

                    <Input
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                    />
                  </div>

                  <select
                    required
                    value={formData.projectType}
                    onChange={(e) =>
                      handleInputChange("projectType", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-md bg-background border border-input"
                  >
                    <option value="">Select project type</option>
                    <option value="Web Application">Web Application</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="SaaS">SaaS</option>
                    <option value="Consulting">Consulting</option>
                  </select>

                  <div className="grid md:grid-cols-2 gap-4">
                    <select
                      required
                      value={formData.budget}
                      onChange={(e) =>
                        handleInputChange("budget", e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-md bg-background border border-input"
                    >
                      <option value="">Select budget range</option>
                      <option value="Under $10,000">Under $10,000</option>
                      <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                      <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                      <option value="$50,000 - $100,000">$50,000 - $100,000</option>
                      <option value="Over $100,000">Over $100,000</option>
                    </select>

                    <select
                      required
                      value={formData.timeline}
                      onChange={(e) =>
                        handleInputChange("timeline", e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-md bg-background border border-input"
                    >
                      <option value="">Select timeline</option>
                      <option value="ASAP">ASAP</option>
                      <option value="1–3 months">1–3 months</option>
                      <option value="3–6 months">3–6 months</option>
                      <option value="6–12 months">6–12 months</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>

                  <Textarea
                    required
                    rows={6}
                    placeholder="Tell us about your project…"
                    value={formData.message}
                    onChange={(e) =>
                      handleInputChange("message", e.target.value)
                    }
                  />

                  <ReCAPTCHA
                    sitekey="6Lc5pTgsAAAAAMCtIJaKj5iK79KYT6hSfwE4CMBk"
                    onChange={() => setCaptchaVerified(true)}
                  />

                  <Button type="submit" size="lg" className="w-full">
                    Send Message <Send className="ml-2 w-4 h-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
 
{/* INFO */}
<motion.div
  initial={{ opacity: 0, x: 40 }}
  animate={inView ? { opacity: 1, x: 0 } : {}}
  transition={{ duration: 0.8 }}
  className="space-y-6"
>
  {contactInfo.map((info) => (
    <div
      key={info.title}
      className="flex gap-4 p-6 bg-card rounded-xl shadow"
    >
      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
        <info.icon className="w-6 h-6 text-white" />
      </div>

      <div>
        <h4 className="font-semibold mb-1">{info.title}</h4>

        {/* 🔗 Updated Links */}
        {info.title === "Email Us" && (
          <a
            href="mailto:contact@ulmind.com"
            className="text-primary hover:underline text-sm"
          >
            contact@ulmind.com
          </a>
        )}

        {info.title === "Call Us" && (
          <a
            href="tel:+918537861040"
            className="text-primary hover:underline text-sm"
          >
            +91 85378 61040
          </a>
        )}

        {info.title === "Visit Us" && (
          <a
            href="https://maps.app.goo.gl/hyKu5FMJXY8sxYTQ7"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline text-sm"
          >
            Haldia, West Bengal, India
          </a>
        )}

        <p className="text-sm text-muted-foreground mt-1">
          {info.description}
        </p>
      </div>
    </div>
  ))}
</motion.div>



        </div>
      </div>
    </section>
  );
};

export default Contact;