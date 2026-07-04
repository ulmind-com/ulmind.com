import React, { useEffect, useRef } from 'react';
import {
  SiPython, SiMongodb, SiNodedotjs, SiJavascript, SiTypescript, SiReact,
  SiDocker, SiKubernetes, SiGraphql, SiRedis, SiPostgresql, SiTailwindcss,
  SiGo, SiRust, SiGit, SiFigma, SiAmazonwebservices, SiVuedotjs, SiAngular,
  SiNextdotjs, SiFlutter, SiSwift, SiKotlin, SiOpenjdk, SiPhp, SiLaravel,
  SiVercel, SiFirebase, SiTensorflow, SiSupabase, SiExpress, SiThreedotjs,
  SiHtml5, SiCss3, SiMysql, SiLinux, SiGithub,
} from 'react-icons/si';
import type { IconType } from 'react-icons';

// Every logo carries its official brand colour so the reveal layer glows
// with the real technology palette. The base layer ignores this and paints
// everything in a theme-aware muted tone instead.
type Tech = { Icon: IconType; color: string };

const TECHS: Tech[] = [
  { Icon: SiPython, color: '#3776AB' },
  { Icon: SiJavascript, color: '#F7DF1E' },
  { Icon: SiTypescript, color: '#3178C6' },
  { Icon: SiReact, color: '#61DAFB' },
  { Icon: SiNodedotjs, color: '#5FA04E' },
  { Icon: SiMongodb, color: '#47A248' },
  { Icon: SiDocker, color: '#2496ED' },
  { Icon: SiKubernetes, color: '#326CE5' },
  { Icon: SiOpenjdk, color: '#EA2D2E' },
  { Icon: SiGraphql, color: '#E10098' },
  { Icon: SiPostgresql, color: '#4169E1' },
  { Icon: SiRedis, color: '#FF4438' },
  { Icon: SiTailwindcss, color: '#06B6D4' },
  { Icon: SiGo, color: '#00ADD8' },
  { Icon: SiRust, color: '#DEA584' },
  { Icon: SiGit, color: '#F05032' },
  { Icon: SiFigma, color: '#F24E1E' },
  { Icon: SiAmazonwebservices, color: '#FF9900' },
  { Icon: SiVuedotjs, color: '#42B883' },
  { Icon: SiAngular, color: '#DD0031' },
  { Icon: SiNextdotjs, color: '#000000' },
  { Icon: SiFlutter, color: '#02569B' },
  { Icon: SiSwift, color: '#F05138' },
  { Icon: SiKotlin, color: '#7F52FF' },
  { Icon: SiPhp, color: '#777BB4' },
  { Icon: SiLaravel, color: '#FF2D20' },
  { Icon: SiVercel, color: '#000000' },
  { Icon: SiFirebase, color: '#FFCA28' },
  { Icon: SiTensorflow, color: '#FF6F00' },
  { Icon: SiSupabase, color: '#3FCF8E' },
  { Icon: SiExpress, color: '#000000' },
  { Icon: SiThreedotjs, color: '#000000' },
  { Icon: SiHtml5, color: '#E34F26' },
  { Icon: SiCss3, color: '#1572B6' },
  { Icon: SiMysql, color: '#4479A1' },
  { Icon: SiLinux, color: '#FCC624' },
  { Icon: SiGithub, color: '#181717' },
];

// Build a big repeated pool so the grid fills the whole hero regardless of
// viewport, while keeping neighbours varied.
const CELLS = 400;
const POOL: Tech[] = Array.from({ length: CELLS }, (_, i) => TECHS[(i * 7 + (i % 5)) % TECHS.length]);

const GridLayer = ({ colored, showBorders = false, hideIcons = false }: { colored: boolean, showBorders?: boolean, hideIcons?: boolean }) => (
  <div 
    className="grid h-full w-full border-t border-l border-black/[0.03] dark:border-white/[0.02]"
    style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))' }}
  >
    {POOL.map((t, i) => {
      const Icon = t.Icon;
      return (
        <div key={i} className={`flex items-center justify-center w-full aspect-square border-r border-b ${showBorders ? 'border-black/[0.03] dark:border-white/[0.02]' : 'border-transparent'}`}>
          {!hideIcons && (
            <Icon
              className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8"
              style={colored ? { color: t.color } : undefined}
            />
          )}
        </div>
      );
    })}
  </div>
);

/**
 * Interactive technology-logo grid that sits behind the hero content.
 *
 *  - A faint monochrome grid is always visible (theme-aware).
 *  - A second, full-colour grid is stacked exactly on top but revealed only
 *    through a radial "spotlight" mask that follows the cursor — so hovering
 *    lights up the technologies underneath the mouse in their brand colours.
 *
 * The cursor is tracked with a rAF-throttled window listener that writes two
 * CSS custom properties (--mx / --my). The pointer handler never reads layout
 * (the bounding rect is cached and refreshed on scroll/resize), so it adds no
 * measurable scroll cost — unlike a naive mousemove parallax.
 */
export const TechLogoGrid = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const reveal = revealRef.current;
    if (!root || !reveal) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (reduceMotion || coarse) return; // no hover reveal on touch / reduced-motion

    let rect = root.getBoundingClientRect();
    let raf = 0;
    let px = -9999;
    let py = -9999;

    const refreshRect = () => { rect = root.getBoundingClientRect(); };

    const flush = () => {
      raf = 0;
      reveal.style.setProperty('--mx', `${px}px`);
      reveal.style.setProperty('--my', `${py}px`);
    };

    const onMove = (e: PointerEvent) => {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Only react while the pointer is over the hero band.
      if (x < -60 || y < -60 || x > rect.width + 60 || y > rect.height + 60) {
        px = -9999;
        py = -9999;
      } else {
        px = x;
        py = y;
      }
      if (!raf) raf = requestAnimationFrame(flush);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', refreshRect, { passive: true });
    window.addEventListener('resize', refreshRect);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', refreshRect);
      window.removeEventListener('resize', refreshRect);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[820px] max-h-screen overflow-hidden select-none"
      style={{
        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 80%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, black 0%, black 80%, transparent 100%)',
      }}
    >
      {/* Base: faint grid lines only, NO icons */}
      <div className="absolute inset-0">
        <GridLayer colored={false} showBorders={true} hideIcons={true} />
      </div>

      {/* Reveal: full brand colour icons, NO borders, shown only under the cursor spotlight */}
      <div
        ref={revealRef}
        className="absolute inset-0"
        style={{
          // Starts off-screen so nothing is revealed until the pointer moves.
          ['--mx' as string]: '-9999px',
          ['--my' as string]: '-9999px',
          WebkitMaskImage:
            'radial-gradient(circle 150px at var(--mx) var(--my), #000 0%, #000 30%, transparent 72%)',
          maskImage:
            'radial-gradient(circle 150px at var(--mx) var(--my), #000 0%, #000 30%, transparent 72%)',
          transition: 'opacity 300ms ease',
        }}
      >
        <GridLayer colored />
      </div>
    </div>
  );
};

export default TechLogoGrid;
