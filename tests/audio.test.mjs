import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { GameAudio, MUSIC_SCORE, SOUND_EVENTS } from '../audio.js';

const tests = [];
const test = (name, run) => tests.push({ name, run });

function parseMidi(buffer) {
  assert.equal(buffer.toString('ascii', 0, 4), 'MThd');
  assert.equal(buffer.readUInt32BE(4), 6);
  assert.equal(buffer.readUInt16BE(8), 1);
  assert.equal(buffer.readUInt16BE(10), 4);
  const ppq = buffer.readUInt16BE(12);
  const tracks = [];
  let offset = 14;
  for (let index = 0; index < 4; index++) {
    assert.equal(buffer.toString('ascii', offset, offset + 4), 'MTrk');
    const size = buffer.readUInt32BE(offset + 4);
    const end = offset + 8 + size;
    offset += 8;
    let tick = 0, ended = false;
    const notes = [], active = new Map();
    const readVariable = () => {
      let number = 0, byte, count = 0;
      do { assert.ok(offset < end); byte = buffer[offset++]; number = (number << 7) | (byte & 127); assert.ok(++count <= 4); } while (byte & 128);
      return number;
    };
    while (offset < end) {
      tick += readVariable();
      const status = buffer[offset++];
      if (status === 0xff) {
        const type = buffer[offset++];
        const length = readVariable();
        if (type === 0x2f) { assert.equal(length, 0); ended = true; }
        offset += length;
      } else if ((status & 0xf0) === 0xc0) offset++;
      else if ((status & 0xf0) === 0xb0) offset += 2;
      else if ((status & 0xf0) === 0x90) {
        const midi = buffer[offset++], velocity = buffer[offset++];
        assert.ok(velocity > 0 && velocity <= 127);
        assert.ok(!active.has(midi), `overlapping note ${midi}`);
        active.set(midi, { tick, midi });
      } else if ((status & 0xf0) === 0x80) {
        const midi = buffer[offset++]; offset++;
        assert.ok(active.has(midi), `unpaired note off ${midi}`);
        const note = active.get(midi);
        notes.push({ beat: note.tick / ppq, duration: (tick - note.tick) / ppq, midi });
        active.delete(midi);
      } else assert.fail(`Unexpected MIDI event ${status}`);
    }
    assert.equal(offset, end);
    assert.equal(active.size, 0);
    assert.ok(ended);
    tracks.push({ tick, notes });
  }
  assert.equal(offset, buffer.length);
  return { ppq, tracks };
}

class FakeParam {
  constructor() { this.value = 0; this.calls = []; }
  setValueAtTime(value, time) { this.value = value; this.calls.push(['set', value, time]); }
  linearRampToValueAtTime(value, time) { this.calls.push(['linear', value, time]); }
  exponentialRampToValueAtTime(value, time) { this.calls.push(['exponential', value, time]); }
  cancelScheduledValues(time) { this.calls.push(['cancel', time]); }
  setTargetAtTime(value, time, constant) { this.value = value; this.calls.push(['target', value, time, constant]); }
}
class FakeNode {
  constructor() { this.gain = new FakeParam(); this.frequency = new FakeParam(); this.disconnected = false; this.stops = []; }
  connect(target) { this.target = target; }
  disconnect() { this.disconnected = true; }
  start(time) { this.startedAt = time; }
  stop(time) { this.stops.push(time); }
}
class FakeContext {
  static created = 0;
  constructor() { FakeContext.created++; this.currentTime = 0; this.state = 'suspended'; this.destination = {}; this.oscillators = []; }
  createGain() { return new FakeNode(); }
  createDynamicsCompressor() {
    const node = new FakeNode();
    for (const param of ['threshold', 'knee', 'ratio', 'attack', 'release']) node[param] = new FakeParam();
    return node;
  }
  createOscillator() { const node = new FakeNode(); this.oscillators.push(node); return node; }
  async resume() { this.state = 'running'; }
  async close() { this.state = 'closed'; }
}

test('valid MIDI with matching 16-bar browser score, paired events, and loop length', async () => {
  const score = JSON.parse(await readFile(new URL('../assets/music-score.json', import.meta.url), 'utf8'));
  assert.deepEqual(score, MUSIC_SCORE);
  assert.equal(score.bars, 16);
  const { ppq, tracks } = parseMidi(await readFile(new URL('../assets/music.mid', import.meta.url)));
  assert.equal(ppq, 480);
  for (const track of tracks) assert.equal(track.tick / ppq, MUSIC_SCORE.beats);
  const notes = tracks.flatMap(track => track.notes).sort((a,b) => a.beat - b.beat || a.midi - b.midi);
  assert.equal(notes.length, MUSIC_SCORE.notes.length);
  notes.forEach((note, index) => {
    assert.equal(note.midi, MUSIC_SCORE.notes[index].midi);
    assert.equal(note.beat, MUSIC_SCORE.notes[index].beat);
    assert.ok(Math.abs(note.duration - MUSIC_SCORE.notes[index].duration) <= 1 / ppq);
  });
});

test('preview is valid PCM audio with a nonzero, unclipped signal', async () => {
  const wav = await readFile(new URL('../assets/music-preview.wav', import.meta.url));
  assert.equal(wav.toString('ascii',0,4), 'RIFF');
  assert.equal(wav.toString('ascii',8,12), 'WAVE');
  assert.equal(wav.readUInt16LE(20), 1);
  assert.equal(wav.readUInt16LE(22), 1);
  assert.equal(wav.readUInt32LE(24), 24000);
  assert.equal(wav.readUInt16LE(34), 16);
  assert.equal(wav.readUInt32LE(40), wav.length - 44);
  let peak = 0;
  for (let i = 44; i < wav.length; i += 2) peak = Math.max(peak, Math.abs(wav.readInt16LE(i)));
  assert.ok(peak > 100 && peak < 32767);
  assert.ok(Math.abs((wav.length - 44) / 48000 - MUSIC_SCORE.beats * 60 / MUSIC_SCORE.tempo) < .001);
});

test('gesture gate, music lifecycle, each SFX, separate volume, mute, and spam bounds', async () => {
  const saved = globalThis.AudioContext;
  globalThis.AudioContext = FakeContext;
  const audio = new GameAudio();
  try {
    const createdBefore = FakeContext.created;
    assert.equal(audio.getStatus().contextState, 'not-created');
    audio.setMuted(true);
    audio.setVolumes(.30, .60);
    audio.startMusic();
    assert.equal(audio.play('key'), false);
    assert.equal(FakeContext.created, createdBefore);
    assert.equal(audio.getStatus().timerActive, false);
    await audio.unlock();
    assert.equal(FakeContext.created, createdBefore + 1);
    assert.equal(audio.getStatus().musicPlaying, true);
    assert.equal(audio.master.gain.value, 0);
    assert.equal(audio.musicBus.gain.value, .30);
    assert.equal(audio.effectsBus.gain.value, .60);
    const timer = audio.timer;
    audio.startMusic();
    assert.equal(audio.timer, timer);
    await audio.unlock();
    assert.equal(FakeContext.created, createdBefore + 1);
    audio.setMuted(false);
    assert.equal(audio.master.gain.value, 1);
    audio.setVolumes(0, .71);
    assert.equal(audio.musicBus.gain.value, 0);
    assert.equal(audio.effectsBus.gain.value, .71);
    audio.setVolumes(.39, 0);
    assert.equal(audio.musicBus.gain.value, .39);
    assert.equal(audio.effectsBus.gain.value, 0);
    audio.setVolumes(2, -1);
    assert.equal(audio.getStatus().musicVolume, 1);
    assert.equal(audio.getStatus().effectsVolume, 0);
    assert.equal(audio.play('invalid'), false);
    for (const event of SOUND_EVENTS) {
      const before = audio.context.oscillators.length;
      assert.equal(audio.play(event), true);
      assert.ok(audio.context.oscillators.length > before, event);
    }
    for (let i = 0; i < 100; i++) audio.play('success');
    assert.ok(audio.getStatus().activeEffectSources <= 24);
    audio.context.currentTime = 600;
    clearTimeout(audio.timer);
    audio._scheduleMusic();
    assert.ok(audio.loopStart >= 600);
    assert.ok(audio.getStatus().activeMusicSources <= 32);
    audio.stopMusic();
    assert.equal(audio.getStatus().timerActive, false);
    assert.equal(audio.getStatus().activeMusicSources, 0);
    assert.equal(audio.getStatus().musicPlaying, false);
    audio.startMusic();
    assert.equal(audio.getStatus().musicPlaying, true);
  } finally {
    await audio.dispose();
    globalThis.AudioContext = saved;
  }
  assert.equal(audio.getStatus().activeEffectSources, 0);
  assert.equal(audio.getStatus().contextState, 'not-created');
});

test('missing Web Audio reports a useful state without breaking the game', async () => {
  const saved = globalThis.AudioContext;
  const savedWebkit = globalThis.webkitAudioContext;
  delete globalThis.AudioContext;
  delete globalThis.webkitAudioContext;
  try {
    const audio = new GameAudio();
    assert.equal(await audio.unlock(), false);
    assert.match(audio.getStatus().error, /tidak tersedia/);
    assert.equal(audio.getStatus().contextState, 'not-created');
  } finally {
    globalThis.AudioContext = saved;
    globalThis.webkitAudioContext = savedWebkit;
  }
});

let passed = 0;
for (const { name, run } of tests) {
  try {
    await run();
    passed++;
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    console.error(error);
    process.exitCode = 1;
  }
}
console.log(`${passed}/${tests.length} audio tests passed`);
