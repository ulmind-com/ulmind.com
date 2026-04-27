import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ReCAPTCHA from "react-google-recaptcha";
import { useFingerprint } from "@/hooks/useFingerprint";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, Star, CheckCircle2, XCircle, Sparkles, ArrowRight, Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import BlurBlob from "@/components/BlurBlob";
import Lottie from "lottie-react";

// ─────────────────────────────────────────────
// Ultra-Premium Toast Component v2
// ─────────────────────────────────────────────
type ToastType = "success" | "error";
interface PremiumToastProps {
  message: string;
  subMessage?: string;
  footer?: string;
  type: ToastType;
  onClose: () => void;
}

const PremiumToast = ({ message, subMessage, footer, type, onClose }: PremiumToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 8000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === "success";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.88, filter: "blur(12px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -20, scale: 0.92, filter: "blur(8px)" }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="w-full relative"
    >
      {/* ── Ambient outer glow ── */}
      <div
        className={`absolute -inset-2 rounded-[28px] blur-3xl pointer-events-none ${
          isSuccess
            ? "bg-emerald-400/25 dark:bg-emerald-500/20"
            : "bg-rose-400/25 dark:bg-rose-500/20"
        }`}
      />

      {/* ── Main Card ── */}
      <div
        className={`relative rounded-2xl overflow-hidden ${
          isSuccess
            ? [
                "border border-emerald-200/80 dark:border-emerald-500/25",
                "bg-gradient-to-br from-white via-emerald-50/60 to-white",
                "dark:bg-none dark:bg-[#050f0c]",
                "shadow-[0_8px_48px_rgba(16,185,129,0.18),0_2px_8px_rgba(0,0,0,0.06)]",
                "dark:shadow-[0_8px_48px_rgba(16,185,129,0.22),0_0_0_1px_rgba(16,185,129,0.1)]",
              ].join(" ")
            : [
                "border border-rose-200/80 dark:border-rose-500/25",
                "bg-gradient-to-br from-white via-rose-50/60 to-white",
                "dark:bg-none dark:bg-[#0f0508]",
                "shadow-[0_8px_48px_rgba(225,29,72,0.18),0_2px_8px_rgba(0,0,0,0.06)]",
                "dark:shadow-[0_8px_48px_rgba(225,29,72,0.22),0_0_0_1px_rgba(225,29,72,0.1)]",
              ].join(" ")
        }`}
      >
        {/* ── Top glow stripe ── */}
        <div
          className={`h-[3px] w-full ${
            isSuccess
              ? "bg-gradient-to-r from-emerald-200 via-emerald-500 to-emerald-200 dark:from-emerald-900 dark:via-emerald-400 dark:to-emerald-900"
              : "bg-gradient-to-r from-rose-200 via-rose-500 to-rose-200 dark:from-rose-900 dark:via-rose-400 dark:to-rose-900"
          }`}
        />

        {/* ── Shimmer sweep ── */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 dark:via-white/[0.03] to-transparent -skew-x-12 pointer-events-none z-10"
          animate={{ x: ["-160%", "220%"] }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
        />

        {/* ── Corner radial glows ── */}
        <div
          className={`absolute -top-12 -right-12 w-44 h-44 rounded-full blur-3xl pointer-events-none ${
            isSuccess
              ? "bg-emerald-300/30 dark:bg-emerald-400/15"
              : "bg-rose-300/30 dark:bg-rose-400/15"
          }`}
        />
        <div
          className={`absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-2xl pointer-events-none ${
            isSuccess
              ? "bg-teal-200/25 dark:bg-teal-500/10"
              : "bg-pink-200/25 dark:bg-pink-500/10"
          }`}
        />

        {/* ── Body ── */}
        <div className="relative z-10 p-4 sm:p-5 lg:p-6">

          {/* Header row */}
          <div className="flex items-start gap-4">

            {/* ── Icon badge with pulse ring ── */}
            <div className="relative shrink-0">
              {/* Pulse ring */}
              {isSuccess && (
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  animate={{ scale: [1, 1.55, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    background: "radial-gradient(circle, rgba(16,185,129,0.35) 0%, transparent 70%)",
                  }}
                />
              )}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${
                  isSuccess
                    ? "bg-gradient-to-br from-emerald-50 to-emerald-100/60 dark:from-emerald-500/20 dark:to-emerald-600/10 border-emerald-200 dark:border-emerald-500/35 shadow-[0_0_20px_rgba(16,185,129,0.25)] dark:shadow-[0_0_24px_rgba(16,185,129,0.35)]"
                    : "bg-gradient-to-br from-rose-50 to-rose-100/60 dark:from-rose-500/20 dark:to-rose-600/10 border-rose-200 dark:border-rose-500/35 shadow-[0_0_20px_rgba(225,29,72,0.25)] dark:shadow-[0_0_24px_rgba(225,29,72,0.35)]"
                }`}
              >
                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.div
                      key="success-icon"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 16, delay: 0.12 }}
                    >
                      <CheckCircle2 className="w-7 h-7 text-emerald-500 dark:text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="error-icon"
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.3, 1] }}
                      transition={{ duration: 0.4, delay: 0.12 }}
                    >
                      <XCircle className="w-7 h-7 text-rose-500 dark:text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.8)]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── Text block ── */}
            <div className="flex-1 min-w-0 pt-0.5">
              {/* Badge label */}
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.35 }}
                className="flex items-center gap-1.5 mb-1.5"
              >
                <Sparkles
                  className={`w-3 h-3 shrink-0 ${
                    isSuccess
                      ? "text-emerald-500 dark:text-emerald-400"
                      : "text-rose-500 dark:text-rose-400"
                  }`}
                />
                <span
                  className={`text-[10px] font-black tracking-widest uppercase ${
                    isSuccess
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {isSuccess ? "Message Received" : "Submission Failed"}
                </span>
              </motion.div>

              {/* Main title */}
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.4 }}
                className={`text-sm sm:text-[15px] font-black leading-snug tracking-tight ${
                  isSuccess
                    ? "text-slate-800 dark:text-white"
                    : "text-slate-800 dark:text-white"
                }`}
              >
                {message}
              </motion.p>

              {/* Sub message */}
              {subMessage && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.4 }}
                  className="text-[12.5px] sm:text-[13px] leading-relaxed text-slate-600 dark:text-slate-400 mt-1.5"
                >
                  {subMessage}
                </motion.p>
              )}
            </div>

            {/* ── Close button ── */}
            <button
              onClick={onClose}
              aria-label="Close notification"
              className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 active:scale-90 transition-all duration-200 text-sm font-bold"
            >
              ✕
            </button>
          </div>

          {/* ── Footer stripe ── */}
          {footer && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.45 }}
              className={`mt-4 pt-3.5 border-t flex items-center gap-2.5 ${
                isSuccess
                  ? "border-emerald-100 dark:border-emerald-500/15"
                  : "border-rose-100 dark:border-rose-500/15"
              }`}
            >
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide ${
                  isSuccess
                    ? "bg-emerald-100/80 dark:bg-emerald-500/12 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                    : "bg-rose-100/80 dark:bg-rose-500/12 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20"
                }`}
              >
                <Star className="w-3 h-3" />
                {footer}
              </div>
            </motion.div>
          )}
        </div>

        {/* ── Progress drain bar ── */}
        <div
          className={`relative h-[4px] ${
            isSuccess
              ? "bg-emerald-100 dark:bg-emerald-950/60"
              : "bg-rose-100 dark:bg-rose-950/60"
          }`}
        >
          <motion.div
            className={`h-full rounded-full ${
              isSuccess
                ? "bg-gradient-to-r from-emerald-300 via-emerald-500 to-teal-400"
                : "bg-gradient-to-r from-rose-300 via-rose-500 to-pink-400"
            }`}
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 8, ease: "linear" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// Form Data Interface
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// Main Contact Component
// ─────────────────────────────────────────────
const Contact = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { trackUser } = useFingerprint(undefined, undefined);
  const [toastData, setToastData] = useState<{ message: string; subMessage?: string; footer?: string; type: "success" | "error" } | null>(null);
  const [locationAnimData, setLocationAnimData] = useState<object | null>(null);
  const [mailAnimData, setMailAnimData] = useState<object | null>(null);
  const [callAnimData, setCallAnimData] = useState<object | null>(null);

  useEffect(() => {
    fetch('/Jason/Call%20ringing%20animation.json')
      .then((r) => r.json())
      .then((d: any) => {
        const newColor = [0.0627, 0.7255, 0.5059, 1]; // Emerald 500
        const recolor = (obj: any) => {
          if (!obj || typeof obj !== 'object') return;
          if (Array.isArray(obj)) {
            obj.forEach(recolor);
            return;
          }
          if (obj.ty === 'fl' || obj.ty === 'st') {
            if (obj.c && Array.isArray(obj.c.k) && (obj.c.a === 0 || obj.c.a === undefined)) {
              if (obj.c.k.length === 4) {
                const [r, g, b] = obj.c.k;
                const isGreyscale = Math.max(r, g, b) - Math.min(r, g, b) < 0.05;
                if (!isGreyscale) {
                  obj.c.k = newColor;
                }
              }
            }
          } else if (obj.ty === 'gf' || obj.ty === 'gs') {
            obj.ty = obj.ty === 'gf' ? 'fl' : 'st';
            obj.c = { a: 0, k: newColor };
            delete obj.g;
            delete obj.s;
            delete obj.e;
            delete obj.t;
          }
          Object.values(obj).forEach(recolor);
        };
        recolor(d);

        const stripped = {
          ...d,
          layers: (d.layers ?? []).filter(
            (l: any) => l.ty !== 1 && !/^bg$/i.test(l.nm ?? '') && !/^background$/i.test(l.nm ?? '')
          ),
        };
        setCallAnimData(stripped);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/Jason/Email%20successfully%20sent.json')
      .then((r) => r.json())
      .then((d: any) => {
        const stripped = {
          ...d,
          layers: (d.layers ?? []).filter(
            (l: any) => l.ty !== 1 && !/^bg$/i.test(l.nm ?? '') && !/^background$/i.test(l.nm ?? '')
          ),
        };
        setMailAnimData(stripped);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/lottieflow-ecommerce-14-16-f50847-easey.json')
      .then((r) => r.json())
      .then((d: any) => {
        const stripped = {
          ...d,
          layers: (d.layers ?? []).filter(
            (l: any) => l.ty !== 1 && !/^bg$/i.test(l.nm ?? '') && !/^background$/i.test(l.nm ?? '')
          ),
        };
        setLocationAnimData(stripped);
      })
      .catch(() => {});
  }, []);

  const showToast = (message: string, subMessage: string | undefined, type: "success" | "error", footer?: string) => {
    setToastData({ message, subMessage, type, footer });
  };

  const techRequiredTypes = ["Web Application", "E-commerce", "SaaS", "Mobile App"];

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
      return currency === "USD"
        ? [
            { label: "Under $2", value: "Under $2" },
            { label: "$2 - $5", value: "$2 - $5" },
            { label: "$5 - $12", value: "$5 - $12" },
            { label: "$12 - $25", value: "$12 - $25" },
            { label: "$25 - $50", value: "$25 - $50" },
            { label: "Over $50", value: "Over $50" },
          ]
        : [
            { label: "Under ₹99", value: "Under ₹99" },
            { label: "₹99 - ₹199", value: "₹99 - ₹199" },
            { label: "₹199 - ₹499", value: "₹199 - ₹499" },
            { label: "₹499 - ₹999", value: "₹499 - ₹999" },
            { label: "₹999 - ₹1,999", value: "₹999 - ₹1,999" },
            { label: "Over ₹1,999", value: "Over ₹1,999" },
          ];
    }
    return currency === "USD"
      ? [
          { label: "Under $500", value: "Under $500" },
          { label: "$500 - $2,000", value: "$500 - $2,000" },
          { label: "$2,000 - $5,000", value: "$2,000 - $5,000" },
          { label: "$5,000 - $15,000", value: "$5,000 - $15,000" },
          { label: "$15,000 - $50,000", value: "$15,000 - $50,000" },
          { label: "Over $50,000", value: "Over $50,000" },
        ]
      : [
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

  const techCategories = {
    web: {
      Frontend: ["React", "Next.js", "Vue", "Angular"],
      Backend: ["Node.js", "Python", "PHP", "Laravel"],
      Database: ["MongoDB", "MySQL", "PostgreSQL"],
      Cloud: ["AWS", "Google Cloud", "Azure", "Firebase"],
    },
    app: {
      Frontend: ["React Native", "Flutter", "Swift", "Kotlin"],
      Backend: ["Node.js", "Python", "PHP", "Laravel"],
      Database: ["MongoDB", "MySQL", "PostgreSQL"],
      Cloud: ["AWS", "Google Cloud", "Azure", "Firebase"],
    },
  };

  const handleCurrencyChange = (curr: "USD" | "INR") => {
    setCurrency(curr);
    setFormData((prev) => ({ ...prev, currency: curr, budget: "" }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!captchaVerified) {
      showToast("CAPTCHA Required", "Please confirm you are not a robot before submitting.", "error");
      return;
    }



    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append("_subject", `New Project Inquiry [${formData.currency}] – ULMIND`);
    formDataToSend.append("_template", "table");
    formDataToSend.append("_captcha", "false");
    formDataToSend.append("Name", formData.name);
    formDataToSend.append("Email", formData.email);
    formDataToSend.append("Company / Organization", formData.company);
    formDataToSend.append("Phone", formData.phone);
    formDataToSend.append("Project Type", formData.projectType);
    formDataToSend.append("Currency", formData.currency);
    formDataToSend.append("Budget", formData.budget);
    formDataToSend.append("Timeline", formData.timeline);
    formDataToSend.append("Technologies", formData.technologies.length > 0 ? formData.technologies.join(", ") : "N/A");
    formDataToSend.append("Message", formData.message);

    try {
      const response = await fetch("https://formsubmit.co/ulmindpvtltd@gmail.com", {
        method: "POST",
        body: formDataToSend,
      });

      trackUser("accepted", formData.name, formData.email);

      if (response.ok) {
        showToast(
          "Your Message Has Been Successfully Submitted",
          "We appreciate you reaching out. Our team will carefully review your enquiry and respond within 24 hours.",
          "success",
          "Thank you for choosing ULMIND."
        );
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
        showToast("Submission Failed", "Failed to send your message. Please try again or contact us directly.", "error");
      }
    } catch {
      showToast("Something Went Wrong", "An unexpected error occurred. Please try again shortly.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      value: "contact@ulmind.com",
      href: "mailto:contact@ulmind.com",
      description: "Send us an email anytime",
      color: "from-cyan-500/20 to-cyan-500/5",
      borderColor: "border-cyan-500/20",
      iconColor: "text-cyan-400",
      glowColor: "shadow-cyan-900/30",
    },
    {
      icon: Phone,
      title: "Call Us",
      value: "+91 85378 61040",
      href: "tel:+918537861040",
      description: "Mon–Fri, 9am to 6pm IST",
      color: "from-emerald-500/20 to-emerald-500/5",
      borderColor: "border-emerald-500/20",
      iconColor: "text-emerald-400",
      glowColor: "shadow-emerald-900/30",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      value: "Haldia, West Bengal, India",
      href: "https://maps.app.goo.gl/hyKu5FMJXY8sxYTQ7",
      description: "Come say hello at our office",
      color: "from-rose-500/20 to-rose-500/5",
      borderColor: "border-rose-500/20",
      iconColor: "text-rose-400",
      glowColor: "shadow-rose-900/30",
    },
  ];

  // Shared select className
  const selectCls = "w-full px-4 py-3.5 rounded-xl bg-white/80 dark:bg-white/[0.04] backdrop-blur-md border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 shadow-sm text-sm transition-all text-slate-800 dark:text-slate-200 appearance-none cursor-pointer";

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">

      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-20 pb-6 sm:pt-24 sm:pb-8 lg:pt-28 lg:pb-10 overflow-hidden bg-[#020b16]">
        {/* BG image */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.12]"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557425955-df376b5903c8?q=80&w=2070&auto=format&fit=crop')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#021124]/98 via-[#021124]/90 to-[#020b16]" />
        </div>

        <BlurBlob position={{ top: "40%", left: "2%" }} size={{ width: "500px", height: "500px" }} colorClass="bg-cyan-500" opacityClass="opacity-25 mix-blend-screen" className="z-10" />
        <BlurBlob position={{ top: "40%", left: "90%" }} size={{ width: "500px", height: "500px" }} colorClass="bg-fuchsia-500" opacityClass="opacity-25 mix-blend-screen" className="z-10" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* Left: Hero text */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#ff5a5f]" />
                <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#ff5a5f] uppercase">Let's Connect</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight leading-[1.1]">
                Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5a5f] to-pink-400">Us</span>
              </h1>

              <div className="w-14 h-1 bg-gradient-to-r from-[#ff5a5f] to-pink-400 mb-5 mx-auto lg:mx-0 rounded-full" />

              <p className="text-sm sm:text-base lg:text-lg text-gray-300/90 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Ready to start your project? Let's discuss your vision and turn it into a powerful digital solution that drives real business growth.
              </p>

              {/* Quick contact pills – mobile only hero */}
              <div className="flex flex-wrap gap-2.5 justify-center lg:hidden mt-6">
                {contactInfo.map((c) => (
                  <a
                    key={c.title}
                    href={c.href}
                    target={c.title === "Visit Us" ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-full border ${c.borderColor} bg-white/5 backdrop-blur-md text-xs font-semibold text-white/80 hover:text-white transition-all hover:bg-white/10`}
                  >
                    {c.title === "Visit Us" && locationAnimData ? (
                      <Lottie animationData={locationAnimData} loop autoplay className="w-5 h-5 drop-shadow-sm" />
                    ) : c.title === "Email Us" && mailAnimData ? (
                      <Lottie animationData={mailAnimData} loop autoplay className="w-6 h-6 drop-shadow-sm" />
                    ) : c.title === "Call Us" && callAnimData ? (
                      <Lottie animationData={callAnimData} loop autoplay className="w-5 h-5 drop-shadow-sm scale-110" />
                    ) : (
                      <c.icon className={`w-3.5 h-3.5 ${c.iconColor}`} />
                    )}
                    {c.value}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Right: Floating image – hidden on small mobile, visible sm+ */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden sm:block lg:ml-auto w-full"
              style={{ perspective: 1200 }}
            >
              <div className="absolute inset-0 bg-[#ff5a5f] opacity-15 blur-[60px] rounded-full scale-90 translate-y-4" />
              <motion.div
                className="relative rounded-[20px] sm:rounded-[24px] overflow-hidden shadow-2xl w-full border border-white/10 z-10 bg-[#0a1120]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"
                  alt="Contact Us"
                  className="w-full h-[180px] sm:h-[220px] md:h-[250px] lg:h-[280px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
              </motion.div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ opacity: { duration: 0.5, delay: 0.6 }, scale: { duration: 0.5, delay: 0.6 } }}
                className="absolute -left-4 top-1/2 -translate-y-1/2 bg-[#222a36]/90 backdrop-blur-md p-3 md:p-4 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.4)] border border-white/10 hidden md:flex items-center justify-center z-20 group hover:scale-110 transition-transform"
              >
                <div className="w-8 h-8 rounded-full border-2 border-emerald-500 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                  {callAnimData ? (
                    <Lottie animationData={callAnimData} loop autoplay className="w-5 h-5 scale-110" />
                  ) : (
                    <Phone className="w-5 h-5 text-emerald-500" />
                  )}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CONTACT FORM + SIDEBAR ─── */}
      <section id="contact" ref={ref} className="py-10 sm:py-16 lg:py-20 relative overflow-hidden bg-background">
        <BlurBlob position={{ top: "0%", left: "-10%" }} size={{ width: "700px", height: "700px" }} colorClass="bg-rose-500" opacityClass="opacity-10" />
        <BlurBlob position={{ top: "80%", left: "80%" }} size={{ width: "800px", height: "800px" }} colorClass="bg-blue-500" opacityClass="opacity-10" />
        <BlurBlob position={{ top: "40%", left: "30%" }} size={{ width: "500px", height: "500px" }} colorClass="bg-violet-500" opacityClass="opacity-5" />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-5 gap-6 lg:gap-12">

            {/* ── FORM CARD ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="lg:col-span-3"
            >
              {/* Outer gradient border */}
              <div className="relative rounded-2xl sm:rounded-3xl p-[1px] bg-gradient-to-br from-white/50 dark:from-white/15 via-white/20 dark:via-white/5 to-transparent shadow-2xl">
                <div className="rounded-[calc(1rem-1px)] sm:rounded-[calc(1.5rem-1px)] bg-white/50 dark:bg-black/30 backdrop-blur-2xl border border-white/40 dark:border-white/8">
                  <div className="p-4 sm:p-8 lg:p-10 relative">
                    {/* Inner accent */}
                    <div className="absolute top-0 right-0 w-56 h-56 bg-cyan-400/5 dark:bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-rose-400/5 rounded-full blur-2xl pointer-events-none" />

                    {/* Form heading */}
                    <div className="mb-6 sm:mb-8 relative z-10">
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">
                        Tell Us About Your Project
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">All fields are required. We'll respond within 24 hours.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 relative z-10">

                      {/* Name + Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Full Name</label>
                          <Input
                            required
                            placeholder="Your full name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className="bg-white/80 dark:bg-white/[0.04] backdrop-blur-md border-slate-200 dark:border-white/10 focus-visible:ring-cyan-500/40 rounded-xl h-12 shadow-sm text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
                          <Input
                            type="email"
                            required
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="bg-white/80 dark:bg-white/[0.04] backdrop-blur-md border-slate-200 dark:border-white/10 focus-visible:ring-cyan-500/40 rounded-xl h-12 shadow-sm text-sm"
                          />
                        </div>
                      </div>

                      {/* Company + Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Company / Organization</label>
                          <Input
                            required
                            placeholder="Your company name"
                            value={formData.company}
                            onChange={(e) => handleInputChange("company", e.target.value)}
                            className="bg-white/80 dark:bg-white/[0.04] backdrop-blur-md border-slate-200 dark:border-white/10 focus-visible:ring-cyan-500/40 rounded-xl h-12 shadow-sm text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Phone Number</label>
                          <Input
                            required
                            placeholder="+91 XXXXX XXXXX"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            className="bg-white/80 dark:bg-white/[0.04] backdrop-blur-md border-slate-200 dark:border-white/10 focus-visible:ring-cyan-500/40 rounded-xl h-12 shadow-sm text-sm"
                          />
                        </div>
                      </div>

                      {/* Project Type */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Project Type</label>
                        <div className="relative">
                          <select
                            required
                            value={formData.projectType}
                            onChange={(e) => handleProjectTypeChange(e.target.value)}
                            className={selectCls}
                          >
                            <option value="">Select project type</option>
                            <option value="Web Application">Web Application</option>
                            <option value="Mobile App">Mobile App</option>
                            <option value="E-commerce">E-commerce</option>
                            <option value="SaaS">SaaS</option>
                            <option value="Consulting">Consulting</option>
                            <option value="Graphics Design">Graphics Design</option>
                            <option value="Content Writing">Content Writing</option>
                            <option value="Social Media Management">Social Media Management</option>
                          </select>
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                          </div>
                        </div>
                      </div>

                      {/* Dynamic Tech Stack / Platform Selection */}
                      <AnimatePresence>
                        {formData.projectType === "Social Media Management" && (
                          <motion.div
                            key="social-platforms"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-3.5 bg-white/40 dark:bg-black/20 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/60 dark:border-white/8 shadow-sm">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                  Social Media Platforms
                                </label>
                                <span className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                  Select all that apply
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-3">
                                {[
                                  { name: "Facebook",     icon: Facebook,  color: "#1877F2", activeCls: "bg-[#1877F2] text-white border-[#1877F2] shadow-[0_0_14px_rgba(24,119,242,0.5)]" },
                                  { name: "Instagram",   icon: Instagram, color: "#E1306C", activeCls: "bg-[#E1306C] text-white border-[#E1306C] shadow-[0_0_14px_rgba(225,48,108,0.5)]" },
                                  { name: "LinkedIn",    icon: Linkedin,  color: "#0A66C2", activeCls: "bg-[#0A66C2] text-white border-[#0A66C2] shadow-[0_0_14px_rgba(10,102,194,0.5)]" },
                                  { name: "Twitter (X)", icon: Twitter,   color: "#000000", activeCls: "bg-black text-white border-black dark:border-white dark:bg-white dark:text-black shadow-[0_0_14px_rgba(0,0,0,0.4)]" },
                                  { name: "YouTube",     icon: Youtube,   color: "#FF0000", activeCls: "bg-[#FF0000] text-white border-[#FF0000] shadow-[0_0_14px_rgba(255,0,0,0.5)]" },
                                ].map(({ name, icon: Icon, color, activeCls }) => {
                                  const isSelected = formData.technologies.includes(name);
                                  return (
                                    <motion.button
                                      layout
                                      key={name}
                                      type="button"
                                      initial={{ opacity: 0, scale: 0.85 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.7 }}
                                      transition={{ type: "spring", stiffness: 380, damping: 24 }}
                                      onClick={() => toggleTechnology(name)}
                                      className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-2xl border-2 transition-all duration-250 touch-manipulation ${
                                        isSelected
                                          ? activeCls
                                          : "bg-white/80 dark:bg-black/40 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/30 shadow-sm active:scale-95"
                                      }`}
                                    >
                                      <Icon className="w-4 h-4 flex-shrink-0" style={!isSelected ? { color } : {}} />
                                      {name}
                                    </motion.button>
                                  );
                                })}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <AnimatePresence>
                        {techRequiredTypes.includes(formData.projectType) && (
                          <motion.div
                            key="tech-stack"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-3.5 bg-white/40 dark:bg-black/20 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/60 dark:border-white/8 shadow-sm">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                  Technology Stack
                                </label>
                                <span className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                  Optional
                                </span>
                              </div>

                              <div className="flex flex-col gap-4">
                                {Object.entries(
                                  formData.projectType === "Mobile App" ? techCategories.app : techCategories.web
                                ).map(([category, options]) => {
                                  const selectedOption = options.find((opt) => formData.technologies.includes(opt));
                                  const categoryColors: Record<string, string> = {
                                    Frontend: "bg-cyan-500 text-white border-cyan-400 shadow-[0_0_14px_rgba(6,182,212,0.45)]",
                                    Backend: "bg-violet-500 text-white border-violet-400 shadow-[0_0_14px_rgba(139,92,246,0.45)]",
                                    Database: "bg-emerald-500 text-white border-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.45)]",
                                    Cloud: "bg-rose-500 text-white border-rose-400 shadow-[0_0_14px_rgba(244,63,94,0.45)]",
                                  };

                                  return (
                                    <div key={category} className="space-y-2">
                                      <h5 className="text-[9px] font-black text-slate-400 dark:text-slate-500 tracking-widest uppercase">{category}</h5>
                                      <div className="flex flex-wrap gap-2 min-h-[34px]">
                                        <AnimatePresence mode="popLayout">
                                          {options.map((tech) => {
                                            if (selectedOption && selectedOption !== tech) return null;
                                            return (
                                              <motion.button
                                                layout
                                                key={tech}
                                                type="button"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.7, filter: "blur(4px)" }}
                                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                                onClick={() => toggleTechnology(tech)}
                                                className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all duration-250 touch-manipulation ${
                                                  formData.technologies.includes(tech)
                                                    ? categoryColors[category] ?? "bg-slate-500 text-white border-slate-400"
                                                    : "bg-white/80 dark:bg-black/40 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 active:scale-95 hover:border-slate-300 dark:hover:border-white/30 shadow-sm"
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
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Budget + Currency */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Project Budget</label>
                          {/* Currency toggle */}
                          <div className="flex bg-white/70 dark:bg-black/30 backdrop-blur-md rounded-lg p-1 border border-white/50 dark:border-white/10 shadow-sm">
                            {(["USD", "INR"] as const).map((curr) => (
                              <button
                                key={curr}
                                type="button"
                                onClick={() => handleCurrencyChange(curr)}
                                className={`px-3.5 py-1.5 text-xs rounded-md transition-all duration-250 font-semibold ${
                                  currency === curr
                                    ? "bg-white dark:bg-white/15 shadow text-cyan-600 dark:text-cyan-400 font-bold"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                                }`}
                              >
                                {curr === "USD" ? "$ USD" : "₹ INR"}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
                          {/* Budget select */}
                          <div className="relative">
                            <select
                              required
                              value={formData.budget}
                              onChange={(e) => handleInputChange("budget", e.target.value)}
                              className={selectCls}
                            >
                              <option value="">Select budget range</option>
                              {currentBudgetOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                            </div>
                          </div>

                          {/* Timeline select */}
                          <div className="relative">
                            <select
                              required
                              value={formData.timeline}
                              onChange={(e) => handleInputChange("timeline", e.target.value)}
                              className={selectCls}
                            >
                              <option value="">Select timeline</option>
                              <option value="ASAP">ASAP</option>
                              <option value="1–3 months">1–3 months</option>
                              <option value="3–6 months">3–6 months</option>
                              <option value="Flexible">Flexible</option>
                            </select>
                            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Message */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Project Details</label>
                        <Textarea
                          required
                          rows={5}
                          placeholder="Tell us about your project goals and specific requirements…"
                          value={formData.message}
                          onChange={(e) => handleInputChange("message", e.target.value)}
                          className="bg-white/80 dark:bg-white/[0.04] backdrop-blur-md border-slate-200 dark:border-white/10 focus-visible:ring-cyan-500/40 rounded-xl resize-none shadow-sm text-sm"
                        />
                      </div>

                      {/* ReCAPTCHA – no CSS scale transform (breaks click on mobile) */}
                      <div className="w-full overflow-x-auto">
                        <div className="rounded-xl shadow-sm border border-white/30 dark:border-white/8 inline-block min-w-[302px]">
                          <ReCAPTCHA
                            sitekey="6Lc5pTgsAAAAAMCtIJaKj5iK79KYT6hSfwE4CMBk"
                            onChange={() => setCaptchaVerified(true)}
                            theme="light"
                          />
                        </div>
                      </div>

                      {/* ── Inline Toast (above submit button) ── */}
                      <AnimatePresence>
                        {toastData && (
                          <PremiumToast
                            message={toastData.message}
                            subMessage={toastData.subMessage}
                            footer={toastData.footer}
                            type={toastData.type}
                            onClose={() => setToastData(null)}
                          />
                        )}
                      </AnimatePresence>

                      {/* Submit button – ultra premium, big touch target */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="relative w-full group overflow-hidden rounded-2xl min-h-[60px] sm:min-h-[64px] px-6 text-base sm:text-lg font-black text-white bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 hover:from-rose-500 hover:via-rose-400 hover:to-pink-400 shadow-[0_8px_28px_rgba(225,29,72,0.4)] hover:shadow-[0_16px_40px_rgba(225,29,72,0.55)] transition-all duration-300 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {/* animated shimmer sweep */}
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                        {/* bottom glow bar */}
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-white/40 blur-sm" />
                        <span className="relative z-10 flex items-center justify-center gap-3">
                          {isSubmitting ? (
                            <>
                              <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                                className="block w-5 h-5 border-[2.5px] border-white/30 border-t-white rounded-full"
                              />
                              <span>Sending your message…</span>
                            </>
                          ) : (
                            <>
                              <span>Send Message</span>
                              <Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </>
                          )}
                        </span>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── SIDEBAR ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="lg:col-span-2 flex flex-col gap-4 sm:gap-6"
            >
              {/* Contact info cards */}
              {contactInfo.map((info, i) => (
                <motion.a
                  key={info.title}
                  href={info.href}
                  target={info.title === "Visit Us" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  whileHover={{ y: -4, scale: 1.015 }}
                  className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-white/40 dark:from-white/10 to-transparent shadow-lg block"
                >
                  {/* Hover glow overlay */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 bg-gradient-to-br from-white/10 to-transparent" />

                  <div className={`relative flex items-center gap-4 p-4 sm:p-5 bg-white/60 dark:bg-black/25 backdrop-blur-xl rounded-[calc(1rem-1px)] border dark:border-white/8 border-white/40 overflow-hidden`}>
                    {/* icon bg glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none`} />

                    <div className={`w-12 h-12 sm:w-14 sm:h-14 shrink-0 bg-gradient-to-br from-white/90 to-white/20 dark:from-white/10 dark:to-white/5 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-xl flex items-center justify-center shadow-lg ${info.glowColor} group-hover:scale-110 transition-transform duration-300`}>
                      {info.title === "Visit Us" && locationAnimData ? (
                        <Lottie animationData={locationAnimData} loop autoplay className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-sm" />
                      ) : info.title === "Email Us" && mailAnimData ? (
                        <Lottie animationData={mailAnimData} loop autoplay className="w-11 h-11 sm:w-14 sm:h-14 drop-shadow-sm scale-110" />
                      ) : info.title === "Call Us" && callAnimData ? (
                        <Lottie animationData={callAnimData} loop autoplay className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-sm scale-125" />
                      ) : (
                        <info.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${info.iconColor} drop-shadow-sm`} />
                      )}
                    </div>

                    <div className="relative min-w-0">
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">{info.title}</p>
                      <p className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-white leading-tight truncate group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors">
                        {info.value}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{info.description}</p>
                    </div>

                    <ArrowRight className="ml-auto w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-rose-400 group-hover:translate-x-1 transition-all duration-300 shrink-0" />
                  </div>
                </motion.a>
              ))}

              {/* Premium CTA Box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ scale: 1.015 }}
                className="relative p-[1px] rounded-2xl overflow-hidden shadow-2xl group mt-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500 via-[#ff5a5f] to-amber-500 opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -top-16 -right-16 w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl" />

                <div className="relative p-5 sm:p-7 rounded-[calc(1rem-1px)] bg-gradient-to-br from-white/10 to-transparent backdrop-blur-xl border border-white/20 flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
                      <Star className="w-5 h-5 text-amber-300 fill-amber-300" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-white drop-shadow-md tracking-tight leading-tight">Focus on Growth</h3>
                      <p className="text-white/80 text-xs sm:text-sm leading-relaxed mt-1 font-medium">
                        We combine technical excellence with strategic thinking to build Digital Real Estate that acts as a 24/7 salesperson for your business.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/15">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1.5">
                        {["bg-cyan-400", "bg-violet-400", "bg-rose-400"].map((c, i) => (
                          <div key={i} className={`w-6 h-6 rounded-full ${c} border-2 border-white/30`} />
                        ))}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                        <span className="text-xs font-black text-white">4.9</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-white tracking-widest uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                      Trusted Partner
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Toast is now inline above the submit button — portal removed */}
    </div>
  );
};

export default Contact;