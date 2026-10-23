// All text + data for Kerbcode Studio (fictional, concept website). Prices are SAMPLE prices.
export const IMG = (n: string) => `/images/kerbcode/${n}${n === "fabric-macro" ? "" : "-cut"}.webp`;
export const PLINTH = "/images/kerbcode/kerb-plinth.png";

export const NAV = [
  { href: "#lineup", label: "Line-up" },
  { href: "#product", label: "Hoodie" },
  { href: "#print", label: "The print" },
  { href: "#night", label: "Night drop" },
  { href: "#shop", label: "Shop" },
  { href: "#join", label: "Join" },
];

export const PIECES = [
  { id: "hoodie", name: "Drop 07 Hoodie", word: "HOODIE", price: 4990, front: "hoodie-front", back: "hoodie-back", note: "480 GSM brushed fleece. Boxy, dropped shoulder." },
  { id: "puffer", name: "Kerb Puffer", word: "PUFFER", price: 8990, front: "puffer-front", back: "puffer-back", note: "Matte shell, wide baffles, high collar." },
  { id: "tee", name: "Heavy Tee", word: "TEE", price: 1990, front: "tee-front", back: "tee-back", note: "260 GSM cotton. Thick rib neck." },
  { id: "cargo", name: "Wide Cargo", word: "CARGO", price: 4490, front: "cargo-front", back: "cargo-back", note: "Cotton twill, deep thigh pockets." },
  { id: "cap", name: "Six-Panel Cap", word: "CAP", price: 1290, front: "cap-front", back: null, note: "Washed twill. One size, curved brim." },
  { id: "socks", name: "Rib Socks", word: "SOCKS", price: 690, front: "socks-front", back: null, note: "Tall rib crew. Two pairs a pack." },
] as const;

export const COLOURWAYS = [
  { id: "ink", name: "Ink", hex: "#141516", img: "hoodie-front" },
  { id: "ember", name: "Ember", hex: "#EC6A2C", img: "hoodie-ember" },
  { id: "chalk", name: "Chalk", hex: "#F6F6F4", img: "hoodie-chalk" },
  { id: "navy", name: "Navy", hex: "#1B2537", img: "hoodie-navy" },
  { id: "teal", name: "Teal", hex: "#2F5A5E", img: "hoodie-teal" },
] as const;

export const SIZES = ["S", "M", "L", "XL"] as const;

export const NIGHT_SLOTS = [
  { name: "Drop 07 Hoodie", front: "hoodie-front", back: "hoodie-back", flat: "#141516" },
  { name: "Kerb Puffer", front: "puffer-front", back: "puffer-back", flat: "#1a1b1d" },
  { name: "Heavy Tee", front: "tee-front", back: "tee-back", flat: "#15171a" },
  { name: "Wide Cargo", front: "cargo-front", back: "cargo-back", flat: "#3A3C40" },
  { name: "Six-Panel Cap", front: "cap-front", back: null, flat: "#B81F25" },
  { name: "Rib Socks", front: "socks-front", back: null, flat: "#E9EDEF" },
  { name: "Heavy Tee Chalk", front: "tee-chalk", back: "tee-back", flat: "#E9EDEF" },
] as const;

export const SHOP = [
  { name: "Drop 07 Hoodie", sub: "Ink", price: 4990, front: "hoodie-front", back: "hoodie-back" },
  { name: "Kerb Puffer", sub: "Ink", price: 8990, front: "puffer-front", back: "puffer-back" },
  { name: "Heavy Tee", sub: "Ink", price: 1990, front: "tee-front", back: "tee-back" },
  { name: "Wide Cargo", sub: "Charcoal", price: 4490, front: "cargo-front", back: "cargo-back" },
  { name: "Drop 07 Hoodie", sub: "Ember", price: 4990, front: "hoodie-ember", back: null },
  { name: "Drop 07 Hoodie", sub: "Chalk", price: 4990, front: "hoodie-chalk", back: null },
  { name: "Drop 07 Hoodie", sub: "Navy", price: 4990, front: "hoodie-navy", back: null },
  { name: "Drop 07 Hoodie", sub: "Teal", price: 4990, front: "hoodie-teal", back: null },
] as const;

export const ALSO = [
  { name: "Kerb Puffer", price: 8990, img: "puffer-front", stars: 5, back: "puffer-back" },
  { name: "Heavy Tee", price: 1990, img: "tee-front", stars: 4, back: "tee-back" },
  { name: "Wide Cargo", price: 4490, img: "cargo-front", stars: 5, back: "cargo-back" },
  { name: "Six-Panel Cap", price: 1290, img: "cap-front", stars: 4, back: null },
] as const;

// data-look = "x,y,rot" (px from the look's centre, degrees)
export const LOOKS = [
  {
    name: "Night shift", pieces: [
      { id: "hoodie", name: "Drop 07 Hoodie", price: 4990, img: "hoodie-front", look: "-170,-30,-6" },
      { id: "cargo", name: "Wide Cargo", price: 4490, img: "cargo-front", look: "40,30,4" },
      { id: "cap", name: "Six-Panel Cap", price: 1290, img: "cap-front", look: "250,-90,9" },
    ],
  },
  {
    name: "Kerb walk", pieces: [
      { id: "puffer", name: "Kerb Puffer", price: 8990, img: "puffer-front", look: "-190,-60,5" },
      { id: "tee", name: "Heavy Tee", price: 1990, img: "tee-front", look: "20,40,-4" },
      { id: "socks", name: "Rib Socks", price: 690, img: "socks-front", look: "230,-70,-8" },
    ],
  },
] as const;

export const FIT = {
  S: { chest: 58, length: 68, sleeve: 62 },
  M: { chest: 61, length: 70, sleeve: 64 },
  L: { chest: 64, length: 72, sleeve: 66 },
  XL: { chest: 67, length: 74, sleeve: 68 },
} as const;

export const PAST = [
  { drop: "Drop 06", name: "Slate Puffer", img: "puffer-front", price: 8490 },
  { drop: "Drop 05", name: "Ember Hoodie", img: "hoodie-ember", price: 4790 },
  { drop: "Drop 05", name: "Chalk Tee", img: "tee-chalk", price: 1890 },
  { drop: "Drop 04", name: "Kerb Cargo", img: "cargo-front", price: 4290 },
  { drop: "Drop 04", name: "Teal Hoodie", img: "hoodie-teal", price: 4790 },
  { drop: "Drop 03", name: "Red Cap", img: "cap-front", price: 1190 },
  { drop: "Drop 03", name: "Navy Hoodie", img: "hoodie-navy", price: 4690 },
  { drop: "Drop 02", name: "Rib Socks", img: "socks-front", price: 590 },
] as const;

export const FABRIC = [
  { id: "weight", label: "480 GSM", sub: "brushed fleece", x: 0.36, y: 0.34, side: "l" },
  { id: "rib", label: "2×2 rib", sub: "cuff + hem", x: 0.78, y: 0.28, side: "r" },
  { id: "stitch", label: "Flatlock", sub: "seams, no bulk", x: 0.52, y: 0.66, side: "r" },
  { id: "hood", label: "Double hood", sub: "lined, drawcords", x: 0.2, y: 0.74, side: "l" },
] as const;

export const DROP_DATE = new Date("2026-12-05T20:00:00+05:30");

export const inrNote = (n: number) => "MRP ₹" + n.toLocaleString("en-IN") + " · sample";
export const inrS = (n: number) => "₹" + n.toLocaleString("en-IN");
