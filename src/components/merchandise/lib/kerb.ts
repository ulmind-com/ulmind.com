let lifted = true;
export const kerb = {
  get lifted() { return lifted; },
  lift() { lifted = true; if (typeof window !== "undefined") window.dispatchEvent(new Event("kerb:lift")); },
};
export function onKerbLift(fn: () => void) {
  if (lifted) {
    const timer = setTimeout(fn, 20);
    return () => clearTimeout(timer);
  }
  const h = () => fn();
  if (typeof window !== "undefined") {
    window.addEventListener("kerb:lift", h, { once: true });
    return () => window.removeEventListener("kerb:lift", h);
  }
  return () => {};
}

// ---- hero film: 192 WebP frames (hero-turn.mp4 → public/frames/kerbcode-turn) ----
export const FILM = { n: 192, w: 620, h: 828, fps: 24 };
const film: { frames: HTMLImageElement[]; ok: boolean | null; p: Promise<boolean> | null } = { frames: [], ok: null, p: null };
export const filmUrl = (i: number) => `/frames/kerbcode-turn/f${String(i + 1).padStart(3, "0")}.webp`;
export function getFilm() { return film; }
/** Loads the frames (first one decides ok/failed → hero falls back to the 3D flip). Cached. */
export function loadFilm(onProgress?: (p: number) => void, only1 = false): Promise<boolean> {
  if (film.p && !only1) return film.p;
  const count = only1 ? 1 : FILM.n;
  const run = new Promise<boolean>((resolve) => {
    let done = 0;
    const first = new Image();
    first.onerror = () => {
      film.ok = false;
      onProgress?.(1);
      resolve(false);
    };
    first.onload = () => {
      film.ok = true;
      film.frames[0] = first;
      done = 1;
      onProgress?.(done / count);
      // Immediately resolve true so the Hero canvas displays frame 0 without waiting for 192 images!
      resolve(true);

      if (count === 1) return;

      const order: number[] = [];
      for (let i = 8; i < FILM.n; i += 8) order.push(i);
      for (let i = 1; i < FILM.n; i++) if (i % 8) order.push(i);
      let busy = 0, k = 0;
      const pump = () => {
        while (busy < 8 && k < order.length) {
          const idx = order[k++];
          busy++;
          const im = new Image();
          const fin = () => {
            busy--;
            done++;
            film.frames[idx] = im;
            onProgress?.(done / count);
            pump();
          };
          im.onload = fin;
          im.onerror = fin;
          im.src = filmUrl(idx);
        }
      };
      pump();
    };
    first.src = filmUrl(0);
  });
  if (!only1) film.p = run;
  return run;
}
