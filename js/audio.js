/**
 * Audio Manager & Web Audio FX Synthesizer
 * Provides crystal clear sound effects and a romantic ambient melody fallback
 * so the website sounds alive immediately even before custom mp3 is added!
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.bgMusic = null;
    this.isPlaying = false;
    this.isSynthesizedMusicPlaying = false;
    this.synthLoopTimeout = null;

    this.initAudio();
  }

  getAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  initAudio() {
    this.bgMusic = new Audio();
    const config = window.SURPRISE_CONFIG?.music;
    if (config && config.src) {
      this.bgMusic.src = config.src;
      this.bgMusic.loop = true;
      this.bgMusic.volume = 0.55;
    }

    // Handle user interaction to unlock audio
    const unlock = () => {
      this.getAudioContext();
      document.removeEventListener('click', unlock);
      document.removeEventListener('keydown', unlock);
    };
    document.addEventListener('click', unlock, { once: true });
    document.addEventListener('keydown', unlock, { once: true });
  }

  // Toggle Background Music
  toggleMusic() {
    const musicBtn = document.getElementById('music-toggle-btn');
    const eqBars = document.querySelectorAll('.eq-bar');

    if (this.isPlaying) {
      this.pauseMusic();
      if (musicBtn) musicBtn.classList.remove('playing');
      eqBars.forEach(b => b.classList.remove('animating'));
    } else {
      this.playMusic();
      if (musicBtn) musicBtn.classList.add('playing');
      eqBars.forEach(b => b.classList.add('animating'));
    }
  }

  playMusic() {
    this.isPlaying = true;
    this.getAudioContext();

    if (this.bgMusic && this.bgMusic.src) {
      this.bgMusic.play().catch(() => {
        // Fallback to synthesized romantic starry arpeggio
        this.startSynthLullaby();
      });
    } else {
      this.startSynthLullaby();
    }
  }

  pauseMusic() {
    this.isPlaying = false;
    if (this.bgMusic) {
      this.bgMusic.pause();
    }
    this.stopSynthLullaby();
  }

  // Synthesized Romantic Ambient Starry Arpeggio
  startSynthLullaby() {
    if (this.isSynthesizedMusicPlaying) return;
    this.isSynthesizedMusicPlaying = true;

    // Romantic chords arpeggio: C maj9, Am9, F maj7, G7sus4
    const notes = [
      523.25, 659.25, 783.99, 987.77, // C5, E5, G5, B5
      440.00, 523.25, 659.25, 880.00, // A4, C5, E5, A5
      349.23, 440.00, 523.25, 698.46, // F4, A4, C5, F5
      392.00, 523.25, 587.33, 783.99  // G4, C5, D5, G5
    ];

    let noteIdx = 0;
    const playNext = () => {
      if (!this.isPlaying) {
        this.isSynthesizedMusicPlaying = false;
        return;
      }

      this.playPluck(notes[noteIdx % notes.length], 0.08, 1.2);
      noteIdx++;
      this.synthLoopTimeout = setTimeout(playNext, 450);
    };

    playNext();
  }

  stopSynthLullaby() {
    this.isSynthesizedMusicPlaying = false;
    if (this.synthLoopTimeout) {
      clearTimeout(this.synthLoopTimeout);
      this.synthLoopTimeout = null;
    }
  }

  playPluck(freq, gainVal = 0.1, duration = 1.0) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // AudioContext locked or unsupported
    }
  }

  // --- Sound Effects ---

  playClick() {
    this.playTone(600, 'sine', 0.05, 0.06);
  }

  playSuccessTone() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    // Pleasant two-note chime
    this.playTone(523.25, 'sine', 0.1, 0.15); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.1, 0.25), 120); // E5
    setTimeout(() => this.playTone(783.99, 'sine', 0.12, 0.35), 240); // G5
  }

  playWrongTone() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    this.playTone(260, 'sawtooth', 0.08, 0.2);
    setTimeout(() => this.playTone(220, 'sawtooth', 0.08, 0.25), 100);
  }

  playCatchTone() {
    const pitches = [587.33, 659.25, 783.99, 880.00, 1046.50];
    const pitch = pitches[Math.floor(Math.random() * pitches.length)];
    this.playTone(pitch, 'triangle', 0.07, 0.12);
  }

  playFanfare() {
    const melody = [
      { f: 523.25, d: 0.12, delay: 0 },
      { f: 659.25, d: 0.12, delay: 140 },
      { f: 783.99, d: 0.14, delay: 280 },
      { f: 1046.50, d: 0.45, delay: 440 }
    ];

    melody.forEach(m => {
      setTimeout(() => this.playTone(m.f, 'sine', 0.15, m.d), m.delay);
    });
  }

  playTone(freq, type = 'sine', gainVal = 0.1, duration = 0.2) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }
}

window.AudioEffects = new SoundEngine();
