import { LEVELS } from './levels.js';
import { createState, applyCommand, validateConfig, DEFAULT_CONFIG, COMMANDS, expandQueue, MAX_QUEUE_LENGTH } from './engine.js';
import { GameAudio } from './audio.js';
import { RobotScene } from './scene.js';

const $ = selector => document.querySelector(selector);
const all = selector => [...document.querySelectorAll(selector)];
const clone = value => JSON.parse(JSON.stringify(value));
const names = { forward: 'Maju', left: 'Putar kiri', right: 'Putar kanan', take: 'Ambil kunci', open: 'Buka peti' };
const dirs = { N: 'Utara', E: 'Timur', S: 'Selatan', W: 'Barat' };
const phrase = 'Ayo om pit eksekusi buat game nya';
const icon = command => `<svg aria-hidden="true"><use href="#i-${command}"/></svg>`;
const groups = [...new Set(LEVELS.map(level => level.grade))];
const descriptions = [
  'Langkah pertama: maju, berputar, dan menemukan peti. Mulai sedikit demi sedikit.',
  'Berhenti di kunci, ambil, lalu buka peti. Prediksi dahulu sebelum mencoba.',
  'Baca arah robot dan susun perjalanan yang memiliki beberapa belokan.',
  'Rencanakan dua bagian perjalanan: menuju kunci, lalu menuju peti.',
  'Bandingkan pilihan jalan. Mana yang memakai lebih sedikit langkah dan putaran?',
  'Temukan pola. Buat blok Ulangi untuk menjalankan instruksi yang sama 2–4 kali.',
  'Gabungkan pengulangan dan rute memutar. Periksa setiap langkah dalam blok.',
  'Pecahkan perjalanan panjang menjadi bagian-bagian. Uji, perbaiki, dan sederhanakan program.'
];
let config = clone(DEFAULT_CONFIG);
let state = createState(config.levelId);
let queue = [...config.queue];
let execution = expandQueue(queue);
let cursor = 0;
let running = false;
let paused = false;
let animating = false;
let started = false;
let generation = 0;
let classLocked = false;
let classAuthorized = false;
let repeatDraft = null;
let selectedGrade = LEVELS[0].grade;
let completedLevels = new Set();
let classState = {
  version: 1, phase: 'preparation', proposalStatus: 'draft_only',
  source: 'Default usulan persiapan; belum ada keputusan anak.',
  agreedChoices: [], predictionsWithoutIdentity: [], pendingConfig: null,
  testResults: [], ideasForLater: [],
  classExecutionAuthorization: { authorized: false, requiredSpeaker: 'Om Arif', requiredPhrase: phrase }
};
try {
  const saved = JSON.parse(localStorage.getItem('robot-class-draft-v1'));
  if (saved && saved.version === 1 && saved.classExecutionAuthorization) {
    classState = saved;
    classLocked = saved.phase === 'class_draft';
    classState.classExecutionAuthorization.authorized = false;
  }
  const solved = JSON.parse(localStorage.getItem('robot-completed-v1'));
  if (Array.isArray(solved)) completedLevels = new Set(solved.filter(id => LEVELS.some(level => level.id === id)));
} catch { /* Local storage is optional; the game also works without it. */ }
const audio = new GameAudio();
let scene;
const currentLevel = () => LEVELS.find(level => level.id === state.levelId);
const say = text => { $('#status').textContent = text; };
const message = text => { $('#config-message').textContent = text; };
function saveClass() {
  try { localStorage.setItem('robot-class-draft-v1', JSON.stringify(classState)); }
  catch { message('Penyimpanan browser tidak tersedia. Gunakan Simpan CLASS_STATE.'); }
}
function getConfig() {
  return { ...clone(config), levelId: state.levelId, initialState: { ...currentLevel().start, hasKey: false, won: false }, queue: clone(queue) };
}
function permitted(edit = false) {
  if (classLocked && (!classAuthorized || edit)) {
    message('Rencana kelas terkunci. Simpan rancangan, lalu tunggu frasa izin Om Arif.');
    say('Menunggu rencana dan izin Om Arif.');
    return false;
  }
  return true;
}
function renderLibrary() {
  $('#grade-tabs').innerHTML = groups.map(grade => `<button data-grade="${grade}" class="${grade === selectedGrade ? 'active' : ''}" aria-pressed="${grade === selectedGrade}">${grade}</button>`).join('');
  $('#grade-description').textContent = descriptions[groups.indexOf(selectedGrade)] || '';
  $('#level-grid').innerHTML = LEVELS.filter(level => level.grade === selectedGrade).map(level =>
    `<button data-level="${level.id}" class="${level.id === state.levelId ? 'active' : ''}" ${classLocked || running || animating ? 'disabled' : ''} aria-label="Level ${level.id}: ${level.title}"><b>${level.id}</b>${completedLevels.has(level.id) ? '<span class="solved">✓ Selesai</span>' : ''}<strong>${level.title}</strong><small>${level.width} × ${level.height} petak${level.id >= 31 ? ' · Bisa Ulangi' : ''}</small></button>`
  ).join('');
}
function render() {
  const level = currentLevel();
  const locked = classLocked && !classAuthorized;
  const busy = running || animating;
  const action = execution[cursor];
  $('#level-caption').textContent = `${level.grade} · PETUALANGAN ${String(level.id).padStart(2, '0')} / ${LEVELS.length}`;
  $('#level-title').textContent = level.title;
  $('#level-picker').innerHTML = `<b>${level.id}</b> ${level.grade} · Pilih level ▾`;
  $('#level-picker').disabled = busy || classLocked;
  $('#previous-level').disabled = busy || classLocked || level.id === 1;
  $('#advance-level').disabled = busy || classLocked || level.id === LEVELS.length;
  $('#key-badge').classList.toggle('owned', state.hasKey);
  $('#key-badge span').textContent = state.hasKey ? '✓ Kunci dibawa' : 'Belum ada kunci';
  $('#start-note').textContent = `Awal: (${level.start.x}, ${level.start.y}) · hadap ${dirs[level.start.dir]}`;
  $('#position-label').textContent = `(${state.x}, ${state.y}) · ${dirs[state.dir]}`;
  $('#scene').setAttribute('aria-label', `Robot pada (${state.x},${state.y}), menghadap ${dirs[state.dir]}. Kunci pada (${level.key.x},${level.key.y}), peti pada (${level.chest.x},${level.chest.y}). ${state.hasKey ? 'Robot membawa kunci.' : ''}`);
  $('#queue-count').textContent = `${queue.length}/${MAX_QUEUE_LENGTH}`;
  $('#queue').innerHTML = queue.map((entry, index) => {
    const last = execution.map(item => item.sourceIndex).lastIndexOf(index);
    const done = last < cursor;
    const active = action && action.sourceIndex === index && animating;
    const style = `${done ? 'done' : ''} ${active ? 'current' : ''}`;
    if (typeof entry === 'string') return `<li class="${entry} ${style}" aria-label="${index + 1}. ${names[entry]}"><small>${index + 1}</small>${icon(entry)}</li>`;
    return `<li class="repeat-block ${style}" aria-label="${index + 1}. Ulangi ${entry.repeat} kali: ${entry.commands.map(command => names[command]).join(', ')}"><small>${index + 1}</small><strong>⟳ Ulangi ${entry.repeat}×</strong><span>${entry.commands.map(icon).join('')}</span></li>`;
  }).join('');
  $('#execution-detail').textContent = action && animating && action.repeatCount > 1
    ? `Blok ${action.sourceIndex + 1} · ulangan ${action.iteration}/${action.repeatCount} · ${names[action.command]}`
    : queue.length ? `${queue.length} kartu → ${execution.length} aksi · ${cursor} selesai` : 'Baca dari kiri ke kanan, lalu ke bawah.';
  $('#empty-queue').hidden = queue.length > 0;
  $('#empty-queue').style.display = queue.length ? 'none' : 'flex';
  all('[data-command]').forEach(button => {
    button.disabled = !started || busy || classLocked || (repeatDraft ? repeatDraft.commands.length >= 12 : queue.length >= MAX_QUEUE_LENGTH);
  });
  $('#run-button').disabled = !started || busy || !queue.length || state.won || locked || !!repeatDraft;
  $('#run-button').textContent = config.playMode === 'step' ? '▸ Jalankan 1 langkah' : paused ? '▶ Lanjutkan' : '▶ Jalankan';
  $('#pause-button').disabled = !started || !busy;
  $('#pause-button').textContent = paused ? 'Ⅱ Dijeda' : 'Ⅱ Jeda';
  $('#step-button').disabled = !started || busy || !queue.length || state.won || locked || !!repeatDraft;
  $('#clear-button').disabled = busy || classLocked;
  $('#undo-button').disabled = busy || classLocked || (repeatDraft ? !repeatDraft.commands.length : !queue.length);
  $('#reset-button').disabled = !started || locked;
  $('#celebration').hidden = !state.won;
  $('#next-level').textContent = level.id < LEVELS.length ? 'Level berikutnya →' : '↺ Coba lagi';
  $('#next-level').disabled = classLocked;
  $('#mute-button').textContent = config.muted ? '♪ Hening' : '♫ Suara';
  $('#mute-button').setAttribute('aria-pressed', String(config.muted));
  $('#music-volume').value = config.musicVolume;
  $('#effects-volume').value = config.effectsVolume;
  $('#music-value').value = `${Math.round(config.musicVolume * 100)}%`;
  $('#effects-value').value = `${Math.round(config.effectsVolume * 100)}%`;
  $('#play-mode').value = config.playMode;
  $('#class-lock').checked = classLocked;
  $('#repeat-controls').hidden = level.id < 31;
  $('#repeat-toggle').hidden = !!repeatDraft;
  $('#repeat-toggle').disabled = !started || busy || classLocked || queue.length >= MAX_QUEUE_LENGTH;
  $('#repeat-editor').hidden = !repeatDraft;
  if (repeatDraft) {
    $('#repeat-count').value = repeatDraft.repeat;
    $('#repeat-preview').innerHTML = repeatDraft.commands.length ? repeatDraft.commands.map(icon).join('') : 'Pilih kartu di bawah (maks. 12).';
    $('#repeat-save').disabled = !repeatDraft.commands.length;
  }
  if ($('#level-dialog').open) renderLibrary();
  const highlighted = $('#queue .current');
  if (highlighted) highlighted.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}
function rewind() {
  generation++;
  running = false; paused = false; animating = false; cursor = 0;
  scene.cancel(); state = createState(state.levelId); scene.setState(state); render();
  $('#queue').scrollTop = 0;
}
function reset() {
  if (!permitted()) return false;
  repeatDraft = null; rewind(); say('Kembali ke awal. Rencana kita tetap ada.'); return true;
}
function enqueue(entry) {
  if (!started || running || animating || queue.length >= MAX_QUEUE_LENGTH || !permitted(true)) return false;
  const checked = validateConfig({ ...getConfig(), queue: [...clone(queue), clone(entry)] });
  if (!checked.valid) { say(checked.errors[0]); return false; }
  queue = clone(checked.config.queue); execution = expandQueue(queue);
  rewind(); say(`${typeof entry === 'string' ? names[entry] : `Blok Ulangi ${entry.repeat}×`} ditambahkan. Apa berikutnya?`);
  return true;
}
function setConfiguration(next) {
  generation++; scene.cancel(); config = clone(next); queue = clone(next.queue); execution = expandQueue(queue);
  state = createState(next.levelId); cursor = 0; running = false; animating = false; paused = false; repeatDraft = null;
  selectedGrade = currentLevel().grade;
  scene.build(currentLevel(), state); audio.setVolumes(config.musicVolume, config.effectsVolume); audio.setMuted(config.muted);
  render(); $('#queue').scrollTop = 0; $('#config-editor').value = JSON.stringify(getConfig(), null, 2);
  say('Rencana siap. Belum dijalankan.');
  message('Konfigurasi valid diterapkan. Papan kembali ke awal; tekan Jalankan saat siap.');
}
function applyConfig(input) {
  const checked = validateConfig(input);
  if (!checked.valid) { message(checked.errors.join(' ')); return checked; }
  if (running || animating) return { valid: false, errors: ['Jeda dan tunggu animasi selesai dahulu.'] };
  if (!permitted(true)) return { valid: false, errors: ['Konfigurasi kelas memerlukan izin Om Arif.'] };
  setConfiguration(checked.config); return checked;
}
function selectLevel(id) {
  const next = getConfig(); delete next.initialState; next.levelId = id; next.queue = [];
  const result = applyConfig(next);
  if (result.valid) $('#level-dialog').close();
}
const failEvents = ['blocked', 'locked', 'missing', 'already'];
async function executeOne() {
  if (animating || cursor >= execution.length || state.won) return false;
  const token = generation;
  const before = { ...state };
  const action = execution[cursor];
  const command = action.command;
  const result = applyCommand(state, command);
  animating = true; render();
  say(action.repeatCount > 1 ? `Ulang ${action.iteration}/${action.repeatCount}: ${names[command]}` : `Langkah ${cursor + 1}: ${names[command]}`);
  audio.play(result.event);
  await scene.animate(before, result.state, result.event);
  if (token !== generation) return false;
  state = result.state; cursor++; animating = false;
  const notices = {
    move: 'Satu petak. Lihat arah hidungnya!', turn: 'Putar di tempat. Sekarang hadap mana?',
    key: 'Kunci sudah dibawa. Ayo ke peti!', locked: 'Boing! Peti perlu kunci. Kita ambil dulu.',
    blocked: 'Ups, jalannya terhalang. Coba jalan lain!',
    missing: command === 'take' ? 'Kuncinya di petak lain. Ayo cari!' : 'Petinya di petak lain. Ayo cari!',
    already: 'Sudah dibawa. Coba instruksi berikutnya.', success: 'Hore! Urutan kita berhasil membuka peti.'
  };
  say(notices[result.event]);
  if (failEvents.includes(result.event)) { running = false; paused = true; }
  if (state.won) {
    running = false; paused = false; completedLevels.add(state.levelId);
    try { localStorage.setItem('robot-completed-v1', JSON.stringify([...completedLevels])); } catch {}
  }
  if (classLocked && classAuthorized) {
    classState.testResults.push({ time: new Date().toISOString(), levelId: state.levelId, instruction: command, sourceCard: action.sourceIndex + 1, iteration: action.iteration, event: result.event, state: { ...state } });
    saveClass();
  }
  render(); return !failEvents.includes(result.event) && !state.won;
}
async function run() {
  if (!started || running || animating || !queue.length || state.won || repeatDraft || !permitted()) return false;
  if (cursor >= execution.length) rewind();
  running = true; paused = false; render();
  const token = generation;
  if (config.playMode === 'step') {
    await executeOne(); if (token === generation) { running = false; render(); } return true;
  }
  while (running && token === generation && cursor < execution.length && !state.won) { if (!await executeOne()) break; }
  if (token === generation) {
    running = false;
    if (cursor >= execution.length && !state.won && !paused) say('Urutan selesai. Mau menambah atau memperbaiki?');
    render();
  }
  return true;
}
function pause() {
  if (!running && !animating) return false;
  running = false; paused = true; render(); say('Jeda setelah gerakan ini. Kita pikirkan dulu.'); return true;
}
function cancelPending() { generation++; running = false; animating = false; paused = true; scene.cancel(); scene.setState(state); render(); }
function updateAudioStatus() { $('#audio-retry').hidden = !started || audio.getStatus().contextState === 'running'; }
async function step() {
  if (!started || running || animating || !queue.length || state.won || repeatDraft || !permitted()) return false;
  if (cursor >= execution.length) rewind();
  paused = true; await executeOne(); render(); return true;
}
function download(name, value) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function readEditor() {
  try { return validateConfig(JSON.parse($('#config-editor').value)); }
  catch { return { valid: false, errors: ['JSON belum valid. Periksa koma, tanda kutip, dan kurung.'] }; }
}
try {
  scene = new RobotScene($('#scene')); scene.build(currentLevel(), state); $('#boot-message').textContent = '50 papan lokal siap.';
} catch (error) {
  $('#boot-message').textContent = 'Papan 3D belum dapat dimuat. Gunakan Chrome/Edge dengan akselerasi grafis. ' + error.message;
  $('#start-button').disabled = true; throw error;
}
audio.setVolumes(config.musicVolume, config.effectsVolume); audio.setMuted(config.muted);
$('#start-button').addEventListener('click', async () => {
  if (classLocked && !classAuthorized) {
    $('#welcome').close(); $('#teacher-dialog').showModal(); message('Sesi kelas terkunci. Simpan rancangan dan tunggu izin Om Arif.'); return;
  }
  started = true;
  const unlocked = await audio.unlock();
  if (unlocked) audio.startMusic();
  if (audio.context) audio.context.onstatechange = updateAudioStatus;
  updateAudioStatus(); $('#welcome').close(); render();
  say(unlocked ? 'Susun instruksi, lalu coba bersama.' : 'Suara belum tersedia. Gunakan Mulai audio untuk mencoba lagi.');
});
all('[data-command]').forEach(button => button.addEventListener('click', () => {
  const command = button.dataset.command;
  if (repeatDraft) {
    if (repeatDraft.commands.length < 12 && !running && !animating && permitted(true)) {
      repeatDraft.commands.push(command); render(); say(`Isi blok: ${repeatDraft.commands.length} kartu, diulang ${repeatDraft.repeat} kali.`);
    }
  } else enqueue(command);
}));
$('#level-picker').addEventListener('click', () => { selectedGrade = currentLevel().grade; renderLibrary(); $('#level-dialog').showModal(); });
$('#close-levels').addEventListener('click', () => $('#level-dialog').close());
$('#grade-tabs').addEventListener('click', event => {
  const button = event.target.closest('[data-grade]');
  if (button) { selectedGrade = button.dataset.grade; renderLibrary(); }
});
$('#level-grid').addEventListener('click', event => {
  const button = event.target.closest('[data-level]');
  if (button && !button.disabled) selectLevel(Number(button.dataset.level));
});
$('#previous-level').addEventListener('click', () => selectLevel(Math.max(1, state.levelId - 1)));
$('#advance-level').addEventListener('click', () => selectLevel(Math.min(LEVELS.length, state.levelId + 1)));
$('#run-button').addEventListener('click', run);
$('#pause-button').addEventListener('click', pause);
$('#step-button').addEventListener('click', step);
$('#reset-button').addEventListener('click', reset);
$('#clear-button').addEventListener('click', () => {
  if (running || animating || !permitted(true)) return;
  queue = []; execution = []; repeatDraft = null; rewind(); say('Rencana kosong. Ayo susun lagi.');
});
$('#undo-button').addEventListener('click', () => {
  if (running || animating || !permitted(true)) return;
  if (repeatDraft) { repeatDraft.commands.pop(); render(); return; }
  queue.pop(); execution = expandQueue(queue); rewind(); say('Kartu terakhir dihapus. Robot kembali ke awal.');
});
$('#repeat-toggle').addEventListener('click', () => {
  if (!started || running || animating || state.levelId < 31 || !permitted(true)) return;
  repeatDraft = { repeat: 2, commands: [] }; render(); say('Pilih isi blok, lalu Simpan blok.');
});
$('#repeat-count').addEventListener('change', event => { if (repeatDraft) repeatDraft.repeat = Number(event.target.value); render(); });
$('#repeat-save').addEventListener('click', () => {
  if (!repeatDraft || !repeatDraft.commands.length) return;
  const block = clone(repeatDraft);
  if (enqueue(block)) { repeatDraft = null; render(); }
});
$('#repeat-cancel').addEventListener('click', () => { repeatDraft = null; render(); say('Blok dibatalkan. Rencana sebelumnya tetap ada.'); });
$('#mute-button').addEventListener('click', () => { config.muted = !config.muted; audio.setMuted(config.muted); render(); });
$('#teacher-button').addEventListener('click', () => {
  pause(); $('#config-editor').value = JSON.stringify(classLocked && classState.pendingConfig ? classState.pendingConfig : getConfig(), null, 2); $('#teacher-dialog').showModal();
});
$('#close-teacher').addEventListener('click', () => $('#teacher-dialog').close());
for (const [id, field] of [['#music-volume', 'musicVolume'], ['#effects-volume', 'effectsVolume']]) {
  $(id).addEventListener('input', event => { config[field] = Number(event.target.value); audio.setVolumes(config.musicVolume, config.effectsVolume); render(); });
}
$('#play-mode').addEventListener('change', event => { if (!permitted(true)) { render(); return; } config.playMode = event.target.value; render(); });
$('#solution-button').addEventListener('click', () => { const next = getConfig(); next.queue = clone(currentLevel().programSolution || currentLevel().solution); applyConfig(next); });
$('#default-button').addEventListener('click', () => applyConfig(clone(DEFAULT_CONFIG)));
$('#next-level').addEventListener('click', () => selectLevel(state.levelId < LEVELS.length ? state.levelId + 1 : LEVELS.length));
$('#fullscreen-button').addEventListener('click', async () => {
  try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
  catch { message('Gunakan F11 pada Chrome/Edge untuk layar penuh.'); }
});
$('#validate-config').addEventListener('click', () => { const result = readEditor(); message(result.valid ? 'Valid. Belum diterapkan.' : result.errors.join(' ')); });
$('#apply-config').addEventListener('click', () => { const result = readEditor(); if (result.valid) applyConfig(result.config); else message(result.errors.join(' ')); });
$('#export-config').addEventListener('click', () => download('CLASS_CONFIG.json', getConfig()));
$('#import-config').addEventListener('change', async event => {
  const file = event.target.files[0]; if (!file) return;
  if (file.size > 20000) { message('File terlalu besar; maksimum 20 KB.'); return; }
  $('#config-editor').value = await file.text(); const result = readEditor();
  message(result.valid ? 'File valid dimuat sebagai pratinjau; belum diterapkan.' : result.errors.join(' ')); event.target.value = '';
});
$('#class-lock').addEventListener('change', () => {
  const requestedLock = $('#class-lock').checked;
  if (!requestedLock && $('#permission-phrase').value !== phrase) { $('#class-lock').checked = true; message('Keluar dari kunci sesi memerlukan frasa izin Om Arif.'); return; }
  classLocked = requestedLock; classAuthorized = false; repeatDraft = null;
  if (animating || running) cancelPending();
  classState.phase = classLocked ? 'class_draft' : 'preparation'; classState.classExecutionAuthorization.authorized = false;
  saveClass(); render(); message(classLocked ? 'Sesi kelas terkunci. Simpan rencana sebagai rancangan.' : 'Kembali ke mode persiapan.');
});
$('#save-draft').addEventListener('click', () => {
  const result = readEditor(); if (!result.valid) { message(result.errors.join(' ')); return; }
  if (animating || running) cancelPending();
  classState.pendingConfig = clone(result.config); classState.proposalStatus = 'draft_only';
  const prediction = $('#prediction').value.trim(); if (prediction) classState.predictionsWithoutIdentity.push(prediction);
  classState.classExecutionAuthorization.authorized = false; classAuthorized = false;
  saveClass(); render(); message('Rancangan tersimpan di browser ini. Papan tidak berubah dan tidak bermain.');
});
$('#authorize-class').addEventListener('click', () => {
  if ($('#permission-phrase').value !== phrase) { message('Frasa belum cocok. Rancangan belum diterapkan.'); return; }
  if (running || animating) { message('Tunggu gerakan selesai dahulu.'); return; }
  if (!classState.pendingConfig) { message('Simpan rancangan dahulu.'); return; }
  const checked = validateConfig(classState.pendingConfig); if (!checked.valid) { message(checked.errors.join(' ')); return; }
  const visible = readEditor();
  if (!visible.valid || JSON.stringify(visible.config) !== JSON.stringify(checked.config)) { message('Editor berbeda dari rancangan tersimpan. Klik Simpan rancangan dahulu.'); return; }
  classLocked = true; classAuthorized = true; classState.phase = 'class_draft';
  classState.classExecutionAuthorization = { authorized: true, authorizedBy: 'Om Arif', authorizedAt: new Date().toISOString(), requiredSpeaker: 'Om Arif', requiredPhrase: phrase };
  classState.agreedChoices = [clone(checked.config)]; classState.proposalStatus = 'approved';
  setConfiguration(checked.config); saveClass(); $('#permission-phrase').value = '';
  if (!started) { $('#teacher-dialog').close(); if (!$('#welcome').open) $('#welcome').showModal(); }
  render(); message('Rencana disetujui dan diterapkan. Belum berjalan; gunakan Mulai bila diminta, lalu Jalankan.');
});
$('#export-state').addEventListener('click', () => download('CLASS_STATE.json', classState));
$('#audio-retry').addEventListener('click', () => { if (!$('#welcome').open) $('#welcome').showModal(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) { pause(); audio.stopMusic(); } else if (started) audio.startMusic(); });
window.addEventListener('pagehide', () => audio.stopMusic());
window.robotApp = {
  getSnapshot: () => ({ state: { ...state }, queue: clone(queue), cursor, running, animating, paused, started, mode: config.playMode, classLocked, classAuthorized, expandedLength: execution.length, repeatDraft: clone(repeatDraft) }),
  getConfig, applyConfig, reset, enqueue, run, pause, step, audio, scene,
  getClassState: () => clone(classState), getLevels: () => clone(LEVELS)
};
render(); $('#config-editor').value = JSON.stringify(classLocked && classState.pendingConfig ? classState.pendingConfig : getConfig(), null, 2);
if (!$('#welcome').open) $('#welcome').showModal();
