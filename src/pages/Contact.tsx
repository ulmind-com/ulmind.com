import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ReCAPTCHA from "react-google-recaptcha";
import { useFingerprint } from "@/hooks/useFingerprint";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send, Star } from "lucide-react";
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
  technologies: string[];
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
    technologies: [],
  });

  // Dynamic Budget Options
  const getBudgetOptions = () => {
    const isCreative = ["Content Writing", "Graphics Design"].includes(formData.projectType);

    if (isCreative) {
      return currency === "USD" ? [
        { label: "Under $2", value: "Under $2" },
        { label: "$2 - $5", value: "$2 - $5" },
        { label: "$5 - $12", value: "$5 - $12" },
        { label: "$12 - $25", value: "$12 - $25" },
        { label: "$25 - $50", value: "$25 - $50" },
        { label: "Over $50", value: "Over $50" },
      ] : [
        { label: "Under ₹99", value: "Under ₹99" },
        { label: "₹99 - ₹199", value: "₹99 - ₹199" },
        { label: "₹199 - ₹499", value: "₹199 - ₹499" },
        { label: "₹499 - ₹999", value: "₹499 - ₹999" },
        { label: "₹999 - ₹1,999", value: "₹999 - ₹1,999" },
        { label: "Over ₹1,999", value: "Over ₹1,999" },
      ];
    }

    // Default Tech/Web/App budgets
    return currency === "USD" ? [
      { label: "Under $500", value: "Under $500" },
      { label: "$500 - $2,000", value: "$500 - $2,000" },
      { label: "$2,000 - $5,000", value: "$2,000 - $5,000" },
      { label: "$5,000 - $15,000", value: "$5,000 - $15,000" },
      { label: "$15,000 - $50,000", value: "$15,000 - $50,000" },
      { label: "Over $50,000", value: "Over $50,000" },
    ] : [
      { label: "Under ₹4,999", value: "Under ₹4,999" },
      { label: "₹4,999 - ₹9,999", value: "₹4,999 - ₹9,999" },
      { label: "₹9,999 - ₹19,999", value: "₹9,999 - ₹19,999" },
      { label: "₹19,999 - ₹39,999", value: "₹19,999 - ₹39,999" },
      { label: "₹39,999 - ₹59,999", value: "₹39,999 - ₹59,999" },
      { label: "Over ₹99,999", value: "Over ₹99,999" },
    ];
  };

  const currentBudgetOptions = getBudgetOptions();

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProjectTypeChange = (value: string) => {
    // Reset technologies and budget when switching project types
    setFormData((prev) => ({ ...prev, projectType: value, technologies: [], budget: "" }));
  };

  const toggleTechnology = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.includes(tech)
        ? prev.technologies.filter((t) => t !== tech)
        : [...prev.technologies, tech],
    }));
  };

  // Categorized Tech Stack to show dynamically
  const techCategories = {
    web: {
      Frontend: ["React", "Next.js", "Vue", "Angular"],
      Backend: ["Node.js", "Python", "PHP", "Laravel"],
      Database: ["MongoDB", "MySQL", "PostgreSQL"],
      Cloud: ["AWS", "Google Cloud", "Azure", "Firebase"]
    },
    app: {
      Frontend: ["React Native", "Flutter", "Swift", "Kotlin"],
      Backend: ["Node.js", "Python", "PHP", "Laravel"],
      Database: ["MongoDB", "MySQL", "PostgreSQL"],
      Cloud: ["AWS", "Google Cloud", "Azure", "Firebase"]
    }
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

    if (formData.technologies.length > 0) {
      formDataToSend.append("Technologies", formData.technologies.join(", "));
    }

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
          technologies: [],
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
        {/* Static Blur Backgrounds to ensure 60fps scrolling (Removed heavy framer-motion blur animations) */}
        <BlurBlob position={{ top: "0%", left: "-10%" }} size={{ width: "800px", height: "800px" }} colorClass="bg-rose-500" opacityClass="opacity-10 dark:opacity-10" />
        <BlurBlob position={{ top: "80%", left: "80%" }} size={{ width: "900px", height: "900px" }} colorClass="bg-blue-500" opacityClass="opacity-10 dark:opacity-10" />
        <BlurBlob position={{ top: "40%", left: "30%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-violet-500" opacityClass="opacity-5 dark:opacity-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="grid lg:grid-cols-5 gap-12">

            {/* FORM CARD */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="lg:col-span-3"
            >
              <div className="relative rounded-3xl p-[1px] bg-gradient-to-br from-white/40 dark:from-white/10 to-transparent shadow-xl">
                <div className="rounded-[23px] bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/40 dark:border-white/10 overflow-hidden h-full">
                  <div className="p-8 sm:p-10 relative">
                    {/* Subtle static inner highlight instead of heavy blur */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/5 dark:bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

                    <h3 className="text-3xl font-black mb-8 text-slate-800 dark:text-white tracking-tight relative z-10">
                      Tell Us About Your Project
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                      <div className="grid md:grid-cols-2 gap-5">
                        <Input
                          required
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="bg-white/50 dark:bg-white/5 backdrop-blur-md border-white/50 dark:border-white/10 focus-visible:ring-cyan-500/30 rounded-xl h-12 shadow-sm"
                        />
                        <Input
                          type="email"
                          required
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="bg-white/50 dark:bg-white/5 backdrop-blur-md border-white/50 dark:border-white/10 focus-visible:ring-cyan-500/30 rounded-xl h-12 shadow-sm"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-5">
                        <Input
                          placeholder="Company name"
                          value={formData.company}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                          className="bg-white/50 dark:bg-white/5 backdrop-blur-md border-white/50 dark:border-white/10 focus-visible:ring-cyan-500/30 rounded-xl h-12 shadow-sm"
                        />
                        <Input
                          placeholder="+91 XXXXX XXXXX"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="bg-white/50 dark:bg-white/5 backdrop-blur-md border-white/50 dark:border-white/10 focus-visible:ring-cyan-500/30 rounded-xl h-12 shadow-sm"
                        />
                      </div>

                      <select
                        required
                        value={formData.projectType}
                        onChange={(e) => handleProjectTypeChange(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-[#151c2c] backdrop-blur-md border border-white/50 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 shadow-sm text-sm transition-all text-slate-800 dark:text-slate-200"
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

                      {/* Dynamic Tech Stack Selection */}
                      {(["Web Application", "E-commerce", "SaaS", "Mobile App"].includes(formData.projectType)) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="space-y-3 bg-white/30 dark:bg-black/10 backdrop-blur-md p-5 rounded-2xl border border-white/60 dark:border-white/5 shadow-sm overflow-hidden"
                        >
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                            Select Required Technologies (Optional)
                          </label>
                          <div className="flex flex-col gap-5">
                            {Object.entries(formData.projectType === "Mobile App" ? techCategories.app : techCategories.web).map(([category, options]) => {
                              // Find if any option in this category is currently selected
                              const selectedOption = options.find((opt) => formData.technologies.includes(opt));
                              
                              return (
                                <div key={category} className="space-y-2">
                                  <h5 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase">{category}</h5>
                                  <div className="flex flex-wrap gap-2.5 min-h-[34px]">
                                    <AnimatePresence mode="popLayout">
                                      {options.map((tech) => {
                                        // If an option is selected in this category and it's NOT this one, hide it
                                        if (selectedOption && selectedOption !== tech) return null;

                                        return (
                                          <motion.button
                                            layout
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                            type="button"
                                            key={tech}
                                            onClick={() => toggleTechnology(tech)}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all duration-300 ${
                                              formData.technologies.includes(tech)
                                                ? (category === "Frontend" ? "bg-cyan-500 text-white border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]" :
                                                   category === "Backend" ? "bg-violet-500 text-white border-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.4)]" :
                                                   category === "Database" ? "bg-emerald-500 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]" :
                                                   "bg-rose-500 text-white border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)]")
                                                : "bg-white/60 dark:bg-black/40 text-slate-600 dark:text-slate-300 border-white/50 dark:border-white/10 hover:border-slate-400/60 dark:hover:border-white/30 hover:scale-105 shadow-sm"
                                            }`}
                                          >
                                            {tech}
                                          </motion.button>
                                        );
                                      })}
                                    </AnimatePresence>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Project Budget</label>
                          <div className="flex bg-white/60 dark:bg-black/30 backdrop-blur-md rounded-lg p-1 border border-white/40 dark:border-white/10 shadow-sm">
                            <button
                              type="button"
                              onClick={() => handleCurrencyChange("USD")}
                              className={`px-4 py-1.5 text-xs rounded-md transition-all duration-300 ${currency === "USD" ? "bg-white dark:bg-white/10 shadow text-cyan-600 dark:text-cyan-400 font-bold" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"}`}
                            >
                              USD ($)
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCurrencyChange("INR")}
                              className={`px-4 py-1.5 text-xs rounded-md transition-all duration-300 ${currency === "INR" ? "bg-white dark:bg-white/10 shadow text-cyan-600 dark:text-cyan-400 font-bold" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"}`}
                            >
                              INR (₹)
                            </button>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                          <select
                            required
                            value={formData.budget}
                            onChange={(e) => handleInputChange("budget", e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-[#151c2c] backdrop-blur-md border border-white/50 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 shadow-sm text-sm transition-all text-slate-800 dark:text-slate-200"
                          >
                            <option value="">Select budget range</option>
                            {currentBudgetOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>

                          <select
                            required
                            value={formData.timeline}
                            onChange={(e) => handleInputChange("timeline", e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-[#151c2c] backdrop-blur-md border border-white/50 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 shadow-sm text-sm transition-all text-slate-800 dark:text-slate-200"
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
                        rows={5}
                        placeholder="Tell us about your project goals and specific requirements…"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        className="bg-white/50 dark:bg-white/5 backdrop-blur-md border-white/50 dark:border-white/10 focus-visible:ring-cyan-500/30 rounded-xl resize-none shadow-sm"
                      />

                      <div className="flex justify-center md:justify-start">
                        <div className="overflow-hidden rounded-lg shadow-sm border border-white/20 dark:border-white/5">
                          <ReCAPTCHA
                            sitekey="6Lc5pTgsAAAAAMCtIJaKj5iK79KYT6hSfwE4CMBk"
                            onChange={() => setCaptchaVerified(true)}
                            theme="light"
                          />
                        </div>
                      </div>

                      <Button type="submit" size="lg" className="w-full group bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-500 hover:to-pink-400 text-white rounded-xl h-14 text-base font-bold shadow-[0_8px_20px_rgba(225,29,72,0.3)] hover:shadow-[0_12px_25px_rgba(225,29,72,0.4)] transition-all overflow-hidden relative">
                        <span className="relative z-10 flex items-center">
                          Send Message
                          <Send className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CONTACT INFO SIDEBAR */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="lg:col-span-2 space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-6">
                {contactInfo.map((info) => (
                  <motion.div
                    key={info.title}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="relative group rounded-3xl p-[1px] bg-gradient-to-br from-white/40 dark:from-white/10 to-transparent shadow-lg"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/40 to-fuchsia-500/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm mix-blend-overlay" />
                    <div className="relative flex items-center gap-5 p-6 bg-white/60 dark:bg-black/20 backdrop-blur-xl rounded-[23px] border border-white/40 dark:border-white/5 z-10 h-full overflow-hidden">
                      {/* Replaced heavy blur tracking with simpler static hover color tint */}
                      <div className="absolute inset-0 bg-rose-500/0 group-hover:bg-rose-500/5 transition-colors pointer-events-none" />

                      <div className="w-14 h-14 bg-gradient-to-br from-white/80 to-white/20 dark:from-white/10 dark:to-white/5 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-2xl flex items-center justify-center shrink-0 shadow-[0_8px_16px_rgba(0,0,0,0.05)] group-hover:shadow-[0_8px_16px_rgba(225,29,72,0.15)] transition-shadow">
                        <info.icon className="w-6 h-6 text-rose-500 dark:text-rose-400 drop-shadow-sm" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-lg mb-1 text-slate-800 dark:text-white tracking-tight">{info.title}</h4>
                        <a
                          href={info.href}
                          className="text-slate-600 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 hover:underline text-base font-semibold transition-colors block leading-tight"
                          target={info.title === "Visit Us" ? "_blank" : undefined}
                          rel="noopener noreferrer"
                        >
                          {info.value}
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Liquid Premium Box */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative p-[1px] rounded-3xl overflow-hidden mt-6 lg:mt-auto shadow-2xl group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500 via-[#ff5a5f] to-amber-500 opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/30 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

                <div className="relative p-8 rounded-[23px] bg-gradient-to-br from-white/10 to-transparent backdrop-blur-xl border border-white/20 h-full flex flex-col justify-center">
                  <h4 className="text-2xl font-black mb-3 text-white drop-shadow-md tracking-tight">Focus on Growth</h4>
                  <p className="text-white/90 text-sm leading-relaxed font-medium">
                    We combine technical excellence with strategic thinking to build
                    Digital Real Estate that acts as a 24/7 salesperson for your business.
                  </p>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center text-[10px] font-bold text-white">4.9</div>
                      <div className="w-8 h-8 rounded-full bg-yellow-400 border border-white/30 backdrop-blur-md flex items-center justify-center text-black">
                        <Star className="w-4 h-4 fill-black" />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-white tracking-widest uppercase opacity-80 group-hover:opacity-100 transition-opacity">Trusted Partner</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;