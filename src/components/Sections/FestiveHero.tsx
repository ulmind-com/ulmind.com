import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';

/**
 * Indian national festival detection + premium tricolor hero decorations.
 * Shows ONLY on 15 August (Independence Day) and 26 January (Republic Day).
 * On every other day getIndianFestival() returns null and nothing renders.
 */

export type Festival = {
  key: 'independence' | 'republic';
  title: string;
  ordinal: string;
} | null;

// Resolved, render-ready banner values (from admin config OR the auto fallback).
export interface FestiveDisplay {
  text: string;
  color1: string; // left / saffron glow
  color2: string; // right / green glow
  intensity: number; // 0..1 light-mode glow strength
  showChakra: boolean;
}

// #RRGGBB (or #RGB) -> "rgba(r,g,b,a)"
const rgba = (hex: string, a: number) => {
  let h = (hex || '').replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h || 'ff9933', 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

const ordinal = (n: number) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
};

// How many days BEFORE the festival the banner starts showing (day itself included).
const LEAD_DAYS = 3;

export const getIndianFestival = (date = new Date()): Festival => {
  const y = date.getFullYear();
  // Normalise "today" to midnight so the day-count is exact.
  const today = new Date(y, date.getMonth(), date.getDate());

  const events = [
    { key: 'independence' as const, title: 'Independence Day', date: new Date(y, 7, 15), since: 1947 },
    { key: 'republic' as const, title: 'Republic Day', date: new Date(y, 0, 26), since: 1950 },
  ];

  const DAY = 86400000;
  for (const e of events) {
    const diff = (e.date.getTime() - today.getTime()) / DAY; // >0 before, 0 on the day
    if (diff >= 0 && diff <= LEAD_DAYS) {
      return { key: e.key, title: e.title, ordinal: ordinal(y - e.since + 1) };
    }
  }
  return null;
};

// 24-spoke Ashoka Chakra
const AshokaChakra = ({ size = 100 }: { size?: number }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className="block text-[#000080] dark:text-indigo-300">
    <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="3" />
    <circle cx="50" cy="50" r="5.5" fill="currentColor" />
    {Array.from({ length: 24 }).map((_, i) => (
      <line
        key={i}
        x1="50"
        y1="50"
        x2="50"
        y2="5"
        stroke="currentColor"
        strokeWidth="1.4"
        transform={`rotate(${i * 15} 50 50)`}
      />
    ))}
    {Array.from({ length: 24 }).map((_, i) => (
      <circle
        key={`d${i}`}
        cx="50"
        cy="9"
        r="1.4"
        fill="currentColor"
        transform={`rotate(${i * 15 + 7.5} 50 50)`}
      />
    ))}
  </svg>
);

/** Premium festive badge that replaces the default "Welcome" pill while the banner is live. */
export const FestiveBadge = ({ display }: { display: FestiveDisplay }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
    className="relative inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-8 overflow-hidden border border-white/60 dark:border-white/15 shadow-[0_4px_24px_rgba(255,153,51,0.28)] bg-[linear-gradient(90deg,rgba(255,153,51,0.20)_0%,rgba(255,255,255,0.92)_50%,rgba(19,136,8,0.20)_100%)] dark:bg-[linear-gradient(90deg,rgba(255,153,51,0.28)_0%,rgba(30,41,59,0.6)_50%,rgba(19,136,8,0.28)_100%)]"
  >
    {/* shimmer */}
    <motion.span
      aria-hidden
      className="absolute inset-0 -skew-x-12"
      style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)' }}
      initial={{ x: '-120%' }}
      animate={{ x: '120%' }}
      transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.6, ease: 'easeInOut' }}
    />
    {display.showChakra && (
      <motion.span
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
      >
        <AshokaChakra size={18} />
      </motion.span>
    )}
    <span
      className="relative text-sm font-bold tracking-wide bg-clip-text text-transparent"
      style={{ backgroundImage: `linear-gradient(90deg, ${display.color1}, #1e293b 55%, ${display.color2})` }}
    >
      {display.text}
    </span>
  </motion.div>
);

/** Ambient tricolor decorations — driven by admin config display values. */
export const FestiveHeroOverlay = ({ display }: { display: FestiveDisplay }) => {
  // Viewport-anchored tricolor glow that fills the TOP corners of the whole page —
  // saffron from the top-left (above the nav), green from the top-right.
  // Portaled to <body> so no transformed ancestor traps the fixed positioning.
  const intensity = display.intensity;
  const c1 = display.color1 || '#FF9933';
  const c2 = display.color2 || '#138808';

  const topGlow = (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-[135vh] z-[45] overflow-hidden" aria-hidden>
      {/* Light mode: custom admin colors */}
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          opacity: intensity,
          background:
            `radial-gradient(70rem 95rem at -8% 8%, ${rgba(c1, 0.48)} 0%, transparent 58%), radial-gradient(70rem 95rem at 108% 8%, ${rgba(c2, 0.44)} 0%, transparent 58%)`,
        }}
      />
      {/* Dark mode: brighter, more saturated */}
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background:
            `radial-gradient(70rem 95rem at -8% 8%, ${rgba(c1, 0.42)} 0%, transparent 56%), radial-gradient(70rem 95rem at 108% 8%, ${rgba(c2, 0.38)} 0%, transparent 56%)`,
        }}
      />
    </div>
  );

  return (
    <>
      {typeof document !== 'undefined' && createPortal(topGlow, document.body)}

      {/* Floating glowing Ashoka Chakra — premium accent, desktop only */}
      {display.showChakra && (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
          <motion.div
            className="hidden lg:block absolute top-24 right-16 opacity-70 drop-shadow-[0_8px_24px_rgba(0,0,128,0.35)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
            style={{ filter: 'saturate(1.1)' }}
          >
            <AshokaChakra size={120} />
          </motion.div>
        </div>
      )}
    </>
  );
};
