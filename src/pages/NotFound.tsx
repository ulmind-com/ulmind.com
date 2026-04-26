import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Rocket } from 'lucide-react';
import { CTASection } from '@/components/Sections/CTASection';
import Lottie from 'lottie-react';
import { useState, useEffect } from 'react';

export default function NotFound() {
  const navigate = useNavigate();
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    fetch('/lottieflow-404-12-1-c81837-easey.json')
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error('Failed to load 404 animation:', err));
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#020b16] flex flex-col relative overflow-hidden">

      {/* ── Ambient background blobs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-left cyan blob */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-cyan-400/20 dark:bg-cyan-500/10 blur-[120px]" />
        {/* Top-right purple blob */}
        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full bg-violet-500/20 dark:bg-violet-600/10 blur-[100px]" />
        {/* Center-bottom warm blob */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-rose-400/10 dark:bg-rose-500/10 blur-[100px]" />

        {/* Subtle dot-grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #6366f1 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* ── Floating star particles ── */}
      {[...Array(18)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white/30 dark:bg-white/20"
          style={{
            top: `${Math.random() * 85}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{
            duration: 2.5 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 4,
          }}
        />
      ))}

      {/* ── Main content — perfectly centered ── */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center gap-0">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-2"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-rose-500/10 dark:bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/20 backdrop-blur-sm">
              <Rocket className="w-3 h-3" />
              Error 404
            </span>
          </motion.div>

          {/* Lottie animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-full max-w-md mx-auto"
          >
            {animationData ? (
              <Lottie animationData={animationData} loop autoplay />
            ) : (
              <div className="text-[9rem] font-black leading-none bg-gradient-to-br from-rose-500 via-pink-500 to-violet-600 bg-clip-text text-transparent select-none">
                404
              </div>
            )}
          </motion.div>

          {/* Glassmorphism card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full rounded-2xl border border-black/[0.07] dark:border-white/[0.08] bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl shadow-2xl shadow-black/5 dark:shadow-black/40 px-8 py-8 flex flex-col items-center gap-6"
          >
            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                Lost in{' '}
                <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 bg-clip-text text-transparent">
                  deep space
                </span>
              </h1>
              <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                The page you're looking for has drifted into the void. It
                doesn't exist or may have been moved.
              </p>
            </div>

            {/* Divider */}
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-rose-400/60 to-transparent" />

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="flex items-center gap-2 rounded-xl border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10 transition-all px-6 py-5 text-sm font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
              <Button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-violet-600 hover:from-rose-600 hover:to-violet-700 text-white shadow-lg shadow-rose-500/25 dark:shadow-rose-500/20 border-0 transition-all px-6 py-5 text-sm font-semibold"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            </div>

            {/* Subtle helper text */}
            <p className="text-xs text-zinc-400 dark:text-zinc-600">
              Still lost?{' '}
              <button
                onClick={() => navigate('/contact')}
                className="text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 font-medium underline underline-offset-2 transition-colors"
              >
                Contact support
              </button>
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── CTA Section ── */}
      <div className="relative z-10">
        <CTASection />
      </div>
    </div>
  );
}
