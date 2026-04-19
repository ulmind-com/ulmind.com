// ─────────────────────────────────────────────────────────────────
//  TechIllustrations.tsx  — Unique inline SVG illustrations
//  Every technology gets a distinct, custom-designed SVG visual
// ─────────────────────────────────────────────────────────────────

import React from "react";

interface IllProps {
  color: string;
  size?: number;
}

// ─── UTILITY ─────────────────────────────────────────────────────
const bgGrad = (id: string, color: string) => (
  <defs>
    <radialGradient id={id} cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor={color} stopOpacity="0.18" />
      <stop offset="100%" stopColor={color} stopOpacity="0" />
    </radialGradient>
    <filter id={`${id}-blur`}>
      <feGaussianBlur stdDeviation="2" />
    </filter>
  </defs>
);

// ═══════════════════════════════════════════════════════════════
// WEB FRONTEND
// ═══════════════════════════════════════════════════════════════

/** HTML5 — Document sheet with angle bracket tags */
const Html5: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("h5g", color)}
    <circle cx="200" cy="200" r="195" fill="url(#h5g)" />
    {/* Document */}
    <rect x="105" y="60" width="190" height="255" rx="12" fill={`${color}15`} stroke={color} strokeWidth="2.5" />
    {/* Corner fold */}
    <polygon points="240,60 295,115 240,115" fill={color} opacity="0.25" />
    <line x1="240" y1="60" x2="295" y2="115" stroke={color} strokeWidth="2" opacity="0.5" />
    <line x1="295" y1="115" x2="240" y2="115" stroke={color} strokeWidth="2" opacity="0.5" />
    {/* Code lines */}
    <rect x="128" y="110" width="80" height="10" rx="5" fill={color} opacity="0.5" />
    <rect x="128" y="130" width="120" height="10" rx="5" fill={color} opacity="0.3" />
    <rect x="140" y="150" width="90" height="10" rx="5" fill={color} opacity="0.25" />
    <rect x="140" y="170" width="70" height="10" rx="5" fill={color} opacity="0.2" />
    <rect x="128" y="190" width="100" height="10" rx="5" fill={color} opacity="0.3" />
    {/* HTML5 badge */}
    <rect x="140" y="225" width="120" height="55" rx="10" fill={color} opacity="0.9" />
    <text x="200" y="258" textAnchor="middle" fill="white" fontSize="22" fontWeight="900" fontFamily="monospace">HTML5</text>
    {/* Floating brackets */}
    <text x="55" y="155" fill={color} fontSize="52" fontFamily="monospace" opacity="0.2">{"<"}</text>
    <text x="300" y="280" fill={color} fontSize="52" fontFamily="monospace" opacity="0.15">{">"}</text>
    <text x="65" y="290" fill={color} fontSize="18" fontFamily="monospace" opacity="0.18">{"DOCTYPE"}</text>
    {/* Corner dots */}
    {[0,1,2,3].flatMap(r => [0,1,2,3].map(c => (
      <circle key={`${r}-${c}`} cx={30+c*110} cy={30+r*110} r="3.5" fill={color} opacity="0.12" />
    )))}
  </svg>
);

/** CSS3 — Paint layers with color palette swatches */
const Css3: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("c3g", color)}
    <circle cx="200" cy="200" r="195" fill="url(#c3g)" />
    {/* Stacked cards/layers */}
    {[60, 40, 20, 0].map((offset, i) => (
      <rect key={i} x={80 + offset} y={100 - offset/2} width={210 - offset * 1.8} height={160}
        rx="14" fill={`${color}${['15','20','25','35'][i]}`}
        stroke={color} strokeWidth="1.5" opacity={0.3 + i * 0.2} />
    ))}
    {/* Color swatches */}
    {['#ff6b6b', color, '#51cf66', '#339af0', '#cc5de8'].map((c, i) => (
      <circle key={i} cx={120 + i * 33} cy={200} r="18"
        fill={c} opacity="0.9" stroke="white" strokeWidth="3" />
    ))}
    {/* CSS selector text */}
    <rect x="100" y="240" width="200" height="36" rx="8" fill={`${color}20`} stroke={`${color}40`} strokeWidth="1" />
    <text x="115" y="263" fill={color} fontSize="14" fontFamily="monospace" opacity="0.8">.hero {"{opacity: 1;}"}</text>
    {/* Bézier curve decoration */}
    <path d="M60,340 C120,290 180,370 240,320 C300,270 340,340 380,300"
      fill="none" stroke={color} strokeWidth="2.5" opacity="0.25" strokeDasharray="8 5" />
    {/* Grid */}
    <line x1="200" y1="60" x2="200" y2="100" stroke={color} strokeWidth="1" opacity="0.15" />
    <line x1="160" y1="70" x2="200" y2="100" stroke={color} strokeWidth="1" opacity="0.15" />
    <line x1="240" y1="70" x2="200" y2="100" stroke={color} strokeWidth="1" opacity="0.15" />
  </svg>
);

/** JavaScript — Curly braces with floating ES6+ symbols */
const Javascript: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("jsg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#jsg)" />
    {/* Big curly brace */}
    <text x="80" y="280" fill={color} fontSize="200" fontFamily="monospace" opacity="0.12" fontWeight="300">{"{"}</text>
    {/* Gear / cog for logic */}
    {[0,45,90,135,180,225,270,315].map(a => (
      <rect key={a} x="192" y="130" width="16" height="32" rx="4"
        fill={color} opacity="0.5"
        transform={`rotate(${a}, 200, 200)`} />
    ))}
    <circle cx="200" cy="200" r="38" fill={`${color}20`} stroke={color} strokeWidth="2.5" />
    <circle cx="200" cy="200" r="22" fill={color} opacity="0.85" />
    {/* Floating symbols */}
    <text x="55" y="130" fill={color} fontSize="28" fontFamily="monospace" opacity="0.35">async</text>
    <text x="280" y="155" fill={color} fontSize="24" fontFamily="monospace" opacity="0.3">{"() =>"}</text>
    <text x="60" y="330" fill={color} fontSize="22" fontFamily="monospace" opacity="0.25">Promise</text>
    <text x="280" y="310" fill={color} fontSize="20" fontFamily="monospace" opacity="0.28">fetch()</text>
    <text x="130" y="350" fill={color} fontSize="18" fontFamily="monospace" opacity="0.2">ES2024</text>
    {/* Dots trail */}
    {[0,1,2,3,4].map(i => (
      <circle key={i} cx={80 + i*60} cy={80} r={4 - i*0.5} fill={color} opacity={0.4 - i*0.07} />
    ))}
  </svg>
);

/** TypeScript — Shield with type annotations */
const Typescript: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("tsg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#tsg)" />
    {/* Shield shape */}
    <path d="M200,60 L310,110 L310,220 C310,280 260,330 200,350 C140,330 90,280 90,220 L90,110 Z"
      fill={`${color}18`} stroke={color} strokeWidth="2.5" />
    {/* Inner shield */}
    <path d="M200,90 L285,130 L285,215 C285,260 246,300 200,318 C154,300 115,260 115,215 L115,130 Z"
      fill={`${color}10`} stroke={color} strokeWidth="1" opacity="0.5" />
    {/* TS letters */}
    <text x="167" y="230" fill={color} fontSize="62" fontWeight="900" fontFamily="sans-serif" opacity="0.9">TS</text>
    {/* Type annotation badges */}
    <rect x="48" y="155" width="80" height="26" rx="13" fill={`${color}25`} stroke={color} strokeWidth="1" />
    <text x="88" y="173" textAnchor="middle" fill={color} fontSize="12" fontFamily="monospace">string</text>
    <rect x="270" y="155" width="78" height="26" rx="13" fill={`${color}25`} stroke={color} strokeWidth="1" />
    <text x="309" y="173" textAnchor="middle" fill={color} fontSize="12" fontFamily="monospace">number</text>
    <rect x="270" y="200" width="78" height="26" rx="13" fill={`${color}25`} stroke={color} strokeWidth="1" />
    <text x="309" y="218" textAnchor="middle" fill={color} fontSize="12" fontFamily="monospace">boolean</text>
    <rect x="48" y="200" width="80" height="26" rx="13" fill={`${color}25`} stroke={color} strokeWidth="1" />
    <text x="88" y="218" textAnchor="middle" fill={color} fontSize="12" fontFamily="monospace">interface</text>
    {/* Arrows to shield */}
    <line x1="128" y1="168" x2="160" y2="180" stroke={color} strokeWidth="1.5" opacity="0.4" strokeDasharray="4 3" />
    <line x1="270" y1="168" x2="240" y2="180" stroke={color} strokeWidth="1.5" opacity="0.4" strokeDasharray="4 3" />
  </svg>
);

/** React — 3-orbit atom with electrons */
const ReactIll: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("rg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#rg)" />
    {/* Glow core */}
    <circle cx="200" cy="200" r="60" fill={`${color}12`} />
    {/* Orbit 1 — horizontal */}
    <ellipse cx="200" cy="200" rx="170" ry="55" fill="none" stroke={color} strokeWidth="1.8" opacity="0.55" />
    {/* Orbit 2 — 60deg */}
    <ellipse cx="200" cy="200" rx="170" ry="55" fill="none" stroke={color} strokeWidth="1.8" opacity="0.55"
      transform="rotate(60 200 200)" />
    {/* Orbit 3 — 120deg */}
    <ellipse cx="200" cy="200" rx="170" ry="55" fill="none" stroke={color} strokeWidth="1.8" opacity="0.55"
      transform="rotate(120 200 200)" />
    {/* Nucleus */}
    <circle cx="200" cy="200" r="26" fill={color} opacity="0.9" />
    <circle cx="200" cy="200" r="14" fill="white" opacity="0.2" />
    {/* Electrons on orbit 1 */}
    <circle cx="370" cy="200" r="9" fill={color} />
    <circle cx="30"  cy="200" r="9" fill={color} />
    {/* Electrons on orbit 2 (rotated 60°) */}
    <circle cx="285" cy="55"  r="9" fill={color} transform="rotate(60 200 200)" />
    <circle cx="115" cy="345" r="9" fill={color} transform="rotate(60 200 200)" />
    {/* Electrons on orbit 3 (rotated 120°) */}
    <circle cx="370" cy="200" r="9" fill={color} transform="rotate(120 200 200)" />
    <circle cx="30"  cy="200" r="9" fill={color} transform="rotate(120 200 200)" />
    {/* Component boxes */}
    <rect x="58" y="58" width="50" height="36" rx="8" fill={`${color}20`} stroke={`${color}40`} strokeWidth="1" />
    <text x="83" y="82" textAnchor="middle" fill={color} fontSize="10" fontFamily="monospace">{"<App/>"}</text>
    <rect x="293" y="55" width="55" height="36" rx="8" fill={`${color}20`} stroke={`${color}40`} strokeWidth="1" />
    <text x="320" y="79" textAnchor="middle" fill={color} fontSize="10" fontFamily="monospace">{"<UI/>"}</text>
  </svg>
);

/** Next.js — Stacked page layers with lightning bolt */
const Nextjs: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("ng", color)}
    <circle cx="200" cy="200" r="195" fill="url(#ng)" />
    {/* Stacked pages */}
    {[3, 2, 1, 0].map(i => (
      <rect key={i} x={80 + i * 14} y={100 + i * 14} width="220" height="165" rx="14"
        fill={`${color}${['0d','14','1a','22'][i]}`}
        stroke={color} strokeWidth="2"
        opacity={0.3 + i * 0.18} />
    ))}
    {/* Top page content lines */}
    <rect x="110" y="135" width="130" height="10" rx="5" fill={color} opacity="0.45" />
    <rect x="110" y="158" width="100" height="8" rx="4" fill={color} opacity="0.3" />
    <rect x="110" y="178" width="115" height="8" rx="4" fill={color} opacity="0.25" />
    {/* Lightning bolt — SSR / Speed */}
    <polygon points="215,130 185,210 208,207 180,295 230,195 205,198"
      fill={color} opacity="0.9" />
    {/* Speed labels */}
    <text x="100" y="310" fill={color} fontSize="14" fontFamily="monospace" opacity="0.4">{"SSR / SSG / ISR"}</text>
    {/* Server/edge indicators */}
    <rect x="40" y="200" width="52" height="28" rx="14" fill={`${color}25`} stroke={color} strokeWidth="1" />
    <text x="66" y="219" textAnchor="middle" fill={color} fontSize="11" fontFamily="monospace">Edge</text>
    {/* Network lines */}
    <line x1="92" y1="210" x2="110" y2="210" stroke={color} strokeWidth="1.5" opacity="0.35" strokeDasharray="5 3" />
  </svg>
);

/** Vue.js — Triple diamond V formation */
const Vuejs: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("vg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#vg)" />
    {/* Large V background */}
    <polygon points="200,340 60,80 130,80 200,220 270,80 340,80"
      fill={`${color}12`} stroke={color} strokeWidth="2.5" />
    {/* Inner V */}
    <polygon points="200,295 110,105 150,105 200,240 250,105 290,105"
      fill={`${color}10`} stroke={color} strokeWidth="1.5" opacity="0.7" />
    {/* Diamond nodes at V tips */}
    <polygon points="200,360 175,330 200,300 225,330" fill={color} opacity="0.9" />
    <polygon points="60,68 40,80 60,92 80,80" fill={color} opacity="0.7" />
    <polygon points="340,68 320,80 340,92 360,80" fill={color} opacity="0.7" />
    {/* Component pills */}
    <rect x="140" y="158" width="120" height="32" rx="16" fill={`${color}25`} stroke={color} strokeWidth="1.5" />
    <text x="200" y="180" textAnchor="middle" fill={color} fontSize="14" fontFamily="monospace" fontWeight="600">{"<script setup>"}</text>
    {/* Hexagon accents */}
    <polygon points="75,200 55,170 75,140 115,140 135,170 115,200" fill="none" stroke={color} strokeWidth="1.5" opacity="0.25" />
    <polygon points="325,245 305,215 325,185 365,185 385,215 365,245" fill="none" stroke={color} strokeWidth="1.5" opacity="0.2" />
  </svg>
);

/** Angular — Shield with component dependency arrows */
const Angular: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("ag", color)}
    <circle cx="200" cy="200" r="195" fill="url(#ag)" />
    {/* Background Angular letter shape */}
    <polygon points="200,55 325,100 290,310 200,345 110,310 75,100"
      fill={`${color}14`} stroke={color} strokeWidth="2.5" />
    {/* Inner fill */}
    <polygon points="200,95 282,128 258,278 200,305 142,278 118,128"
      fill={`${color}10`} stroke={color} strokeWidth="1.5" opacity="0.5" />
    {/* A letter strokes */}
    <line x1="200" y1="110" x2="145" y2="270" stroke={color} strokeWidth="8" strokeLinecap="round" opacity="0.8" />
    <line x1="200" y1="110" x2="255" y2="270" stroke={color} strokeWidth="8" strokeLinecap="round" opacity="0.8" />
    <line x1="163" y1="210" x2="237" y2="210" stroke={color} strokeWidth="7" strokeLinecap="round" opacity="0.9" />
    {/* Component boxes */}
    <rect x="30" y="170" width="70" height="32" rx="8" fill={`${color}25`} stroke={color} strokeWidth="1.5" />
    <text x="65" y="192" textAnchor="middle" fill={color} fontSize="11" fontFamily="monospace">@Component</text>
    <rect x="300" y="170" width="70" height="32" rx="8" fill={`${color}25`} stroke={color} strokeWidth="1.5" />
    <text x="335" y="192" textAnchor="middle" fill={color} fontSize="11" fontFamily="monospace">@Injectable</text>
    <rect x="155" y="330" width="90" height="32" rx="8" fill={`${color}25`} stroke={color} strokeWidth="1.5" />
    <text x="200" y="352" textAnchor="middle" fill={color} fontSize="11" fontFamily="monospace">@NgModule</text>
    {/* Arrow lines */}
    <line x1="100" y1="186" x2="128" y2="186" stroke={color} strokeWidth="1.5" opacity="0.5" strokeDasharray="4 3" />
    <line x1="300" y1="186" x2="272" y2="186" stroke={color} strokeWidth="1.5" opacity="0.5" strokeDasharray="4 3" />
    <line x1="200" y1="310" x2="200" y2="330" stroke={color} strokeWidth="1.5" opacity="0.5" strokeDasharray="4 3" />
  </svg>
);

/** Svelte — Flame/spark with compile arrows */
const Svelte: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("svg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#svg)" />
    {/* S-curve / flame base */}
    <path d="M160,320 C100,280 100,220 160,200 C220,180 260,200 260,150 C260,100 200,70 180,90"
      fill="none" stroke={color} strokeWidth="28" strokeLinecap="round" opacity="0.2" />
    <path d="M160,320 C100,280 100,220 160,200 C220,180 260,200 260,150 C260,100 200,70 180,90"
      fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" opacity="0.7" />
    {/* Flame tip */}
    <ellipse cx="180" cy="82" rx="22" ry="30" fill={color} opacity="0.95" />
    {/* Compile arrows */}
    {[0,1,2].map(i => (
      <g key={i}>
        <line x1={290 + i*22} y1="200" x2={290 + i*22} y2="250"
          stroke={color} strokeWidth="2.5" opacity={0.5 - i * 0.12}
          markerEnd="url(#arrow)" />
        <circle cx={290 + i*22} cy="190" r="7" fill={color} opacity={0.4 - i * 0.1} />
      </g>
    ))}
    {/* "No runtime" badge */}
    <rect x="45" y="270" width="130" height="36" rx="18" fill={`${color}25`} stroke={color} strokeWidth="1.5" />
    <text x="110" y="293" textAnchor="middle" fill={color} fontSize="13" fontFamily="monospace">Zero runtime</text>
    {/* Spark particles */}
    {[[-30,-40],[40,-60],[60,-20],[-50,-10]].map(([dx, dy], i) => (
      <circle key={i} cx={180 + dx} cy={82 + dy} r={3 + i} fill={color} opacity={0.5 - i * 0.1} />
    ))}
  </svg>
);

/** Tailwind CSS — Utility class grid palette */
const Tailwind: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("twg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#twg)" />
    {/* Utility grid — 5×5 boxes */}
    {Array.from({ length: 5 }, (_, r) =>
      Array.from({ length: 5 }, (_, c) => {
        const opacity = 0.12 + ((r + c) % 3) * 0.1;
        const scale = 0.6 + ((r * c) % 4) * 0.12;
        return (
          <rect key={`${r}-${c}`}
            x={75 + c * 52} y={75 + r * 52}
            width="42" height="42" rx="10"
            fill={color} opacity={opacity * scale}
            stroke={color} strokeWidth="1" strokeOpacity="0.3" />
        );
      })
    )}
    {/* Prominent center */}
    <rect x="179" y="179" width="42" height="42" rx="10" fill={color} opacity="0.9" />
    {/* Utility class labels */}
    <text x="200" y="348" textAnchor="middle" fill={color} fontSize="13" fontFamily="monospace" opacity="0.5">flex gap-4 p-6 rounded-xl</text>
    {/* Wind sweep curve */}
    <path d="M50,200 Q120,120 200,160 Q280,200 350,160"
      fill="none" stroke={color} strokeWidth="3" opacity="0.2" strokeDasharray="10 6" />
    <path d="M50,240 Q120,160 200,200 Q280,240 350,200"
      fill="none" stroke={color} strokeWidth="2" opacity="0.15" strokeDasharray="10 6" />
  </svg>
);

/** Sass — Nested bracket tree */
const Sass: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("sg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#sg)" />
    {/* Big bracket */}
    <path d="M180,60 C130,60 120,80 120,110 L120,170 C120,195 100,200 100,200 C100,200 120,205 120,230 L120,290 C120,320 130,340 180,340"
      fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" opacity="0.7" />
    {/* Inner bracket */}
    <path d="M195,100 C165,100 158,112 158,128 L158,165 C158,182 145,188 145,188 C145,188 158,194 158,212 L158,255 C158,270 165,280 195,280"
      fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.5" />
    {/* Sass property lines */}
    <rect x="205" y="125" width="120" height="10" rx="5" fill={color} opacity="0.55" />
    <rect x="215" y="148" width="100" height="10" rx="5" fill={color} opacity="0.4" />
    <rect x="225" y="170" width="80" height="10" rx="5" fill={color} opacity="0.3" />
    <rect x="205" y="205" width="110" height="10" rx="5" fill={color} opacity="0.5" />
    <rect x="215" y="228" width="90" height="10" rx="5" fill={color} opacity="0.35" />
    <rect x="225" y="250" width="70" height="10" rx="5" fill={color} opacity="0.25" />
    {/* $ variable badges */}
    <rect x="205" y="95" width="90" height="22" rx="11" fill={`${color}25`} stroke={color} strokeWidth="1" />
    <text x="250" y="111" textAnchor="middle" fill={color} fontSize="12" fontFamily="monospace">$primary</text>
    {/* Sass S badge */}
    <circle cx="320" cy="320" r="38" fill={color} opacity="0.15" stroke={color} strokeWidth="2" />
    <text x="320" y="332" textAnchor="middle" fill={color} fontSize="36" fontWeight="900" fontFamily="sans-serif">S</text>
  </svg>
);

// ═══════════════════════════════════════════════════════════════
// WEB BACKEND
// ═══════════════════════════════════════════════════════════════

/** Node.js — Hexagonal event-loop network */
const Nodejs: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("nog", color)}
    <circle cx="200" cy="200" r="195" fill="url(#nog)" />
    {/* Honeycomb hexagons */}
    {[
      [200,105],[122,150],[278,150],[122,250],[278,250],[200,295],
      [200,200],[44,200],[356,200],[44,105],[356,105],
    ].map(([cx, cy], i) => (
      <polygon key={i}
        points={[0,1,2,3,4,5].map(n => {
          const a = (n * 60 - 30) * Math.PI / 180;
          return `${cx + 42 * Math.cos(a)},${cy + 42 * Math.sin(a)}`;
        }).join(' ')}
        fill={`${color}${i === 6 ? '30' : '10'}`}
        stroke={color} strokeWidth={i === 6 ? '2.5' : '1.5'}
        opacity={i === 6 ? 0.9 : 0.5} />
    ))}
    {/* Event loop ring */}
    <circle cx="200" cy="200" r="36" fill="none" stroke={color} strokeWidth="4" opacity="0.8"
      strokeDasharray="15 8" />
    <circle cx="200" cy="200" r="18" fill={color} opacity="0.9" />
    {/* Connection lines */}
    {[[200,105],[122,150],[278,150],[122,250],[278,250],[200,295]].map(([x,y],i) => (
      <line key={i} x1="200" y1="200" x2={x} y2={y} stroke={color} strokeWidth="1.5" opacity="0.3" strokeDasharray="5 4" />
    ))}
  </svg>
);

/** Express — Minimalist routing arrows */
const Express: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("exg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#exg)" />
    {/* Vertical spine */}
    <rect x="188" y="70" width="24" height="260" rx="12" fill={`${color}20`} stroke={color} strokeWidth="2" />
    {/* HTTP method pills + routes */}
    {[
      { y: 100, method: 'GET',    path: '/api/users',    c: '#22c55e' },
      { y: 148, method: 'POST',   path: '/api/create',   c: '#3b82f6' },
      { y: 196, method: 'PUT',    path: '/api/:id',      c: '#f59e0b' },
      { y: 244, method: 'DEL',    path: '/api/:id',      c: '#ef4444' },
      { y: 292, method: 'ALL',    path: '/api/*',        c: color     },
    ].map(({ y, method, path, c }) => (
      <g key={y}>
        {/* Arrow from spine */}
        <line x1="212" y1={y + 12} x2="240" y2={y + 12} stroke={color} strokeWidth="2" opacity="0.5" />
        <polygon points={`240,${y+8} 248,${y+12} 240,${y+16}`} fill={color} opacity="0.5" />
        {/* Method badge */}
        <rect x="250" y={y} width="50" height="24" rx="6" fill={c} opacity="0.85" />
        <text x="275" y={y + 16} textAnchor="middle" fill="white" fontSize="11" fontWeight="700" fontFamily="monospace">{method}</text>
        {/* Path */}
        <text x="308" y={y + 16} fill={color} fontSize="12" fontFamily="monospace" opacity="0.65">{path}</text>
        {/* Left arrow (return) */}
        <line x1="212" y1={y + 12} x2="180" y2={y + 12} stroke={color} strokeWidth="1.5" opacity="0.3" strokeDasharray="4 3" />
      </g>
    ))}
    {/* Server label */}
    <rect x="60" y="170" width="110" height="60" rx="14" fill={`${color}18`} stroke={color} strokeWidth="2" />
    <text x="115" y="200" textAnchor="middle" fill={color} fontSize="13" fontFamily="monospace">Server</text>
    <text x="115" y="220" textAnchor="middle" fill={color} fontSize="11" fontFamily="monospace" opacity="0.6">:3000</text>
  </svg>
);

/** Python — Snake curves with data nodes */
const Python: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("pyg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#pyg)" />
    {/* Snake body — two interlocking curves */}
    <path d="M100,320 C80,260 160,260 160,200 C160,140 80,140 100,80"
      fill="none" stroke={color} strokeWidth="22" strokeLinecap="round" opacity="0.4" />
    <path d="M300,80 C320,140 240,140 240,200 C240,260 320,260 300,320"
      fill="none" stroke="#f7c948" strokeWidth="22" strokeLinecap="round" opacity="0.35" />
    {/* Snake head circles */}
    <circle cx="100" cy="320" r="24" fill={color} opacity="0.9" />
    <circle cx="300" cy="80"  r="24" fill="#f7c948" opacity="0.85" />
    <circle cx="100" cy="80"  r="6"  fill="white" opacity="0.5" />
    <circle cx="300" cy="320" r="6"  fill="white" opacity="0.5" />
    {/* Data bubbles */}
    {[[160,200],[200,155],[200,245],[240,200]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="14" fill={color} opacity="0.2" stroke={color} strokeWidth="1.5" />
    ))}
    {/* Labels */}
    <rect x="115" y="182" width="70" height="36" rx="8" fill={`#00000040`} />
    <text x="150" y="200" textAnchor="middle" fill="white" fontSize="10" fontFamily="monospace">NumPy</text>
    <text x="150" y="213" textAnchor="middle" fill="white" fontSize="10" fontFamily="monospace">Pandas</text>
  </svg>
);

/** Django — Battery "batteries included" concept */
const Django: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("djg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#djg)" />
    {/* Battery body */}
    <rect x="85" y="130" width="230" height="140" rx="20" fill={`${color}18`} stroke={color} strokeWidth="3" />
    {/* Battery nub */}
    <rect x="315" y="162" width="28" height="76" rx="10" fill={`${color}40`} stroke={color} strokeWidth="2" />
    {/* Battery fill — fully charged */}
    <rect x="95" y="140" width="200" height="120" rx="14" fill={color} opacity="0.25" />
    {/* Sections — "batteries included" modules */}
    {['ORM', 'Auth', 'Admin', 'Forms'].map((label, i) => (
      <g key={i}>
        <rect x={98 + i * 49} y="143" width="42" height="114" rx="8"
          fill={color} opacity={0.25 + i * 0.08} stroke={color} strokeWidth="1" />
        <text x={119 + i * 49} y="207" textAnchor="middle" fill="white"
          fontSize="9" fontFamily="monospace" fontWeight="600"
          transform={`rotate(-90 ${119 + i * 49} 207)`}>{label}</text>
      </g>
    ))}
    {/* Lightning bolt = power */}
    <polygon points="208,145 188,210 203,207 183,275 220,195 204,198"
      fill="white" opacity="0.5" />
    {/* Label */}
    <text x="200" y="310" textAnchor="middle" fill={color} fontSize="15" fontFamily="monospace" opacity="0.6">Batteries Included</text>
  </svg>
);

/** Flask — Laboratory flask / beaker shape */
const Flask: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("flg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#flg)" />
    {/* Flask shape */}
    <path d="M165,80 L165,195 L85,320 C75,340 92,360 115,360 L285,360 C308,360 325,340 315,320 L235,195 L235,80 Z"
      fill={`${color}15`} stroke={color} strokeWidth="3" />
    {/* Flask neck */}
    <rect x="155" y="68" width="90" height="22" rx="11" fill={`${color}30`} stroke={color} strokeWidth="2" />
    {/* Liquid fill */}
    <path d="M103,310 L135,250 L160,210 L240,210 L265,250 L297,310 Z"
      fill={color} opacity="0.35" />
    {/* Bubbles */}
    {[[150,270,8],[175,300,6],[210,285,10],[240,265,7],[185,250,5]].map(([x,y,r],i) => (
      <circle key={i} cx={x} cy={y} r={r} fill="white" opacity="0.3" />
    ))}
    {/* Code label */}
    <rect x="125" y="130" width="150" height="65" rx="12" fill={`${color}20`} stroke={`${color}40`} strokeWidth="1" />
    <text x="200" y="155" textAnchor="middle" fill={color} fontSize="11" fontFamily="monospace">@app.route('/')</text>
    <text x="200" y="175" textAnchor="middle" fill={color} fontSize="11" fontFamily="monospace">def hello():</text>
    <text x="200" y="190" textAnchor="middle" fill={color} fontSize="10" fontFamily="monospace" opacity="0.7">    return 'Hi!'</text>
  </svg>
);

/** Java — Coffee cup with steam */
const Java: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("jvg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#jvg)" />
    {/* Cup body */}
    <path d="M120,210 L140,340 L260,340 L280,210 Z"
      fill={`${color}20`} stroke={color} strokeWidth="3" />
    {/* Cup top ellipse */}
    <ellipse cx="200" cy="210" rx="80" ry="20" fill={`${color}25`} stroke={color} strokeWidth="2.5" />
    {/* Handle */}
    <path d="M280,240 C330,240 330,300 280,300" fill="none" stroke={color} strokeWidth="10"
      strokeLinecap="round" opacity="0.75" />
    {/* Coffee surface */}
    <ellipse cx="200" cy="212" rx="68" ry="15" fill={color} opacity="0.35" />
    {/* Steam */}
    {[[-25,0],[0,0],[25,0]].map(([dx,],i) => (
      <path key={i}
        d={`M${200+dx},195 C${190+dx},170 ${210+dx},155 ${200+dx},130 C${190+dx},105 ${210+dx},90 ${200+dx},65`}
        fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" opacity={0.5 - i * 0.05}
        strokeDasharray="6 5" />
    ))}
    {/* Saucer */}
    <ellipse cx="200" cy="345" rx="85" ry="14" fill={`${color}20`} stroke={color} strokeWidth="2" />
    {/* Java badge */}
    <rect x="148" y="258" width="104" height="35" rx="10" fill={color} opacity="0.85" />
    <text x="200" y="281" textAnchor="middle" fill="white" fontSize="18" fontWeight="900" fontFamily="serif">Java</text>
  </svg>
);

/** Spring — Coiled spring with leaf */
const Spring: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("spg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#spg)" />
    {/* Spring coils */}
    {[0,1,2,3,4,5,6].map(i => (
      <ellipse key={i} cx="200" cy={100 + i * 35} rx={70 - Math.abs(3-i) * 5} ry="16"
        fill="none" stroke={color} strokeWidth={i === 3 ? 4 : 2.5}
        opacity={0.4 + Math.abs(3.5 - i) * -0.03 + 0.15} />
    ))}
    {/* Vertical rod */}
    <rect x="196" y="90" width="8" height="250" rx="4" fill={color} opacity="0.15" />
    {/* Leaf on top */}
    <path d="M200,60 C170,80 155,120 200,140 C245,120 230,80 200,60 Z"
      fill={color} opacity="0.85" />
    {/* Leaf vein */}
    <line x1="200" y1="65" x2="200" y2="138" stroke="white" strokeWidth="2" opacity="0.5" />
    {/* Boot label */}
    <rect x="145" y="310" width="110" height="36" rx="18" fill={`${color}25`} stroke={color} strokeWidth="2" />
    <text x="200" y="333" textAnchor="middle" fill={color} fontSize="14" fontFamily="monospace">Spring Boot</text>
  </svg>
);

/** Go — Gopher abstract form with streams */
const Go: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("gog", color)}
    <circle cx="200" cy="200" r="195" fill="url(#gog)" />
    {/* Gopher-inspired circles */}
    <circle cx="200" cy="170" r="75" fill={`${color}20`} stroke={color} strokeWidth="3" />
    <circle cx="163" cy="148" r="20" fill={color} opacity="0.7" />
    <circle cx="237" cy="148" r="20" fill={color} opacity="0.7" />
    <circle cx="163" cy="148" r="10" fill="white" opacity="0.9" />
    <circle cx="237" cy="148" r="10" fill="white" opacity="0.9" />
    {/* Goroutine streams */}
    {[0,1,2,3].map(i => (
      <g key={i}>
        <path d={`M${60 + i*70},260 L${80 + i*70},340`}
          stroke={color} strokeWidth="4" opacity={0.5 - i*0.05} strokeLinecap="round" />
        <circle cx={60 + i*70} cy="255" r="8" fill={color} opacity={0.5 - i*0.05} />
        <text x={60 + i*70} y={365} textAnchor="middle" fill={color} fontSize="11" fontFamily="monospace" opacity="0.5">go</text>
      </g>
    ))}
    {/* Channels */}
    <rect x="65" y="272" width="270" height="14" rx="7" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
    <text x="200" y="283" textAnchor="middle" fill={color} fontSize="10" fontFamily="monospace" opacity="0.5">chan</text>
    {/* Speed badge */}
    <rect x="130" y="215" width="140" height="30" rx="15" fill={color} opacity="0.9" />
    <text x="200" y="235" textAnchor="middle" fill="white" fontSize="13" fontWeight="700" fontFamily="monospace">Concurrency</text>
  </svg>
);

/** PHP — Elephant head simplified */
const Php: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("phpg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#phpg)" />
    {/* Elephant head */}
    <ellipse cx="200" cy="175" rx="110" ry="95" fill={`${color}20`} stroke={color} strokeWidth="3" />
    {/* Ears */}
    <ellipse cx="90" cy="150" rx="45" ry="60" fill={`${color}18`} stroke={color} strokeWidth="2.5" />
    <ellipse cx="310" cy="150" rx="45" ry="60" fill={`${color}18`} stroke={color} strokeWidth="2.5" />
    {/* Trunk */}
    <path d="M170,235 C155,260 145,300 155,340 C160,360 175,365 185,345 C190,330 175,310 178,285 C180,265 190,250 195,240"
      fill="none" stroke={color} strokeWidth="18" strokeLinecap="round" opacity="0.6" />
    {/* Eyes */}
    <circle cx="165" cy="155" r="18" fill={color} opacity="0.8" />
    <circle cx="235" cy="155" r="18" fill={color} opacity="0.8" />
    <circle cx="165" cy="155" r="9" fill="white" opacity="0.9" />
    <circle cx="235" cy="155" r="9" fill="white" opacity="0.9" />
    {/* PHP pill */}
    <rect x="135" y="190" width="130" height="40" rx="20" fill={color} opacity="0.9" />
    <text x="200" y="217" textAnchor="middle" fill="white" fontSize="22" fontWeight="900" fontFamily="monospace">PHP</text>
  </svg>
);

/** Laravel — Artisan L-shape + craft brush */
const Laravel: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("lrg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#lrg)" />
    {/* Large L letterform */}
    <rect x="115" y="80" width="50" height="220" rx="14" fill={`${color}30`} stroke={color} strokeWidth="2.5" />
    <rect x="115" y="265" width="155" height="50" rx="14" fill={`${color}30`} stroke={color} strokeWidth="2.5" />
    {/* Artisan paintbrush */}
    <line x1="260" y1="100" x2="175" y2="245" stroke={color} strokeWidth="6" strokeLinecap="round" opacity="0.7" />
    <polygon points="175,245 165,285 210,260" fill={color} opacity="0.75" />
    <ellipse cx="270" cy="90" rx="20" ry="12" fill={color} opacity="0.55" transform="rotate(-40 270 90)" />
    {/* Artisan prompt */}
    <rect x="205" y="130" width="155" height="30" rx="8" fill={`${color}18`} stroke={`${color}35`} strokeWidth="1" />
    <text x="215" y="150" fill={color} fontSize="12" fontFamily="monospace" opacity="0.7">php artisan serve</text>
    {/* Route pill */}
    <rect x="205" y="170" width="130" height="28" rx="8" fill={`${color}15`} stroke={`${color}30`} strokeWidth="1" />
    <text x="215" y="188" fill={color} fontSize="12" fontFamily="monospace" opacity="0.6">Route::get('/')</text>
  </svg>
);

/** Ruby — Diamond gem with facets */
const Ruby: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("ryg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#ryg)" />
    {/* Gem crown */}
    <polygon points="200,65 130,145 200,135 270,145" fill={color} opacity="0.35" />
    {/* Gem main body */}
    <polygon points="130,145 200,350 270,145" fill={color} opacity="0.65" />
    {/* Facets */}
    <polygon points="200,135 130,145 200,240" fill={color} opacity="0.8" />
    <polygon points="200,135 270,145 200,240" fill={color} opacity="0.55" />
    <polygon points="130,145 200,240 115,185" fill={color} opacity="0.4" />
    <polygon points="270,145 200,240 285,185" fill={color} opacity="0.5" />
    {/* Top table facets */}
    <line x1="155" y1="100" x2="200" y2="135" stroke="white" strokeWidth="1.5" opacity="0.4" />
    <line x1="245" y1="100" x2="200" y2="135" stroke="white" strokeWidth="1.5" opacity="0.4" />
    <line x1="200" y1="65"  x2="200" y2="135" stroke="white" strokeWidth="1.5" opacity="0.3" />
    {/* Sparkle */}
    {[[80,80],[320,90],[60,290],[330,300]].map(([x,y],i) => (
      <g key={i}>
        <line x1={x} y1={y-12} x2={x} y2={y+12} stroke={color} strokeWidth="2" opacity="0.35" />
        <line x1={x-12} y1={y} x2={x+12} y2={y} stroke={color} strokeWidth="2" opacity="0.35" />
      </g>
    ))}
  </svg>
);

// ═══════════════════════════════════════════════════════════════
// MOBILE
// ═══════════════════════════════════════════════════════════════

/** React Native — Phone with React orbit */
const ReactNative: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("rng", color)}
    <circle cx="200" cy="200" r="195" fill="url(#rng)" />
    {/* Phone outline */}
    <rect x="130" y="70" width="140" height="260" rx="24" fill={`${color}15`} stroke={color} strokeWidth="3" />
    <rect x="142" y="86" width="116" height="210" rx="14" fill={`${color}10`} stroke={color} strokeWidth="1.5" />
    {/* Home indicator */}
    <rect x="168" y="310" width="64" height="6" rx="3" fill={color} opacity="0.5" />
    {/* React atoms inside screen */}
    <ellipse cx="200" cy="195" rx="50" ry="18" fill="none" stroke={color} strokeWidth="1.5" opacity="0.7" />
    <ellipse cx="200" cy="195" rx="50" ry="18" fill="none" stroke={color} strokeWidth="1.5" opacity="0.7" transform="rotate(60 200 195)" />
    <ellipse cx="200" cy="195" rx="50" ry="18" fill="none" stroke={color} strokeWidth="1.5" opacity="0.7" transform="rotate(120 200 195)" />
    <circle cx="200" cy="195" r="10" fill={color} opacity="0.9" />
    {/* iOS / Android icons */}
    <rect x="52" y="165" width="65" height="70" rx="16" fill={`${color}20`} stroke={color} strokeWidth="2" />
    <text x="84" y="208" textAnchor="middle" fill={color} fontSize="22" fontFamily="sans-serif" opacity="0.7">📱</text>
    <rect x="283" y="165" width="65" height="70" rx="16" fill={`${color}20`} stroke={color} strokeWidth="2" />
    <text x="315" y="208" textAnchor="middle" fill={color} fontSize="22" fontFamily="sans-serif" opacity="0.7">🤖</text>
  </svg>
);

/** Flutter — Layered material diamond */
const Flutter: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("ftg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#ftg)" />
    {/* Flutter logo — two diamonds */}
    {/* Top diamond */}
    <polygon points="200,60 280,140 200,200 120,140"
      fill={color} opacity="0.8" />
    {/* Bottom left diamond */}
    <polygon points="120,140 200,200 120,260 40,200"
      fill={color} opacity="0.5" />
    {/* Bottom right diamond — the Dart blue */}
    <polygon points="200,200 280,140 200,270 120,260"
      fill={color} opacity="0.7" />
    {/* Shadow piece */}
    <polygon points="120,260 200,270 160,330 80,330"
      fill={color} opacity="0.3" />
    {/* Layer cards */}
    {[330, 300, 270].map((y, i) => (
      <rect key={i} x={220 + i * 5} y={y - i * 5} width={130 - i * 10}
        height="35" rx="8"
        fill={`${color}${['30','20','12'][i]}`}
        stroke={color} strokeWidth="1.5" />
    ))}
    <text x="285" y="323" textAnchor="middle" fill={color} fontSize="11" fontFamily="monospace">Widget</text>
    <text x="285" y="293" textAnchor="middle" fill={color} fontSize="11" fontFamily="monospace" opacity="0.7">Column</text>
  </svg>
);

/** Dart — Arrow/dart piercing through rings */
const Dart: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("dtg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#dtg)" />
    {/* Concentric target rings */}
    {[140, 100, 60, 20].map((r, i) => (
      <circle key={i} cx="200" cy="200" r={r}
        fill="none" stroke={color} strokeWidth="2.5"
        opacity={0.2 + i * 0.1} />
    ))}
    {/* Dart / arrow diagonal */}
    <line x1="60" y1="340" x2="340" y2="60" stroke={color} strokeWidth="8" strokeLinecap="round" opacity="0.8" />
    {/* Arrowhead */}
    <polygon points="340,60 310,82 318,90 296,118 322,94 330,102"
      fill={color} opacity="0.9" />
    {/* Tail fletching */}
    <polygon points="60,340 88,318 80,310 102,285 76,307 68,298"
      fill={color} opacity="0.6" />
    {/* Bull's-eye center */}
    <circle cx="200" cy="200" r="12" fill={color} opacity="0.9" />
    {/* Null safety badge */}
    <rect x="236" y="230" width="100" height="28" rx="14" fill={`${color}25`} stroke={color} strokeWidth="1.5" />
    <text x="286" y="249" textAnchor="middle" fill={color} fontSize="12" fontFamily="monospace">Null Safe ✓</text>
  </svg>
);

/** Kotlin — Gradient K geometric letterform */
const Kotlin: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="ktg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={color} />
        <stop offset="50%" stopColor="#f7c948" />
        <stop offset="100%" stopColor={color} />
      </linearGradient>
      <radialGradient id="ktg2" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={color} stopOpacity="0.15" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="200" cy="200" r="195" fill="url(#ktg2)" />
    {/* K shape — background large */}
    <polygon points="90,70 90,330 170,250 280,330 280,255 200,200 280,145 280,70 170,150"
      fill="url(#ktg)" opacity="0.85" />
    {/* Purple / orange gradient triangles */}
    <polygon points="90,70 170,150 90,200" fill={color} opacity="0.3" />
    <polygon points="280,70 170,150 280,145" fill="#f7c948" opacity="0.25" />
    {/* Kotlin badge */}
    <rect x="120" y="350" width="160" height="32" rx="16" fill={color} opacity="0.85" />
    <text x="200" y="372" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="monospace">Kotlin 2.0</text>
    {/* Coroutine squiggles */}
    {[0,1,2].map(i => (
      <path key={i}
        d={`M${50 + i*110},55 C${60 + i*110},40 ${80 + i*110},70 ${90 + i*110},55`}
        fill="none" stroke={color} strokeWidth="2" opacity="0.3" />
    ))}
  </svg>
);

/** Swift — Swift bird in motion */
const Swift: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("swg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#swg)" />
    {/* Bird wing S-curve */}
    <path d="M340,130 C280,100 180,140 130,200 C80,260 100,330 180,340 C240,348 300,310 330,260"
      fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" opacity="0.85" />
    {/* Wing feathers / motion trail */}
    {[0,1,2,3].map(i => (
      <path key={i}
        d={`M${330 - i*30},${245 + i*15} C${310 - i*30},${275 + i*10} ${280 - i*30},${285 + i*5} ${260 - i*30},${300 + i*5}`}
        fill="none" stroke={color} strokeWidth={4 - i*0.5} strokeLinecap="round"
        opacity={0.5 - i * 0.1} />
    ))}
    {/* Head circle */}
    <circle cx="335" cy="125" r="30" fill={color} opacity="0.9" />
    {/* Eye */}
    <circle cx="345" cy="118" r="8" fill="white" opacity="0.85" />
    <circle cx="347" cy="118" r="4" fill={color} opacity="0.9" />
    {/* Beak */}
    <polygon points="363,122 358,130 340,124" fill={color} opacity="0.7" />
    {/* Motion lines */}
    {[0,1,2,3].map(i => (
      <line key={i} x1={55} y1={168 + i*18} x2={115 - i*5} y2={168 + i*18}
        stroke={color} strokeWidth="3" opacity={0.3 - i*0.06} strokeLinecap="round" />
    ))}
    {/* SwiftUI badge */}
    <rect x="80" y="320" width="100" height="30" rx="15" fill={`${color}25`} stroke={color} strokeWidth="1.5" />
    <text x="130" y="340" textAnchor="middle" fill={color} fontSize="12" fontFamily="monospace">SwiftUI</text>
  </svg>
);

/** Android — Robot head from circles */
const AndroidIll: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("adrg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#adrg)" />
    {/* Head */}
    <rect x="110" y="150" width="180" height="150" rx="32" fill={`${color}25`} stroke={color} strokeWidth="3" />
    {/* Antenna */}
    <line x1="152" y1="150" x2="130" y2="105" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.8" />
    <circle cx="128" cy="100" r="10" fill={color} opacity="0.85" />
    <line x1="248" y1="150" x2="270" y2="105" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.8" />
    <circle cx="272" cy="100" r="10" fill={color} opacity="0.85" />
    {/* Eyes */}
    <circle cx="163" cy="205" r="20" fill={color} opacity="0.85" />
    <circle cx="237" cy="205" r="20" fill={color} opacity="0.85" />
    <circle cx="163" cy="205" r="10" fill="white" opacity="0.9" />
    <circle cx="237" cy="205" r="10" fill="white" opacity="0.9" />
    {/* Body */}
    <rect x="130" y="310" width="140" height="70" rx="14" fill={`${color}20`} stroke={color} strokeWidth="2" />
    {/* Arms */}
    <rect x="68" y="315" width="55" height="40" rx="20" fill={`${color}25`} stroke={color} strokeWidth="2" />
    <rect x="277" y="315" width="55" height="40" rx="20" fill={`${color}25`} stroke={color} strokeWidth="2" />
    {/* Chest text */}
    <text x="200" y="352" textAnchor="middle" fill={color} fontSize="13" fontFamily="monospace" opacity="0.6">Android</text>
  </svg>
);

/** iOS — Rounded rect with Apple circuit traces */
const IosIll: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("iosg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#iosg)" />
    {/* Phone */}
    <rect x="120" y="60" width="160" height="280" rx="30" fill={`${color}15`} stroke={color} strokeWidth="3" />
    <rect x="133" y="78" width="134" height="228" rx="20" fill={`${color}10`} />
    {/* Apple symbol */}
    <path d="M200,135 C195,120 215,105 225,115 C235,105 250,115 245,135 C240,155 220,185 200,190 C180,185 160,155 155,135 C150,115 165,105 175,115 C185,105 205,120 200,135 Z"
      fill={color} opacity="0.7" />
    {/* Apple leaf */}
    <path d="M200,130 C205,118 215,108 220,100" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
    {/* Circuit traces */}
    {[0,1,2].map(i => (
      <g key={i}>
        <line x1={143} y1={220 + i*25} x2={170 + i*10} y2={220 + i*25}
          stroke={color} strokeWidth="1.5" opacity="0.3" />
        <line x1={170 + i*10} y1={220 + i*25} x2={170 + i*10} y2={240 + i*25}
          stroke={color} strokeWidth="1.5" opacity="0.3" />
        <circle cx={170 + i*10} cy={240 + i*25} r="4" fill={color} opacity="0.3" />
      </g>
    ))}
    {/* Home indicator */}
    <rect x="162" y="320" width="76" height="6" rx="3" fill={color} opacity="0.4" />
  </svg>
);

/** Ionic — Bridge between web and native */
const Ionic: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("ing", color)}
    <circle cx="200" cy="200" r="195" fill="url(#ing)" />
    {/* Web box */}
    <rect x="40" y="155" width="115" height="90" rx="16" fill={`${color}20`} stroke={color} strokeWidth="2.5" />
    <text x="97" y="193" textAnchor="middle" fill={color} fontSize="13" fontFamily="monospace">HTML</text>
    <text x="97" y="210" textAnchor="middle" fill={color} fontSize="13" fontFamily="monospace">CSS JS</text>
    {/* Bridge arch */}
    <path d="M155,200 C155,150 200,130 200,130 C200,130 245,150 245,200"
      fill="none" stroke={color} strokeWidth="5" opacity="0.7" />
    <line x1="155" y1="200" x2="245" y2="200" stroke={color} strokeWidth="5" opacity="0.7" />
    {/* Bridge pillars */}
    {[170,185,200,215,230].map(x => (
      <line key={x} x1={x} y1="200" x2={x} y2={175 + Math.abs(x-200)*0.4}
        stroke={color} strokeWidth="2" opacity="0.4" />
    ))}
    {/* Native box */}
    <rect x="245" y="155" width="115" height="90" rx="16" fill={`${color}20`} stroke={color} strokeWidth="2.5" />
    <text x="302" y="193" textAnchor="middle" fill={color} fontSize="13" fontFamily="monospace">iOS</text>
    <text x="302" y="210" textAnchor="middle" fill={color} fontSize="13" fontFamily="monospace">Android</text>
    {/* Capacitor badge */}
    <rect x="140" y="295" width="120" height="32" rx="16" fill={color} opacity="0.8" />
    <text x="200" y="317" textAnchor="middle" fill="white" fontSize="13" fontWeight="700" fontFamily="monospace">Capacitor</text>
  </svg>
);

// ═══════════════════════════════════════════════════════════════
// DATABASES
// ═══════════════════════════════════════════════════════════════

/** MongoDB — Leaf / document cluster */
const Mongodb: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("mog", color)}
    <circle cx="200" cy="200" r="195" fill="url(#mog)" />
    {/* Leaf / seed shape */}
    <path d="M200,60 C200,60 155,100 150,170 C145,240 175,300 200,340 C225,300 255,240 250,170 C245,100 200,60 200,60Z"
      fill={color} opacity="0.7" />
    {/* Leaf vein */}
    <path d="M200,75 C200,75 200,200 195,335"
      fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
    {/* Document bubbles floating around */}
    {[
      [70,150,35],[80,260,28],[320,130,32],[315,270,26],
      [55,200,20],[335,200,20],[130,60,22],[270,65,18],
    ].map(([x,y,r],i) => (
      <g key={i}>
        <rect x={x-r*0.7} y={y-r*0.8} width={r*1.4} height={r*1.6} rx={r*0.25}
          fill={`${color}20`} stroke={color} strokeWidth="1.5" />
        {/* Line in doc */}
        <line x1={x-r*0.4} y1={y - r*0.15} x2={x+r*0.4} y2={y - r*0.15}
          stroke={color} strokeWidth="1.5" opacity="0.5" />
        <line x1={x-r*0.4} y1={y + r*0.2} x2={x+r*0.3} y2={y + r*0.2}
          stroke={color} strokeWidth="1.5" opacity="0.35" />
      </g>
    ))}
  </svg>
);

/** PostgreSQL — Database cylinders with grid overlay */
const Postgresql: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("pgg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#pgg)" />
    {/* Database cylinders */}
    {[0, 1, 2].map(i => {
      const y = 80 + i * 90;
      const w = 220 - i * 30;
      const x = 200 - w/2;
      return (
        <g key={i}>
          <ellipse cx="200" cy={y} rx={w/2} ry={w*0.12} fill={`${color}${['30','25','20'][i]}`} stroke={color} strokeWidth="2" />
          <rect x={x} y={y} width={w} height="60" fill={`${color}${['20','18','12'][i]}`} stroke={color} strokeWidth="2" />
          <ellipse cx="200" cy={y + 60} rx={w/2} ry={w*0.12} fill={`${color}${['25','20','15'][i]}`} stroke={color} strokeWidth="2" />
          {/* Table row lines inside */}
          {[0,1,2].map(r => (
            <line key={r} x1={x + 15} y1={y + 18 + r*15} x2={x + w - 15} y2={y + 18 + r*15}
              stroke={color} strokeWidth="1.5" opacity="0.3" />
          ))}
        </g>
      );
    })}
    {/* Grid table overlay */}
    <rect x="260" y="220" width="110" height="130" rx="10" fill={`${color}15`} stroke={color} strokeWidth="1.5" opacity="0.7" />
    {[0,1,2,3].map(r => (
      <line key={r} x1="260" y1={220 + r*32} x2="370" y2={220 + r*32} stroke={color} strokeWidth="1" opacity="0.3" />
    ))}
    {[0,1,2].map(c => (
      <line key={c} x1={260 + c*36} y1="220" x2={260 + c*36} y2="350" stroke={color} strokeWidth="1" opacity="0.3" />
    ))}
  </svg>
);

/** MySQL — M-shape with data wave */
const Mysql: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("myg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#myg)" />
    {/* M letterform */}
    <path d="M70,300 L70,130 L130,220 L200,130 L200,300"
      fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
    {/* Dolphin arc — MySQL mascot suggestion */}
    <path d="M200,300 C200,200 290,160 330,130"
      fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" opacity="0.7" />
    {/* Dolphin fin */}
    <path d="M290,185 C310,155 330,140 335,125 C320,130 295,155 285,185Z"
      fill={color} opacity="0.65" />
    {/* Data waves */}
    {[0,1,2].map(i => (
      <path key={i}
        d={`M60,${320 + i*18} C100,${310 + i*18} 160,${330 + i*18} 220,${318 + i*18} C280,${306 + i*18} 340,${328 + i*18} 380,${320 + i*18}`}
        fill="none" stroke={color} strokeWidth="2.5" opacity={0.3 - i * 0.08} />
    ))}
    {/* SQL badge */}
    <rect x="50" y="55" width="80" height="34" rx="17" fill={color} opacity="0.8" />
    <text x="90" y="78" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="monospace">SQL</text>
  </svg>
);

/** Redis — Lightning cache network */
const Redis: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("rdg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#rdg)" />
    {/* Cache nodes */}
    {[[200,70],[80,160],[320,160],[80,280],[320,280],[200,340]].map(([cx,cy],i) => (
      <g key={i}>
        <circle cx={cx} cy={cy} r="28" fill={`${color}20`} stroke={color} strokeWidth="2.5" />
        <text x={cx} y={cy + 5} textAnchor="middle" fill={color} fontSize="11" fontFamily="monospace">
          {['key','val','set','hash','list','str'][i]}
        </text>
      </g>
    ))}
    {/* Network connections */}
    {[[200,70,80,160],[200,70,320,160],[80,160,80,280],[320,160,320,280],
      [80,160,200,200],[320,160,200,200],[80,280,200,340],[320,280,200,340]].map(([x1,y1,x2,y2],i) => (
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2" opacity="0.3" />
    ))}
    {/* Center lightning bolt */}
    <polygon points="208,162 185,210 202,207 178,258 220,193 202,196"
      fill={color} opacity="0.95" />
  </svg>
);

/** Firebase — Flame data rising */
const Firebase: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("fbg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#fbg)" />
    {/* Database cylinders at bottom */}
    {[0,1,2].map(i => (
      <rect key={i} x={95 + i*70} y={300 - i*20} width="65" height={70 + i*20} rx="6"
        fill={`${color}${['12','18','22'][i]}`} stroke={color} strokeWidth="2" />
    ))}
    {/* Flames */}
    {[[-25,0,1],[0,0,1.2],[25,0,0.9],[-12,-20,0.7],[12,-20,0.75]].map(([dx,dy,s],i) => (
      <path key={i}
        d={`M${200+dx},${280+dy} C${185+dx},${240+dy} ${200+dx},${200+dy*s} ${200+dx},${180+dy} C${200+dx},${200+dy} ${215+dx},${240+dy} ${200+dx},${280+dy}Z`}
        fill={color} opacity={0.5 + i * 0.08} transform={`scale(${s} ${s}) translate(${200*(1-s)} ${280*(1-s)})`} />
    ))}
    {/* Main flame */}
    <path d="M200,280 C170,230 160,170 200,130 C240,170 230,230 200,280Z"
      fill={color} opacity="0.85" />
    {/* Firebase name */}
    <rect x="125" y="60" width="150" height="40" rx="20" fill={`${color}25`} stroke={color} strokeWidth="1.5" />
    <text x="200" y="86" textAnchor="middle" fill={color} fontSize="15" fontWeight="700" fontFamily="monospace">Firebase</text>
  </svg>
);

/** SQLite — Compact embedded chip */
const Sqlite: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("sltg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#sltg)" />
    {/* Chip body */}
    <rect x="110" y="110" width="180" height="180" rx="20" fill={`${color}20`} stroke={color} strokeWidth="3" />
    {/* Chip inner */}
    <rect x="135" y="135" width="130" height="130" rx="12" fill={`${color}15`} stroke={color} strokeWidth="2" />
    {/* Pins top & bottom */}
    {[0,1,2,3].map(i => (
      <g key={i}>
        <rect x={130 + i*35} y="92" width="20" height="18" rx="4" fill={`${color}35`} stroke={color} strokeWidth="1.5" />
        <rect x={130 + i*35} y="290" width="20" height="18" rx="4" fill={`${color}35`} stroke={color} strokeWidth="1.5" />
      </g>
    ))}
    {/* Pins left & right */}
    {[0,1,2,3].map(i => (
      <g key={i}>
        <rect x="92" y={130 + i*35} width="18" height="20" rx="4" fill={`${color}35`} stroke={color} strokeWidth="1.5" />
        <rect x="290" y={130 + i*35} width="18" height="20" rx="4" fill={`${color}35`} stroke={color} strokeWidth="1.5" />
      </g>
    ))}
    {/* SQLite label */}
    <rect x="148" y="172" width="104" height="56" rx="10" fill={color} opacity="0.85" />
    <text x="200" y="197" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="monospace">SQLite</text>
    <text x="200" y="217" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="11" fontFamily="monospace">embedded</text>
  </svg>
);

/** GraphQL — Connected hexagonal nodes */
const Graphql: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("gqlg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#gqlg)" />
    {/* Star/wheel structure — 7 outer nodes + center */}
    {[0, 51.4, 102.9, 154.3, 205.7, 257.1, 308.6].map((deg, i) => {
      const rad = deg * Math.PI / 180;
      const x = 200 + 140 * Math.cos(rad);
      const y = 200 + 140 * Math.sin(rad);
      return (
        <g key={i}>
          {/* Connection line to center */}
          <line x1="200" y1="200" x2={x} y2={y} stroke={color} strokeWidth="2" opacity="0.35" />
          {/* Node hexagon */}
          <polygon
            points={[0,1,2,3,4,5].map(n => {
              const a = (n * 60) * Math.PI / 180;
              return `${x + 22 * Math.cos(a)},${y + 22 * Math.sin(a)}`;
            }).join(' ')}
            fill={`${color}20`} stroke={color} strokeWidth="2" />
          {/* Node label */}
          <text x={x} y={y + 5} textAnchor="middle" fill={color} fontSize="10" fontFamily="monospace">
            {['Query','Mut','Sub','Type','Field','Arg','Frag'][i]}
          </text>
        </g>
      );
    })}
    {/* Center node */}
    <circle cx="200" cy="200" r="35" fill={color} opacity="0.9" />
    <text x="200" y="205" textAnchor="middle" fill="white" fontSize="13" fontWeight="700" fontFamily="monospace">GQL</text>
    {/* Cross connections between nodes */}
    {[[0,2],[1,4],[3,6],[0,5]].map(([a,b],i) => {
      const ra = (a * 51.4) * Math.PI / 180;
      const rb = (b * 51.4) * Math.PI / 180;
      return (
        <line key={i}
          x1={200 + 140 * Math.cos(ra)} y1={200 + 140 * Math.sin(ra)}
          x2={200 + 140 * Math.cos(rb)} y2={200 + 140 * Math.sin(rb)}
          stroke={color} strokeWidth="1.5" opacity="0.2" strokeDasharray="6 4" />
      );
    })}
  </svg>
);

// ═══════════════════════════════════════════════════════════════
// CLOUD & DEVOPS
// ═══════════════════════════════════════════════════════════════

/** Docker — Whale with container boxes */
const Docker: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("dkg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#dkg)" />
    {/* Ocean waves */}
    <path d="M30,290 C80,270 130,310 200,285 C270,260 330,300 380,280 L380,380 L30,380Z"
      fill={`${color}20`} />
    {/* Whale body */}
    <path d="M60,260 C70,220 120,200 180,205 C240,210 310,220 350,240 C380,255 375,280 340,280 C300,280 260,265 200,270 C140,275 90,280 60,260Z"
      fill={`${color}35`} stroke={color} strokeWidth="2.5" />
    {/* Container boxes on back */}
    {[0,1,2,3].map(i => (
      <rect key={i} x={115 + i*54} y={195 - i*15} width="45" height="35" rx="6"
        fill={`${color}${['50','45','40','35'][i]}`} stroke={color} strokeWidth="2" />
    ))}
    {/* Boxes content */}
    {[0,1,2,3].map(i => (
      <text key={i} x={137 + i*54} y={218 - i*15} textAnchor="middle"
        fill="white" fontSize="9" fontFamily="monospace">
        {['web','api','db','cache'][i]}
      </text>
    ))}
    {/* Whale tail */}
    <path d="M60,260 C35,248 25,230 35,215 C45,200 60,215 60,235"
      fill={`${color}30`} stroke={color} strokeWidth="2" />
    {/* Water spout */}
    <path d="M340,240 C345,210 355,185 345,160" fill="none" stroke={color} strokeWidth="3" opacity="0.5" strokeDasharray="6 4" />
    <circle cx="345" cy="155" r="10" fill={color} opacity="0.5" />
    {/* Eye */}
    <circle cx="330" cy="248" r="10" fill="white" opacity="0.8" />
    <circle cx="332" cy="248" r="5" fill={color} />
  </svg>
);

/** Kubernetes — Steering wheel helm */
const Kubernetes: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("k8g", color)}
    <circle cx="200" cy="200" r="195" fill="url(#k8g)" />
    {/* Outer ring */}
    <circle cx="200" cy="200" r="155" fill="none" stroke={color} strokeWidth="14" opacity="0.5" />
    {/* 7 spokes */}
    {[0,1,2,3,4,5,6].map(i => {
      const deg = i * (360/7);
      const rad = deg * Math.PI / 180;
      const x1 = 200 + 50 * Math.cos(rad);
      const y1 = 200 + 50 * Math.sin(rad);
      const x2 = 200 + 152 * Math.cos(rad);
      const y2 = 200 + 152 * Math.sin(rad);
      return (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={color} strokeWidth="9" strokeLinecap="round" opacity="0.7" />
      );
    })}
    {/* Pod hexagons at spoke tips */}
    {[0,1,2,3,4,5,6].map(i => {
      const deg = i * (360/7);
      const rad = deg * Math.PI / 180;
      const cx = 200 + 155 * Math.cos(rad);
      const cy = 200 + 155 * Math.sin(rad);
      return (
        <polygon key={i}
          points={[0,1,2,3,4,5].map(n => {
            const a = (n * 60 - 30) * Math.PI / 180;
            return `${cx + 18 * Math.cos(a)},${cy + 18 * Math.sin(a)}`;
          }).join(' ')}
          fill={color} opacity="0.8" />
      );
    })}
    {/* Center hub */}
    <circle cx="200" cy="200" r="48" fill={`${color}20`} stroke={color} strokeWidth="3" />
    <circle cx="200" cy="200" r="25" fill={color} opacity="0.9" />
    <text x="200" y="205" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="monospace">K8s</text>
  </svg>
);

/** AWS — Cloud with nested service boxes */
const Aws: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("awsg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#awsg)" />
    {/* Cloud shape */}
    <path d="M80,200 C65,165 85,130 120,125 C125,100 145,85 170,88 C185,70 205,65 225,75 C250,65 280,80 285,115 C320,118 340,148 330,180 C340,215 318,240 290,240 L100,240 C72,240 62,218 80,200Z"
      fill={`${color}20`} stroke={color} strokeWidth="2.5" />
    {/* Service boxes inside cloud */}
    {[
      { x: 105, y: 155, w: 70, label: 'EC2' },
      { x: 185, y: 155, w: 55, label: 'S3' },
      { x: 250, y: 155, w: 60, label: 'RDS' },
    ].map(({ x, y, w, label }) => (
      <g key={label}>
        <rect x={x} y={y} width={w} height="55" rx="10" fill={color} opacity="0.3" stroke={color} strokeWidth="1.5" />
        <text x={x + w/2} y={y + 34} textAnchor="middle" fill={color} fontSize="13" fontWeight="700" fontFamily="monospace">{label}</text>
      </g>
    ))}
    {/* AWS orange bottom pills */}
    {['Lambda','CloudFront','VPC'].map((label, i) => (
      <rect key={label} x={75 + i*105} y="280" width="95" height="32" rx="16"
        fill={`${color}25`} stroke={color} strokeWidth="1.5" />
    ))}
    {['Lambda','CloudFront','VPC'].map((label, i) => (
      <text key={label} x={122 + i*105} y="302" textAnchor="middle"
        fill={color} fontSize="12" fontFamily="monospace">{label}</text>
    ))}
  </svg>
);

/** Google Cloud — Colorful hexagonal mosaic */
const GoogleCloud: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("gcg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#gcg)" />
    {/* 4-color hexagonal cloud mosaic */}
    {[
      { cx: 200, cy: 120, c: '#4285f4' },
      { cx: 148, cy: 152, c: '#ea4335' },
      { cx: 148, cy: 216, c: '#fbbc04' },
      { cx: 200, cy: 248, c: '#34a853' },
      { cx: 252, cy: 216, c: '#4285f4' },
      { cx: 252, cy: 152, c: '#ea4335' },
      { cx: 200, cy: 184, c: color    },  // center
    ].map(({ cx, cy, c }, i) => (
      <polygon key={i}
        points={[0,1,2,3,4,5].map(n => {
          const a = (n * 60 - 30) * Math.PI / 180;
          return `${cx + 50 * Math.cos(a)},${cy + 50 * Math.sin(a)}`;
        }).join(' ')}
        fill={c} opacity={i === 6 ? 0.85 : 0.6}
        stroke="white" strokeWidth="2" />
    ))}
    {/* Service labels */}
    {['Cloud Run','BigQuery','Vertex AI'].map((label, i) => (
      <rect key={label} x={65 + i*90} y="310" width={`${label.length * 9}`} height="30" rx="15"
        fill={`${color}20`} stroke={color} strokeWidth="1.5" />
    ))}
    {['Cloud Run','BigQuery','Vertex AI'].map((label, i) => (
      <text key={label} x={100 + i*90} y="330" textAnchor="middle"
        fill={color} fontSize="11" fontFamily="monospace">{label}</text>
    ))}
  </svg>
);

/** Vercel — Triangle deploy with stream lines */
const Vercel: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("vcg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#vcg)" />
    {/* Main Vercel triangle */}
    <polygon points="200,65 350,315 50,315" fill={color} opacity="0.85" />
    {/* Deploy stream lines */}
    {[0,1,2,3].map(i => (
      <line key={i}
        x1={200} y1={315 + 12 + i*20}
        x2={200} y2={315 + 30 + i*20}
        stroke={color} strokeWidth={5 - i*0.8} opacity={0.5 - i*0.1}
        strokeLinecap="round" />
    ))}
    {/* "Git push → Deploy" flow */}
    <rect x="60" y="140" width="90" height="36" rx="18" fill={`${color}20`} stroke={color} strokeWidth="1.5" />
    <text x="105" y="163" textAnchor="middle" fill={color} fontSize="12" fontFamily="monospace">git push</text>
    <path d="M150,158 L175,158" stroke={color} strokeWidth="2" markerEnd="url(#arr)" opacity="0.6" />
    <rect x="230" y="140" width="90" height="36" rx="18" fill={color} opacity="0.8" />
    <text x="275" y="163" textAnchor="middle" fill="white" fontSize="12" fontFamily="monospace">Deploy ✓</text>
    {/* Edge lines */}
    <text x="200" y="375" textAnchor="middle" fill={color} fontSize="12" fontFamily="monospace" opacity="0.4">Edge Network · 70+ Regions</text>
  </svg>
);

/** Netlify — Teal deploy pipeline */
const Netlify: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("ntg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#ntg)" />
    {/* N letterform */}
    <path d="M80,290 L80,110 L210,270 L210,110"
      fill="none" stroke={color} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
    {/* CDN nodes radiating from N */}
    {[[288,80],[340,160],[330,260],[260,330],[165,355]].map(([x,y],i) => (
      <g key={i}>
        <circle cx={x} cy={y} r="18" fill={`${color}25`} stroke={color} strokeWidth="2" />
        <line x1="210" y1="190" x2={x} y2={y} stroke={color} strokeWidth="1.5" opacity="0.25" strokeDasharray="6 4" />
      </g>
    ))}
    {/* Deploy pipeline */}
    <rect x="225" y="165" width="125" height="50" rx="12" fill={`${color}20`} stroke={color} strokeWidth="1.5" />
    <text x="287" y="193" textAnchor="middle" fill={color} fontSize="12" fontFamily="monospace">Build → Deploy</text>
    {/* Status badge */}
    <rect x="235" y="230" width="105" height="30" rx="15" fill={color} opacity="0.8" />
    <text x="287" y="250" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="monospace">● Published</text>
  </svg>
);

/** GitHub Actions — Workflow pipeline graph */
const GithubActions: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("ghag", color)}
    <circle cx="200" cy="200" r="195" fill="url(#ghag)" />
    {/* Workflow boxes */}
    {[
      { x: 55,  y: 95,  label: 'Trigger', sub: 'push/PR' },
      { x: 55,  y: 180, label: 'Build',   sub: 'compile' },
      { x: 55,  y: 265, label: 'Test',    sub: 'jest/rspec' },
      { x: 225, y: 137, label: 'Lint',    sub: 'eslint' },
      { x: 225, y: 222, label: 'Security', sub: 'scan' },
      { x: 225, y: 307, label: 'Deploy',  sub: 'prod ✓' },
    ].map(({ x, y, label, sub }) => (
      <g key={label}>
        <rect x={x} y={y} width={120} height={50} rx="12"
          fill={label === 'Deploy' ? color : `${color}20`}
          stroke={color} strokeWidth="2" />
        <text x={x + 60} y={y + 21} textAnchor="middle"
          fill={label === 'Deploy' ? 'white' : color} fontSize="12" fontWeight="700" fontFamily="monospace">{label}</text>
        <text x={x + 60} y={y + 38} textAnchor="middle"
          fill={label === 'Deploy' ? 'rgba(255,255,255,0.7)' : `${color}90`} fontSize="10" fontFamily="monospace">{sub}</text>
      </g>
    ))}
    {/* Connecting arrows */}
    {[[55+60,145,55+60,180],[55+60,230,55+60,265],[55+60+120,120,225,137+25],
      [55+60+120,205,225,222+25],[225+60,187,225+60,222],[225+60,272,225+60,307]].map(([x1,y1,x2,y2],i) => (
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2.5" opacity="0.5" />
    ))}
  </svg>
);

/** GitLab — Orange fox head */
const Gitlab: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("glg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#glg)" />
    {/* Fox/tanuki head — abstract from logo */}
    <path d="M200,340 L65,180 L100,80 L145,150 L200,75 L255,150 L300,80 L335,180 Z"
      fill={`${color}35`} stroke={color} strokeWidth="2.5" />
    <path d="M200,320 L90,190 L118,108 L150,165 L200,95 L250,165 L282,108 L310,190 Z"
      fill={color} opacity="0.75" />
    {/* Ears */}
    <polygon points="100,80 65,180 145,150" fill={color} opacity="0.55" />
    <polygon points="300,80 335,180 255,150" fill={color} opacity="0.55" />
    {/* Eyes */}
    <circle cx="162" cy="225" r="20" fill="white" opacity="0.85" />
    <circle cx="238" cy="225" r="20" fill="white" opacity="0.85" />
    <circle cx="162" cy="225" r="10" fill={color} />
    <circle cx="238" cy="225" r="10" fill={color} />
    {/* Nose */}
    <ellipse cx="200" cy="270" rx="20" ry="12" fill={color} opacity="0.7" />
    {/* Pipeline badge */}
    <rect x="120" y="350" width="160" height="32" rx="16" fill={`${color}25`} stroke={color} strokeWidth="1.5" />
    <text x="200" y="371" textAnchor="middle" fill={color} fontSize="13" fontFamily="monospace">CI/CD Pipeline</text>
  </svg>
);

/** Terraform — 3D infrastructure blocks */
const Terraform: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("tfg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#tfg)" />
    {/* Isometric blocks */}
    {[
      { x: 120, y: 150, cx: 82, w: 80, h: 60, order: 0 },
      { x: 200, y: 150, cx: 82, w: 80, h: 60, order: 1 },
      { x: 160, y: 90,  cx: 82, w: 80, h: 60, order: 2 },
    ].map(({ x, y, w, h, order }) => {
      const ox = color;
      return (
        <g key={order}>
          {/* Top face */}
          <polygon
            points={`${x},${y} ${x+w},${y} ${x+w+30},${y-20} ${x+30},${y-20}`}
            fill={color} opacity={0.3 + order * 0.1} stroke={color} strokeWidth="1.5" />
          {/* Front face */}
          <rect x={x} y={y} width={w} height={h} rx="2"
            fill={color} opacity={0.2 + order * 0.08} stroke={color} strokeWidth="1.5" />
          {/* Right face */}
          <polygon
            points={`${x+w},${y} ${x+w+30},${y-20} ${x+w+30},${y+h-20} ${x+w},${y+h}`}
            fill={color} opacity={0.15 + order * 0.05} stroke={color} strokeWidth="1.5" />
        </g>
      );
    })}
    {/* HCL code */}
    <rect x="55" y="255" width="290" height="90" rx="12" fill={`${color}15`} stroke={`${color}30`} strokeWidth="1.5" />
    <text x="75" y="278" fill={color} fontSize="11" fontFamily="monospace" opacity="0.7">resource "aws_instance" "web" {"{"}</text>
    <text x="90" y="298" fill={color} fontSize="11" fontFamily="monospace" opacity="0.55">  ami = "ami-0abcdef"</text>
    <text x="90" y="316" fill={color} fontSize="11" fontFamily="monospace" opacity="0.55">  instance_type = "t3.micro"</text>
    <text x="75" y="334" fill={color} fontSize="11" fontFamily="monospace" opacity="0.7">{"}"}</text>
  </svg>
);

/** Nginx — N letter with server traffic layers */
const Nginx: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("nxg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#nxg)" />
    {/* N letterform */}
    <path d="M80,320 L80,80 L260,320 L260,80"
      fill="none" stroke={color} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
    {/* Server shield overlay */}
    <path d="M290,70 L360,100 L360,210 C360,260 325,300 290,320 C255,300 220,260 220,210 L220,100 Z"
      fill={`${color}18`} stroke={color} strokeWidth="2" />
    {/* Traffic arrows */}
    {[0,1,2].map(i => (
      <g key={i}>
        <line x1="18" y1={140 + i*50} x2="72" y2={155 + i*50}
          stroke={color} strokeWidth="3" opacity={0.5 - i*0.1} />
        <polygon points={`72,${151+i*50} 79,${155+i*50} 72,${159+i*50}`} fill={color} opacity={0.5 - i*0.1} />
      </g>
    ))}
    {/* Performance badge */}
    <rect x="228" y="165" width="120" height="50" rx="10" fill={color} opacity="0.85" />
    <text x="288" y="188" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="monospace">100K rps</text>
    <text x="288" y="206" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="11" fontFamily="monospace">Load Balance</text>
  </svg>
);

/** Linux — Penguin (Tux) from circles */
const Linux: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("lxg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#lxg)" />
    {/* Body */}
    <ellipse cx="200" cy="250" rx="85" ry="105" fill={`${color}35`} stroke={color} strokeWidth="3" />
    {/* White belly */}
    <ellipse cx="200" cy="270" rx="52" ry="72" fill="white" opacity="0.18" />
    {/* Head */}
    <circle cx="200" cy="140" r="72" fill={`${color}35`} stroke={color} strokeWidth="3" />
    {/* Eyes */}
    <circle cx="176" cy="128" r="20" fill="white" opacity="0.85" />
    <circle cx="224" cy="128" r="20" fill="white" opacity="0.85" />
    <circle cx="176" cy="128" r="10" fill={color} />
    <circle cx="224" cy="128" r="10" fill={color} />
    {/* Pupils glint */}
    <circle cx="179" cy="125" r="4" fill="white" opacity="0.8" />
    <circle cx="227" cy="125" r="4" fill="white" opacity="0.8" />
    {/* Beak */}
    <ellipse cx="200" cy="165" rx="22" ry="14" fill={color} opacity="0.9" />
    {/* Wings */}
    <ellipse cx="115" cy="260" rx="30" ry="60" fill={`${color}30`} stroke={color} strokeWidth="2" transform="rotate(-15 115 260)" />
    <ellipse cx="285" cy="260" rx="30" ry="60" fill={`${color}30`} stroke={color} strokeWidth="2" transform="rotate(15 285 260)" />
    {/* Feet */}
    <ellipse cx="172" cy="345" rx="25" ry="12" fill={color} opacity="0.7" transform="rotate(-10 172 345)" />
    <ellipse cx="228" cy="345" rx="25" ry="12" fill={color} opacity="0.7" transform="rotate(10 228 345)" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════
// FALLBACK — category-based unique designs
// ═══════════════════════════════════════════════════════════════

/** Generic Frontend fallback */
const FallbackFrontend: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("ffg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#ffg)" />
    <rect x="60" y="85" width="280" height="200" rx="18" fill={`${color}15`} stroke={color} strokeWidth="2.5" />
    <rect x="60" y="85" width="280" height="36" rx="14" fill={`${color}25`} />
    {[0,1,2].map(i => <circle key={i} cx={90 + i*22} cy={103} r="7" fill={color} opacity={0.6 - i*0.1} />)}
    {[0,1,2,3].map(i => (
      <rect key={i} x={78} y={138 + i*38} width={130+Math.random()*50} height="20" rx="10" fill={color} opacity={0.2 + i*0.05} />
    ))}
    <rect x="220" y="145" width="105" height="115" rx="12" fill={`${color}20`} stroke={color} strokeWidth="1.5" />
    <rect x="60" y="285" width="280" height="36" rx="18" fill={`${color}20`} stroke={color} strokeWidth="1.5" />
  </svg>
);

/** Generic Backend fallback */
const FallbackBackend: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("fbk", color)}
    <circle cx="200" cy="200" r="195" fill="url(#fbk)" />
    {[0,1,2].map(i => (
      <g key={i}>
        <rect x="80" y={80 + i*90} width="240" height="70" rx="14" fill={`${color}${['20','18','15'][i]}`} stroke={color} strokeWidth="2" />
        <rect x="90" y={90 + i*90} width="16" height="50" rx="8" fill={color} opacity={0.5 - i*0.05} />
        {[0,1,2,3].map(j => (
          <rect key={j} x="118" y={97 + i*90 + j*13} width={80 + j*20} height="8" rx="4" fill={color} opacity={0.2 + j*0.04} />
        ))}
      </g>
    ))}
    <line x1="300" y1="115" x2="300" y2="200" stroke={color} strokeWidth="1.5" opacity="0.3" strokeDasharray="5 4" />
    <line x1="300" y1="200" x2="300" y2="295" stroke={color} strokeWidth="1.5" opacity="0.3" strokeDasharray="5 4" />
  </svg>
);

/** Generic Mobile fallback */
const FallbackMobile: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("fmg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#fmg)" />
    <rect x="130" y="60" width="140" height="280" rx="26" fill={`${color}15`} stroke={color} strokeWidth="3" />
    <rect x="143" y="78" width="114" height="224" rx="18" fill={`${color}10`} stroke={color} strokeWidth="1.5" />
    <rect x="170" y="66" width="60" height="8" rx="4" fill={color} opacity="0.3" />
    <rect x="166" y="318" width="68" height="6" rx="3" fill={color} opacity="0.4" />
    {[0,1,2].map(i => (
      <rect key={i} x="160" y={105 + i*65} width="80" height="50" rx="10" fill={color} opacity={0.15 + i*0.04} stroke={color} strokeWidth="1" />
    ))}
  </svg>
);

/** Generic Database fallback */
const FallbackDB: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("fdbg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#fdbg)" />
    {[0,1,2,3].map(i => (
      <g key={i}>
        <ellipse cx="200" cy={85 + i*70} rx="120" ry="30" fill={`${color}${['25','22','18','15'][i]}`} stroke={color} strokeWidth="2" />
        <rect x="80" y={85 + i*70} width="240" height="50" fill={`${color}${['15','12','10','08'][i]}`} stroke={color} strokeWidth="2" />
        <ellipse cx="200" cy={135 + i*70} rx="120" ry="30" fill={`${color}${['20','17','14','11'][i]}`} stroke={color} strokeWidth="2" />
      </g>
    ))}
  </svg>
);

/** Generic DevOps fallback */
const FallbackDevOps: React.FC<IllProps> = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {bgGrad("fdvg", color)}
    <circle cx="200" cy="200" r="195" fill="url(#fdvg)" />
    {/* Infinity loop / DevOps cycle */}
    <path d="M100,200 C100,140 145,110 200,140 C255,170 300,140 300,200 C300,260 255,290 200,260 C145,230 100,260 100,200Z"
      fill="none" stroke={color} strokeWidth="10" opacity="0.7" />
    {[50,150,250,350].map((x,i) => (
      <circle key={i} cx={x} cy={200 + (i%2 ? -40 : 40)} r="16" fill={color} opacity={0.6 - i*0.05} />
    ))}
    {['Plan','Code','Build','Deploy'].map((label,i) => (
      <text key={i} x={50+i*100} y={200+(i%2 ? -60 : 64)} textAnchor="middle"
        fill={color} fontSize="11" fontFamily="monospace" opacity="0.6">{label}</text>
    ))}
  </svg>
);

// ═══════════════════════════════════════════════════════════════
// ILLUSTRATION MAP
// ═══════════════════════════════════════════════════════════════

const illustrationMap: Record<string, React.FC<IllProps>> = {
  'html5': Html5,
  'css3': Css3,
  'javascript': Javascript,
  'typescript': Typescript,
  'react': ReactIll,
  'nextjs': Nextjs,
  'vuejs': Vuejs,
  'angular': Angular,
  'svelte': Svelte,
  'tailwind': Tailwind,
  'sass': Sass,
  'nodejs': Nodejs,
  'express': Express,
  'python': Python,
  'django': Django,
  'flask': Flask,
  'java': Java,
  'spring': Spring,
  'php': Php,
  'laravel': Laravel,
  'go': Go,
  'ruby': Ruby,
  'react-native': ReactNative,
  'flutter': Flutter,
  'dart': Dart,
  'kotlin': Kotlin,
  'swift': Swift,
  'android': AndroidIll,
  'ios': IosIll,
  'ionic': Ionic,
  'mongodb': Mongodb,
  'postgresql': Postgresql,
  'mysql': Mysql,
  'redis': Redis,
  'firebase': Firebase,
  'sqlite': Sqlite,
  'graphql': Graphql,
  'docker': Docker,
  'kubernetes': Kubernetes,
  'aws': Aws,
  'google-cloud': GoogleCloud,
  'vercel': Vercel,
  'netlify': Netlify,
  'github-actions': GithubActions,
  'gitlab': Gitlab,
  'terraform': Terraform,
  'nginx': Nginx,
  'linux': Linux,
};

// Category fallbacks
const categoryFallbacks: Record<string, React.FC<IllProps>> = {
  'Web Frontend': FallbackFrontend,
  'Web Backend': FallbackBackend,
  'Mobile Development': FallbackMobile,
  'Databases': FallbackDB,
  'Cloud & DevOps': FallbackDevOps,
};

// ═══════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════

interface TechIllustrationProps {
  slug: string;
  color: string;
  category?: string;
  size?: number;
  className?: string;
}

export const TechIllustration: React.FC<TechIllustrationProps> = ({
  slug,
  color,
  category = '',
  className = '',
}) => {
  const Illustration =
    illustrationMap[slug] ??
    categoryFallbacks[category] ??
    FallbackDevOps;

  return (
    <div className={className} aria-hidden="true">
      <Illustration color={color} />
    </div>
  );
};

export default TechIllustration;
