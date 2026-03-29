import React, { useState } from "react";
import { motion } from "framer-motion";
import { useFingerprint } from "@/hooks/useFingerprint";
import { Send, CheckCircle2, Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { ShineBorder } from "@/components/ui/shine-border";

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { trackUser } = useFingerprint();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      // Trigger the exhaustive tracking with the captured email
      await trackUser("accepted", undefined, email);
      
      // Simulate real subscription delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setIsSubscribed(true);
      toast.success("Welcome! You're now on the list.");
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-24 relative overflow-hidden bg-background transition-colors duration-500">
      {/* Premium Background Mesh Gradient Decor */}
      <div className="absolute inset-0 w-full h-full pointer-events-none -z-10 flex items-center justify-center">
        <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-gradient-to-tr from-primary/30 to-purple-500/20 dark:from-primary/15 dark:to-purple-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-5000" />
        <div className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-gradient-to-bl from-blue-500/30 to-primary/30 dark:from-blue-500/15 dark:to-primary/15 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse delay-1000 duration-5000" />
      </div>

      <div className="max-w-5xl mx-auto px-6">
        {/* Glassmorphism Card */}
        <ShineBorder
          borderRadius={40}
          borderWidth={1.5}
          color={["#FF007F", "#39FF14", "#00FFFF"]}
          className="relative !p-10 md:!p-16 border border-white/60 dark:border-white/10 bg-white/30 dark:bg-black/40 backdrop-blur-3xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] overflow-hidden text-center transition-all duration-500 group/card"
        >
          
          {/* Subtle inner top highlight for 3D feel */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/70 dark:via-white/20 to-transparent" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-md border border-white/50 dark:border-white/10 text-primary text-xs font-bold tracking-widest uppercase mb-8 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Newsletter</span>
            </div>

            {/* Typography */}
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-foreground">
              Stay Ahead of the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600 dark:to-purple-400">Curve</span>
            </h2>
            
            <p className="text-muted-foreground text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              Get the latest insights on AI, design, and technology delivered straight to your inbox. No spam, only premium content.
            </p>

            {/* Interactive Form */}
            {!isSubscribed ? (
              <form 
                onSubmit={handleSubscribe} 
                className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto relative group/form"
              >
                <div className="relative flex-1 group-focus-within:scale-[1.01] transition-transform duration-300">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within/form:text-primary transition-colors duration-300 z-10" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/60 dark:border-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 text-base text-foreground placeholder:text-muted-foreground shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.02)] focus:shadow-md focus:bg-white/70 dark:focus:bg-white/10"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100 shadow-[0_4px_14px_0_hsl(var(--primary)/0.3)] hover:shadow-[0_6px_20px_hsl(var(--primary)/0.4)] border border-white/20 dark:border-none"
                >
                  {isLoading ? "Joining..." : (
                    <>
                      <span>Join Now</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="flex items-center justify-center gap-3 p-5 rounded-2xl bg-green-500/10 backdrop-blur-md border border-green-500/30 text-green-600 dark:text-green-400 font-semibold max-w-md mx-auto shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_20px_rgba(34,197,94,0.1)]"
              >
                <CheckCircle2 className="w-6 h-6" />
                <span>Success! Check your inbox soon.</span>
              </motion.div>
            )}

            {/* Social Proof */}
            <p className="mt-10 text-xs text-muted-foreground/60 uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
              <span className="w-8 h-[1px] bg-border hidden sm:inline-block"></span>
              Join 2,500+ innovators worldwide
              <span className="w-8 h-[1px] bg-border hidden sm:inline-block"></span>
            </p>
          </motion.div>
        </ShineBorder>
      </div>
    </section>
  );
};
