// Web Audio API Medical Synthesizer & Speech Narration Engine
// 100% offline, zero external audio asset dependencies, low latency on all devices

class AudioEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private bgmEnabled: boolean = false;
  private bgmIntervalId: number | null = null;
  private currentLanguage: 'id' | 'en' = 'id';
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private isSpeakingState: boolean = false;
  private currentSpokenText: string = '';
  private autoNarrationEnabled: boolean = true;
  private speakingListeners: Set<(isSpeaking: boolean, text: string) => void> = new Set();
  private currentSpeechAudio: HTMLAudioElement | null = null;

  constructor() {
    this.initVoices();
  }

  // One-time user touch gesture audio unlocker for iOS Safari & Android mobile/tablets
  public unlockAudio() {
    this.initCtx();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    if (this.ctx) {
      try {
        const buffer = this.ctx.createBuffer(1, 1, 22050);
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(this.ctx.destination);
        source.start(0);
      } catch {}
    }
    try {
      const silentAudio = new Audio();
      silentAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
      silentAudio.volume = 0.01;
      silentAudio.play().then(() => silentAudio.pause()).catch(() => {});
    } catch {}
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
      } catch {}
    }
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private initVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const load = () => {
        try {
          const voices = window.speechSynthesis.getVoices();
          if (!voices || voices.length === 0) return;
          const idVoice = voices.find(v => {
            const l = (v.lang || '').toLowerCase();
            const n = (v.name || '').toLowerCase();
            return l.startsWith('id') || l.includes('id-') || l.includes('_id') || n.includes('indonesia') || n.includes('damayanti');
          });
          // Do NOT set selectedVoice to an incompatible English voice when in Indonesian mode
          this.selectedVoice = idVoice || null;
        } catch {}
      };
      load();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = load;
      }
    }
  }

  public onSpeakingChange(cb: (isSpeaking: boolean, text: string) => void): () => void {
    this.speakingListeners.add(cb);
    return () => this.speakingListeners.delete(cb);
  }

  private notifySpeaking(isSpeaking: boolean, text: string = '') {
    this.isSpeakingState = isSpeaking;
    this.currentSpokenText = text;
    this.speakingListeners.forEach(cb => {
      try { cb(isSpeaking, text); } catch {}
    });
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }

  public getSpokenText(): string {
    return this.currentSpokenText;
  }

  public toggleAutoNarration(): boolean {
    this.autoNarrationEnabled = !this.autoNarrationEnabled;
    return this.autoNarrationEnabled;
  }

  public isAutoNarrationEnabled(): boolean {
    return this.autoNarrationEnabled;
  }

  public toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public toggleBgm(): boolean {
    this.bgmEnabled = !this.bgmEnabled;
    if (this.bgmEnabled) {
      this.startBgm();
    } else {
      this.stopBgm();
    }
    return this.bgmEnabled;
  }

  public isBgmEnabled(): boolean {
    return this.bgmEnabled;
  }

  public setLanguage(lang: 'id' | 'en') {
    this.currentLanguage = lang;
    this.initVoices();
  }

  public getLanguage(): 'id' | 'en' {
    return this.currentLanguage;
  }

  // 1. Stethoscope Real Heartbeat Sound ("lub-dub" acoustic dual-pulse)
  public playHeartbeat(bpm: number = 75) {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // First sound: "Lub" (S1 - closing of AV valves, deeper, lower pitch ~55Hz)
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(65, now);
    osc1.frequency.exponentialRampToValueAtTime(38, now + 0.12);
    gain1.gain.setValueAtTime(0.7, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.13);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.14);

    // Second sound: "Dub" (S2 - closing of semilunar valves, slightly higher ~95Hz, 0.18s later)
    const t2 = now + 0.18;
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(95, t2);
    osc2.frequency.exponentialRampToValueAtTime(50, t2 + 0.1);
    gain2.gain.setValueAtTime(0.55, t2);
    gain2.gain.exponentialRampToValueAtTime(0.01, t2 + 0.11);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(t2);
    osc2.stop(t2 + 0.12);
  }

  // 2. Lung Breath Sound (Inhalation rush & soft exhale breeze)
  public playBreath() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(220, now + 0.4);
    osc.frequency.linearRampToValueAtTime(120, now + 0.9);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(350, now);
    filter.frequency.linearRampToValueAtTime(850, now + 0.4);
    filter.frequency.linearRampToValueAtTime(300, now + 0.9);
    filter.Q.value = 3.0;

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.9);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.95);
  }

  // 3. Brain Neural Synapse Spark (Sci-Fi electric impulse)
  public playNeural() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(2400, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // 4. Stomach Digestion Bubble Gurgle
  public playDigestive() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [180, 240, 160, 310, 190];
    freqs.forEach((freq, idx) => {
      const t = now + idx * 0.06;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 0.05);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t);
      osc.stop(t + 0.08);
    });
  }

  // 5. Bone Skeleton Snap Click
  public playBoneSnap() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.06);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // 6. Cartoon Crunch Eating Sound (Bite apple/veggie)
  public playCrunch() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [0, 0.04, 0.09].forEach((offset, i) => {
      const t = now + offset;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = i % 2 === 0 ? 'square' : 'sawtooth';
      osc.frequency.setValueAtTime(450 - i * 80, t);
      osc.frequency.exponentialRampToValueAtTime(120, t + 0.05);

      gain.gain.setValueAtTime(0.28, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t);
      osc.stop(t + 0.07);
    });
  }

  // 7. Cartoon Gulp Drinking Sound (Water gluk-gluk)
  public playGulp() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.14);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  // 8. Cartoon Giggle / Laughing Tickle Sound
  public playGiggle() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [650, 780, 700, 840];
    notes.forEach((freq, idx) => {
      const t = now + idx * 0.06;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.linearRampToValueAtTime(freq + 60, t + 0.04);

      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t);
      osc.stop(t + 0.07);
    });
  }

  // 6. Medical Scanner / Hospital Monitor Beep
  public playScannerBeep(freq: number = 880) {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  // 7. General UI Pop
  public playPop(pitchMultiplier: number = 1.0) {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const startFreq = 420 * pitchMultiplier;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(startFreq * 2.1, now + 0.07);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // 8. Correct Chime (Triumphant C-major arpeggio)
  public playCorrect() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const t = now + idx * 0.07;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t);
      osc.stop(t + 0.28);
    });
  }

  // 9. Wrong Buzzer
  public playWrong() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(100, now + 0.25);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.28);
  }

  // 10. Grand Celebration Fanfare (Level Completed / Star Awarded)
  public playFanfare() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const melody = [
      { f: 523.25, d: 0.12, t: 0 },
      { f: 659.25, d: 0.12, t: 0.12 },
      { f: 783.99, d: 0.12, t: 0.24 },
      { f: 1046.5, d: 0.35, t: 0.36 },
      { f: 880.0,  d: 0.15, t: 0.72 },
      { f: 1046.5, d: 0.55, t: 0.88 }
    ];

    melody.forEach(note => {
      const t = now + note.t;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, t);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t);
      osc.stop(t + note.d + 0.05);
    });
  }

  // 11. Background Music Loop (Gentle laboratory marimba progression)
  private startBgm() {
    if (this.bgmIntervalId) return;
    const chords = [
      [261.63, 329.63, 392.00], // C
      [220.00, 261.63, 329.63], // Am
      [174.61, 220.00, 261.63], // F
      [196.00, 246.94, 293.66]  // G
    ];
    let step = 0;

    const playStep = () => {
      if (!this.bgmEnabled) return;
      this.initCtx();
      if (!this.ctx) return;

      const chord = chords[step % chords.length];
      const now = this.ctx.currentTime;

      chord.forEach((freq, idx) => {
        const t = now + idx * 0.14;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * 1.5, t);

        gain.gain.setValueAtTime(0.04, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(t);
        osc.stop(t + 0.45);
      });

      step++;
    };

    playStep();
    this.bgmIntervalId = window.setInterval(playStep, 1100);
  }

  private hudElement: HTMLElement | null = null;
  private keepAliveTimer: number | null = null;

  // Visual Mascot Subtitle & Story HUD Bar (Like Kak Bintang in Ruang Angkasa)
  private updateHud(isSpeaking: boolean, text: string, speakerTitle: string = 'Dokter Cilik Sedang Bercerita:') {
    if (typeof document === 'undefined') return;

    if (!this.hudElement) {
      this.hudElement = document.getElementById('voice-narration-hud');
      if (!this.hudElement) {
        this.hudElement = document.createElement('div');
        this.hudElement.id = 'voice-narration-hud';
        this.hudElement.className = 'voice-narration-hud';
        document.body.appendChild(this.hudElement);
      }
    }

    if (!isSpeaking || !text) {
      this.hudElement.classList.remove('active');
      return;
    }

    this.hudElement.innerHTML = `
      <div class="hud-mascot-avatar">
        <span class="hud-avatar-icon">🩺</span>
        <div class="hud-soundwaves">
          <span class="hud-wave-bar"></span>
          <span class="hud-wave-bar"></span>
          <span class="hud-wave-bar"></span>
          <span class="hud-wave-bar"></span>
        </div>
      </div>
      <div class="hud-content">
        <span class="hud-speaker-label">${speakerTitle}</span>
        <p class="hud-subtitle-text">"${text}"</p>
      </div>
      <div class="hud-actions">
        <button class="btn-hud-action" id="btn-hud-replay" title="Ulangi Suara Cerita" type="button">🔁</button>
        <button class="btn-hud-action" id="btn-hud-stop" title="Hentikan Suara Cerita" type="button">⏹️</button>
      </div>
    `;

    this.hudElement.classList.add('active');

    const replayBtn = this.hudElement.querySelector('#btn-hud-replay');
    if (replayBtn) {
      replayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.speak(text, undefined, undefined, speakerTitle);
      });
    }

    const stopBtn = this.hudElement.querySelector('#btn-hud-stop');
    if (stopBtn) {
      stopBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.stopSpeaking();
      });
    }
  }

  // Procedural Xylophone / Kalimba syllable blip sequence
  // Guarantees audible character speech audio on ANY machine even if TTS voice is not downloaded
  public playMascotTones(syllablesCount = 8) {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    // Sweet child-friendly pentatonic frequencies: C5, D5, E5, G5, A5, C6
    const notes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
    const count = Math.min(Math.max(syllablesCount, 4), 14);
    const now = this.ctx.currentTime;

    for (let i = 0; i < count; i++) {
      const noteFreq = notes[i % notes.length];
      const t = now + i * 0.085;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle'; // warm wooden marimba tone
      osc.frequency.setValueAtTime(noteFreq, t);

      gain.gain.setValueAtTime(0.09, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.13);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.15);
    }
  }

  public stopBgm() {
    if (this.bgmIntervalId) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }

  public stopSpeaking() {
    if (this.currentSpeechAudio) {
      try {
        this.currentSpeechAudio.pause();
        this.currentSpeechAudio.currentTime = 0;
      } catch {}
      this.currentSpeechAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
    this.updateHud(false, '');
    this.notifySpeaking(false, '');
  }

  public stopAll() {
    this.stopSpeaking();
    this.stopBgm();
  }

  // Play natural human audio clip from /audio/ (e.g. /audio/organs/heart.mp3 or /audio/id/hebat.mp3)
  public playNaturalAudioClip(relativePath: string, onFallback?: () => void, onEnd?: () => void): void {
    if (!this.soundEnabled || typeof window === 'undefined') {
      if (onEnd) onEnd();
      return;
    }
    try {
      this.stopSpeaking();
      const audio = new Audio(`/audio/${relativePath}`);
      this.currentSpeechAudio = audio;
      // Energetic & bouncy tempo for kids (matching animated cartoon mascot voices)
      audio.playbackRate = 1.09;

      audio.onended = () => {
        this.currentSpeechAudio = null;
        this.updateHud(false, '');
        this.notifySpeaking(false, '');
        if (onEnd) onEnd();
      };

      audio.onerror = () => {
        this.currentSpeechAudio = null;
        if (onFallback) {
          onFallback();
        } else {
          this.updateHud(false, '');
          this.notifySpeaking(false, '');
          if (onEnd) onEnd();
        }
      };

      audio.play().catch(() => {
        if (onFallback) {
          onFallback();
        } else {
          this.updateHud(false, '');
          this.notifySpeaking(false, '');
          if (onEnd) onEnd();
        }
      });
    } catch {
      if (onFallback) onFallback();
    }
  }

  // Stream high-definition natural human Indonesian speech (exact replica of Numberblocks/Alphablocks engine)
  public playNaturalSpeech(text: string, lang: 'id' | 'en' = 'id', onEnd?: () => void): void {
    if (!this.soundEnabled || typeof window === 'undefined') {
      if (onEnd) onEnd();
      return;
    }
    try {
      this.stopSpeaking();
      const tl = lang === 'id' ? 'id' : 'en-GB';
      const cleanText = text
        .replace(/1-10/g, '1 sampai 10')
        .replace(/24 jam/gi, 'dua puluh empat jam')
        .replace(/O2/gi, 'oksigen')
        .replace(/CO2/gi, 'karbon dioksida');

      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=${tl}&client=tw-ob`;
      const audio = new Audio(url);
      this.currentSpeechAudio = audio;
      audio.playbackRate = 1.09;

      audio.onended = () => {
        this.currentSpeechAudio = null;
        this.updateHud(false, '');
        this.notifySpeaking(false, '');
        if (onEnd) onEnd();
      };

      audio.onerror = () => {
        this.currentSpeechAudio = null;
        this.speak(text, undefined, onEnd);
      };

      audio.play().catch(() => {
        this.speak(text, undefined, onEnd);
      });
    } catch {
      this.speak(text, undefined, onEnd);
    }
  }

  // Cheerful kid-friendly character intro jingle (Ascending pentatonic glissando like Alphablocks/Numberblocks)
  public playExcitedChime() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [392.00, 523.25, 659.25, 783.99, 1046.50]; // G4, C5, E5, G5, C6 (bright sparkling star fanfare)
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.055;

      osc.type = 'triangle'; // warm bright marimba chime
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.18);
    });
  }

  // Indonesian cheerful praise voice clips like Alphablocks/Numberblocks ("Hebat!", "Pintar!", "Luar Biasa!")
  public speakPraise() {
    const praises = ['bagus', 'hebat', 'juara', 'keren', 'pintar', 'luar_biasa'];
    const choice = praises[Math.floor(Math.random() * praises.length)];
    this.playExcitedChime();
    setTimeout(() => {
      this.playNaturalAudioClip(`id/${choice}.mp3`, () => {
        this.playFanfare();
      });
    }, 150);
  }

  // Specialized Kid-Friendly Story Narration Engine (Pre-recorded human voice + streaming + subtitle HUD)
  public speakStory(storyText: string, organName: string, organId?: string, onEnd?: () => void) {
    if (!storyText) return;
    this.soundEnabled = true;
    this.initCtx();

    // 1. Play signature cheerful ascending character chime
    this.playExcitedChime();

    // 2. Show visual subtitle HUD banner with live waveforms
    this.updateHud(true, storyText, `Dokter Cilik Bercerita · ${organName}`);
    this.notifySpeaking(true, storyText);

    const sanitizedId = organId ? organId.toLowerCase().replace(/[^a-z0-9_]/g, '') : '';
    const clipPath = sanitizedId.startsWith('case_') ? `cases/${sanitizedId}.mp3` : `organs/${sanitizedId}.mp3`;

    // 3. Play voice with a small 180ms delay so the musical sparkle introduces the character
    setTimeout(() => {
      if (sanitizedId) {
        this.playNaturalAudioClip(
          clipPath,
          () => {
            // Fallback A: Stream Google Indonesian voice directly
            this.playNaturalSpeech(storyText, 'id', onEnd);
          },
          onEnd
        );
      } else {
        this.playNaturalSpeech(storyText, 'id', onEnd);
      }
    }, 180);
  }

  // 12. Text-to-Speech (TTS) Doctor Narration + Mascot Tones + Live Subtitle HUD
  public speak(text: string, onStart?: () => void, onEnd?: () => void, speakerTitle: string = 'Dokter Cilik Sedang Bercerita:') {
    if (!text) return;
    // Auto-unmute when explicit speech narration is triggered
    this.soundEnabled = true;
    this.initCtx();

    // 1. Play tactile confirmation pop sound
    this.playPop(520);

    // 2. Immediately play sweet procedural mascot voice melody so audio is 100% audible immediately
    const words = text.split(/\s+/).length;
    this.playMascotTones(Math.min(words, 12));

    // 3. Show visual subtitle HUD banner immediately
    this.updateHud(true, text, speakerTitle);
    this.notifySpeaking(true, text);

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setTimeout(() => {
        this.updateHud(false, '');
        this.notifySpeaking(false, '');
        if (onEnd) onEnd();
      }, Math.max(text.length * 65, 3000));
      return;
    }

    try {
      // Force unfreeze Chrome's speech synthesis state machine
      try {
        window.speechSynthesis.pause();
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();
      } catch {}

      if (this.keepAliveTimer) {
        clearInterval(this.keepAliveTimer);
        this.keepAliveTimer = null;
      }

      // Asynchronous dispatch prevents race condition in Chromium/WebKit engines
      setTimeout(() => {
        try {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }

          const utterance = new SpeechSynthesisUtterance(text);
          // Retain global reference to prevent garbage collection mid-speech
          (window as unknown as { __activeUtterance?: SpeechSynthesisUtterance }).__activeUtterance = utterance;

          // Find best voice available (prefer Indonesian, but allow natural system voices)
          const voices = window.speechSynthesis.getVoices();
          if (voices && voices.length > 0) {
            const idVoice = voices.find(v => {
              const n = (v.name || '').toLowerCase();
              const l = (v.lang || '').toLowerCase().replace(/_/g, '-');
              return l.startsWith('id') || n.includes('indonesia') || n.includes('damayanti');
            });
            if (idVoice) {
              utterance.voice = idVoice;
            }
          }

          utterance.lang = this.currentLanguage === 'id' ? 'id-ID' : 'en-US';
          utterance.rate = 0.96;
          utterance.pitch = 1.05;

          utterance.onstart = () => {
            this.updateHud(true, text, speakerTitle);
            this.notifySpeaking(true, text);
            if (onStart) onStart();

            // Setup keepAlive timer to bypass Chrome 15-second audio pause bug
            this.keepAliveTimer = window.setInterval(() => {
              if (window.speechSynthesis.speaking) {
                window.speechSynthesis.pause();
                window.speechSynthesis.resume();
              } else if (this.keepAliveTimer) {
                clearInterval(this.keepAliveTimer);
                this.keepAliveTimer = null;
              }
            }, 8000);
          };

          utterance.onend = () => {
            if (this.keepAliveTimer) {
              clearInterval(this.keepAliveTimer);
              this.keepAliveTimer = null;
            }
            this.updateHud(false, '');
            this.notifySpeaking(false, '');
            if (onEnd) onEnd();
          };

          utterance.onerror = () => {
            if (this.keepAliveTimer) {
              clearInterval(this.keepAliveTimer);
              this.keepAliveTimer = null;
            }
            // If custom Indonesian voice threw an error, retry with default voice once
            if (utterance.voice) {
              try {
                const fallback = new SpeechSynthesisUtterance(text);
                (window as unknown as { __activeUtterance?: SpeechSynthesisUtterance }).__activeUtterance = fallback;
                fallback.lang = this.currentLanguage === 'id' ? 'id-ID' : 'en-US';
                fallback.rate = 0.96;
                fallback.pitch = 1.05;
                fallback.onend = () => {
                  this.updateHud(false, '');
                  this.notifySpeaking(false, '');
                  if (onEnd) onEnd();
                };
                window.speechSynthesis.speak(fallback);
                return;
              } catch {}
            }
            this.updateHud(false, '');
            this.notifySpeaking(false, '');
            if (onEnd) onEnd();
          };

          window.speechSynthesis.speak(utterance);
        } catch {
          this.updateHud(false, '');
          this.notifySpeaking(false, '');
          if (onEnd) onEnd();
        }
      }, 50);
    } catch {
      this.updateHud(false, '');
      this.notifySpeaking(false, '');
      if (onEnd) onEnd();
    }
  }
}

export const sound = new AudioEngine();
