/**
 * My Hero Academia (One-For-All) Multi-Layer Sound & Soundtrack Engine
 *
 * Combines 3 dedicated 44.1kHz stereo audio tracks in /public/audio/ with
 * real-time Web Audio API bio-electric synthesis:
 *   1. /audio/mha-hero-ost.wav       — My Hero Academia ("You Say Run / Plus Ultra"-inspired) background soundtrack loop
 *   2. /audio/normal-cowling.wav     — Normal Mode (5% Full-Cowling) emerald activation chime & calm bio-electric hum
 *   3. /audio/rage-100-overdrive.wav — Rage Mode (100% One-For-All / Super-Saiyan Overdrive) shockwave, battle roar & lightning blast
 */
class TacticalAudioService {
  private ctx: AudioContext | null = null;
  private enabled = true;
  private rageMode = false;

  private bgmAudio: HTMLAudioElement | null = null;
  private normalAudio: HTMLAudioElement | null = null;
  private rageAudio: HTMLAudioElement | null = null;

  // Real-time continuous aura & lightning crackle timer
  private auraOsc1: OscillatorNode | null = null;
  private auraOsc2: OscillatorNode | null = null;
  private auraLfo: OscillatorNode | null = null;
  private auraGain: GainNode | null = null;
  private crackleTimer: number | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.preloadAudioElements();
    }
  }

  private preloadAudioElements(): void {
    if (typeof window === 'undefined' || this.bgmAudio) return;

    this.bgmAudio = new Audio('/audio/mha-hero-ost.wav');
    this.bgmAudio.loop = true;
    this.bgmAudio.preload = 'auto';
    this.bgmAudio.volume = 0.34;

    this.normalAudio = new Audio('/audio/normal-cowling.wav');
    this.normalAudio.preload = 'auto';
    this.normalAudio.volume = 0.72;

    this.rageAudio = new Audio('/audio/rage-100-overdrive.wav');
    this.rageAudio.preload = 'auto';
    this.rageAudio.volume = 0.88;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(next: boolean): void {
    this.enabled = next;
    this.preloadAudioElements();

    if (next) {
      this.initContext();
      this.startBackgroundMusic();
      this.startContinuousAura();
      if (this.rageMode) {
        this.playRageModeSound();
      } else {
        this.playNormalModeSound();
      }
    } else {
      this.stopAllAudio();
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public startBackgroundMusic(): void {
    if (!this.enabled) return;
    this.preloadAudioElements();
    if (!this.bgmAudio) return;

    this.bgmAudio.volume = this.rageMode ? 0.48 : 0.34;
    this.bgmAudio.playbackRate = this.rageMode ? 1.05 : 1.0;
    if (this.bgmAudio.paused) {
      this.bgmAudio.play().catch(() => {});
    }
  }

  private stopAllAudio(): void {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
    }
    if (this.normalAudio) {
      this.normalAudio.pause();
      this.normalAudio.currentTime = 0;
    }
    if (this.rageAudio) {
      this.rageAudio.pause();
      this.rageAudio.currentTime = 0;
    }
    this.stopContinuousAura();
  }

  /**
   * Plays the Normal Mode (5% Full-Cowling) sound effect and sets ambient BGM + aura to Normal state.
   */
  public playNormalModeSound(): void {
    this.rageMode = false;
    if (!this.enabled) return;

    this.preloadAudioElements();
    this.initContext();
    this.startBackgroundMusic();
    this.startContinuousAura();
    this.updateAuraProfile(false);

    if (this.rageAudio) {
      this.rageAudio.pause();
      this.rageAudio.currentTime = 0;
    }

    if (this.normalAudio) {
      this.normalAudio.currentTime = 0;
      this.normalAudio.volume = 0.72;
      this.normalAudio.play().catch(() => {});
    }

    this.playSurgeChime();
  }

  /**
   * Plays the 100% Rage Mode (Super-Saiyan / One-For-All Overdrive) transformation roar,
   * shockwave blast, and shifts the MHA soundtrack + continuous lightning arcs into overdrive.
   */
  public playRageModeSound(): void {
    this.rageMode = true;
    if (!this.enabled) return;

    this.preloadAudioElements();
    this.initContext();
    this.startBackgroundMusic();
    this.startContinuousAura();
    this.updateAuraProfile(true);

    if (this.normalAudio) {
      this.normalAudio.pause();
      this.normalAudio.currentTime = 0;
    }

    if (this.rageAudio) {
      this.rageAudio.currentTime = 0;
      this.rageAudio.volume = 0.9;
      this.rageAudio.play().catch(() => {});
    }

    this.playRageSynthShockwave();
  }

  /**
   * Starts the continuous Web Audio API bio-electric aura hum and periodic lightning crackles
   * that distinguish Normal Mode (calm 5% Full-Cowling) from Rage Mode (intense 100% Overdrive).
   */
  private startContinuousAura(): void {
    const ctx = this.initContext();
    if (!ctx) return;

    if (!this.auraGain) {
      const now = ctx.currentTime;
      this.auraOsc1 = ctx.createOscillator();
      this.auraOsc2 = ctx.createOscillator();
      this.auraLfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      this.auraGain = ctx.createGain();

      this.auraOsc1.type = 'sine';
      this.auraOsc2.type = 'triangle';
      this.auraLfo.type = 'sine';

      this.auraOsc1.frequency.setValueAtTime(82.41, now); // E2
      this.auraOsc2.frequency.setValueAtTime(164.81, now); // E3
      this.auraLfo.frequency.setValueAtTime(4.0, now);
      lfoGain.gain.setValueAtTime(14, now);

      this.auraGain.gain.setValueAtTime(this.rageMode ? 0.048 : 0.015, now);

      this.auraLfo.connect(lfoGain);
      lfoGain.connect(this.auraOsc2.frequency);

      this.auraOsc1.connect(this.auraGain);
      this.auraOsc2.connect(this.auraGain);
      this.auraGain.connect(ctx.destination);

      this.auraOsc1.start(now);
      this.auraOsc2.start(now);
      this.auraLfo.start(now);
    }

    if (this.crackleTimer === null && typeof window !== 'undefined') {
      this.crackleTimer = window.setInterval(() => {
        if (!this.enabled) return;
        if (this.rageMode) {
          // Frequent high-voltage lightning discharges during 100% Rage Mode
          this.playLightningArc(0.055);
        } else if (Math.random() < 0.45) {
          // Gentle emerald bio-electric spark in Normal Mode
          this.playLightningArc(0.018);
        }
      }, 650);
    }
  }

  private updateAuraProfile(isRage: boolean): void {
    const ctx = this.initContext();
    if (!ctx || !this.auraGain || !this.auraOsc1 || !this.auraOsc2 || !this.auraLfo) return;

    const now = ctx.currentTime;
    if (isRage) {
      this.auraOsc1.frequency.exponentialRampToValueAtTime(55.0, now + 0.18); // Deep A1 overdrive sub
      this.auraOsc2.frequency.exponentialRampToValueAtTime(220.0, now + 0.18);
      this.auraLfo.frequency.exponentialRampToValueAtTime(12.5, now + 0.18);
      this.auraGain.gain.exponentialRampToValueAtTime(0.052, now + 0.18);
    } else {
      this.auraOsc1.frequency.exponentialRampToValueAtTime(82.41, now + 0.25); // Calm E2 Full-Cowling
      this.auraOsc2.frequency.exponentialRampToValueAtTime(164.81, now + 0.25);
      this.auraLfo.frequency.exponentialRampToValueAtTime(3.8, now + 0.25);
      this.auraGain.gain.exponentialRampToValueAtTime(0.015, now + 0.25);
    }
  }

  private stopContinuousAura(): void {
    if (this.crackleTimer !== null && typeof window !== 'undefined') {
      window.clearInterval(this.crackleTimer);
      this.crackleTimer = null;
    }
    try {
      this.auraOsc1?.stop();
      this.auraOsc2?.stop();
      this.auraLfo?.stop();
      this.auraOsc1?.disconnect();
      this.auraOsc2?.disconnect();
      this.auraLfo?.disconnect();
      this.auraGain?.disconnect();
    } catch {
      // Ignore if already stopped
    }
    this.auraOsc1 = null;
    this.auraOsc2 = null;
    this.auraLfo = null;
    this.auraGain = null;
  }

  private playLightningArc(intensity: number): void {
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    const startFreq = 1600 + Math.random() * 1400;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(280 + Math.random() * 240, now + 0.065);

    gain.gain.setValueAtTime(intensity, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.075);
  }

  private playRageSynthShockwave(): void {
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Sub-bass impact drop + heroic rising power fifths
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(130, now);
    subOsc.frequency.exponentialRampToValueAtTime(36, now + 0.45);
    subGain.gain.setValueAtTime(0.14, now);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.52);

    const powerNotes = [220, 329.63, 440, 659.25, 880];
    powerNotes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq * 0.85, now + idx * 0.035);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.25, now + idx * 0.035 + 0.35);

      gain.gain.setValueAtTime(0.032, now + idx * 0.035);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.035 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.035);
      osc.stop(now + idx * 0.035 + 0.42);
    });
  }

  public playClick(): void {
    if (!this.enabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1420, now + 0.045);

    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.055);
  }

  public playHover(): void {
    if (!this.enabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(690, now + 0.03);

    gain.gain.setValueAtTime(0.015, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  public playSurgeChime(): void {
    if (!this.enabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [329.63, 440, 659.25, 880];

    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f, now + idx * 0.045);
      osc.frequency.exponentialRampToValueAtTime(f * 1.12, now + idx * 0.045 + 0.24);

      gain.gain.setValueAtTime(0.03, now + idx * 0.045);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.045 + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.045);
      osc.stop(now + idx * 0.045 + 0.3);
    });
  }

  public playDoorOpen(): void {
    if (!this.enabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Pneumatic release low puff
    const puffOsc = ctx.createOscillator();
    const puffGain = ctx.createGain();
    puffOsc.type = 'sine';
    puffOsc.frequency.setValueAtTime(140, now);
    puffOsc.frequency.exponentialRampToValueAtTime(50, now + 0.35);
    puffGain.gain.setValueAtTime(0.06, now);
    puffGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
    puffOsc.connect(puffGain);
    puffGain.connect(ctx.destination);
    puffOsc.start(now);
    puffOsc.stop(now + 0.4);

    // High mechanical door sliding chime
    [440, 659.25, 880, 1174.66].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, now + i * 0.06 + 0.32);

      gain.gain.setValueAtTime(0.04, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.38);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.4);
    });
  }
}

export const audioService = new TacticalAudioService();
