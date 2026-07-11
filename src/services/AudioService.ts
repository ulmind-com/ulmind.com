import { Howl, Howler } from 'howler';

export class AudioService {
  private static instance: AudioService;
  private isMuted: boolean = false;

  private constructor() {
    const savedMute = localStorage.getItem("ulmind_audio_muted");
    if (savedMute) {
      this.isMuted = savedMute === "true";
      Howler.mute(this.isMuted);
    }
  }

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem("ulmind_audio_muted", String(this.isMuted));
    Howler.mute(this.isMuted);
    return this.isMuted;
  }

  public getIsMuted() {
    return this.isMuted;
  }

  // Synthesized beep for QR success
  public playAccessBeep() {
    if (this.isMuted) return;
    this.playOscillatorTone(600, "sine", 0.1, 0.2);
    setTimeout(() => this.playOscillatorTone(800, "sine", 0.15, 0.2), 100);
  }

  // Synthesized mechanical unlock
  public playUnlockSound() {
    if (this.isMuted) return;
    this.playOscillatorTone(100, "square", 0.1, 0.5);
    setTimeout(() => this.playOscillatorTone(150, "triangle", 0.1, 0.5), 100);
    setTimeout(() => this.playOscillatorTone(80, "square", 0.2, 0.5), 200);
  }

  // Synthesized heavy door opening rumble
  public playDoorOpen() {
    if (this.isMuted) return;
    const ctx = Howler.ctx;
    if (!ctx) return;
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(40, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 2);
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.5);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.5);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 2.5);
  }
  
  // Ambient office noise (pink noise simulation)
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;

  public startAmbientOffice() {
    if (this.isMuted) return;
    const ctx = Howler.ctx;
    if (!ctx) return;

    if (this.ambientOsc) return; // Already playing

    this.ambientOsc = ctx.createOscillator();
    this.ambientGain = ctx.createGain();

    // Using a low frequency sine wave combined with some modulation to simulate AC/Airflow hum
    this.ambientOsc.type = "sine";
    this.ambientOsc.frequency.setValueAtTime(55, ctx.currentTime);
    
    this.ambientGain.gain.setValueAtTime(0, ctx.currentTime);
    this.ambientGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2); // fade in

    this.ambientOsc.connect(this.ambientGain);
    this.ambientGain.connect(ctx.destination);

    this.ambientOsc.start();
  }

  public stopAmbientOffice() {
    if (this.ambientGain && this.ambientOsc && Howler.ctx) {
      const ctx = Howler.ctx;
      this.ambientGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
      setTimeout(() => {
        this.ambientOsc?.stop();
        this.ambientOsc = null;
        this.ambientGain = null;
      }, 1000);
    }
  }

  private playOscillatorTone(freq: number, type: OscillatorType, duration: number, volume: number) {
    const ctx = Howler.ctx;
    if (!ctx) return;
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = type;
    osc.frequency.value = freq;
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }
}

export const audioService = AudioService.getInstance();
