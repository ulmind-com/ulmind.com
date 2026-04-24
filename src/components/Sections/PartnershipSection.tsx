import { motion, MotionValue, AnimatePresence } from "framer-motion";
import { Star, Globe, X, Send, CheckCircle2, AlertCircle } from "lucide-react";
import handshakeImage from "@/assets/partnership-handshake.jpg";
import { useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
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
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
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
    setSubmitError(false);

    if (!captchaVerified) {
      toast({ title: "Captcha required", description: "Please verify you are not a robot.", variant: "destructive" });
      return;
    }

    const data = new FormData();
    data.append("_subject", "New Partnership Request");
    data.append("_template", "table");
    data.append("_captcha", "false");
    Object.entries(form).forEach(([k, v]) => data.append(k, v));

    try {
      const res = await fetch("https://formsubmit.co/ulmindpvtltd@gmail.com", { method: "POST", body: data });
      if (!res.ok) throw new Error();
      setSubmitted(true);
      setCaptchaVerified(false);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      setSubmitError(true);
    }
  };

  return (
    <motion.section
      style={{ opacity, scale }}
      className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden z-10 px-4 md:px-10"
    >
      {/* BlurBlob removed from sticky section — large radial gradient + sticky = heavy scroll paint */}
      <div className="w-full max-w-6xl h-[85vh] md:h-[80vh] gradient-premium rounded-[2.5rem] shadow-premium relative overflow-hidden flex items-center z-10">
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

                {/* Trusted Partner - Forced text-black for visibility on light bg in dark mode */}
                <div
                  style={{ animation: "floatUp 3s ease-in-out infinite" }}
                  className="absolute top-6 md:top-10 right-4 md:right-8 bg-white/90 px-3 md:px-4 py-1.5 md:py-2 rounded-xl shadow-xl flex items-center gap-2 text-black"
                >
                  <span className="text-xs font-bold">Trusted Partner</span>
                  <span className="flex items-center gap-1 bg-black text-white px-2 py-0.5 rounded text-[10px]">
                    <Star size={10} className="fill-yellow-400 text-yellow-400" />
                    4.8
                  </span>
                </div>

                {/* Regional Reach - Forced text-black for visibility on light bg in dark mode */}
                <div
                  style={{ animation: "floatDown 3.5s ease-in-out infinite" }}
                  className="absolute bottom-6 md:bottom-10 left-4 md:left-8 bg-white/90 px-3 md:px-4 py-1.5 md:py-2 rounded-xl shadow-xl flex items-center gap-2 text-black"
                >
                  <span className="text-xs font-bold">Regional Reach</span>
                  <span className="flex items-center gap-1 bg-black text-white px-2 py-0.5 rounded text-[10px]">
                    <Globe size={10} />
                    4.9
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Premium Modal */}
      {openForm && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center p-4 overflow-y-auto"
          style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.95) 100%)', backdropFilter: 'blur(12px)', paddingTop: 'max(80px, env(safe-area-inset-top, 80px))' }}>

          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={() => { setOpenForm(false); setSubmitted(false); setSubmitError(false); }} />

          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto z-10"
            style={{
              background: 'var(--form-bg, linear-gradient(135deg, #0f0f0f 0%, #1a0000 50%, #0f0f0f 100%))',
              borderRadius: '24px',
              boxShadow: '0 0 0 1px rgba(239,68,68,0.3), 0 0 60px rgba(239,68,68,0.15), 0 32px 80px rgba(0,0,0,0.6)',
              animation: 'formGlowPulse 3s ease-in-out infinite',
            }}>

            <style>{`
              :root {
                --form-bg: linear-gradient(135deg, #fff5f5 0%, #ffffff 50%, #fff5f5 100%);
                --form-input-bg: rgba(255,255,255,0.9);
                --form-input-border: rgba(239,68,68,0.25);
                --form-input-text: #1a0000;
                --form-label-color: #991b1b;
                --form-divider: rgba(239,68,68,0.15);
              }
              .dark {
                --form-bg: linear-gradient(135deg, #0f0f0f 0%, #1a0000 50%, #0f0f0f 100%);
                --form-input-bg: rgba(255,255,255,0.04);
                --form-input-border: rgba(239,68,68,0.2);
                --form-input-text: #fff;
                --form-label-color: rgba(255,255,255,0.5);
                --form-divider: rgba(239,68,68,0.1);
              }
              @keyframes formGlowPulse {
                0%, 100% { box-shadow: 0 0 0 1px rgba(239,68,68,0.3), 0 0 60px rgba(239,68,68,0.15), 0 32px 80px rgba(0,0,0,0.6); }
                50% { box-shadow: 0 0 0 1px rgba(239,68,68,0.5), 0 0 90px rgba(239,68,68,0.25), 0 32px 80px rgba(0,0,0,0.6); }
              }
              .premium-input {
                width: 100%;
                padding: 14px 18px;
                background: var(--form-input-bg);
                border: 1.5px solid var(--form-input-border);
                border-radius: 12px;
                color: var(--form-input-text);
                font-size: 14px;
                font-family: inherit;
                transition: all 0.25s ease;
                outline: none;
                resize: none;
              }
              .premium-input::placeholder { color: var(--form-label-color); font-size: 13px; }
              .premium-input:focus {
                border-color: rgba(239,68,68,0.7);
                box-shadow: 0 0 0 3px rgba(239,68,68,0.12), 0 0 20px rgba(239,68,68,0.08);
                background: var(--form-input-bg);
              }
              .premium-input:hover:not(:focus) {
                border-color: rgba(239,68,68,0.4);
              }
            `}</style>

            {/* Red top accent bar */}
            <div style={{
              height: '4px',
              borderRadius: '24px 24px 0 0',
              background: 'linear-gradient(90deg, #dc2626, #ef4444, #f87171, #ef4444, #dc2626)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2.5s linear infinite',
            }} />

            <style>{`
              @keyframes shimmer {
                0% { background-position: 200% center; }
                100% { background-position: -200% center; }
              }
            `}</style>

            <div className="p-7 pb-8">

              {/* ── SUCCESS BANNER ── */}
              <AnimatePresence>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -16, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                    style={{
                      marginBottom: '20px',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, rgba(220,38,38,0.12) 0%, rgba(239,68,68,0.08) 100%)',
                      border: '1.5px solid rgba(239,68,68,0.35)',
                      padding: '20px 22px',
                      display: 'flex', alignItems: 'flex-start', gap: '14px',
                      boxShadow: '0 0 30px rgba(239,68,68,0.12), 0 4px 20px rgba(0,0,0,0.1)',
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 18 }}
                      style={{
                        width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 16px rgba(239,68,68,0.5)',
                      }}
                    >
                      <CheckCircle2 size={22} style={{ color: '#fff' }} />
                    </motion.div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 800, fontSize: '16px', color: '#ef4444', marginBottom: '4px', letterSpacing: '-0.01em' }}>
                        Successfully Submitted! 🎉
                      </p>
                      <p style={{ fontSize: '13px', color: 'var(--form-label-color)', lineHeight: 1.6 }}>
                        We've received your partnership request. Our team will connect with you soon!
                      </p>
                      <motion.button
                        onClick={() => { setOpenForm(false); setSubmitted(false); }}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        style={{
                          marginTop: '12px', padding: '8px 18px', borderRadius: '8px', border: 'none',
                          background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                          color: '#fff', fontWeight: 700, fontSize: '12px',
                          letterSpacing: '0.05em', cursor: 'pointer',
                          boxShadow: '0 2px 10px rgba(239,68,68,0.35)',
                        }}
                      >
                        Close
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── ERROR BANNER ── */}
              <AnimatePresence>
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      marginBottom: '20px', borderRadius: '12px',
                      background: 'rgba(239,68,68,0.08)', border: '1.5px solid rgba(239,68,68,0.3)',
                      padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px',
                    }}
                  >
                    <AlertCircle size={18} style={{ color: '#ef4444', flexShrink: 0 }} />
                    <p style={{ fontSize: '13px', color: '#ef4444', fontWeight: 600 }}>
                      Submission failed. Please try again later.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Header */}
              <div className="flex items-start justify-between mb-7">
                <div>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px',
                      background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 16px rgba(239,68,68,0.4)',
                    }}>
                      <Send size={16} style={{ color: '#fff' }} />
                    </div>
                    <h2 style={{
                      fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em',
                      background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}>Join Partnership</h2>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--form-label-color)', letterSpacing: '0.08em', fontWeight: 500 }}>
                    PARTNER APPLICATION FORM
                  </p>
                </div>
                <button
                  onClick={() => { setOpenForm(false); setSubmitted(false); setSubmitError(false); }}
                  style={{
                    width: '34px', height: '34px', borderRadius: '50%',
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.2s ease', color: '#ef4444',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.2)';
                    (e.currentTarget as HTMLButtonElement).style.transform = 'rotate(90deg)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.1)';
                    (e.currentTarget as HTMLButtonElement).style.transform = 'rotate(0deg)';
                  }}
                >
                  <X size={15} />
                </button>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', background: 'var(--form-divider)', marginBottom: '24px' }} />

              {/* Form — hide after success */}
              {!submitted && <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--form-label-color)', marginBottom: '6px', textTransform: 'uppercase' }}>Full Name *</label>
                    <input
                      className="premium-input"
                      name="name"
                      placeholder="John Doe"
                      required
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--form-label-color)', marginBottom: '6px', textTransform: 'uppercase' }}>Phone</label>
                    <input
                      className="premium-input"
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--form-label-color)', marginBottom: '6px', textTransform: 'uppercase' }}>Email Address *</label>
                  <input
                    className="premium-input"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    required
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--form-label-color)', marginBottom: '6px', textTransform: 'uppercase' }}>Partnership Idea *</label>
                  <textarea
                    className="premium-input"
                    name="message"
                    rows={4}
                    placeholder="Tell us about your partnership vision..."
                    required
                    value={form.message}
                    onChange={handleChange}
                  />
                </div>

                {/* reCAPTCHA */}
                <div style={{
                  borderRadius: '12px', overflow: 'hidden',
                  border: '1.5px solid var(--form-input-border)',
                  padding: '4px',
                }}>
                  <ReCAPTCHA
                    sitekey="6Lc5pTgsAAAAAMCtIJaKj5iK79KYT6hSfwE4CMBk"
                    onChange={() => setCaptchaVerified(true)}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  style={{
                    width: '100%', padding: '15px 24px',
                    borderRadius: '12px', border: 'none',
                    background: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 40%, #ef4444 70%, #dc2626 100%)',
                    backgroundSize: '200% 100%',
                    color: '#fff', fontWeight: 700, fontSize: '14px',
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: '8px',
                    boxShadow: '0 4px 24px rgba(239,68,68,0.45), 0 1px 0 rgba(255,255,255,0.1) inset',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundPosition = 'right center';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 32px rgba(239,68,68,0.65), 0 1px 0 rgba(255,255,255,0.15) inset';
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundPosition = 'left center';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 24px rgba(239,68,68,0.45), 0 1px 0 rgba(255,255,255,0.1) inset';
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                  }}
                >
                  <Send size={15} />
                  Submit Request
                </button>

              </form>}
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
};

export default PartnershipSection;