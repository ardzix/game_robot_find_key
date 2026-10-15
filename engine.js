import { LEVELS, COMMANDS, DIRECTIONS } from './levels.js';

export { COMMANDS };
export const MAX_QUEUE_LENGTH = 64;
export const MAX_EXPANDED_LENGTH = 256;
export const MAX_LOOP_BODY_LENGTH = 12;
export const FIRST_LOOP_LEVEL = 31;

export const DEFAULT_CONFIG = Object.freeze({
  version: 1,
  levelId: 1,
  initialState: Object.freeze({ x: 0, y: 2, dir: 'E', hasKey: false, won: false }),
  queue: Object.freeze([]),
  playMode: 'sequence',
  musicVolume: 0.2,
  effectsVolume: 0.45,
  muted: false
});

function levelFor(id) {
  const level = LEVELS.find(candidate => candidate.id === id);
  if (!level) throw new RangeError('Level harus bilangan bulat 1 sampai 50.');
  return level;
}

export function createState(levelId = DEFAULT_CONFIG.levelId) {
  const level = levelFor(levelId);
  return { levelId, ...level.start, hasKey: false, won: false };
}

const at = (a, b) => a.x === b.x && a.y === b.y;
const vectors = Object.freeze({ N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] });

/** One command, one result. Does not animate, consume a queue, or mutate its input. */
export function applyCommand(current, command) {
  if (!COMMANDS.includes(command)) throw new RangeError('Instruksi tidak dikenal.');
  const level = levelFor(current.levelId);
  const state = { ...current };
  if (state.won) return { state, event: 'already' };
  if (command === 'left' || command === 'right') {
    const next = (DIRECTIONS.indexOf(state.dir) + (command === 'left' ? 3 : 1)) % 4;
    state.dir = DIRECTIONS[next];
    return { state, event: 'turn' };
  }
  if (command === 'forward') {
    const [dx, dy] = vectors[state.dir];
    const next = { x: state.x + dx, y: state.y + dy };
    if (next.x < 0 || next.y < 0 || next.x >= level.width || next.y >= level.height || level.obstacles.some(block => at(block, next))) {
      return { state, event: 'blocked' };
    }
    Object.assign(state, next);
    return { state, event: 'move' };
  }
  if (command === 'take') {
    if (state.hasKey) return { state, event: 'already' };
    if (!at(state, level.key)) return { state, event: 'missing' };
    state.hasKey = true;
    return { state, event: 'key' };
  }
  if (!at(state, level.chest)) return { state, event: 'missing' };
  if (!state.hasKey) return { state, event: 'locked' };
  state.won = true;
  return { state, event: 'success' };
}

const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const configFields = ['version', 'levelId', 'initialState', 'queue', 'playMode', 'musicVolume', 'effectsVolume', 'muted'];
const requiredFields = configFields.filter(field => field !== 'initialState');

/** Expand only finite, non-nested repeat blocks. Source metadata drives UI highlighting. */
export function expandQueue(queue) {
  if (!Array.isArray(queue)) throw new TypeError('queue harus berupa daftar instruksi.');
  if (queue.length > MAX_QUEUE_LENGTH) throw new RangeError(`queue maksimal ${MAX_QUEUE_LENGTH} kartu/blok.`);
  const expanded = [];
  for (let sourceIndex = 0; sourceIndex < queue.length; sourceIndex++) {
    const entry = queue[sourceIndex];
    if (typeof entry === 'string') {
      if (!COMMANDS.includes(entry)) throw new RangeError(`Instruksi ke-${sourceIndex + 1} tidak didukung.`);
      expanded.push({ command: entry, sourceIndex, iteration: 1, repeatCount: 1, bodyIndex: 0 });
    } else {
      if (!isRecord(entry) || Object.keys(entry).length !== 2 || !Object.hasOwn(entry, 'repeat') || !Object.hasOwn(entry, 'commands')) {
        throw new TypeError(`Blok ke-${sourceIndex + 1} harus berisi repeat dan commands saja.`);
      }
      if (!Number.isInteger(entry.repeat) || ![2, 3, 4].includes(entry.repeat)) throw new RangeError('Ulangi hanya boleh 2, 3, atau 4 kali.');
      if (!Array.isArray(entry.commands) || entry.commands.length < 1 || entry.commands.length > MAX_LOOP_BODY_LENGTH) throw new RangeError(`Badan Ulangi harus berisi 1 sampai ${MAX_LOOP_BODY_LENGTH} kartu biasa.`);
      for (let bodyIndex = 0; bodyIndex < entry.commands.length; bodyIndex++) {
        if (!COMMANDS.includes(entry.commands[bodyIndex])) throw new TypeError('Badan Ulangi hanya menerima kartu biasa; Ulangi bersarang tidak didukung.');
      }
      for (let iteration = 1; iteration <= entry.repeat; iteration++) {
        for (let bodyIndex = 0; bodyIndex < entry.commands.length; bodyIndex++) {
          expanded.push({ command: entry.commands[bodyIndex], sourceIndex, iteration, repeatCount: entry.repeat, bodyIndex });
        }
      }
    }
    if (expanded.length > MAX_EXPANDED_LENGTH) throw new RangeError(`Hasil Ulangi maksimal ${MAX_EXPANDED_LENGTH} langkah.`);
  }
  return expanded;
}

/** Strict config validation. Returns a fresh normalized object; never alters input. */
export function validateConfig(input) {
  const errors = [];
  if (!isRecord(input)) return { valid: false, errors: ['Konfigurasi harus berupa objek JSON.'] };
  for (const name of Object.keys(input)) {
    if (!configFields.includes(name)) errors.push(`Field tidak didukung: ${name}.`);
  }
  for (const name of requiredFields) {
    if (!Object.hasOwn(input, name)) errors.push(`Field wajib belum ada: ${name}.`);
  }
  if (input.version !== 1) errors.push('version harus 1.');
  if (!Number.isInteger(input.levelId) || !LEVELS.some(level => level.id === input.levelId)) errors.push('levelId harus bilangan bulat 1 sampai 50.');
  try { expandQueue(input.queue); } catch (error) { errors.push(error.message); }
  if (Array.isArray(input.queue) && input.levelId < FIRST_LOOP_LEVEL && input.queue.some(entry => typeof entry !== 'string')) errors.push('Blok Ulangi tersedia mulai SD 4, level 31.');
  if (!['sequence', 'step'].includes(input.playMode)) errors.push('playMode harus sequence atau step.');
  for (const name of ['musicVolume', 'effectsVolume']) {
    if (typeof input[name] !== 'number' || !Number.isFinite(input[name]) || input[name] < 0 || input[name] > 1) errors.push(`${name} harus angka 0 sampai 1.`);
  }
  if (typeof input.muted !== 'boolean') errors.push('muted harus true atau false.');
  const level = LEVELS.find(candidate => candidate.id === input.levelId);
  if (Object.hasOwn(input, 'initialState')) {
    if (!isRecord(input.initialState)) {
      errors.push('initialState harus objek posisi awal tetap.');
    } else if (level) {
      const expected = { ...level.start, hasKey: false, won: false };
      if (Object.keys(input.initialState).length !== Object.keys(expected).length || Object.keys(expected).some(name => input.initialState[name] !== expected[name])) {
        errors.push('initialState harus cocok dengan posisi/arah awal level; kunci belum diambil dan peti belum terbuka.');
      }
    }
  }
  if (errors.length) return { valid: false, errors };
  return {
    valid: true,
    errors: [],
    config: {
      version: 1,
      levelId: input.levelId,
      initialState: { ...level.start, hasKey: false, won: false },
      queue: input.queue.map(entry => typeof entry === 'string' ? entry : { repeat: entry.repeat, commands: [...entry.commands] }),
      playMode: input.playMode,
      musicVolume: input.musicVolume,
      effectsVolume: input.effectsVolume,
      muted: input.muted
    }
  };
}

/** Applying a valid configuration always begins from the selected level's fixed start. */
export function configToState(config) {
  const result = validateConfig(config);
  if (!result.valid) throw new TypeError(result.errors.join(' '));
  return createState(result.config.levelId);
}
