import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ReCAPTCHA from "react-google-recaptcha";
import { useFingerprint } from "@/hooks/useFingerprint";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import BlurBlob from "@/components/BlurBlob";

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
  const { trackUser } = useFingerprint(undefined, undefined);

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
      { label: "Under $500", value: "Under $500" },
      { label: "$500 - $2,000", value: "$500 - $2,000" },
      { label: "$2,000 - $5,000", value: "$2,000 - $5,000" },
      { label: "$5,000 - $15,000", value: "$5,000 - $15,000" },
      { label: "$15,000 - $50,000", value: "$15,000 - $50,000" },
      { label: "Over $50,000", value: "Over $50,000" },
    ],
    INR: [
      { label: "Under ₹40,000", value: "Under ₹40,000" },
      { label: "₹40,000 - ₹1,50,000", value: "₹40,000 - ₹1,50,000" },
      { label: "₹1,50,000 - ₹4,00,000", value: "₹1,50,000 - ₹4,00,000" },
      { label: "₹4,00,000 - ₹10,00,000", value: "₹4,00,000 - ₹10,00,000" },
      { label: "₹10,00,000 - ₹40,00,000", value: "₹10,00,000 - ₹40,00,000" },
      { label: "Over ₹40,00,000", value: "Over ₹40,00,000" },
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
      
      // Track user data with email and name
      trackUser("accepted", formData.name, formData.email);

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
      toast.error("Something went wrong. Please try again.");
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
      href: "https://maps.app.goo.gl/hyKu5FMJXY8sxYTQ7", 
      description: "Come say hello at our office" 
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <BlurBlob position={{ top: "15%", left: "15%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-cyan-300 dark:bg-cyan-600" opacityClass="opacity-40 dark:opacity-20" />
      <BlurBlob position={{ top: "65%", left: "85%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-fuchsia-300 dark:bg-fuchsia-600" opacityClass="opacity-40 dark:opacity-20" />

      {/* HERO */}
      <section className="relative pt-24 pb-12 lg:pt-36 lg:pb-16 overflow-hidden bg-[#020b16]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1557425955-df376b5903c8?q=80&w=2070&auto=format&fit=crop')"
            }}
          />
          {/* Gradient overlay similar to the image */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#021124] via-[#021124]/95 to-[#021124]/60" />
        </div>
        <BlurBlob position={{ top: "50%", left: "5%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-cyan-500" opacityClass="opacity-30 mix-blend-screen" className="z-10" />
        <BlurBlob position={{ top: "50%", left: "95%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-fuchsia-500" opacityClass="opacity-30 mix-blend-screen" className="z-10" />

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
                Let's Connect
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
              Contact Us
            </h1>
            
            <div className="w-16 h-1 bg-[#ff5a5f] mb-6" />
            
            <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-lg">
              Ready to start your project? Let’s discuss your vision and turn it into a powerful digital solution. We combine technical excellence with strategic thinking.
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
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop" 
                alt="Contact Us" 
                className="w-full h-[280px] md:h-[360px] object-cover transition-transform duration-700"
              />
              {/* Subtle glass overlay inside image container */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </motion.div>
            
            {/* Floating Phone Badge */}
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
              <div className="w-8 h-8 rounded-full border-2 border-emerald-500 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                <Phone className="w-5 h-5 text-emerald-500" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="contact" ref={ref} className="py-20 relative overflow-hidden bg-background">
        {/* Continuous Dynamic Gradient Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center opacity-50">
          <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute top-[10%] -left-[10%] w-[900px] h-[900px] bg-rose-500/10 dark:bg-rose-500/15 rounded-full blur-[150px]" />
          <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, -90, 0] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute bottom-[20%] -right-[10%] w-[1000px] h-[1000px] bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-[150px]" />
          <motion.div animate={{ y: [0, 50, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[40%] left-[30%] w-[700px] h-[700px] bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-[140px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

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
                    <option value="Consulting">Consulting</option>
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
    </div>
  );
};

export default Contact;