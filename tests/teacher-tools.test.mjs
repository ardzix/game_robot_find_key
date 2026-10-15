import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { LEVELS } from '../levels.js';
import { DEFAULT_CONFIG } from '../engine.js';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const output = path.join(root, 'test-results');
const baseURL = process.env.GAME_URL || 'http://127.0.0.1:4186';
const playwrightPath = process.env.PLAYWRIGHT_PATH || 'C:/Users/ardzi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const executablePath = process.env.BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const { chromium } = await import(pathToFileURL(playwrightPath).href);
const browser = await chromium.launch({ executablePath, headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--enable-unsafe-swiftshader'] });
const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, acceptDownloads: true, serviceWorkers: 'block' });
const page = await context.newPage();
const checks = [], errors = [], externalRequests = [];
await context.route('**/*', route => {
  const request = route.request();
  const url = new URL(request.url());
  if (!['127.0.0.1', 'localhost'].includes(url.hostname)) {
    externalRequests.push(url.href);
    return route.abort('internetdisconnected');
  }
  return route.continue();
});
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });

const snapshot = () => page.evaluate(() => window.robotApp.getSnapshot());
const getConfig = () => page.evaluate(() => window.robotApp.getConfig());
const stateAtStart = level => ({ levelId: level.id, ...level.start, hasKey: false, won: false });
const settled = () => page.waitForFunction(() => !window.robotApp.getSnapshot().running && !window.robotApp.getSnapshot().animating, null, { timeout: 30000 });
const teacher = async () => {
  if (!(await page.locator('#teacher-dialog').isVisible())) await page.locator('#teacher-button').click();
};
const editor = async () => {
  await teacher();
  if (!(await page.locator('#config-editor').isVisible())) await page.getByText('Konfigurasi lokal (JSON)', { exact: true }).click();
};
const closeTeacher = async () => {
  if (await page.locator('#teacher-dialog').isVisible()) await page.locator('#close-teacher').click();
};
const makeConfig = (changes = {}) => {
  const value = { ...JSON.parse(JSON.stringify(DEFAULT_CONFIG)), ...changes };
  delete value.initialState;
  return value;
};
const applyWithUI = async config => {
  await editor();
  await page.locator('#config-editor').fill(JSON.stringify(config));
  await page.locator('#apply-config').click();
  await page.waitForFunction(() => document.querySelector('#config-message').textContent.includes('Konfigurasi valid diterapkan'));
};
const readDownload = async selector => {
  const waiting = page.waitForEvent('download');
  await page.locator(selector).click();
  const download = await waiting;
  assert.equal(await download.failure(), null);
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  const content = Buffer.concat(chunks).toString('utf8');
  return { filename: download.suggestedFilename(), json: JSON.parse(content), bytes: Buffer.byteLength(content) };
};
const check = async (name, run) => {
  try {
    const detail = await run();
    checks.push({ name, passed: true, ...(detail === undefined ? {} : { detail }) });
    console.log(`PASS ${name}`);
  } catch (error) {
    checks.push({ name, passed: false, error: error.message });
    console.error(`FAIL ${name}: ${error.message}`);
    throw error;
  }
};

let fatal;
try {
  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.robotApp);
  await page.locator('#start-button').click();
  await page.waitForFunction(() => window.robotApp.getSnapshot().started);

  await check('Muat contoh rute loads current level solution without executing it', async () => {
    await teacher();
    await page.locator('#solution-button').click();
    const after = await snapshot();
    const level = LEVELS.find(candidate => candidate.id === after.state.levelId);
    assert.deepEqual(after.queue, level.programSolution || level.solution);
    assert.deepEqual(after.state, stateAtStart(level));
    assert.equal(after.cursor, 0);
    assert.equal(after.running, false);
    assert.equal(after.animating, false);
    return { levelId: level.id, instructionCount: after.queue.length };
  });

  await check('Hapus terakhir removes one instruction and rewinds an already stepped board', async () => {
    const level = LEVELS[0];
    await applyWithUI(makeConfig({ levelId: level.id, queue: ['right', 'left', 'right'] }));
    await closeTeacher();
    await page.locator('#step-button').click();
    await settled();
    assert.equal((await snapshot()).cursor, 1);
    assert.notEqual((await snapshot()).state.dir, level.start.dir);
    await page.locator('#undo-button').click();
    const after = await snapshot();
    assert.deepEqual(after.queue, ['right', 'left']);
    assert.deepEqual(after.state, stateAtStart(level));
    assert.equal(after.cursor, 0);
    assert.equal(after.running, false);
  });

  await check('play-mode selector makes Jalankan step once and sequence mode resumes remaining commands', async () => {
    await applyWithUI(makeConfig({ queue: ['right', 'left', 'right'] }));
    await page.locator('#play-mode').selectOption('step');
    assert.equal((await getConfig()).playMode, 'step');
    await closeTeacher();
    assert.match(await page.locator('#run-button').innerText(), /1 langkah/);
    await page.locator('#run-button').click();
    await settled();
    assert.equal((await snapshot()).cursor, 1);
    await page.waitForTimeout(200);
    assert.equal((await snapshot()).cursor, 1);
    await teacher();
    await page.locator('#play-mode').selectOption('sequence');
    await closeTeacher();
    await page.locator('#run-button').click();
    await settled();
    assert.equal((await snapshot()).cursor, 3);
    assert.equal((await snapshot()).mode, 'sequence');
  });

  await check('Pulihkan default restores default level, queue, mode and independent audio settings', async () => {
    await applyWithUI(makeConfig({ levelId: LEVELS[LEVELS.length - 1].id, queue: ['left', 'right'],
      playMode: 'step', musicVolume: .7, effectsVolume: .15, muted: true }));
    await page.locator('#default-button').click();
    const config = await getConfig();
    assert.deepEqual(config, JSON.parse(JSON.stringify(DEFAULT_CONFIG)));
    const after = await snapshot();
    const level = LEVELS.find(candidate => candidate.id === DEFAULT_CONFIG.levelId);
    assert.deepEqual(after.state, stateAtStart(level));
    assert.equal(after.cursor, 0);
    assert.equal(after.running, false);
    const audio = await page.evaluate(() => window.robotApp.audio.getStatus());
    assert.equal(audio.musicVolume, DEFAULT_CONFIG.musicVolume);
    assert.equal(audio.effectsVolume, DEFAULT_CONFIG.effectsVolume);
    assert.equal(audio.muted, DEFAULT_CONFIG.muted);
  });

  const imported = makeConfig({ levelId: LEVELS[Math.min(1, LEVELS.length - 1)].id,
    queue: ['left', 'right'], playMode: 'step', musicVolume: .35, effectsVolume: .65, muted: true });

  await check('valid configuration file imports as preview; Validasi does not apply; Terapkan applies once without running', async () => {
    await editor();
    const before = await snapshot();
    const beforeConfig = await getConfig();
    await page.locator('#import-config').setInputFiles({ name: 'qa-valid-config.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(imported)) });
    await page.waitForFunction(() => document.querySelector('#config-message').textContent.includes('File valid dimuat'));
    assert.deepEqual(JSON.parse(await page.locator('#config-editor').inputValue()), imported);
    assert.deepEqual(await snapshot(), before);
    assert.deepEqual(await getConfig(), beforeConfig);
    await page.locator('#validate-config').click();
    assert.match(await page.locator('#config-message').innerText(), /Valid.*Belum diterapkan/);
    assert.deepEqual(await snapshot(), before);
    await page.locator('#apply-config').click();
    const after = await snapshot();
    assert.deepEqual(after.queue, imported.queue);
    assert.deepEqual(after.state, stateAtStart(LEVELS.find(level => level.id === imported.levelId)));
    assert.equal(after.mode, 'step');
    assert.equal(after.cursor, 0);
    assert.equal(after.running, false);
    assert.equal(after.animating, false);
    assert.equal((await getConfig()).musicVolume, imported.musicVolume);
    assert.equal((await getConfig()).effectsVolume, imported.effectsVolume);
    assert.equal((await getConfig()).muted, true);
  });

  await check('malformed JSON and unknown-command imports cannot mutate live configuration', async () => {
    const before = await snapshot();
    const beforeConfig = await getConfig();
    const failures = [
      { name: 'broken.json', text: '{"version":1,', expected: /JSON belum valid/ },
      { name: 'unknown-command.json', text: JSON.stringify({ ...imported, queue: ['teleport'] }), expected: /tidak didukung|tidak dikenal|Instruksi/ },
    ];
    for (const failure of failures) {
      await page.locator('#import-config').setInputFiles({ name: failure.name, mimeType: 'application/json', buffer: Buffer.from(failure.text) });
      await page.waitForFunction(text => document.querySelector('#config-editor').value === text, failure.text);
      assert.match(await page.locator('#config-message').innerText(), failure.expected);
      await page.locator('#apply-config').click();
      assert.deepEqual(await snapshot(), before);
      assert.deepEqual(await getConfig(), beforeConfig);
    }
  });

  await check('oversized import is rejected before replacing preview or applying any state', async () => {
    await page.locator('#config-editor').fill(JSON.stringify(imported));
    const beforeText = await page.locator('#config-editor').inputValue();
    const before = await snapshot();
    const beforeConfig = await getConfig();
    const oversized = Buffer.from(JSON.stringify(imported) + ' '.repeat(20001));
    await page.locator('#import-config').setInputFiles({ name: 'too-large.json', mimeType: 'application/json', buffer: oversized });
    await page.waitForFunction(() => document.querySelector('#config-message').textContent.includes('File terlalu besar'));
    assert.equal(await page.locator('#config-editor').inputValue(), beforeText);
    assert.deepEqual(await snapshot(), before);
    assert.deepEqual(await getConfig(), beforeConfig);
    return { rejectedBytes: oversized.length, reportedLimitBytes: 20000 };
  });

  await check('Simpan konfigurasi downloads actual current JSON, not unapplied editor text', async () => {
    const expected = await getConfig();
    await page.locator('#config-editor').fill(JSON.stringify({ ...imported, queue: ['right', 'right', 'right'] }));
    const exported = await readDownload('#export-config');
    assert.equal(exported.filename, 'CLASS_CONFIG.json');
    assert.deepEqual(exported.json, expected);
    return { filename: exported.filename, bytes: exported.bytes };
  });

  await check('Simpan CLASS_STATE downloads saved draft and anonymous prediction without applying or authorizing', async () => {
    await page.locator('#config-editor').fill(JSON.stringify(imported));
    if (!(await page.locator('#prediction').isVisible())) await page.getByText('Rancangan sesi kelas', { exact: true }).click();
    const before = await snapshot();
    await page.locator('#prediction').fill('Uji persiapan: setelah putar kanan robot akan menghadap sisi berikutnya.');
    await page.locator('#save-draft').click();
    assert.deepEqual(await snapshot(), before);
    const expected = await page.evaluate(() => window.robotApp.getClassState());
    assert.equal(expected.pendingConfig.levelId, imported.levelId);
    assert.deepEqual(expected.pendingConfig.queue, imported.queue);
    assert.equal(expected.proposalStatus, 'draft_only');
    assert.equal(expected.classExecutionAuthorization.authorized, false);
    assert.equal(expected.predictionsWithoutIdentity.length, 1);
    const exported = await readDownload('#export-state');
    assert.equal(exported.filename, 'CLASS_STATE.json');
    assert.deepEqual(exported.json, expected);
    return { filename: exported.filename, bytes: exported.bytes, proposalStatus: exported.json.proposalStatus };
  });

  await check('upper-grade example loads real repeat blocks and survives configuration export/import unchanged', async () => {
    const level = LEVELS.find(candidate => candidate.programSolution?.some(entry => typeof entry === 'object'));
    assert.ok(level, 'An upper-grade level must supply a real repeat-block programSolution.');
    await applyWithUI(makeConfig({ levelId: level.id, queue: [] }));
    await page.locator('#solution-button').click();
    const example = await snapshot();
    assert.deepEqual(example.queue, level.programSolution);
    assert.ok(example.queue.some(entry => typeof entry === 'object'));
    assert.equal(example.expandedLength, level.solution.length);
    assert.deepEqual(example.state, stateAtStart(level));
    assert.equal(example.running, false);
    assert.equal(example.cursor, 0);
    const exported = await readDownload('#export-config');
    assert.deepEqual(exported.json.queue, level.programSolution);
    await page.locator('#default-button').click();
    const beforeImport = await snapshot();
    await page.locator('#import-config').setInputFiles({ name: 'qa-repeat-roundtrip.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(exported.json)) });
    await page.waitForFunction(() => document.querySelector('#config-message').textContent.includes('File valid dimuat'));
    assert.deepEqual(await snapshot(), beforeImport);
    await page.locator('#apply-config').click();
    assert.deepEqual(await getConfig(), exported.json);
    const afterImport = await snapshot();
    assert.deepEqual(afterImport.queue, level.programSolution);
    assert.equal(afterImport.expandedLength, level.solution.length);
    assert.equal(afterImport.running, false);
    assert.equal(afterImport.cursor, 0);
    return { levelId: level.id, cards: level.programSolution.length, expandedActions: level.solution.length,
      repeatBlocks: level.programSolution.filter(entry => typeof entry === 'object').length };
  });

  await check('Layar penuh attempts the real browser Fullscreen API and can exit or gives F11 fallback', async () => {
    await page.locator('#fullscreen-button').click();
    await page.waitForTimeout(250);
    const entered = await page.evaluate(() => Boolean(document.fullscreenElement));
    if (entered) {
      await page.locator('#fullscreen-button').click();
      await page.waitForFunction(() => !document.fullscreenElement);
      return { entered: true, exited: true, physicalTVVerified: false };
    }
    assert.match(await page.locator('#config-message').innerText(), /F11/);
    return { entered: false, supportedFallbackDisplayed: true, physicalTVVerified: false };
  });

  await check('teacher tools make no external requests and cause no browser errors', async () => {
    assert.deepEqual(externalRequests, []);
    assert.deepEqual(errors, []);
  });
} catch (error) {
  fatal = error;
} finally {
  await mkdir(output, { recursive: true });
  await writeFile(path.join(output, 'teacher-tools-report.json'), JSON.stringify({
    testedAt: new Date().toISOString(), browser: await browser.version(), executablePath,
    baseURL, headless: true, levelCountAtTest: LEVELS.length, checks, browserErrors: errors, externalRequests,
    downloadVerification: 'Real browser download events and JSON streams; no persistent external destination or upload.',
    limitations: ['Headless Chrome with software WebGL; physical TV, projector and fullscreen hardware not tested.'],
  }, null, 2) + '\n');
  await context.close();
  await browser.close();
}
if (fatal) { console.error(fatal); process.exitCode = 1; }
