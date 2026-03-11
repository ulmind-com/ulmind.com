import React, { useState } from "react";
import { motion } from "framer-motion";
import { useFingerprint } from "@/hooks/useFingerprint";
import { Send, CheckCircle2, Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";

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
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="max-w-5xl mx-auto px-6">
        <div className="relative p-12 md:p-16 rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-6">
              <Sparkles className="w-3 h-3" />
              <span>Newsletter</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Stay Ahead of the <span className="gradient-text">Curve</span>
            </h2>
            
            <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
              Get the latest insights on AI, design, and technology delivered straight to your inbox. No spam, only premium content.
            </p>

            {!isSubscribed ? (
              <form 
                onSubmit={handleSubscribe} 
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative group"
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-sm transition-all hover:scale-[1.05] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
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
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary font-semibold max-w-md mx-auto"
              >
                <CheckCircle2 className="w-6 h-6" />
                <span>Success! Check your inbox soon.</span>
              </motion.div>
            )}

            <p className="mt-8 text-[11px] text-muted-foreground/60 uppercase tracking-widest font-medium">
              Join 2,500+ innovators worldwide
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
