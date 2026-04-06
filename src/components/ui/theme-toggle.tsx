import * as React from "react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => { setMounted(true) }, [])

  if (!mounted) {
    // Render a stable placeholder to avoid layout shift / FOUC
    return (
      <div
        aria-hidden="true"
        style={{ width: 72, height: 32 }}
        className="rounded-full flex-shrink-0"
      />
    )
  }

  const isDark = resolvedTheme === "dark"

  const toggle = () => setTheme(isDark ? "light" : "dark")

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="
        relative flex-shrink-0 select-none focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-primary/60 rounded-full
      "
      style={{ width: 72, height: 32 }}
    >
      {/* ── Track ────────────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 rounded-full overflow-hidden"
        initial={false}
        animate={{
          backgroundColor: isDark ? "#1a1a2e" : "#d0d8e8",
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{
          boxShadow: isDark
            ? "inset 0 2px 8px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07)"
            : "inset 0 2px 8px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.45)",
        }}
      >
        {/* Stars (dark) */}
        <AnimatePresence>
          {isDark && (
            <motion.div
              key="stars"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              {[
                { top: "18%", left: "62%", size: 1.5 },
                { top: "55%", left: "70%", size: 1 },
                { top: "30%", left: "80%", size: 2 },
              ].map((s, i) => (
                <span
                  key={i}
                  className="absolute rounded-full bg-white/70"
                  style={{ top: s.top, left: s.left, width: s.size, height: s.size }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Label text */}
        <motion.span
          className="absolute top-1/2 -translate-y-1/2 text-[10px] font-semibold tracking-wide pointer-events-none select-none"
          animate={{
            left: isDark ? "10%" : "auto",
            right: isDark ? "auto" : "10%",
            color: isDark ? "rgba(255,255,255,0.55)" : "rgba(60,70,90,0.70)",
          }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
        >
          {isDark ? "Dark" : "Light"}
        </motion.span>
      </motion.div>

      {/* ── Glass Knob ───────────────────────────────────────── */}
      <motion.div
        className="absolute top-[3px] rounded-full"
        initial={false}
        animate={{ x: isDark ? 44 : 3 }}
        transition={{ type: "spring", stiffness: 380, damping: 30, mass: 0.8 }}
        style={{
          width: 26,
          height: 26,
          background: isDark
            ? "radial-gradient(circle at 38% 38%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.07) 60%, rgba(30,30,60,0.35) 100%)"
            : "radial-gradient(circle at 38% 38%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.55) 60%, rgba(200,215,235,0.4) 100%)",
          backdropFilter: "blur(8px) saturate(1.6)",
          WebkitBackdropFilter: "blur(8px) saturate(1.6)",
          boxShadow: isDark
            ? "0 2px 12px rgba(0,0,0,0.55), inset 0 1px 1px rgba(255,255,255,0.25), 0 0 0 1px rgba(255,255,255,0.12)"
            : "0 2px 10px rgba(0,0,0,0.22), inset 0 1px 1px rgba(255,255,255,0.85), 0 0 0 1px rgba(255,255,255,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "visible",
        }}
      >
        {/* Icon inside knob */}
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.svg
              key="moon"
              viewBox="0 0 24 24"
              fill="currentColor"
              initial={{ opacity: 0, rotate: -30, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 30, scale: 0.5 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              style={{ width: 13, height: 13, color: "#e8eaf6", filter: "drop-shadow(0 0 3px rgba(200,210,255,0.9))" }}
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </motion.svg>
          ) : (
            <motion.svg
              key="sun"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ opacity: 0, rotate: 30, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -30, scale: 0.5 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              style={{ width: 13, height: 13, color: "#f59e0b", filter: "drop-shadow(0 0 3px rgba(251,191,36,0.85))" }}
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  )
}