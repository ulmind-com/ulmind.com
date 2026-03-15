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
<<<<<<< HEAD
=======
      // FIX: Logged the error so it's not marked as an "unused variable" by Vercel's linter
      console.error("Subscription error:", error);
>>>>>>> 0c1fdb1d9682ec17617bba3d0f631f1e6357a201
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <section className="py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="max-w-5xl mx-auto px-6">
        <div className="relative p-12 md:p-16 rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden text-center">
=======
    <section className="py-24 relative overflow-hidden bg-background transition-colors duration-500">
      {/* Premium Background Mesh Gradient Decor */}
      <div className="absolute inset-0 w-full h-full pointer-events-none -z-10 flex items-center justify-center">
        <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-gradient-to-tr from-primary/30 to-purple-500/20 dark:from-primary/15 dark:to-purple-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-[7000ms]" />
        <div className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-gradient-to-bl from-blue-500/30 to-primary/30 dark:from-blue-500/15 dark:to-primary/15 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse delay-1000 duration-[5000ms]" />
      </div>

      <div className="max-w-5xl mx-auto px-6">
        {/* Glassmorphism Card */}
        <div className="relative p-10 md:p-16 rounded-[40px] border border-white/60 dark:border-white/10 bg-white/30 dark:bg-black/40 backdrop-blur-3xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] overflow-hidden text-center transition-all duration-500 group/card">
          
          {/* Subtle inner top highlight for 3D feel */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/70 dark:via-white/20 to-transparent" />

>>>>>>> 0c1fdb1d9682ec17617bba3d0f631f1e6357a201
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
<<<<<<< HEAD
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
=======
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
>>>>>>> 0c1fdb1d9682ec17617bba3d0f631f1e6357a201
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
<<<<<<< HEAD
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm"
=======
                    className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/60 dark:border-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 text-base text-foreground placeholder:text-muted-foreground shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.02)] focus:shadow-md focus:bg-white/70 dark:focus:bg-white/10"
>>>>>>> 0c1fdb1d9682ec17617bba3d0f631f1e6357a201
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
<<<<<<< HEAD
                  className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-sm transition-all hover:scale-[1.05] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
=======
                  className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100 shadow-[0_4px_14px_0_hsl(var(--primary)/0.3)] hover:shadow-[0_6px_20px_hsl(var(--primary)/0.4)] border border-white/20 dark:border-none"
>>>>>>> 0c1fdb1d9682ec17617bba3d0f631f1e6357a201
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
<<<<<<< HEAD
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary font-semibold max-w-md mx-auto"
=======
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="flex items-center justify-center gap-3 p-5 rounded-2xl bg-green-500/10 backdrop-blur-md border border-green-500/30 text-green-600 dark:text-green-400 font-semibold max-w-md mx-auto shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_20px_rgba(34,197,94,0.1)]"
>>>>>>> 0c1fdb1d9682ec17617bba3d0f631f1e6357a201
              >
                <CheckCircle2 className="w-6 h-6" />
                <span>Success! Check your inbox soon.</span>
              </motion.div>
            )}

<<<<<<< HEAD
            <p className="mt-8 text-[11px] text-muted-foreground/60 uppercase tracking-widest font-medium">
              Join 2,500+ innovators worldwide
=======
            {/* Social Proof */}
            <p className="mt-10 text-xs text-muted-foreground/60 uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
              <span className="w-8 h-[1px] bg-border hidden sm:inline-block"></span>
              Join 2,500+ innovators worldwide
              <span className="w-8 h-[1px] bg-border hidden sm:inline-block"></span>
>>>>>>> 0c1fdb1d9682ec17617bba3d0f631f1e6357a201
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
<<<<<<< HEAD
};
=======
};
>>>>>>> 0c1fdb1d9682ec17617bba3d0f631f1e6357a201
