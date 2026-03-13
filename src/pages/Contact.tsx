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
  currency: "USD" | "INR";
  timeline: string;
  message: string;
}

const Contact = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    company: "",
    phone: "",
    projectType: "",
    budget: "",
    currency: "USD",
    timeline: "",
    message: "",
  });

  // Dynamic Budget Options
  const budgetOptions = {
    USD: [
      { label: "Under $60", value: "Under $60" },
      { label: "$60 - $100", value: "$60 - $100" },
      { label: "$100 - $200", value: "$100 - $200" },
      { label: "$200 - $500", value: "$200 - $500" },
      { label: "Over $500", value: "Over $500" },
    ],
    INR: [
      { label: "Under ₹4,999", value: "Under ₹4,999" },
      { label: "₹9,999 - ₹14,999", value: "₹9,999 - ₹14,999" },
      { label: "₹19,999 - ₹29,999", value: "₹19,999 - ₹29,999" },
      { label: "₹39,999 - ₹59,999", value: "₹39,999 - ₹59,999" },
      { label: "Over ₹1,00,000", value: "Over ₹1,00,000" },
    ],
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCurrencyChange = (curr: "USD" | "INR") => {
    setCurrency(curr);
    // Reset budget selection when currency toggles to avoid mismatch
    setFormData((prev) => ({ ...prev, currency: curr, budget: "" }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!captchaVerified) {
      toast.error("Please confirm you are not a robot.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("_subject", `New Project Inquiry [${formData.currency}] – ULMIND`);
    formDataToSend.append("_template", "table");
    formDataToSend.append("_captcha", "false");

    formDataToSend.append("Name", formData.name);
    formDataToSend.append("Email", formData.email);
    formDataToSend.append("Company", formData.company);
    formDataToSend.append("Phone", formData.phone);
    formDataToSend.append("Project Type", formData.projectType);
    formDataToSend.append("Currency", formData.currency);
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
          currency: "USD",
          timeline: "",
          message: "",
        });
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again later.");
    }
  };

  const contactInfo = [
    { 
      icon: Mail, 
      title: "Email Us", 
      value: "contact@ulmind.com", 
      href: "mailto:contact@ulmind.com", 
      description: "Send us an email anytime" 
    },
    { 
      icon: Phone, 
      title: "Call Us", 
      value: "+91 85378 61040", 
      href: "tel:+918537861040", 
      description: "Mon–Fri, 9am to 6pm" 
    },
    { 
      icon: MapPin, 
      title: "Visit Us", 
      value: "Haldia, West Bengal, India", 
      href: "https://maps.google.com", 
      description: "Come say hello at our office" 
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
            Ready to Start Your <span className="gradient-text">Project?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Let’s discuss your vision and turn it into a powerful digital solution.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* FORM CARD */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <Card className="border-none shadow-xl bg-card">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Tell Us About Your Project</h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input 
                      required 
                      placeholder="Your full name" 
                      value={formData.name} 
                      onChange={(e) => handleInputChange("name", e.target.value)} 
                    />
                    <Input 
                      type="email" 
                      required 
                      placeholder="your@email.com" 
                      value={formData.email} 
                      onChange={(e) => handleInputChange("email", e.target.value)} 
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Input 
                      placeholder="Company name" 
                      value={formData.company} 
                      onChange={(e) => handleInputChange("company", e.target.value)} 
                    />
                    <Input 
                      placeholder="+91 XXXXX XXXXX" 
                      value={formData.phone} 
                      onChange={(e) => handleInputChange("phone", e.target.value)} 
                    />
                  </div>

                  <select
                    required
                    value={formData.projectType}
                    onChange={(e) => handleInputChange("projectType", e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-background border border-input focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  >
                    <option value="">Select project type</option>
                    <option value="Web Application">Web Application</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="SaaS">SaaS</option>
                    <option value="Graphics Design">Graphics Design</option>
                    <option value="Content Writing">Content Writing</option>
                  </select>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-muted-foreground">Select Budget Range</label>
                      <div className="flex bg-muted rounded-lg p-1 border border-border">
                        <button
                          type="button"
                          onClick={() => handleCurrencyChange("USD")}
                          className={`px-4 py-1 text-xs rounded-md transition-all ${currency === "USD" ? "bg-background shadow-sm text-primary font-bold" : "text-muted-foreground hover:text-foreground"}`}
                        >
                          USD ($)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCurrencyChange("INR")}
                          className={`px-4 py-1 text-xs rounded-md transition-all ${currency === "INR" ? "bg-background shadow-sm text-primary font-bold" : "text-muted-foreground hover:text-foreground"}`}
                        >
                          INR (₹)
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <select
                        required
                        value={formData.budget}
                        onChange={(e) => handleInputChange("budget", e.target.value)}
                        className="w-full px-3 py-2 rounded-md bg-background border border-input focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      >
                        <option value="">Select amount</option>
                        {budgetOptions[currency].map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>

                      <select
                        required
                        value={formData.timeline}
                        onChange={(e) => handleInputChange("timeline", e.target.value)}
                        className="w-full px-3 py-2 rounded-md bg-background border border-input focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      >
                        <option value="">Select timeline</option>
                        <option value="ASAP">ASAP</option>
                        <option value="1–3 months">1–3 months</option>
                        <option value="3–6 months">3–6 months</option>
                        <option value="Flexible">Flexible</option>
                      </select>
                    </div>
                  </div>

                  <Textarea
                    required
                    rows={4}
                    placeholder="Tell us about your project goals…"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                  />

                  <div className="flex justify-center md:justify-start">
                    <ReCAPTCHA
                      sitekey="6Lc5pTgsAAAAAMCtIJaKj5iK79KYT6hSfwE4CMBk"
                      onChange={() => setCaptchaVerified(true)}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full group">
                    Send Message 
                    <Send className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* CONTACT INFO SIDEBAR */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {contactInfo.map((info) => (
              <div
                key={info.title}
                className="flex gap-5 p-6 bg-card rounded-2xl shadow-sm border border-border/50 hover:border-primary/30 transition-colors"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <info.icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">{info.title}</h4>
                  <a 
                    href={info.href} 
                    className="text-primary hover:underline text-base font-medium"
                    target={info.title === "Visit Us" ? "_blank" : undefined}
                    rel="noopener noreferrer"
                  >
                    {info.value}
                  </a>
                  <p className="text-sm text-muted-foreground mt-1">
                    {info.description}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Optional decorative box */}
            <div className="p-8 bg-primary rounded-2xl text-primary-foreground">
              <h4 className="text-xl font-bold mb-2">Why choose ULMIND?</h4>
              <p className="opacity-90 text-sm leading-relaxed">
                We combine technical excellence with strategic thinking to deliver 
                products that actually grow your business.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;