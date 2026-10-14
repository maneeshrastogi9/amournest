/**
 * AmourNest Romantic Web Audio Engine
 * Plays lush acoustic piano, violin swells, and romantic ambient chord progressions
 * using the Web Audio API. Zero external bandwidth, 100% reliable!
 */

class RomanticAudioEngine {
  constructor() {
    this.ctx = null;
    this.currentLoop = null;
    this.isPlaying = false;
    this.currentTrack = null;
    this.masterGain = null;
    this.customAudioElement = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Helper note frequency converter
  noteToFreq(note) {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = parseInt(note.slice(-1));
    const key = note.slice(0, -1);
    const semitones = notes.indexOf(key) + (octave - 4) * 12;
    return 440 * Math.pow(2, (semitones - 9) / 12);
  }

  playPianoNote(freq, startTime, duration = 1.8, velocity = 0.3) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle'; // Warm romantic piano tone
    osc2.type = 'sine';    // Pure fundamental warmth

    osc.frequency.setValueAtTime(freq, startTime);
    osc2.frequency.setValueAtTime(freq * 2, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.exponentialRampToValueAtTime(velocity, startTime + 0.05); // Attack
    gain.gain.exponentialRampToValueAtTime(velocity * 0.4, startTime + 0.3); // Decay
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration); // Release

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc2.start(startTime);
    osc.stop(startTime + duration);
    osc2.stop(startTime + duration);
  }

  playViolinSwell(freq, startTime, duration = 3.5, velocity = 0.2) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, startTime);
    filter.frequency.exponentialRampToValueAtTime(1600, startTime + duration * 0.5);
    filter.frequency.exponentialRampToValueAtTime(600, startTime + duration);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.exponentialRampToValueAtTime(velocity, startTime + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  playTrack(trackKey, title = '') {
    this.init();
    this.stop();

    this.isPlaying = true;
    this.currentTrack = title || trackKey;

    const runLoop = () => {
      if (!this.isPlaying) return;
      const now = this.ctx.currentTime + 0.05;

      switch (trackKey) {
        case 'piano-melodies':
        case 'piano-serenade':
        default:
          // Romantic Piano Arpeggio in F Major (F - C - Dm - Bb)
          // Bar 1: F Major (F3, A3, C4, F4, A4)
          this.playPianoNote(this.noteToFreq('F3'), now, 3.5, 0.4);
          this.playPianoNote(this.noteToFreq('A3'), now + 0.3, 2.5, 0.25);
          this.playPianoNote(this.noteToFreq('C4'), now + 0.6, 2.5, 0.25);
          this.playPianoNote(this.noteToFreq('F4'), now + 0.9, 2.8, 0.3);
          this.playPianoNote(this.noteToFreq('A4'), now + 1.2, 2.8, 0.35);

          // Bar 2: C Major (C3, G3, C4, E4)
          this.playPianoNote(this.noteToFreq('C3'), now + 2.0, 3.5, 0.4);
          this.playPianoNote(this.noteToFreq('G3'), now + 2.3, 2.5, 0.25);
          this.playPianoNote(this.noteToFreq('C4'), now + 2.6, 2.5, 0.25);
          this.playPianoNote(this.noteToFreq('E4'), now + 2.9, 2.8, 0.3);

          // Bar 3: D minor (D3, A3, D4, F4)
          this.playPianoNote(this.noteToFreq('D3'), now + 4.0, 3.5, 0.4);
          this.playPianoNote(this.noteToFreq('A3'), now + 4.3, 2.5, 0.25);
          this.playPianoNote(this.noteToFreq('D4'), now + 4.6, 2.5, 0.25);
          this.playPianoNote(this.noteToFreq('F4'), now + 4.9, 2.8, 0.35);

          // Bar 4: Bb Major (Bb2, F3, Bb3, D4, F4)
          this.playPianoNote(this.noteToFreq('A#2'), now + 6.0, 3.5, 0.4);
          this.playPianoNote(this.noteToFreq('F3'), now + 6.3, 2.5, 0.25);
          this.playPianoNote(this.noteToFreq('A#3'), now + 6.6, 2.5, 0.25);
          this.playPianoNote(this.noteToFreq('D4'), now + 6.9, 3.0, 0.35);
          this.playViolinSwell(this.noteToFreq('F4'), now + 6.0, 3.5, 0.15);

          this.currentLoop = setTimeout(runLoop, 8000);
          break;

        case 'candlelight-waltz':
          // French Waltz 3/4 rhythm
          for (let step = 0; step < 4; step++) {
            const barTime = now + step * 2.1;
            const bass = step % 2 === 0 ? 'A2' : 'D3';
            this.playPianoNote(this.noteToFreq(bass), barTime, 1.8, 0.35);
            this.playPianoNote(this.noteToFreq('E4'), barTime + 0.7, 1.0, 0.2);
            this.playPianoNote(this.noteToFreq('A4'), barTime + 1.4, 1.0, 0.2);
          }
          this.playViolinSwell(this.noteToFreq('C#5'), now + 0.5, 4.0, 0.18);
          this.currentLoop = setTimeout(runLoop, 8400);
          break;

        case 'sunset-serenade':
          // Warm sunset string ensemble
          this.playViolinSwell(this.noteToFreq('D3'), now, 5.0, 0.25);
          this.playViolinSwell(this.noteToFreq('F#3'), now + 0.3, 4.8, 0.2);
          this.playViolinSwell(this.noteToFreq('A3'), now + 0.6, 4.5, 0.2);
          this.playPianoNote(this.noteToFreq('D5'), now + 1.2, 3.0, 0.3);
          this.playPianoNote(this.noteToFreq('C#5'), now + 2.4, 3.0, 0.3);
          this.playPianoNote(this.noteToFreq('B4'), now + 3.6, 3.5, 0.3);
          this.currentLoop = setTimeout(runLoop, 5500);
          break;

        case 'stargazing':
          // Ethereal love chimes
          const chimes = ['E4', 'G#4', 'B4', 'E5', 'F#5', 'G#5'];
          chimes.forEach((note, i) => {
            this.playPianoNote(this.noteToFreq(note), now + i * 0.8, 3.0, 0.22);
          });
          this.currentLoop = setTimeout(runLoop, 5200);
          break;
      }
    };

    runLoop();
  }

  stop() {
    this.isPlaying = false;
    this.currentTrack = null;
    if (this.currentLoop) {
      clearTimeout(this.currentLoop);
      this.currentLoop = null;
    }
    if (this.customAudioElement) {
      this.customAudioElement.pause();
      this.customAudioElement = null;
    }
  }

  toggle(trackKey, title) {
    if (this.isPlaying && this.currentTrack === (title || trackKey)) {
      this.stop();
      return false;
    } else {
      this.playTrack(trackKey, title);
      return true;
    }
  }
}

export const romanticAudio = new RomanticAudioEngine();
