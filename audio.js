/** Original local score and a small Web Audio instrument. No audio is created on import. */
const TEMPO = 104;
const BAR_BEATS = 4;
const CHORDS = [
  [48, 60, 64, 67], [53, 60, 65, 69], [55, 62, 67, 71], [48, 60, 64, 67],
  [45, 60, 64, 69], [53, 60, 65, 69], [55, 62, 67, 71], [48, 60, 64, 67],
  [48, 60, 64, 67], [53, 60, 65, 69], [55, 62, 67, 71], [48, 60, 64, 67],
  [45, 60, 64, 69], [53, 60, 65, 69], [55, 62, 67, 71], [48, 60, 64, 67],
];
// [offset in quarter-note beats, length, MIDI pitch]. Composed for this game.
const MELODY = [
  [[0,.5,72],[.5,.5,76],[1,1,79],[2,.5,76],[2.5,.5,74],[3,.75,72]],
  [[0,.5,69],[.5,.5,72],[1,1,77],[2,.5,76],[2.5,.5,74],[3,.75,72]],
  [[0,.75,74],[1,.5,71],[1.5,.5,74],[2,.5,79],[2.5,.5,77],[3,.75,74]],
  [[0,.5,76],[.5,.5,74],[1,1,72],[2,.5,67],[3,.75,72]],
  [[0,.5,69],[.5,.5,72],[1,.75,76],[2,.5,79],[2.5,.5,76],[3,.75,72]],
  [[0,.75,77],[1,.5,76],[1.5,.5,72],[2,.75,69],[3,.75,72]],
  [[0,.5,71],[.5,.5,74],[1,.75,79],[2,.5,77],[2.5,.5,74],[3,.5,71]],
  [[0,.75,72],[1,.5,76],[1.5,.5,79],[2,1.5,72]],
  [[0,.5,76],[.5,.5,79],[1,.75,84],[2,.5,79],[2.5,.5,76],[3,.75,72]],
  [[0,.5,77],[.5,.5,76],[1,.75,72],[2,.5,69],[2.5,.5,72],[3,.75,77]],
  [[0,.5,79],[.5,.5,77],[1,.75,74],[2,.5,71],[2.5,.5,74],[3,.75,79]],
  [[0,.5,76],[.5,.5,74],[1,.75,72],[2,.5,67],[2.5,.5,72],[3,.75,76]],
  [[0,.5,81],[.5,.5,79],[1,.75,76],[2,.5,72],[2.5,.5,76],[3,.75,79]],
  [[0,.5,77],[.5,.5,76],[1,.75,72],[2,.5,69],[2.5,.5,72],[3,.75,77]],
  [[0,.5,74],[.5,.5,77],[1,.75,79],[2,.5,77],[2.5,.5,74],[3,.5,71]],
  [[0,.5,72],[.5,.5,76],[1,.75,79],[2,1.5,72]],
];

function makeScore() {
  const notes = [];
  for (let bar = 0; bar < CHORDS.length; bar++) {
    const [bass, ...chord] = CHORDS[bar];
    for (const [offset, duration, midi] of MELODY[bar]) {
      notes.push({ beat: bar * BAR_BEATS + offset, duration: duration * .82, midi, velocity: .68, voice: 'lead' });
    }
    for (const offset of [0, 2]) {
      notes.push({ beat: bar * BAR_BEATS + offset, duration: .72, midi: bass, velocity: .47, voice: 'bass' });
    }
    for (let i = 0; i < 4; i++) {
      notes.push({ beat: bar * BAR_BEATS + i + .5, duration: .28, midi: chord[i % 3], velocity: .38, voice: 'chime' });
    }
  }
  notes.sort((a, b) => a.beat - b.beat || a.midi - b.midi);
  return Object.freeze({
    title: 'Langkah Kecil Robot',
    composer: 'Komposisi orisinal untuk Robot Cari Kunci, 15 Oktober 2026',
    tempo: TEMPO, timeSignature: [4, 4], bars: CHORDS.length, beats: CHORDS.length * BAR_BEATS,
    notes: Object.freeze(notes.map(Object.freeze)),
  });
}

export const MUSIC_SCORE = makeScore();
export const SOUND_EVENTS = Object.freeze(['move', 'turn', 'key', 'locked', 'success', 'blocked', 'missing', 'already']);
const PITCH = midi => 440 * 2 ** ((midi - 69) / 12);
const clamp = (value, fallback) => Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : fallback;

export class GameAudio {
  constructor() {
    this.context = null;
    this.master = null;
    this.musicBus = null;
    this.effectsBus = null;
    this.compressor = null;
    this.musicVolume = .20;
    this.effectsVolume = .45;
    this.muted = false;
    this.unlocked = false;
    this.musicPlaying = false;
    this.musicWanted = false;
    this.timer = null;
    this.musicSources = new Set();
    this.effectSources = new Set();
    this.musicNoteIndex = 0;
    this.loopStart = 0;
    this.lastEvent = null;
    this.error = null;
    this.unlockPromise = null;
  }

  /** Call directly from the Mulai button gesture; never from page initialization. */
  async unlock() {
    if (this.unlockPromise) return this.unlockPromise;
    const Context = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!Context) {
      this.error = 'Web Audio tidak tersedia di browser ini.';
      return false;
    }
    try {
      if (!this.context) {
        this.context = new Context({ latencyHint: 'interactive' });
        this.master = this.context.createGain();
        this.musicBus = this.context.createGain();
        this.effectsBus = this.context.createGain();
        this.compressor = this.context.createDynamicsCompressor();
        this.compressor.threshold.value = -12;
        this.compressor.knee.value = 8;
        this.compressor.ratio.value = 12;
        this.compressor.attack.value = .003;
        this.compressor.release.value = .15;
        this.master.gain.value = this.muted ? 0 : 1;
        this.musicBus.gain.value = this.musicVolume;
        this.effectsBus.gain.value = this.effectsVolume;
        this.musicBus.connect(this.master);
        this.effectsBus.connect(this.master);
        // Rein in overlapping SFX without changing the independent volume controls.
        this.master.connect(this.compressor);
        this.compressor.connect(this.context.destination);
      }
      // Resume is invoked synchronously in the gesture before the first await.
      const resumed = this.context.state === 'running' ? Promise.resolve() : this.context.resume();
      this.unlockPromise = Promise.resolve(resumed).then(() => {
        this.unlocked = this.context.state === 'running';
        this.error = this.unlocked ? null : 'Audio belum aktif; tekan Mulai lagi.';
        if (this.unlocked && this.musicWanted) this.startMusic();
        return this.unlocked;
      }).catch(error => {
        this.error = `Audio belum aktif: ${error.message}`;
        return false;
      }).finally(() => { this.unlockPromise = null; });
      return this.unlockPromise;
    } catch (error) {
      this.error = `Audio belum aktif: ${error.message}`;
      return false;
    }
  }

  setVolumes(music, effects) {
    this.musicVolume = clamp(music, this.musicVolume);
    this.effectsVolume = clamp(effects, this.effectsVolume);
    this._smooth(this.musicBus, this.musicVolume);
    this._smooth(this.effectsBus, this.effectsVolume);
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
    this._smooth(this.master, this.muted ? 0 : 1);
  }

  _smooth(node, value) {
    if (!node || !this.context) return;
    const now = this.context.currentTime;
    node.gain.cancelScheduledValues(now);
    node.gain.setTargetAtTime(value, now, .025);
  }

  startMusic() {
    this.musicWanted = true;
    if (!this.unlocked || !this.context || this.context.state !== 'running' || this.musicPlaying) return;
    this.musicPlaying = true;
    this.musicNoteIndex = 0;
    this.loopStart = this.context.currentTime + .06;
    this._scheduleMusic();
  }

  stopMusic() {
    this.musicWanted = false;
    this.musicPlaying = false;
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = null;
    this._stopSources(this.musicSources);
  }

  _scheduleMusic() {
    if (!this.musicPlaying || !this.context) return;
    const secondsPerBeat = 60 / MUSIC_SCORE.tempo;
    const loopSeconds = MUSIC_SCORE.beats * secondsPerBeat;
    const now = this.context.currentTime;
    // Hidden tabs can throttle timers. Resume near now without scheduling a backlog.
    if (this.loopStart + loopSeconds < now) {
      this.loopStart = now + .04;
      this.musicNoteIndex = 0;
    }
    let count = 0;
    while (count++ < MUSIC_SCORE.notes.length + 1) {
      const note = MUSIC_SCORE.notes[this.musicNoteIndex];
      const at = this.loopStart + note.beat * secondsPerBeat;
      if (at > now + .18) break;
      if (at >= now - .035 && this.context.state === 'running') {
        this._tone({ at: Math.max(now, at), duration: note.duration * secondsPerBeat,
          frequency: PITCH(note.midi), volume: note.velocity * (note.voice === 'bass' ? .24 : .20),
          type: note.voice === 'lead' ? 'triangle' : 'sine', music: true });
      }
      this.musicNoteIndex++;
      if (this.musicNoteIndex >= MUSIC_SCORE.notes.length) {
        this.musicNoteIndex = 0;
        this.loopStart += loopSeconds;
      }
    }
    this.timer = setTimeout(() => this._scheduleMusic(), 75);
  }

  _tone({ at = this.context.currentTime, duration = .18, frequency = 440, endFrequency,
    volume = .15, type = 'sine', music = false }) {
    const context = this.context;
    if (!context || context.state !== 'running') return;
    const collection = music ? this.musicSources : this.effectSources;
    // A rapid stream of input cannot create unbounded active voices.
    const limit = music ? 32 : 24;
    while (collection.size >= limit) this._stopSource(collection.values().next().value, collection);
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const source = { oscillator, envelope };
    collection.add(source);
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, at);
    if (endFrequency) oscillator.frequency.exponentialRampToValueAtTime(endFrequency, at + duration * .85);
    envelope.gain.setValueAtTime(0, at);
    envelope.gain.linearRampToValueAtTime(volume, at + Math.min(.012, duration / 6));
    envelope.gain.exponentialRampToValueAtTime(.0001, at + duration);
    oscillator.connect(envelope);
    envelope.connect(music ? this.musicBus : this.effectsBus);
    oscillator.onended = () => {
      collection.delete(source);
      oscillator.disconnect();
      envelope.disconnect();
    };
    oscillator.start(at);
    oscillator.stop(at + duration + .025);
  }

  _stopSource(source, collection) {
    collection.delete(source);
    source.oscillator.onended = null;
    try { source.oscillator.stop(); } catch { /* Already ended. */ }
    source.oscillator.disconnect();
    source.envelope.disconnect();
  }

  _stopSources(collection) {
    for (const source of [...collection]) this._stopSource(source, collection);
  }

  play(event) {
    if (!SOUND_EVENTS.includes(event) || !this.unlocked || !this.context || this.context.state !== 'running') return false;
    this.lastEvent = event;
    const now = this.context.currentTime + .006;
    const tone = (offset, midi, duration, volume = .22) => this._tone({ at: now + offset,
      frequency: PITCH(midi), duration, volume });
    switch (event) {
      case 'move':
        this._tone({ at: now, frequency: 240, endFrequency: 160, duration: .10, volume: .22 });
        break;
      case 'turn':
        this._tone({ at: now, frequency: 330, endFrequency: 470, duration: .16, volume: .17 });
        break;
      case 'key':
        [76, 79, 84].forEach((midi, index) => tone(index * .10, midi, .28, .22));
        break;
      case 'locked':
        // Soft low-high-low boing, intentionally playful and quiet.
        this._tone({ at: now, frequency: 180, endFrequency: 360, duration: .13, volume: .25 });
        this._tone({ at: now + .12, frequency: 360, endFrequency: 145, duration: .32, volume: .22 });
        break;
      case 'success':
        [72, 76, 79, 84, 79, 84].forEach((midi, index) => tone(index * .13, midi, .32, .22));
        tone(.65, 72, .55, .14);
        tone(.65, 76, .55, .12);
        break;
      case 'blocked':
        this._tone({ at: now, frequency: 220, endFrequency: 150, duration: .22, volume: .19 });
        tone(.17, 60, .18, .12);
        break;
      case 'missing':
        tone(0, 64, .16, .17); tone(.19, 67, .22, .17);
        break;
      case 'already':
        tone(0, 72, .15, .13); tone(.14, 76, .2, .13);
        break;
    }
    return true;
  }

  getStatus() {
    return {
      unlocked: this.unlocked, contextState: this.context?.state || 'not-created',
      musicPlaying: this.musicPlaying, musicVolume: this.musicVolume, effectsVolume: this.effectsVolume,
      muted: this.muted, activeMusicSources: this.musicSources.size, activeEffectSources: this.effectSources.size,
      timerActive: this.timer !== null, lastEvent: this.lastEvent, error: this.error,
      title: MUSIC_SCORE.title, tempo: MUSIC_SCORE.tempo,
    };
  }

  /** Optional cleanup for a page that embeds/replaces the game. */
  async dispose() {
    this.stopMusic();
    this._stopSources(this.effectSources);
    if (this.context && this.context.state !== 'closed') await this.context.close();
    this.context = null;
    this.unlocked = false;
  }
}
