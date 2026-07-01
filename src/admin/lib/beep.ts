/* ──────────────────────────────────────────────────────────────
   Beep Sound — Web Audio API Utility
   Generates a satisfying beep sound on QR scan success
   ────────────────────────────────────────────────────────────── */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

/**
 * Play a success beep sound (like a card reader)
 */
export function playBeep(frequency = 1200, duration = 0.15, volume = 0.3) {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn("Beep sound failed:", e);
  }
}

/**
 * Play a double beep for successful QR scan (like door access)
 */
export function playSuccessBeep() {
  playBeep(1000, 0.1, 0.4);
  setTimeout(() => playBeep(1400, 0.15, 0.4), 120);
}

/**
 * Play an error beep
 */
export function playErrorBeep() {
  playBeep(300, 0.3, 0.3);
}

/**
 * Play a notification/alert sound
 */
export function playAlertBeep() {
  playBeep(800, 0.08, 0.2);
  setTimeout(() => playBeep(1000, 0.08, 0.2), 100);
  setTimeout(() => playBeep(1200, 0.12, 0.2), 200);
}
