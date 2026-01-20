import { motion, MotionValue } from "framer-motion";
import { Star, Globe, X, Send } from "lucide-react";
import handshakeImage from "@/assets/partnership-handshake.jpg";
import { useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface PartnershipSectionProps {
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
}

/* ---------------- Typewriter Heading ---------------- */

const TypewriterHeading = () => {
  const texts = [
    "Become a Partner with Us",
    "Join Us as a Partner",
    "Let’s Partner Up",
    "Become a Strategic Partner",
    "Start a Partnership With Us",
  ];

  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(150);

  useEffect(() => {
    const current = texts[index];

    const timer = setTimeout(() => {
      if (isDeleting) {
        setDisplayText((p) => p.slice(0, -1));
        setSpeed(50);
      } else {
        setDisplayText(current.slice(0, displayText.length + 1));
        setSpeed(150);
      }

      if (!isDeleting && displayText === current) {
        setTimeout(() => setIsDeleting(true), 1800);
      }

      if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setIndex((p) => (p + 1) % texts.length);
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, index]);

  return (
    <motion.h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-4 min-h-[90px] md:min-h-[150px]">
      {displayText}
      <span className="inline-block w-1 h-10 md:h-14 bg-lime-400 ml-1 animate-pulse align-middle" />
    </motion.h1>
  );
};

/* ---------------- Component ---------------- */

const PartnershipSection = ({ opacity, scale }: PartnershipSectionProps) => {
  const [openForm, setOpenForm] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaVerified) {
      toast({
        title: "Captcha required",
        description: "Please verify that you are not a robot.",
        variant: "destructive",
      });
      return;
    }

    const data = new FormData();
    data.append("_subject", "New Partnership Request");
    data.append("_template", "table");
    data.append("_captcha", "false");
    Object.entries(form).forEach(([k, v]) => data.append(k, v));

    try {
      const res = await fetch(
        "https://formsubmit.co/ulmindpvtltd@gmail.com",
        { method: "POST", body: data }
      );

      if (!res.ok) throw new Error();

      toast({
        title: "Request sent",
        description: "Our team will contact you soon.",
      });

      setOpenForm(false);
      setCaptchaVerified(false);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast({
        title: "Submission failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.section
      style={{ opacity, scale }}
      className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden z-10 px-4 md:px-10"
    >
      <div className="w-full max-w-6xl h-[85vh] md:h-[80vh] gradient-premium rounded-[2.5rem] shadow-premium relative overflow-hidden flex items-center">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            {/* Left */}
            <div className="order-2 lg:order-1 text-left">
              <span className="inline-block text-[10px] font-bold tracking-[0.2em] text-primary-foreground/70 mb-4">
                PARTNER PROGRAM
              </span>

              <TypewriterHeading />

              <div className="h-1 w-16 bg-accent rounded-full mb-6" />

              <p className="text-base md:text-lg text-primary-foreground/80 mb-8 max-w-sm">
                Partner with us to create meaningful regional impact through trusted collaboration.
              </p>

              <motion.button
                onClick={() => setOpenForm(true)}
                initial="rest"
                whileHover="hover"
                animate="rest"
                className="relative overflow-hidden px-8 py-3.5 rounded-full border border-lime-400 font-bold text-sm shadow-lg"
              >
                <motion.span
                  variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  style={{ originX: 0 }}
                  className="absolute inset-0 bg-lime-400 pointer-events-none"
                />
                <motion.span
                  variants={{ rest: { color: "#c1f972" }, hover: { color: "#000" } }}
                  transition={{ duration: 0.45 }}
                  className="relative z-10 pointer-events-none"
                >
                  Join Partnership
                </motion.span>
              </motion.button>
            </div>

            {/* Right Image + Badges */}
            <div className="order-1 lg:order-2 relative block">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
                <img
                  src={handshakeImage}
                  alt="Partnership"
                  className="w-full h-[260px] md:h-[400px] object-cover"
                />

                {/* Trusted Partner */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-6 md:top-10 right-4 md:right-8 bg-white/90 backdrop-blur px-3 md:px-4 py-1.5 md:py-2 rounded-xl shadow-xl flex items-center gap-2"
                >
                  <span className="text-xs font-bold">Trusted Partner</span>
                  <span className="flex items-center gap-1 bg-black text-white px-2 py-0.5 rounded text-[10px]">
                    <Star size={10} className="fill-yellow-400 text-yellow-400" />
                    4.8
                  </span>
                </motion.div>

                {/* Regional Reach */}
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-6 md:bottom-10 left-4 md:left-8 bg-white/90 backdrop-blur px-3 md:px-4 py-1.5 md:py-2 rounded-xl shadow-xl flex items-center gap-2"
                >
                  <span className="text-xs font-bold">Regional Reach</span>
                  <span className="flex items-center gap-1 bg-black text-white px-2 py-0.5 rounded text-[10px]">
                    <Globe size={10} />
                    4.9
                  </span>
                </motion.div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Modal */}
      {openForm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 relative">
            <button onClick={() => setOpenForm(false)} className="absolute top-4 right-4">
              <X />
            </button>

            <h2 className="text-2xl font-bold mb-6">Join Partnership</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="name" placeholder="Full name" required value={form.name} onChange={handleChange} />
              <Input name="email" type="email" placeholder="Email" required value={form.email} onChange={handleChange} />
              <Input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
              <Textarea name="message" rows={5} placeholder="Tell us about your partnership idea" required value={form.message} onChange={handleChange} />

              <ReCAPTCHA
                sitekey="6Lc5pTgsAAAAAMCtIJaKj5iK79KYT6hSfwE4CMBk"
                onChange={() => setCaptchaVerified(true)}
              />

              <Button type="submit" className="w-full">
                Submit Request <Send className="ml-2 w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </motion.section>
  );
};

export default PartnershipSection;
