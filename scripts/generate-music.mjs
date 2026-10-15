import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { MUSIC_SCORE } from '../audio.js';

const assets = fileURLToPath(new URL('../assets/', import.meta.url));
await mkdir(assets, { recursive: true });
const PPQ = 480;
const u32 = value => { const b = Buffer.alloc(4); b.writeUInt32BE(value); return b; };
const u16 = value => { const b = Buffer.alloc(2); b.writeUInt16BE(value); return b; };
function variableLength(value) {
  const bytes = [value & 0x7f];
  while ((value >>= 7) > 0) bytes.unshift((value & 0x7f) | 0x80);
  return Buffer.from(bytes);
}
function chunk(type, bytes) { return Buffer.concat([Buffer.from(type), u32(bytes.length), bytes]); }
const metaText = (type, text) => { const data = Buffer.from(text, 'utf8'); return Buffer.concat([Buffer.from([0, 0xff, type]), variableLength(data.length), data]); };
const microsPerBeat = Math.round(60_000_000 / MUSIC_SCORE.tempo);
const conductor = chunk('MTrk', Buffer.concat([
  metaText(3, MUSIC_SCORE.title),
  metaText(1, 'Original composition for Robot Cari Kunci; composed 2026-10-15'),
  Buffer.from([0,0xff,0x51,3,(microsPerBeat >> 16) & 255,(microsPerBeat >> 8) & 255,microsPerBeat & 255]),
  Buffer.from([0,0xff,0x58,4,4,2,24,8]),
  Buffer.concat([variableLength(MUSIC_SCORE.beats * PPQ), Buffer.from([0xff,0x2f,0])]),
]));
const voices = ['lead', 'bass', 'chime'];
const programs = [10, 32, 8]; // GM music box, acoustic bass, celesta (zero based).
const tracks = voices.map((voice, channel) => {
  const events = [];
  for (const note of MUSIC_SCORE.notes.filter(note => note.voice === voice)) {
    const start = Math.round(note.beat * PPQ);
    const end = Math.round((note.beat + note.duration) * PPQ);
    events.push({ tick: start, rank: 1, bytes: [0x90 | channel, note.midi, Math.round(note.velocity * 100)] });
    events.push({ tick: end, rank: 0, bytes: [0x80 | channel, note.midi, 0] });
  }
  events.sort((a, b) => a.tick - b.tick || a.rank - b.rank);
  let previous = 0;
  const encoded = [metaText(3, voice), Buffer.from([0,0xc0 | channel,programs[channel]]), Buffer.from([0,0xb0 | channel,7,80])];
  for (const event of events) {
    encoded.push(variableLength(event.tick - previous), Buffer.from(event.bytes));
    previous = event.tick;
  }
  encoded.push(variableLength(MUSIC_SCORE.beats * PPQ - previous), Buffer.from([0xff,0x2f,0]));
  return chunk('MTrk', Buffer.concat(encoded));
});
const midi = Buffer.concat([chunk('MThd', Buffer.concat([u16(1),u16(4),u16(PPQ)])),conductor,...tracks]);
await writeFile(`${assets}/music.mid`, midi);
await writeFile(`${assets}/music-score.json`, JSON.stringify(MUSIC_SCORE, null, 2) + '\n');

// Deterministic 24 kHz mono PCM preview. The browser performs its own Web Audio synthesis.
const sampleRate = 24000;
const secondsPerBeat = 60 / MUSIC_SCORE.tempo;
const seconds = MUSIC_SCORE.beats * secondsPerBeat;
const samples = new Float64Array(Math.ceil(seconds * sampleRate));
for (const note of MUSIC_SCORE.notes) {
  const at = note.beat * secondsPerBeat;
  const duration = note.duration * secondsPerBeat;
  const frequency = 440 * 2 ** ((note.midi - 69) / 12);
  const gain = note.velocity * (note.voice === 'bass' ? .24 : .20) * .20;
  const first = Math.floor(at * sampleRate);
  for (let i = 0; i < Math.floor(duration * sampleRate) && first + i < samples.length; i++) {
    const t = i / sampleRate;
    const attack = Math.min(.012, duration / 6);
    const envelope = t < attack ? t / attack : Math.exp(Math.log(.0001 / (gain / .20)) * (t - attack) / (duration - attack));
    const phase = 2 * Math.PI * frequency * t;
    // Low harmonic triangle approximation, no noise or sharp percussion.
    const wave = note.voice === 'lead' ? (Math.sin(phase) - Math.sin(phase * 3) / 9 + Math.sin(phase * 5) / 25) * .81 : Math.sin(phase);
    samples[first + i] += wave * envelope * gain;
  }
}
const pcm = Buffer.alloc(samples.length * 2);
let peak = 0, squareSum = 0;
for (let i = 0; i < samples.length; i++) {
  peak = Math.max(peak, Math.abs(samples[i]));
  squareSum += samples[i] ** 2;
  pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, samples[i])) * 32767), i * 2);
}
const header = Buffer.alloc(44);
header.write('RIFF', 0); header.writeUInt32LE(pcm.length + 36, 4); header.write('WAVE', 8);
header.write('fmt ', 12); header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20);
header.writeUInt16LE(1, 22); header.writeUInt32LE(sampleRate, 24); header.writeUInt32LE(sampleRate * 2, 28);
header.writeUInt16LE(2, 32); header.writeUInt16LE(16, 34); header.write('data', 36); header.writeUInt32LE(pcm.length, 40);
await writeFile(`${assets}/music-preview.wav`, Buffer.concat([header, pcm]));
console.log(JSON.stringify({ midiBytes: midi.length, notes: MUSIC_SCORE.notes.length, bars: MUSIC_SCORE.bars,
  durationSeconds: seconds, wavSampleRate: sampleRate, wavPeak: peak, wavRMS: Math.sqrt(squareSum / samples.length) }, null, 2));
