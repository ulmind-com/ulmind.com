export class SpeechService {
  private static instance: SpeechService;
  private synth: SpeechSynthesis;
  private voice: SpeechSynthesisVoice | null = null;
  private isMuted: boolean = false;

  private constructor() {
    this.synth = window.speechSynthesis;
    this.initVoice();
    
    // Voices might load asynchronously
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = this.initVoice.bind(this);
    }

    // Load user preference for mute
    const savedMute = localStorage.getItem("ulmind_audio_muted");
    if (savedMute) {
      this.isMuted = savedMute === "true";
    }
  }

  public static getInstance(): SpeechService {
    if (!SpeechService.instance) {
      SpeechService.instance = new SpeechService();
    }
    return SpeechService.instance;
  }

  private initVoice() {
    const voices = this.synth.getVoices();
    if (voices.length === 0) return;

    // Prefer high quality Google female English voices, or Siri, or any female voice
    const preferredVoices = [
      "Google US English", // usually high quality female
      "Samantha", // Mac
      "Victoria", // Mac
      "Microsoft Zira", // Windows
    ];

    for (const name of preferredVoices) {
      const match = voices.find(v => v.name.includes(name) && v.lang.startsWith("en"));
      if (match) {
        this.voice = match;
        return;
      }
    }

    // Fallback: any female English voice
    const femaleVoice = voices.find(v => (v.name.includes("Female") || v.name.includes("Woman")) && v.lang.startsWith("en"));
    if (femaleVoice) {
      this.voice = femaleVoice;
      return;
    }

    // Last resort: First English voice
    this.voice = voices.find(v => v.lang.startsWith("en")) || voices[0];
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem("ulmind_audio_muted", String(this.isMuted));
    if (this.isMuted) {
      this.synth.cancel();
    }
    return this.isMuted;
  }

  public getIsMuted() {
    return this.isMuted;
  }

  public speak(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (this.isMuted || !this.synth) {
        resolve();
        return;
      }

      this.synth.cancel(); // Cancel any ongoing speech

      const utterance = new SpeechSynthesisUtterance(text);
      if (this.voice) {
        utterance.voice = this.voice;
      }
      
      utterance.pitch = 1.0;
      utterance.rate = 0.95; // Slightly slower for professional tone
      utterance.volume = 1.0;

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve(); // Resolve anyway on error to not block timeline

      this.synth.speak(utterance);
    });
  }
}

export const speechService = SpeechService.getInstance();
