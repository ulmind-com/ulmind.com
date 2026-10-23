import meta from "../cut.json";

export const CUT = (n: string) => `/images/kerbcode/${n}-cut.webp`;
type M = { cx: number; bt: number; bw: number };
export const cutMeta = (n: string): M => (meta as Record<string, M>)[n] ?? { cx: 0.5, bt: 0.82, bw: 0.5 };

/** A cut-out garment with a soft contact shadow under it. */
export default function Cut({ n, alt = "", className = "" }: { n: string; alt?: string; className?: string }) {
  const m = cutMeta(n);
  return (
    <span className={`cut ${className}`} style={{ ["--cx" as string]: `${m.cx * 100}%`, ["--bt" as string]: `${m.bt * 100}%`, ["--bw" as string]: `${m.bw * 100}%` }}>
      <img src={CUT(n)} alt={alt} draggable={false} />
    </span>
  );
}
