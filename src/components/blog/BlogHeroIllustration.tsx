import React from "react";
import { motion } from "framer-motion";

export const BlogHeroIllustration: React.FC = () => {
  return (
    <div className="relative w-full max-w-[460px] h-[250px] sm:h-[290px] md:h-[330px] flex items-center justify-center select-none pointer-events-auto">
      {/* Ambient background glow & radial gradient */}
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-35 dark:opacity-25 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 60% 40%, #f59e0b 0%, #ea580c 40%, transparent 70%)",
        }}
      />

      {/* Subtle Dot Grid */}
      <div className="absolute inset-0 opacity-20 dark:opacity-30 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="blog-grid" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="currentColor" className="text-zinc-400 dark:text-zinc-600" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#blog-grid)" />
        </svg>
      </div>

      {/* Floating Floating Tech Badges (Floating around the folders) */}
      <motion.div
        animate={{ y: [-6, 6, -6], rotate: [-2, 2, -2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-6 left-4 md:left-8 px-3 py-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-amber-500/30 shadow-lg text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 z-20"
      >
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        AI & Cloud Tech
      </motion.div>

      <motion.div
        animate={{ y: [6, -6, 6], rotate: [1, -2, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-12 right-2 md:right-6 px-3 py-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-orange-500/30 shadow-lg text-xs font-semibold text-orange-600 dark:text-orange-400 flex items-center gap-1.5 z-20"
      >
        <span className="w-2 h-2 rounded-full bg-orange-500" />
        Architecture
      </motion.div>

      <motion.div
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-6 left-8 px-3 py-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-emerald-500/30 shadow-lg text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 z-20"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        DevOps & Scale
      </motion.div>

      {/* Main SVG Vector Composition */}
      <motion.svg
        viewBox="0 0 520 420"
        className="w-full h-full drop-shadow-2xl z-10 overflow-visible"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="folderGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
          <linearGradient id="folderGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="paperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </linearGradient>
          <filter id="gearShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* ── Rotating Mechanical Gears ── */}
        {/* Main Central Gear */}
        <motion.g
          style={{ transformOrigin: "360px 240px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="360" cy="240" r="44" fill="#cbd5e1" stroke="#0f172a" strokeWidth="4" />
          {/* Gear teeth */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <rect
              key={angle}
              x="352"
              y="186"
              width="16"
              height="16"
              rx="3"
              fill="#cbd5e1"
              stroke="#0f172a"
              strokeWidth="4"
              transform={`rotate(${angle} 360 240)`}
            />
          ))}
          <circle cx="360" cy="240" r="18" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" />
        </motion.g>

        {/* Interlocking Small Gear Left */}
        <motion.g
          style={{ transformOrigin: "305px 290px" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="305" cy="290" r="30" fill="#e2e8f0" stroke="#0f172a" strokeWidth="3.5" />
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <rect
              key={angle}
              x="299"
              y="252"
              width="12"
              height="12"
              rx="2.5"
              fill="#e2e8f0"
              stroke="#0f172a"
              strokeWidth="3.5"
              transform={`rotate(${angle} 305 290)`}
            />
          ))}
          <circle cx="305" cy="290" r="11" fill="#f8fafc" stroke="#0f172a" strokeWidth="3" />
        </motion.g>

        {/* ── Document Pages Stack with Checkboxes ── */}
        <motion.g
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Back Paper */}
          <g transform="rotate(-6 380 160)">
            <rect
              x="330"
              y="85"
              width="95"
              height="130"
              rx="8"
              fill="#f8fafc"
              stroke="#0f172a"
              strokeWidth="3.5"
            />
            {/* Checkbox item */}
            <rect x="345" y="105" width="14" height="14" rx="3" fill="#f59e0b" stroke="#0f172a" strokeWidth="2.5" />
            <path d="M348 112 L352 116 L356 108" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <line x1="368" y1="112" x2="410" y2="112" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />

            <line x1="345" y1="135" x2="410" y2="135" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="345" y1="150" x2="395" y2="150" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="345" y1="165" x2="405" y2="165" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Front Paper */}
          <g transform="rotate(8 420 180)">
            <rect
              x="375"
              y="110"
              width="95"
              height="135"
              rx="8"
              fill="url(#paperGrad)"
              stroke="#0f172a"
              strokeWidth="4"
            />
            {/* Lines */}
            <line x1="392" y1="135" x2="452" y2="135" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="392" y1="155" x2="445" y2="155" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="392" y1="172" x2="452" y2="172" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="392" y1="189" x2="435" y2="189" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />

            {/* Micro Checkbox */}
            <rect x="392" y="210" width="12" height="12" rx="2.5" fill="#10b981" stroke="#0f172a" strokeWidth="2" />
            <path d="M394 216 L397 219 L402 213" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
            <line x1="412" y1="216" x2="452" y2="216" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </motion.g>

        {/* ── Left Document Page (Top Left Floating) ── */}
        <motion.g
          animate={{ y: [4, -4, 4], rotate: [-1, 2, -1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          transform="translate(290, 70)"
        >
          <rect
            x="0"
            y="0"
            width="65"
            height="85"
            rx="6"
            fill="#ffffff"
            stroke="#0f172a"
            strokeWidth="3.5"
          />
          <rect x="10" y="14" width="12" height="12" rx="2.5" fill="#f59e0b" stroke="#0f172a" strokeWidth="2" />
          <path d="M12 20 L15 23 L20 17" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />
          <line x1="28" y1="20" x2="52" y2="20" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="10" y1="38" x2="55" y2="38" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
          <line x1="10" y1="48" x2="48" y2="48" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
          <line x1="10" y1="58" x2="52" y2="58" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
        </motion.g>

        {/* ── Left Golden Upload Folder ── */}
        <motion.g
          animate={{ y: [-3, 5, -3] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Back tab */}
          <path
            d="M 125 175 L 175 175 L 190 195 L 245 195 C 252 195 258 201 258 208 L 258 275 C 258 282 252 288 245 288 L 125 288 C 118 288 112 282 112 275 L 112 188 C 112 181 118 175 125 175 Z"
            fill="url(#folderGrad2)"
            stroke="#0f172a"
            strokeWidth="4"
          />
          {/* Inner Document emerging from folder */}
          <g transform="translate(130, 140)">
            <rect
              x="0"
              y="0"
              width="70"
              height="80"
              rx="6"
              fill="#ffffff"
              stroke="#0f172a"
              strokeWidth="3.5"
            />
            <line x1="12" y1="20" x2="58" y2="20" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" />
            <line x1="12" y1="32" x2="50" y2="32" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="42" x2="58" y2="42" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Front folder flap */}
          <path
            d="M 112 210 L 258 210 C 265 210 270 216 270 222 L 265 285 C 265 292 258 298 250 298 L 120 298 C 112 298 105 292 105 285 L 100 222 C 100 216 105 210 112 210 Z"
            fill="url(#folderGrad1)"
            stroke="#0f172a"
            strokeWidth="4.5"
          />

          {/* Upload Arrow Symbol on Folder */}
          <g transform="translate(185, 254)">
            <path
              d="M 0 10 L 0 -12 M -8 -4 L 0 -12 L 8 -4"
              stroke="#ffffff"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M -16 12 L -16 16 L 16 16 L 16 12"
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </motion.g>

        {/* ── Right Download Folder / Storage Tray ── */}
        <motion.g
          animate={{ y: [4, -4, 4] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        >
          {/* Main folder body */}
          <path
            d="M 335 220 L 475 220 C 482 220 488 226 488 233 L 488 295 C 488 302 482 308 475 308 L 335 308 C 328 308 322 302 322 295 L 322 233 C 322 226 328 220 335 220 Z"
            fill="url(#folderGrad2)"
            stroke="#0f172a"
            strokeWidth="4"
          />
          {/* Front Tray */}
          <path
            d="M 322 255 L 488 255 C 494 255 498 260 498 266 L 492 315 C 492 322 485 328 478 328 L 332 328 C 325 328 318 322 318 315 L 312 266 C 312 260 316 255 322 255 Z"
            fill="url(#folderGrad1)"
            stroke="#0f172a"
            strokeWidth="4.5"
          />

          {/* Download Arrow Symbol on Tray */}
          <g transform="translate(405, 290)">
            <path
              d="M 0 -12 L 0 10 M -8 2 L 0 10 L 8 2"
              stroke="#ffffff"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M -16 12 L -16 16 L 16 16 L 16 12"
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </motion.g>

        {/* ── Ground Anchor Line ── */}
        <line
          x1="80"
          y1="330"
          x2="510"
          y2="330"
          stroke="#0f172a"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </motion.svg>
    </div>
  );
};

export default BlogHeroIllustration;
